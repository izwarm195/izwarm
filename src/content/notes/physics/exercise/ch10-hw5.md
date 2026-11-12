---
title: "第十章 波动 第5次作业 驻波 多普勒效应（10-26 ~ 10-34）"
slug: "physics/exercise/ch10-hw5"
description: "10 26 如图所示， x 0 处有一运动方程为 y A cos omega t 的平面波源，产生的波沿 x 轴正、负方向传播。 MN 为波密介质的反射面，距波源 dfrac{3}{4} lambda 。求：（1）波源所发射的波沿波源 O 左右传播的波动方程；（2）在 MN 处反…"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第十章 波动 第5次作业 驻波 & 多普勒效应（10-26 ~ 10-34）

## 一. 计算题（共7题，100分）

### 1.
10-26 如图所示，$x=0$ 处有一运动方程为 $y=A\cos\omega t$ 的平面波源，产生的波沿 $x$ 轴正、负方向传播。$MN$ 为波密介质的反射面，距波源 $\dfrac{3}{4}\lambda$。求：（1）波源所发射的波沿波源 $O$ 左右传播的波动方程；（2）在 $MN$ 处反射波的波动方程；（3）在 $O$—$MN$ 区域内形成的驻波方程，以及波节和波腹的位置；（4）$x>0$ 区域内合成波的波动方程。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/ce23ac49df92686f7dcb932a4b01f340.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

由图 $MN$ 位于 $x=-\dfrac{3}{4}\lambda$ 处。

（1）自 $x=0$ 向两侧发射

$$
y_{\text{左}}=A\cos\left(\omega t+\frac{2\pi}{\lambda}x\right),\qquad
y_{\text{右}}=A\cos\left(\omega t-\frac{2\pi}{\lambda}x\right)
$$

（2）入射到 $MN$ 处（$x=-\dfrac{3}{4}\lambda$）的相位为 $\omega t-\dfrac{2\pi}{\lambda}\cdot\dfrac{3\lambda}{4}=\omega t-\dfrac{3\pi}{2}$；波密介质反射有半波损失，附加 $\pi$，反射点的相位为 $\omega t-\dfrac{\pi}{2}$。反射波沿 $+x$ 传播，设 $y_r=A\cos\left(\omega t-\dfrac{2\pi}{\lambda}x+\varphi_r\right)$，在 $x=-\dfrac{3}{4}\lambda$ 处

$$
\omega t+\frac{3\pi}{2}+\varphi_r=\omega t-\frac{\pi}{2}\quad\Rightarrow\quad \varphi_r=-2\pi
$$

$$
y_r=A\cos\left(\omega t-\frac{2\pi}{\lambda}x-2\pi\right)=A\cos\left(\omega t-\frac{2\pi}{\lambda}x\right)
$$

（3）$O$—$MN$ 区（$-\dfrac{3}{4}\lambda<x<0$）内入射波（向 $-x$）与反射波（向 $+x$）叠加

$$
y=y_{\text{左}}+y_r=2A\cos\left(\omega t\right)\cos\left(\frac{2\pi}{\lambda}x\right)
$$

波节：$\cos\dfrac{2\pi x}{\lambda}=0$

$$
x=\left(2k+1\right)\frac{\lambda}{4}\quad\Rightarrow\quad x=-\frac{\lambda}{4},\ -\frac{3\lambda}{4}
$$

波腹：$\left|\cos\dfrac{2\pi x}{\lambda}\right|=1$

$$
x=k\frac{\lambda}{2}\quad\Rightarrow\quad x=0,\ -\frac{\lambda}{2}
$$

（4）$x>0$ 区域内只有沿 $+x$ 传播的两列波（波源向右发射的波与经 $MN$ 反射后越过 $O$ 的波），相位相同

$$
y=y_{\text{右}}+y_r=2A\cos\left(\omega t-\frac{2\pi}{\lambda}x\right)
$$

</details>

### 2.
10-27 一条弦上的驻波方程式为 $y=0.03\cos\left(1.6\pi x\right)\cos\left(550\pi t\right)$，式中 $y$ 和 $x$ 的单位为 m，$t$ 的单位为 s。（1）若将此驻波看成是由传播方向相反、振幅及波速均相同的两列相干波叠加而成的，求它们的振幅及波速；（2）求相邻波节之间的距离；（3）求 $t=3.0\times10^{-3}\ \mathrm{s}$ 时位于 $x=0.625\ \mathrm{m}$ 处质点的振动速度。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

与 $y=2A\cos\left(kx\right)\cos\left(\omega t\right)$ 对比：$2A=0.03\ \mathrm{m}$，$k=1.6\pi\ \mathrm{m^{-1}}$，$\omega=550\pi\ \mathrm{rad\cdot s^{-1}}$

（1）

$$
A=1.5\times10^{-2}\ \mathrm{m},\qquad \lambda=\frac{2\pi}{k}=\frac{2\pi}{1.6\pi}=1.25\ \mathrm{m}
$$

$$
u=\frac{\omega}{k}=\frac{550\pi}{1.6\pi}\approx3.4\times10^{2}\ \mathrm{m\cdot s^{-1}}\ \left(344\ \mathrm{m\cdot s^{-1}}\right)
$$

（2）相邻波节间距

$$
\Delta x=\frac{\lambda}{2}=0.625\ \mathrm{m}
$$

（3）

$$
v=\frac{\partial y}{\partial t}=-0.03\omega\cos\left(1.6\pi x\right)\sin\left(550\pi t\right)
$$

$x=0.625\ \mathrm{m}$ 时 $\cos\left(1.6\pi\times0.625\right)=\cos\pi=-1$；$t=3.0\times10^{-3}\ \mathrm{s}$ 时 $550\pi t=1.65\pi$，$\sin1.65\pi=-0.891$

$$
v=-0.03\times550\pi\times\left(-1\right)\times\left(-0.891\right)\approx-46\ \mathrm{m\cdot s^{-1}}
$$

负号表示该质点沿 $-y$ 方向运动。

</details>

### 3.
10-29 一辆警车以 $25\ \mathrm{m\cdot s^{-1}}$ 的速度在静止的空气中行驶，假设车上警笛的频率为 $800\ \mathrm{Hz}$。（1）求静止站在路边的人听到警车驶近和离去时的警笛声波频率；（2）如果警车追赶一辆速度为 $15\ \mathrm{m\cdot s^{-1}}$ 的客车，那么客车上的人听到的警笛声波频率是多少？（设空气中的声速为 $u=330\ \mathrm{m\cdot s^{-1}}$。）

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）静止观察者，声源运动

$$
\nu'=\frac{u}{u\mp v_s}\nu
$$

驶近（取 $-$）

$$
\nu_1=\frac{330}{330-25}\times800\approx866\ \mathrm{Hz}
$$

离去（取 $+$）

$$
\nu_2=\frac{330}{330+25}\times800\approx744\ \mathrm{Hz}
$$

（2）警车（声源）追赶客车（观察者），二者同向，观察者远离、声源接近

$$
\nu'=\frac{u-v_o}{u-v_s}\nu=\frac{330-15}{330-25}\times800\approx826\ \mathrm{Hz}
$$

注意：观察者远离应使频率降低、声源接近使频率升高，本问中前者占优，故结果介于 $\nu$ 与 $\nu_1$ 之间。

</details>

### 4.
10-30 在一次军事演习中，两艘潜艇在水中相向而行，甲的速度为 $50.0\ \mathrm{km\cdot h^{-1}}$，乙的速度为 $70.0\ \mathrm{km\cdot h^{-1}}$，如图所示，甲潜艇发出一 $1.0\times10^{3}\ \mathrm{Hz}$ 的声音信号，设声波在水中的传播速度为 $5.47\times10^{3}\ \mathrm{km\cdot h^{-1}}$，试求：（1）乙潜艇接收到的信号频率；（2）甲潜艇接收到的从乙潜艇反射回来的信号频率。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

三者同单位即可，$u=5470\ \mathrm{km\cdot h^{-1}}$，$v_{\text{甲}}=50$，$v_{\text{乙}}=70\ \mathrm{km\cdot h^{-1}}$，$\nu_0=1.0\times10^{3}\ \mathrm{Hz}$。

（1）甲为声源（接近乙），乙为观察者（接近甲）

$$
\nu_1=\nu_0\frac{u+v_{\text{乙}}}{u-v_{\text{甲}}}
=1000\times\frac{5470+70}{5470-50}=1000\times\frac{5540}{5420}\approx1.022\times10^{3}\ \mathrm{Hz}
$$

即 $\nu_1\approx1022\ \mathrm{Hz}$。

（2）乙反射后相当于新的声源（频率 $\nu_1$，接近甲），甲为观察者（接近乙）

$$
\nu_2=\nu_1\frac{u+v_{\text{甲}}}{u-v_{\text{乙}}}
=1022\times\frac{5470+50}{5470-70}=1022\times\frac{5520}{5400}\approx1.045\times10^{3}\ \mathrm{Hz}
$$

即 $\nu_2\approx1045\ \mathrm{Hz}$。

</details>

### 5.
10-31 在下述两种情况下，求长度为 $0.15\ \mathrm{m}$ 的风琴管的基频和前四个谐频。设声速为 $340\ \mathrm{m\cdot s^{-1}}$。（1）管子的两端开口；（2）管子的一端封闭，一端开口。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）两端开口，两端都是波腹，$L=n\dfrac{\lambda}{2}$

$$
\nu_n=\frac{nu}{2L}=n\times\frac{340}{2\times0.15}=n\times1133\ \mathrm{Hz}
$$

$$
\nu_1=1133,\quad \nu_2=2267,\quad \nu_3=3400,\quad \nu_4=4533,\quad \nu_5=5667\ \mathrm{Hz}
$$

（2）一端封闭，封闭端为波节，$L=\left(2n-1\right)\dfrac{\lambda}{4}$

$$
\nu_n=\left(2n-1\right)\frac{u}{4L}=\left(2n-1\right)\times567\ \mathrm{Hz}
$$

$$
\nu_1=567,\quad \nu_2=1700,\quad \nu_3=2833,\quad \nu_4=3967,\quad \nu_5=5100\ \mathrm{Hz}
$$

一端封闭时只有奇次谐频（无偶次谐频）。

</details>

### 6.
10-32 一平面简谐波的频率为 $500\ \mathrm{Hz}$，在空气（$\rho=1.3\ \mathrm{kg\cdot m^{-3}}$）中以 $u=340\ \mathrm{m\cdot s^{-1}}$ 的速度传播，到达人耳时振幅约为 $A=1.0\times10^{-6}\ \mathrm{m}$。试求波在耳中的平均能量密度和声强。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\omega=2\pi\nu=1000\pi\ \mathrm{rad\cdot s^{-1}}$

$$
\overline{w}=\frac{1}{2}\rho\omega^{2}A^{2}
=\frac{1}{2}\times1.3\times\left(1000\pi\right)^{2}\times\left(1.0\times10^{-6}\right)^{2}\approx6.4\times10^{-6}\ \mathrm{J\cdot m^{-3}}
$$

$$
I=\overline{w}u=6.4\times10^{-6}\times340\approx2.2\times10^{-3}\ \mathrm{W\cdot m^{-2}}
$$

</details>

### 7.
10-34 若在同一介质中传播的频率为 $1200\ \mathrm{Hz}$ 和 $400\ \mathrm{Hz}$ 的两声波有相同的振幅，求：（1）它们的强度之比；（2）两列声波的声强级差。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

同一介质 $\rho$、$u$ 相同，$I=\dfrac{1}{2}\rho\omega^{2}A^{2}u\propto\nu^{2}$

（1）

$$
\frac{I_1}{I_2}=\left(\frac{\nu_1}{\nu_2}\right)^{2}=\left(\frac{1200}{400}\right)^{2}=9
$$

（2）声强级 $L=10\lg\dfrac{I}{I_0}$

$$
\Delta L=10\lg\frac{I_1}{I_2}=10\lg9\approx9.5\ \mathrm{dB}
$$

</details>

