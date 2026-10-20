---
title: "CLAP: Learning Audio Concepts From Natural Language Supervision"
slug: "text-to-audio/papers/clap"
description: "X_a in mathbb{R}^{F times T} 是 log Mel 谱（ F 64 个梅尔带、 T 个时间帧）； hat{X}_a in mathbb{R}^{N times V} 、 hat{X}_t in mathbb{R}^{N times U} 为 batch …"
publishDate: "2026-10-20"
createdAt: "2026-10-20T00:00:00Z"
updatedDate: "2026-10-20T17:27:37"
tags: ["文献","CLAP","跨模态对齐","contrastive-learning","L4","text-to-audio"]
series: ["Text-to-Audio","Papers","CLAP"]
---

# CLAP：用自然语言监督学音频概念

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**摘要**
> 双塔结构（CNN14 音频编码器 + BERT 文本编码器）各自经线性投影落到 1024 维联合空间，用对称 InfoNCE 在 batch 内的「音频—文本对」上做对比学习。仅用 128k 对训练，却在 ESC-50 上以零样本 82.6% 超过人类基线 81%，在 16 个下游任务 / 8 个领域上刷新零样本 SoTA。
>
> **在计划中的位置**：AudioLDM 前置知识覆盖计划（大二上） §3 Batch A 第 4 篇 —— 「InfoNCE 对比学习，L4 的核心」；同时是 XACLE 基线编码器 M2D-CLAP 的上游、AudioLDM / AudioLDM 2 / Tango / TangoFlux 的条件注入来源。

---

## 一、结构图

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/10/ffcbbac48c6d9cb718852268a1e378a3.png"/></div>
---

## 二、主要前向公式

### 1. 双塔编码

$$
\hat{X}_a = f_a(X_a),\qquad \hat{X}_t = f_t(X_t)
$$

- $X_a\in\mathbb{R}^{F\times T}$ 是 log-Mel 谱（$F=64$ 个梅尔带、$T$ 个时间帧）；$\hat{X}_a\in\mathbb{R}^{N\times V}$、$\hat{X}_t\in\mathbb{R}^{N\times U}$ 为 batch 内 $N$ 条表征，$V=2048$、$U=768$。
- 音频端用 CNN14（PANNs 权重初始化，AudioSet 2M 片段预训练），文本端用 HuggingFace `bert-base-uncased`，取末层 `[CLS]` 作句表征。

### 2. 线性投影到联合多模态空间

$$
E_a = L_a(\hat{X}_a),\qquad E_t = L_t(\hat{X}_t),\qquad E_a,\,E_t\in\mathbb{R}^{N\times d},\quad d=1024
$$

- 只有两个可学习的线性矩阵，把两种模态搬到同一个 $d$ 维空间。

### 3. 相似度矩阵与温度

$$
C = \tau\,E_t E_a^\top,\qquad C\in\mathbb{R}^{N\times N}
$$

- $\tau$ 是**可学习**的温度参数，初始化为 $0.007$；为保证数值稳定，$C$ 被截断到上限 $100$。
- $C$ 的**对角线是 $N$ 个正确配对**，其余 $N^2-N$ 个是错误配对——这个结构就是 InfoNCE 的全部信息来源。

### 4. 对称 InfoNCE 损失

$$
\mathcal{L} = \frac{1}{2}\Big(\ell_{text}(C) + \ell_{audio}(C)\Big),\qquad
\ell_{k}(C) = \frac{1}{N}\sum_{i=1}^{N}\log\Big[\mathrm{diag}\,\mathrm{softmax}(C)\Big]
$$

- 沿文本轴、音频轴各算一次行内 softmax 的交叉熵再平均：**两个方向都要求「音频找得到自己的文本」与「文本找得到自己的音频」**。
- 负样本**全部来自同一 batch**，所以 batch 大小直接决定难度；附录图 2 显示零样本均分随 batch 增大而升，但 768 反而回落（作者认为是异常点，未查）。

### 5. 零样本分类

$$
\hat{y} = \mathrm{softmax}\!\left(\frac{E_a E_c^\top}{\|E_a\|\,\|E_c\|}\right)
$$

- $E_c$ 为 $C$ 个类别名经模板 `"This is a sound of [class label]"` 编出的文本嵌入；多标签任务（如 FSD50K）把 softmax 换成 sigmoid。

  ---

## 三、验收（对应计划 §6 L4）

- [ ] 讲清 InfoNCE：为什么相似度矩阵的对角线是唯一的正样本，温度 $\tau$ 在调什么
- [ ] 讲清「冻结文本塔 vs 冻结音频塔」实验结果说明了什么
- [ ] 讲清 CLAP 与 CLIP 在损失、数据、下游用法上的三点异同（**注意**：CLIP 本身不在本库，这条要等 Batch B 补了 CLIP 再答，别现在瞎猜）
- [ ] 能用一句话说清：CLAP 的输出在 AudioLDM 里被用来干什么（提示：不是分类，是**条件**）


