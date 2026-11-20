---
title: "SCLAP: Temporal Structural Alignment Improves Localization in Long-Form Audio"
slug: "text-to-audio/papers/sclap"
description: "{x }_n (x_1, dots,x_n) 是音频帧嵌入， {y }_m (y_1, dots,y_m) 是文本 token 嵌入； bar{x} 是 均值池化 的音频向量， bar{y} 取文本 CLS ，两者 ell_2 归一化。"
publishDate: "2026-11-17"
createdAt: "2026-11-17T00:00:00Z"
updatedDate: "2026-11-17T09:22:13"
tags: ["文献","SCLAP","跨模态对齐","optimal-transport","长音频","text-to-audio"]
series: ["Text-to-Audio","Papers","SCLAP"]
---

# SCLAP：用时序结构对齐改善长音频定位

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**摘要**
> CLAP 把帧序列与 token 序列**均匀池化**成全局嵌入，丢掉了时序结构，导致检索与定位在长录音上双双受损——尤其当短事件淹没在长上下文里。SCLAP 提出**序列级对比框架**：用**单调一维最优传输**直接对齐音频帧与文本 token，靠可学习边缘权重在只有 clip 级字幕的情况下拿到细粒度时序监督。短音频（Clotho / TACOS，15–30 s）上检索不掉点而零样本定位优于 CLAP 与 TAP；长音频（CASTELLA，最长 300 s）上检索最强，且事件/上下文比越低定位优势越大。推理时不需要解最优传输。



---

## 一、主要前向公式

### 1. CLAP 基线：均匀池化 + 对称 InfoNCE

$$
s(\bar{x},\bar{y})=\frac{\bar{x}^\top\bar{y}}{\tau},\qquad
\mathcal{L}_{\mathrm{CLAP}}=-\frac{1}{2B}\sum_{i=1}^{B}\left(\log\frac{e^{s_{ii}}}{\sum_{j}e^{s_{ij}}}+\log\frac{e^{s_{ii}}}{\sum_{j}e^{s_{ji}}}\right)
$$

- $\{x\}_n=(x_1,\dots,x_n)$ 是音频帧嵌入，$\{y\}_m=(y_1,\dots,y_m)$ 是文本 token 嵌入；$\bar{x}$ 是**均值池化**的音频向量，$\bar{y}$ 取文本 `[CLS]`，两者 $\ell_2$ 归一化。
- $\tau$ 是对比温度。均匀池化隐含假设「一个向量能概括整段输入」——这条在短音频成立，长音频就崩。

### 2. 序列最优传输距离 SOTD

$$
S_r(x,y)=\min_{\alpha\in\Delta^n}\Big(\sum_{i,j}\gamma_{ij}(\alpha,\beta)\,C(x_i,y_j)^r\Big)^{1/r}
$$

- $\alpha\in\Delta^n$、$\beta\in\Delta^m$ 分别是音频帧与文本 token 上的归一化权重（softmax 得到）；把两条序列看作**一维有序支撑集**上的离散分布，则 $(\alpha,\beta)$ 存在唯一的**单调耦合** $\gamma(\alpha,\beta)$，由累积分布函数匹配算出，复杂度 $O(n+m)$。
- 这是作者在 [20]（ASR 场景）提出的量，SCLAP 把它搬到音频-文本。ASR 里 $\beta$ 固定为均匀分布（转写每个 token 都必须被覆盖），$\alpha$ 待优化（静音帧可以不分配质量）。

### 3. 两端可学习边缘

$$
\alpha=\mathrm{softmax}\!\left(\frac{[W_x(x_i)]_{i=1}^{n}}{\theta_x}\right),\qquad
\beta=\mathrm{softmax}\!\left(\frac{[W_y(y_j)]_{j=1}^{m}}{\theta_y}\right)
$$

- $W_x$、$W_y$ 是**各自独立的轻量标量输出网络**，$\theta_x$、$\theta_y$ 是各自温度。这是相对 [20] 的第一处改动：β 也变成可学的，不再固定均匀。
- **两个边缘各自只看自己模态**，不交叉。正因为不交叉，训练完的 $\alpha$、$\beta$ 本身就带着重要性信息，推理时不需要再算传输方案。

### 4. 传输加权相似度（训练时用）

$$
s_{\mathrm{SCLAP\text{-}T}}\big(\{x\}_n,\{y\}_m\big)=\sum_{i,j}\gamma_{ij}(\alpha,\beta)\,x_i^\top y_j
$$

- 令 $r=1$、代价 $C(x_i,y_j)=1-x_i^\top y_j$，因 $\sum_{ij}\gamma_{ij}=1$，SOTD 可改写成 $1-\sum_{ij}\gamma_{ij}x_i^\top y_j$——**最小化 SOTD 等价于最大化这个传输加权余弦**。
- 用它替换 (1) 里的 $s_{ab}$ 就得到 $\mathcal{L}_{\mathrm{SCLAP}}$。**双塔架构与 batch 内对比形式都没变，只换了相似度函数。**

### 5. 免传输的使用方式（推理时）

$$
s_{\mathrm{SCLAP\text{-}P}}\big(\{x\}_n,\{y\}_m\big)=\cos\Big(\sum_i \alpha_i x_i,\ \sum_j \beta_j y_j\Big)
$$

$$
\ell_i\big(\{x\}_n,\{y\}_m\big)=x_i^\top\sum_j \beta_j y_j,\qquad i=1,\dots,n
$$

- **检索**用 $s_{\mathrm{SCLAP\text{-}P}}$：按学到的 $\alpha,\beta$ 加权平均后再算余弦，成本与普通 CLAP 点积相同，且两个模态可以**各自预计算**。
- **定位**用 $\ell_i$：每个音频帧单独与加权文本向量算分，不需要文本侧序列以外的任何东西。$\ell_i$ 高说明该帧内容与字幕吻合——无需任何时序监督即得定位信号。

  ---

## 二、两个必须澄清的约束

- **单调性假设比 ASR 更强**。ASR 里音频与转写本来就同序；这里一段音频可能有多个事件，而字幕可以任意顺序提及、甚至漏掉一些。作者的解释是：$\gamma(\alpha,\beta)$ 完全由边缘决定，模型的自由度全在 $\alpha$、$\beta$ 上，把「不该参与的位置」质量压到近零就等于把它们从对齐中剔除。实验上这个缓解够用。
- **与 FineLAP 的取舍相反**。FineLAP 有帧级标注、担心的是「标注稀缺 + 粒度异构」；SCLAP **没有任何时序标注**，靠 clip 级字幕自己长出时序结构。

  ---

## 三、验收

- [ ] 讲清为什么 $r=1$ 且 $C=1-x^\top y$ 时，「最小化 SOTD」等价于「最大化传输加权余弦」
- [ ] 讲清单调耦合的 $O(n+m)$ 怎么来的（提示：一维有序支撑集上匹配累积分布）
- [ ] 讲清为什么 $\alpha$、$\beta$ 不能交叉计算，以及这个限制换来了什么
- [ ] 说出推理时为什么可以不引入 OT（提示：$s_{\mathrm{SCLAP\text{-}P}}$ 与 $\ell_i$ 都只依赖单模态边缘）
- [ ] 说清 SCLAP 与 TAP 的定位机制差别（提示：TAP 只有一张 caption 级注意力分布，SCLAP 是逐帧 cosine）

