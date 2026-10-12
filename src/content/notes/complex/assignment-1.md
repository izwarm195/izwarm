---
title: "第一次作业"
slug: "complex/assignment-1"
description: "当 x,y 等于什么实数时，等式 dfrac{x+1+ mathrm{i}(y 3)}{5+3 mathrm{i}} 1+ mathrm{i} 成立?"
publishDate: "2026-10-12"
createdAt: "2026-10-12T00:00:00Z"
updatedDate: "2026-10-12T11:04:14"
tags: ["complex","复变函数","homework"]
series: ["Complex"]
---

# 第一次作业

## 一. 计算题（共3题，6.3分）

### 1.
当 $x,y$ 等于什么实数时，等式 $\dfrac{x+1+\mathrm{i}(y-3)}{5+3\mathrm{i}} = 1+\mathrm{i}$ 成立?

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\Leftrightarrow\ x+1+\mathrm{i}(y-3)=(1+\mathrm{i})(5+3\mathrm{i})=2+8\mathrm{i}
$$

$$
\Rightarrow\ \begin{cases}x=1\\[2pt] y=11\end{cases}
$$

</details>

### 2.
若 $(1+\mathrm{i})^n = (1-\mathrm{i})^n$ ,试求 $n$ 的值.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\left(\frac{1+\mathrm{i}}{1-\mathrm{i}}\right)^n=1,\qquad \frac{1+\mathrm{i}}{1-\mathrm{i}}=\frac{(1+\mathrm{i})^2}{2}=\mathrm{i}
$$

$$
\Rightarrow\ \mathrm{i}^{\,n}=1\ \Rightarrow\ n=4k\quad (k\in\mathbb{Z})
$$

</details>

### 3.
1.求方程 $z^3+8=0$ 的所有根; 2. 求微分方程 $y'''+8y=0$ 的通解.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z^3=-8=2^3\mathrm{e}^{\mathrm{i}\pi}\ \Rightarrow\ z_k=2\mathrm{e}^{\mathrm{i}\frac{\pi+2k\pi}{3}}\quad(k=0,1,2)
$$

$$
z_0=1+\sqrt3\,\mathrm{i},\qquad z_1=-2,\qquad z_2=1-\sqrt3\,\mathrm{i}
$$

$$
r^3+8=0\ \Rightarrow\ r=-2,\ 1\pm\sqrt3\,\mathrm{i}
$$

$$
y=C_1\mathrm{e}^{-2x}+\mathrm{e}^{x}\left(C_2\cos\sqrt3\,x+C_3\sin\sqrt3\,x\right)
$$

</details>

## 二. 简答题（共38题，82.7分）

### 4.
将下列复数化为三角表示式和指数表示式: $\mathrm{i}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\mathrm{i}=\cos\frac{\pi}{2}+\mathrm{i}\sin\frac{\pi}{2}=\mathrm{e}^{\mathrm{i}\pi/2}
$$

</details>

### 5.
将下列复数化为三角表示式和指数表示式: $-1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
-1=\cos\pi+\mathrm{i}\sin\pi=\mathrm{e}^{\mathrm{i}\pi}
$$

</details>

### 6.
将下列复数化为三角表示式和指数表示式: $1+\mathrm{i}\sqrt{3}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
1+\sqrt3\,\mathrm{i}=2\left(\cos\frac{\pi}{3}+\mathrm{i}\sin\frac{\pi}{3}\right)=2\mathrm{e}^{\mathrm{i}\pi/3}
$$

</details>

### 7.
将下列复数化为三角表示式和指数表示式: $\dfrac{2\mathrm{i}}{-1+\mathrm{i}}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\frac{2\mathrm{i}}{-1+\mathrm{i}}=\frac{2\mathrm{i}(-1-\mathrm{i})}{(-1+\mathrm{i})(-1-\mathrm{i})}=\frac{2\mathrm{i}(-1-\mathrm{i})}{2}=1-\mathrm{i}
$$

$$
1-\mathrm{i}=\sqrt2\left[\cos\left(-\frac{\pi}{4}\right)+\mathrm{i}\sin\left(-\frac{\pi}{4}\right)\right]=\sqrt2\,\mathrm{e}^{-\mathrm{i}\pi/4}
$$

</details>

### 8.
将下列复数化为三角表示式和指数表示式: $1-\cos \varphi + \mathrm{i}\sin \varphi \quad (0 \leqslant \varphi \leqslant \pi)$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
1-\cos\varphi=2\sin^2\frac{\varphi}{2},\qquad \sin\varphi=2\sin\frac{\varphi}{2}\cos\frac{\varphi}{2}
$$

$$
z=2\sin\frac{\varphi}{2}\left(\sin\frac{\varphi}{2}+\mathrm{i}\cos\frac{\varphi}{2}\right)
=2\sin\frac{\varphi}{2}\left[\cos\frac{\pi-\varphi}{2}+\mathrm{i}\sin\frac{\pi-\varphi}{2}\right]
=2\sin\frac{\varphi}{2}\,\mathrm{e}^{\mathrm{i}\frac{\pi-\varphi}{2}}
$$

（$\varphi=0$ 时 $z=0$，辐角无意义）

</details>

### 9.
将下列复数化为三角表示式和指数表示式: $\dfrac{(\cos 5\varphi + \mathrm{i}\sin 5\varphi)^2}{(\cos 3\varphi - \mathrm{i}\sin 3\varphi)^3}$ 。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z=\frac{\left(\mathrm{e}^{\mathrm{i}5\varphi}\right)^2}{\left(\mathrm{e}^{-\mathrm{i}3\varphi}\right)^3}
=\frac{\mathrm{e}^{\mathrm{i}10\varphi}}{\mathrm{e}^{-\mathrm{i}9\varphi}}
=\mathrm{e}^{\mathrm{i}19\varphi}
=\cos19\varphi+\mathrm{i}\sin19\varphi
$$

</details>

### 10.
将下列坐标变换公式写成复数的形式: 平移公式: $\begin{cases} x = x_1 + a_1, \\ y = y_1 + b_1; \end{cases}$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z=x+\mathrm{i}y,\qquad z_1=x_1+\mathrm{i}y_1,\qquad a=a_1+\mathrm{i}b_1
$$

$$
z=(x_1+a_1)+\mathrm{i}(y_1+b_1)=z_1+a
$$

</details>

### 11.
将下列坐标变换公式写成复数的形式: 旋转公式: $\begin{cases} x = x_1 \cos \alpha - y_1 \sin \alpha, \\ y = x_1 \sin \alpha + y_1 \cos \alpha. \end{cases}$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z=(x_1\cos\alpha-y_1\sin\alpha)+\mathrm{i}(x_1\sin\alpha+y_1\cos\alpha)
=(x_1+\mathrm{i}y_1)(\cos\alpha+\mathrm{i}\sin\alpha)
$$

$$
z=z_1\,\mathrm{e}^{\mathrm{i}\alpha}
$$

</details>

### 12.
当 $|z|\leqslant 1 $ 时，求 $|z^n+a|$ 的最大值，其中 $n$ 为正整数， $a$ 为复数。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z^n+a|\leqslant|z|^n+|a|\leqslant 1+|a|
$$

取 $|z|=1$ 且 $\arg z^n=\arg a$（即 $z^n=\dfrac{a}{|a|}$，$a\neq0$）时等号成立：

$$
\max_{|z|\leqslant1}\left|z^n+a\right|=1+|a|
$$

（$a=0$ 时最大值为 $1$）

</details>

### 13.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (1) $|z-5|=6$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

以 $5$ 为心、$6$ 为半径的圆周：

$$
|z-5|=6
$$

</details>

### 14.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (2) $|z+2\mathrm{i}|\geqslant 1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

以 $-2\mathrm{i}$ 为心、$1$ 为半径的圆周及其外部：

$$
|z+2\mathrm{i}|\geqslant1
$$

</details>

### 15.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (3) $\operatorname{Re}(z+2)=-1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\operatorname{Re}z=-3\qquad(\text{直线 }x=-3)
$$

</details>

### 16.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (4) $\operatorname{Re}(\mathrm{i}\overline{z})=3$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\mathrm{i}\overline{z}=\mathrm{i}(x-\mathrm{i}y)=y+\mathrm{i}x\ \Rightarrow\ \operatorname{Re}(\mathrm{i}\overline{z})=y
$$

$$
y=3\qquad(\text{直线 }y=3)
$$

</details>

### 17.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (5) $|z+\mathrm{i}|=|z-\mathrm{i}|$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

到 $\pm\mathrm{i}$ 等距，即实轴：

$$
y=0
$$

</details>

### 18.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (6) $|z+3|+|z+1|=4$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

焦点为 $-3,-1$ 的椭圆，$c=1,\ a=2,\ b^2=a^2-c^2=3$：

$$
\frac{(x+2)^2}{4}+\frac{y^2}{3}=1
$$

</details>

### 19.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (7) $\operatorname{Im}(z)\leqslant 2$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
y\leqslant2
$$

</details>

### 20.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (8) $\left|\dfrac{z-3}{z-2}\right|\geqslant 1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z-3|^2\geqslant|z-2|^2\ \Rightarrow\ (x-3)^2\geqslant(x-2)^2\ \Rightarrow\ x\leqslant\frac52
$$

半平面 $x\leqslant\dfrac52$（$z\neq2$）

</details>

### 21.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (9) $0<\arg z<\pi$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

上半平面（不含实轴）：

$$
\operatorname{Im}z>0
$$

</details>

### 22.
指出下列各题中点 $z$ 的轨迹或所在范围，并作图: (10) $\arg(z-\mathrm{i})=\dfrac{\pi}{4}$ 。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

自 $\mathrm{i}$ 出发、倾角 $\dfrac{\pi}{4}$ 的射线：

$$
y-1=x\quad(x>0)
$$

</details>

### 23.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (1) $\operatorname{Im}(z)>0$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
y>0:\ \text{上半平面}
$$

区域，无界，单连通。

</details>

### 24.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (2) $|z-1|>4$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z-1|>4:\ \text{圆外}
$$

区域，无界，多连通（二连通）。

</details>

### 25.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (3) $0<\operatorname{Re}(z)<1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
0<x<1:\ \text{带形域}
$$

区域，无界，单连通。

</details>

### 26.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (4) $2\leqslant|z|\leqslant 3$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
2\leqslant|z|\leqslant3:\ \text{圆环域}
$$

闭区域，有界，多连通（二连通）。

</details>

### 27.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (5) $|z-1|<|z+3|$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
(x-1)^2<(x+3)^2\ \Rightarrow\ x>-1
$$

区域（半平面），无界，单连通。

</details>

### 28.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (6) $-1<\arg z<-1+\pi$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

顶点在原点、张角为 $\pi$ 的角形域：

$$
-1<\arg z<-1+\pi
$$

区域，无界，单连通。

</details>

### 29.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (7) $|z-1|<4|z+1|$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
(x-1)^2+y^2<16\left[(x+1)^2+y^2\right]
\ \Rightarrow\ \left(x+\frac{17}{15}\right)^2+y^2>\left(\frac{8}{15}\right)^2
$$

即圆 $\left|z+\dfrac{17}{15}\right|=\dfrac{8}{15}$ 的外部。

区域，无界，多连通。

</details>

### 30.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (8) $|z-2|+|z+2|\leqslant 6$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

椭圆域，$c=2,\ a=3,\ b^2=a^2-c^2=5$：

$$
\frac{x^2}{9}+\frac{y^2}{5}\leqslant1
$$

闭区域，有界，单连通。

</details>

### 31.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (9) $|z-2|-|z+2|>1$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

双曲线左支 $a=\dfrac12,\ c=2,\ b^2=c^2-a^2=\dfrac{15}{4}$：

$$
4x^2-\frac{4}{15}y^2=1\quad(x<0)
$$

区域，无界，单连通。

</details>

### 32.
指出下列不等式所确定的区域与闭区域，并指明它们是有界的还是无界的，单连通的还是多连通的: (10) $z\overline{z}-(2+\mathrm{i})z-(2-\mathrm{i})\overline{z}\leqslant 4$ .

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
(2+\mathrm{i})z+(2-\mathrm{i})\overline{z}=2\operatorname{Re}\left[(2+\mathrm{i})z\right]=4x-2y
$$

$$
x^2+y^2-4x+2y\leqslant4\ \Rightarrow\ (x-2)^2+(y+1)^2\leqslant9
$$

闭区域（圆），有界，单连通。

</details>

### 33.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (1) $z = t(1+\mathrm{i})$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=t,\quad y=t\ \Rightarrow\ y=x
$$

</details>

### 34.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (2) $z = a\cos t + \mathrm{i}b\sin t$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=a\cos t,\quad y=b\sin t\ \Rightarrow\ \frac{x^2}{a^2}+\frac{y^2}{b^2}=1
$$

</details>

### 35.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (3) $z = t+\dfrac{\mathrm{i}}{t}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=t,\quad y=\frac1t\ \Rightarrow\ xy=1
$$

</details>

### 36.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (4) $z = t^2+\dfrac{\mathrm{i}}{t^2}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=t^2,\quad y=\frac{1}{t^2}\ \Rightarrow\ xy=1\quad(x>0,\ y>0)
$$

</details>

### 37.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (5) $z = a\operatorname{ch} t + \mathrm{i}b\operatorname{sh} t$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=a\operatorname{ch}t,\quad y=b\operatorname{sh}t
\ \Rightarrow\ \frac{x^2}{a^2}-\frac{y^2}{b^2}=\operatorname{ch}^2t-\operatorname{sh}^2t=1
$$

</details>

### 38.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (6) $z = a\mathrm{e}^{\mathrm{i}t}+b\mathrm{e}^{-\mathrm{i}t}$ ;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x=(a+b)\cos t,\quad y=(a-b)\sin t
\ \Rightarrow\ \frac{x^2}{(a+b)^2}+\frac{y^2}{(a-b)^2}=1
$$

</details>

### 39.
将下列方程( $t$ 为实参数)给出的曲线用直角坐标方程来表示，其中 $a$ 与 $b$ 为实常数: (7) $z = \mathrm{e}^{\alpha t} \quad (\alpha = a+b\mathrm{i} \text{ 为复数}).$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z|=\mathrm{e}^{at},\qquad \arg z=bt
$$

$$
\Rightarrow\ \ln|z|=\frac{a}{b}\arg z\quad(b\neq0)
$$

对数螺线 $\rho=\mathrm{e}^{\frac{a}{b}\theta}$。

</details>

### 40.
函数
$$
w=\dfrac{1}{z} 把下列 z 平面上的曲线映射成 w 平面上怎样的曲线? (3) x=1 ;
$$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z=1+\mathrm{i}y,\qquad w=\frac{1}{1+\mathrm{i}y}=\frac{1-\mathrm{i}y}{1+y^2}
$$

$$
u=\frac{1}{1+y^2},\quad v=\frac{-y}{1+y^2}
\ \Rightarrow\ u^2+v^2=u
$$

$$
\left(u-\frac12\right)^2+v^2=\frac14
$$

$w$ 平面上以 $\dfrac12$ 为心、$\dfrac12$ 为半径的圆周（挖去 $w=0$）。

</details>

### 41.
函数 $w=\dfrac{1}{z}$ 把下列 $z$ 平面上的曲线映射成 $w$ 平面上怎样的曲线? $(4) (x-1)^{2}+y^{2}=1 .$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z-1|=1\ \Leftrightarrow\ z\overline{z}-z-\overline{z}=0
$$

代入 $z=\dfrac1w$ 得

$$
1-\overline{w}-w=0\ \Rightarrow\ w+\overline{w}=1\ \Rightarrow\ u=\frac12
$$

直线 $u=\dfrac12$。

</details>

## 三. 证明题（共5题，11分）

### 42.
证明: $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)$ , 并说明其几何意义.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
|z_1+z_2|^2=(z_1+z_2)(\overline{z_1}+\overline{z_2})=|z_1|^2+|z_2|^2+z_1\overline{z_2}+\overline{z_1}z_2
$$

$$
|z_1-z_2|^2=|z_1|^2+|z_2|^2-z_1\overline{z_2}-\overline{z_1}z_2
$$

两式相加：

$$
|z_1+z_2|^2+|z_1-z_2|^2=2\left(|z_1|^2+|z_2|^2\right)
$$

几何意义：平行四边形两条对角线的平方和等于四条边的平方和。

</details>

### 43.
试证 $\arg z$ 在原点与负实轴上不连续.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

负实轴上取 $z=-1$，沿上、下两侧趋于它：

$$
\lim_{\varepsilon\to0^+}\arg(-1+\mathrm{i}\varepsilon)=\pi,\qquad
\lim_{\varepsilon\to0^+}\arg(-1-\mathrm{i}\varepsilon)=-\pi
$$

两极限不等，故 $\arg z$ 在负实轴上不连续。

原点：$z=0$ 处 $\arg z$ 无定义，且沿不同射线趋于 $0$ 时 $\arg z$ 无极限，故不连续。

</details>

### 44.
设 $f(z) = \frac{1}{2\mathrm{i}} \left( \frac{z}{\overline{z}} - \frac{\overline{z}}{z} \right) \quad (z \ne 0),$ 试证当 $z \to 0$ 时 $f(z)$ 的极限不存在.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

令 $z=r\mathrm{e}^{\mathrm{i}\theta}$，则 $\dfrac{z}{\overline{z}}=\mathrm{e}^{2\mathrm{i}\theta}$：

$$
f(z)=\frac{1}{2\mathrm{i}}\left(\mathrm{e}^{2\mathrm{i}\theta}-\mathrm{e}^{-2\mathrm{i}\theta}\right)=\sin2\theta
$$

$f$ 只与 $\theta$ 有关，与 $r$ 无关：

$$
\theta=0:\ f\to0;\qquad \theta=\frac{\pi}{4}:\ f\to1
$$

故 $\lim\limits_{z\to0}f(z)$ 不存在。

</details>

### 45.
如果复数 $z_1,z_2,z_3$ 满足等式 $\frac{z_2-z_1}{z_3-z_1} = \frac{z_1-z_3}{z_2-z_3},$ 证明: $|z_2-z_1| = |z_3-z_1| = |z_2-z_3|,$ 并说明上述等式的几何意义。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

令 $a=z_2-z_1,\ b=z_3-z_1$，则 $z_1-z_3=-b,\ z_2-z_3=a-b$，条件化为

$$
\frac{a}{b}=\frac{-b}{a-b}\ \Rightarrow\ a^2-ab+b^2=0\ \Rightarrow\ \frac{a}{b}=\mathrm{e}^{\pm\mathrm{i}\pi/3}
$$

$$
\left|\frac{a}{b}\right|=1\ \Rightarrow\ |z_2-z_1|=|z_3-z_1|
$$

$$
|a-b|=|b|\left|\mathrm{e}^{\pm\mathrm{i}\pi/3}-1\right|=|b|
$$

故

$$
|z_2-z_1|=|z_3-z_1|=|z_2-z_3|
$$

几何意义：$z_1,z_2,z_3$ 是等边三角形的顶点。

</details>

### 46.
设 $z_1,z_2,z_3$ 三点适合条件: $z_1+z_2+z_3=0$ , $|z_1|=|z_2|=|z_3|=1$ .证明: $z_1$ , $z_2,z_3$ 是内接于单位圆 $|z|=1$ 的一个正三角形的顶点.

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
z_3=-(z_1+z_2),\qquad |z_3|^2=|z_1+z_2|^2=|z_1|^2+|z_2|^2+2\operatorname{Re}(z_1\overline{z_2})=2+2\operatorname{Re}(z_1\overline{z_2})=1
$$

$$
\Rightarrow\ \operatorname{Re}(z_1\overline{z_2})=-\frac12
\ \Rightarrow\ \arg z_1-\arg z_2=\pm\frac{2\pi}{3}
$$

同理 $\arg z_2-\arg z_3=\pm\dfrac{2\pi}{3}$，三点在 $|z|=1$ 上等距分布。又

$$
|z_1-z_2|^2=2-2\operatorname{Re}(z_1\overline{z_2})=3
$$

三边均为 $\sqrt3$，故 $z_1,z_2,z_3$ 是内接于单位圆的正三角形的顶点。

</details>

