---
title: "The TMU System for the XACLE Challenge: Training Large Audio Language Models with CLAP Pseudo-Labels"
slug: "text-to-audio/papers/tmusystem/the-tmu-system-for-the-xacle-challenge-training-large-audio-language-models-with-clap-pseudo-labels"
description: "TMU System 完整模型架构与训练/预测流程"
publishDate: "2026-10-21"
createdAt: "2026-10-21T00:00:00Z"
updatedDate: "2026-10-21T21:00:45"
tags: ["文献","XACLE","LALM","CLAP","Batch-A","text-to-audio"]
series: ["Text-to-Audio","Papers","TMUSystem"]
---

# TMU 的 XACLE 系统：用 CLAP 伪标签训音频语言模型

![TMU System 完整模型架构与训练/预测流程](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/f09ca34ff46e0653cfd2849df5f9cf27.svg)

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**摘要**
> 把 XACLE 当作音频-文本对的 reward modeling，用 LALM（冻结 BEATs-iter3+ → 3 层 SwiGLU MLP → Qwen2.5-0.5B → 线性打分头，共 594M）回归对齐分。三阶段训练：AAC 预训练 → **CLAP 伪标签弱监督预训练** → XACLE 微调。test SRCC **0.632**，远超官方基线 0.334，挑战赛第三名；核心结论是**伪标签预训练才是主要涨点来源**，而 AAC 预训练几乎不必要（0.625 vs 0.626）。
>
> **在计划中的位置**：AudioLDM 前置知识覆盖计划（大二上） §3 Batch A「MoEScore 之后的另一条强基线」；它同时给出 2027 基线的两个直接可借用件——**ListNet 排序损失**与**BEATs + CLAP 伪标签**这条路线。

---

## 一、主要前向公式

### 1. 音频投影（BEATs → LLM 序列）

$$
E_a=\mathrm{MLP}_{\text{SwiGLU}}\big(\mathrm{AvgPool}_{5}(Z_{\text{BEATs}})\big)
$$

- BEATs 把 10 s 波形编码成 50 token/s、768 维的序列，共 **500** 个 token；时间维 5 倍平均池化压到 **100** 个，再过 3 层 SwiGLU MLP 对齐到 LLM 的输入空间。
- 字母表里的三个特殊 token：`<|AUDIO START|>`、`<|AUDIO END|>` 夹住音频 token，`<|SCORE|>` 放在序列末尾负责取分。

### 2. LLM 输入格式

$$
\text{Text Tokens}\;\ldots\;\texttt{<|AUDIO START|>}\;\text{Audio Tokens}\;\ldots\;\texttt{<|AUDIO END|>}\;\texttt{<|SCORE|>}
$$

- 打分取的是 `<|SCORE|>` 位置的隐状态 $h_{\text{SCORE}}$（**不是**最后一个 token 的隐状态）。因为注意力是因果的，任务 token 必须放在末尾；作者实验里这比取 last hidden state 更好。

### 3. 打分头与输出

$$
\hat{s}=w^{\top}h_{\text{SCORE}}+b,\qquad h_{\text{SCORE}}\in\mathbb{R}^{896}
$$

- 单标量回归。总分 = BEATs 90M + 投影 10M + Qwen2.5-0.5B 494M + 头 1K ≈ **594M**。

### 4. ListNet 排序损失

$$
\mathcal{L}=-\sum_{\pi\in\Pi}\;\sum_{i=1}^{K}P_{\hat{\pi}(i)}\log P_{\pi(i)},\qquad
P_{\pi(i)}=\frac{\exp(\phi(s_i))}{\sum_{j=1}^{K}\exp(\phi(s_j))}
$$

- 在长度为 $K$ 的列表上把打分分布做成 softmax，再与目标的排序概率做交叉熵。**直接优化排序**，与评价指标 SRCC 同向。
- 阶段 2 与阶段 3 都用它；这是本文相对 MSE 回归的关键一句话。

### 5. 三阶段训练

$$
\underbrace{\text{(i) AAC 预训练}}_{273K\text{ 对}}
\;\to\;
\underbrace{\text{(ii) CLAP 伪标签预训练}}_{\approx 1{,}064K\text{ 对}}
\;\to\;
\underbrace{\text{(iii) XACLE 微调}}_{7.5K\text{ 对}}
$$

- 阶段 2 的正样本只有配对数据，对齐分会偏高、偏离 XACLE 分布，所以做**负采样**合成低分对：随机把音频或文本换成别的样本，从 273K 扩到约 1,064K。
- 伪标签由 **HumanCLAP-M2D** 生成——即在 XACLE 训练集上用 HumanCLAP 方法微调过的 M2D-CLAP。
- 阶段 3 因训练数据少，用 SpecAugment（freq mask 15 / time mask 30）做增强。

### 6. 提交用的 rank 平均集成

$$
\hat{s}_{\text{ens}}=\operatorname{lin}\!\left(\tfrac{1}{2}\big(r(\hat{s}_{\text{full}})+r(\hat{s}_{\text{noAAC}})\big)\right)
$$

- $r(\cdot)$ 把预测分数转成秩，取平均后再线性缩放到目标分数区间。
- 两条支路是「完整三阶段」与「跳过阶段 1、从阶段 2 开始」，test 上分别 0.626 / 0.625，集成到 **0.632**，说明两者误差互补。

  ---

## 二、验收

- [ ] 讲清为什么用 ListNet 而不是 MSE（评价指标是 SRCC，序关系比绝对分数重要）
- [ ] 讲清阶段 2 为什么要负采样（AAC 全配对，伪标签分布会偏高，需人为造低分对）
- [ ] 讲清「AAC 预训练不必要」这个反直觉结论的证据与作者的解释
- [ ] 说清这套系统里哪几件可以搬进 XACLE 2027 的 Model 1–12（提示：排序损失、伪标签、组内 SRCC）

