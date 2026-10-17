---
title: "第一章 复数与复变函数 定理公式总结"
slug: "complex/formulas/ch1"
description: "复数不能比较大小； z 0 当且仅当实部、虚部同时为零。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
updatedDate: "2026-10-17T20:03:50"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第一章 复数与复变函数 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：复数的代数与几何表示 · 乘幂与方根 · 复球面 · 区域 · 复变函数 · 极限与连续

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 复数及其代数运算
- 1.2 复数的几何表示
- 1.3 复数的乘幂与方根
- 1.4 复数在几何上的应用举例
- 1.5 复球面与无穷远点
- 2.1 复平面上的区域
- 2.2 复变函数的概念
- 2.3 复变函数的极限与连续性

</details>

## 第一节 复数的概念与运算

### 1.1 复数及其代数运算

$$
z=x+\mathrm{i}y,\qquad x=\mathrm{Re}(z),\quad y=\mathrm{Im}(z),\qquad \mathrm{i}^{2}=-1
$$
- 复数不能比较大小；$z=0$ 当且仅当实部、虚部同时为零。

  $$
  z_{1}\pm z_{2}=(x_{1}\pm x_{2})+\mathrm{i}(y_{1}\pm y_{2})
  \tag{1.1.1}
  $$

  $$
  z_{1}z_{2}=(x_{1}x_{2}-y_{1}y_{2})+\mathrm{i}(x_{2}y_{1}+x_{1}y_{2})
  \tag{1.1.2}
  $$

  $$
  \frac{z_{1}}{z_{2}}=\frac{x_{1}x_{2}+y_{1}y_{2}}{x_{2}^{2}+y_{2}^{2}}+\mathrm{i}\,\frac{x_{2}y_{1}-x_{1}y_{2}}{x_{2}^{2}+y_{2}^{2}}
  \tag{1.1.3}
  $$
- 实用算法：分子分母同乘 $\overline{z}_{2}$。

  $$
  \overline{z_{1}\pm z_{2}}=\overline{z}_{1}\pm\overline{z}_{2},\quad \overline{z_{1}z_{2}}=\overline{z}_{1}\,\overline{z}_{2},\quad \overline{\left(\frac{z_{1}}{z_{2}}\right)}=\frac{\overline{z}_{1}}{\overline{z}_{2}}
  $$

  $$
  z\overline{z}=x^{2}+y^{2}=|z|^{2},\qquad z+\overline{z}=2\mathrm{Re}(z),\qquad z-\overline{z}=2\mathrm{i}\,\mathrm{Im}(z)
  $$

### 1.2 复数的几何表示

$$
|z|=r=\sqrt{x^{2}+y^{2}},\qquad x=r\cos\theta,\quad y=r\sin\theta
$$

$$
|x|\leqslant|z|,\quad |y|\leqslant|z|,\quad |z|\leqslant|x|+|y|,\quad z\overline{z}=|z|^{2}
$$

$$
|z_{1}+z_{2}|\leqslant|z_{1}|+|z_{2}|
$$
- 三角不等式；$|z_{1}-z_{2}|$ 表示两点间距离。

  $$
  \bigl||z_{1}|-|z_{2}|\bigr|\leqslant|z_{1}-z_{2}|
  $$

  $$
  \mathrm{Arg}\,z=\theta_{1}+2k\pi\quad(k\in\mathbb{Z})
  $$
- $\theta_{1}$ 为任一辐角；主值 $\arg z\in(-\pi,\pi]$。

  $$
  \arg z=\begin{cases}
  \arctan\dfrac{y}{x}, & x>0,\\[2mm]
  \pm\dfrac{\pi}{2}, & x=0,\ y\neq0,\\[2mm]
  \arctan\dfrac{y}{x}+\pi, & x<0,\ y\geqslant0,\\[2mm]
  \arctan\dfrac{y}{x}-\pi, & x<0,\ y<0.
  \end{cases}
  \tag{1.1.4}
  $$
- 其中 $\arctan\frac{y}{x}\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)$；$z=0$ 时辐角无意义。

  $$
  z=r(\cos\theta+\mathrm{i}\sin\theta)=r\mathrm{e}^{\mathrm{i}\theta},\qquad \mathrm{e}^{\mathrm{i}\theta}=\cos\theta+\mathrm{i}\sin\theta
  $$

  $$
  |z_{1}z_{2}|=|z_{1}||z_{2}|,\qquad \mathrm{Arg}(z_{1}z_{2})=\mathrm{Arg}z_{1}+\mathrm{Arg}z_{2}
  \tag{1.1.6}
  $$

  $$
  \left|\frac{z_{1}}{z_{2}}\right|=\frac{|z_{1}|}{|z_{2}|},\qquad \mathrm{Arg}\left(\frac{z_{1}}{z_{2}}\right)=\mathrm{Arg}z_{1}-\mathrm{Arg}z_{2}
  \tag{1.1.7}
  $$
- 两式为**集合等式**；几何上乘法即旋转 $\arg z_{2}$ 并伸缩 $|z_{2}|$ 倍。

### 1.3 复数的乘幂与方根

$$
z^{n}=r^{n}\mathrm{e}^{\mathrm{i}n\theta}=r^{n}(\cos n\theta+\mathrm{i}\sin n\theta)
\tag{1.1.8}
$$

$$
(\cos\theta+\mathrm{i}\sin\theta)^{n}=\cos n\theta+\mathrm{i}\sin n\theta
$$
- 棣莫弗（De Moivre）公式。

  $$
  \sqrt[n]{z}=\sqrt[n]{r}\left(\cos\frac{\theta+2k\pi}{n}+\mathrm{i}\sin\frac{\theta+2k\pi}{n}\right),\quad k=0,1,\cdots,n-1
  \tag{1.1.9}
  $$
- $n$ 个根为内接正 $n$ 边形顶点，半径 $\sqrt[n]{r}$。

### 1.4 复数在几何上的应用

$$
z=z_{1}+t(z_{2}-z_{1}),\quad t\in(-\infty,+\infty)\ \text{直线};\qquad t\in[0,1]\ \text{线段}
$$

$$
z=\frac{z_{1}+z_{2}}{2}
$$
- 连接 $z_{1}$、$z_{2}$ 的线段之中点。

  $$
  \frac{z_{3}-z_{1}}{z_{2}-z_{1}}=t\quad(t\in\mathbb{R},\ t\neq0)
  $$
- 三点 $z_{1},z_{2},z_{3}$ 共线的充要条件。

  $$
  z_{3}-z_{1}=\mathrm{e}^{\mathrm{i}\alpha}(z_{2}-z_{1})
  $$
- 绕 $z_{1}$ 旋转 $\alpha$ 得 $z_{3}$；取 $\alpha=\pm\frac{\pi}{3}$ 得正三角形第三顶点。

### 1.5 复球面与无穷远点

$$
U(\infty,M)=\{z\mid |z|>M\},\qquad \mathbb{C}^{*}=\mathbb{C}\cup\{\infty\},\qquad |\infty|=+\infty
$$
- 复球面（测地投影）使 $\mathbb{C}^{*}$ 与球面一一对应。

  $$
  \alpha\pm\infty=\infty,\qquad \alpha\cdot\infty=\infty\ (\alpha\neq0),\qquad \frac{\alpha}{\infty}=0,\qquad \frac{\infty}{\alpha}=\infty,\qquad \frac{\alpha}{0}=\infty\ (\alpha\neq0)
  $$
- $\infty\pm\infty,\ 0\cdot\infty,\ \frac{\infty}{\infty},\ \frac{0}{0}$ 均无意义；$\infty$ 无正负之分。

## 第二节 复变函数及其极限与连续性

### 2.1 复平面上的区域

$$
U(z_{0},\delta)=\{z\mid |z-z_{0}|<\delta\},\qquad \mathring{U}(z_{0},\delta)=\{z\mid 0<|z-z_{0}|<\delta\}
$$

$$
D\ \text{为区域}\iff D\ \text{开集且连通};\qquad \overline{D}=D\cup\partial D
$$
- 区域不含边界点；$\overline{D}$ 为闭区域。

  $$
  D\ \text{有界}\iff \exists M>0,\ \forall z\in D:\ |z|\leqslant M
  $$

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**若尔当定理**
> 任一简单闭曲线 $C$ 把复平面唯一分成三部分：$C$ 的内部（有界区域）、$C$ 的外部（无界区域）、$C$ 本身。

$$
D\ \text{单连通}\iff D\ \text{内任一简单闭曲线的内部全含于}\ D
$$
- 圆内部、上半平面、角形域、带形域为单连通；圆外部、圆环域为多连通。

### 2.2 复变函数的概念

$$
w=f(z)=u(x,y)+\mathrm{i}v(x,y),\qquad z=x+\mathrm{i}y\in G
$$
- 一个复变函数对应两个二元实变函数 $u,v$。

  $$
  z=f^{-1}\bigl[f(z)\bigr]=z,\qquad w=f\bigl[f^{-1}(w)\bigr]=w
  $$
- $f$ 单叶 $\iff$ $f$ 是 $G$ 到 $G^{*}$ 的一一映射。

  $$
  \boldsymbol{A}=\boldsymbol{A}(z)=A_{x}(x,y)+\mathrm{i}A_{y}(x,y)
  $$
- 平面向量场可用复变函数表示（流速场、静电场）。

### 2.3 复变函数的极限与连续性

$$
\lim_{z\to z_{0}}f(z)=A\iff \forall\varepsilon>0,\ \exists\delta>0:\ 0<|z-z_{0}|<\delta\Rightarrow|f(z)-A|<\varepsilon
$$
- 要求 $z$ 沿**任意路径**趋于 $z_{0}$ 时极限同值，比实变严格。

  $$
  \lim_{z\to z_{0}}f(z)=A=u_{0}+\mathrm{i}v_{0}\iff \lim_{(x,y)\to(x_{0},y_{0})}u=u_{0},\quad \lim_{(x,y)\to(x_{0},y_{0})}v=v_{0}
  \tag{1.2.2}
  $$

  $$
  \lim_{z\to z_{0}}\bigl[f\pm g\bigr]=A\pm B,\qquad \lim fg=AB,\qquad \lim\frac{f}{g}=\frac{A}{B}\ (B\neq0)
  $$

  $$
  f(z)\ \text{在}\ z_{0}\ \text{连续}\iff \lim_{z\to z_{0}}f(z)=f(z_{0})
  $$

  $$
  f=u+\mathrm{i}v\ \text{在}\ z_{0}\ \text{连续}\iff u,\ v\ \text{在}\ (x_{0},y_{0})\ \text{同时连续}
  $$
- 多项式在 $\mathbb{C}$ 上处处连续；有理分式在分母非零点连续。

  $$
  |f(z)|\leqslant M,\quad z\in\Gamma
  $$
- $f$ 在闭曲线（含端点曲线段）$\Gamma$ 上连续则有界。

  ---

  [总目录](/notes/complex/formulas/toc/) · [第二章 解析函数 →](/notes/complex/formulas/ch2/)

