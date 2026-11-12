---
title: "第十一章 光学 第六周作业 薄膜干涉 单缝衍射（11-14 ~ 11-28）"
slug: "physics/exercise/ch11-hw6"
description: "11 14 如图所示，由点 S 发出的 lambda 600 mathrm{nm} 的单色光，自空气射入折射率 n 1.23 的透明物质，再射入空气。若透明物质的厚度为 d 1.0 mathrm{cm} ，入射角 theta 30^{ circ} ，且 SA BC 5.0 mat…"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第十一章 光学 第六周作业 薄膜干涉 & 单缝衍射（11-14 ~ 11-28）

## 一. 计算题（共7题，110分）

### 1.
11-14 如图所示，由点 $S$ 发出的 $\lambda=600\ \mathrm{nm}$ 的单色光，自空气射入折射率 $n=1.23$ 的透明物质，再射入空气。若透明物质的厚度为 $d=1.0\ \mathrm{cm}$，入射角 $\theta=30^{\circ}$，且 $SA=BC=5.0\ \mathrm{cm}$，问：（1）折射角 $\theta_1$ 为多少？（2）此单色光在这层透明物质里的频率、速度和波长各为多少？（3）$S$ 到 $C$ 的几何路程为多少？光程又为多少？

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/e17d044a57530209b3fa81c5f7fc67c2.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）折射定律 $n_1\sin\theta=n_2\sin\theta_1$

$$
\sin\theta_1=\frac{\sin30^{\circ}}{1.23}=0.4065\quad\Rightarrow\quad \theta_1\approx24.0^{\circ}
$$

（2）频率由光源决定，进介质不变；速度、波长按折射率缩小

$$
\nu=\frac{c}{\lambda_0}=\frac{3.0\times10^{8}}{600\times10^{-9}}=5.0\times10^{14}\ \mathrm{Hz}
$$

$$
v=\frac{c}{n}=2.44\times10^{8}\ \mathrm{m\cdot s^{-1}},\qquad
\lambda'=\frac{\lambda_0}{n}=488\ \mathrm{nm}
$$

（3）介质中光程线段 $AB=\dfrac{d}{\cos\theta_1}=\dfrac{1.0\ \mathrm{cm}}{0.9135}=1.09\ \mathrm{cm}$

$$
s=SA+AB+BC=5.0+1.09+5.0\approx11.1\ \mathrm{cm}=0.111\ \mathrm{m}
$$

$$
L=n_{\text{空气}}\left(SA+BC\right)+n\,AB=10.0+1.23\times1.09\approx11.3\ \mathrm{cm}=0.114\ \mathrm{m}
$$

几何路程只看长度，光程把介质中的路程折算成真空中的等效长度。

</details>

### 2.
11-15 一双缝装置的一个缝被折射率为 $1.40$ 的薄玻璃片所遮盖，另一个缝被折射率为 $1.70$ 的薄玻璃片所遮盖。在玻璃片插入以后，屏上原来的中央极大所在点变为第五级明纹。假定 $\lambda=480\ \mathrm{nm}$，且两玻璃片厚度均为 $d$，求厚度 $d$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

原中央极大处两光束几何路程相等，插入两玻璃片后该点附加光程差

$$
\delta=\left(n_2-n_1\right)d=0.30d
$$

该点现为第 5 级明纹，故 $\delta=5\lambda$

$$
d=\frac{5\lambda}{n_2-n_1}=\frac{5\times480\times10^{-9}}{0.30}=8.0\times10^{-6}\ \mathrm{m}=8.0\ \mu\mathrm{m}
$$

</details>

### 3.
11-19 集成光学中的楔形薄膜耦合器原理如图所示。沉积在玻璃衬底上的是氧化钽（$\mathrm{Ta_2O_5}$）薄膜，其楔形端从 $A$ 到 $B$ 厚度逐渐减小为零。为测定薄膜的厚度，用波长 $\lambda=632.8\ \mathrm{nm}$ 的氦氖激光垂直照射，观察到薄膜楔形端共出现 11 条暗纹，且 $A$ 处对应一条暗纹，试求氧化钽薄膜的厚度（$\mathrm{Ta_2O_5}$ 对 632.8 nm 激光的折射率为 2.21）。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/9db51db4ea445c5c796d3c842167007d.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

上表面（空气 → 薄膜，$n$ 增大）反射有半波损失；下表面（薄膜 → 玻璃，$n$ 减小）无。故反射光光程差

$$
\delta=2ne+\frac{\lambda}{2}
$$

暗纹条件 $\delta=\left(2k+1\right)\dfrac{\lambda}{2}$，即

$$
2ne=k\lambda\quad\left(k=0,1,2,\cdots\right)
$$

$B$ 处 $e=0$ 对应 $k=0$ 的暗纹（半波损失使端点为暗），从 $B$ 到 $A$ 共 11 条暗纹，故 $A$ 处 $k=10$

$$
e_A=\frac{10\lambda}{2n}=\frac{10\times632.8\times10^{-9}}{2\times2.21}\approx1.4\times10^{-6}\ \mathrm{m}=1.4\ \mu\mathrm{m}
$$

</details>

### 4.
11-23 在利用牛顿环测未知单色光波长的实验中，当用波长为 $589.3\ \mathrm{nm}$ 的钠黄光垂直照射时，测得第 1 和第 4 个暗环的距离为 $\Delta r=4.00\times10^{-3}\ \mathrm{m}$；当用波长未知的单色光垂直照射时，测得第 1 和第 4 个暗环的距离为 $\Delta r'=3.85\times10^{-3}\ \mathrm{m}$。求该单色光的波长。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

牛顿环暗环半径 $r_k=\sqrt{k\lambda R}$，故

$$
\Delta r=r_4-r_1=\left(\sqrt{4}-\sqrt{1}\right)\sqrt{\lambda R}=\sqrt{\lambda R}
$$

同一装置 $R$ 相同，两式相除

$$
\frac{\Delta r'}{\Delta r}=\sqrt{\frac{\lambda'}{\lambda}}
$$

$$
\lambda'=\lambda\left(\frac{\Delta r'}{\Delta r}\right)^{2}=589.3\times\left(\frac{3.85}{4.00}\right)^{2}\approx546\ \mathrm{nm}
$$

属绿光。

</details>

### 5.
11-26 某人用迈克耳孙干涉仪测量一光波的波长。在可动反射镜 $M$ 移动 $0.310\ \mathrm{mm}$ 的过程中，观察到干涉条纹移动了 1100 条，求该光波的波长。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

动镜移动 $d$ 使光程差改变 $2d$（往返），条纹移过 $N$ 条对应 $N\lambda$

$$
N\lambda=2d\quad\Rightarrow\quad
\lambda=\frac{2d}{N}=\frac{2\times0.310\times10^{-3}}{1100}\approx5.6\times10^{-7}\ \mathrm{m}=564\ \mathrm{nm}
$$

</details>

### 6.
11-27 如图所示，狭缝宽度 $b=0.60\ \mathrm{mm}$，透镜焦距 $f=0.40\ \mathrm{m}$，一个与狭缝平行的屏放置在透镜焦平面处。若以单色平行光垂直照射狭缝，则在屏上离点 $O$ 为 $x=1.4\ \mathrm{mm}$ 处的点 $P$ 看到的是衍射明条纹。试求：（1）该入射光的波长；（2）点 $P$ 条纹的级数；（3）从点 $P$ 处来看，对该光波而言，狭缝处的波阵面可分成的半波带数目。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/003f24362687b9949f3e678c8ca01a20.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

屏在焦平面，$\sin\theta\approx\tan\theta=\dfrac{x}{f}=\dfrac{1.4\times10^{-3}}{0.40}=3.5\times10^{-3}$

$$
b\sin\theta=0.60\times10^{-3}\times3.5\times10^{-3}=2.1\times10^{-6}\ \mathrm{m}
$$

（1）（2）明纹条件 $b\sin\theta=\left(2k+1\right)\dfrac{\lambda}{2}$

$$
\lambda=\frac{2b\sin\theta}{2k+1}=\frac{4.2\times10^{-6}}{2k+1}\ \mathrm{m}
$$

取可见光范围 400 ~ 760 nm：

$$
k=3:\ \lambda=600\ \mathrm{nm};\qquad k=4:\ \lambda=467\ \mathrm{nm}
$$

（$k=2$ 得 840 nm，已出可见光区。）故 $P$ 点可能是 $\lambda_1=600\ \mathrm{nm}$ 的第 3 级明纹，也可能是 $\lambda_2=467\ \mathrm{nm}$ 的第 4 级明纹。

（3）半波带数

$$
N=\frac{b\sin\theta}{\lambda/2}=2k+1
$$

$\lambda_1=600\ \mathrm{nm}$：$k=3$，$N=7$；$\lambda_2=467\ \mathrm{nm}$：$k=4$，$N=9$。

</details>

### 7.
11-28 单缝的宽度 $b=0.40\ \mathrm{mm}$，以波长 $\lambda=589\ \mathrm{nm}$ 的单色光垂直照射，设透镜的焦距 $f=1.0\ \mathrm{m}$。（1）求第一级暗纹距中心的距离；（2）求第二级明纹距中心的距离；（3）如单色光以入射角 $i=30^{\circ}$ 斜射到单缝上，则上述结果有何变动？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）暗纹 $b\sin\theta=k\lambda$，取 $k=1$，$\sin\theta\approx x/f$

$$
x_1=\frac{f\lambda}{b}=\frac{1.0\times589\times10^{-9}}{0.40\times10^{-3}}\approx1.47\times10^{-3}\ \mathrm{m}=1.47\ \mathrm{mm}
$$

（2）第二级明纹 $b\sin\theta=\left(2k+1\right)\dfrac{\lambda}{2}=\dfrac{5}{2}\lambda$

$$
x_2=\frac{5f\lambda}{2b}=\frac{5\times589\times10^{-9}}{2\times0.40\times10^{-3}}\approx3.68\times10^{-3}\ \mathrm{m}=3.68\ \mathrm{mm}
$$

（3）斜入射时最大光程差多一项 $\pm b\sin i$，暗纹条件变为

$$
b\left(\sin\theta-\sin i\right)=k\lambda
$$

零级（中央明纹）移到 $\theta=i$ 的方向

$$
x_0=f\tan i=1.0\times\tan30^{\circ}\approx0.58\ \mathrm{m}
$$

即整个图样平移到 $x\approx0.58\ \mathrm{m}$ 附近；又因 $\Delta x=f\tan\theta$ 中 $\tan$ 的斜率随 $\theta$ 增大，条纹间距被放大为原来的 $\dfrac{1}{\cos^{2}i}\approx1.3$ 倍，第一级暗纹、第二级明纹相对零级的距离由 $1.47\ \mathrm{mm}$、$3.68\ \mathrm{mm}$ 变为约 $2.0\ \mathrm{mm}$、$4.9\ \mathrm{mm}$。

</details>

