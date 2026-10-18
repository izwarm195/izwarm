---
title: "第二章 解析函数 定理公式总结"
slug: "complex/formulas/ch2"
description: "要求 Delta z to0 的方式任意，极限同值。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
updatedDate: "2026-10-18T08:50:07"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第二章 解析函数 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：导数与微分 · 解析函数 · C-R 方程与判定定理 · 指数与对数 · 乘幂 · 三角与双曲 · 反函数

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 复变函数的导数与微分
- 1.2 解析函数的概念及其运算性质
- 1.3 判定函数解析性的方法
- 2.1 指数函数
- 2.2 对数函数
- 2.3 乘幂与幂函数
- 2.4 三角函数与双曲函数
- 2.5 反三角函数与反双曲函数

</details>

## 第一节 解析函数的概念及其判定

### 1.1 复变函数的导数与微分

$$
f'(z_{0})=\left.\frac{\mathrm{d}w}{\mathrm{d}z}\right|_{z=z_{0}}=\lim_{\Delta z\to0}\frac{f(z_{0}+\Delta z)-f(z_{0})}{\Delta z}
\tag{2.1.1}
$$
- 要求 $\Delta z\to0$ 的方式任意，极限同值。

  $$
  \Delta w=f'(z_{0})\Delta z+\rho(\Delta z)\Delta z,\qquad \lim_{\Delta z\to0}\rho(\Delta z)=0
  \tag{2.1.2}
  $$

  $$
  \mathrm{d}w=f'(z_{0})\mathrm{d}z
  $$
- 可导 $\iff$ 可微；可导必连续，反之不然。

  $$
  [f\pm g]'=f'\pm g',\qquad [fg]'=f'g+fg',\qquad \left[\frac{f}{g}\right]'=\frac{f'g-fg'}{g^{2}}
  $$

  $$
  \bigl(f[g(z)]\bigr)'=f'(w)g'(z),\qquad f'(z)=\frac{1}{g'(w)}\ \ (w=f(z),\ z=g(w))
  $$

  $$
  (z^{n})'=nz^{n-1}
  $$

### 1.2 解析函数的概念及其运算性质

$$
f(z)\ \text{在}\ z_{0}\ \text{解析}\iff f\ \text{在}\ z_{0}\ \text{及其某邻域内处处可导}
$$
- 区域内解析 $\iff$ 区域内可导；一点解析强于一点可导。

  $$
  f(z)\ \text{在}\ z_{0}\ \text{不解析}\ \Rightarrow\ z_{0}\ \text{为}\ f\ \text{的奇点}
  $$
- 两解析函数的和、差、积、商（分母非零）仍解析；解析函数的复合仍解析。

### 1.3 判定函数解析性的方法

$$
\frac{\partial u}{\partial x}=\frac{\partial v}{\partial y},\qquad \frac{\partial u}{\partial y}=-\frac{\partial v}{\partial x}
\tag{2.1.7}
$$
- 柯西-黎曼（C-R）方程，是实部与虚部的联系条件。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 2.1（可导的必要条件）**
> $f=u+\mathrm{i}v$ 在 $z=x+\mathrm{i}y$ 可导 $\Rightarrow$ 四个偏导数在 $(x,y)$ 存在，且满足 C-R 方程。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 2.2 / 2.3（可导、解析的充要条件）**
> - 可导 $\iff$ $u,v$ 在 $(x,y)$ **可微**且满足 C-R 方程；
> - 在 $D$ 内解析 $\iff$ $u,v$ 在 $D$ 内可微且满足 C-R 方程。

> <img class="callout-badge" src="/media/icons/lightbulb.svg" alt="tip">**推论 2.2（最常用的充分条件）**
> $u,v$ 在 $D$ 内具有**一阶连续偏导数**且满足 C-R 方程 $\Rightarrow$ $f=u+\mathrm{i}v$ 在 $D$ 内解析。

$$
f'(z)=\frac{\partial u}{\partial x}+\mathrm{i}\frac{\partial v}{\partial x}=\frac{1}{\mathrm{i}}\frac{\partial u}{\partial y}+\frac{\partial v}{\partial y}
\tag{2.1.8}
$$

$$
f'(z)\equiv0\ (z\in D)\ \Longrightarrow\ f(z)\equiv\text{常数}
$$

$$
k_{1}k_{2}=-1
$$
- $f$ 解析且 $f'(z)\neq0$ 时，曲线族 $u=c_{1}$ 与 $v=c_{2}$ 处处正交。

## 第二节 复变初等函数

### 2.1 指数函数

$$
\exp z=\mathrm{e}^{z}=\mathrm{e}^{x}(\cos y+\mathrm{i}\sin y),\qquad z=x+\mathrm{i}y
\tag{2.2.1}
$$

$$
|e^{z}|=e^{x},\qquad \mathrm{Arg}(e^{z})=y+2k\pi,\qquad e^{z}\neq0
$$

$$
e^{z_{1}}e^{z_{2}}=e^{z_{1}+z_{2}},\qquad e^{z+2k\pi\mathrm{i}}=e^{z},\qquad (e^{z})'=e^{z}
$$
- 以 $2k\pi\mathrm{i}$ 为周期，是复变函数与实变函数的本质差异之一。

### 2.2 对数函数

$$
\mathrm{Ln}\,z=\ln|z|+\mathrm{i}\arg z
\tag{2.2.2}
$$
- 多值，任意两值相差 $2k\pi\mathrm{i}$。

  $$
  \ln z=\ln|z|+\mathrm{i}\arg z
  \tag{2.2.3}
  $$
- 主值分支，$\arg z\in(-\pi,\pi]$。

  $$
  \mathrm{Ln}\,z=\ln z+2k\pi\mathrm{i}\quad(k=\pm1,\pm2,\cdots)
  \tag{2.2.4}
  $$

  $$
  \mathrm{Ln}(z_{1}z_{2})=\mathrm{Ln}\,z_{1}+\mathrm{Ln}\,z_{2},\qquad \mathrm{Ln}\frac{z_{1}}{z_{2}}=\mathrm{Ln}\,z_{1}-\mathrm{Ln}\,z_{2}
  $$
- 集合等式；主值分支上一般不成立。

  $$
  (\ln z)'=\frac{1}{z}
  $$
- 各分支在**除去原点与负实轴**的复平面内解析。

### 2.3 乘幂与幂函数

$$
a^{b}=\mathrm{e}^{b\,\mathrm{Ln}\,a}\qquad(a\neq0)
\tag{2.2.5}
$$
- $b\in\mathbb{Z}$ 单值；$b=\frac{p}{q}$ 取 $q$ 个值；$b$ 为无理数或复数时无穷多值。

  $$
  \begin{aligned}
  a^{\frac{p}{q}}&=\mathrm{e}^{\frac{p}{q}\left[\ln|a|+\mathrm{i}(\arg a+2k\pi)\right]}\\
  &=\mathrm{e}^{\frac{p}{q}\ln|a|}\left[\cos\frac{p}{q}(\arg a+2k\pi)+\mathrm{i}\sin\frac{p}{q}(\arg a+2k\pi)\right]
  \end{aligned}
  \tag{2.2.6}
  $$
- $p,q$ 互素、$q>0$；取 $k=0,1,\cdots,q-1$ 得 $q$ 个值。

  $$
  z^{b}=\mathrm{e}^{b\,\mathrm{Ln}\,z},\qquad (z^{b})'=bz^{b-1}
  $$
- 各分支在除去原点与负实轴的复平面内解析。

### 2.4 三角函数与双曲函数

$$
\cos z=\frac{\mathrm{e}^{\mathrm{i}z}+\mathrm{e}^{-\mathrm{i}z}}{2},\qquad \sin z=\frac{\mathrm{e}^{\mathrm{i}z}-\mathrm{e}^{-\mathrm{i}z}}{2\mathrm{i}}
\tag{2.2.8}
$$

$$
(\sin z)'=\cos z,\qquad (\cos z)'=-\sin z
$$

$$
\sin(z_{1}+z_{2})=\sin z_{1}\cos z_{2}+\cos z_{1}\sin z_{2},\qquad \cos^{2}z+\sin^{2}z=1
$$

$$
\tan z=\frac{\sin z}{\cos z},\quad \cot z=\frac{\cos z}{\sin z},\quad \sec z=\frac{1}{\cos z},\quad \csc z=\frac{1}{\sin z}
$$

$$
z=k\pi\ \text{为}\ \sin z\ \text{零点};\qquad z=k\pi+\frac{\pi}{2}\ \text{为}\ \cos z\ \text{零点}
$$
- $|\sin z|\leqslant1$、$|\cos z|\leqslant1$ 在复数范围内**不再成立**。

  $$
  \mathrm{sh}\,z=\frac{\mathrm{e}^{z}-\mathrm{e}^{-z}}{2},\qquad \mathrm{ch}\,z=\frac{\mathrm{e}^{z}+\mathrm{e}^{-z}}{2},\qquad \mathrm{th}\,z=\frac{\mathrm{sh}\,z}{\mathrm{ch}\,z}
  $$

  $$
  (\mathrm{sh}\,z)'=\mathrm{ch}\,z,\qquad (\mathrm{ch}\,z)'=\mathrm{sh}\,z
  $$
- 均以 $2\pi\mathrm{i}$ 为周期。

  $$
  \cos \mathrm{i}y=\mathrm{ch}\,y,\qquad \sin \mathrm{i}y=\mathrm{i}\,\mathrm{sh}\,y
  \tag{2.2.9}
  $$

  $$
  \left.\begin{aligned}
  \cos(x+\mathrm{i}y)&=\cos x\,\mathrm{ch}\,y-\mathrm{i}\sin x\,\mathrm{sh}\,y,\\
  \sin(x+\mathrm{i}y)&=\sin x\,\mathrm{ch}\,y+\mathrm{i}\cos x\,\mathrm{sh}\,y
  \end{aligned}\right\}
  \tag{2.2.10}
  $$

  $$
  \left.\begin{aligned}
  \mathrm{ch}\,\mathrm{i}y&=\cos y,\quad \mathrm{sh}\,\mathrm{i}y=\mathrm{i}\sin y,\\
  \mathrm{ch}(x+\mathrm{i}y)&=\mathrm{ch}\,x\cos y+\mathrm{i}\,\mathrm{sh}\,x\sin y,\\
  \mathrm{sh}(x+\mathrm{i}y)&=\mathrm{sh}\,x\cos y+\mathrm{i}\,\mathrm{ch}\,x\sin y
  \end{aligned}\right\}
  \tag{2.2.11}
  $$

### 2.5 反三角函数与反双曲函数

$$
\mathrm{Arccos}\,z=-\mathrm{i}\,\mathrm{Ln}\bigl(z+\sqrt{z^{2}-1}\bigr)
\tag{2.2.13}
$$

$$
\mathrm{Arcsin}\,z=-\mathrm{i}\,\mathrm{Ln}\bigl(\mathrm{i}z+\sqrt{1-z^{2}}\bigr),\qquad \mathrm{Arctan}\,z=-\frac{\mathrm{i}}{2}\mathrm{Ln}\frac{1+\mathrm{i}z}{1-\mathrm{i}z}
$$

$$
\mathrm{Arsh}\,z=\mathrm{Ln}\bigl(z+\sqrt{z^{2}+1}\bigr),\quad \mathrm{Arch}\,z=\mathrm{Ln}\bigl(z+\sqrt{z^{2}-1}\bigr),\quad \mathrm{Arth}\,z=\frac{1}{2}\mathrm{Ln}\frac{1+z}{1-z}
$$
- 以上均为多值函数，多值性源于指数函数的周期性与三角函数的偶性。

  ---

  [← 第一章 复数与复变函数](/notes/complex/formulas/ch1/) · [总目录](/notes/complex/formulas/toc/) · [第三章 复变函数的积分 →](/notes/complex/formulas/ch3/)

