---
title: "第五章 留数及其应用 核心题型"
slug: "complex/core-problems/ch5"
description: "题 1 判断 z 0 对 f(z) dfrac{ mathrm{e}^z 1 z}{z^2} 的类型。"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第五章 留数及其应用 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 5.4 – 例 5.16；答案只留关键式
> - 规则一：$\mathrm{Res}[f,z_0]=\dfrac{1}{(m-1)!}\lim\limits_{z\to z_0}\dfrac{\mathrm{d}^{m-1}}{\mathrm{d}z^{m-1}}\big[(z-z_0)^mf\big]$
> - 规则二：$\mathrm{Res}\Big[\dfrac{\varphi}{\psi},z_0\Big]=\dfrac{\varphi(z_0)}{\psi'(z_0)}$；$\mathrm{Res}[f,\infty]=-c_{-1}$

## 题型 1 ｜判别可去奇点与本性质奇点（例 5.4、例 5.6）

**题 1** 判断 $z=0$ 对 $f(z)=\dfrac{\mathrm{e}^z-1-z}{z^2}$ 的类型。

> $\mathrm{e}^z-1-z=\dfrac{z^2}{2!}+\dfrac{z^3}{3!}+\cdots$
> $f=\dfrac12+\dfrac{z}{6}+\cdots$ 无负幂项 → 可去奇点，$f(0)=\dfrac12$

**题 2** 判断 $z=0$ 对 $f(z)=z^2\mathrm{e}^{1/z}$ 的类型。

> $f=z^2+z+\dfrac12+\dfrac{1}{6z}+\dfrac{1}{24z^2}+\cdots$
> 无穷多负幂项 → 本性奇点

## 题型 2 ｜零点的级（例 5.7）

**题 1** 证 $z=0$ 是 $f(z)=\mathrm{e}^z-1-z-\dfrac{z^2}{2}$ 的三级零点。

> $f'=\mathrm{e}^z-1-z,\ f'(0)=0$；$f''=\mathrm{e}^z-1,\ f''(0)=0$；$f'''=\mathrm{e}^z,\ f'''(0)=1\neq0$

**题 2** 求 $f(z)=z^2\sin z$ 在 $z=0$ 的零点级数。

> $z^2\sin z=z^3\Big(1-\dfrac{z^2}{6}+\cdots\Big)$ → 三级零点

## 题型 3 ｜求极点的级数（例 5.8）

**题 1** 求 $f(z)=\dfrac{1}{z^2\sin z}$ 在 $z=0$ 的极点级数。

> $\sin z=z\Big(1-\dfrac{z^2}{6}+\cdots\Big)$ → $z^2\sin z$ 为三级零点
> $z=0$ 为三级极点

**题 2** 求 $f(z)=\dfrac{1}{\cos z}$ 的全部孤立奇点及级数。

> $\cos z=0\Rightarrow z=\dfrac{\pi}{2}+k\pi$；$(\cos z)'=-\sin z=\mp1\neq0$
> 全为一级极点

## 题型 4 ｜扩充复平面上的奇点与 $\infty$（例 5.9）

**题 1** 求 $f(z)=\dfrac{z-1}{(\sin\pi z)^2}$ 在扩充复平面上的奇点类型。

> $z=k$（$k\neq1$）：分母二级零点 → 二级极点
> $z=1$：分子一级零点、分母二级零点 → 一级极点
> $\infty$：$k\to\infty$ 时极点趋于 $\infty$ → 非孤立奇点

**题 2** 求 $f(z)=\dfrac{1}{\mathrm{e}^z-1}$ 在扩充复平面上的奇点类型。

> $\mathrm{e}^z=1\Rightarrow z=2k\pi\mathrm{i}$，$(\mathrm{e}^z)'=1\neq0$ → 一级极点
> $\infty$：$2k\pi\mathrm{i}\to\infty$ → 非孤立奇点

## 题型 5 ｜留数定理算闭路积分（一级极点，例 5.10）

**题 1** $\displaystyle\oint_{|z|=2}\frac{z\,\mathrm{d}z}{(z-1)(z+3)}$

> 内部仅 $z=1$：$\mathrm{Res}=\dfrac{z}{z+3}\Big|_{1}=\dfrac14$
> $=2\pi\mathrm{i}\cdot\dfrac14=\dfrac{\pi\mathrm{i}}{2}$

**题 2** $\displaystyle\oint_{|z|=3}\frac{\mathrm{e}^z}{z^2+4}\mathrm{d}z$

> $\mathrm{Res}\Big[\cdot,2\mathrm{i}\Big]=\dfrac{\mathrm{e}^{2\mathrm{i}}}{4\mathrm{i}}$，$\mathrm{Res}\Big[\cdot,-2\mathrm{i}\Big]=\dfrac{\mathrm{e}^{-2\mathrm{i}}}{-4\mathrm{i}}$
> 和 $=\dfrac{\sin2}{2}$，积分 $=\pi\mathrm{i}\sin2$

## 题型 6 ｜高阶极点处的留数（例 5.11）

**题 1** 求 $f(z)=\dfrac{z}{\sin^2z}$ 在 $z=0$ 的留数。

> $z=0$ 为一级极点（$\sin^2z\sim z^2$）
> $\mathrm{Res}=\lim\limits_{z\to0}z\cdot\dfrac{z}{\sin^2z}=1$

**题 2** 求 $f(z)=\dfrac{1-\cos z}{z^5}$ 在 $z=0$ 的留数。

> $1-\cos z=\dfrac{z^2}{2!}-\dfrac{z^4}{4!}+\cdots$
> $f=\dfrac{1}{2z^3}-\dfrac{1}{24z}+\dfrac{z}{720}-\cdots\Rightarrow\mathrm{Res}=-\dfrac{1}{24}$

## 题型 7 ｜用 $\infty$ 处留数算积分（例 5.12）

**题 1** $\displaystyle\oint_{|z|=2}\frac{z^6\,\mathrm{d}z}{(z^2+1)(z-1)^3}$

> $I=2\pi\mathrm{i}\,\mathrm{Res}\Big[\dfrac{1}{z^3(1+z^2)(1-z)^3},0\Big]$，$h=\dfrac{1}{(1+z^2)(1-z)^3}$，$\dfrac{h''(0)}{2}=\dfrac{10}{2}=5$
> $I=10\pi\mathrm{i}$

**题 2** $\displaystyle\oint_{|z|=3}\frac{z^4\,\mathrm{d}z}{(z-1)^2(z+2)^2}$

> $I=2\pi\mathrm{i}\,\mathrm{Res}\Big[\dfrac{1}{z^2(1-z)^2(1+2z)^2},0\Big]$
> $g=\dfrac{1}{(1-z)^2(1+2z)^2},\ g'(0)=-2\Rightarrow I=-4\pi\mathrm{i}$

## 题型 8 ｜$\displaystyle\int_0^{2\pi}R(\cos\theta,\sin\theta)\,\mathrm{d}\theta$（例 5.13）

**题 1** $\displaystyle\int_0^{2\pi}\frac{\mathrm{d}\theta}{5+3\cos\theta}$

> $z=\mathrm{e}^{\mathrm{i}\theta}$：$5+3\cos\theta=\dfrac{3z^2+10z+3}{2z}=\dfrac{3(z+3)(z+\frac13)}{2z}$
> 内部极点 $z=-\dfrac13$，$\mathrm{Res}=\dfrac{3}{8}$ → $I=\dfrac{2}{3\mathrm{i}}\cdot2\pi\mathrm{i}\cdot\dfrac38=\dfrac{\pi}{2}$

**题 2** $\displaystyle\int_0^{2\pi}\frac{\mathrm{d}\theta}{\frac54-\cos\theta}$

> $z=\mathrm{e}^{\mathrm{i}\theta}$：$\dfrac54-\cos\theta=\dfrac{-(2z-1)(z-2)}{4z}$，$\mathrm{d}\theta=\dfrac{\mathrm{d}z}{\mathrm{i}z}$
> $I=\displaystyle\oint_{|z|=1}\dfrac{4\mathrm{i}\,\mathrm{d}z}{(2z-1)(z-2)}$，$\mathrm{Res}\Big[\cdot,\dfrac12\Big]=-\dfrac{4\mathrm{i}}{3}$
> $I=2\pi\mathrm{i}\Big(-\dfrac{4\mathrm{i}}{3}\Big)=\dfrac{8\pi}{3}$

## 题型 9 ｜$\displaystyle\int_0^{\pi}R(\cos x,\sin x)\,\mathrm{d}x$（例 5.14）

**题 1** $\displaystyle\int_0^{\pi}\frac{\cos2x}{5-4\cos x}\mathrm{d}x$

> 偶函数：$I=\dfrac12\displaystyle\int_{-\pi}^{\pi}\frac{\mathrm{e}^{2\mathrm{i}x}}{5-4\cos x}\mathrm{d}x$
> $5-4\cos x=\dfrac{-(2z-1)(z-2)}{z}$，$I=-\dfrac{1}{2\mathrm{i}}\displaystyle\oint\frac{z^2}{(2z-1)(z-2)}\mathrm{d}z$
> $\mathrm{Res}\Big[\cdot,\dfrac12\Big]=-\dfrac{1}{12}\Rightarrow I=\dfrac{\pi}{12}$

**题 2** $\displaystyle\int_0^{\pi}\frac{\mathrm{d}x}{2+\cos x}$

> $I=\dfrac{1}{\mathrm{i}}\displaystyle\oint_{|z|=1}\frac{\mathrm{d}z}{z^2+4z+1}$，内部极点 $z=-2+\sqrt3$，$\mathrm{Res}=\dfrac{1}{2\sqrt3}$
> $I=\dfrac{1}{\mathrm{i}}\cdot2\pi\mathrm{i}\cdot\dfrac{1}{2\sqrt3}=\dfrac{\pi}{\sqrt3}$

## 题型 10 ｜$\displaystyle\int_{-\infty}^{+\infty}R(x)\mathrm{d}x$ 与 $\displaystyle\int R(x)\mathrm{e}^{\mathrm{i}ax}\mathrm{d}x$（例 5.15、例 5.16）

**题 1** $\displaystyle\int_{-\infty}^{+\infty}\frac{\cos x}{x^2+2x+2}\mathrm{d}x$

> 上半平面极点 $z=-1+\mathrm{i}$；$\mathrm{Res}\Big[\dfrac{\mathrm{e}^{\mathrm{i}z}}{z^2+2z+2},-1+\mathrm{i}\Big]=\dfrac{\mathrm{e}^{-1-\mathrm{i}}}{2\mathrm{i}}$
> $\displaystyle\int\frac{\mathrm{e}^{\mathrm{i}x}}{x^2+2x+2}\mathrm{d}x=\pi\mathrm{e}^{-1-\mathrm{i}}\Rightarrow I=\dfrac{\pi\cos1}{\mathrm{e}}$

**题 2** $\displaystyle\int_{-\infty}^{+\infty}\frac{x\sin x}{x^2+1}\mathrm{d}x$

> $\mathrm{Res}\Big[\dfrac{z\mathrm{e}^{\mathrm{i}z}}{z^2+1},\mathrm{i}\Big]=\dfrac{\mathrm{i}\,\mathrm{e}^{-1}}{2\mathrm{i}}=\dfrac{1}{2\mathrm{e}}$
> $\displaystyle\int\frac{x\mathrm{e}^{\mathrm{i}x}}{x^2+1}\mathrm{d}x=\dfrac{\pi\mathrm{i}}{\mathrm{e}}\Rightarrow I=\dfrac{\pi}{\mathrm{e}}$

