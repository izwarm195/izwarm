---
title: "第五章 留数及其应用 定理公式总结"
slug: "complex/formulas/ch5"
description: "类型 洛朗级数特征 lim limits_{z to z_{0}}f(z)"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第五章 留数及其应用 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：孤立奇点分类 · 零点与极点 · 无穷远点 · 留数定理与计算规则 · 三类实积分

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 孤立奇点及其分类
- 1.2 函数的零点与极点的关系
- 1.3 函数在无穷远点的性态
- 2.1 留数的定义及留数定理
- 2.2 计算留数的方法
- 2.3 函数在无穷远点处的留数
- 3.1 形如 $\int_{0}^{2\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta$ 的积分
- 3.2 形如 $\int_{-\infty}^{+\infty}R(x)\,\mathrm{d}x$ 的积分
- 3.3 形如 $\int_{-\infty}^{+\infty}R(x)\mathrm{e}^{a\mathrm{i}x}\,\mathrm{d}x$ 的积分

</details>

## 第一节 解析函数的孤立奇点

### 1.1 孤立奇点及其分类

$$
z_{0}\ \text{为孤立奇点}\iff f\ \text{在}\ z_{0}\ \text{不解析，在}\ 0<|z-z_{0}|<\delta\ \text{内处处解析}
$$

| 类型 | 洛朗级数特征 | $\lim\limits_{z\to z_{0}}f(z)$ |
| --- | --- | --- |
| 可去奇点 | 不含负幂项 | 存在且为有限值 |
| $m$ 级极点 | 负幂项有限，最低次为 $(z-z_{0})^{-m}$ | $\infty$ |
| 本性奇点 | 含无穷多个负幂项 | 不存在且不为 $\infty$ |

$$
f(z)=\frac{1}{(z-z_{0})^{m}}g(z),\qquad g\ \text{在}\ |z-z_{0}|<\delta\ \text{内解析},\ g(z_{0})\neq0
\tag{5.1.1}
$$
- $z_{0}$ 为 $m$ 级极点的充要条件。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 5.1（魏尔斯特拉斯）**
> $z_{0}$ 为本性奇点 $\Rightarrow$ 对任意 $a\in\mathbb{C}^{*}$，存在 $z_{n}\to z_{0}$ 使 $f(z_{n})\to a$。

### 1.2 函数的零点与极点的关系

$$
f(z)=(z-z_{0})^{m}\varphi(z),\qquad \varphi(z_{0})\neq0
\tag{5.1.2}
$$
- $z_{0}$ 为 $f$ 的 $m$ 级零点；不恒为零的解析函数其零点是孤立的。

  $$
  f^{(n)}(z_{0})=0\ (n=0,1,\cdots,m-1),\qquad f^{(m)}(z_{0})\neq0
  \tag{5.1.3}
  $$
- 用导数判定 $m$ 级零点。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 5.3**
> $z_{0}$ 是 $f$ 的 $m$ 级极点 $\iff$ $z_{0}$ 是 $\dfrac{1}{f}$ 的 $m$ 级零点。

$$
\left(\sin z\right)'\big|_{z=k\pi}=(-1)^{k}\neq0
$$
- 故 $z=k\pi$ 是 $\sin z$ 的一级零点，是 $\csc z$ 的一级极点。

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**判型不可只看表面**
> $\dfrac{\mathrm{e}^{z}-1}{z^{2}}$ 的一级极点、$\dfrac{1-\cos z}{z^{2}}$ 的可去奇点，都须先展开再定级。

### 1.3 函数在无穷远点的性态

$$
f(z)=\sum_{n=1}^{\infty}c_{-n}z^{-n}+c_{0}+\sum_{n=1}^{\infty}c_{n}z^{n},\qquad c_{n}=\frac{1}{2\pi\mathrm{i}}\oint_{C}\frac{f(\zeta)}{\zeta^{n+1}}\,\mathrm{d}\zeta
\tag{5.1.5}
$$
- 按**正幂项**个数分类：无正幂项 $\to$ 可去；最高正幂 $z^{m}$ $\to$ $m$ 级极点；无穷多正幂项 $\to$ 本性。

  $$
  t=\frac{1}{z},\qquad \varphi(t)=f\!\left(\frac{1}{t}\right)
  $$
- $\infty$ 的性态由 $\varphi(t)$ 在 $t=0$ 的性态定义；$\lim_{z\to\infty}f(z)=\lim_{t\to0}\varphi(t)$。

## 第二节 留数与留数定理

### 2.1 留数的定义及留数定理

$$
\mathrm{Res}\left[f(z),z_{0}\right]=\frac{1}{2\pi\mathrm{i}}\oint_{C}f(z)\,\mathrm{d}z=c_{-1}
\tag{5.2.1}
$$
- 即洛朗展开式中 $(z-z_{0})^{-1}$ 的系数；可去奇点留数为 $0$。

  $$
  \oint_{C}f(z)\,\mathrm{d}z=2\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[f(z),z_{k}\right]
  \tag{5.2.2}
  $$
- 留数定理：整体积分化为各奇点留数之和。

### 2.2 计算留数的方法

$$
\mathrm{Res}\left[f(z),z_{0}\right]=\frac{1}{(m-1)!}\lim_{z\to z_{0}}\frac{\mathrm{d}^{m-1}}{\mathrm{d}z^{m-1}}\left\{(z-z_{0})^{m}f(z)\right\}
\tag{5.2.3}
$$
- 规则一：$z_{0}$ 为 $m$ 级极点。

  $$
  \mathrm{Res}\left[f(z),z_{0}\right]=\lim_{z\to z_{0}}(z-z_{0})f(z)
  \tag{5.2.4}
  $$
- 规则一取 $m=1$（一级极点）。

  $$
  \mathrm{Res}\left[f(z),z_{0}\right]=\frac{\varphi(z_{0})}{\psi'(z_{0})},\qquad f(z)=\frac{\varphi(z)}{\psi(z)}
  \tag{5.2.5}
  $$
- 规则二：$\varphi(z_{0})\neq0$，$\psi(z_{0})=0$，$\psi'(z_{0})\neq0$。

> <img class="callout-badge" src="/media/icons/lightbulb.svg" alt="tip">**三级以上极点**
> 求导次数高时改用洛朗展开取 $c_{-1}$ 更快，如 $\dfrac{1-\cos z}{z^{6}}$ 在 $z=0$ 的留数为 $0$。

### 2.3 函数在无穷远点处的留数

$$
\mathrm{Res}\left[f(z),\infty\right]=\frac{1}{2\pi\mathrm{i}}\oint_{C^{-}}f(z)\,\mathrm{d}z=-c_{-1}
\tag{5.2.6}
$$
- $C^{-}$ 为绕原点的负向（即绕 $\infty$ 的正向）。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 5.5（留数总和为零）**
> $f$ 在扩充复平面上只有有限个孤立奇点 $\Rightarrow$ 各奇点（含 $\infty$）留数之和为零。

$$
\mathrm{Res}\left[f(z),\infty\right]=-\mathrm{Res}\left[f\!\left(\frac{1}{z}\right)\frac{1}{z^{2}},0\right]
$$
- 规则三：把 $\infty$ 处留数化为原点处留数，常用于奇点多或极点级数高时。

  $$
  \oint_{C}f(z)\,\mathrm{d}z=-2\pi\mathrm{i}\,\mathrm{Res}\left[f(z),\infty\right]\qquad(C\ \text{内含全部有限奇点})
  $$

## 第三节 留数定理在计算实积分中的应用

### 3.1 形如 $\int_{0}^{2\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta$ 的积分

$$
z=\mathrm{e}^{\mathrm{i}\theta},\quad \cos\theta=\frac{z^{2}+1}{2z},\quad \sin\theta=\frac{z^{2}-1}{2\mathrm{i}z},\quad \mathrm{d}\theta=\frac{\mathrm{d}z}{\mathrm{i}z}
$$

$$
\int_{0}^{2\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta=2\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[f(z),z_{k}\right]
$$
- $z_{k}$ 为 $f(z)=R\!\left(\frac{z^{2}+1}{2z},\frac{z^{2}-1}{2\mathrm{i}z}\right)\frac{1}{\mathrm{i}z}$ 在 $|z|<1$ 内的奇点。

  $$
  \int_{0}^{\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta=\frac{1}{2}\int_{-\pi}^{\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta
  $$
- $R$ 为偶函数时可用同一代换。

### 3.2 形如 $\int_{-\infty}^{+\infty}R(x)\,\mathrm{d}x$ 的积分

$$
\int_{-\infty}^{+\infty}R(x)\,\mathrm{d}x=2\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[R(z),z_{k}\right]
\tag{5.3.2}
$$
- 条件：$R=P/Q$ 互质，$\deg Q-\deg P\geqslant2$，$Q$ 在实轴无零点；$z_{k}$ 为上半平面极点。

  $$
  \int_{0}^{+\infty}R(x)\,\mathrm{d}x=\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[R(z),z_{k}\right]
  $$
- $R(x)$ 为偶函数时。

### 3.3 形如 $\int_{-\infty}^{+\infty}R(x)\mathrm{e}^{a\mathrm{i}x}\,\mathrm{d}x$ 的积分

$$
\int_{-\infty}^{+\infty}R(x)\mathrm{e}^{a\mathrm{i}x}\,\mathrm{d}x=2\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[R(z)\mathrm{e}^{a\mathrm{i}z},z_{k}\right],\qquad a>0
\tag{5.3.3}
$$
- 条件：$\deg Q-\deg P\geqslant1$，$Q$ 在实轴无零点；$z_{k}$ 为上半平面极点。

  $$
  \int_{-\infty}^{+\infty}R(x)\cos ax\,\mathrm{d}x+\mathrm{i}\int_{-\infty}^{+\infty}R(x)\sin ax\,\mathrm{d}x=2\pi\mathrm{i}\sum_{k=1}^{n}\mathrm{Res}\left[R(z)\mathrm{e}^{a\mathrm{i}z},z_{k}\right]
  $$
- 取实部 / 虚部分别得余弦、正弦型积分。

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**主值 vs 收敛**
> 上式求得的是**柯西主值** $\lim_{R\to+\infty}\int_{-R}^{R}$；当无穷积分本身收敛时二者相等。

---

[← 第四章 复变函数项级数](/notes/complex/formulas/ch4/) · [总目录](/notes/complex/formulas/toc/) · [第六章 共形映射 →](/notes/complex/formulas/ch6/)

