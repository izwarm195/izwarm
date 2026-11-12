---
title: "第九章 振动 第1讲作业（9-8 ~ 9-30）"
slug: "physics/exercise/ch9-hw1"
description: "9 8 若简谐振动方程为 x 0.10 cos left(20 pi t+ dfrac{ pi}{4} right) ，式中 x 的单位为 m， t 的单位为 s，求：（1）振幅、频率、角频率、周期和初相；（2） t 2 mathrm{s} 时的位移、速度和加速度。"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第九章 振动 第1讲作业（9-8 ~ 9-30）

## 一. 计算题（共6题，100分）

### 1.
9-8 若简谐振动方程为 $x=0.10\cos\left(20\pi t+\dfrac{\pi}{4}\right)$，式中 $x$ 的单位为 m，$t$ 的单位为 s，求：（1）振幅、频率、角频率、周期和初相；（2）$t=2\ \mathrm{s}$ 时的位移、速度和加速度。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）与 $x=A\cos\left(\omega t+\varphi\right)$ 对比

$$
A=0.10\ \mathrm{m},\quad \omega=20\pi\ \mathrm{rad\cdot s^{-1}},\quad \varphi=\frac{\pi}{4}
$$

$$
\nu=\frac{\omega}{2\pi}=10\ \mathrm{Hz},\qquad T=\frac{1}{\nu}=\frac{2\pi}{\omega}=0.10\ \mathrm{s}
$$

（2）$t=2\ \mathrm{s}$ 时相位 $\omega t+\varphi=40\pi+\dfrac{\pi}{4}$，各量以 $2\pi$ 为周期，故等效相位为 $\dfrac{\pi}{4}$

$$
x=0.10\cos\frac{\pi}{4}=7.07\times10^{-2}\ \mathrm{m}
$$

$$
v=-A\omega\sin\left(\omega t+\varphi\right)=-0.10\times20\pi\times\frac{\sqrt{2}}{2}\approx-4.44\ \mathrm{m\cdot s^{-1}}
$$

$$
a=-\omega^{2}x=-\left(20\pi\right)^{2}\times7.07\times10^{-2}\approx-279\ \mathrm{m\cdot s^{-2}}
$$

（$a$ 也可由 $a=-A\omega^{2}\cos(\omega t+\varphi)$ 直接求出。）

</details>

### 2.
9-10 设地球是一个半径为 $R$ 的均匀球体，密度为 $\rho$。现假定沿直径凿通一条隧道，一质量为 $m$ 的质点在此隧道内只受地球的引力作用。（1）证明此质点的运动是简谐振动；（2）计算其周期。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）设质点到地心距离为 $x$，只有半径 $x$ 以内的球壳质量对它产生净引力，$x$ 以外的球壳对其合力为零

$$
M(x)=\frac{4}{3}\pi x^{3}\rho
$$

$$
F=-\frac{GmM(x)}{x^{2}}=-\frac{4}{3}\pi G\rho m\,x
$$

恢复力与位移成正比、方向相反，且 $\dfrac{F}{m}=-\dfrac{4\pi G\rho}{3}x=-\omega^{2}x$，故质点在隧道内作简谐振动

$$
\omega=\sqrt{\frac{4\pi G\rho}{3}}
$$

（2）周期

$$
T=\frac{2\pi}{\omega}=\sqrt{\frac{3\pi}{G\rho}}
=\sqrt{\frac{3\pi}{6.67\times10^{-11}\times5.5\times10^{3}}}\approx5.1\times10^{3}\ \mathrm{s}\approx85\ \mathrm{min}
$$

（数值代入时取地球平均密度 $\rho=5.5\times10^{3}\ \mathrm{kg\cdot m^{-3}}$；与 $\rho$ 的关系也可写成 $T=2\pi\sqrt{R/g}$，其中 $g=\dfrac{4}{3}\pi G\rho R$，结果相同。$T$ 与隧道长度、质点质量无关。）

</details>

### 3.
9-14 一弹簧下端挂一质量为 $m$ 的物体时，伸长量为 $9.8\times10^{-2}\ \mathrm{m}$。使物体上下振动，且规定向下为正方向。（1）当 $t=0$ 时，物体在平衡位置上方 $8.0\times10^{-2}\ \mathrm{m}$ 处，由静止开始向下运动，求运动方程；（2）当 $t=0$ 时，物体在平衡位置并以 $0.60\ \mathrm{m\cdot s^{-1}}$ 的速度向上运动，求运动方程。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

静止伸长为 $x_0=9.8\times10^{-2}\ \mathrm{m}$ 时 $mg=kx_0$

$$
\omega=\sqrt{\frac{k}{m}}=\sqrt{\frac{g}{x_0}}=\sqrt{\frac{9.8}{9.8\times10^{-2}}}=10\ \mathrm{rad\cdot s^{-1}}
$$

以平衡位置为原点、向下为正，设 $y=A\cos\left(\omega t+\varphi\right)$

（1）$t=0$ 时 $y_0=-8.0\times10^{-2}\ \mathrm{m}$，$v_0=0$

$$
A=\sqrt{y_0^{2}+\left(\frac{v_0}{\omega}\right)^{2}}=8.0\times10^{-2}\ \mathrm{m},\qquad \cos\varphi=-1\ \Rightarrow\ \varphi=\pi
$$

$$
y=8.0\times10^{-2}\cos\left(10t+\pi\right)\ \mathrm{m}\quad\left(\text{即 }y=-8.0\times10^{-2}\cos10t\ \mathrm{m}\right)
$$

（2）$t=0$ 时 $y_0=0$，$v_0=-0.60\ \mathrm{m\cdot s^{-1}}$

$$
A=\frac{\left|v_0\right|}{\omega}=\frac{0.60}{10}=6.0\times10^{-2}\ \mathrm{m}
$$

由 $y_0=A\cos\varphi=0$、$v_0=-A\omega\sin\varphi<0$ 得 $\varphi=\dfrac{\pi}{2}$

$$
y=6.0\times10^{-2}\cos\left(10t+\frac{\pi}{2}\right)\ \mathrm{m}
$$

</details>

### 4.
9-16 作简谐振动的物体，由平衡位置向 $x$ 轴正方向运动，试问经过下列路程所需的最短时间各为周期的几分之几？（1）由平衡位置到最大位移处；（2）由平衡位置到 $x=A/2$ 处；（3）由 $x=A/2$ 处到最大位移处。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

用旋转矢量：设 $x=A\cos\varphi$，位移对应的相位 $\varphi=\arccos\dfrac{x}{A}$，时间 $\Delta t=\dfrac{\Delta\varphi}{2\pi}T$。由平衡位置向正方向运动时 $\varphi_1=\dfrac{3\pi}{2}$（即 $-\dfrac{\pi}{2}$）。

（1）最大位移处 $\varphi_2=2\pi$

$$
\Delta\varphi=\frac{\pi}{2}\quad\Rightarrow\quad \Delta t=\frac{T}{4}
$$

（2）$x=A/2$ 且向正方向运动，$\varphi_2=\dfrac{5\pi}{3}$

$$
\Delta\varphi=\frac{5\pi}{3}-\frac{3\pi}{2}=\frac{\pi}{6}\quad\Rightarrow\quad \Delta t=\frac{T}{12}
$$

（3）$x=A/2$ 到最大位移处

$$
\Delta\varphi=2\pi-\frac{5\pi}{3}=\frac{\pi}{3}\quad\Rightarrow\quad \Delta t=\frac{T}{6}
$$

</details>

### 5.
9-25 如图所示，弹性系数为 $k$ 的轻弹簧系一质量为 $m_1$ 的物体，在水平面上作振幅为 $A$ 的简谐振动。一质量为 $m_2$ 的黏土从高度为 $h$ 处自由下落，正好在（a）物体通过平衡位置时，（b）物体在最大位移处时，落在物体上，在这两种情况下，问：（1）振动周期有何变化？（2）振幅有何变化？

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/3bfcd7a194eec06209b1a03e8c88d8bb.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）两种情况系统质量都变为 $m_1+m_2$

$$
T'=2\pi\sqrt{\frac{m_1+m_2}{k}}>2\pi\sqrt{\frac{m_1}{k}}=T
$$

即周期均**变大**，且两情况下周期相同。

（2）黏土竖直下落，与物体碰撞只改变水平方向的速度（竖直分动量被支持力冲量抵消），由水平动量守恒求碰后速度 $v'$，再用 $A'=\sqrt{x_0^{2}+\left(v'/\omega'\right)^{2}}$，$\omega'=\sqrt{\dfrac{k}{m_1+m_2}}$。

（a）平衡位置处 $x_0=0$，碰前速度最大 $v=A\omega=A\sqrt{\dfrac{k}{m_1}}$

$$
m_1v=\left(m_1+m_2\right)v'\quad\Rightarrow\quad v'=\frac{m_1}{m_1+m_2}A\sqrt{\frac{k}{m_1}}
$$

$$
A'=\frac{v'}{\omega'}=A\sqrt{\frac{m_1}{m_1+m_2}}<A\quad\left(\text{振幅变小}\right)
$$

（b）最大位移处 $x_0=A$ 而 $v=0$，碰后速度仍为零

$$
A'=\sqrt{A^{2}+0}=A\quad\left(\text{振幅不变}\right)
$$

注：碰撞瞬间机械能有损失，故用动量守恒而非能量守恒；振幅是否变化取决于碰撞时物体是否携带速度。

</details>

### 6.
9-30 质量 $m=10\ \mathrm{g}$ 的小球与轻弹簧组成一振动系统，按 $x=0.5\cos\left(8\pi t+\dfrac{\pi}{3}\right)$（式中 $x$ 的单位为 cm，$t$ 的单位为 s）的规律作自由振动，求：（1）振动的角频率、周期、振幅和初相；（2）振动的能量；（3）一个周期内的平均动能和平均势能。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）

$$
\omega=8\pi\ \mathrm{rad\cdot s^{-1}},\quad T=\frac{2\pi}{\omega}=0.25\ \mathrm{s},\quad A=0.5\ \mathrm{cm}=5.0\times10^{-3}\ \mathrm{m},\quad \varphi=\frac{\pi}{3}
$$

（2）$k=m\omega^{2}=1.0\times10^{-2}\times\left(8\pi\right)^{2}\approx6.32\ \mathrm{N\cdot m^{-1}}$

$$
E=\frac{1}{2}kA^{2}=\frac{1}{2}m\omega^{2}A^{2}
=\frac{1}{2}\times1.0\times10^{-2}\times\left(8\pi\right)^{2}\times\left(5.0\times10^{-3}\right)^{2}\approx7.9\times10^{-5}\ \mathrm{J}
$$

（3）一个周期内 $E_k$ 与 $E_p$ 各按 $\sin^{2}$、$\cos^{2}$ 变化，平均值相等

$$
\overline{E_k}=\overline{E_p}=\frac{1}{2}E\approx3.95\times10^{-5}\ \mathrm{J}
$$

</details>

