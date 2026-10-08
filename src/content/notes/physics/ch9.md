---
title: "第九章 振动 公式总结"
slug: "physics/ch9"
description: "k 为弹簧的弹性系数，负号表示力始终指向平衡位置。"
publishDate: "2026-09-23"
createdAt: "2026-09-23T00:00:00Z"
updatedDate: "2026-09-23T18:53:44"
tags: ["physics","physics-formula"]
series: ["Physics"]
---

# 第九章 振动 公式总结

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 依据：马文蔚《物理学》（第七版·下册）第九章 振动，原文 `D:\搞学术\大二暑\SEU\Physics\物理学(第七版)下册.md` 第 478–2104 行
> - 收录：**只保留结论性公式**（定义式、定律式、定理式与常用结论）；省略推导与中间式，文字说明不超过一行
> - 覆盖：简谐振动 · 旋转矢量 · 单摆复摆 · 振动能量 · 振动合成 · 阻尼与受迫振动 · 电磁振荡

> <img class="callout-badge" src="/media/icons/document.svg" alt="abstract">**本节包含**
> - 9-1 简谐振动 振幅 周期和频率 相位
> - 9-2 旋转矢量
> - 9-3 单摆和复摆
> - 9-4 简谐振动的能量
> - 9-5 简谐振动的合成
> - 9-6 阻尼振动 受迫振动 共振
> - 9-7 电磁振荡
> - 9-8 简述非线性系统

## 9-1 简谐振动 振幅 周期和频率 相位

### 一、简谐振动的动力学特征与运动学方程

$$
F=-kx
$$
- $k$ 为弹簧的弹性系数，负号表示力始终指向平衡位置。

  $$
  a=-\omega^{2}x
  \tag{9-3}
  $$
- 简谐振动的判据式。

  $$
  \frac{\mathrm{d}^{2}x}{\mathrm{d}t^{2}}=-\omega^{2}x
  \tag{9-4}
  $$
- 简谐振动的运动微分方程。

  $$
  x=A\cos\left(\omega t+\varphi\right)
  \tag{9-5}
  $$
- $A$ 为振幅，$\varphi$ 为初相，二者均由初始条件决定。

  $$
  v=\frac{\mathrm{d}x}{\mathrm{d}t}=-\omega A\sin\left(\omega t+\varphi\right)
  \tag{9-6}
  $$

  $$
  a=\frac{\mathrm{d}^{2}x}{\mathrm{d}t^{2}}=-\omega^{2}A\cos\left(\omega t+\varphi\right)
  \tag{9-7}
  $$

### 二、周期和频率

$$
T=\frac{2\pi}{\omega}
\tag{9-8}
$$

$$
T=2\pi\sqrt{\frac{m}{k}}
\tag{9-9}
$$
- 弹簧振子的固有周期，只由系统本身的 $m$、$k$ 决定。

  $$
  \nu=\frac{1}{T}=\frac{\omega}{2\pi}
  \tag{9-10}
  $$

  $$
  \omega=2\pi\nu
  \tag{9-11}
  $$

### 三、常量 $A$ 和 $\varphi$ 的确定

$$
A=\sqrt{x_{0}^{2}+\frac{v_{0}^{2}}{\omega^{2}}}
\tag{9-13}
$$
- $x_{0}$、$v_{0}$ 为 $t=0$ 时的位移和速度。

  $$
  \tan\varphi=\frac{-v_{0}}{\omega x_{0}}
  \tag{9-14}
  $$
- $\varphi$ 所在象限由 $x_{0}$、$v_{0}$ 的正负号确定。

## 9-2 旋转矢量

### 一、两个同频率简谐振动的相位差

$$
\Delta\varphi=(\omega t+\varphi_{2})-(\omega t+\varphi_{1})=\varphi_{2}-\varphi_{1}
\tag{9-15}
$$
- $\Delta\varphi$ 为相位差；同频简谐振动在任意时刻的相位差等于初相差。

## 9-3 单摆和复摆

### 一、单摆

$$
\frac{\mathrm{d}^{2}\theta}{\mathrm{d}t^{2}}=-\frac{g}{l}\theta
\tag{9-16}
$$
- 适用条件：小角度摆动（$\theta<5^{\circ}$）。

  $$
  \omega=\sqrt{\frac{g}{l}},\qquad T=2\pi\sqrt{\frac{l}{g}}
  \tag{9-17}
  $$
- 周期只取决于摆长 $l$ 与当地重力加速度 $g$，与摆锤质量无关。

### 二、复摆

$$
\frac{\mathrm{d}^{2}\theta}{\mathrm{d}t^{2}}=-\frac{mgl}{J}\theta
\tag{9-18}
$$
- $m$ 为摆的质量，$J$ 为对轴 $O$ 的转动惯量，$l$ 为质心到轴 $O$ 的距离。

  $$
  \omega=\sqrt{\frac{mgl}{J}},\qquad T=2\pi\sqrt{\frac{J}{mgl}}
  \tag{9-19}
  $$

- 三种小角度振动系统的对比：

  | 振动系统 | 角频率 $\omega$ | 周期 $T$ |
  | --- | --- | --- |
  | 弹簧振子 | $\sqrt{k/m}$ | $2\pi\sqrt{m/k}$ |
  | 单摆 | $\sqrt{g/l}$ | $2\pi\sqrt{l/g}$ |
  | 复摆 | $\sqrt{mgl/J}$ | $2\pi\sqrt{J/(mgl)}$ |

## 9-4 简谐振动的能量

### 一、动能、势能与总能量

$$
E_{k}=\frac{1}{2}mv^{2}=\frac{1}{2}m\omega^{2}A^{2}\sin^{2}(\omega t+\varphi)
\tag{9-20}
$$

$$
E_{p}=\frac{1}{2}kx^{2}=\frac{1}{2}kA^{2}\cos^{2}(\omega t+\varphi)
\tag{9-21}
$$

$$
E=E_{k}+E_{p}=\frac{1}{2}m\omega^{2}A^{2}=\frac{1}{2}kA^{2}
\tag{9-22}
$$
- 适用条件：振动过程中只有系统的保守内力做功，总能量守恒。

  $$
  \overline{E_{k}}=\overline{E_{p}}=\frac{1}{2}E
  $$
- 动能与势能在一个周期内的平均值相等。

## 9-5 简谐振动的合成

### 一、两个同方向同频率简谐振动的合成

$$
x=x_{1}+x_{2}=A\cos\left(\omega t+\varphi\right)
$$
- 合振动仍是简谐振动，角频率与分振动相同。

  $$
  A=\sqrt{A_{1}^{2}+A_{2}^{2}+2A_{1}A_{2}\cos\left(\varphi_{2}-\varphi_{1}\right)}
  \tag{9-23}
  $$
- $A_{1}$、$A_{2}$ 为分振幅，$\varphi_{2}-\varphi_{1}$ 为相位差。

  $$
  \tan\varphi=\frac{A_{1}\sin\varphi_{1}+A_{2}\sin\varphi_{2}}{A_{1}\cos\varphi_{1}+A_{2}\cos\varphi_{2}}
  \tag{9-24}
  $$
- 合振动的初相。

  $$
  A=\sqrt{A_{1}^{2}+A_{2}^{2}+2A_{1}A_{2}}=A_{1}+A_{2}
  \tag{9-25}
  $$
- 适用条件：$\varphi_{2}-\varphi_{1}=2k\pi$（$k=0,\pm1,\pm2,\cdots$），合振幅最大。

  $$
  A=\sqrt{A_{1}^{2}+A_{2}^{2}-2A_{1}A_{2}}=\left|A_{1}-A_{2}\right|
  \tag{9-26}
  $$
- 适用条件：$\varphi_{2}-\varphi_{1}=(2k+1)\pi$（$k=0,\pm1,\pm2,\cdots$），合振幅最小。

### 二、两个相互垂直同频率简谐振动的合成

$$
\frac{x^{2}}{A_{1}^{2}}+\frac{y^{2}}{A_{2}^{2}}-\frac{2xy}{A_{1}A_{2}}\cos(\varphi_{2}-\varphi_{1})=\sin^{2}(\varphi_{2}-\varphi_{1})
\tag{9-27}
$$
- 合振动的轨迹方程，一般为椭圆，形状由振幅与相位差决定。

  $$
  y=\frac{A_{2}}{A_{1}}x
  $$
- 适用条件：$\Delta\varphi=\varphi_{2}-\varphi_{1}=0$。

  $$
  \frac{x^{2}}{A_{1}^{2}}+\frac{y^{2}}{A_{2}^{2}}=1
  $$
- 适用条件：$\Delta\varphi=\varphi_{2}-\varphi_{1}=\pi/2$；$A_{1}=A_{2}$ 时为圆。

### 三、多个同方向同频率简谐振动的合成

$$
A=A_{0}\frac{\sin\left(\dfrac{N\Delta\varphi}{2}\right)}{\sin\left(\dfrac{\Delta\varphi}{2}\right)}
\tag{9-28}
$$
- $N$ 个等幅分振动依次相位差恒为 $\Delta\varphi$ 时的合振幅。

  $$
  \varphi=\frac{N-1}{2}\Delta\varphi
  $$
- 合振动的初相（第一个振动初相为零）。

### 四、两个同方向不同频率简谐振动的合成 拍

$$
x=\left(2A_{1}\cos 2\pi\frac{\nu_{2}-\nu_{1}}{2}t\right)\cos 2\pi\frac{\nu_{2}+\nu_{1}}{2}t
\tag{9-29}
$$
- 适用条件：$A_{1}=A_{2}$、初相均为零，且 $|\nu_{2}-\nu_{1}|\ll(\nu_{2}+\nu_{1})$。

  $$
  \nu=\nu_{2}-\nu_{1}
  \tag{9-30}
  $$
- 拍频等于两分振动的频率之差。

## 9-6 阻尼振动 受迫振动 共振

### 一、阻尼振动

$$
F_{r}=-Cv
$$
- $C$ 为阻力系数；适用条件为阻力与速度成正比。

  $$
  \frac{\mathrm{d}^{2}x}{\mathrm{d}t^{2}}+2\delta\frac{\mathrm{d}x}{\mathrm{d}t}+\omega_{0}^{2}x=0
  \tag{9-31}
  $$
- $\omega_{0}=\sqrt{k/m}$ 为固有角频率，$\delta=C/(2m)$ 为阻尼系数。

  $$
  x=A\mathrm{e}^{-\delta t}\cos\left(\omega t+\varphi\right)
  \tag{9-32}
  $$
- 适用条件：欠阻尼 $\delta^{2}<\omega_{0}^{2}$；$A$、$\varphi$ 由初始条件决定。

  $$
  \omega=\sqrt{\omega_{0}^{2}-\delta^{2}},\qquad T=\frac{2\pi}{\omega}=\frac{2\pi}{\sqrt{\omega_{0}^{2}-\delta^{2}}}
  $$
- 有阻尼时的角频率与周期。

### 二、受迫振动

$$
\frac{\mathrm{d}^{2}x}{\mathrm{d}t^{2}}+2\delta\frac{\mathrm{d}x}{\mathrm{d}t}+\omega_{0}^{2}x=f\cos\omega_{p}t
\tag{9-33}
$$
- $\omega_{0}^{2}=k/m$，$2\delta=C/m$，$f=F/m$（$F$ 为力幅），$\omega_{p}$ 为驱动力的角频率。

  $$
  x=A\cos\left(\omega_{p}t+\psi\right)
  \tag{9-35}
  $$
- 适用条件：驱动力作用较长时间后的稳定状态，振动周期等于驱动力的周期。

  $$
  A=\frac{f}{\sqrt{\left(\omega_{0}^{2}-\omega_{p}^{2}\right)^{2}+4\delta^{2}\omega_{p}^{2}}}
  \tag{9-36}
  $$
- 稳定状态下的振幅。

  $$
  \tan\psi=\frac{-2\delta\omega_{p}}{\omega_{0}^{2}-\omega_{p}^{2}}
  \tag{9-37}
  $$
- 稳定状态下的初相 $\psi$。

### 三、共振

$$
\omega_{r}=\sqrt{\omega_{0}^{2}-2\delta^{2}}
\tag{9-38}
$$
- 共振角频率，由 $\omega_{0}$ 与 $\delta$ 共同决定。

  $$
  A_{r}=\frac{f}{2\delta\sqrt{\omega_{0}^{2}-\delta^{2}}}
  \tag{9-39}
  $$
- 共振时的振幅。

## 9-7 电磁振荡

### 一、无阻尼电磁振荡的方程

$$
\frac{\mathrm{d}^{2}q}{\mathrm{d}t^{2}}=-\frac{1}{LC}q
\tag{9-40}
$$
- 无阻尼 LC 电路中电荷的振荡方程，式中 $\omega^{2}=1/(LC)$。

  $$
  q=Q_{0}\cos\left(\omega t+\varphi\right)
  \tag{9-41}
  $$
- $Q_{0}$ 为电荷振幅，$\varphi$ 为初相，由初始条件决定。

  $$
  \nu=\frac{\omega}{2\pi}=\frac{1}{2\pi\sqrt{LC}},\qquad T=2\pi\sqrt{LC}
  \tag{9-42}
  $$
- 只由振荡电路本身的 $L$、$C$ 决定。

  $$
  i=-I_{0}\sin\left(\omega t+\varphi\right)=I_{0}\cos\left(\omega t+\varphi+\frac{\pi}{2}\right)
  \tag{9-43}
  $$
- $I_{0}=\omega Q_{0}$ 为电流振幅。

### 二、无阻尼电磁振荡的能量

$$
W_{e}=\frac{q^{2}}{2C}=\frac{Q_{0}^{2}}{2C}\cos^{2}(\omega t+\varphi)
\tag{9-44}
$$

$$
W_{m}=\frac{1}{2}Li^{2}=\frac{1}{2}LI_{0}^{2}\sin^{2}(\omega t+\varphi)=\frac{Q_{0}^{2}}{2C}\sin^{2}(\omega t+\varphi)
\tag{9-45}
$$

$$
W=W_{e}+W_{m}=\frac{1}{2}LI_{0}^{2}=\frac{Q_{0}^{2}}{2C}
\tag{9-46}
$$
- 适用条件：电路电阻为零、无电动势、电磁能不以电磁波形式辐射。

## 9-8 简述非线性系统

### 一、线性系统与叠加原理

$$
\frac{\mathrm{d}^{2}\theta}{\mathrm{d}t^{2}}+\omega_{0}^{2}\theta=0,\qquad \theta=\theta_{1}+\theta_{2}
$$
- 线性叠加原理：两解之和仍是方程的解。

### 二、非线性系统的例子：大角度摆

$$
\frac{\mathrm{d}^{2}\theta}{\mathrm{d}t^{2}}+\omega_{0}^{2}\sin\theta=0
\tag{9-49}
$$
- 适用条件：摆角较大，$\sin\theta$ 不能用 $\theta$ 近似。

  $$
  \theta=A\cos\omega t+\frac{A^{3}}{192}\cos 3\omega t,\qquad \omega=\omega_{0}\left(1-\frac{A^{2}}{16}\right)
  \tag{9-51}
  $$
- 一次迭代近似解。

### 三、受迫阻尼摆与混沌

$$
\frac{\mathrm{d}^{2}\theta}{\mathrm{d}t^{2}}+2\delta\frac{\mathrm{d}\theta}{\mathrm{d}t}+\omega_{0}^{2}\left[1+A\sin\left(\Omega t\right)\right]\sin\theta=0
\tag{9-52}
$$
- $\delta$ 为阻尼系数，$A$ 为驱动力的力幅，$\Omega$ 为驱动力的角频率。

  ---

  [总目录](/notes/physics/formulas-vol2/) · [第十章 波动 →](/notes/physics/ch10/)

