---
title: "第四章 复变函数项级数 核心题型"
slug: "complex/复变函数核心题型汇总/ch4"
description: "题 1 讨论 displaystyle sum_{n 0}^{ infty} Big( frac{1+ mathrm{i}}{2} Big)^n 。"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第四章 复变函数项级数 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 4.1 – 例 4.9；答案只留关键式
> - 常用：$\dfrac{1}{1-w}=\sum w^n\ (|w|<1)$，$\dfrac{1}{(1+w)^2}=\sum(-1)^n(n+1)w^n$

## 题型 1 ｜等比级数 $\sum\alpha^n$（例 4.1）

**题 1** 讨论 $\displaystyle\sum_{n=0}^{\infty}\Big(\frac{1+\mathrm{i}}{2}\Big)^n$。

> $|\alpha|=\dfrac{\sqrt2}{2}<1$ → 绝对收敛
> $s=\dfrac{1}{1-\alpha}=\dfrac{2}{1-\mathrm{i}}=1+\mathrm{i}$

**题 2** 讨论 $\displaystyle\sum_{n=0}^{\infty}(1+\mathrm{i})^n$。

> $|\alpha|=\sqrt2>1\Rightarrow|\alpha|^n\to+\infty$，通项不趋于 $0$ → 发散

## 题型 2 ｜判敛散、绝对、条件收敛（例 4.2）

**题 1** $\displaystyle\sum_{n=1}^{\infty}\Big(\frac1n+\frac{\mathrm{i}}{n^2}\Big)$

> 实部 $\sum\dfrac1n$ 发散，虚部 $\sum\dfrac{1}{n^2}$ 收敛 → 发散

**题 2** $\displaystyle\sum_{n=1}^{\infty}\Big[\frac{(-1)^n}{n}+\frac{\mathrm{i}}{2^n}\Big]$

> 实部、虚部均收敛 → 收敛
> $\sum\Big|\dfrac{(-1)^n}{n}\Big|$ 发散 → 条件收敛

## 题型 3 ｜收敛半径与收敛圆（例 4.4）

**题 1** 求 $\displaystyle\sum_{n=0}^{\infty}\frac{z^{2n}}{2^n}$ 的收敛半径。

> 缺项级数，令 $w=z^2$：$\sum\dfrac{w^n}{2^n}$ 的 $R_w=2$
> $|z|^2<2\Rightarrow R=\sqrt2$

**题 2** 求 $\displaystyle\sum_{n=1}^{\infty}\frac{(z-1)^n}{n^2}$ 的收敛半径，并讨论收敛圆上敛散性。

> $\lambda=\lim\Big|\dfrac{c_{n+1}}{c_n}\Big|=\lim\dfrac{n^2}{(n+1)^2}=1\Rightarrow R=1$
> 收敛圆 $|z-1|=1$ 上：$\sum\dfrac{1}{n^2}$ 收敛 → 处处绝对收敛

## 题型 4 ｜$\dfrac{1}{z-b}$ 展成 $z-a$ 的幂级数（例 4.5）

**题 1** 将 $\dfrac{1}{z-3}$ 展成 $z-1$ 的幂级数。

> $\dfrac{1}{(z-1)-2}=-\dfrac12\cdot\dfrac{1}{1-\frac{z-1}{2}}$
> $=-\displaystyle\sum_{n=0}^{\infty}\frac{(z-1)^n}{2^{n+1}},\quad|z-1|<2$

**题 2** 将 $\dfrac{1}{z+2}$ 展成 $z-1$ 的幂级数。

> $\dfrac{1}{(z-1)+3}=\dfrac13\cdot\dfrac{1}{1+\frac{z-1}{3}}$
> $=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^n}{3^{n+1}}(z-1)^n,\quad|z-1|<3$

## 题型 5 ｜泰勒展开（例 4.6）

**题 1** $f(z)=\dfrac{1}{2-3z+z^2}$ 在 $z_0=0$ 展开，指收敛半径。

> $f=\dfrac{1}{1-z}-\dfrac{1}{2-z}=\displaystyle\sum z^n-\frac12\sum\Big(\frac z2\Big)^n$
> $=\displaystyle\sum_{n=0}^{\infty}\Big(1-\frac{1}{2^{n+1}}\Big)z^n,\quad R=1$

**题 2** $f(z)=\dfrac{1}{z^2}$ 在 $z_0=2$ 展开，指收敛半径。

> $\dfrac1z=\dfrac12\cdot\dfrac{1}{1+\frac{z-2}{2}}=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^n(z-2)^n}{2^{n+1}}$
> 逐项求导取负：$\dfrac{1}{z^2}=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^n(n+1)}{2^{n+2}}(z-2)^n,\ R=2$

## 题型 6 ｜在 $0<|z|<+\infty$ 内洛朗展开（例 4.7）

**题 1** $f(z)=\dfrac{\sin z}{z^3}$

> $\sin z=z-\dfrac{z^3}{3!}+\dfrac{z^5}{5!}-\cdots$
> $f=\dfrac{1}{z^2}-\dfrac{1}{6}+\dfrac{z^2}{120}-\cdots,\quad0<|z|<\infty$

**题 2** $f(z)=\dfrac{\mathrm{e}^z-1-z}{z^4}$

> $\mathrm{e}^z-1-z=\dfrac{z^2}{2!}+\dfrac{z^3}{3!}+\dfrac{z^4}{4!}+\cdots$
> $f=\dfrac{1}{2z^2}+\dfrac{1}{6z}+\dfrac{1}{24}+\dfrac{z}{120}+\cdots$

## 题型 7 ｜同一函数在不同圆环域展开（例 4.8）

**题 1** $f(z)=\dfrac{1}{(z-1)(z-3)}$ 在 $0<|z|<1$、$1<|z|<3$、$3<|z|<\infty$ 内展开。

> $f=\dfrac12\Big(\dfrac{1}{z-3}-\dfrac{1}{z-1}\Big)$
> $0<|z|<1$：$\dfrac12\displaystyle\sum_{n=0}^{\infty}\Big(1-\dfrac{1}{3^{n+1}}\Big)z^n$
> $1<|z|<3$：$-\dfrac12\displaystyle\sum_{n=0}^{\infty}\frac{z^n}{3^{n+1}}-\dfrac12\sum_{n=0}^{\infty}\frac{1}{z^{n+1}}$
> $3<|z|<\infty$：$\dfrac12\displaystyle\sum_{n=0}^{\infty}\frac{3^n-1}{z^{n+1}}$

**题 2** $f(z)=\dfrac{1}{z(z-2)}$ 在 $0<|z|<2$、$2<|z|<\infty$ 内展开。

> $f=\dfrac12\Big(\dfrac{1}{z-2}-\dfrac1z\Big)$
> $0<|z|<2$：$-\dfrac{1}{2z}-\displaystyle\sum_{n=0}^{\infty}\frac{z^n}{2^{n+2}}$
> $2<|z|<\infty$：$-\dfrac{1}{2z}+\displaystyle\sum_{n=0}^{\infty}\frac{2^{n-1}}{z^{n+1}}$

## 题型 8 ｜以奇点为中心的洛朗展开（例 4.9）

**题 1** $f(z)=\dfrac{1}{z(z-1)^2}$ 在 $0<|z-1|<1$ 内展开。

> 令 $w=z-1$：$f=\dfrac{1}{w^2}\cdot\dfrac{1}{1+w}=\dfrac{1}{w^2}\displaystyle\sum(-1)^nw^n$
> $=\dfrac{1}{(z-1)^2}-\dfrac{1}{z-1}+1-(z-1)+(z-1)^2-\cdots$

**题 2** 同上函数在 $1<|z-1|<\infty$ 内展开。

> $\dfrac{1}{1+w}=\dfrac1w\cdot\dfrac{1}{1+\frac1w}=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^n}{w^{n+1}}$
> $f=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^n}{(z-1)^{n+3}}=-\dfrac{1}{(z-1)^3}+\dfrac{1}{(z-1)^4}-\cdots$

