---
title: "第四章 复变函数项级数 定理公式总结"
slug: "complex/formulas/ch4"
description: "定理 4.1：复数列问题一律化归为两个实数列。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第四章 复变函数项级数 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：复数项级数 · 幂级数与收敛半径 · 泰勒级数 · 洛朗级数

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 复数列的极限
- 1.2 复数项级数
- 2.1 幂级数的收敛性
- 2.2 幂级数的收敛圆与收敛半径
- 2.3 幂级数收敛半径的求法
- 2.4 幂级数的运算性质
- 3.1 解析函数的泰勒展开定理
- 3.2 求解析函数泰勒展开式的方法
- 4.1 解析函数的洛朗展开定理
- 4.2 求圆环域内解析函数洛朗展开式的方法

</details>

## 第一节 复数项级数

### 1.1 复数列的极限

$$
\lim_{n\to\infty}\alpha_{n}=\alpha\iff \forall\varepsilon>0,\ \exists N\in\mathbb{N}_{+}:\ n>N\Rightarrow|\alpha_{n}-\alpha|<\varepsilon
$$

$$
\{\alpha_{n}=a_{n}+\mathrm{i}b_{n}\}\to\alpha=a+\mathrm{i}b\iff a_{n}\to a,\ b_{n}\to b
$$
- 定理 4.1：复数列问题一律化归为两个实数列。

### 1.2 复数项级数

$$
\sum_{n=1}^{\infty}\alpha_{n}=\alpha_{1}+\alpha_{2}+\cdots+\alpha_{n}+\cdots,\qquad s_{n}=\sum_{k=1}^{n}\alpha_{k}
\tag{4.1.1}
$$

$$
\sum_{n=1}^{\infty}\alpha_{n}\ \text{收敛}\iff\sum_{n=1}^{\infty}a_{n},\ \sum_{n=1}^{\infty}b_{n}\ \text{均收敛}
$$
- 定理 4.2。

  $$
  \sum_{n=1}^{\infty}\alpha_{n}\ \text{收敛}\ \Longrightarrow\ \lim_{n\to\infty}\alpha_{n}=0
  $$
- 推论 4.1（收敛的必要条件）。

  $$
  \sum_{n=1}^{\infty}|\alpha_{n}|\ \text{收敛}\ \Longrightarrow\ \sum_{n=1}^{\infty}\alpha_{n}\ \text{收敛},\qquad \left|\sum_{n=1}^{\infty}\alpha_{n}\right|\leqslant\sum_{n=1}^{\infty}|\alpha_{n}|
  $$
- 定理 4.3（绝对收敛准则）；绝对收敛必收敛。

  $$
  \sum_{n=0}^{\infty}\alpha^{n}=\frac{1}{1-\alpha}\quad(|\alpha|<1);\qquad |\alpha|\geqslant1\ \text{时发散}
  $$

## 第二节 幂级数

### 2.1 幂级数的收敛性

$$
\sum_{n=0}^{\infty}c_{n}(z-a)^{n}=c_{0}+c_{1}(z-a)+c_{2}(z-a)^{2}+\cdots
\tag{4.2.3}
$$

$$
\sum_{n=0}^{\infty}c_{n}z^{n}=c_{0}+c_{1}z+c_{2}z^{2}+\cdots+c_{n}z^{n}+\cdots
\tag{4.2.4}
$$

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 4.4（阿贝尔 Abel 定理）**
> - 在 $z_{0}\neq0$ 收敛 $\Rightarrow$ $|z|<|z_{0}|$ 时**绝对收敛**；
> - 在 $z_{0}\neq0$ 发散 $\Rightarrow$ $|z|>|z_{0}|$ 时**发散**。

### 2.2 幂级数的收敛圆与收敛半径

$$
|z-a|<R\ \text{内绝对收敛},\qquad |z-a|>R\ \text{发散}
$$
- $R$ 为收敛半径，$|z-a|=R$ 为收敛圆；$R=0$ 或 $R=+\infty$ 为两种退化情形。

  $$
  \frac{1}{1-z}=1+z+z^{2}+\cdots+z^{n}+\cdots,\qquad |z|<1
  \tag{4.2.5}
  $$

### 2.3 幂级数收敛半径的求法

$$
R=\frac{1}{\lambda},\qquad \lambda=\lim_{n\to\infty}\left|\frac{c_{n+1}}{c_{n}}\right|\quad\text{或}\quad \lambda=\lim_{n\to\infty}\sqrt[n]{|c_{n}|}
$$
- 定理 4.5：要求 $\lambda\neq0$；$\lambda=0$ 时 $R=+\infty$，$\lambda=+\infty$ 时 $R=0$；缺项级数须直接用法则判定。

### 2.4 幂级数的运算性质

$$
\alpha f(z)+\beta g(z)=\sum_{n=0}^{\infty}(\alpha a_{n}+\beta b_{n})z^{n},\qquad |z|<R=\min\{r_{1},r_{2}\}
$$

$$
f(z)g(z)=\sum_{n=0}^{\infty}c_{n}z^{n},\qquad c_{n}=\sum_{k=0}^{n}a_{k}b_{n-k}
$$

$$
f[g(z)]=\sum_{n=0}^{\infty}a_{n}[g(z)]^{n},\qquad |g(z)|<r
$$
- 变量代换（复合）运算，是间接展开的主要手段。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 4.6（幂级数的分析性质）**
> 和函数 $f(z)=\sum c_{n}(z-a)^{n}$ 在收敛圆内解析，可**逐项求导**、**逐项积分**，且收敛半径不变。

$$
f^{(k)}(z)=\sum_{n=k}^{\infty}n(n-1)\cdots(n-k+1)\,c_{n}(z-a)^{n-k}
$$

$$
\int_{a}^{z}f(\zeta)\,\mathrm{d}\zeta=\sum_{n=0}^{\infty}\frac{c_{n}}{n+1}(z-a)^{n+1}
$$

## 第三节 泰勒级数

### 3.1 解析函数的泰勒展开定理

$$
f(z)=\sum_{n=0}^{\infty}c_{n}(z-z_{0})^{n},\qquad c_{n}=\frac{f^{(n)}(z_{0})}{n!}=\frac{1}{2\pi\mathrm{i}}\oint_{C_{\rho}}\frac{f(\zeta)}{(\zeta-z_{0})^{n+1}}\,\mathrm{d}\zeta
\tag{4.3.1}
$$
- $f$ 在 $|z-z_{0}|<R$ 内解析；展开式**唯一**。

  $$
  f(z)=\sum_{n=0}^{\infty}\frac{f^{(n)}(z_{0})}{n!}(z-z_{0})^{n},\qquad |z-z_{0}|<d
  $$
- 定理 4.8：$d$ 为 $z_{0}$ 到 $D$ 边界的最短距离。

  $$
  R=|\alpha-z_{0}|
  $$
- 推论 4.2：$\alpha$ 为 $D$ 内距 $z_{0}$ 最近的奇点；收敛圆上至少有一个奇点。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**解析性的等价刻画**
> $f$ 在 $D$ 内解析 $\iff$ $f$ 在 $D$ 内任一点的邻域内可展开为幂级数。

### 3.2 求解析函数泰勒展开式的方法

$$
\mathrm{e}^{z}=1+z+\frac{z^{2}}{2!}+\cdots+\frac{z^{n}}{n!}+\cdots,\qquad |z|<+\infty
$$

$$
\sin z=z-\frac{z^{3}}{3!}+\frac{z^{5}}{5!}-\cdots+(-1)^{n}\frac{z^{2n+1}}{(2n+1)!}+\cdots,\qquad |z|<+\infty
$$

$$
\cos z=1-\frac{z^{2}}{2!}+\frac{z^{4}}{4!}-\cdots+(-1)^{n}\frac{z^{2n}}{(2n)!}+\cdots,\qquad |z|<+\infty
$$

$$
\frac{1}{1+z}=1-z+z^{2}-\cdots+(-1)^{n}z^{n}+\cdots,\qquad |z|<1
$$

$$
\ln(1+z)=z-\frac{z^{2}}{2}+\frac{z^{3}}{3}-\cdots+(-1)^{n}\frac{z^{n+1}}{n+1}+\cdots,\qquad |z|<1
$$

$$
(1+z)^{\alpha}=1+\alpha z+\frac{\alpha(\alpha-1)}{2!}z^{2}+\cdots+\frac{\alpha(\alpha-1)\cdots(\alpha-n+1)}{n!}z^{n}+\cdots,\qquad |z|<1
$$

$$
\frac{1}{z-b}=-\sum_{n=0}^{\infty}\frac{(z-a)^{n}}{(b-a)^{n+1}},\qquad |z-a|<|b-a|
\tag{4.2.7}
$$
- 以上五式为间接展开的“零件”，配合代数运算、代换、逐项求导与逐项积分使用。

## 第四节 洛朗级数

### 4.1 解析函数的洛朗展开定理

$$
\sum_{n=-\infty}^{+\infty}c_{n}(z-z_{0})^{n}=\sum_{n=1}^{+\infty}c_{-n}(z-z_{0})^{-n}+\sum_{n=0}^{+\infty}c_{n}(z-z_{0})^{n}
\tag{4.4.1}
$$
- 双边幂级数；正幂项（解析部分）与负幂项（主要部分）须**同时收敛**。

  $$
  R_{1}<|z-z_{0}|<R_{2}\ \text{为收敛域}
  $$
- $R_{1}>R_{2}$ 时无公共收敛域；边界上收敛性需另判。

  $$
  f(z)=\sum_{n=-\infty}^{+\infty}c_{n}(z-z_{0})^{n}
  \tag{4.4.2}
  $$

  $$
  c_{n}=\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f(\zeta)}{(\zeta-z_{0})^{n+1}}\,\mathrm{d}\zeta,\qquad n=0,\pm1,\pm2,\cdots
  \tag{4.4.3}
  $$
- $f$ 在 $R_{1}<|z-z_{0}|<R_{2}$ 内解析，$C$ 为该圆环域内绕 $z_{0}$ 的正向简单闭曲线。

### 4.2 求圆环域内解析函数洛朗展开式的方法

$$
\frac{\mathrm{e}^{z}-1}{z^{3}}=\frac{1}{z^{2}}+\frac{1}{2!}\cdot\frac{1}{z}+\frac{1}{3!}+\frac{1}{4!}z+\frac{1}{5!}z^{2}+\cdots,\qquad 0<|z|<+\infty
$$
- 间接展开法：由已知泰勒展开式直接除/代换，远比积分公式简便。

  $$
  \frac{1}{(z+1)(2-z)}=\frac{1}{3}\sum_{n=0}^{\infty}\left[(-1)^{n}+\frac{1}{2^{n+1}}\right]z^{n},\qquad 0<|z|<1
  $$

  $$
  \frac{1}{(z+1)(2-z)}=\frac{1}{3}\sum_{n=0}^{\infty}\frac{(-1)^{n}}{z^{n+1}}+\frac{1}{3}\sum_{n=0}^{\infty}\frac{z^{n}}{2^{n+1}},\qquad 1<|z|<2
  $$

  $$
  \frac{1}{(z+1)(2-z)}=\frac{1}{3}\sum_{n=0}^{\infty}\frac{(-1)^{n}-2^{n}}{z^{n+1}},\qquad 2<|z|<+\infty
  $$
- 同一函数在不同圆环域有不同洛朗展开式，与唯一性不矛盾（区域不同）。

  $$
  c_{-n}=\frac{1}{2\pi\mathrm{i}}\oint_{C}(\zeta-z_{0})^{n-1}f(\zeta)\,\mathrm{d}\zeta=0\quad(n=1,2,\cdots)
  $$
- 内圆周内处处解析时负幂项全为零，洛朗级数退化为泰勒级数。

> <img class="callout-badge" src="/media/icons/lightbulb.svg" alt="tip">**泰勒级数 vs 洛朗级数**
> 泰勒级数只含正幂项、系数可取微分形式；洛朗级数含负幂项、系数一般只能取积分形式。**洛朗是泰勒的推广。**

---

[← 第三章 复变函数的积分](/notes/complex/formulas/ch3/) · [总目录](/notes/complex/formulas/toc/) · [第五章 留数及其应用 →](/notes/complex/formulas/ch5/)

