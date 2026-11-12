---
title: "BEATs 追问记录"
slug: "text-to-audio/papers/beats/beats-追问记录"
description: "下面按 BEATs 下游推理任务 给出形状；同时区分 tokenizer 推理和 MAM 预测。"
publishDate: "2026-10-21"
createdAt: "2026-10-21T00:00:00Z"
updatedDate: "2026-10-21T21:48:26"
tags: ["文献","QNA","BEATs","自监督预训练","音频编码器","text-to-audio"]
series: ["Text-to-Audio","Papers","BEATs"]
---

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**总览**
> 一、给出推理任务的输入输出形状
> 二、输出 $B \times C$，也就是对于单个音频而言是一个长为 $C$ 的一维向量，每个 $C$ 对应一个自监督学习的无标签类别。
> 三、对于一个冻结的 BEATs，我能不能只使用部分前向过程，如直接将 ViT 输出表示作为输出并进入其他子模块处理？

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**主笔记：[BEATs](/notes/text-to-audio/papers/beats/beats-audio-pre-training-with-acoustic-tokenizers/)**

# 一、给出推理任务的输入输出形状

下面按 **BEATs 下游推理任务** 给出形状；同时区分 tokenizer 推理和 MAM 预测。

## 1. 下游分类推理（微调后 BEATs）

设：
- $B$：batch size
- 音频时长 $L$ 秒
- Mel 特征：128 维，10 ms 帧移 → 时间帧数 $F \approx 100 L$
- patch：$16\times 16$
- 频率 patch 数：$128/16=8$
- 时间 patch 数：$\lceil F/16\rceil$
- 因此 patch 序列长度 $T \approx 8 \times \lceil 100 L/16\rceil$
- 每个 patch 展平维度：$16\times 16=256$
- ViT hidden dim：768
- 类别数：$C$

### 输入形状
原始波形：

$$
B \times (16000 L)
$$

Mel-filter bank 特征：

$$
B \times 128 \times F
$$

切成 patch 后送入 ViT 的序列：

$$
B \times T \times 256
$$

其中每个 patch 经线性层投影为：

$$
B \times T \times 768
$$

推理时**不做 75% mask**，喂完整 patch 序列。

### 输出形状
ViT 输出表示：

$$
B \times T \times 768
$$

MeanPool 后：

$$
B \times 768
$$

线性分类器 $W_c\in\mathbb{R}^{768\times C}$ 后 logits：

$$
B \times C
$$

Softmax / BCE 后类别概率：

$$
B \times C
$$

所以最终模型输出是 **$B\times C$ 的概率矩阵**，不是单个标量。

- 单标签分类：再 `argmax` → $B$ 个类别 ID（标量序列）
- 多标签分类：阈值化 → $B\times C$ 的 0/1 矩阵

  常见 $C$：
- AudioSet：$C=527$（多标签）
- ESC-50：$C=50$（单标签）
- KS 1：$C=12$
- KS 2：$C=35$
- IEMOCAP ER：$C=4$

  例如 AudioSet 10 秒音频：

  $$
  F\approx 1000,\quad T\approx 8\times 63=504
  $$

  输入约：

  $$
  B\times 504\times 256
  $$

  输出：

  $$
  B\times 527
  $$

  ---

## 2. Acoustic Tokenizer 推理

输入 patch 序列：

$$
B\times T\times 256
$$

输出每个 patch 的离散标签索引：

$$
B\times T
$$

若写成 one-hot / 概率分布：

$$
B\times T\times K
$$

其中 codebook 大小 $K=1024$。

---

## 3. 预训练 MAM 预测

输入未 mask 的 patch：

$$
B\times T_U\times 256
$$

输出被 mask 位置的离散标签概率分布：

$$
B\times T_M\times K
$$

其中 $T_M=0.75 T$，$K=1024$。

---

**总结：下游推理输入通常是 $B\times T\times 256$ 的 patch 序列，输出是 $B\times C$ 的类别概率；只有取 argmax 或阈值后才得到类别 ID。**

# 二、输出 $B \times C$，也就是对于单个音频而言是一个长为 $C$ 的一维向量，每个 $C$ 对应一个自监督学习的无标签类别。

不对，这里容易混淆两个“类别”：

**下游推理输出的 $B\times C$ 中，$C$ 是下游任务的类别数，不是自监督学习的无标签类别。**

具体区分：

1. **下游分类推理**
   - 单个音频输出一个长度为 $C$ 的向量：

     $$
     p\in\mathbb{R}^C
     $$

   - 这个 $C$ 对应的是**有监督下游任务的标签类别**，例如：
     - AudioSet：$C=527$ 个音频事件类别
     - ESC-50：$C=50$ 个环境声音类别
     - KS 2：$C=35$ 个关键词类别
   - 它不是自监督 tokenizer 的无标签 codebook 类别。

2. **自监督的无标签离散类别**
   - 在 acoustic tokenizer 中，codebook 大小是：

     $$
     K=1024
     $$

   - 这是 **patch 级**离散标签，不是单个音频级标签。
   - 预训练 MAM 预测输出形状是：

     $$
     B\times T_M\times K
     $$

   - 即每个被 mask 的 patch 在 1024 个离散 token 上的分布。

3. **单个音频级**
   - 下游分类：一个音频 → $C$ 维任务类别概率向量。
   - 预训练：一个音频 → 多个 patch 的离散 token 预测，不是单个 $C$ 维无标签类别向量。

     所以更准确地说：

> **$B\times C$ 是下游任务分类输出；单个音频是长为 $C$ 的任务类别概率向量。自监督的无标签类别是 tokenizer 的 $K=1024$ 个 patch 级离散 token，不是这个 $C$。**

# 三、对于一个冻结的 BEATs，我能不能只使用部分前向过程，如直接将 ViT 输出表示作为输出并进入其他子模块处理？

完全可以。这正是将 BEATs 作为**冻结特征提取器**的标准做法，在 XACLE 的相关实践中也已被直接采用。

### 1、关键前提：丢弃“预测头”

要实现你的设想，首先需要明确：BEATs 完整的模型包含 **ViT Encoder** 和用于预训练的** Label Predictor**（预测头）。当你把 BEATs 作为特征提取器时，**应该丢弃（或跳过）Label Predictor**，只使用 ViT Encoder 部分的前向过程。

有专利文档明确描述了这一操作：加载官方权重时“**移除原始预测头参数，仅保留编码器部分**”，并且所有编码器参数都被冻结，仅在前向传播中执行一次，不参与梯度更新。

### 2、ViT 输出表示的形状与变体

标准 ViT Encoder 的最后一层输出是一个**上下文表示序列** $R = \{\mathbf{r}_t\}_{t=1}^{T}$，其中每个 $\mathbf{r}_t \in \mathbb{R}^{768}$。

以 XACLE 任务中常用的 **10 秒音频**为例，标准输出形状为：

$$
[B, T, 768]
$$

这里的 $T$ 是 patch 序列长度，在具体实现中通常为 **500** 左右。XACLE-TMU 系统就直接使用冻结 BEATs 编码器，将 10 秒波形转换为形状为 ** `[B, 500, 768]` ** 的 token 嵌入序列。

除了标准的最后一层输出，你还可以根据下游模块的需要，选择两种变体：

1.  **全局向量输出**：如果你只需要一个音频级的表示，可以对 `[B, T, 768]` 在序列维度 $T$ 上做**平均池化（Mean Pooling）**，得到形状为 ** `[B, 768]` ** 的全局特征向量。一个专利实施例就是将该 768 维向量直接送入 LightGBM 分类器。
2.  **多层隐藏状态输出**：某些实现（如 SpeechBrain）支持 `output_all_hiddens=True` 选项，此时会输出所有 Transformer 层的隐藏状态，形状为 ** `(层数+1, B, T, 768)` **。例如 BEATs_iter 3 有 12 层，则输出形状为 `(13, B, T, 768)`。这为你提供了在多个抽象层级上利用音频特征的灵活性。

### 3、下游接入的常见方式

拿到 ViT 输出后，接入其他子模块的方式非常灵活，在 XACLE 任务中已有成熟范例：

*   **直接送入轻量分类器/回归器**：如上文所述，将 `[B, 768]` 的全局向量送入传统的机器学习模型（如 LightGBM）或简单的线性层。
*   **经过投影网络后送入大语言模型**：XACLE-TMU 的完整流程是：`[B, 500, 768]` 的 BEATs 输出 → **时序平均池化**降采样到 `[B, 100, 768]` → 通过一个 **3 层 SwiGLU MLP** 投影到 LLM 的输入维度 → 与文本 token 一起送入 Qwen 2.5-0.5 B 语言模型。其数据流可以概括为：** `[B,500,768]` → SwiGLU MLP → `[B,100,896]` → LLM → Score Head → Alignment Score**。

### 4、总结

你的设想完全可行且是标准实践。核心操作是：**加载 BEATs 权重，丢弃 Label Predictor，冻结 ViT Encoder 的参数，然后将其输出的 `[B, T, 768]` 序列（或池化后的 `[B, 768]` 向量）作为特征，馈入你自定义的下游模块。**

---

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**注意**
> 回答为网页版 Deepseek（API 说话太唐了），说的有可能对。

