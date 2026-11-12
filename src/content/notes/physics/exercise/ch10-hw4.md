---
title: "第十章 波动 第4次作业 波的能量 波的干涉（10-21 ~ 10-24）"
slug: "physics/exercise/ch10-hw4"
description: "10 21 一列波在介质中传播，其波速 u 1.0 times10^{3} mathrm{m cdot s^{ 1}} ，振幅 A 1.0 times10^{ 4} mathrm{m} ，频率 nu 1.0 times10^{3} mathrm{Hz} 。若介质的密度为 rho …"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第十章 波动 第4次作业 波的能量 & 波的干涉（10-21 ~ 10-24）

## 一. 计算题（共3题，100分）

### 1.
10-21 一列波在介质中传播，其波速 $u=1.0\times10^{3}\ \mathrm{m\cdot s^{-1}}$，振幅 $A=1.0\times10^{-4}\ \mathrm{m}$，频率 $\nu=1.0\times10^{3}\ \mathrm{Hz}$。若介质的密度为 $\rho=8.0\times10^{2}\ \mathrm{kg\cdot m^{-3}}$，求：（1）该波的能流密度；（2）$1\ \mathrm{min}$ 内垂直通过 $4.0\times10^{-4}\ \mathrm{m^{2}}$ 的总能量。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\omega=2\pi\nu=2.0\times10^{3}\pi\ \mathrm{rad\cdot s^{-1}}$

（1）能流密度（波的强度）

$$
I=\frac{1}{2}\rho\omega^{2}A^{2}u
=\frac{1}{2}\times8.0\times10^{2}\times\left(2.0\times10^{3}\pi\right)^{2}\times\left(1.0\times10^{-4}\right)^{2}\times1.0\times10^{3}
$$

$$
I=1.6\times10^{4}\pi^{2}\approx1.6\times10^{5}\ \mathrm{W\cdot m^{-2}}
$$

（2）$W=ISt$

$$
W=1.6\times10^{4}\pi^{2}\times4.0\times10^{-4}\times60=384\pi^{2}\approx3.8\times10^{3}\ \mathrm{J}
$$

</details>

### 2.
10-23 如图所示，两相干波源分别在 $P$、$Q$ 两点，它们发出频率为 $\nu$、波长为 $\lambda$、初相位相同的两列相干波。设 $PQ=3\lambda/2$，$R$ 为 $PQ$ 连线上的一点。求：（1）自 $P$、$Q$ 发出的两列波在 $R$ 处的相位差；（2）两列波在 $R$ 处干涉时的合振幅。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/7d4483b6ee94ff080fb69f3f38e9ccee.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$R$ 在 $Q$ 的外侧，故 $r_P-r_Q=PQ=\dfrac{3}{2}\lambda$，两波源初相相同 $\varphi_P=\varphi_Q$

$$
\Delta\varphi=\varphi_Q-\varphi_P-\frac{2\pi}{\lambda}\left(r_Q-r_P\right)=0+\frac{2\pi}{\lambda}\cdot\frac{3\lambda}{2}=3\pi
$$

（2）相位差为 $\pi$ 的奇数倍，两波在 $R$ 处反相，且两波振幅相等，故完全相消

$$
A_R=\sqrt{A^{2}+A^{2}+2A^{2}\cos3\pi}=0
$$

即 $R$ 处为干涉极小（波节类型），合振幅为零。

</details>

### 3.
10-24 两相干波源位于同一介质中的 $A$、$B$ 两点，如图所示。其振幅相等、频率皆为 $100\ \mathrm{Hz}$，$B$ 比 $A$ 的相位超前 $\pi$。若 $A$、$B$ 相距 $30.0\ \mathrm{m}$，波速为 $400\ \mathrm{m\cdot s^{-1}}$，试求 $AB$ 连线上因干涉而静止的各点的位置。

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/fb7ddf5b2bb2b018bf375afcd66c3275.png)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

波长

$$
\lambda=\frac{u}{\nu}=\frac{400}{100}=4.0\ \mathrm{m}
$$

以 $A$ 为原点、$AB$ 方向为 $x$ 轴正向，则 $A$ 在 $x=0$，$B$ 在 $x=30\ \mathrm{m}$，$\varphi_B-\varphi_A=\pi$。任一点相位差

$$
\Delta\varphi=\left(\varphi_B-\varphi_A\right)-\frac{2\pi}{\lambda}\left(r_B-r_A\right)
$$

静止（干涉相消）条件 $\Delta\varphi=\pm\left(2k+1\right)\pi$。

（1）$0<x<30$：$r_A=x$，$r_B=30-x$

$$
\Delta\varphi=\pi-\frac{\pi}{2}\left(30-2x\right)=\pi x-14\pi
$$

$$
\pi x-14\pi=\left(2k+1\right)\pi\quad\Rightarrow\quad x=\left(2k+15\right)\ \mathrm{m}
$$

要求 $0<x<30$，即

$$
x=1,\ 3,\ 5,\ 7,\ 9,\ 11,\ 13,\ 15,\ 17,\ 19,\ 21,\ 23,\ 25,\ 27,\ 29\ \mathrm{m}
$$

共 15 个静止点。

（2）$x<0$（$A$ 左侧）：$r_B-r_A=30\ \mathrm{m}$，$\Delta\varphi=\pi-15\pi=-14\pi$，为 $\pi$ 的偶数倍，各点都是干涉加强，无静止点。

（3）$x>30$（$B$ 右侧）：$r_A-r_B=30\ \mathrm{m}$，$\Delta\varphi=\pi+15\pi=16\pi$，同样处处加强，无静止点。

故 $AB$ 连线上因干涉而静止的点为 $x=1,3,5,\cdots,29\ \mathrm{m}$（即 $A$、$B$ 之间奇数米处）。

</details>

