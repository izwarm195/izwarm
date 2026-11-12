---
title: "第六章 共形映射 核心题型"
slug: "complex/core-problems/ch6"
description: "题 1 w z^3 在 z mathrm{i} 处的伸缩率与转动角；过 mathrm{i} 平行实轴的方向映成何方向？"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第六章 共形映射 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 6.1 – 例 6.10；答案只留映射式与关键步骤
> - 常用件：$\dfrac{z-\lambda}{z-\bar\lambda}$（上半平面→单位圆）、$\mathrm{e}^{i\varphi}\dfrac{z-\alpha}{1-\bar\alpha z}$（单位圆→单位圆）、$z^n$（张角放大 $n$ 倍）、$\mathrm{e}^{z}$（带宽 $a$→张角 $a$）

## 题型 1 ｜伸缩率与转动角（例 6.1）

**题 1** $w=z^3$ 在 $z=\mathrm{i}$ 处的伸缩率与转动角；过 $\mathrm{i}$ 平行实轴的方向映成何方向？

> $w'=3z^2\big|_{\mathrm{i}}=-3$，$|w'|=3$，$\arg w'=\pi$
> 伸缩率 $3$，转动角 $\pi$，水平方向 $\mapsto$ 负实轴方向

**题 2** $w=\mathrm{e}^z$ 在 $z=\dfrac{\pi}{2}\mathrm{i}$ 处的伸缩率与转动角。

> $w'=\mathrm{e}^{\pi\mathrm{i}/2}=\mathrm{i}$，$|w'|=1$，$\arg w'=\dfrac{\pi}{2}$

## 题型 2 ｜上半平面 → 单位圆（例 6.2）

**题 1** $\operatorname{Im}z>0\to|w|<1$，$w(2\mathrm{i})=0$，$\arg w'(2\mathrm{i})=\dfrac{\pi}{2}$。

> $w=\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-2\mathrm{i}}{z+2\mathrm{i}}$，$w'(2\mathrm{i})=-\dfrac{\mathrm{e}^{\mathrm{i}\theta}}{4}$
> $\theta+\pi=\dfrac{\pi}{2}\Rightarrow\theta=-\dfrac{\pi}{2}$，$w=-\mathrm{i}\dfrac{z-2\mathrm{i}}{z+2\mathrm{i}}$

**题 2** $\operatorname{Im}z>0\to|w|<1$，$w(1+\mathrm{i})=0$，$\arg w'(1+\mathrm{i})=0$。

> $w=\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-1-\mathrm{i}}{z-1+\mathrm{i}}$，$w'(1+\mathrm{i})=-\dfrac{\mathrm{i}}{2}\mathrm{e}^{\mathrm{i}\theta}$
> $\theta-\dfrac{\pi}{2}=0\Rightarrow\theta=\dfrac{\pi}{2}$，$w=\mathrm{i}\dfrac{z-1-\mathrm{i}}{z-1+\mathrm{i}}$

## 题型 3 ｜单位圆 → 单位圆（例 6.3）

**题 1** $|z|<1\to|w|<1$，$f\left(-\dfrac12\right)=0$，$f'\left(-\dfrac12\right)>0$。

> $w=\mathrm{e}^{\mathrm{i}\varphi}\dfrac{z+\frac12}{1+\frac12z}$，$f'\left(-\dfrac12\right)=\dfrac43\mathrm{e}^{\mathrm{i}\varphi}>0\Rightarrow\varphi=0$
> $w=\dfrac{2z+1}{2+z}$

**题 2** $|z|<1\to|w|<1$，$f(0)=0$，$\arg f'(0)=\dfrac{\pi}{2}$。

> $w=\mathrm{e}^{\mathrm{i}\varphi}z$，$f'(0)=\mathrm{e}^{\mathrm{i}\varphi}\Rightarrow\varphi=\dfrac{\pi}{2}$
> $w=\mathrm{i}z$

## 题型 4 ｜上半平面 → 圆内部（例 6.4）

**题 1** $\operatorname{Im}z>0\to|w-1|<1$，$w(\mathrm{i})=1$，$\arg w'(\mathrm{i})=0$。

> $\zeta=\dfrac{z-\mathrm{i}}{z+\mathrm{i}}$，$w=1+\mathrm{e}^{\mathrm{i}\psi}\zeta$
> $w'(\mathrm{i})=\dfrac{1}{2\mathrm{i}}\mathrm{e}^{\mathrm{i}\psi}\Rightarrow\psi-\dfrac{\pi}{2}=0\Rightarrow\psi=\dfrac{\pi}{2}$
> $w=1+\mathrm{i}\dfrac{z-\mathrm{i}}{z+\mathrm{i}}$

**题 2** $\operatorname{Im}z>0\to|w+1|<1$，$w(2\mathrm{i})=-1$，$\arg w'(2\mathrm{i})=\dfrac{\pi}{2}$。

> $\zeta=\dfrac{z-2\mathrm{i}}{z+2\mathrm{i}}$，$w=-1+\mathrm{e}^{\mathrm{i}\psi}\zeta$，$w'(2\mathrm{i})=-\dfrac{\mathrm{e}^{\mathrm{i}\psi}}{4}$
> $\psi+\pi=\dfrac{\pi}{2}\Rightarrow\psi=-\dfrac{\pi}{2}$，$w=-1-\mathrm{i}\dfrac{z-2\mathrm{i}}{z+2\mathrm{i}}$

## 题型 5 ｜上半平面 → 上半平面（例 6.5）

**题 1** $\operatorname{Im}z>0\to\operatorname{Im}w>0$，$0\mapsto0$，$\mathrm{i}\mapsto2\mathrm{i}$。

> $w=\dfrac{az}{cz+d}$（$a,b,c,d\in\mathbb{R}$）
> $2\mathrm{i}=\dfrac{a\mathrm{i}}{c\mathrm{i}+d}\Rightarrow c=0,\ a=2d$
> $w=2z$（$ad-bc=2d^2>0$）

**题 2** 同上，$0\mapsto1$，$\mathrm{i}\mapsto2\mathrm{i}$。

> $w=\dfrac{az+d}{cz+d}$，$1=\dfrac{d}{d}$ ✓
> $2\mathrm{i}=\dfrac{a\mathrm{i}+d}{c\mathrm{i}+d}\Rightarrow d=-2c,\ a=2d$
> 取 $d=1$：$w=\dfrac{4z+2}{2-z}$（$ad-bc=\dfrac52>0$）

## 题型 6 ｜角形域 → 单位圆（例 6.6）

**题 1** $0<\arg z<\dfrac{\pi}{3}\to|w|<1$。

> $z^3$：$\to$ 上半平面；再 $\dfrac{\zeta-\mathrm{i}}{\zeta+\mathrm{i}}$
> $w=\dfrac{z^3-\mathrm{i}}{z^3+\mathrm{i}}$

**题 2** $\dfrac{\pi}{4}<\arg z<\dfrac{3\pi}{4}\to|w|<1$。

> 先转 $\zeta=\mathrm{e}^{-\mathrm{i}\pi/4}z$（$\to$ 第一象限），$\zeta^2=\mathrm{e}^{-\mathrm{i}\pi/2}z^2=-\mathrm{i}z^2$
> $w=\dfrac{-\mathrm{i}z^2-\mathrm{i}}{-\mathrm{i}z^2+\mathrm{i}}=\dfrac{z^2+1}{z^2-1}$

## 题型 7 ｜圆弧围成区域 → 简单域（例 6.7）

**题 1** 上半单位圆域 $|z|<1,\ \operatorname{Im}z>0\to$ 第一象限。

> $w=\dfrac{1+z}{1-z}$：$|z|=1\mapsto$ 虚轴，$z=0\mapsto1$，$z=\mathrm{i}\mapsto\mathrm{i}$
> 上半圆 $\mapsto$ 第一象限

**题 2** 上半单位圆域 $\to|w|<1$。

> 先 $\dfrac{1+z}{1-z}\to$ 第一象限，平方 $\to$ 上半平面，再 $\dfrac{\zeta-\mathrm{i}}{\zeta+\mathrm{i}}$
> $w=\dfrac{\left(\frac{1+z}{1-z}\right)^2-\mathrm{i}}{\left(\frac{1+z}{1-z}\right)^2+\mathrm{i}}$

## 题型 8 ｜带形域 → 单位圆（例 6.8）

**题 1** $0<\operatorname{Im}z<2\pi\to|w|<1$。

> $\zeta=\mathrm{e}^{z/2}$：$0<\arg\zeta<\pi$（上半平面）
> $w=\dfrac{\mathrm{e}^{z/2}-\mathrm{i}}{\mathrm{e}^{z/2}+\mathrm{i}}$

**题 2** $-\dfrac{\pi}{2}<\operatorname{Im}z<\dfrac{\pi}{2}\to|w|<1$。

> $\zeta=\mathrm{e}^{z}$：右半平面；$w=\dfrac{\zeta-1}{\zeta+1}$
> $w=\dfrac{\mathrm{e}^{z}-1}{\mathrm{e}^{z}+1}=\tanh\dfrac{z}{2}$

## 题型 9 ｜两相切圆周围成区域 → 上半平面（例 6.9）

**题 1** $|z|<1$ 与 $\left|z-\dfrac12\right|>\dfrac12$ 之交（$z=1$ 处相切）$\to\operatorname{Im}w>0$。

> $z_1=\dfrac{z}{z-1}$：$|z|=1\mapsto\operatorname{Re}z_1=\dfrac12$，$\left|z-\dfrac12\right|=\dfrac12\mapsto\operatorname{Re}z_1=0$
> 区域 $\mapsto 0<\operatorname{Re}z_1<\dfrac12$；$z_2=2\pi\mathrm{i}z_1\mapsto 0<\operatorname{Im}z_2<\pi$
> $w=\mathrm{e}^{2\pi\mathrm{i}\frac{z}{z-1}}$

**题 2** $|z|>1$ 与 $|z-2|<1$ 之交（$z=1$ 处相切）$\to\operatorname{Im}w>0$。

> $z_1=\dfrac{1}{z-1}$：两圆 $\mapsto\operatorname{Re}z_1=\mp\dfrac12$，区域 $\mapsto-\dfrac12<\operatorname{Re}z_1<\dfrac12$
> $z_2=\pi\mathrm{i}z_1\mapsto-\dfrac{\pi}{2}<\operatorname{Im}z_2<\dfrac{\pi}{2}$，$\mathrm{e}^{z_2}\mapsto$ 右半平面
> $w=\mathrm{i}\exp\dfrac{\pi\mathrm{i}}{z-1}$

## 题型 10 ｜半带形域 → 上半平面（例 6.10）

**题 1** $0<\operatorname{Im}z<\dfrac{\pi}{2},\ \operatorname{Re}z<0\to\operatorname{Im}w>0$。

> $\zeta_1=\mathrm{e}^{z}$：四分之一圆域（$|\zeta_1|<1,\ 0<\arg\zeta_1<\frac{\pi}{2}$）
> $\zeta_2=\zeta_1^2=\mathrm{e}^{2z}$：上半单位圆域
> $\dfrac{1+\zeta_2}{1-\zeta_2}\mapsto$ 第一象限，平方 $\mapsto$ 上半平面
> $w=\left(\dfrac{1+\mathrm{e}^{2z}}{1-\mathrm{e}^{2z}}\right)^2$

**题 2** $0<\operatorname{Im}z<\dfrac{\pi}{2}\to\operatorname{Im}w>0$。

> 带宽 $\dfrac{\pi}{2}$，张角需 $\pi$ → 用 $\mathrm{e}^{2z}$
> $w=\mathrm{e}^{2z}$

