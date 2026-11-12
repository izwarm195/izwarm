---
title: "第七章 解析函数在科技中的应用选讲 核心题型"
slug: "complex/core-problems/ch7"
description: "题 1 复势 f(z) (2+ mathrm{i})z 。"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem"]
series: ["Complex","复变函数核心题型汇总"]
---

# 第七章 解析函数在科技中的应用 核心题型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 每型 2 题，仿教材例 7.1 – 例 7.10；答案只留关键式
> - 复势 $f=\varphi+\mathrm{i}\psi$：$v=\overline{f'(z)}$；流线 $\psi=c$，等势线 $\varphi=c$；电场 $E=-\mathrm{i}f'(z)$
> - 对数留数 $\dfrac{1}{2\pi\mathrm{i}}\oint_C\dfrac{f'}{f}\mathrm{d}z=N-P$

## 题型 1 ｜由复势求速度、流线、等势线（例 7.1、例 7.2）

**题 1** 复势 $f(z)=(2+\mathrm{i})z$。

> $f=(2x-y)+\mathrm{i}(x+2y)$
> $v=\overline{f'}=2-\mathrm{i}$，$|v|=\sqrt5$，方向 $-\arctan\dfrac12$
> 流线 $x+2y=c_1$，等势线 $2x-y=c_2$

**题 2** 复势 $f(z)=z+\dfrac1z$（圆柱绕流）。

> $\varphi=x+\dfrac{x}{x^2+y^2},\quad\psi=y-\dfrac{y}{x^2+y^2}$
> 流线 $y\Big(1-\dfrac{1}{r^2}\Big)=c$（$|z|=1$ 即 $c=0$ 为流线）
> $v=\overline{f'}=\overline{1-\dfrac{1}{z^2}}$

## 题型 2 ｜源、汇与偶极子的复势（例 7.3、例 7.4）

**题 1** 源点在 $z=1$，强度 $N=4\pi$，求复势、速度、流线、等势线。

> $f(z)=\dfrac{N}{2\pi}\mathrm{Ln}(z-1)=2\mathrm{Ln}(z-1)$
> $v=\overline{f'}=\dfrac{2}{\bar z-1}$；流线 $\arg(z-1)=c$（射线），等势线 $|z-1|=c$（圆）

**题 2** 复势 $f(z)=\mathrm{Ln}\dfrac{z-1}{z+1}$（源 + 汇）。

> $\varphi=\ln\left|\dfrac{z-1}{z+1}\right|,\quad\psi=\arg\dfrac{z-1}{z+1}$
> 流线：过 $\pm1$ 的圆弧族；等势线：Apollonius 圆族
> $v=\overline{f'}=\overline{\dfrac{2}{z^2-1}}$

## 题型 3 ｜电场的复势与力线、等位线（例 7.5）

**题 1** 复势 $f(z)=\mathrm{Ln}z$。

> $\varphi=\ln|z|,\ \psi=\arg z$；$E=-\mathrm{i}f'=-\dfrac{\mathrm{i}}{z}$
> 等位线 $|z|=c$（圆），电力线 $\arg z=c$（射线）→ 带电直线的场

**题 2** 复势 $f(z)=\dfrac1z$（电偶极子）。

> $\varphi=\dfrac{x}{x^2+y^2},\quad\psi=-\dfrac{y}{x^2+y^2}$
> 等位线：$\Big(x-\dfrac{1}{2c}\Big)^2+y^2=\dfrac{1}{4c^2}$（心在实轴的圆族）
> 电力线：$x^2+\Big(y+\dfrac{1}{2c}\Big)^2=\dfrac{1}{4c^2}$（心在虚轴的圆族），两族正交

## 题型 4 ｜对数留数（例 7.6）

**题 1** 求 $f(z)=\dfrac{(z-1)^2(z+2)}{z^2+4}$ 关于 $|z|=3$ 的对数留数。

> 零点：$1$（二级，计 $2$）、$-2$（一级）→ $N=3$；极点：$\pm2\mathrm{i}$（各一级）→ $P=2$
> $N-P=1$

**题 2** 求 $f(z)=\dfrac{z^2+1}{z(z-2)^3}$ 关于 $|z|=4$ 的对数留数。

> 零点 $\pm\mathrm{i}$：$N=2$；极点 $0$（一级）、$2$（三级）：$P=1+3=4$
> $N-P=-2$

## 题型 5 ｜辐角原理判零点所在半平面（例 7.7）

**题 1** 用辐角原理验证 $P(z)=z^2+2z+2$ 的零点全在左半平面。

> $P(\mathrm{i}y)=(2-y^2)+2y\mathrm{i}$，轨迹 $u=2-\dfrac{v^2}{4}$
> $\Delta\arg P(\mathrm{i}y)=2\pi=n\pi$ → 全在 $\operatorname{Re}z<0$（实为 $-1\pm\mathrm{i}$）

**题 2** 判断 $P(z)=z^3+z^2+1$ 的零点是否全在左半平面。

> $P(\mathrm{i}y)=(1-y^2)-y^3\mathrm{i}$
> $\Delta\arg P(\mathrm{i}y)=-\pi\neq n\pi=3\pi$ → 有零点在右半平面

## 题型 6 ｜Rouché 定理证根的个数（例 7.8）

**题 1** 证 $z^4-6z+3=0$ 恰有 4 个根。

> $|z|=2$：$|z^4|=16>|-6z+3|\leqslant15$ → 内 4 根
> $|z|>2$：$|z|^4>6|z|+3$ → 外无根

**题 2** 证 $z^5+3z^2+1=0$ 恰有 5 个根。

> $|z|=2$：$|z^5|=32>|3z^2+1|\leqslant13$ → 内 5 根
> $|z|>2$：$|z|^5>3|z|^2+1$ → 外无根

## 题型 7 ｜Rouché 定理判单位圆内根数（例 7.9）

**题 1** 求 $z^4+5z^3+1=0$ 在 $|z|<1$ 内的根数。

> $|z|=1$：$|5z^3|=5>|z^4+1|\leqslant2$
> 与 $5z^3$ 同零点数 → $3$ 个

**题 2** 求 $z^8-4z^5+z+1=0$ 在 $|z|<1$ 内的根数。

> $|z|=1$：$|4z^5|=4>|z^8+z+1|\leqslant3$
> → $5$ 个

## 题型 8 ｜Rouché 定理判圆环域内根分布（例 7.10）

**题 1** 证 $z^4+3z+5=0$ 的根全在 $1<|z|<2$ 内。

> $|z|=1$：$5>|z^4+3z|\leqslant4$ → 内 0 根；且 $|z^4+3z+5|\geqslant5-4>0$ 无根
> $|z|=2$：$|z^4|=16>|3z+5|\leqslant11$ → 内 4 根
> → 4 根全在 $1<|z|<2$

**题 2** 证 $z^5+2z^2+6=0$ 的根全在 $1<|z|<2$ 内。

> $|z|=1$：$6>|z^5+2z^2|\leqslant3$ → 内 0 根
> $|z|=2$：$|z^5|=32>|2z^2+6|\leqslant14$ → 内 5 根
> → 5 根全在 $1<|z|<2$

