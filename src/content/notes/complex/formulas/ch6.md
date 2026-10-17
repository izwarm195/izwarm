---
title: "第六章 共形映射 定理公式总结"
slug: "complex/formulas/ch6"
description: "mathrm{Arg} ,f'(z_{0}) 为曲线 C 经映射后在 z_{0} 处的 转动角 ，与曲线形状无关。"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula"]
series: ["Complex","复变函数定理公式总结"]
---

# 第六章 共形映射 定理公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 收录：**只保留结论性公式**（定义式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：导数的几何意义 · 共形映射 · 分式线性映射 · 幂函数与根式 · 指数与对数映射

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 1.1 解析函数导数的几何意义
- 1.2 共形映射的概念与单叶解析函数的共形性
- 2.1 分式线性映射及其构成
- 2.2 分式线性映射的性质
- 2.3 分式线性映射应用举例
- 3.1 幂函数与根式函数
- 3.2 指数函数与对数函数

</details>

## 第一节 共形映射的概念

### 1.1 解析函数导数的几何意义

$$
\mathrm{Arg}\,w'(t_{0})-\mathrm{Arg}\,z'(t_{0})=\mathrm{Arg}\,f'(z_{0})
\tag{6.1.1}
$$
- $\mathrm{Arg}\,f'(z_{0})$ 为曲线 $C$ 经映射后在 $z_{0}$ 处的**转动角**，与曲线形状无关。

  $$
  \mathrm{Arg}\,w_{2}'(\tilde{t}_{0})-\mathrm{Arg}\,w_{1}'(t_{0})=\mathrm{Arg}\,z_{2}'(\tilde{t}_{0})-\mathrm{Arg}\,z_{1}'(t_{0})
  \tag{6.1.2}
  $$
- **保角性**：两曲线夹角的大小与方向均不变。

  $$
  \left|f'(z_{0})\right|=\lim_{z\to z_{0}}\frac{\Delta\sigma}{\Delta s}
  \tag{6.1.3}
  $$
- **伸缩率不变性**：$|f'(z_{0})|$ 是过 $z_{0}$ 任何曲线的伸缩率。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 6.1**
> $f$ 在 $D$ 内解析、$f'(z_{0})\neq0$ $\Rightarrow$ 映射在 $z_{0}$ 处保角且伸缩率不变。若 $f'(z)\neq0$ 于全 $D$，则为 $D$ 内的保角映射。

### 1.2 共形映射的概念与单叶解析函数的共形性

$$
f\ \text{为}\ D\ \text{内共形映射}\iff f\ \text{在}\ D\ \text{内单叶且保角}
$$
- 保角映射 + 单叶 = 共形（保形）映射。

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**定理 6.2**
> $f$ 在 $D$ 内单叶解析 $\Rightarrow$ $f$ 将 $D$ 共形映射为 $G=f(D)$，反函数 $f^{-1}$ 在 $G$ 内单叶解析，且
>
> $$
> \left[f^{-1}(w)\right]'=\frac{1}{f'(z)}\qquad(z\in D,\ w=f(z)\in G)
> $$

$$
\frac{\mathrm{d}w}{\mathrm{d}z}=2z\neq0\quad(z\neq0)
$$
- $w=z^{2}$ 在除 $z=0$ 外处处保角，在上半平面单叶，故为共形映射。

## 第二节 分式线性映射

### 2.1 分式线性映射及其构成

$$
w=\frac{az+b}{cz+d}\qquad(ad-bc\neq0)
\tag{6.2.1}
$$
- $ad-bc\neq0$ 保证非常数、单叶；将扩充 $z$ 平面一一映为扩充 $w$ 平面。

  $$
  z=\frac{-dw+b}{cw-a}
  \tag{6.2.2}
  $$
- 逆映射仍是分式线性映射。

  $$
  w=z+b;\qquad w=az\ (a\neq0);\qquad w=\frac{1}{z}
  $$
- 一般分式线性映射由**平移、旋转伸缩、反演**三种基本映射复合而成。

  $$
  w=az=r\lambda\mathrm{e}^{\mathrm{i}(\theta+\alpha)}\quad(a=\lambda\mathrm{e}^{\mathrm{i}\alpha})
  $$
- 先旋转 $\alpha$，再伸缩 $\lambda$ 倍。

  $$
  OP\cdot OP'=r^{2}
  $$
- $P$ 与 $P'$ 关于圆周 $C$（中心 $O$、半径 $r$）对称；$w=1/z$ 是“关于单位圆对称 + 关于实轴对称”的复合（反演映射）。

### 2.2 分式线性映射的性质

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**四条性质**
> 1. **共形性**：在扩充复平面上处处共形（单叶 + 保角）。
> 2. **保圆性**：圆周（或直线）$\to$ 圆周（或直线），直线视为过 $\infty$ 的圆周。
> 3. **保对称性**：关于圆周 $C$ 的对称点 $\to$ 关于像曲线 $\Gamma$ 的对称点。
> 4. **保交比性**：三对对应点唯一确定映射。

$$
a(x^{2}+y^{2})+bx+cy+d=0\ \xrightarrow{\ w=1/z\ }\ d(u^{2}+v^{2})+bu-cv+a=0
$$
- 保圆性的解析依据（式 (6.2.3)、(6.2.4)）；$d=0$ 时圆周变直线，$a=0$ 时直线变圆周。

  $$
  \frac{w-w_{1}}{w-w_{2}}:\frac{w_{3}-w_{1}}{w_{3}-w_{2}}=\frac{z-z_{1}}{z-z_{2}}:\frac{z_{3}-z_{1}}{z_{3}-z_{2}}
  \tag{6.2.5}
  $$
- 由 $z_{k}\mapsto w_{k}$（$k=1,2,3$）唯一确定映射；某点为 $\infty$ 时含它的因子用 $1$ 代替。

> <img class="callout-badge" src="/media/icons/lightbulb.svg" alt="tip">**区域对应的判定**
> - 取 $C$ 内一点 $z_{0}$，看其像在 $C'$ 内还是外；
> - 或看 $z_{1}\to z_{2}\to z_{3}$ 与 $w_{1}\to w_{2}\to w_{3}$ 的绕向：同向 $\to$ 内部映内部，反向 $\to$ 内部映外部。

### 2.3 分式线性映射应用举例

$$
w=\mathrm{e}^{\mathrm{i}\theta}\frac{z-\lambda}{z-\overline{\lambda}}\qquad(\mathrm{Im}\,\lambda>0)
\tag{6.2.6}
$$
- 上半平面 $\mathrm{Im}\,z>0$ $\to$ 单位圆 $|w|<1$，且 $z=\lambda\mapsto w=0$。

  $$
  w=\frac{z-\mathrm{i}}{z+\mathrm{i}}
  \tag{6.2.7}
  $$
- (6.2.6) 取 $\lambda=\mathrm{i}$、$\theta=0$ 的特例，最常用。

  $$
  w=\mathrm{e}^{\mathrm{i}\varphi}\frac{z-\alpha}{1-\overline{\alpha}z}\qquad(|\alpha|<1)
  \tag{6.2.8}
  $$
- 单位圆内部 $\to$ 单位圆内部，且 $z=\alpha\mapsto w=0$。

  $$
  w=\frac{az+b}{cz+d}\ \text{将上半平面映为上半平面}\iff a,b,c,d\in\mathbb{R},\ ad-bc>0
  $$

  $$
  w=\frac{2z}{z+1}
  $$
- 上半平面 $\to$ 上半平面且 $0\mapsto0$、$\mathrm{i}\mapsto1+\mathrm{i}$。

  | 目标区域 | 常用映射 | 说明 |
  | --- | --- | --- |
  | 上半平面 $\to$ 单位圆 | $\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-\lambda}{z-\overline{\lambda}}$ | $\mathrm{Im}\lambda>0$ |
  | 单位圆 $\to$ 单位圆 | $\mathrm{e}^{\mathrm{i}\varphi}\dfrac{z-\alpha}{1-\overline{\alpha}z}$ | $|\alpha|<1$ |
  | 上半平面 $\to$ 上半平面 | $\dfrac{az+b}{cz+d}$ | $a,b,c,d\in\mathbb{R}$，$ad-bc>0$ |
  | 上半平面 $\to$ 圆 $|w-w_{0}|<R$ | $w_{0}+R\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-\lambda}{z-\overline{\lambda}}$ | 先映单位圆再平移伸缩 |
  | 两圆弧围成区域 $\to$ 角形域 | $w=k\dfrac{z-z_{1}}{z-z_{2}}$ | 把两交点分别映为 $0,\infty$ |
  | 两相切圆周围成区域 $\to$ 带形域 | $w=k\dfrac{z-z_{1}}{z-z_{2}}$ | 切点映为 $\infty$ |

## 第三节 几个初等函数所构成的共形映射

### 3.1 幂函数与根式函数

$$
w=z^{n},\qquad \frac{\mathrm{d}w}{\mathrm{d}z}=nz^{n-1}\neq0\ (z\neq0)
$$
- 除原点外处处保角；$z=0$ 处张角放大 $n$ 倍，不保角。

  $$
  z=r\mathrm{e}^{\mathrm{i}\theta},\ w=\rho\mathrm{e}^{\mathrm{i}\varphi}\ \Longrightarrow\ \rho=r^{n},\ \varphi=n\theta
  $$

  $$
  0<\arg z<\frac{2\pi}{n}\ \xrightarrow{\ w=z^{n}\ }\ 0<\arg w<2\pi\ (\text{沿正实轴剪开的平面})
  $$
- 幂函数功能：**角形域张角放大 $n$ 倍**。

  $$
  w=z^{n}:\ 0<\theta<\theta_{0}\ \longrightarrow\ 0<\varphi<n\theta_{0}\qquad\left(\theta_{0}\leqslant\frac{2\pi}{n}\right)
  $$

  $$
  z=\sqrt[n]{w}:\ 0<\varphi<n\theta_{0}\ \longrightarrow\ 0<\theta<\theta_{0}
  $$
- 根式函数功能相反：**张角缩小为 $1/n$**。

  $$
  w=\frac{z^{4}-\mathrm{i}}{z^{4}+\mathrm{i}}
  $$
- $0<\arg z<\frac{\pi}{4}$ $\to$ 单位圆内部（先 $z^{4}$ 成上半平面，再 (6.2.7)）。

### 3.2 指数函数与对数函数

$$
w=\mathrm{e}^{z},\qquad \frac{\mathrm{d}w}{\mathrm{d}z}=\mathrm{e}^{z}\neq0
$$
- 在 $z$ 平面内处处保角。

  $$
  z=x+\mathrm{i}y,\ w=\rho\mathrm{e}^{\mathrm{i}\varphi}\ \Longrightarrow\ \rho=\mathrm{e}^{x},\ \varphi=y
  $$
- 竖直线 $\to$ 圆周，水平线 $\to$ 射线；虚轴 $\to$ 单位圆，右半平面 $\to$ 单位圆外。

  $$
  0<\mathrm{Im}\,z<a\ \xrightarrow{\ w=\mathrm{e}^{z}\ }\ 0<\arg w<a\qquad(a\leqslant2\pi)
  $$
- 指数函数功能：**水平带形域 $\to$ 角形域**（宽 $a$ 对应张角 $a$）。

  $$
  z=\ln w:\ 0<\arg w<a\ \longrightarrow\ 0<\mathrm{Im}\,z<a
  $$
- 对数函数功能相反：**角形域 $\to$ 水平带形域**。

  $$
  w=\frac{\mathrm{e}^{z}-\mathrm{i}}{\mathrm{e}^{z}+\mathrm{i}}
  $$
- $0<\mathrm{Im}\,z<\pi$ $\to$ 单位圆内部。

  $$
  w=\left(\frac{\mathrm{e}^{-z}-1}{\mathrm{e}^{-z}+1}\right)^{2}
  $$
- 右半水平带形域（$0<\mathrm{Im}\,z<\pi$，$\mathrm{Re}\,z>0$）$\to$ 上半平面。

> <img class="callout-badge" src="/media/icons/lightbulb.svg" alt="tip">**复合映射的通用套路**
> 复杂区域 $\xrightarrow{\ \text{分式线性}\ }$ 角形域 / 带形域 $\xrightarrow{\ z^{n}\ \text{或}\ \mathrm{e}^{z}\ }$ 上半平面 $\xrightarrow{\ (6.2.7)\ }$ 单位圆。

---

[← 第五章 留数及其应用](/notes/complex/formulas/ch5/) · [总目录](/notes/complex/formulas/toc/) · [第七章 解析函数在科技中的应用选讲 →](/notes/complex/formulas/ch7/)

