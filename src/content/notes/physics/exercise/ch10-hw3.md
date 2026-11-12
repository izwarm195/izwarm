---
title: "第十章 波动 第3讲作业（10-9 ~ 10-15）"
slug: "physics/exercise/ch10-hw3"
description: "10 9 一横波在沿绳子传播时的波动方程为 y 0.20 cos left(2.50 pi t pi x right) ，式中 y 和 x 的单位为 m， t 的单位为 s。（1）求波的振幅、波速、频率及波长；（2）求绳上的质元振动时的最大速度；（3）分别画出 t 1 mathr…"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第十章 波动 第3讲作业（10-9 ~ 10-15）

## 一. 计算题（共4题，100分）

### 1.
10-9 一横波在沿绳子传播时的波动方程为 $y=0.20\cos\left(2.50\pi t-\pi x\right)$，式中 $y$ 和 $x$ 的单位为 m，$t$ 的单位为 s。（1）求波的振幅、波速、频率及波长；（2）求绳上的质元振动时的最大速度；（3）分别画出 $t=1\ \mathrm{s}$ 和 $t=2\ \mathrm{s}$ 时的波形，并指出波峰和波谷。画出 $x=1.0\ \mathrm{m}$ 处质元的振动曲线，并讨论其与波形图的不同。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

与 $y=A\cos\left(\omega t-kx\right)$ 对比：$A=0.20\ \mathrm{m}$，$\omega=2.50\pi\ \mathrm{rad\cdot s^{-1}}$，$k=\pi\ \mathrm{m^{-1}}$

（1）

$$
\nu=\frac{\omega}{2\pi}=1.25\ \mathrm{Hz},\qquad \lambda=\frac{2\pi}{k}=2.0\ \mathrm{m},\qquad u=\frac{\omega}{k}=\frac{2.50\pi}{\pi}=2.5\ \mathrm{m\cdot s^{-1}}
$$

（2）质元振动速度 $v=-\omega A\sin\left(\omega t-kx\right)$，最大值

$$
v_{\max}=\omega A=2.50\pi\times0.20\approx1.6\ \mathrm{m\cdot s^{-1}}
$$

（3）$t=1\ \mathrm{s}$ 时

$$
y=0.20\cos\left(2.50\pi-\pi x\right)=0.20\sin\left(\pi x\right)
$$

波峰在 $x=0.5,\ 2.5,\ \cdots$ m（$x=0.5+2n$），波谷在 $x=1.5,\ 3.5,\ \cdots$ m（$x=1.5+2n$）。

$t=2\ \mathrm{s}$ 时

$$
y=0.20\cos\left(5\pi-\pi x\right)=-0.20\cos\left(\pi x\right)
$$

波峰在 $x=1.0,\ 3.0,\ \cdots$ m（$x=1+2n$），波谷在 $x=0,\ 2.0,\ \cdots$ m（$x=2n$）。

$x=1.0\ \mathrm{m}$ 处质元的振动曲线

$$
y=0.20\cos\left(2.50\pi t-\pi\right)=-0.20\cos\left(2.50\pi t\right)
$$

讨论：两张图都画成余弦曲线，但**波形图**横轴是 $x$，是某一时刻各质元位移的空间分布（快照），随时间以波速 $u$ 沿 $+x$ 平移；**振动曲线**横轴是 $t$，是某个固定质元位移随时间的振荡，曲线本身不移动。故同一"曲线形状"在两个图上对应的物理量不同（空间周期为 $\lambda=2.0\ \mathrm{m}$，时间周期为 $T=0.80\ \mathrm{s}$）。

</details>

### 2.
10-11 如图所示，一平面波在介质中以波速 $u=20\ \mathrm{m\cdot s^{-1}}$ 沿 $x$ 轴负方向传播，已知点 $A$ 的振动方程为 $y=3\times10^{-2}\cos\left(4\pi t+\pi\right)$，式中 $y$ 的单位为 m，$t$ 的单位为 s。（1）以点 $A$ 为坐标原点写出波的表达式；（2）以距点 $A$ 为 $5\ \mathrm{m}$ 处的点 $B$ 为坐标原点，写出波的表达式。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/b7aab3a724cae5d3ed50c9352ccb58dd.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\omega=4\pi\ \mathrm{rad\cdot s^{-1}}$，$T=\dfrac{2\pi}{\omega}=0.50\ \mathrm{s}$，$\lambda=uT=10\ \mathrm{m}$，$k=\dfrac{2\pi}{\lambda}=0.2\pi\ \mathrm{m^{-1}}$。波沿 $-x$ 传播，相位中取 $+kx$

（1）以 $A$ 为原点

$$
y=3\times10^{-2}\cos\left[4\pi\left(t+\frac{x}{20}\right)+\pi\right]\ \mathrm{m}
$$

（2）$AB=5\ \mathrm{m}=\dfrac{\lambda}{2}$，波沿 $-x$ 传，先到 $A$ 后到 $B$，故 $B$ 处相位比 $A$ 落后 $\pi$。以 $B$ 为原点时 $A$ 位于 $x=+5\ \mathrm{m}$，代入上式

$$
y=3\times10^{-2}\cos\left[4\pi\left(t+\frac{x}{20}\right)+0.2\pi\times5+\pi\right]
=3\times10^{-2}\cos\left[4\pi\left(t+\frac{x}{20}\right)\right]\ \mathrm{m}
$$

</details>

### 3.
10-13 波源作简谐振动，周期为 $0.02\ \mathrm{s}$，该振动以 $100\ \mathrm{m\cdot s^{-1}}$ 的速度沿直线传播。设 $t=0$ 时，波源处的质元经平衡位置向正方向运动。求：（1）距波源 $15.0\ \mathrm{m}$ 和 $5.0\ \mathrm{m}$ 两处质元的运动方程和初相；（2）距波源分别为 $16.0\ \mathrm{m}$ 和 $17.0\ \mathrm{m}$ 的两质元间的相位差。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\omega=\dfrac{2\pi}{T}=100\pi\ \mathrm{rad\cdot s^{-1}}$，$\lambda=uT=2.0\ \mathrm{m}$，$k=\dfrac{2\pi}{\lambda}=\pi\ \mathrm{m^{-1}}$。

波源：$t=0$ 时经平衡位置向正方向运动，$y_0=A\cos\left(\omega t+\varphi_0\right)$ 中 $\cos\varphi_0=0$、$-\sin\varphi_0>0$，故 $\varphi_0=-\dfrac{\pi}{2}$

$$
y_0=A\cos\left(100\pi t-\frac{\pi}{2}\right)
$$

沿 $+x$ 传播：$y=A\cos\left(100\pi t-\pi x-\dfrac{\pi}{2}\right)$

（1）$x=15.0\ \mathrm{m}$

$$
y_1=A\cos\left(100\pi t-15\pi-\frac{\pi}{2}\right)=A\cos\left(100\pi t-\frac{31\pi}{2}\right)
$$

初相 $\varphi_1=-\dfrac{31\pi}{2}$（等效于 $+\dfrac{\pi}{2}$）。

$x=5.0\ \mathrm{m}$

$$
y_2=A\cos\left(100\pi t-5\pi-\frac{\pi}{2}\right)=A\cos\left(100\pi t-\frac{11\pi}{2}\right),\qquad \varphi_2=-\frac{11\pi}{2}\ \left(\text{等效 }+\frac{\pi}{2}\right)
$$

二者相距 $10\ \mathrm{m}=5\lambda$，故同相，初相相同。

（2）$\Delta x=17.0-16.0=1.0\ \mathrm{m}=\dfrac{\lambda}{2}$

$$
\Delta\varphi=\frac{2\pi\Delta x}{\lambda}=\pi
$$

即两质元振动反相。

</details>

### 4.
10-15 图示为平面简谐波在 $t=0$ 时刻的波形图，设此简谐波的频率为 $250\ \mathrm{Hz}$，且此时图中点 $P$ 的运动方向向上。求：（1）该波的波动方程；（2）在距原点 $7.5\ \mathrm{m}$ 处质元的运动方程与 $t=0$ 时刻该质元的振动速度。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/330ca8c53aaa6134b27b33f12f6f2078.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\omega=2\pi\nu=500\pi\ \mathrm{rad\cdot s^{-1}}$。由波形图读出 $t=0$ 时 $y\left(0\right)=0.05\ \mathrm{m}=\dfrac{A}{2}$ 且向正方向运动（点 $P$ 向上说明该侧波形左移，波沿 $-x$ 方向传播），并由图上 $\Delta x=10.0\ \mathrm{m}$ 对应 $\dfrac{\lambda}{2}$ 得 $\lambda=20\ \mathrm{m}$，$k=\dfrac{2\pi}{\lambda}=0.1\pi\ \mathrm{m^{-1}}$。

设 $y=0.10\cos\left(500\pi t+0.1\pi x+\varphi\right)$，由 $t=0$、$x=0$ 时 $y=0.05$

$$
0.10\cos\varphi=0.05\quad\Rightarrow\quad \varphi=\pm\frac{\pi}{3}
$$

结合 $P$ 点运动方向取 $\varphi=\dfrac{\pi}{3}$。

（1）波动方程

$$
y=0.10\cos\left(500\pi t+0.1\pi x+\frac{\pi}{3}\right)\ \mathrm{m}
$$

（2）$x=7.5\ \mathrm{m}$ 处

$$
y=0.10\cos\left(500\pi t+0.75\pi+\frac{\pi}{3}\right)=0.10\cos\left(500\pi t+\frac{13\pi}{12}\right)\ \mathrm{m}
$$

$t=0$ 时该质元振动速度

$$
v=-\omega A\sin\left(\frac{13\pi}{12}\right)=-500\pi\times0.10\times\left(-0.2588\right)\approx40.6\ \mathrm{m\cdot s^{-1}}
$$

方向沿 $y$ 轴正方向。

</details>

