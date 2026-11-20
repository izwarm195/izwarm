---
title: "第6次作业 杨氏双缝干涉（11-10 ~ 11-12）"
slug: "physics/exercise/ch11-hw5"
description: "11 10 在双缝干涉实验中，两缝间距为 0.30 mathrm{mm} ，用单色光垂直照射双缝，在离缝 1.20 mathrm{m} 的屏上测得中央明纹一侧第 5 条暗纹与另一侧第 5 条暗纹间的距离为 22.78 mathrm{mm} 。问所用光波长为多少？是什么颜色的光？"
publishDate: "2026-11-12"
createdAt: "2026-11-12T00:00:00Z"
tags: ["physics","exercise"]
series: ["Physics","Exercise","第十一章 光学"]
---

# 第十一章 光学 第6次作业 杨氏双缝干涉（11-10 ~ 11-12）

> 振动复习部分见 [第6次作业 振动复习（9-17 ~ 9-41）](/notes/physics/exercise/ch9-hw5/)

## 一. 计算题（第6次作业 第 5 ~ 7 题；该次共 7 题 100 分）

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


