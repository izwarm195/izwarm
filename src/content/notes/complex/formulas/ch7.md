---
title: "第七章 解析函数在科技中的应用选讲 定理公式总结"
slug: "complex/formulas/ch7"
description: "环流量：实部为环量 Gamma_{C} ，虚部为流量 N_{C} ； v(z) v_{x}+ mathrm{i}v_{y} 为复速度。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第七章 解析函数在科技中的应用选讲 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：平面流速场与静电场 · 复势 · 对数留数与辐角原理 · 儒歇定理 · 茹科夫斯基函数

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 平面流速场的流量和环量
- 1.2 平面流速场的复势函数
- 1.3 平面静电场的复势函数
- 2.1 对数留数
- 2.2 辐角原理与函数方程根的分布问题
- 2.3 儒歇定理
- 3.1 机翼剖面绕流问题
- 3.2 茹科夫斯基函数与机翼剖面绕流问题

</details>

## 第一节 解析函数在平面向量场中的应用

### 1.1 平面流速场的流量和环量

$$
\Gamma_{C}+\mathrm{i}N_{C}=\int_{C}\overline{v(z)}\,\mathrm{d}z
\tag{7.1.1}
$$
- 环流量：实部为环量 $\Gamma_{C}$，虚部为流量 $N_{C}$；$v(z)=v_{x}+\mathrm{i}v_{y}$ 为复速度。

  $$
  N_{C}=\int_{C}-v_{y}\,\mathrm{d}x+v_{x}\,\mathrm{d}y,\qquad \Gamma_{C}=\int_{C}v_{x}\,\mathrm{d}x+v_{y}\,\mathrm{d}y
  $$

### 1.2 平面流速场的复势函数

$$
f'(z)=\overline{v(z)},\qquad f(z)=\int_{z_{0}}^{z}\overline{v(z)}\,\mathrm{d}z
$$
- 复势定义；无源无旋场中 $v(z)$ 解析，复势存在且（单连通域内）单值。

  $$
  \oint_{C}\overline{v(z)}\,\mathrm{d}z=0\ \ (\forall C\subset B)\iff v(z)\ \text{在}\ B\ \text{内解析}
  $$
- 无源无旋的充要条件（莫雷拉定理）。

  $$
  f(z)=\varphi(x,y)+\mathrm{i}\psi(x,y)
  $$
- $\varphi$ 为势函数，等值线 $\varphi=c_{1}$ 为等势线；$\psi$ 为流函数，等值线 $\psi=c_{2}$ 为流线；二者在 $v\neq0$ 处正交。

  $$
  v_{x}=\varphi_{x}=\psi_{y},\qquad v_{y}=-\psi_{x}=\varphi_{y}
  $$
- 由 $f'(z)=\overline{v(z)}$ 与 C-R 方程得。

  $$
  v=\frac{N_{C}}{2\pi|z|}\cdot\frac{z}{|z|}=\frac{N_{C}}{2\pi}\cdot\frac{1}{\overline{z}}
  \tag{7.1.2}
  $$
- 单个源点（强度 $N_{C}$）的流速场。

  $$
  f(z)=\frac{N_{C}}{2\pi}\mathrm{Ln}\,z+c
  \tag{7.1.3}
  $$

  $$
  \varphi=\frac{N_{C}}{2\pi}\ln|z|+c_{1},\qquad \psi=\frac{N_{C}}{2\pi}\mathrm{Arg}\,z+c_{2}
  $$
- 源点场：流线为射线，等势线为同心圆。

  $$
  f(z)=az\ \Rightarrow\ v=a,\ \psi=ay,\ \varphi=ax
  $$
- 均匀流；$f(z)=z^{2}$ 给出正交等轴双曲线族；$f(z)=1/z$ 为偶极子（重源）。

### 1.3 平面静电场的复势函数

$$
f'(z)=\overline{E(z)},\qquad f(z)=\int_{z_{0}}^{z}\overline{E(z)}\,\mathrm{d}z
$$
- 复电位；无源无旋静电场中 $\overline{E(z)}$ 解析。

  $$
  E=-\mathrm{i}f'(z)
  $$
- 电工习惯：以 $\psi$（电通量函数）为实部、$\varphi$（电位函数）为虚部，故多一个因子 $-\mathrm{i}$。

  $$
  \int_{C}\boldsymbol{E}\cdot\boldsymbol{n}\,\mathrm{d}s=\int_{C}-E_{y}\,\mathrm{d}x+E_{x}\,\mathrm{d}y
  $$
- 电通量；$\int_{C}\boldsymbol{E}\cdot\boldsymbol{\tau}\,\mathrm{d}s$ 为电压（环量）。

## 第二节 辐角原理及其应用

### 2.1 对数留数

$$
\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f'(z)}{f(z)}\,\mathrm{d}z
$$
- $f$ 关于 $C$ 的对数留数；$f$ 在 $C$ 内除有限个极点外解析，在 $C$ 上解析且不为零。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**引理**
> $a$ 为 $f$ 的 $n$ 级零点、$b$ 为 $f$ 的 $m$ 级极点 $\Rightarrow$ $a,b$ 均为 $f'/f$ 的一级极点，且
>
> $$
> \mathrm{Res}\left[\frac{f'}{f},a\right]=n,\qquad \mathrm{Res}\left[\frac{f'}{f},b\right]=-m
> $$

$$
\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f'(z)}{f(z)}\,\mathrm{d}z=N-P
\tag{7.2.1}
$$
- $N$、$P$ 分别为 $C$ 内零点、极点的**总个数**（按级数计）。

### 2.2 辐角原理与函数方程根的分布问题

$$
N-P=\frac{1}{2\pi}\Delta_{C}\mathrm{Arg}\,f(z)
\tag{7.2.2}
$$
- 辐角原理：$z$ 沿 $C$ 正向绕行一周时 $f(z)$ 的辐角改变量除以 $2\pi$。

  $$
  N=\frac{1}{2\pi}\Delta_{C}\mathrm{Arg}\,f(z)
  \tag{7.2.3}
  $$
- $f$ 在 $C$ 内解析（无极点）时的零点个数公式。

  $$
  \Delta_{C}\mathrm{Arg}\,f(z)=\mathrm{Im}\oint_{C}\frac{f'(z)}{f(z)}\,\mathrm{d}z
  $$
- 因 $\oint_{C}\mathrm{d}\ln|f(z)|=0$，故对数留数的虚部即辐角改变量；它表示像曲线 $\Gamma=f(C)$ 绕原点的**回转次数**乘以 $2\pi$，恒为 $2\pi$ 的整数倍。

  $$
  \Delta_{y:-\infty\to+\infty}\mathrm{Arg}\,P(\mathrm{i}y)=n\pi
  $$
- $n$ 次多项式零点全在左半平面 $\mathrm{Re}\,z<0$ 的充要条件（虚轴上无零点），即 $P(\mathrm{i}y)$ 绕原点转 $n/2$ 圈。

### 2.3 儒歇定理

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 7.3（Rouché）**
> $f,g$ 在简单闭曲线 $C$ 上及其内部解析，且在 $C$ 上 $|f(z)|>|g(z)|$，则 $f$ 与 $f+g$ 在 $C$ 内部**零点个数相同**。

$$
\left|f(z)+g(z)\right|\geqslant|f(z)|-|g(z)|>0\qquad(z\in C)
$$
- 保证 $f+g$ 在 $C$ 上无零点，从而可对 $f+g$ 用辐角原理。

  $$
  \left|\frac{g(z)}{f(z)}\right|<1\ \Longrightarrow\ \Delta_{C}\mathrm{Arg}\left[1+\frac{g(z)}{f(z)}\right]=0
  $$
- 证明要点：像曲线落在 $|w-1|<1$ 内，不绕原点。

  $$
  a_{0}z^{n}+a_{1}z^{n-1}+\cdots+a_{n}=0\ \text{有且仅有}\ n\ \text{个根}
  \tag{7.2.5}
  $$
- 代数基本定理：取 $f=a_{0}z^{n}$、$g$ 为其余项，$R$ 充分大即可。

  $$
  |a_{k}|>|a_{0}|+\cdots+|a_{k-1}|+|a_{k+1}|+\cdots+|a_{n}|
  \tag{7.2.6}
  $$
- 满足此条件时，方程在 $|z|<1$ 内恰有 $n-k$ 个根（取 $f=a_{k}z^{n-k}$）。

## 第三节 共形映射在航空动力学中的应用

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**编号说明**
> 原书第三节各式的式号沿用 (7.2.x) 序列，与 2.2 段的 (7.2.1)–(7.2.6) 连排，易与上一节混淆；此处不另加式号标签，按节名回查原文即可。

### 3.1 机翼剖面绕流问题

$$
w=f(z)\ \text{需单叶（逆映射存在）且保角（流线与等势线正交性保持）}
$$
- 故须用单叶解析函数构成的共形映射，把机翼剖面外部化为圆柱外部。

### 3.2 茹科夫斯基函数与机翼剖面绕流问题

$$
w=\frac{1}{2}\left(z+\frac{a^{2}}{z}\right)\qquad(a>0)
$$
- 茹科夫斯基函数；除 $z=0,\infty$ 外解析，二者均为一级极点。

  $$
  \frac{\mathrm{d}w}{\mathrm{d}z}=\frac{1}{2}\left(1-\frac{a^{2}}{z^{2}}\right)
  $$
- 除 $z=\pm a$ 外处处保角。

  $$
  z_{1}z_{2}=a^{2}
  $$
- 单叶性条件；圆周 $|z|=a$ 的内部与外部均为其单叶性区域，故都构成共形映射。

  $$
  \frac{w-a}{w+a}=\frac{(z-a)^{2}}{(z+a)^{2}}
  $$
- 分解为 $z_{1}=\dfrac{z-a}{z+a}$、$z_{2}=z_{1}^{2}$、$\dfrac{w-a}{w+a}=z_{2}$ 的复合。

  $$
  w=\frac{1}{2}\left(z+\frac{1}{z}\right)
  $$
- $a=1$ 的特例：把 $|z|=1$ 的内部（或外部）共形映为沿 $[-1,1]$ 割开的扩充平面。

  $$
  u=\frac{1}{2}\left(r+\frac{1}{r}\right)\cos\theta,\qquad v=\frac{1}{2}\left(r-\frac{1}{r}\right)\sin\theta
  $$

  $$
  \frac{u^{2}}{\frac{1}{4}\left(r+\frac{1}{r}\right)^{2}}+\frac{v^{2}}{\frac{1}{4}\left(r-\frac{1}{r}\right)^{2}}=1
  $$
- 圆族 $|z|=r$ 映为**共焦点椭圆族**，$c^{2}=a^{2}-b^{2}=1$。

  $$
  a=\frac{1}{2}\left(r+\frac{1}{r}\right),\qquad b=\frac{1}{2}\left(r-\frac{1}{r}\right)
  $$
- 椭圆长、短半轴；$r\to1^{-}$ 时退化为割痕 $[-1,1]$。

  $$
  z=w+\sqrt{w^{2}-a^{2}}
  $$
- 茹科夫斯基函数的反函数（单值分支），把翼型外部共形映为圆外部，从而把机翼绕流化为圆柱绕流。

  ---

  [← 第六章 共形映射](/notes/complex/formulas/ch6/) · [总目录](/notes/complex/formulas/toc/)

