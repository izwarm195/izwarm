---
title: "SCLAP 追问记录"
slug: "text-to-audio/papers/sclap/qna"
description: "SOTD 是论文中的 Sequence Optimal Transport Distance（序列最优传输距离） ，最早由作者在 20 中提出，用于比较两个 有序序列 。它的核心思想是：不要把序列先池化成全局向量，而是在两个序列的元素之间“运输质量”，得到一个软对齐，同时保持两个…"
publishDate: "2026-11-17"
createdAt: "2026-11-17T00:00:00Z"
updatedDate: "2026-11-17T09:23:39"
tags: ["文献","QNA","SCLAP","optimal-transport","跨模态对齐","text-to-audio"]
series: ["Text-to-Audio","Papers","SCLAP"]
---

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**总览**
> 一、解释一下 SOTD
> 二、解释 $\gamma_{ij}$
> 三、举一个具体的例子解释总运输代价

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**主笔记：[SCLAP](/notes/text-to-audio/papers/sclap/)**

# 一、解释一下 SOTD

SOTD 是论文中的 **Sequence Optimal Transport Distance（序列最优传输距离）**，最早由作者在 [20] 中提出，用于比较两个**有序序列**。它的核心思想是：不要把序列先池化成全局向量，而是在两个序列的元素之间“运输质量”，得到一个软对齐，同时保持两个序列各自的顺序。

### 1. 基本设定

给定：

- 音频帧序列：$\mathbf{x}=(\mathbf{x}_1,\dots,\mathbf{x}_n)$
- 文本 token 序列：$\mathbf{y}=(\mathbf{y}_1,\dots,\mathbf{y}_m)$

  并给两个序列上的归一化权重：

  $$
  \alpha\in\Delta^n,\quad \beta\in\Delta^m
  $$

  其中 $\alpha_i$ 表示第 $i$ 个音频帧的重要性/质量，$\beta_j$ 表示第 $j$ 个文本 token 的重要性/质量。它们通常由 softmax 得到，所以各自和为 1。

  把两个序列分别看成定义在**一维有序支撑集**上的离散分布。因为顺序是一维的，所以给定 $(\alpha,\beta)$ 后，存在唯一的**单调耦合** $\gamma(\alpha,\beta)$，也就是一个运输计划，把 $\alpha$ 的质量按顺序运输到 $\beta$ 上。这个单调耦合可以通过匹配两个累积分布函数在 $O(n+m)$ 时间内得到，因此计算很高效。

### 2. SOTD 的定义

给定元素间代价 $C(\mathbf{x}_i,\mathbf{y}_j)$，SOTD 定义为：

$$
S_r(\mathbf{x},\mathbf{y})
=
\min_{\alpha\in\Delta^n}
\left(
\sum_{i,j}\gamma_{ij}(\alpha,\beta)\,C(\mathbf{x}_i,\mathbf{y}_j)^r
\right)^{1/r}
$$

其中 $r\in\mathbb{N}^*$。

直观理解：

- $\gamma_{ij}$ 表示把第 $i$ 个音频帧的“质量”分配给第 $j$ 个文本 token 的程度；
- $\sum_{i,j}\gamma_{ij} C_{ij}^r$ 是在这个软对齐下的总运输代价；
- 外层对 $\alpha$ 做最小化，表示模型可以学习哪些音频帧应该参与对齐；
- 保持顺序的单调耦合保证对齐不会乱序。

### 3. 在 ASR 中的原始用法

在自动语音识别 ASR 中，文本转录是给定的，所以 $\beta$ 固定为均匀分布，因为每个 transcript token 都必须被解释；而 $\alpha$ 是可学习的/优化的，这样静音或没有内容的音频帧可以分到接近零的质量，不参与对齐。

为了避免在每次训练时都真正求解这个最小化问题，[20] 用一个轻量级标量输出网络直接预测 $\alpha$，并端到端训练。

### 4. SCLAP 中对 SOTD 的改造

SCLAP 把 SOTD 用到音频-文本对比学习里，做了三个关键改动：

1. 令 $r=1$，并使用余弦代价：

   $$
   C(\mathbf{x}_i,\mathbf{y}_j)=1-\mathbf{x}_i^\top\mathbf{y}_j
   $$

   因为 $\gamma$ 和为 1，最小化 SOTD 等价于最大化 transport-weighted cosine similarity：

   $$
   \sum_{i,j}\gamma_{ij}(\alpha,\beta)\,\mathbf{x}_i^\top\mathbf{y}_j
   $$

2. 不再固定 $\beta$ 为均匀分布，而是用两个轻量网络分别从音频序列和文本序列预测 $\alpha$ 和 $\beta$：

   $$
   \alpha=\mathrm{softmax}\left(\frac{[\mathbf{W}_x(\mathbf{x}_i)]_{i=1}^n}{\theta_x}\right),
   \quad
   \beta=\mathrm{softmax}\left(\frac{[\mathbf{W}_y(\mathbf{y}_j)]_{j=1}^m}{\theta_y}\right)
   $$

3. 训练时不再把 SOTD 当作距离来最小化，而是把得到的 transport-weighted similarity 直接作为相似度分数：

   $$
   s_{\text{SCLAP-T}}(\{\mathbf{x}\}_n,\{\mathbf{y}\}_m)
   =
   \sum_{i,j}\gamma_{ij}(\alpha,\beta)\,\mathbf{x}_i^\top\mathbf{y}_j
   $$

   然后用它替换 CLAP 中的池化相似度，放进对称 InfoNCE 损失。

# 二、解释 $\gamma_{ij}$

$\gamma_{ij}$ 是 SOTD 里的**运输计划（transport plan）/ 单调耦合（monotone coupling）**的第 $(i,j)$ 个分量。直观说，它表示：**把第 $i$ 个音频帧上的“质量” $\alpha_i$ 中的多大一部分，分配给第 $j$ 个文本 token**。

在 SOTD 中，$\alpha\in\Delta^n$ 是音频帧上的归一化权重，$\beta\in\Delta^m$ 是文本 token 上的归一化权重。$\gamma(\alpha,\beta)$ 是一个 $n\times m$ 的非负矩阵，满足：

$$
\gamma_{ij}\ge 0,\qquad
\sum_{j=1}^m \gamma_{ij}=\alpha_i,\qquad
\sum_{i=1}^n \gamma_{ij}=\beta_j.
$$

也就是说：

- 对第 $i$ 行求和，得到音频帧 $i$ 的总质量 $\alpha_i$；
- 对第 $j$ 列求和，得到文本 token $j$ 的总质量 $\beta_j$；
- $\gamma_{ij}$ 就是音频帧 $i$ 和文本 token $j$ 之间被“运输”的联合质量。

  因为音频帧和文本 token 都是**一维有序序列**，所以给定 $\alpha,\beta$ 后，存在唯一的**单调耦合**：运输时保持顺序，不会出现“交叉”的质量运输。这个 $\gamma$ 可以通过匹配两个累积分布函数在 $O(n+m)$ 内得到。

  一个简单例子：设

  $$
  \alpha=(0.5,0.5),\qquad \beta=(0.3,0.7).
  $$

  单调运输计划可以是

  $$
  \gamma=
  \begin{pmatrix}
  0.3 & 0.2\\
  0 & 0.5
  \end{pmatrix}.
  $$

  验证：

- 第一行：$0.3+0.2=0.5=\alpha_1$；
- 第二行：$0+0.5=0.5=\alpha_2$；
- 第一列：$0.3+0=0.3=\beta_1$；
- 第二列：$0.2+0.5=0.7=\beta_2$。

  这里 $\gamma_{11}=0.3$ 表示音频帧 1 有 0.3 的质量分给文本 token 1；$\gamma_{12}=0.2$ 表示音频帧 1 还有 0.2 分给 token 2；$\gamma_{21}=0$ 表示音频帧 2 不分给 token 1；$\gamma_{22}=0.5$ 表示音频帧 2 的 0.5 分给 token 2。

  在 SCLAP 中，取 $r=1$ 和余弦代价 $C(\mathbf{x}_i,\mathbf{y}_j)=1-\mathbf{x}_i^\top\mathbf{y}_j$ 后，运输加权相似度是

  $$
  \sum_{i,j}\gamma_{ij}(\alpha,\beta)\,\mathbf{x}_i^\top\mathbf{y}_j.
  $$

  所以 $\gamma_{ij}$ 在这里起到**软对齐权重**的作用：它决定第 $i$ 个音频帧和第 $j$ 个文本 token 的余弦相似度在总相似度中占多大权重。

  关键点是：$\gamma_{ij}$ **不是**像 TAP 那样的跨模态注意力权重，也不是直接学习的参数；它由两个边际 $\alpha$ 和 $\beta$ 通过一维单调最优传输**唯一确定**。而 $\alpha$ 只从音频序列预测，$\beta$ 只从文本序列预测。训练时用 $\gamma$ 构造 SCLAP-T 相似度；推理时不需要显式算 $\gamma$，检索可以用边际加权池化 $s_{\text{SCLAP-P}}$，定位可以用逐帧与池化文本的余弦分数 $\ell_i$。

# 三、举一个具体的例子解释总运输代价

总运输代价就是：在给定运输计划 $\gamma$ 下，把音频帧上的质量按 $\gamma_{ij}$ 搬到文本 token 上时，所有被使用的配对 $(i,j)$ 的**代价加权和**：

$$
\text{总运输代价}
=
\sum_{i,j}\gamma_{ij}\,C(\mathbf{x}_i,\mathbf{y}_j)^r
$$

SCLAP 中取 $r=1$，代价用余弦不相似度：

$$
C(\mathbf{x}_i,\mathbf{y}_j)=1-\mathbf{x}_i^\top\mathbf{y}_j
$$

所以总运输代价就是：

$$
\sum_{i,j}\gamma_{ij}\left(1-\mathbf{x}_i^\top\mathbf{y}_j\right)
=
1-\sum_{i,j}\gamma_{ij}\,\mathbf{x}_i^\top\mathbf{y}_j
$$

因为 $\sum_{i,j}\gamma_{ij}=1$。因此**最小化总运输代价等价于最大化运输加权余弦相似度**。

---

### 具体例子

设有 3 个音频帧、2 个文本 token。给定边际权重：

$$
\alpha=(0.4,\;0.3,\;0.3),\qquad
\beta=(0.5,\;0.5)
$$

它们的一维单调运输计划为：

$$
\gamma=
\begin{pmatrix}
0.4 & 0.0\\
0.1 & 0.2\\
0.0 & 0.3
\end{pmatrix}
$$

验证行和、列和：

- 行和：$0.4,\;0.3,\;0.3=\alpha$
- 列和：$0.5,\;0.5=\beta$

  假设音频帧和文本 token 的余弦相似度矩阵为：

  $$
  S=
  \begin{pmatrix}
  0.8 & 0.2\\
  0.6 & 0.1\\
  0.3 & 0.9
  \end{pmatrix}
  $$

  其中 $S_{ij}=\mathbf{x}_i^\top\mathbf{y}_j$。那么代价矩阵是：

  $$
  C=1-S=
  \begin{pmatrix}
  0.2 & 0.8\\
  0.4 & 0.9\\
  0.7 & 0.1
  \end{pmatrix}
  $$

  总运输代价为：

  $$
  \begin{aligned}
  \sum_{i,j}\gamma_{ij}C_{ij}
  &=
  0.4\times 0.2
  +0.0\times 0.8\\
  &\quad+0.1\times 0.4
  +0.2\times 0.9\\
  &\quad+0.0\times 0.7
  +0.3\times 0.1\\
  &=0.08+0+0.04+0.18+0+0.03\\
  &=0.33
  \end{aligned}
  $$

  也可以从相似度角度算：

  $$
  \sum_{i,j}\gamma_{ij}S_{ij}
  =
  0.4\times 0.8
  +0.1\times 0.6
  +0.2\times 0.1
  +0.3\times 0.9
  =0.67
  $$

  因此：

  $$
  \text{总运输代价}=1-0.67=0.33
  $$

### 直观解释

- $\gamma_{11}=0.4$：音频帧 1 的 0.4 质量配给 token 1，这一对的相似度是 0.8，代价是 0.2，所以贡献 $0.4\times 0.2=0.08$。
- $\gamma_{22}=0.2$：音频帧 2 的 0.2 质量配给 token 2，这一对相似度只有 0.1，代价 0.9，所以贡献 $0.2\times 0.9=0.18$。
- $\gamma_{32}=0.3$：音频帧 3 的 0.3 质量配给 token 2，相似度 0.9，代价 0.1，贡献 $0.3\times 0.1=0.03$。
- 那些 $\gamma_{ij}=0$ 的配对不参与总代价。

  所以这个例子的**总运输代价是 0.33**，表示在单调运输计划下，音频帧和文本 token 的加权平均不相似度是 0.33；等价地，运输加权余弦相似度是 0.67。训练时希望这个总运输代价越小越好，也就是让 $\gamma$ 把质量集中在相似度高的音频帧-token 配对上。

  ---

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**注意**
> 本笔记依据 arXiv `2611.12124v1` 原文（PDF 已下载并逐节核对 §2.1–2.3）。
> 但有一处**未能核对**：参考文献 [20] 是 SOTD 的提出处，本库没有这篇，我未读其原文；§一 里「$O(n+m)$ 由累积分布匹配得到」与「一维最优耦合单调且唯一」是对原文 §2.2 表述的转写，未回查 [20] 的证明。
> 另外你最早给的那个 DeepSeek 分享链接我仍未抓全（页面客户端渲染），本笔记内容**不依赖**它。

