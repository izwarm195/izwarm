---
title: "单元测验 振动部分"
slug: "physics/exercise/quiz-osc-wave"
description: "(A) 3E/4, pi (B) E/4, pi/2 (C) E/4, pi (D) 3E/4, pi/2"
publishDate: "2026-11-12"
createdAt: "2026-11-12T00:00:00Z"
updatedDate: "2026-10-22T17:46:52"
tags: ["physics","exercise"]
series: ["Physics","Exercise","第九章 振动"]
---

# 单元测验 振动与波动 · 振动部分

> 波动部分见 [单元测验 波动部分](/notes/physics/exercise/quiz-wave/)

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**首轮错题**
> 第 **1** 题（首轮选 D）。最终提交 23/25，只错第 **1** 题。

## 一. 选择题（原第 1、5、7、8、10、12 题；全卷共 12 题 25 分）

### 1. 弹簧振子振幅 $A$、总能量 $E$。位移 $x=A/2$ 时，动能为 ___，动能与势能的相位差为 ___

(A) $3E/4,\ \pi$　(B) $E/4,\ \pi/2$　(C) $E/4,\ \pi$　(D) $3E/4,\ \pi/2$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
E_p=\frac12kx^2=\frac12k\left(\frac A2\right)^2=\frac E4,\qquad
E_k=E-E_p=\frac{3E}{4}
$$

$$
E_k\propto\sin^2\omega t,\qquad E_p\propto\cos^2\omega t
\ \Rightarrow\ \Delta\varphi=\pi
$$

选 (A)。（二者都以 $2\omega$ 振荡，不是 $T/4$ 对应的 $\pi/2$）

</details>

### 5. 振子到达正最大位移处时，一泥块自正上方落下并粘在振子上，之后仍作简谐振动。则系统

(A) 总能量不变，周期变大　(B) 总能量变大，周期变大

(C) 总能量不变，周期变小　(D) 总能量变小，周期变小

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/db1262846ca8870a952f7f8d0fb34dbd.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
v=0\ \Rightarrow\ A\ \text{不变},\qquad E=\frac12kA^2\ \text{不变}
$$

$$
T=2\pi\sqrt{\frac{m}{k}},\qquad m\uparrow\ \Rightarrow\ T\uparrow
$$

选 (A)。

</details>

### 7. 图为某简谐振动的 $x$–$t$ 曲线。以余弦函数表示，其初相与角频率为

(A) $\dfrac{\pi}{3},\ \dfrac{4\pi}{3}$　(B) $\dfrac{5\pi}{3},\ \dfrac{2\pi}{3}$　(C) $\dfrac{\pi}{3},\ \dfrac{2\pi}{3}$　(D) $\dfrac{5\pi}{3},\ \dfrac{4\pi}{3}$

![](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/2bfc6e33345e719dba40a948d22229b2.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
t=0:\ x=1,\ v>0\ \Rightarrow\ \varphi=\frac{5\pi}{3}
$$

$$
t=1:\ x=-2\ \Rightarrow\ \omega+\frac{5\pi}{3}=\pi+2\pi
\ \Rightarrow\ \omega=\frac{4\pi}{3}
$$

选 (D)。

</details>

### 8. 质点同时参与 $x_1=0.1\cos\left(t+\frac{3\pi}{4}\right)$、$x_2=0.1\cos\left(t-\frac{\pi}{2}\right)$。合振动 $x=A\cos(t+\varphi_0)$，则 $\varphi_0$ 为

(A) $9\pi/8$　(B) $5\pi/8$　(C) $\pi/8$　(D) $3\pi/8$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x_1+x_2=0.2\cos\frac{5\pi}{8}\cos\left(t+\frac{\pi}{8}\right),\qquad
\cos\frac{5\pi}{8}<0
$$

$$
\Rightarrow\ \varphi_0=\frac{\pi}{8}+\pi=\frac{9\pi}{8}
$$

选 (A)。

</details>

### 10. 质量 $m$ 的物块用劲度系数 $k$ 的弹簧竖直悬挂，自弹簧原长处给以向下速度 $v$，其振幅为

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
x_0=\frac{mg}{k},\qquad
A=\sqrt{x_0^2+\left(\frac{v}{\omega}\right)^2}
=\sqrt{\frac{m^2g^2}{k^2}+\frac{mv^2}{k}}
$$

选 (A)。

</details>

### 12. $330\ \mathrm{Hz}$ 标准音叉与待测音叉同时敲响，拍频 $3\ \mathrm{Hz}$；在待测音叉上加一小块物体后拍频减小。待测音叉原频率为

(A) $324\ \mathrm{Hz}$　(B) $336\ \mathrm{Hz}$　(C) $327\ \mathrm{Hz}$　(D) $333\ \mathrm{Hz}$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
f=330\pm3,\qquad \text{加质量}\Rightarrow f\downarrow
$$

只有 $f=333$ 时减小才靠近 $330$，拍频减小。

选 (D)。

</details>

## 二. 答案速查

| 1 | 5 | 7 | 8 | 10 | 12 |
|---|---|---|---|---|---|
| A | A | D | A | A | D |

