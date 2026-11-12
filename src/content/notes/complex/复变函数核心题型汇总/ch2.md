---
title: "第二章 解析函数 核心题型"
slug: "complex/复变函数核心题型汇总/ch2"
description: "题 1 用定义证 f(z) dfrac1z (z neq0) 可导，并求 f'(z) 。"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第二章 解析函数 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 2.1 – 例 2.9；答案只留关键式
> - C-R：$u_x=v_y,\ u_y=-v_x$；$f'(z)=u_x+\mathrm{i}v_x$

## 题型 1 ｜用定义证可导（例 2.1）

**题 1** 用定义证 $f(z)=\dfrac1z\ (z\neq0)$ 可导，并求 $f'(z)$。

> $\dfrac{f(z+\Delta z)-f(z)}{\Delta z}=\dfrac{1}{\Delta z}\Big[\dfrac{1}{z+\Delta z}-\dfrac1z\Big]=\dfrac{-1}{z(z+\Delta z)}$
> $f'(z)=\lim\limits_{\Delta z\to0}\dfrac{-1}{z(z+\Delta z)}=-\dfrac{1}{z^2}$

**题 2** 用定义证 $f(z)=\bar z$ 在 $\mathbb{C}$ 内处处不可导。

> $\dfrac{\Delta\bar z}{\Delta z}=\dfrac{\Delta x-\mathrm{i}\Delta y}{\Delta x+\mathrm{i}\Delta y}$
> $\Delta y=0\Rightarrow1$；$\Delta x=0\Rightarrow-1$，两极限不等

## 题型 2 ｜连续但不可导（例 2.2）

**题 1** 讨论 $f(z)=x+2y\mathrm{i}$ 的连续性与可导性。

> $u=x,\ v=2y$ 连续 → $f$ 在 $\mathbb{C}$ 连续
> $\Delta y=0$：$\dfrac{\Delta x}{\Delta x}=1$；$\Delta x=0$：$\dfrac{2\Delta y\mathrm{i}}{\Delta y\mathrm{i}}=2$ → 处处不可导

**题 2** 讨论 $f(z)=\operatorname{Re}z=x$ 的连续性与可导性。

> $u=x$ 连续 → 连续
> $\Delta y=0$：$1$；$\Delta x=0$：$0$ → 处处不可导

## 题型 3 ｜解析性研究（例 2.3）

**题 1** 研究 $f(z)=\left|z\right|^2$ 的解析性。

> $\dfrac{\left|z_0+\Delta z\right|^2-\left|z_0\right|^2}{\Delta z}=\bar z_0+\overline{\Delta z}+z_0\dfrac{\overline{\Delta z}}{\Delta z}$
> $z_0=0$ 时极限 $=0$（可导）；$z_0\neq0$ 时随方向变 → 仅 $z=0$ 可导，处处不解析

**题 2** 研究 $f(z)=x^2+\mathrm{i}y^2$ 的解析性。

> $u_x=2x,\ u_y=0,\ v_x=0,\ v_y=2y$；C-R $\Rightarrow x=y$
> 在直线 $y=x$ 上可导，处处不解析

## 题型 4 ｜C-R 方程判别（例 2.4）

**题 1** 判断 $f(z)=\bar z z^2$ 的可导性与解析性。

> $u=x^3+xy^2,\ v=x^2y+y^3$
> $u_x=3x^2+y^2,\ u_y=2xy,\ v_x=2xy,\ v_y=x^2+3y^2$
> C-R $\Rightarrow x=y=0$：仅 $z=0$ 可导，处处不解析

**题 2** 判断 $f(z)=x^2+2xy\mathrm{i}$ 的可导性与解析性。

> $u_x=2x,\ u_y=0,\ v_x=2y,\ v_y=2x$
> C-R $\Rightarrow 2x=2x$（恒成立），$0=-2y\Rightarrow y=0$
> 在实轴上可导，处处不解析

## 题型 5 ｜验证解析并求 $f'(z)$（例 2.5）

**题 1** 证 $f(z)=\mathrm{e}^{2x}(\cos2y+\mathrm{i}\sin2y)$ 处处解析，求 $f'$。

> $u_x=2\mathrm{e}^{2x}\cos2y=v_y,\quad u_y=-2\mathrm{e}^{2x}\sin2y=-v_x$
> 偏导连续 → 解析；$f'=u_x+\mathrm{i}v_x=2\mathrm{e}^{2x}(\cos2y+\mathrm{i}\sin2y)=2f(z)$

**题 2** 证 $f(z)=\mathrm{e}^{x}(x\cos y-y\sin y)+\mathrm{i}\,\mathrm{e}^{x}(y\cos y+x\sin y)$ 处处解析，求 $f'$。

> $u_x=\mathrm{e}^{x}(x\cos y-y\sin y+\cos y)=v_y$
> $u_y=\mathrm{e}^{x}(-x\sin y-\sin y-y\cos y)=-v_x$
> $f'=u_x+\mathrm{i}v_x=\mathrm{e}^{z}(1+z)$

## 题型 6 ｜由 $f'$ 或 $\operatorname{Im}f$ 判定为常数（例 2.6）

**题 1** 设 $f$ 在 $D$ 解析且 $\operatorname{Im}f(z)\equiv c$，证 $f$ 为常数。

> $v_x=v_y=0$；C-R $\Rightarrow u_x=u_y=0$ → $u$ 为常数

**题 2** 设 $f$ 在 $D$ 解析且 $\left|f(z)\right|\equiv c$，证 $f$ 为常数。

> $c=0$ 显然；$c\neq0$：$u^2+v^2=c^2$ 两边求偏导并用 C-R
> $uu_x+vv_x=0,\ -uv_x+vu_x=0$，系数行列式 $u^2+v^2\neq0\Rightarrow u_x=v_x=0$

## 题型 7 ｜正交曲线族（例 2.7）

**题 1** 验证 $w=z^2$ 的曲线族 $x^2-y^2=c_1$ 与 $2xy=c_2$ 在 $z\neq0$ 处正交。

> $k_1=-\dfrac{u_x}{u_y}=-\dfrac{2x}{-2y}=\dfrac{x}{y}$，$k_2=-\dfrac{v_x}{v_y}=-\dfrac{2y}{2x}=-\dfrac{y}{x}$
> $k_1k_2=-1$

**题 2** 验证 $w=\mathrm{e}^{z}$ 的 $u=c_1$ 与 $v=c_2$ 正交。

> $k_1=-\dfrac{\mathrm{e}^{x}\cos y}{-\mathrm{e}^{x}\sin y}=\cot y$，$k_2=-\dfrac{\mathrm{e}^{x}\sin y}{\mathrm{e}^{x}\cos y}=-\tan y$
> $k_1k_2=-1$

## 题型 8 ｜对数 $\mathrm{Ln}\,z$ 与主值（例 2.8）

**题 1** 求 $\mathrm{Ln}(-1+\mathrm{i})$ 及其主值。

> $\left|-1+\mathrm{i}\right|=\sqrt2,\ \arg=\dfrac{3\pi}{4}$
> $\mathrm{Ln}(-1+\mathrm{i})=\dfrac12\ln2+\mathrm{i}\left(\dfrac{3\pi}{4}+2k\pi\right)$，主值 $\dfrac12\ln2+\dfrac{3\pi}{4}\mathrm{i}$

**题 2** 求 $\mathrm{Ln}\,\mathrm{i}$ 与 $\mathrm{Ln}(-3)$ 及其主值。

> $\mathrm{Ln}\,\mathrm{i}=\mathrm{i}\left(\dfrac{\pi}{2}+2k\pi\right)$，主值 $\dfrac{\pi}{2}\mathrm{i}$
> $\mathrm{Ln}(-3)=\ln3+\mathrm{i}(\pi+2k\pi)$，主值 $\ln3+\pi\mathrm{i}$

## 题型 9 ｜一般乘幂 $a^b=\mathrm{e}^{b\mathrm{Ln}a}$（例 2.9）

**题 1** 求 $2^{\mathrm{i}}$ 的值与主值。

> $2^{\mathrm{i}}=\mathrm{e}^{\mathrm{i}(\ln2+2k\pi)}=\mathrm{e}^{-2k\pi}\left(\cos\ln2+\mathrm{i}\sin\ln2\right)$
> 主值（$k=0$）：$\cos\ln2+\mathrm{i}\sin\ln2=\mathrm{e}^{\mathrm{i}\ln2}$

**题 2** 求 $(1+\mathrm{i})^{\mathrm{i}}$ 的值与主值。

> $\mathrm{Ln}(1+\mathrm{i})=\dfrac12\ln2+\mathrm{i}\left(\dfrac{\pi}{4}+2k\pi\right)$
> $(1+\mathrm{i})^{\mathrm{i}}=\mathrm{e}^{-\left(\frac{\pi}{4}+2k\pi\right)}\mathrm{e}^{\mathrm{i}\frac{\ln2}{2}}$
> 主值：$\mathrm{e}^{-\frac{\pi}{4}}\left(\cos\dfrac{\ln2}{2}+\mathrm{i}\sin\dfrac{\ln2}{2}\right)$

