---
title: "Pushing the Frontier of Audiovisual Perception with Large-Scale Multimodal Correspondence Learning"
slug: "text-to-audio/papers/pe-a-frame/pushing-the-frontier-of-audiovisual-perception-with-large-scale-multimodal-correspondence-learning"
description: "PE A Frame 帧级音频 文本对齐全流程"
publishDate: "2026-10-23"
createdAt: "2026-10-23T00:00:00Z"
updatedDate: "2026-10-23T11:32:35"
tags: ["文献","PE-A-Frame","PE-AV","跨模态对齐","SED","Batch-A","text-to-audio"]
series: ["Text-to-Audio","Papers","PE-A-Frame"]
---

# PE-AV 系列：大规模多模态对应学习

![PE-A-Frame 帧级音频-文本对齐全流程](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/c1754a07c4690a1151d4cba4f33e9c2d.png)



> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**摘要**
> PE-AV 是从 PE（视觉编码器）扩展出的音视频文本编码器家族，用 10 对 sigmoid 对比把音-文-视对齐到同一 1024 维空间，数据侧靠音视频数据引擎为 O(100M) 对合成字幕。**本文的 PE-A-Frame** 在此之上再加一层帧级对比，把话语级表征拆成 25 Hz 的帧级音频-文本对齐，用于开集与闭集声音事件检测（SED），在所有基准上取得最佳 PSDS1T。
>
> **在计划中的位置**：AudioLDM 前置知识覆盖计划（大二上） §3 Batch A 的可选篇（`facebook/pe-a-frame-small`，白名单内）；与 [CLAP](/notes/text-to-audio/papers/clap/)、[BEATs](/notes/text-to-audio/papers/beats/beats-audio-pre-training-with-acoustic-tokenizers/)、M2D-CLAP 同属音频-语言对齐这一族，区别是它对齐到**帧**。

---

## 一、PE-AV 主干

### 1. 三模态特征提取

$$
x_a = \mathrm{DAC\text{-}VAE}(x_a)\in\mathbb{R}^{L_a\times C_a},\quad
x_v = \mathrm{PE\text{-}L}(x_v)\in\mathbb{R}^{L_v\times C_v},\quad
x_t = \mathrm{ModernBERT}(x_t)\in\mathbb{R}^{L_t\times C_t}
$$

- $C_a=128$、$C_v=1024$、$C_t=1024$；30 秒片段按 25 Hz 音频与 30 FPS 视频计，$L_a=750$、$L_v=900$。
- 文本取 ModernBERT 的 `[CLS]`，且用第 22 层而非最后一层。

### 2. 音频塔、视频塔与融合塔

$$
e_a = T_a(\mathrm{Proj}(x_a)),\qquad e_v = T_v(\mathrm{Proj}(x_v))
$$

$$
\tilde{e}_v = \mathrm{NearestNeighbor}(e_a,e_v),\qquad
e_{av} = T_{av}\big(\mathrm{Proj}(\mathrm{ChannelConcat}(e_a,\tilde{e}_v))\big)
$$

- $T_a$ 为 $N$ 层、隐藏维 $64N$、带 RoPE；$T_v$ 与 $T_{av}$ 共享配置只是更浅。
- 视频按**最近邻插值**对齐到音频时间轴，再沿通道拼接。

### 3. 十个对比对

$$
\mathcal{L}_{h_a,h_v} = -\frac{1}{B}\sum_{b=1}^{B}\sum_{b'=1}^{B}
\log\sigma\!\left(z_{bb'}-\alpha_{av}\,h_a^b\cdot h_v^{b'}+\beta_{av}\right)
$$

- $z_{bb'}=+1$ 当 $b=b'$，否则 $-1$；$\alpha_{av}$、$\beta_{av}$ 是该模态对的学习式温度与偏置。
- 预训练 8 对（A/V/AV 与 A/V/AV-caption 的组合），微调再加 2 对联合嵌入（A+VT→V、V+AT→A），共 10 对。

### 4. 文本条件检索的联合嵌入

$$
h_{vt} = \mathrm{Proj}\big(\mathrm{ChannelConcat}(c_v,c_t)\big),\qquad
h_{at} = \mathrm{Proj}\big(\mathrm{ChannelConcat}(c_a,c_t)\big)
$$

- 让「视频 + 描述情绪的文字」去检索音乐（V+T→A）这类查询成为可能。

  ---

## 二、PE-A-Frame：帧级对齐

### 5. 帧级 logit

$$
\tilde{h}_{l} = e_l^a \cdot h^t
$$

- $e_l^a$ 是第 $l$ 帧的音频嵌入，$h^t$ 是**整段**文本的全局嵌入；PE-AV 只算 `[CLS]` 一个点，这里把文本向量摊到每一帧上去比。

### 6. 本体感知的帧级标签

$$
z_{b,l,b'} =
\begin{cases}
+1, & \exists k\ \text{s.t.}\ x^t_{b'}\in \mathrm{Ont}(x^t_{b,k})\ \text{且}\ m_{b,l,k}=1,\\
-1, & \text{otherwise}
\end{cases}
$$

- $m_b\in\{0,1\}^{L_a\times K_b}$ 是全部标注事件的活动掩码；$\mathrm{Ont}(\cdot)$ 给本体变体（"speech" 含 "female speech"，"dog" 含 "barking"）。
- 每条音频实际只采**一个**文本查询，但监督用上全部标注事件及其本体扩展。

### 7. 局部活动与全局活动两种 logit

$$
\tilde{h}_{b,l,b'} =
\begin{cases}
e_l^a(x_b)\cdot h^t(x_b), & \text{local-activity},\\
e_l^a(x_b)\cdot h^t(x_{b'}), & \forall\,b'\in 1,\dots,B\ \ (\text{global-activity})
\end{cases}
$$

- 局部形状 $(B,L)$ 负责「何时」，全局形状 $(B,L,B)$ 负责「何物」；最终再仿射缩放 $h=\alpha\tilde{h}+\beta$。

### 8. 帧级 SigLIP 损失

$$
\mathcal{L} = -\frac{1}{BL}\sum_{b,l}\log\sigma\!\left(z_{b,l}\left(\alpha\tilde{h}_{b,l}+\beta\right)\right)
$$

- 全局活动版本在 $\tilde{h}_{b,l,b'}$ 上算并对 $b'$ 取平均。
- 每次迭代按概率 $p_{\text{local}}$ 随机二选一；$p_{\text{local}}=0.7$ 是消融给出的默认值。

  ---

## 三、验收

- [ ] 讲清 PE-A-Frame 相对 PE-AV 只多做了什么：把 `[CLS]` 级对比换成 25 Hz 帧级对比
- [ ] 讲清 local-activity 与 global-activity 两个损失分别管「何时」和「何物」
- [ ] 讲清 $p_{\text{local}}$ 的权衡：调高提升 PSDS1T（边界准），但压低 PSDS1A（假阳变多）
- [ ] 讲清为什么 SED 里「帧率」是关键：对比 FLAM 的 3.2 Hz 与 PE-A-Frame 的 25 Hz
- [ ] 说清它和 [CLAP](/notes/text-to-audio/papers/clap/) 的根本差别（提示：粒度不是损失家族）

