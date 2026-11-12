---
title: "第一章 复数与复变函数 核心题型"
slug: "complex/复变函数核心题型汇总/ch1"
description: "题 1 z_1 3+4 mathrm{i}, z_2 1 2 mathrm{i} ，求 dfrac{z_1}{z_2} 、 overline{ left( dfrac{z_1}{z_2} right)} ，并验证 overline{ left( dfrac{z_1}{z_2} r…"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第一章 复数与复变函数 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 1.1 – 例 1.11；答案只留关键式，不复述文字

## 题型 1 ｜复数的商与共轭运算（例 1.1）

**题 1** $z_1=3+4\mathrm{i},\ z_2=1-2\mathrm{i}$，求 $\dfrac{z_1}{z_2}$、$\overline{\left(\dfrac{z_1}{z_2}\right)}$，并验证 $\overline{\left(\dfrac{z_1}{z_2}\right)}=\dfrac{\bar z_1}{\bar z_2}$。

> $\dfrac{z_1}{z_2}=\dfrac{(3+4\mathrm{i})(1+2\mathrm{i})}{5}=\dfrac{-5+10\mathrm{i}}{5}=-1+2\mathrm{i}$，故 $\overline{\left(\dfrac{z_1}{z_2}\right)}=-1-2\mathrm{i}$
> $\dfrac{\bar z_1}{\bar z_2}=\dfrac{(3-4\mathrm{i})(1-2\mathrm{i})}{5}=\dfrac{-5-10\mathrm{i}}{5}=-1-2\mathrm{i}$ ✓

**题 2** $z_1=4+\mathrm{i},\ z_2=2-3\mathrm{i}$，同上。

> $\dfrac{z_1}{z_2}=\dfrac{(4+\mathrm{i})(2+3\mathrm{i})}{13}=\dfrac{5+14\mathrm{i}}{13}$，$\overline{\left(\dfrac{z_1}{z_2}\right)}=\dfrac{5-14\mathrm{i}}{13}$
> $\dfrac{\bar z_1}{\bar z_2}=\dfrac{(4-\mathrm{i})(2-3\mathrm{i})}{13}=\dfrac{5-14\mathrm{i}}{13}$ ✓

## 题型 2 ｜共轭恒等式与模不等式（例 1.2、例 1.4）

**题 1** 证明 $\left|z_1+z_2\right|^2+\left|z_1-z_2\right|^2=2\left(\left|z_1\right|^2+\left|z_2\right|^2\right)$。

> $\left|z_1\pm z_2\right|^2=\left|z_1\right|^2+\left|z_2\right|^2\pm 2\operatorname{Re}\left(z_1\bar z_2\right)$
> 两式相加：$2\left(\left|z_1\right|^2+\left|z_2\right|^2\right)$

**题 2** 证明 $\left|z_1-z_2\right|\geqslant\left|\left|z_1\right|-\left|z_2\right|\right|$。

> $\left|z_1\right|=\left|\left(z_1-z_2\right)+z_2\right|\leqslant\left|z_1-z_2\right|+\left|z_2\right|\Rightarrow\left|z_1\right|-\left|z_2\right|\leqslant\left|z_1-z_2\right|$
> 交换 $z_1,z_2$ 得反向不等式，合并即证

## 题型 3 ｜三角表示式与指数表示式（例 1.3）

**题 1** 化 $z=-1+\sqrt3\,\mathrm{i}$ 为三角式与指数式。

> $r=2,\ \theta=\pi-\dfrac{\pi}{3}=\dfrac{2\pi}{3}$
> $z=2\left(\cos\dfrac{2\pi}{3}+\mathrm{i}\sin\dfrac{2\pi}{3}\right)=2\mathrm{e}^{\frac{2\pi}{3}\mathrm{i}}$

**题 2** 化 $z=1+\cos\theta+\mathrm{i}\sin\theta\ (0<\theta<\pi)$ 为三角式与指数式。

> $1+\cos\theta=2\cos^2\dfrac{\theta}{2},\ \sin\theta=2\sin\dfrac{\theta}{2}\cos\dfrac{\theta}{2}$
> $z=2\cos\dfrac{\theta}{2}\left(\cos\dfrac{\theta}{2}+\mathrm{i}\sin\dfrac{\theta}{2}\right)=2\cos\dfrac{\theta}{2}\,\mathrm{e}^{\frac{\theta}{2}\mathrm{i}}$

## 题型 4 ｜复向量的模与方向（例 1.5）

**题 1** 电场强度 $E=2-2\sqrt3\,\mathrm{i}$，求大小与方向。

> $\left|E\right|=\sqrt{4+12}=4$，$\arg E=\arctan(-\sqrt3)=-\dfrac{\pi}{3}$
> 大小 $4$，方向与正实轴夹角 $-\dfrac{\pi}{3}$

**题 2** 力 $F=-3-3\mathrm{i}$，求大小与方向。

> $\left|F\right|=3\sqrt2$，$F$ 在第三象限：$\arg F=-\pi+\dfrac{\pi}{4}=-\dfrac{3\pi}{4}$
> 大小 $3\sqrt2$，方向 $-\dfrac{3\pi}{4}$

## 题型 5 ｜方根与几何意义（例 1.6）

**题 1** 求 $\sqrt[4]{-4}$，说明几何意义。

> $-4=4\mathrm{e}^{\pi\mathrm{i}}$，$w_k=\sqrt2\,\mathrm{e}^{\mathrm{i}\frac{\pi+2k\pi}{4}},\ k=0,1,2,3$
> $1+\mathrm{i},\ -1+\mathrm{i},\ -1-\mathrm{i},\ 1-\mathrm{i}$：内接于 $\left|z\right|=\sqrt2$ 的正方形四顶点

**题 2** 求 $\sqrt[3]{8\mathrm{i}}$，说明几何意义。

> $8\mathrm{i}=8\mathrm{e}^{\frac{\pi}{2}\mathrm{i}}$，$w_k=2\mathrm{e}^{\mathrm{i}\left(\frac{\pi}{6}+\frac{2k\pi}{3}\right)}$
> $\sqrt3+\mathrm{i},\ -\sqrt3+\mathrm{i},\ -2\mathrm{i}$：内接于 $\left|z\right|=2$ 的正三角形三顶点

## 题型 6 ｜直线、线段的复数方程（例 1.7）

**题 1** 求过 $z_1=1+\mathrm{i}$、$z_2=2-3\mathrm{i}$ 的直线与线段的复数方程，及线段中点。

> 直线：$z=1+\mathrm{i}+t(1-4\mathrm{i}),\ t\in\mathbb{R}$；线段：$t\in[0,1]$
> 中点：$z=\dfrac{z_1+z_2}{2}=\dfrac32-\mathrm{i}$

**题 2** 判断 $z_1=1+\mathrm{i},\ z_2=2+3\mathrm{i},\ z_3=3+5\mathrm{i}$ 是否共线。

> $\dfrac{z_3-z_1}{z_2-z_1}=\dfrac{2+4\mathrm{i}}{1+2\mathrm{i}}=2\in\mathbb{R}$ → 三点共线

## 题型 7 ｜方程（不等式）表示的图形（例 1.8）

**题 1** 说明 $\left|z-1+\mathrm{i}\right|=\left|z+2\right|$ 表示的图形。

> 到 $1-\mathrm{i}$ 与 $-2$ 等距 → 其中垂线
> $(x-1)^2+(y+1)^2=(x+2)^2+y^2\Rightarrow y=3x+1$

**题 2** 说明 $1<\left|z-2\mathrm{i}\right|\leqslant2$ 表示的图形。

> 以 $2\mathrm{i}$ 为心、内半径 $1$（不含）、外半径 $2$（含）的圆环域

## 题型 8 ｜旋转法求多边形顶点（例 1.9）

**题 1** 正三角形两顶点 $z_1=0,\ z_2=2$，求第三顶点。

> $z_3=z_1+\mathrm{e}^{\pm\frac{\pi}{3}\mathrm{i}}\left(z_2-z_1\right)=2\mathrm{e}^{\pm\frac{\pi}{3}\mathrm{i}}$
> $z_3=1+\sqrt3\,\mathrm{i},\quad z_3'=1-\sqrt3\,\mathrm{i}$

**题 2** 正方形一边两端点 $z_1=1+\mathrm{i},\ z_2=3+\mathrm{i}$，求另两顶点。

> $z_3=z_2+\mathrm{i}\left(z_2-z_1\right)=3+\mathrm{i}+2\mathrm{i}=3+3\mathrm{i}$
> $z_4=z_1+2\mathrm{i}=1+3\mathrm{i}$

## 题型 9 ｜证明极限不存在（例 1.10）

**题 1** 证明 $\lim\limits_{z\to0}\dfrac{\bar z}{z}$ 不存在。

> $z=r\mathrm{e}^{\mathrm{i}\theta}\Rightarrow\dfrac{\bar z}{z}=\mathrm{e}^{-2\theta\mathrm{i}}$
> $\theta=0$ 时 $\to1$，$\theta=\dfrac{\pi}{4}$ 时 $\to-\mathrm{i}$，故极限不存在

**题 2** 证明 $\lim\limits_{z\to0}\dfrac{\operatorname{Re}z\cdot\operatorname{Im}z}{\left|z\right|^2}$ 不存在。

> $z=r\mathrm{e}^{\mathrm{i}\theta}\Rightarrow f=\cos\theta\sin\theta=\dfrac12\sin2\theta$
> 沿 $\theta=0$ 得 $0$，沿 $\theta=\dfrac{\pi}{4}$ 得 $\dfrac12$，故不存在

## 题型 10 ｜连续性（例 1.11）

**题 1** 证明 $f(z)=\left|z\right|$ 在 $\mathbb{C}$ 上处处连续。

> $\left|\left|z\right|-\left|z_0\right|\right|\leqslant\left|z-z_0\right|<\varepsilon$，取 $\delta=\varepsilon$

**题 2** 证明 $f(z)$ 在 $z_0$ 连续 $\Leftrightarrow$ $\operatorname{Re}f(z)$、$\operatorname{Im}f(z)$ 在 $z_0$ 连续。

> $\left|u-u_0\right|,\left|v-v_0\right|\leqslant\left|f(z)-f(z_0)\right|\leqslant\left|u-u_0\right|+\left|v-v_0\right|$
> 两端同趋于 $0$，等价性成立

