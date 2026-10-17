---
title: "第三章 复变函数的积分 定理公式总结"
slug: "complex/formulas/ch3"
description: "C 为有向曲线， delta max Delta s_{k} ；闭曲线记 oint_{C} 。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第三章 复变函数的积分 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：积分定义与计算 · 柯西-古萨定理 · 复合闭路定理 · 原函数 · 柯西积分公式 · 高阶导数 · 调和函数

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 积分的定义
- 1.2 积分的存在性条件与计算方法
- 1.3 积分的基本性质
- 2.1 柯西-古萨基本定理
- 2.2 基本定理的推广——复合闭路定理
- 3.1 原函数与不定积分
- 4.1 柯西积分公式
- 4.2 高阶导数公式与解析函数的无限可微性
- 5.1 解析函数与调和函数的关系

</details>

## 第一节 复变函数积分的概念、性质及计算

### 1.1 积分的定义

$$
\int_{C}f(z)\,\mathrm{d}z=\lim_{\delta\to0}\sum_{k=1}^{n}f(\zeta_{k})\Delta z_{k},\qquad \Delta z_{k}=z_{k}-z_{k-1}
\tag{3.1.1}
$$
- $C$ 为有向曲线，$\delta=\max|\Delta s_{k}|$；闭曲线记 $\oint_{C}$。

### 1.2 积分的存在性条件与计算方法

$$
\int_{C}f(z)\,\mathrm{d}z=\int_{C}u\,\mathrm{d}x-v\,\mathrm{d}y+\mathrm{i}\int_{C}v\,\mathrm{d}x+u\,\mathrm{d}y
\tag{3.1.2}
$$
- 形式上即 $(u+\mathrm{i}v)(\mathrm{d}x+\mathrm{i}\mathrm{d}y)$ 展开。

  $$
  z=z(t)=x(t)+\mathrm{i}y(t),\quad \alpha\leqslant t\leqslant\beta
  \tag{3.1.3}
  $$

  $$
  \int_{C}f(z)\,\mathrm{d}z=\int_{\alpha}^{\beta}f[z(t)]\,z'(t)\,\mathrm{d}t
  \tag{3.1.5}
  $$
- 参数方程法（复积分的变量代换法），正向取 $t$ 增大方向。

  $$
  \oint_{|z-z_{0}|=r}\frac{\mathrm{d}z}{(z-z_{0})^{n+1}}=\begin{cases}2\pi\mathrm{i}, & n=0,\\[1mm] 0, & n\neq0,\ n\in\mathbb{Z}\end{cases}
  $$
- 值与圆心、半径均无关，是后续所有公式的基石。

### 1.3 积分的基本性质

$$
\int_{C}f\,\mathrm{d}z=-\int_{C^{-}}f\,\mathrm{d}z,\qquad \int_{C}kf\,\mathrm{d}z=k\int_{C}f\,\mathrm{d}z
\tag{3.1.6}
$$

$$
\int_{C}[f\pm g]\,\mathrm{d}z=\int_{C}f\,\mathrm{d}z\pm\int_{C}g\,\mathrm{d}z
\tag{3.1.8}
$$

$$
\int_{C}f\,\mathrm{d}z=\int_{C_{1}}f\,\mathrm{d}z+\int_{C_{2}}f\,\mathrm{d}z+\cdots+\int_{C_{n}}f\,\mathrm{d}z
\tag{3.1.9}
$$

$$
\left|\int_{C}f(z)\,\mathrm{d}z\right|\leqslant\int_{C}|f(z)|\,\mathrm{d}s\leqslant ML
\tag{3.1.10}
$$
- 积分估值不等式：$L$ 为 $C$ 的长度，$|f(z)|\leqslant M$。

## 第二节 柯西-古萨基本定理及其推广

### 2.1 柯西-古萨基本定理

$$
\oint_{C}f(z)\,\mathrm{d}z=0
\tag{3.2.1}
$$
- $f$ 在简单闭曲线 $C$ 上及 $C$ 所围区域内处处解析。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 3.3 / 3.4（两种放宽形式）**
> - $f$ 在**单连通域** $B$ 内解析 $\Rightarrow$ 沿 $B$ 内任一闭曲线（不必简单）积分为零；
> - $f$ 在 $C$ 上连续、在 $C$ 内解析 $\Rightarrow$ 沿 $C$ 积分为零。

### 2.2 基本定理的推广——复合闭路定理

$$
\oint_{C}f(z)\,\mathrm{d}z+\oint_{C_{1}}f(z)\,\mathrm{d}z=0\qquad\Longleftrightarrow\qquad \oint_{C}f\,\mathrm{d}z=\oint_{C_{1}}f\,\mathrm{d}z
\tag{3.2.2}
$$

$$
\oint_{C}f(z)\,\mathrm{d}z=\sum_{k=1}^{n}\oint_{C_{k}}f(z)\,\mathrm{d}z,\qquad \oint_{\Gamma}f(z)\,\mathrm{d}z=0
$$
- 定理 3.5（复合闭路定理）：$C$ 与 $C_{k}$ 均取正向；$\Gamma=C+C_{1}^{-}+\cdots+C_{n}^{-}$ 为复合闭路。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 3.6（闭路变形原理）**
> 解析函数沿闭曲线的积分，不因闭曲线在解析区域内连续变形而改变，只要变形中不经过奇点。

$$
\oint_{C}\frac{\mathrm{d}z}{(z-z_{0})^{n+1}}=\begin{cases}2\pi\mathrm{i}, & n=0,\\[1mm] 0, & n\neq0\end{cases}
$$
- $C$ 为**包含 $z_{0}$ 的任一**正向简单闭曲线（由变形原理得）。

## 第三节 原函数与不定积分

$$
F(z)=\int_{z_{0}}^{z}f(\zeta)\,\mathrm{d}\zeta,\qquad F'(z)=f(z)
\tag{3.3.1}
$$
- $f$ 在单连通域 $B$ 内解析时，$F$ 为 $B$ 内解析函数（变上限积分求导）。

  $$
  \int f(z)\,\mathrm{d}z=F(z)+c
  $$
- 不定积分；同一函数的任意两个原函数只差一个复常数。

  $$
  \int_{z_{0}}^{z_{1}}f(z)\,\mathrm{d}z=G(z_{1})-G(z_{0})
  \tag{3.3.2}
  $$
- 牛顿-莱布尼茨公式，$G$ 为 $f$ 在单连通域 $B$ 内的任一原函数。

  $$
  \int_{C}f(z)\,\mathrm{d}z\ \text{与路径无关}\iff \oint_{C}f(z)\,\mathrm{d}z=0
  $$
- 前提：$f$ 在单连通域内解析。

## 第四节 柯西积分公式与高阶导数公式

### 4.1 柯西积分公式

$$
f(z_{0})=\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f(z)}{z-z_{0}}\,\mathrm{d}z
\tag{3.4.1}
$$
- $f$ 在 $D$ 内解析，$C$ 为 $D$ 内正向简单闭曲线，$z_{0}$ 在 $C$ 内部。

  $$
  f(z_{0})=\frac{1}{2\pi}\int_{0}^{2\pi}f(z_{0}+R\mathrm{e}^{\mathrm{i}\theta})\,\mathrm{d}\theta
  \tag{3.4.3}
  $$
- 平均值公式：解析函数在圆心的值等于圆周上的平均值。

### 4.2 高阶导数公式与解析函数的无限可微性

$$
f^{(n)}(z)=\frac{n!}{2\pi\mathrm{i}}\oint_{C}\frac{f(\zeta)}{(\zeta-z)^{n+1}}\,\mathrm{d}\zeta,\qquad n=1,2,\cdots
\tag{3.4.4}
$$

$$
f'(z)=\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f(\zeta)}{(\zeta-z)^{2}}\,\mathrm{d}\zeta
\tag{3.4.6}
$$
- $C$ 在解析区域内绕 $z$，内部全含于 $D$。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**解析函数的无限可微性**
> 区域 $D$ 内的解析函数具有任意阶导数，且各阶导数仍解析 —— 这是区别于实变函数的本质属性。

$$
\left|f^{(n)}(z_{0})\right|\leqslant\frac{n!\,M(R)}{R^{n}},\qquad M(R)=\max_{|z-z_{0}|=R}|f(z)|
$$
- 定理 3.12（柯西不等式）。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 3.13（刘维尔）· 定理 3.14（莫雷拉）**
> - $f$ 在**整个复平面**解析且有界 $\Rightarrow$ $f\equiv$ 常数；
> - $f$ 在单连通域 $B$ 内连续且沿 $B$ 内任一简单闭曲线积分为零 $\Rightarrow$ $f$ 在 $B$ 内解析。

$$
f\ \text{在单连通域}\ B\ \text{内解析}\iff f\ \text{连续且}\ \oint_{C}f\,\mathrm{d}z=0\ (\forall C\subset B)
$$

## 第五节 解析函数与调和函数的关系

$$
\frac{\partial^{2}\varphi}{\partial x^{2}}+\frac{\partial^{2}\varphi}{\partial y^{2}}=0
$$
- 拉普拉斯方程；满足它的二阶连续可偏导函数 $\varphi$ 称为调和函数。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 3.15**
> 区域 $D$ 内解析函数 $f=u+\mathrm{i}v$ 的实部 $u$ 与虚部 $v$ 都是 $D$ 内的调和函数。

$$
\frac{\partial u}{\partial x}=\frac{\partial v}{\partial y},\qquad \frac{\partial u}{\partial y}=-\frac{\partial v}{\partial x}
\tag{3.5.1}
$$
- $v$ 为 $u$ 的**共轭调和函数**；逆命题不成立（$u,v$ 均调和推不出 $u+\mathrm{i}v$ 解析）。

  $$
  f(z)=\int U(z)\,\mathrm{d}z+c,\qquad U(z)=u_{x}-\mathrm{i}u_{y}
  \tag{3.5.2}
  $$
- 已知实部 $u$ 求解析函数（不定积分法）。

  $$
  f(z)=\int V(z)\,\mathrm{d}z+c,\qquad V(z)=v_{y}+\mathrm{i}v_{x}
  \tag{3.5.3}
  $$
- 已知虚部 $v$ 求解析函数。

  ---

  [← 第二章 解析函数](/notes/complex/formulas/ch2/) · [总目录](/notes/complex/formulas/toc/) · [第四章 复变函数项级数 →](/notes/complex/formulas/ch4/)

