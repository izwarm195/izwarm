---
title: "BEATs: Audio Pre-Training with Acoustic Tokenizers"
slug: "text-to-audio/papers/beats"
description: "BEATs 迭代预训练架构全图"
publishDate: "2026-10-21"
createdAt: "2026-10-21T00:00:00Z"
tags: ["文献","BEATs","自监督预训练","音频编码器","Batch-A","text-to-audio"]
series: ["Text-to-Audio","Papers","BEATs"]
---

# BEATs：用声学 tokenizer 做音频预训练

![BEATs 迭代预训练架构全图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/aba3b2192f69062d5c0bd2bbe549c8ab.svg)

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**摘要**
> 把语音/视觉/语言里成功的「离散标签预测」搬到通用音频，用**声学 tokenizer 与音频 SSL 模型交替迭代**的方式互相提升：tokenizer 产出语义离散标签，SSL 模型以 75% 掩码预测这些标签；收敛后再用 SSL 模型作 teacher 蒸馏出更强的 tokenizer。ViT 骨干 90M，AudioSet-2M 上 mAP 50.6%（集成）、ESC-50 98.1%，均刷新 SOTA 且参数与数据比对手少得多。
>
> **在计划中的位置**：AudioLDM 前置知识覆盖计划（大二上） §3 Batch A 第 6 篇「最强的通用音频编码器之一，几乎必然进你的集成」；TMU 系统用它作音频塔（[TMUSystem](/notes/text-to-audio/papers/tmusystem/)），XACLE 2027 基线的 M2D-CLAP 与它同属通用音频表征这一族。

---

## 一、主要前向公式

### 1. Cold start：随机投影 tokenizer

$$
\hat{z}_t=\arg\min_{i}\;\lVert v_i-Wx_t\rVert_2^2
$$

- $x_t$ 是第 $t$ 个 patch 的特征（128 维 log-Mel，16×16 patch），$W$ 是**随机初始化后冻结**的线性投影，$V=\{v_i\}_{i=1}^{K}$ 是同样随机初始化后冻结的码本，$K=1024$、维度 256。
- 第一轮没有 teacher 可用，只能拿这套随机投影做最近邻聚类，作为冷启动的离散标签。

### 2. 自蒸馏 tokenizer 的量化

$$
\hat{z}_t=\arg\min_{i}\;\lVert\ell_2(v_i)-\ell_2(e_t)\rVert_2^2
$$

- $e_t$ 是 12 层 Transformer tokenizer encoder 的输出；先做 $\ell_2$ 归一化再找最近邻，是为了提高码本利用率。
- 从第二轮起码本变成**可学习**的，量化用 straight-through 把梯度从 $E_q$ 直接抄回 $E$。

### 3. 自蒸馏 tokenizer 的训练目标

$$
\max\sum_{X\in\mathcal{D}}\sum_{t=1}^{T}\cos(o_t,\hat{o}_t)-\big\lVert \mathrm{sg}[\ell_2(e_t)]-\ell_2(v_{\hat{z}_t})\big\rVert_2^2-\big\lVert \ell_2(e_t)-\mathrm{sg}[\ell_2(v_{\hat{z}_t})]\big\rVert_2^2
$$

- $\hat{o}_t$ 是 teacher 模型的输出，$o_t$ 是 3 层 Transformer estimator 的预测；$\mathrm{sg}[\cdot]$ 是 stop-gradient。
- 后两项是码本与编码器各自的 commit loss，码本用 EMA 更新。**推理时 estimator 整个丢掉**，只留 encoder + 码本。

### 4. 掩码音频建模（MAM）

$$
\mathcal{L}_{\mathrm{MAM}}=-\sum_{t\in M}\log p(\hat{z}_t\mid X_U)
$$

- 随机遮掉 75% 的 patch，只把**未遮住**的 $X_U$ 送进 ViT encoder，再由 Transformer label predictor 在遮住的位置预测离散标签。
- 预测目标是离散标签而非重建特征——这是全文的核心主张。

### 5. 微调阶段的分类头

$$
p(C)=\mathrm{Softmax}\big(\mathrm{MeanPool}(W_cR)\big)
$$

- 丢掉 label predictor，在 ViT 输出 $R$ 上接线性层；单标签用交叉熵，多标签用 BCE，可配 mixup。
- 骨干：12 层 Transformer、768 维、8 头，共 **90M** 参数。

  ---

## 二、验收

- [ ] 讲清为什么离散标签预测优于重建损失（语义抽象 + 参数不浪费在低层时频细节上）
- [ ] 讲清一轮迭代里 tokenizer 和 SSL 模型各自当谁的 teacher
- [ ] 讲清 `BEATs-iter3+` 的 `+` 是什么（teacher 换成**监督微调后**的 iter2，把下游标签也带进了预训练）
- [ ] 说清 BEATs 在 XACLE 里能干什么（提示：TMU 把它冻住当音频塔，接 3 层 SwiGLU MLP 进 Qwen2.5）

