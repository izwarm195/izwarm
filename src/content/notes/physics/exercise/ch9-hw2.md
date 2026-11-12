---
title: "第九章 振动 第2讲作业（9-21 ~ 9-35）"
slug: "physics/exercise/ch9-hw2"
description: "9 21 一单摆摆长为 1.0 mathrm{m} ，最大摆角为 5^{ circ} ，如图所示。（1）求摆的角频率和周期；（2）设开始时摆角最大，试写出此单摆的运动方程；（3）当摆角为 3^{ circ} 时，摆球的角速度和线速度各为多少？"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第九章 振动 第2讲作业（9-21 ~ 9-35）

## 一. 计算题（共6题，100分）

### 1.
9-21 一单摆摆长为 $1.0\ \mathrm{m}$，最大摆角为 $5^{\circ}$，如图所示。（1）求摆的角频率和周期；（2）设开始时摆角最大，试写出此单摆的运动方程；（3）当摆角为 $3^{\circ}$ 时，摆球的角速度和线速度各为多少？

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/c1d4bbf94daf19fd84a1929f25224fb8.jpg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$5^{\circ}$ 属小角度，$\sin\theta\approx\theta$，作简谐振动

$$
\omega=\sqrt{\frac{g}{l}}=\sqrt{\frac{9.8}{1.0}}\approx3.13\ \mathrm{rad\cdot s^{-1}},\qquad T=\frac{2\pi}{\omega}=2\pi\sqrt{\frac{l}{g}}\approx2.01\ \mathrm{s}
$$

（1）$\omega\approx3.1\ \mathrm{rad\cdot s^{-1}}$，$T\approx2.0\ \mathrm{s}$

（2）$t=0$ 时摆角最大、速度为零，故振幅 $\theta_m=5^{\circ}=\dfrac{\pi}{36}\ \mathrm{rad}$，初相 $\varphi=0$

$$
\theta=5^{\circ}\cos\left(3.13t\right)\quad\text{或}\quad \theta=\frac{\pi}{36}\cos\left(3.13t\right)
$$

（3）$\theta=\theta_m\cos\left(\omega t+\varphi\right)$，角速度

$$
\omega_\theta=\frac{\mathrm{d}\theta}{\mathrm{d}t}=-\omega\theta_m\sin\left(\omega t\right)
$$

由 $\theta=3^{\circ}$ 得 $\cos\left(\omega t\right)=\dfrac{3}{5}=0.6$，$\sin\left(\omega t\right)=0.8$

$$
\omega_\theta=-3.13\times\frac{\pi}{36}\times0.8\approx-0.22\ \mathrm{rad\cdot s^{-1}}
$$

$$
v=l\left|\omega_\theta\right|=1.0\times0.218\approx0.22\ \mathrm{m\cdot s^{-1}}
$$

负号表示摆球正朝平衡位置运动。

</details>

### 2.
9-23 如图所示，将质量为 $m$、半径为 $R$ 的均匀圆柱体中心系于一水平的轻弹簧上，使它可以在水平面上无滑动地滚动。弹簧的弹性系数为 $k=3\ \mathrm{N\cdot m^{-1}}$。假设将圆柱体从弹簧原长处拉开 $x_0=0.20\ \mathrm{m}$ 后，由静止释放。（1）求圆柱体通过平衡位置时的平动动能和转动动能；（2）证明圆柱体质心 $O$ 的运动是简谐振动，并求振动周期。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/55e25f19e00da5f52b57a0425b1fef40.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

无滑动滚动 $v=R\omega$，圆柱体 $J=\dfrac{1}{2}mR^{2}$，机构能守恒

$$
\frac{1}{2}kx_0^{2}=\frac{1}{2}mv^{2}+\frac{1}{2}J\omega^{2}
=\frac{1}{2}mv^{2}+\frac{1}{4}mv^{2}=\frac{3}{4}mv^{2}
$$

（1）

$$
v^{2}=\frac{2kx_0^{2}}{3m},\qquad
E_{k\text{平}}=\frac{1}{2}mv^{2}=\frac{kx_0^{2}}{3}
$$

$$
E_{k\text{平}}=\frac{3\times0.20^{2}}{3}=0.040\ \mathrm{J},\qquad
E_{k\text{转}}=\frac{1}{2}J\omega^{2}=\frac{1}{4}mv^{2}=\frac{kx_0^{2}}{6}=0.020\ \mathrm{J}
$$

（2）设质心位移 $x$（向右为正），弹簧力 $-kx$，静摩擦力 $f$ 向左，则

$$
-kx-f=ma,\qquad fR=J\alpha=\frac{1}{2}mR^{2}\cdot\frac{a}{R}
$$

由第二式 $f=\dfrac{1}{2}ma$，代入第一式

$$
-kx=\frac{3}{2}ma\quad\Rightarrow\quad a=-\frac{2k}{3m}x
$$

加速度与位移成正比且反向，故质心作简谐振动，$\omega^{2}=\dfrac{2k}{3m}$

$$
T=\frac{2\pi}{\omega}=2\pi\sqrt{\frac{3m}{2k}}
$$

</details>

### 3.
9-27 如图所示，质量为 $1.00\times10^{-2}\ \mathrm{kg}$ 的子弹以 $500\ \mathrm{m\cdot s^{-1}}$ 的速度射入并嵌在木块中，同时使弹簧压缩从而开始作简谐振动。设木块的质量为 $4.99\ \mathrm{kg}$，弹簧的弹性系数为 $8.00\times10^{3}\ \mathrm{N\cdot m^{-1}}$。若以弹簧原长时物体所在处为坐标原点，向左为 $x$ 轴正向，求简谐振动的运动方程。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/2a77a8bd453d43227e124652bb96f6ef.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

子弹与木块完全非弹性碰撞，动量守恒（碰撞极短，弹簧尚未形变）

$$
m_1v=\left(m_1+m_2\right)V\quad\Rightarrow\quad V=\frac{1.00\times10^{-2}\times500}{1.00\times10^{-2}+4.99}=1.0\ \mathrm{m\cdot s^{-1}}
$$

碰后系统作简谐振动

$$
\omega=\sqrt{\frac{k}{m_1+m_2}}=\sqrt{\frac{8.00\times10^{3}}{5.00}}=40\ \mathrm{rad\cdot s^{-1}}
$$

$$
A=\frac{V}{\omega}=\frac{1.0}{40}=2.5\times10^{-2}\ \mathrm{m}
$$

初相：$t=0$ 时物体在原长处即 $x=0$；题设向左为 $x$ 轴正向，而子弹从左侧射入、木块被推向右（弹簧在右侧），故 $t=0$ 时 $v<0$。由 $\cos\varphi=0$、$v=-A\omega\sin\varphi<0$ 得 $\varphi=\dfrac{\pi}{2}$

$$
x=2.5\times10^{-2}\cos\left(40t+\frac{\pi}{2}\right)\ \mathrm{m}
$$

</details>

### 4.
9-31 已知两同方向同频率的简谐振动的运动方程分别为 $x_1=0.05\cos\left(10t+0.75\pi\right)$，$x_2=0.06\cos\left(10t+0.25\pi\right)$，式中 $x_1$、$x_2$ 的单位为 m，$t$ 的单位为 s。（1）求合振动的振幅及初相；（2）若有另一同方向同频率的简谐振动 $x_3=0.07\cos\left(10t+\varphi_3\right)$，式中 $x_3$ 的单位为 m，$t$ 的单位为 s，则 $\varphi_3$ 为多少时，$x_1+x_3$ 的振幅最大？又 $\varphi_3$ 为多少时，$x_2+x_3$ 的振幅最小？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）相位差 $\Delta\varphi=\varphi_2-\varphi_1=0.25\pi-0.75\pi=-\dfrac{\pi}{2}$，$\cos\Delta\varphi=0$

$$
A=\sqrt{A_1^{2}+A_2^{2}+2A_1A_2\cos\Delta\varphi}
=\sqrt{0.05^{2}+0.06^{2}}=0.078\ \mathrm{m}
$$

初相由振幅矢量合成

$$
\tan\varphi=\frac{\sum A_i\sin\varphi_i}{\sum A_i\cos\varphi_i}
=\frac{0.05\sin0.75\pi+0.06\sin0.25\pi}{0.05\cos0.75\pi+0.06\cos0.25\pi}
$$

$$
=\frac{\left(0.05+0.06\right)\times0.7071}{\left(-0.05+0.06\right)\times0.7071}=\frac{0.11}{0.01}=11
$$

$\varphi$ 在第一象限（分子分母同正），$\varphi\approx84.9^{\circ}=1.48\ \mathrm{rad}$，合振动为 $x=0.078\cos\left(10t+1.48\right)$ m。

（2）振幅最大要求同相；振幅最小要求反相

$$
\varphi_3-\varphi_1=2k\pi\ \Rightarrow\ \varphi_3=0.75\pi+2k\pi\qquad\left(x_1+x_3\ \text{最大}\right)
$$

$$
\varphi_3-\varphi_2=\left(2k+1\right)\pi\ \Rightarrow\ \varphi_3=1.25\pi+2k\pi\qquad\left(x_2+x_3\ \text{最小}\right)
$$

其中 $k=0,\pm1,\pm2,\cdots$

</details>

### 5.
9-32 将频率为 $348\ \mathrm{Hz}$ 的标准音叉振动和一待测频率的音叉振动合成，测得拍频为 $3.0\ \mathrm{Hz}$。若在待测频率音叉的一端加上一小块物体，则拍频将减小，求待测音叉的固有频率。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

拍频等于两频率之差

$$
\Delta\nu=\left|\nu_2-\nu_1\right|=3.0\ \mathrm{Hz}\quad\Rightarrow\quad \nu_2=351\ \mathrm{Hz}\ \text{或}\ 345\ \mathrm{Hz}
$$

音叉加质量后等效质量增大，固有频率**降低**。若 $\nu_2=351\ \mathrm{Hz}$，加质量后 $\nu_2\downarrow$，拍频减小；若 $\nu_2=345\ \mathrm{Hz}$，加质量后 $\nu_2\downarrow$，拍频反而增大

$$
\nu_2=348+3.0=351\ \mathrm{Hz}
$$

</details>

### 6.
9-35 两个同频率简谐振动 1 和 2 的振动曲线如图所示。（1）求两简谐振动的运动方程 $x_1$ 和 $x_2$；（2）在同一图中画出两简谐振动的旋转矢量，并比较两振动的相位关系；（3）若两简谐振动叠加，求合振动的运动方程。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/bdb68c70a11cb6c818d5409b92af5b7a.jpg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

由曲线读出：振幅 $A_1=A_2=0.10\ \mathrm{m}$，周期 $T=2.0\ \mathrm{s}$，故 $\omega=\dfrac{2\pi}{T}=\pi\ \mathrm{rad\cdot s^{-1}}$。

（1）曲线 1：$t=0$ 时 $x=0$ 且向正方向运动，$\varphi_1=-\dfrac{\pi}{2}$（即 $\dfrac{3\pi}{2}$）

$$
x_1=0.10\cos\left(\pi t-\frac{\pi}{2}\right)\ \mathrm{m}
$$

曲线 2：$t=0$ 时 $x=0.05\ \mathrm{m}=\dfrac{A}{2}$ 且向负方向运动，$\varphi_2=\dfrac{\pi}{3}$

$$
x_2=0.10\cos\left(\pi t+\frac{\pi}{3}\right)\ \mathrm{m}
$$

（2）相位差

$$
\Delta\varphi=\varphi_2-\varphi_1=\frac{\pi}{3}-\left(-\frac{\pi}{2}\right)=\frac{5\pi}{6}
$$

即振动 2 的相位超前振动 1 达 $\dfrac{5\pi}{6}$，二者既不同相也不反相，合振动振幅介于 $\left|A_1-A_2\right|$ 与 $A_1+A_2$ 之间。

（3）

$$
A=\sqrt{A_1^{2}+A_2^{2}+2A_1A_2\cos\Delta\varphi}
=0.10\sqrt{2+2\cos\frac{5\pi}{6}}\approx0.052\ \mathrm{m}
$$

两振幅相等，合振动初相为两者相位平均值

$$
\varphi=\frac{\varphi_1+\varphi_2}{2}=\frac{-\pi/2+\pi/3}{2}=-\frac{\pi}{12}
$$

$$
x=0.052\cos\left(\pi t-\frac{\pi}{12}\right)\ \mathrm{m}
$$

</details>

