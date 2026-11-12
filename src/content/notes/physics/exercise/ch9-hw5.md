---
title: "第九章 振动 第五周作业 振动复习 杨氏双缝干涉（9-17 ~ 11-12）"
slug: "physics/exercise/ch9-hw5"
description: "9 17 在一块平板下装有弹簧，平板上放一质量为 1.0 mathrm{kg} 的重物。现使平板沿竖直方向作上下简谐振动，周期为 0.50 mathrm{s} ，振幅为 A 2.0 times10^{ 2} mathrm{m} 。求：（1）平板到最低点时，重物对平板的作用力；（2…"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第九章 振动 第五周作业 振动复习 & 杨氏双缝干涉（9-17 ~ 11-12）

## 一. 计算题（共7题，100分）

### 1.
9-17 在一块平板下装有弹簧，平板上放一质量为 $1.0\ \mathrm{kg}$ 的重物。现使平板沿竖直方向作上下简谐振动，周期为 $0.50\ \mathrm{s}$，振幅为 $A=2.0\times10^{-2}\ \mathrm{m}$。求：（1）平板到最低点时，重物对平板的作用力；（2）若频率不变，则平板以多大的振幅振动时，重物会跳离平板？（3）若振幅不变，则平板以多大的频率振动时，重物会跳离平板？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\omega=\frac{2\pi}{T}=\frac{2\pi}{0.50}=4\pi\approx12.6\ \mathrm{rad\cdot s^{-1}},\qquad \omega^{2}\approx1.6\times10^{2}\ \mathrm{s^{-2}}
$$

（1）最低点加速度向上、大小为 $\omega^{2}A$

$$
N-mg=m\omega^{2}A\quad\Rightarrow\quad N=m\left(g+\omega^{2}A\right)
$$

$$
N=1.0\times\left(9.8+1.6\times10^{2}\times2.0\times10^{-2}\right)\approx13\ \mathrm{N}
$$

由牛顿第三定律，重物对平板的作用力大小约 $13\ \mathrm{N}$，方向竖直向下。

（2）平板在最高点加速度向下，重物恰跳离时支持力 $N=0$

$$
mg=m\omega^{2}A'\quad\Rightarrow\quad A'=\frac{g}{\omega^{2}}=\frac{9.8}{\left(4\pi\right)^{2}}\approx6.2\times10^{-2}\ \mathrm{m}
$$

（3）振幅不变，需

$$
\omega'^{2}=\frac{g}{A}=\frac{9.8}{2.0\times10^{-2}}=490\ \mathrm{s^{-2}}
$$

$$
\nu'=\frac{\omega'}{2\pi}=\frac{1}{2\pi}\sqrt{\frac{g}{A}}\approx3.5\ \mathrm{Hz}
$$

</details>

### 2.
9-24 如图所示，一弹性系数为 $k$ 的轻弹簧，其下挂有一质量为 $m_1$ 的空盘。现有一质量为 $m_2$ 的物体从盘上方高为 $h$ 处自由落到盘中，并和盘黏在一起振动。问：（1）此时的振动周期与空盘作振动的周期有何不同？（2）此时的振幅为多大？

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/d748154d44ed4cd484d1d6622f6b6f11.jpg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）质量由 $m_1$ 变为 $m_1+m_2$

$$
T=2\pi\sqrt{\frac{m_1}{k}}\ \longrightarrow\ T'=2\pi\sqrt{\frac{m_1+m_2}{k}}>T
$$

即周期变长。

（2）物体自由下落 $h$ 后速度为 $v_0=\sqrt{2gh}$，与盘完全非弹性碰撞，动量守恒

$$
m_2v_0=\left(m_1+m_2\right)V\quad\Rightarrow\quad V=\frac{m_2}{m_1+m_2}\sqrt{2gh}
$$

碰后新平衡位置比原平衡位置低 $x_0=\dfrac{m_2g}{k}$，而碰撞瞬间盘仍在原平衡位置，即偏离新平衡 $x_0$，且速度为 $V$

$$
A=\sqrt{x_0^{2}+\left(\frac{V}{\omega}\right)^{2}},\qquad \omega=\sqrt{\frac{k}{m_1+m_2}}
$$

$$
A=\sqrt{\left(\frac{m_2g}{k}\right)^{2}+\frac{2ghm_2^{2}}{k\left(m_1+m_2\right)}}
=\frac{m_2}{k}\sqrt{g^{2}+\frac{2kgh}{m_1+m_2}}
$$

</details>

### 3.
9-39 在一个 LC 振荡电路中，若电容器两极板上的交变电压 $u=50\cos\left(10^{4}\pi t\right)$（式中 $u$ 的单位为 V，$t$ 的单位为 s），电容 $C=1.0\times10^{-7}\ \mathrm{F}$，电路中的电阻可以忽略不计，求：（1）振荡的周期；（2）电路的自感；（3）电路中电流随时间变化的规律。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）$\omega=10^{4}\pi\ \mathrm{rad\cdot s^{-1}}$

$$
T=\frac{2\pi}{\omega}=2.0\times10^{-4}\ \mathrm{s}
$$

（2）由 $\omega^{2}=\dfrac{1}{LC}$

$$
L=\frac{1}{\omega^{2}C}=\frac{1}{\left(10^{4}\pi\right)^{2}\times1.0\times10^{-7}}\approx1.01\times10^{-2}\ \mathrm{H}
$$

（3）$q=Cu$，

$$
i=\frac{\mathrm{d}q}{\mathrm{d}t}=C\frac{\mathrm{d}u}{\mathrm{d}t}=-C\omega U_m\sin\left(\omega t\right)
$$

$$
i=-1.0\times10^{-7}\times10^{4}\pi\times50\sin\left(10^{4}\pi t\right)=-1.6\times10^{-1}\sin\left(10^{4}\pi t\right)\ \mathrm{A}
$$

</details>

### 4.
9-41 已知一振荡电路 $C=0.025\ \mu\mathrm{F}$，$L=1.015\ \mathrm{H}$，电路中的电阻可忽略不计，电容器上电荷的最大值为 $Q_0=2.5\times10^{-6}\ \mathrm{C}$。（1）写出电路接通后，电容器两极板间的电势差随时间而变化的方程和电路中电流随时间而变化的方程；（2）写出电场能量、磁场能量及总能量随时间而变化的方程；（3）求 $t_1=T/8$ 和 $t_2=T/4$ 时，电容器两极板间的电势差、电路中的电流、电场能、磁场能。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\omega=\frac{1}{\sqrt{LC}}=\frac{1}{\sqrt{1.015\times0.025\times10^{-6}}}\approx6.3\times10^{3}\ \mathrm{rad\cdot s^{-1}}\ \left(\approx2.0\times10^{3}\pi\right)
$$

$$
T=\frac{2\pi}{\omega}\approx1.0\times10^{-3}\ \mathrm{s},\quad U_m=\frac{Q_0}{C}=100\ \mathrm{V},\quad I_m=\omega Q_0\approx1.6\times10^{-2}\ \mathrm{A}
$$

（1）设 $t=0$ 时极板电荷最大

$$
u=100\cos\left(2000\pi t\right)\ \mathrm{V},\qquad i=-1.6\times10^{-2}\sin\left(2000\pi t\right)\ \mathrm{A}
$$

（2）

$$
W_E=\frac{q^{2}}{2C}=1.25\times10^{-4}\cos^{2}\left(2000\pi t\right)\ \mathrm{J}
$$

$$
W_B=\frac{1}{2}Li^{2}=1.25\times10^{-4}\sin^{2}\left(2000\pi t\right)\ \mathrm{J}
$$

$$
W=W_E+W_B=\frac{Q_0^{2}}{2C}=1.25\times10^{-4}\ \mathrm{J}\quad\left(\text{常量}\right)
$$

（3）$t_1=T/8$ 时 $2000\pi t=\pi/4$；$t_2=T/4$ 时 $2000\pi t=\pi/2$

$$
t_1:\quad u=70.7\ \mathrm{V},\quad i=-1.1\times10^{-2}\ \mathrm{A},\quad W_E=W_B=6.3\times10^{-5}\ \mathrm{J}
$$

$$
t_2:\quad u=0,\quad i=-1.6\times10^{-2}\ \mathrm{A},\quad W_E=0,\quad W_B=1.25\times10^{-4}\ \mathrm{J}
$$

</details>

### 5.
11-10 在双缝干涉实验中，两缝间距为 $0.30\ \mathrm{mm}$，用单色光垂直照射双缝，在离缝 $1.20\ \mathrm{m}$ 的屏上测得中央明纹一侧第 5 条暗纹与另一侧第 5 条暗纹间的距离为 $22.78\ \mathrm{mm}$。问所用光波长为多少？是什么颜色的光？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

暗纹位置 $x_k=\left(2k-1\right)\dfrac{\lambda D}{2d}$，第 5 条暗纹 $k=5$，两侧间距为 $2x_5$

$$
\Delta x=\frac{9\lambda D}{d}\quad\Rightarrow\quad
\lambda=\frac{d\,\Delta x}{9D}=\frac{0.30\times10^{-3}\times22.78\times10^{-3}}{9\times1.20}
$$

$$
\lambda\approx6.33\times10^{-7}\ \mathrm{m}=633\ \mathrm{nm}
$$

属红光（氦氖激光波长）。

</details>

### 6.
11-11 在双缝干涉实验中，用波长 $\lambda=546.1\ \mathrm{nm}$ 的单色光照射，双缝与屏的距离 $D=300\ \mathrm{mm}$。现测得中央明纹两侧的两个第五级明纹的间距为 $12.2\ \mathrm{mm}$，求双缝间距。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

第 5 级明纹位置 $x_5=\dfrac{5\lambda D}{d}$，两侧共 10 个条纹间隔

$$
\Delta x=2x_5=\frac{10\lambda D}{d}\quad\Rightarrow\quad
d=\frac{10\lambda D}{\Delta x}=\frac{10\times546.1\times10^{-9}\times0.300}{12.2\times10^{-3}}
$$

$$
d\approx1.34\times10^{-4}\ \mathrm{m}=0.134\ \mathrm{mm}
$$

</details>

### 7.
11-12 一个微波发射器置于岸上，离水面高度为 $d$，对岸在离水面高度 $h$ 处放置一接收器，水面宽度为 $D$，且 $D\gg d$，$D\gg h$，如图所示。发射器向对面发射波长为 $\lambda$ 的微波，且 $\lambda<d$，问接收器测得极大值时，至少离地多高？

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/9c03bc2e2d8e0c57eb82d38251288a21.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

接收器收到直射波与水面上反射波（洛埃镜，水面反射有半波损失），波程差

$$
\delta=\sqrt{D^{2}+\left(d-h\right)^{2}}-\sqrt{D^{2}+\left(d+h\right)^{2}}+\frac{\lambda}{2}
$$

因 $D\gg d,h$，用 $\sqrt{D^{2}+x^{2}}\approx D+\dfrac{x^{2}}{2D}$

$$
\delta\approx\frac{\left(d+h\right)^{2}-\left(d-h\right)^{2}}{2D}+\frac{\lambda}{2}=\frac{2dh}{D}+\frac{\lambda}{2}
$$

极大条件 $\delta=k\lambda\ \left(k=1,2,\cdots\right)$

$$
\frac{2dh}{D}=\left(k-\frac{1}{2}\right)\lambda\quad\Rightarrow\quad h=\frac{\left(2k-1\right)\lambda D}{4d}
$$

取 $k=1$ 得最小高度

$$
h_{\min}=\frac{\lambda D}{4d}
$$

</details>

