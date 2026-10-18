---
title: "复变函数 - 第2次作业"
slug: "complex/assignment-2"
publishDate: "2026-10-15"
createdAt: "2026-10-15T00:00:00Z"
updatedDate: "2026-10-18T10:25:00"
tags: ["complex","homework","math"]
series: ["Complex"]
---

# 第二次作业

## 一. 简答题（共11题，60.8分）

### 下列函数何处可导？何处解析？

#### 1.  $f(z)=x^{2}-\mathrm{i} y$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
u=x^2,\quad v=-y:\qquad u_x=2x,\quad u_y=0,\quad v_x=0,\quad v_y=-1
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}2x=-1\\[2pt] 0=0\end{cases}
\ \Rightarrow\ x=-\frac12
$$

仅在直线 $x=-\dfrac12$ 上可导；处处不解析。

</details>

#### 2.  $f(z)=2 x^{3}+3 y^{3} \mathrm{i}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
u=2x^3,\quad v=3y^3:\qquad u_x=6x^2,\quad u_y=0,\quad v_x=0,\quad v_y=9y^2
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}6x^2=9y^2\\[2pt] 0=0\end{cases}
\ \Rightarrow\ y=\pm\frac{\sqrt6}{3}x
$$

仅在直线 $y=\pm\dfrac{\sqrt6}{3}x$ 上可导；处处不解析。

</details>

#### 3.  $f(z)=x y^{2}+\mathrm{i} x^{2} y$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
u=xy^2,\quad v=x^2y:\qquad u_x=y^2,\quad u_y=2xy,\quad v_x=2xy,\quad v_y=x^2
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}y^2=x^2\\[2pt] 2xy=-2xy\end{cases}
\ \Rightarrow\
\begin{cases}y=\pm x\\[2pt] xy=0\end{cases}
\ \Rightarrow\ x=y=0
$$

仅在 $z=0$ 可导；处处不解析。

</details>

#### 4.  $f(z)=\sin x \operatorname{ch} y+\mathrm{i} \cos x \operatorname{sh} y$ .

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
u=\sin x\operatorname{ch}y,\quad v=\cos x\operatorname{sh}y
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}\cos x\operatorname{ch}y=\cos x\operatorname{ch}y\\[2pt] \sin x\operatorname{sh}y=\sin x\operatorname{sh}y\end{cases}
$$

恒成立，故 $f(z)=\sin z$ 在全平面可导、处处解析，$f'(z)=\cos z$。

</details>

### 判断下列命题的真假。若真，请给予证明;若假，请举例说明。

#### 5.  如果 $f(z)$ 在 $z_0$ 连续，那么 $f'(z_0)$ 存在;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

假。取 $f(z)=\overline{z}$：

$$
\frac{f(z)-f(0)}{z}=\frac{\overline{z}}{z}=\mathrm{e}^{-2\mathrm{i}\arg z}
$$

沿不同方向趋于 $0$ 极限不同，$f'(0)$ 不存在，但 $f$ 处处连续。

</details>

#### 6.  如果 $f'(z_0)$ 存在，那么 $f(z)$ 在 $z_0$ 解析;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

假。解析要求在 $z_0$ 的某邻域内可导。取 $f(z)=|z|^2=x^2+y^2$：

$$
u=x^2+y^2,\quad v=0:\qquad u_x=2x,\quad u_y=2y,\quad v_x=v_y=0
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}2x=0\\[2pt] 2y=0\end{cases}
\ \Rightarrow\ x=y=0
$$

$$
f'(0)=\lim_{z\to0}\frac{|z|^2-0}{z}=\lim_{z\to0}\overline{z}=0
$$

C-R 仅在原点成立，故 $f$ 只在 $z=0$ 可导，在 $z=0$ 不解析。

</details>

#### 7.  如果 $z_0$ 是 $f(z)$ 的奇点，那么 $f(z)$ 在 $z_0$ 不可导;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

假。仍取 $f(z)=|z|^2$，$z_0=0$：由题 6 知 $f'(0)=0$ 存在，但 $f$ 在 $0$ 的任何邻域内都不解析，故 $0$ 是奇点。

</details>

#### 8.  如果 $z_0$ 是 $f(z)$ 和 $g(z)$ 的一个奇点，那么 $z_0$ 也是 $f(z)+g(z)$ 和 $f(z)/g(z)$ 的奇点;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

假。取 $f(z)=\dfrac1z,\ g(z)=-\dfrac1z,\ z_0=0$：二者均以 $0$ 为奇点，但

$$
f+g\equiv0,\qquad \frac{f}{g}\equiv-1
$$

均为常数，$z_0=0$ 是可去奇点，$f+g$ 与 $f/g$ 在 $0$ 解析。

</details>

#### 9.  如果 $u(x,y)$ 和 $v(x,y)$ 的偏导数存在，那么 $f(z)=u+\mathrm{i}v$ 可导;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

假。偏导数存在既不够 C-R，也不够可微。取 $f(z)=\overline{z}$：

$$
u=x,\quad v=-y:\qquad u_x=1,\quad u_y=0,\quad v_x=0,\quad v_y=-1
$$

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}1=-1\\[2pt] 0=0\end{cases}
$$

第一式矛盾，C-R 处处不成立，故 $f$ 处处不可导。

</details>

#### 10.  设 $f(z)=u+\mathrm{i}v$ 在区域 $D$ 内是解析的。如果 $u$ 是实常数，那么 $f(z)$ 在整个 $D$ 内是常数;如果 $v$ 是实常数，那么 $f(z)$ 在 $D$ 内也是常数。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

真。设 $u\equiv c$，则 $u_x=u_y=0$：

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}v_y=0\\[2pt] v_x=0\end{cases}
\ \Rightarrow\ v\equiv\text{常数}
$$

（$D$ 连通、偏导全零，故为常数）$f=u+\mathrm{i}v$ 为常数。

同理 $v\equiv c$ 时 $v_x=v_y=0$：

$$
\begin{cases}u_x=v_y\\[2pt] u_y=-v_x\end{cases}
\ \Rightarrow\
\begin{cases}u_x=0\\[2pt] u_y=0\end{cases}
\ \Rightarrow\ u\equiv\text{常数}
$$

</details>

### 11. 说明: 1.当 $y\to\infty$ 时， $|\sin(x+\mathrm{i}y)|$ 和 $|\cos(x+\mathrm{i}y)|$ 趋于无穷大; 2.当 $t$ 为复数时， $|\sin t|\leqslant 1$ 和 $|\cos t|\leqslant 1$ 不成立。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\sin(x+\mathrm{i}y)=\sin x\operatorname{ch}y+\mathrm{i}\cos x\operatorname{sh}y
$$

$$
|\sin(x+\mathrm{i}y)|^2=\sin^2x\operatorname{ch}^2y+\cos^2x\operatorname{sh}^2y
=\sin^2x+\operatorname{sh}^2y\geqslant\operatorname{sh}^2y
$$

$$
|\cos(x+\mathrm{i}y)|^2=\cos^2x+\operatorname{sh}^2y\geqslant\operatorname{sh}^2y
$$

$y\to\infty$ 时 $\operatorname{sh}^2y\to\infty$，二者均 $\to\infty$。

$\operatorname{sh}y$ 取遍 $\mathbb{R}$：

$$
\operatorname{sh}y=\frac{\mathrm{e}^{y}-\mathrm{e}^{-y}}{2}:\qquad
|\operatorname{sh}y|>1\ \Leftrightarrow\ |y|>\ln(1+\sqrt2)
$$

此时 $|\sin t|>1$、$|\cos t|>1$，有界性不成立。

</details>

## 二. 证明题（共2题，11.2分）

### 12. 设 $f(z)=u+\mathrm{i}v$ 是 $z$ 的解析函数，证明: $\left(\frac{\partial}{\partial x}|f(z)|\right)^2 + \left(\frac{\partial}{\partial y}|f(z)|\right)^2 = |f'(z)|^2.$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
r=|f|=\sqrt{u^2+v^2}:\qquad r_x=\frac{uu_x+vv_x}{r},\quad r_y=\frac{uu_y+vv_y}{r}
$$

由 C-R，$u_y=-v_x,\ v_y=u_x$：

$$
r_y=\frac{-uv_x+vu_x}{r}
$$

$$
r_x^2+r_y^2=\frac{(uu_x+vv_x)^2+(vu_x-uv_x)^2}{r^2}=\frac{(u^2+v^2)(u_x^2+v_x^2)}{r^2}=u_x^2+v_x^2
$$

$$
|f'|^2=|u_x+\mathrm{i}v_x|^2=u_x^2+v_x^2
$$

故

$$
\left(\frac{\partial|f|}{\partial x}\right)^2+\left(\frac{\partial|f|}{\partial y}\right)^2=|f'(z)|^2
$$

</details>

### 13. 证明柯西-黎曼方程的极坐标形式是: $\frac{\partial u}{\partial r} = \frac{1}{r}\frac{\partial v}{\partial \theta},\quad \frac{\partial v}{\partial r} = -\frac{1}{r}\frac{\partial u}{\partial \theta}.$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=r\cos\theta,\quad y=r\sin\theta
$$

$$
u_r=u_x\cos\theta+u_y\sin\theta,\qquad \frac1r u_\theta=-u_x\sin\theta+u_y\cos\theta
$$

$$
v_r=v_x\cos\theta+v_y\sin\theta,\qquad \frac1r v_\theta=-v_x\sin\theta+v_y\cos\theta
$$

代入 $u_x=v_y,\ u_y=-v_x$：

$$
u_r=v_y\cos\theta-v_x\sin\theta=\frac1r v_\theta
$$

$$
-\frac1r u_\theta=u_x\sin\theta-u_y\cos\theta=v_x\cos\theta+v_y\sin\theta=v_r
$$

即

$$
\frac{\partial u}{\partial r}=\frac1r\frac{\partial v}{\partial\theta},\qquad
\frac{\partial v}{\partial r}=-\frac1r\frac{\partial u}{\partial\theta}
$$

</details>

## 三. 计算题（共5题，28分）

### 14. 求 $\mathrm{Ln}(-\mathrm{i})$、$\mathrm{Ln}(-3+4\mathrm{i})$ 和它们的主值。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
-\mathrm{i}=\mathrm{e}^{-\mathrm{i}\pi/2}:\qquad \mathrm{Ln}(-\mathrm{i})=\mathrm{i}\left(-\frac{\pi}{2}+2k\pi\right)
$$

$$
\ln(-\mathrm{i})=-\mathrm{i}\frac{\pi}{2}
$$

$$
-3+4\mathrm{i}=5\mathrm{e}^{\mathrm{i}\left(\pi-\arctan\frac43\right)}:\qquad
\mathrm{Ln}(-3+4\mathrm{i})=\ln5+\mathrm{i}\left(\pi-\arctan\frac43+2k\pi\right)
$$

$$
\ln(-3+4\mathrm{i})=\ln5+\mathrm{i}\left(\pi-\arctan\frac43\right)
$$

</details>

### 求下列各式的值:

#### 15.  $\mathrm{e}^{1-\mathrm{i}\frac{\pi}{2}}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\mathrm{e}^{1-\mathrm{i}\pi/2}=\mathrm{e}\left(\cos\frac{\pi}{2}-\mathrm{i}\sin\frac{\pi}{2}\right)=-\mathrm{e}\,\mathrm{i}
$$

</details>

#### 16.  $\mathrm{e}^{\frac{1+\mathrm{i}\pi}{4}}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\mathrm{e}^{\frac{1+\mathrm{i}\pi}{4}}=\mathrm{e}^{1/4}\mathrm{e}^{\mathrm{i}\pi/4}
=\frac{\sqrt2}{2}\mathrm{e}^{1/4}(1+\mathrm{i})
$$

</details>

#### 17.  $3^{\mathrm{i}}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
3^{\mathrm{i}}=\mathrm{e}^{\mathrm{i}\mathrm{Ln}3}=\mathrm{e}^{\mathrm{i}(\ln3+2k\pi\mathrm{i})}
=\mathrm{e}^{-2k\pi}\left(\cos\ln3+\mathrm{i}\sin\ln3\right)\qquad(k\in\mathbb{Z})
$$

主值（$k=0$）：$\cos\ln3+\mathrm{i}\sin\ln3$。

</details>

#### 18.  $(1+\mathrm{i})^{\mathrm{i}}$ 。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
1+\mathrm{i}=\sqrt2\,\mathrm{e}^{\mathrm{i}\pi/4}:\qquad
\mathrm{Ln}(1+\mathrm{i})=\frac12\ln2+\mathrm{i}\left(\frac{\pi}{4}+2k\pi\right)
$$

$$
(1+\mathrm{i})^{\mathrm{i}}=\mathrm{e}^{\mathrm{i}\mathrm{Ln}(1+\mathrm{i})}
=\mathrm{e}^{-\frac{\pi}{4}-2k\pi}\left(\cos\frac{\ln2}{2}+\mathrm{i}\sin\frac{\ln2}{2}\right)\qquad(k\in\mathbb{Z})
$$

</details>

