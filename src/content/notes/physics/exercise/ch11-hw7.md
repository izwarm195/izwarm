---
title: "第十一章 光学 第七周作业 圆孔衍射 光栅衍射（11-30 ~ 11-35）"
slug: "physics/exercise/ch11-hw7"
description: "11 30 已知单缝宽度 b 1.0 times10^{ 4} mathrm{m} ，透镜焦距 f 0.50 mathrm{m} ，用 lambda_1 400 mathrm{nm} 和 lambda_2 760 mathrm{nm} 的单色平行光分别垂直照射，求这两种光的第一级…"
publishDate: "2026-11-11"
createdAt: "2026-11-11T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise"]
---

# 第十一章 光学 第七周作业 圆孔衍射 & 光栅衍射（11-30 ~ 11-35）

## 一. 计算题（共5题，100分）

### 1.
11-30 已知单缝宽度 $b=1.0\times10^{-4}\ \mathrm{m}$，透镜焦距 $f=0.50\ \mathrm{m}$，用 $\lambda_1=400\ \mathrm{nm}$ 和 $\lambda_2=760\ \mathrm{nm}$ 的单色平行光分别垂直照射，求这两种光的第一级明纹离屏中心的距离，以及这两条明纹之间的距离。若用每厘米刻有 1000 条刻线的光栅代替这个单缝，则这两种单色光的第一级明纹分别距屏中心多远？这两条明纹之间的距离又是多少？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

单缝明纹 $b\sin\theta=\left(2k+1\right)\dfrac{\lambda}{2}$，一级取 $k=1$，$\sin\theta\approx\tan\theta=x/f$，故 $x=f\sin\theta=\dfrac{3f\lambda}{2b}$

$$
x_1=\frac{3\times0.50\times400\times10^{-9}}{2\times1.0\times10^{-4}}=3.0\times10^{-3}\ \mathrm{m}
$$

$$
x_2=\frac{3\times0.50\times760\times10^{-9}}{2\times1.0\times10^{-4}}=5.7\times10^{-3}\ \mathrm{m}
$$

$$
\Delta x=x_2-x_1\approx2.7\times10^{-3}\ \mathrm{m}=2.7\ \mathrm{mm}
$$

换光栅：$d=\dfrac{10^{-2}}{1000}=1.0\times10^{-5}\ \mathrm{m}$，主极大 $d\sin\theta=k\lambda$，$k=1$

$$
x_1=\frac{f\lambda_1}{d}=\frac{0.50\times400\times10^{-9}}{1.0\times10^{-5}}=2.0\times10^{-2}\ \mathrm{m}=2.0\ \mathrm{cm}
$$

$$
x_2=\frac{f\lambda_2}{d}=\frac{0.50\times760\times10^{-9}}{1.0\times10^{-5}}=3.8\times10^{-2}\ \mathrm{m}=3.8\ \mathrm{cm}
$$

$$
\Delta x=x_2-x_1\approx1.8\ \mathrm{cm}
$$

</details>

### 2.
11-32 老鹰眼睛的瞳孔直径约为 $6\ \mathrm{mm}$，问其最高飞翔多高时可看清地面上身长为 $5\ \mathrm{cm}$ 的小鼠？设光在空气中的波长为 $600\ \mathrm{nm}$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

圆孔衍射的瑞利判据

$$
\theta_R=1.22\frac{\lambda}{D}
$$

取鼠身长为最小可分辨线度 $\Delta x=5\ \mathrm{cm}$，则

$$
\Delta x=L\theta_R=L\frac{1.22\lambda}{D}
$$

$$
L=\frac{D\,\Delta x}{1.22\lambda}=\frac{6\times10^{-3}\times5\times10^{-2}}{1.22\times600\times10^{-9}}\approx4.1\times10^{2}\ \mathrm{m}
$$

</details>

### 3.
11-33 一束平行光垂直入射到某个光栅上，该光束有两种波长的光，$\lambda_1=440\ \mathrm{nm}$ 和 $\lambda_2=660\ \mathrm{nm}$。实验发现，两种波长的谱线（不计中央明纹）第二次重合于衍射角 $\varphi=60^{\circ}$ 的方向上，求此光栅的光栅常量。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

重合条件 $k_1\lambda_1=k_2\lambda_2$

$$
\frac{k_1}{k_2}=\frac{\lambda_2}{\lambda_1}=\frac{3}{2}
$$

第一次重合 $\left(k_1,k_2\right)=\left(3,2\right)$，第二次重合 $\left(k_1,k_2\right)=\left(6,4\right)$

$$
d=\frac{k_1\lambda_1}{\sin60^{\circ}}=\frac{6\times440\times10^{-9}}{0.866}\approx3.0\times10^{-6}\ \mathrm{m}
$$

校核：$4\times660\times10^{-9}=6\times440\times10^{-9}=2.64\times10^{-6}\ \mathrm{m}$，一致。

</details>

### 4.
11-34 用一毫米内有 500 条刻痕的平面透射光栅观察钠光谱（$\lambda=589\ \mathrm{nm}$），设透镜焦距 $f=1.00\ \mathrm{m}$。问：（1）光线垂直入射时，最多能看到第几级光谱？（2）光线以入射角 $30^{\circ}$ 入射时，最多能看到第几级光谱？（3）若用白光垂直照射光栅，第一级光谱的线宽度是多少？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$$
d=\frac{1\ \mathrm{mm}}{500}=2.0\times10^{-6}\ \mathrm{m}
$$

（1）垂直入射 $d\sin\theta=k\lambda$，取 $\theta=90^{\circ}$

$$
k_{\max}=\frac{d}{\lambda}=\frac{2.0\times10^{-6}}{589\times10^{-9}}\approx3.4\quad\Rightarrow\quad \text{最多第 }3\text{ 级}
$$

（2）斜入射 $d\left(\sin\theta+\sin i\right)=k\lambda$，仍取 $\theta=90^{\circ}$

$$
k_{\max}=\frac{d\left(1+\sin30^{\circ}\right)}{\lambda}=\frac{2.0\times10^{-6}\times1.5}{589\times10^{-9}}\approx5.1\quad\Rightarrow\quad \text{最多第 }5\text{ 级}
$$

（3）白光 $400\sim760\ \mathrm{nm}$，一级光谱两端

$$
\sin\theta_{\text{红}}=\frac{760\times10^{-9}}{2.0\times10^{-6}}=0.38,\qquad
\sin\theta_{\text{紫}}=\frac{400\times10^{-9}}{2.0\times10^{-6}}=0.20
$$

$$
\Delta x=f\left(\tan\theta_{\text{红}}-\tan\theta_{\text{紫}}\right)=1.00\times\left(0.411-0.204\right)\approx0.21\ \mathrm{m}
$$

（若用 $\sin\theta\approx\tan\theta$ 近似则为 $0.18\ \mathrm{m}$。）

</details>

### 5.
11-35 波长为 $600\ \mathrm{nm}$ 的单色光垂直入射到一光栅上，第二级主极大出现在 $\sin\varphi=0.20$ 处，第四级缺级。试问：（1）光栅上相邻两缝的间距是多少？（2）光栅上狭缝的宽度有多大？（3）在 $-90^{\circ}<\varphi<90^{\circ}$ 范围内，实际呈现的全部级数是多少？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

（1）$d\sin\varphi=k\lambda$，$k=2$

$$
d=\frac{2\lambda}{\sin\varphi}=\frac{2\times600\times10^{-9}}{0.20}=6.0\times10^{-6}\ \mathrm{m}
$$

（2）缺级条件 $\dfrac{d}{b}=k$，第 4 级首次缺级，故 $\dfrac{d}{b}=4$

$$
b=\frac{d}{4}=1.5\times10^{-6}\ \mathrm{m}
$$

（3）主极大最高级次

$$
k_{\max}=\frac{d}{\lambda}=\frac{6.0\times10^{-6}}{600\times10^{-9}}=10
$$

$k=10$ 时 $\sin\varphi=1$ 即 $\varphi=90^{\circ}$，不在 $-90^{\circ}<\varphi<90^{\circ}$ 内，故 $k$ 只取 $0,\pm1,\cdots,\pm9$；再除去缺级 $k=\pm4,\pm8$

$$
k=0,\ \pm1,\ \pm2,\ \pm3,\ \pm5,\ \pm6,\ \pm7,\ \pm9\quad\left(\text{共 }15\text{ 条谱线}\right)
$$

</details>

