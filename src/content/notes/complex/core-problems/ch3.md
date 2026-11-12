---
title: "第三章 复变函数的积分 核心题型"
slug: "complex/core-problems/ch3"
description: "题 1 displaystyle int_C z^2 mathrm{d}z ， C ： 0 to1+2 mathrm{i} 直线段。"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第三章 复变函数的积分 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 3.1 – 例 3.12；答案只留关键式
> - 全部结果已用数值积分复核

## 题型 1 ｜参数方程法（例 3.1）

**题 1** $\displaystyle\int_C z^2\mathrm{d}z$，$C$：$0\to1+2\mathrm{i}$ 直线段。

> $z=(1+2\mathrm{i})t,\ \mathrm{d}z=(1+2\mathrm{i})\mathrm{d}t$
> $=\displaystyle\int_0^1(1+2\mathrm{i})^3t^2\mathrm{d}t=\dfrac{(1+2\mathrm{i})^3}{3}=-\dfrac{11}{3}-\dfrac23\mathrm{i}$

**题 2** $\displaystyle\int_C(z^2+\bar z)\mathrm{d}z$，$C$：$0\to1+\mathrm{i}$ 直线段。

> $z=(1+\mathrm{i})t,\ \bar z=(1-\mathrm{i})t,\ \mathrm{d}z=(1+\mathrm{i})\mathrm{d}t$
> $=\displaystyle\int_0^1\big[2\mathrm{i}(1+\mathrm{i})t^2+2t\big]\mathrm{d}t=\dfrac13+\dfrac23\mathrm{i}$

## 题型 2 ｜基本积分公式（例 3.2）

$$
\oint_{\left|z-z_0\right|=r}\frac{\mathrm{d}z}{(z-z_0)^{n+1}}=\begin{cases}2\pi\mathrm{i},&n=0\\0,&n\neq0\end{cases}
$$

**题 1** $\displaystyle\oint_{\left|z-2\right|=1}\frac{\mathrm{d}z}{(z-2)^4}$（$n=3$）

> $=0$

**题 2** $\displaystyle\oint_{\left|z\right|=2}\Big[\frac{1}{(z-1)^3}+\frac{1}{z+1}\Big]\mathrm{d}z$

> $=0+2\pi\mathrm{i}=2\pi\mathrm{i}$

## 题型 3 ｜积分与路径相关（例 3.3）

**题 1** $\displaystyle\int_C\bar z\,\mathrm{d}z$，$0\to2+2\mathrm{i}$。

> 直线：$\displaystyle\int_0^18t\,\mathrm{d}t=4$
> 折线 $0\to2\to2+2\mathrm{i}$：$\displaystyle\int_0^2t\,\mathrm{d}t+\int_0^2(2-\mathrm{i}t)\mathrm{i}\,\mathrm{d}t=2+(2+4\mathrm{i})=4+4\mathrm{i}$

**题 2** $\displaystyle\int_C\operatorname{Re}z\,\mathrm{d}z$，$0\to1+\mathrm{i}$。

> 直线：$\displaystyle\int_0^1t(1+\mathrm{i})\mathrm{d}t=\dfrac{1+\mathrm{i}}{2}$
> 折线 $0\to1\to1+\mathrm{i}$：$\dfrac12+\mathrm{i}$

## 题型 4 ｜估值不等式（例 3.4）

**题 1** $C$：$0\to2+2\mathrm{i}$，估 $\left|\displaystyle\int_C\dfrac{\mathrm{d}z}{z^2+4}\right|$。

> $z^2+4=4+8\mathrm{i}t^2,\ \left|z^2+4\right|=4\sqrt{1+4t^4}\geqslant4\Rightarrow M=\dfrac14,\ L=2\sqrt2$
> $\leqslant\dfrac{\sqrt2}{2}$

**题 2** $C$：$\left|z\right|=2$ 上半圆 $2\to-2$，估 $\left|\displaystyle\int_C\dfrac{z+1}{z^3-1}\mathrm{d}z\right|$。

> $\left|z+1\right|\leqslant3,\ \left|z^3-1\right|\geqslant\left|z\right|^3-1=7\Rightarrow M=\dfrac37,\ L=2\pi$
> $\leqslant\dfrac{6\pi}{7}$

## 题型 5 ｜复合闭路定理（例 3.5）

**题 1** $\Gamma$ 为包含 $-1,-2$ 的正向闭曲线，求 $\displaystyle\oint_\Gamma\frac{2z+3}{z^2+3z+2}\mathrm{d}z$。

> $\dfrac{2z+3}{(z+1)(z+2)}=\dfrac{1}{z+1}+\dfrac{1}{z+2}$
> $=2\pi\mathrm{i}+2\pi\mathrm{i}=4\pi\mathrm{i}$

**题 2** $\displaystyle\oint_{\left|z\right|=2}\frac{3z^2+1}{z(z^2-1)}\mathrm{d}z$（奇点 $-1,0,1$ 均在内部）

> $\dfrac{3z^2+1}{z(z-1)(z+1)}=-\dfrac1z+\dfrac{2}{z-1}+\dfrac{2}{z+1}$
> $=2\pi\mathrm{i}(-1+2+2)=6\pi\mathrm{i}$

## 题型 6 ｜牛顿–莱布尼茨公式（例 3.6）

**题 1** $\displaystyle\int_0^{\pi\mathrm{i}}z\mathrm{e}^z\mathrm{d}z$

> $=\big[\mathrm{e}^z(z-1)\big]_0^{\pi\mathrm{i}}=-(\pi\mathrm{i}-1)+1=2-\pi\mathrm{i}$

**题 2** $\displaystyle\int_0^{\mathrm{i}}z\sin z\,\mathrm{d}z$

> $=\big[-z\cos z+\sin z\big]_0^{\mathrm{i}}=-\mathrm{i}\cosh1+\mathrm{i}\sinh1=-\dfrac{\mathrm{i}}{\mathrm{e}}$

## 题型 7 ｜N–L 公式 + 多值函数选支（例 3.7）

**题 1** 沿 $\left|z\right|=1$ 第一象限弧 $1\to\mathrm{i}$，求 $\displaystyle\int\frac{\ln z}{z}\mathrm{d}z$。

> 原函数 $\dfrac12\ln^2z$；$\ln\mathrm{i}=\dfrac{\pi}{2}\mathrm{i},\ \ln1=0$
> $=\dfrac12\left(\dfrac{\pi}{2}\mathrm{i}\right)^2=-\dfrac{\pi^2}{8}$

**题 2** 沿 $\left|z\right|=1$ 右半弧 $-\mathrm{i}\to\mathrm{i}$，求 $\displaystyle\int\frac{\mathrm{d}z}{z}$。

> $=\ln\mathrm{i}-\ln(-\mathrm{i})=\dfrac{\pi}{2}\mathrm{i}+\dfrac{\pi}{2}\mathrm{i}=\pi\mathrm{i}$

## 题型 8 ｜柯西积分公式（例 3.8）

**题 1** $\displaystyle\frac{1}{2\pi\mathrm{i}}\oint_{\left|z\right|=4}\frac{\cos z}{z-\pi}\mathrm{d}z$

> $=\cos z\big|_{z=\pi}=-1$

**题 2** $\displaystyle\oint_{\left|z-1\right|=1}\frac{\sin\frac{\pi z}{2}}{z^2-1}\mathrm{d}z$（仅 $z=1$ 在内部）

> $=2\pi\mathrm{i}\cdot\dfrac{\sin\frac{\pi z}{2}}{z+1}\Big|_{z=1}=2\pi\mathrm{i}\cdot\dfrac12=\pi\mathrm{i}$

## 题型 9 ｜高阶导数公式求导函数（例 3.9）

**题 1** $F(z)=\displaystyle\oint_{\left|\zeta\right|=4}\frac{\zeta^3-2\zeta+5}{(\zeta-z)^2}\mathrm{d}\zeta$，求 $F'(2\mathrm{i})$。

> $F=2\pi\mathrm{i}(3z^2-2)\Rightarrow F'=12\pi\mathrm{i}z$
> $F'(2\mathrm{i})=-24\pi$

**题 2** $F(z)=\displaystyle\oint_{\left|\zeta\right|=3}\frac{\mathrm{e}^\zeta+\zeta^2}{(\zeta-z)^3}\mathrm{d}\zeta$，求 $F(z)$、$F'(0)$。

> $F=\dfrac{2\pi\mathrm{i}}{2!}f''(z)=\pi\mathrm{i}(\mathrm{e}^z+2)\Rightarrow F'(0)=\pi\mathrm{i}$

## 题型 10 ｜高阶导数公式算积分（例 3.10）

**题 1** $\displaystyle\oint_{\left|z\right|=2}\frac{\mathrm{e}^{2z}}{(z-1)^3}\mathrm{d}z$

> $=\dfrac{2\pi\mathrm{i}}{2!}\left(4\mathrm{e}^{2z}\right)_{z=1}=4\pi\mathrm{i}\,\mathrm{e}^2$

**题 2** $\displaystyle\oint_{\left|z\right|=3}\frac{\mathrm{e}^z}{(z-1)^2(z+2)}\mathrm{d}z$

> $z=1$：$2\pi\mathrm{i}\Big[\dfrac{\mathrm{e}^z}{z+2}\Big]'_{1}=\dfrac{4\pi\mathrm{i}\,\mathrm{e}}{9}$
> $z=-2$：$2\pi\mathrm{i}\cdot\dfrac{\mathrm{e}^{-2}}{9}$
> $=\dfrac{2\pi\mathrm{i}}{9}\left(2\mathrm{e}+\mathrm{e}^{-2}\right)$

## 题型 11 ｜由实部求解析函数（例 3.11）

**题 1** $u=x^2-y^2+2x$，求 $v$ 与 $f$。

> $u_{xx}+u_{yy}=0$ ✓；$v_y=u_x=2x+2\Rightarrow v=2xy+2y+g(x)$
> $v_x=2y+g'=-u_y=2y\Rightarrow g'=0$
> $v=2xy+2y+c,\quad f=z^2+2z+\mathrm{i}c$

**题 2** $u=2x-2xy$，求 $v$ 与 $f$。

> $v_y=2-2y\Rightarrow v=2y-y^2+g(x)$
> $v_x=g'=-u_y=2x\Rightarrow g=x^2$
> $v=x^2-y^2+2y+c,\quad f=\mathrm{i}z^2+2z+\mathrm{i}c$

## 题型 12 ｜由虚部求解析函数（例 3.12）

**题 1** $v=x^2-y^2$，求 $f$。

> $u_x=v_y=-2y\Rightarrow u=-2xy+g(y)$
> $u_y=-2x+g'=-v_x=-2x\Rightarrow g'=0$
> $f=-2xy+\mathrm{i}(x^2-y^2)+c=\mathrm{i}z^2+c$

**题 2** $v=\cos x\cosh y$，且 $f(0)=0$，求 $f$。

> $u_x=v_y=\cos x\sinh y\Rightarrow u=\sin x\sinh y+g(y)$
> $u_y=\sin x\cosh y+g'=-v_x=\sin x\cosh y\Rightarrow g'=0$
> $f=\mathrm{i}\cos z+c$；$f(0)=\mathrm{i}+c=0\Rightarrow f=\mathrm{i}(\cos z-1)$

