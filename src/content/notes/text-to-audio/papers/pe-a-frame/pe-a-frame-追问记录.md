---
title: "PE-A-Frame 追问记录"
slug: "text-to-audio/papers/pe-a-frame/pe-a-frame-追问记录"
description: "环境： D: 搞学术 大二暑 TTA xacle .venv_peaf ，权重 D: 搞学术 大二暑 TTA xacle baseline _mine peaf_weights pe a frame small （ model.safetensors 1.76 GB）。"
publishDate: "2026-10-23"
createdAt: "2026-10-23T00:00:00Z"
tags: ["文献","QNA","PE-A-Frame","SED","text-to-audio"]
series: ["Text-to-Audio","Papers","PE-A-Frame"]
---

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**总览**
> 一、输入经过 PE-A-Frame 各层，形状怎么变？举一个具体例子。

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**主笔记：[PE-A-Frame](/notes/text-to-audio/papers/pe-a-frame/pushing-the-frontier-of-audiovisual-perception-with-large-scale-multimodal-correspondence-learning/)**

# 一、输入经过 PE-A-Frame 各层，形状怎么变？举一个具体例子。

环境：`D:\搞学术\大二暑\TTA\xacle\.venv_peaf`，权重 `D:\搞学术\大二暑\TTA\xacle\baseline\_mine\peaf_weights\pe-a-frame-small`（`model.safetensors` 1.76 GB）。

设置：`B=1`，10 s 单声道 48 kHz，文本 `"a dog barking"` → $L_t=6$。下表数值均为实测打印，非推算。

## 1. DAC-VAE 先把波形压到 25 Hz

$$
\frac{480000}{2\times 8\times 10\times 12}=\frac{480000}{1920}=250
$$

| 层 | 配置 | 输出形状 |
|---|---|---|
| 输入 | — | `(1, 480000)` |
| `input_values` | 预处理后加 1 维声道 | `(1, 1, 480000)` |
| `conv1` | Conv1d(1→64, k=7, pad=3) | `(1, 64, 480000)` |
| `block1` | stride 2，通道翻倍 | `(1, 128, 240000)` |
| `block2` | stride 8 | `(1, 256, 30000)` |
| `block3` | stride 10 | `(1, 512, 3000)` |
| `block4` | stride 12 | `(1, 1024, 250)` |
| `snake1` + `conv2` | Conv1d(1024→1024, k=3) | `(1, 1024, 250)` |
| `bottleneck` | Conv1d(1024→128, k=1) | `(1, 128, 250)` |
| `transpose(1,2)` + `data_proj` | Linear(128→768) | `(1, 250, 768)` |

- 时间维 250 帧 = **25 Hz**，即 $L_a$；特征维从 128 抬到 768，进音频塔。

## 2. 前置 CLS + 12 层 Transformer

| 层 | 配置 | 输出形状 |
|---|---|---|
| `patch_embedder` | concat CLS 到 seq 维首位 | `(1, 251, 768)` |
| ResNet block | Conv1d k=3, padding=same | `(1, 251, 768)` |
| `layers[0]` … `layers[11]` | 12 层，6 头 × head_dim 128，RoPE θ=20000 | `(1, 251, 768)` |
| `norm` + `output` | RMSNorm + Linear(768→768) | `(1, 251, 768)` |
| `last_hidden_state` | `hidden_states[:, 1:]` 去掉 CLS | `(1, 250, 768)` |
| `pooler_output` | `hidden_states[:, 0]` | `(1, 768)` |

- ResNet block 的 `Conv1d(padding="same")` 不改时间长度，所以 250→251→250 的 +1/−1 全部来自 CLS 的加与删。
- $\text{head\_dim}\times\text{heads}=128\times6=768$，与 `hidden_size` 一致，所以层内不改变最后一维。

## 3. 音频头把 768 投到 1024

$$
e_a^{l}=\mathrm{Linear}\big(\mathrm{LayerNorm}(h_l)\big)\in\mathbb{R}^{1024}
$$

| 层 | 配置 | 输出形状 |
|---|---|---|
| `audio_head` | LayerNorm(768) + Linear(768→1024, 无 bias) | `(1, 250, 1024)` |

- 注意这里吃的是 `last_hidden_state`（250 帧全留），**不是** `pooler_output`——这一行就是 `PeAudioFrameLevelModel` 与 `PeAudioModel` 的差别所在。

## 4. 文本塔与联合空间

| 层 | 配置 | 输出形状 |
|---|---|---|
| `text_model` | ModernBERT，取 `hidden_states[-1][:, 0]` | `(1, 1024)` |
| `text_audio_head` | LayerNorm(1024) + Linear(1024→1024) | `(1, 1024)` |

## 5. 逐帧 logits

$$
\underbrace{(B,L_a,C)}_{\text{audio}}\times\underbrace{(C,B)}_{\text{text}^\top}\ \xrightarrow{\ \text{transpose}(1,2)\ }\ (B,B,L_a)
$$

| 步骤 | 表达式 | 形状 |
|---|---|---|
| 音频 × 文本 | `audio_embeds @ text_audio_embeds.T` | `(1, 250, 1)` |
| 转置 | `.transpose(1, 2)` | `(1, 1, 250)` |
| 缩放 + 偏置 | `* logit_scale + logit_bias` | `(1, 1, 250)` |

- 实测 `logit_scale = 2.2983`、`logit_bias = -10.0023`，两者都是**可学习标量**（`nn.Parameter(torch.zeros(1))` 初始化），不是论文里那两个 $\alpha,\beta$ 的常数。
- `B=1` 时后两维退化，只有 `B>1` 才显出 $(B,B,L_a)$ 的三维结构——这就是论文里 local-activity $(B,L)$ 与 global-activity $(B,L,B)$ 的实现来源：**同一个矩阵乘，转置后即得**。

## 6. 两个实际踩到的坑

- `AutoModel.from_pretrained` 这类权重返回的是 **`PeAudioModel`**（话语级），不是 `PeAudioFrameLevelModel`。必须显式 `from transformers import PeAudioFrameLevelModel` 再 `PeAudioFrameLevelModel.from_pretrained(...)`，否则拿到的是 $(B,1024)$ 而不是 $(B,L_a,1024)$。
- 预处理器的 `audio=` 参数要传 **list of 1-D ndarray**（`[wave]`）；直接传 `(B, L)` 的 tensor 会报 `Expected input shape (channels, length)`。

