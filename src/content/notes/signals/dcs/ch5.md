---
title: "第5章 组合逻辑电路的分析与设计"
slug: "signals/dcs/ch5"
description: "题5.1图(a) 题5.1图(b)"
publishDate: "2026-09-29"
createdAt: "2026-09-29T00:00:00Z"
updatedDate: "2026-10-20T15:49:34"
tags: ["signals"]
series: ["Signals","数字电路与系统"]
---

## 5.1 分析题 5.1 图所示电路，写出真值表和逻辑函数表达式。

![题5.1图(a)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/a9a92e4f00b78366101302780801bb6b.svg) ![题5.1图(b)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/2f47002d78b5d51a5fadeacc2b3d8866.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(a) 与非门输出 $N=\overline{AB}$，上下两个与门再进或门：

　$Y = A\overline{AB} + B\overline{AB} = (A+B)\overline{AB} = A\oplus B$

(b) $A$ 先取反，再与 $B$ 异或：

　$Y = \bar{A}\oplus B = AB + \bar{A}\bar{B}$

| $A$ | $B$ | $Y_{(a)}$ | $Y_{(b)}$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

(a) 异或；(b) 同或。

</details>

## 5.2 分析题 5.2 图所示电路的逻辑功能，写出逻辑函数表达式和真值表。

![题5.2图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/41ed595db07572388c3c36b039d47470.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$N_1=\overline{A\bar B}$，$N_2=\bar{\bar B}=B$，$N_3=\bar C$

$Y=\overline{N_1(N_2+N_3)} = A\bar B + \overline{B+\bar C} = A\bar B + \bar B C = \bar B(A+C)$

| $A$ | $B$ | $C$ | $Y$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

$Y=\sum m(1,4,5)$：$B=0$ 且（$A=1$ 或 $C=1$）时为 1。

</details>

## 5.3 写出题 5.3 图所示两个电路的逻辑表达式和真值表。

![题5.3图(a)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/04da79150109322bf0209c067018b2ed.svg) ![题5.3图(b)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/ea2a1b7a9ae5faf83613d8155cd33257.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(a) $Y_1=\overline{A\bar B}=\bar A+B$，$Y_2=\overline{\overline{AC}+\overline{\bar B+\bar C}}=AC(\bar B+\bar C)=A\bar BC$，$Y_3=\overline{\bar B+\bar C}=BC$

| $A$ | $B$ | $C$ | $Y_1$ | $Y_2$ | $Y_3$ |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 1 |

(b) 三输入与非、三输入或，再进与非：

　$Y=\overline{\bar A\bar BC\cdot(\bar A+\bar B+C)}=\bar A\bar BC+AB\bar C=\sum m(1,6)$

| $A$ | $B$ | $C$ | $Y$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 0 |

</details>

## 5.4 用真值表、卡诺图和逻辑图（与或）表示逻辑函数 $L = A\bar{B} + B\bar{C} + C\bar{A}$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$L=\sum m(1,2,3,4,5,6)$，卡诺图上 $m_0$、$m_7$ 为 0，其余为 1。

| $A$ | $B$ | $C$ | $L$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 0 |

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 1 | 1 |
| **1** | 1 | 1 | 0 | 1 |

圈法：$A\bar B$（$m_4,m_5$）、$B\bar C$（$m_2,m_6$）、$C\bar A$（$m_1,m_3$）——3 个二格圈恰好覆盖 6 个 1 格，原式已是最简与或式。

逻辑图：3 个二输入与门（$A\bar B$、$B\bar C$、$C\bar A$）接 1 个三输入或门。

</details>

## 5.5 分析题 5.5 图所示组合逻辑电路，写出与或逻辑表达式，列出其真值表。

![题5.5图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/69d32f20952856ca1a70b4e2b64abafe.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$G_1=ABC$，$G_2=A\oplus B\oplus C$，$G_3=AB$，$G_4=G_2G_3$

$F_2=G_4=AB(A\oplus B\oplus C)$。因 $AB=1$ 时 $A\oplus B\oplus C=C$，故

　$F_2=ABC$

$F_1=G_1\oplus G_4=ABC\oplus ABC=0$

| $A$ | $B$ | $C$ | $F_1$ | $F_2$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 |

$F_2=ABC$；$F_1$ 与 $F_2$ 恒等，故 $F_1\equiv 0$（电路冗余）。

</details>

## 5.6 逻辑电路如题 5.6 图所示，写出其逻辑表达式和真值表。

![题5.6图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/599c1ccdfcfc6cf9148965885646f7ef.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$P_1=ABC$

$P_2=\overline{A+P_1}=\overline{A+ABC}=\bar A$（因 $A+ABC=A$）

$P_3=\overline{C+P_1}=\bar C$

$F=\overline{P_1P_2P_3}=\overline{ABC\cdot\bar A\cdot\bar C}=1$

| $A$ | $B$ | $C$ | $P_1$ | $P_2$ | $P_3$ | $F$ |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 1 | 1 | 1 |
| 0 | 0 | 1 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 0 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 1 |

$F\equiv 1$：$P_2$、$P_3$ 已把 $P_1$ 的取值全部屏蔽，电路恒输出高电平。

</details>

## 5.7 试分析题 5.7 图所示的逻辑电路，写出逻辑表达式和真值表。

![题5.7图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/b2269fca224257e63d760a5c1c14458a.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$L=A\oplus B$

$F_1=\overline{C\oplus L}=\overline{A\oplus B\oplus C}$（偶校验）

$F_2=\overline{\overline{CL}\cdot\overline{AB}}=CL+AB=C(A\oplus B)+AB$

| $A$ | $B$ | $C$ | $F_1$ | $F_2$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 1 |

$F_1=\sum m(0,3,5,6)$；$F_2=\sum m(3,5,6,7)$。

</details>

## 5.8 试分析题 5.8 图所示的逻辑电路，写出逻辑表达式和真值表。

![题5.8图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/8d9ecb844495712119443ff7f413173f.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$G_1=A\oplus B$，$G_2=G_1C=C(A\oplus B)$，$F=D\oplus G_2$

　$F=D\oplus C(A\oplus B)$

$C(A\oplus B)=\sum m(6,7,10,11)$，与 $D$ 异或后

　$F=\sum m(1,3,5,6,9,10,13,15)$

即 $D=1$ 而 $C(A\oplus B)=0$，或 $D=0$ 而 $C(A\oplus B)=1$ 时 $F=1$。

</details>

## 5.9 写出题 5.9 图所示电路的逻辑表达式和真值表。

![题5.9图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/a55e60cf065b46140f7a33ef5c9fb869.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$G_1=ABC$，$G_2=\bar B$，$G_3=\bar C$，$Y=ABC+(\bar B+\bar C)$

　$Y=ABC+\overline{BC}=A+\bar B+\bar C$

| $A$ | $B$ | $C$ | $Y$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

仅 $A=0,B=C=1$ 时 $Y=0$，即 $Y=\sum m(0,1,2,4,5,6,7)$。

</details>

## 5.10 A、B 是两个 1 位的二进制数，设计比较 A、B 大小或者相等的逻辑电路。写出真值表和逻辑表达式，并画出逻辑图。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

| $A$ | $B$ | $Y_{A>B}$ | $Y_{A=B}$ | $Y_{A<B}$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 |

$Y_{A>B}=A\bar B$，$Y_{A=B}=AB+\bar A\bar B=A\odot B$，$Y_{A<B}=\bar AB$

逻辑图：$A\bar B$、$\bar AB$ 各一个与门；$Y_{A=B}$ 用两个与门（$AB$、$\bar A\bar B$）接或门，或直接用一个同或门。

</details>

## 5.11 用与非门实现函数 F，写出真值表并画出逻辑图。

$F = \bar{A}BCD + AB\bar{C}D + A\bar{B}\bar{C}D + A\bar{B}\bar{C}\bar{D}$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$AB\bar CD+A\bar B\bar CD+A\bar B\bar C\bar D=A\bar B\bar C(D+\bar D)=A\bar B\bar C$

　$F=\bar ABCD+A\bar B\bar C=\sum m(7,8,9)$

真值表：仅 $ABCD=0111,1000,1001$ 时 $F=1$，其余为 0。

与非实现：

　$F=\overline{\overline{\bar ABCD}\cdot\overline{A\bar B\bar C}}$

$\bar A$、$\bar B$、$\bar C$ 各用一个与非门作反相器，加 2 个三/四输入与非门、1 个二输入与非门，共 6 个与非门。

</details>

## 5.12 用或非门实现函数 F，并画出逻辑图。

$F = A\bar{B}C\bar{D} + \bar{A}\bar{B}C\bar{D} + A\bar{B}\bar{C}D + \bar{A}\bar{B}\bar{C}D$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$A\bar BC\bar D+\bar A\bar BC\bar D=\bar BC\bar D$，$A\bar B\bar CD+\bar A\bar B\bar CD=\bar B\bar CD$

　$F=\bar BC\bar D+\bar B\bar CD=\bar B(C\oplus D)=\sum m(1,2,9,10)$

或非实现：$F=\bar B(C+D)(\bar C+\bar D)=\overline{B+\overline{C+D}+\overline{\bar C+\bar D}}$

其中 $\overline{C+D}$、$\overline{\bar C+\bar D}$ 为或非门输出，$\bar C$、$\bar D$ 各用一个或非门作反相器，共 5 个或非门。

</details>

## 5.13 写出题 5.13 图所示电路输出信号的逻辑表达式，并采用最少的与非门实现该函数。

![题5.13图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/c17405d3577fa275c3c2bdf840245e45.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$Y_1=\overline{A\bar B}$，$Y_2=\overline{A+C}$，$Y_3=\overline{Y_1Y_2}=A\bar B+A+C=A+C$

$Y_4=B\oplus\bar C$，$Y=\overline{Y_3+Y_4}$

　$Y=\overline{A+C+B\oplus\bar C}=\overline{A+C+\bar B}=\bar AB\bar C$

</details>
## 5.14 试分别用二输入与非门和或非门实现下列逻辑函数，写出相应的表达式，画出逻辑图。

(1) $Z_1 = A \cdot \bar{B}$
(2) $Z_2 = A + B$
(3) $Z_3 = A \oplus B$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

**(1) $Z_1=A\bar B$**

　与非：$Z_1=\overline{\overline{A\bar B}}$，$\bar B=\overline{BB}$ → 3 个

　或非：$Z_1=\overline{\bar A+B}$，$\bar A=\overline{A+A}$ → 2 个

**(2) $Z_2=A+B$**

　与非：$Z_2=\overline{\bar A\bar B}$，$\bar A,\bar B$ 各一 → 3 个

　或非：$Z_2=\overline{\overline{A+B}}$ → 2 个

**(3) $Z_3=A\oplus B$**

　与非：$n_1=\overline{AB}$，$n_2=\overline{An_1}$，$n_3=\overline{Bn_1}$，$Z_3=\overline{n_2n_3}$ → 4 个

　或非：$n_1=\overline{A+B}$，$n_2=\overline{An_1}=\bar AB$，$n_3=\overline{Bn_1}=A\bar B$，$n_4=\overline{n_2+n_3}=A\odot B$，再取反 → 5 个

</details>

## 5.15 逻辑函数的最小项表达式为 $F = \sum m(2,4,8,10,11,12,14)$，完成下列设计：

(1) 采用与或非门实现；
(2) 采用与非门实现。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 0 | 0 | 1 |
| **01** | 1 | 0 | 0 | 0 |
| **11** | 1 | 0 | 0 | 1 |
| **10** | 1 | 0 | 1 | 1 |

最简与或式：$F=A\bar D+AB\bar C+B\bar D\bar C+\bar BC\bar D$

（4 格圈 $A\bar D$：$m_{8,10,12,14}$；2 格圈 $AB\bar C$：$m_{10,11}$；2 格圈 $B\bar D\bar C$：$m_{4,12}$；2 格圈 $\bar BC\bar D$：$m_{2,10}$）

**(1)** 与或非门一次实现（4 个与项，$\bar B$、$\bar C$、$\bar D$ 需反相）：

　$F=\overline{A\bar D+AB\bar C+B\bar D\bar C+\bar BC\bar D}$

**(2)** 与非门：

　$F=\overline{\overline{A\bar D}\cdot\overline{AB\bar C}\cdot\overline{B\bar D\bar C}\cdot\overline{\bar BC\bar D}}$

4 个二/三输入与非门 + 1 个四输入与非门 + 3 个反相器（$\bar B,\bar C,\bar D$）。

</details>

## 5.16 设计逻辑电路实现：两个 2 位二进制数相等时输出为 1，不等时输出 0。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

设两数为 $X=x_1x_0$、$Y=y_1y_0$，逐位比较后相与：

　$Z=(x_1\odot y_1)(x_0\odot y_0)=(x_1y_1+\bar x_1\bar y_1)(x_0y_0+\bar x_0\bar y_0)$

展开即 $Z=\sum m$（四位相同时为 1）：$x_1y_1x_0y_0+\bar x_1\bar y_1x_0y_0+x_1y_1\bar x_0\bar y_0+\bar x_1\bar y_1\bar x_0\bar y_0$。

逻辑图：2 个同或门（或 4 个与门 + 2 个或门）接 1 个与门。

</details>

## 5.17 设计一个代码转换电路，输入为 4 位循环码，输出为 4 位二进制代码。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

设循环码 $G_3G_2G_1G_0$，二进制码 $B_3B_2B_1B_0$，最高位相同，其余逐级异或：

　$B_3=G_3$

　$B_2=B_3\oplus G_2=G_3\oplus G_2$

　$B_1=B_2\oplus G_1=G_3\oplus G_2\oplus G_1$

　$B_0=B_1\oplus G_0=G_3\oplus G_2\oplus G_1\oplus G_0$

逻辑图：3 个异或门级联（$G_3$ 直接输出 $B_3$）。

</details>

## 5.18 用与非门设计判奇电路：3 个输入有奇数个 1 时输出 1，否则输出 0。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

　$F=A\oplus B\oplus C=\sum m(1,2,4,7)=\bar A\bar BC+\bar AB\bar C+A\bar B\bar C+ABC$

与非实现（两个异或级联）：

　$n_1=\overline{AB}$，$n_2=\overline{An_1}$，$n_3=\overline{Bn_1}$，$X=\overline{n_2n_3}=A\oplus B$

　$n_4=\overline{XC}$，$n_5=\overline{Xn_4}$，$n_6=\overline{Cn_4}$，$F=\overline{n_5n_6}$

共 8 个二输入与非门。

</details>

## 5.19 设计判断 4 位二进制数 $A_3A_2A_1A_0$ 大于十的逻辑电路，当其大于等于十时，输出 1，否则输出 0。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$\ge 10$ 的取值为 $1010\sim1111$：

- $A_3A_2=11$：$12\sim15$，全部满足
- $A_3A_2A_1=101$：$10,11$

  　$F=A_3A_2+A_3\bar A_2A_1=A_3(A_2+A_1)$

  注意 $A_0$ 不参与（$1001=9$ 不满足，$1010=10$ 已由 $A_3A_1$ 覆盖）。

  逻辑图：2 个与门 + 1 个或门（或 1 个与门 + 1 个或门 + 1 个与门）。

</details>

## 5.20 设计 1 位二进制全减器逻辑电路，写出真值表、卡诺图以及逻辑表达式，画出逻辑图。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

| $A$ | $B$ | $BI$ | $D$ | $BO$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

卡诺图（$D$）：

| $A\backslash B\,BI$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 0 | 1 |
| **1** | 1 | 0 | 1 | 0 |

卡诺图（$BO$）：

| $A\backslash B\,BI$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 1 | 1 |
| **1** | 0 | 0 | 1 | 0 |

　$D=A\oplus B\oplus BI=\sum m(1,2,4,7)$

　$BO=\bar AB+\bar A\,BI+B\,BI=\sum m(1,2,3,7)$

逻辑图：$D$ 用 2 个异或门；$BO$ 用 3 个与门 + 1 个或门。

</details>

## 5.21 设计一个多功能逻辑电路，以电路有两个数据输入端 A 和 B，两个控制端 $C_1$ 和 $C_2$，一个输出端 $Y$。其功能要求为：当 $C_1C_2=00$ 时，$Y=1$；当 $C_1C_2=01$ 时，$Y=B$；当 $C_1C_2=10$ 时，$Y=A+\bar{B}$；当 $C_1C_2=11$ 时，$Y=A$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

按四种控制状态写与或式：

　$Y=\bar C_1\bar C_2\cdot 1+\bar C_1C_2B+C_1\bar C_2(A+\bar B)+C_1C_2A$

| $C_1$ | $C_2$ | $Y$ |
| --- | --- | --- |
| 0 | 0 | 1 |
| 0 | 1 | $B$ |
| 1 | 0 | $A+\bar B$ |
| 1 | 1 | $A$ |
化简得
　$Y=\bar C_1\bar C_2+\bar C_1B+\bar C_2\bar B+C_1A$　

</details>

## 5.22 用与非门设计报警逻辑电路：设备中有四个传感器 A、B、C、D，如果传感器 A 输出为 1，同时 B、C、D 个中至少有两个输出也为 1，表示设备工作状态正常，否则工作异常，发出报警。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

正常条件：$N=A(BC+BD+CD)$，报警取反：

　$F=\overline{A(BC+BD+CD)}=\bar A+\bar B\bar C+\bar B\bar D+\bar C\bar D$

与非实现（1 个三输入 + 4 个二输入，共 5 个与非门）：

　$n_1=\overline{BC}$，$n_2=\overline{BD}$，$n_3=\overline{CD}$，$M=\overline{n_1n_2n_3}$（$B,C,D$ 多数）

　$F=\overline{A\cdot M}$

</details>

## 5.23 题 5.23 图所示为一用水容器示意图，图中阴影表示水，A、B、C 电极被水浸没时会有高电平信号输出，试用与非门构成的电路来实现下述控制逻辑：水面在 A、B 间，为正常状态，亮绿灯 G；水面在 B、C 间或在 A 以上为警戒状态，点亮黄灯 Y；水面在 C 以下为缺水状态，点亮红灯 R。

![题5.23图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/aac5a7abf830b4a61c511fe35c93429a.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

A 最高、C 最低，被浸没输出 1：

| 水位 | $A$ | $B$ | $C$ | $G$ | $Y$ | $R$ |
| --- | --- | --- | --- | --- | --- | --- |
| A 以上 | 1 | 1 | 1 | 0 | 1 | 0 |
| A、B 间 | 0 | 1 | 1 | 1 | 0 | 0 |
| B、C 间 | 0 | 0 | 1 | 0 | 1 | 0 |
| C 以下 | 0 | 0 | 0 | 0 | 0 | 1 |

　$G=\bar ABC$，$Y=\bar A\bar BC+ABC=C(A\odot B)$，$R=\bar A\bar B\bar C$

与非实现（$\bar A,\bar B,\bar C$ 三个反相器共用，共 8 个与非门）：

　$G=\overline{\bar A\cdot B\cdot C}$

　$Y=\overline{\overline{\bar A\bar BC}\cdot\overline{ABC}}$

　$R=\overline{\bar A\cdot\bar B\cdot\bar C}$

</details>

## 5.24 设计一判断人类输血和受血是否匹配的电路。人类有四种基本血型 A、B、O、AB，输血和受血的规则是：A 型血可以输给 A 型血和 AB 型血的病人，B 型血可以输给 B 型血和 AB 型血的病人，O 型血可以输给所有血型病人，AB 型血只能输给 AB 型血的病人。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

编码：A=00，B=01，AB=10，O=11；供血者 $D_1D_0$，受血者 $R_1R_0$。

| 供 \ 受 | A(00) | B(01) | AB(10) | O(11) |
| --- | --- | --- | --- | --- |
| **A(00)** | 1 | 0 | 1 | 0 |
| **B(01)** | 0 | 1 | 1 | 0 |
| **AB(10)** | 0 | 0 | 1 | 0 |
| **O(11)** | 1 | 1 | 1 | 1 |

　$F=D_1D_0+\bar D_1\bar D_0\bar R_0+\bar D_1D_0(R_1\oplus R_0)+D_1\bar D_0R_1\bar R_0$

四项依次为：O 型供血、A 型供血（受者 $R_0=0$）、B 型供血（受者 $R_1\oplus R_0$）、AB 型供血。

</details>

## 5.25 判别逻辑函数 $Y = A\bar{B} + \bar{A} C+ B\bar{C}$ 是否存在冒险现象。如果存在冒险，是哪种冒险？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$Y=\sum m(1,2,3,4,5,6)$，三个圈 $A\bar B$、$\bar AC$、$B\bar C$ 两两相邻但互不相交：

- $m_1,m_5$：$B=0,C=1$，$A$ 变化（$\bar AC$ 与 $A\bar B$）
- $m_2,m_3$：$A=0,B=1$，$C$ 变化（$B\bar C$ 与 $\bar AC$）
- $m_4,m_6$：$A=1,C=0$，$B$ 变化（$A\bar B$ 与 $B\bar C$）

  存在**静态 1 冒险（逻辑冒险）**，上述三种情况下输出本应保持 1，可能出现 0 尖峰。

  消除：补冗余项 $B\bar C$、$\bar AB$、$A\bar C$，即

  　$Y=A\bar B+\bar AC+B\bar C+\bar BC+\bar AB+A\bar C$

</details>

## 5.26 判别题 5.26 图所示组合逻辑电路是否存在冒险现象，在什么情况下会产生冒险。

![题5.26图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/ef6fb6e99078338458c16935839874c6.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

$Y=(A+B)(\bar B+C)=A\bar B+AC+BC=\sum m(3,4,5,7)$

该电路为或与（两级）结构，$Y=0$ 的格为 $m_0,m_1,m_2,m_6$：$(A+B)$ 覆盖 $m_0,m_1$，$(\bar B+C)$ 覆盖 $m_2,m_6$，而 $m_0$ 与 $m_2$ 相邻且分属两个或项。

存在**静态 0 冒险（逻辑冒险）**：$A=0$、$C=0$，$B$ 变化时输出本应保持 0，可能出现 1 尖峰。

消除：加冗余或项 $(A+C)$

　$Y=(A+B)(\bar B+C)(A+C)$

</details>

## 5.27 试分析逻辑函数 $Y = \bar{A}\bar{B}D + B\bar{D} + \bar{A}B\bar{C} + A\bar{B}\bar{C}$，当输入变量 A、B、C、D 分别发生 0110→1100，1111→1010，0011→0110 变化时，是否存在功能冒险。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

先求真值表（$ABCD$）：

| $ABCD$ | $Y$ | $ABCD$ | $Y$ |
| --- | --- | --- | --- |
| 0000 | 0 | 1000 | 1 |
| 0001 | 1 | 1001 | 1 |
| 0010 | 0 | 1010 | 0 |
| 0011 | 1 | 1011 | 0 |
| 0100 | 1 | 1100 | 1 |
| 0101 | 1 | 1101 | 0 |
| 0110 | 1 | 1110 | 1 |
| 0111 | 0 | 1111 | 0 |

功能冒险看两端取值相同时、过渡区是否出现反值：

- **0110→1100**（$A$、$C$ 变）：过渡态 $0100$、$1110$ 均为 1 → **无功能冒险**
- **1111→1010**（$B$、$D$ 变）：两端为 0，过渡态 $1110=1$ → **有功能冒险**
- **0011→0110**（$B$、$D$ 变）：两端为 1，过渡态 $0010=0$、$0111=0$ → **有功能冒险**

</details>

## 5.28 分析题 5.28 图所示电路，指出电路什么情况下会发生逻辑冒险，用改变逻辑设计的方式消除冒险。

![题5.28图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/c2e8e39f9caaede4222b551cf1e9aca5.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

上、下两个与门为 $AB$ 与 $\bar AB$，或门输出：

　$Y=AB+\bar AB=B$

当 $B=1$、$A$ 变化时，$AB$ 与 $\bar AB$ 交替为 1，两路延迟不同，或门输入会出现瞬时全 0 → 输出 0 尖峰，属**静态 1 冒险**。

消除：该式已可化简为 $Y=B$，直接删去冗余电路，令 $Y=B$（或在或门前补冗余项 $B$）。

</details>

## 5.29 已知 $Y(A,B,C,D) = \sum m(0,3,7,8,9,10,11,12,13) + \sum d(1,2,4)$，求 Y 的无逻辑冒险的与或式。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | × | 1 | × |
| **01** | × | 0 | 1 | 0 |
| **11** | 1 | 1 | 0 | 0 |
| **10** | 1 | 1 | 1 | 1 |

最简与或式（借 $d$）：$Y=\bar B\bar C+\bar ACD+A\bar B+A\bar C$

检查相邻 1 格：$m_3$ 与 $m_{11}$ 分属 $\bar ACD$、$A\bar B$ 两圈且不相交（$B=0,C=D=1$ 时 $A$ 变化）→ 静态 1 冒险。

补冗余项 $\bar BCD$：

　$Y=\bar B\bar C+\bar ACD+A\bar B+A\bar C+\bar BCD$

此时 $m_{0,8}$ 由 $\bar B\bar C$ 共圈，$m_{3,7}$ 由 $\bar ACD$，$m_{3,11}$ 由 $\bar BCD$，$m_{8,9,10,11}$ 由 $A\bar B$，$m_{8,9,12,13}$ 由 $A\bar C$，任意相邻 1 格都有公共圈，无逻辑冒险。

</details>

## 5.30 某一组合电路如题 5.30 图所示，输入变量 $(A,B,D)$ 的取值不可能发生 $(0,1,0)$ 的输入组合。分析它的竞争冒险现象，如果存在逻辑冒险，则通过修改电路来消除冒险。

![题5.30图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/4d5471f31ab7f3ebc1cf21005e83ca48.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

三个与非门输出 $\overline{\bar A\bar B\bar D}$、$\overline{B\bar C\bar D}$、$\overline{AD}$，再经末级与非门：

　$F=\bar A\bar B\bar D+B\bar C\bar D+AD=\sum m(0,2,4,9,11,12,13,15)$

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 0 | 0 | 1 |
| **01** | 1 | 0 | 0 | 0 |
| **11** | 1 | 1 | 1 | 0 |
| **10** | 0 | 1 | 1 | 0 |

竞争冒险：

- $m_{12}(1100)$ 与 $m_{13}(1101)$ 相邻，分属 $B\bar C\bar D$、$AD$ 两圈 → $A=B=1$、$C=0$ 且 $D$ 变化时产生**静态 1 冒险（逻辑冒险）**
- $m_0$ 与 $m_4$ 虽相邻，但 $m_4$ 对应 $(A,B,D)=(0,1,0)$，为不可能出现的输入组合，不产生实际冒险

  消除：补冗余项 $AB\bar C$

  　$F=\bar A\bar B\bar D+B\bar C\bar D+AD+AB\bar C$

</details>

