---
title: "第九章 振动 习题"
slug: "physics/exercise/ch9"
description: "一质量为 m 的物体挂在劲度系数为 k 的轻弹簧下面，振动角频率为 omega 。若把此弹簧分割成二等份，将物体 m 挂在分割后的一根弹簧上，则振动角频率是"
publishDate: "2026-10-19"
createdAt: "2026-10-19T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第九章 振动 习题

## 一、选择题

### 1.

一质量为 $m$ 的物体挂在劲度系数为 $k$ 的轻弹簧下面，振动角频率为 $\omega$。若把此弹簧分割成二等份，将物体 $m$ 挂在分割后的一根弹簧上，则振动角频率是

(A) $2\omega$　(B) $\sqrt{2}\omega$　(C) $\omega/\sqrt{2}$　(D) $\omega/2$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

弹簧的劲度系数与长度成反比，分割后

$$
k'=2k
$$

$$
\omega'=\sqrt{\frac{k'}{m}}=\sqrt{2}\,\omega
$$

选 (B)。

</details>

### 2.

一弹簧振子，当把它水平放置时，它可以作简谐振动。若把它竖直放置或放在固定的光滑斜面上，试判断下面哪种情况是正确的：

(A) 竖直放置可作简谐振动，放在光滑斜面上不能作简谐振动

(B) 竖直放置不能作简谐振动，放在光滑斜面上可作简谐振动

(C) 两种情况都可作简谐振动

(D) 两种情况都不能作简谐振动

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

重力为恒力，只把平衡位置移开，回复力仍为 $F=-k(x-x_0)$，两种情况都满足简谐振动判据。

选 (C)。

</details>

### 3.

一质点作简谐振动，周期为 $T$。质点由平衡位置向 $x$ 轴正方向运动时，由平衡位置到二分之一最大位移这段路程所需要的时间为

(A) $T/4$　(B) $T/6$　(C) $T/8$　(D) $T/12$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

取

$$
x=A\sin\frac{2\pi t}{T}
$$

令 $x=A/2$：

$$
\sin\frac{2\pi t}{T}=\frac{1}{2}
\ \Rightarrow\ \frac{2\pi t}{T}=\frac{\pi}{6}
\ \Rightarrow\ t=\frac{T}{12}
$$

选 (D)。

</details>

### 4.

当质点以频率 $\nu$ 作简谐振动时，它的动能的变化频率为

(A) $4\nu$　(B) $2\nu$　(C) $\nu$　(D) $\nu/2$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
E_k=\frac{1}{2}m\omega^2A^2\sin^2(\omega t+\varphi)
=\frac{1}{4}m\omega^2A^2\left[1-\cos 2(\omega t+\varphi)\right]
$$

动能的变化角频率为 $2\omega$，变化频率为 $2\nu$。

选 (B)。

</details>

## 二、填空题

### 5.

一弹簧振子作简谐振动，振幅为 $A$，周期为 $T$，其运动方程用余弦函数表示。若 $t=0$ 时，(1) 振子在负的最大位移处，则初相为 ___；(2) 振子在平衡位置向正方向运动，则初相为 ___；(3) 振子在位移为 $A/2$ 处，且向负方向运动，则初相为 ___。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $x=-A$，$v=0$：

$$
\varphi=\pi
$$

(2) $x=0$，$v>0$：

$$
\varphi=-\frac{\pi}{2}
$$

(3) $x=A/2$，$v<0$：

$$
\cos\varphi=\frac{1}{2},\quad \sin\varphi>0
\ \Rightarrow\ \varphi=\frac{\pi}{3}
$$

填：$\pi$；$-\pi/2$；$\pi/3$。

</details>

### 6.

一简谐振动的表达式为 $x=A\cos(3t+\varphi)$，已知 $t=0$ 时的初位移为 $0.04\ \mathrm{m}$，初速度为 $0.09\ \mathrm{m/s}$，则振幅 $A=$ ___，初相 $\varphi=$ ___。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
A=\sqrt{x_0^2+\frac{v_0^2}{\omega^2}}
=\sqrt{0.04^2+\frac{0.09^2}{3^2}}
=0.05\ \mathrm{m}
$$

$$
\tan\varphi=-\frac{v_0}{\omega x_0}
=-\frac{0.09}{3\times0.04}
=-0.75
$$

$x_0>0$、$v_0>0$，故 $\varphi$ 在第四象限：

$$
\varphi=-36.9^\circ=-0.205\pi
$$

填：$0.05\ \mathrm{m}$；$-0.205\pi$。

</details>

### 7.

两个同方向的简谐振动，周期相同，振幅分别为 $A_1=0.05\ \mathrm{m}$ 和 $A_2=0.07\ \mathrm{m}$，它们合成为一个振幅为 $A=0.09\ \mathrm{m}$ 的简谐振动。则这两个分振动的相位差 ___ $\mathrm{rad}$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
A^2=A_1^2+A_2^2+2A_1A_2\cos\Delta\varphi
$$

$$
\cos\Delta\varphi
=\frac{0.09^2-0.05^2-0.07^2}{2\times0.05\times0.07}
=0.1
$$

$$
\Delta\varphi=1.47\ \mathrm{rad}
$$

</details>

## 三、计算题

### 8.

一轻弹簧在 $60\ \mathrm{N}$ 的拉力下伸长 $30\ \mathrm{cm}$。现把质量为 $4\ \mathrm{kg}$ 的物体悬挂在该弹簧的下端并使之静止，再把物体向下拉 $10\ \mathrm{cm}$，然后由静止释放并开始计时。求：(1) 物体的振动方程；(2) 物体在平衡位置上方 $5\ \mathrm{cm}$ 时弹簧对物体的拉力；(3) 物体从第一次越过平衡位置时刻起到它运动到上方 $5\ \mathrm{cm}$ 处所需要的最短时间。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
k=\frac{60}{0.30}=200\ \mathrm{N/m},\qquad
\omega=\sqrt{\frac{k}{m}}=\sqrt{50}=7.07\ \mathrm{rad/s}
$$

取平衡位置为原点、向下为 $x$ 轴正方向。

(1) $t=0$ 时 $x_0=0.10\ \mathrm{m}$、$v_0=0$，故 $A=0.10\ \mathrm{m}$、$\varphi=0$：

$$
x=0.10\cos(7.07t)\quad \mathrm{(SI)}
$$

(2) $x=-0.05\ \mathrm{m}$ 时

$$
a=-\omega^2x=2.5\ \mathrm{m/s^2}
$$

$$
F=m(g-a)=4(9.8-2.5)=29.2\ \mathrm{N}
$$

(3) 第一次越过平衡位置向上运动时 $\omega t_1=\pi/2$；运动到 $x=-0.05\ \mathrm{m}$ 时 $\omega t_2=2\pi/3$：

$$
\Delta t=\frac{2\pi/3-\pi/2}{\omega}
=\frac{\pi}{6\omega}=0.074\ \mathrm{s}
$$

</details>

### 9.

如图，有一水平弹簧振子，弹簧的劲度系数 $k=24\ \mathrm{N/m}$，重物的质量 $m=6\ \mathrm{kg}$，重物静止在平衡位置上。设以一水平恒力 $F=10\ \mathrm{N}$ 向左作用于物体（不计摩擦），使之由平衡位置向左运动了 $0.05\ \mathrm{m}$ 时撤去力 $F$。当重物运动到左方最远位置时开始计时，求物体的运动方程。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/e6e7120842a187e9ad1e31b19728d9db.jpg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

恒力做的功全部转化为振动能量：

$$
W=Fx=10\times0.05=0.5\ \mathrm{J}=\frac{1}{2}kA^2
$$

$$
A=\sqrt{\frac{2\times0.5}{24}}=0.204\ \mathrm{m},\qquad
\omega=\sqrt{\frac{k}{m}}=\sqrt{\frac{24}{6}}=2\ \mathrm{rad/s}
$$

计时起点为左方最远位置，$\varphi=\pi$：

$$
x=0.204\cos(2t+\pi)\quad \mathrm{(SI)}
$$

</details>

### 10.

在一竖直轻弹簧的下端悬挂一小球，弹簧被拉长 $l_0=1.2\ \mathrm{cm}$ 而平衡。再经拉动后，该小球在竖直方向作振幅为 $A=2\ \mathrm{cm}$ 的振动，试证此振动为简谐振动；选小球在正最大位移处开始计时，写出此振动的数值表达式。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

设小球质量为 $m$，平衡时

$$
kl_0=mg
$$

取平衡位置为原点、向下为正，位移为 $x$ 时

$$
mg-k(l_0+x)=m\ddot{x}
$$

代入 $k=mg/l_0$：

$$
\ddot{x}+\frac{g}{l_0}x=0
$$

故为简谐振动，

$$
\omega=\sqrt{\frac{g}{l_0}}
=\sqrt{\frac{9.8}{1.2\times10^{-2}}}
=28.6\ \mathrm{rad/s}=9.1\pi\ \mathrm{rad/s}
$$

$t=0$ 时 $x=A$、$v=0$，故 $\varphi=0$：

$$
x=2\times10^{-2}\cos(9.1\pi t)\quad \mathrm{(SI)}
$$

</details>

## 四、力学（第二版）（上册）

### 11.

一个机器内某零件的振动规律为

$$
x=0.4\sin\omega t+0.3\cos\omega t
$$

$x$ 的单位为 $\mathrm{cm}$，$\omega=20\ \mathrm{s^{-1}}$。求这个振动的振幅、最大速度及最大加速度。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
A=\sqrt{0.4^2+0.3^2}=0.5\ \mathrm{cm}
$$

$$
v_{\max}=A\omega=0.5\times20=10\ \mathrm{cm/s}
$$

$$
a_{\max}=A\omega^2=0.5\times20^2=200\ \mathrm{cm/s^2}=2.0\ \mathrm{m/s^2}
$$

</details>

### 12.

有两支标有 $256\ \mathrm{Hz}$ 的音叉，一支是标准的，另一支是待校正的。同时敲击两支音叉，在半分钟内能听到 45 拍，若在待校正的音叉上适当涂蜡，从少逐渐增多，在半分钟内听到的拍数先减少到听不见拍声，而后又增多，问待校正音叉原来的频率多大？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
\Delta\nu=\frac{45}{30}=1.5\ \mathrm{Hz}
$$

待校正音叉的频率

$$
\nu_2=256\pm1.5\ \mathrm{Hz}
$$

涂蜡使质量增大、频率降低。拍数先减至零再增大，说明 $\nu_2$ 高于 $256\ \mathrm{Hz}$：

$$
\nu_2=256+1.5=257.5\ \mathrm{Hz}
$$

</details>

