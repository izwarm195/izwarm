---
title: "第3章 逻辑函数及其简化"
slug: "signals/dcs/ch3"
description: "(1) 有3个输入信号 A、B、C，当3个输入信号中不多于一个输入为1时，输出信号 Y 为1，其余情况下，输出 Y 为0；"
publishDate: "2026-09-10"
createdAt: "2026-09-10T00:00:00Z"
updatedDate: "2026-10-08T12:29:07"
tags: ["signals"]
series: ["Signals","数字电路与系统"]
---

## 3.1 写出下述逻辑问题的真值表，并写出逻辑表达式。

(1) 有3个输入信号 A、B、C，当3个输入信号中不多于一个输入为1时，输出信号 Y 为1，其余情况下，输出 Y 为0；
(2) 有3个输入信号 A、B、C，当3个输入信号中有偶数个输入为1时，输出 F 为1，其余情况下，输出 F 为0。

<details class="answer">
<summary>答案</summary>

(1) 不多于一个输入为 1 时 $Y=1$：

| $A$ | $B$ | $C$ | $Y$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

$Y = \bar{A}\bar{B} + \bar{A}\bar{C} + \bar{B}\bar{C} = \sum m(0,1,2,4)$

(2) 偶数个输入为 1 时 $F=1$：

| $A$ | $B$ | $C$ | $F$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 0 |

$F = \bar{A}\bar{B}\bar{C} + \bar{A}BC + A\bar{B}C + AB\bar{C} = \sum m(0,3,5,6)$

</details>

## 3.2 根据下列文字叙述建立真值表。

(1) 设有3变量逻辑函数 $F=f(A,B,C)$，当 A、B、C 中有奇数个1时，$F=1$，否则 $F=0$。
(2) 设有两个二进制数 $X=x_1x_2$ 和 $Y=y_1y_2$，若 $X>Y$，则 $F_1=1$；若 $X=Y$，则 $F_2=1$；若 $X<Y$，则 $F_3=1$。
(3) 1位二进制减法电路，其输入为被减数 A、减数 B 和低位的借位 BI，输出为差 $\Delta$ 和向高位的借位 BO。

<details class="answer">
<summary>答案</summary>

(1) 奇数个 1 时 $F=1$：

| $A$ | $B$ | $C$ | $F$ |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

$F = \bar{A}\bar{B}C + \bar{A}B\bar{C} + A\bar{B}\bar{C} + ABC = \sum m(1,2,4,7)$

(2) 数值比较，$X=x_1x_2$、$Y=y_1y_2$（$x_1$、$y_1$ 为高位）：

| $x_1$ | $x_2$ | $y_1$ | $y_2$ | $F_1$ | $F_2$ | $F_3$ |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 1 | 0 | 0 | 1 |
| 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 1 | 0 |

$F_1 = \sum m(4,8,9,12,13,14)$，$F_2 = \sum m(0,5,10,15)$，$F_3 = \sum m(1,2,3,6,7,11)$

(3) 1 位二进制全减器（$BI$ 低位借位，$BO$ 向高位借位）：

| $A$ | $B$ | $BI$ | $\Delta$ | $BO$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

$\Delta = A \oplus B \oplus BI$，$BO = \bar{A}B + \bar{A}BI + B\,BI$

</details>

## 3.3 列举 2 个与逻辑的实例，并写出真值表。

<details class="answer">
<summary>答案</summary>

例 1：保险柜的两把钥匙串联，两把都转动（$A=1$ 且 $B=1$）锁才打开（$Y=1$）。
例 2：设备启动要求“电源接通”与“急停未按下”同时成立。

| $A$ | $B$ | $Y=A\cdot B$ |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

$Y = A \cdot B$：有 0 出 0，全 1 才出 1。

</details>

## 3.4 列举 2 个或逻辑的实例，并写出真值表。

<details class="answer">
<summary>答案</summary>

例 1：前门与后门各有一个按钮，任一个按下（$A=1$ 或 $B=1$）门铃都响（$Y=1$）。
例 2：门禁的刷卡与密码，任一种验证通过即可开门。

| $A$ | $B$ | $Y=A+B$ |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

$Y = A + B$：有 1 出 1，全 0 才出 0。

</details>

## 3.5 列举 2 个非逻辑的实例，并写出真值表。

<details class="answer">
<summary>答案</summary>

例 1：同一开关的两个状态——开关接通时灯灭、断开时灯亮（继电器常闭触点）。
例 2：三极管反相器，输入高电平则输出低电平。

| $A$ | $Y=\bar{A}$ |
| --- | --- |
| 0 | 1 |
| 1 | 0 |

</details>

## 3.6 用原变量表示常开开关，反变量表示常闭开关，Y 表示网络接通，画出与下列表达式对应的开关电路。

(1) $Y = A + BC$
(2) $Y = A + B\bar{C}$
(3) $Y = A + \overline{BC}$
(4) $Y = \overline{A + BC}$
(5) $Y = (A + BC)[D + B(A + \bar{C})]$
(6) $Y = (\overline{A + BC})[D + B(A + \bar{C})]$

<details class="answer">
<summary>答案</summary>

约定：原变量用常开开关，反变量用常闭开关；乘表示串联，加表示并联。

(1) $Y = A + BC$：$A$ 与「$B$ 串 $C$」两条支路并联。
(2) $Y = A + B\bar{C}$：$A$ 与「$B$ 串 $\bar{C}$」并联。
(3) $Y = A + \overline{BC} = A + \bar{B} + \bar{C}$：$A$、$\bar{B}$、$\bar{C}$ 三条支路并联。
(4) $Y = \overline{A + BC} = \bar{A}(\bar{B} + \bar{C})$：$\bar{A}$ 与「$\bar{B}$ 并 $\bar{C}$」串联。
(5) $Y = (A + BC)\,[D + B(A + \bar{C})]$：前括号是「$A$ 并（$B$ 串 $C$）」，后括号是「$D$ 并（$B$ 串（$A$ 并 $\bar{C}$））」，两部分再串联。
(6) $Y = \overline{A + BC}\,[D + B(A + \bar{C})]$：把 (5) 的前括号换成 (4) 的「$\bar{A}$ 串（$\bar{B}$ 并 $\bar{C}$）」，再与同一后括号串联。

</details>

## 3.7 用列真值表的方法证明下列等式。

(1) $\overline{ABC} = \bar{A} + \bar{B} + \bar{C}$
(2) $\bar{A}B + A\bar{B} = (\bar{A} + \bar{B})(A + B)$
(3) $\overline{AB} + AC + BC = \overline{AB} + AC$
(4) $\bar{A}B + AC + BCD = \bar{A}B + AC$
(5) $\bar{AB + \bar{A}B = \bar{A}\cdot \bar{B}} + A\bar{B}$
(6) $\bar{ABC + \bar{A}BC + \bar{A}\bar{B}C}=\bar{A}\bar{B}\bar{C}+A\bar{B}\bar{C}+A\bar{B}C+\bar{A}B\bar{C}+AB\bar{C}$

<details class="answer">
<summary>答案</summary>

逐项列出左、右两式的真值表，两者逐行相同，故等式成立。

**(1) $\overline{ABC} = \bar{A} + \bar{B} + \bar{C}$**

| $A$ | $B$ | $C$ | 左式 | 右式 |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 1 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 |

**(2) $\bar{A}B + A\bar{B} = (\bar{A} + \bar{B})(A + B)$**

| $A$ | $B$ | 左式 | 右式 |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |

**(3) $\overline{AB} + AC + BC = \overline{AB} + AC$**

| $A$ | $B$ | $C$ | 左式 | 右式 |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 1 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

**(4) $\bar{A}B + AC + BCD = \bar{A}B + AC$**

| $A$ | $B$ | $C$ | $D$ | 左式 | 右式 |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 |

**(5)** 题干在 OCR 中已损：等号被吃进了上划线内（原文 `\overline{AB + \bar{A}B = \bar{A}\cdot \bar{B}} + A\bar{B}`）。按最合理的还原 $\overline{AB + \bar{A}\bar{B}} = \bar{A}B + A\bar{B}$ 作答——左边是「同或」取反即「异或」，与右边一致：

| $A$ | $B$ | 左式 | 右式 |
| --- | --- | --- | --- |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |

**(6) $\overline{ABC + \bar{A}BC + \bar{A}\bar{B}C} = \bar{A}\bar{B}\bar{C} + A\bar{B}\bar{C} + A\bar{B}C + \bar{A}B\bar{C} + AB\bar{C}$**

| $A$ | $B$ | $C$ | 左式 | 右式 |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 1 | 1 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 |

（左边化简为 $A\bar{B}\bar{C} + \bar{C}$，与右边五项之和相同。）

</details>

## 3.8 用逻辑代数的公理或定理证明下列等式。

(1) $AB + \bar{A}C + \bar{B}C = AB + C$
(2) $A + B + \bar{A}\bar{B}C = A + B + C$
(3) $\overline{\bar A C+\bar A D+BC+CD}=A\bar C+A\bar B\bar D+\bar C\bar D$ （原书错印！）
(4) $ABC + \bar{A} \cdot \bar{B} \cdot \bar{C} = \bar{\bar{A}B + \bar{B}C + \bar{C}A}$
(5) $AB + BC + AC = (A + B)(B + C)(C + A)$
(6) $A(\bar{C} + \bar{D}) + BC + \bar{B}D = A + BC + \bar{B}D$
(7) $\bar{A}\bar{B} + B + \bar{A}C = \bar{A} + B$
(8) $B\bar{C} + A\bar{B}C + BCD + A\bar{B}\cdot \bar{C}\cdot\bar{D} + \bar{A}BC\bar{D} + A\bar{B}\bar{C} + ABC = B + A$

<details class="answer">
<summary>答案</summary>

**(1) $AB + \bar{A}C + \bar{B}C = AB + C$**

左 $= AB + (\bar{A} + \bar{B})C = AB + \overline{AB}\,C = AB + C$（吸收律 $X + \bar{X}Y = X + Y$）。

**(2) $A + B + \bar{A}\bar{B}C = A + B + C$**

左 $= (A + B) + \overline{A + B}\,C = A + B + C$。

**(3)** 原题按 OCR 转录（$\overline{AC} + \overline{AD} + BC + CD$）恒等于 1，不成立，纸书此处即错印。按已校订的 $\overline{\bar{A}C + \bar{A}D + BC + CD} = A\bar{C} + A\bar{B}\bar{D} + \bar{C}\bar{D}$ 证明：

左 $= (A + \bar{C})(A + \bar{D})(\bar{B} + \bar{C})(\bar{C} + \bar{D}) = (A + \bar{C}\bar{D})(\bar{C} + \bar{B}\bar{D}) = A\bar{C} + A\bar{B}\bar{D} + \bar{C}\bar{D}$。

**(4) $ABC + \bar{A}\bar{B}\bar{C} = \overline{\bar{A}B + \bar{B}C + \bar{C}A}$**

右 $= (A + \bar{B})(B + \bar{C})(C + \bar{A}) = (AB + A\bar{C} + \bar{B}\bar{C})(C + \bar{A}) = ABC + \bar{A}\bar{B}\bar{C}$。

**(5) $AB + BC + AC = (A + B)(B + C)(C + A)$**

右 $= (B + AC)(C + A) = BC + AB + AC + AC = AB + BC + AC$。

**(6) $A(\bar{C} + \bar{D}) + BC + \bar{B}D = A + BC + \bar{B}D$**

左 $= A\overline{CD} + BC + \bar{B}D$。因 $A = A\overline{CD} + ACD$，而 $CD$ 已由 $BC + \bar{B}D$ 的冗余项覆盖（$BC + \bar{B}D = BC + \bar{B}D + CD$），故左 $= A + BC + \bar{B}D$。

**(7) $\bar{A}\bar{B} + B + \bar{A}C = \bar{A} + B$**

左 $= B + \bar{A}(\bar{B} + C) = B + \bar{A}\,\overline{B\bar{C}} = B + \bar{A}$（当 $B=0$ 时右项为 $\bar{A}$，当 $B=1$ 时整体为 1）。

**(8) $B\bar{C} + A\bar{B}C + BCD + A\bar{B}\bar{C}\bar{D} + \bar{A}BC\bar{D} + A\bar{B}\bar{C} + ABC = B + A$**

左 $= B\bar{C} + BCD + \bar{A}BC\bar{D} + (A\bar{B}C + ABC) + (A\bar{B}\bar{C}\bar{D} + A\bar{B}\bar{C})$

$= B(\bar{C} + CD + \bar{A}C\bar{D}) + AC + A\bar{B}\bar{C}$

$= B(\bar{C} + D + \bar{A}) + A(C + \bar{B}\bar{C}) = B(\bar{A} + \bar{C} + D) + A(\bar{B} + C)$

分别令 $A=1$、$A=0$ 验证即得 $A + B$。

</details>

## 3.9 写出下列等式的对偶等式。

(1) $\bar{A} + \bar{B} + \bar{C} + ABC = 1$
(2) $\bar{A} + \bar{B} + \bar{C} = ABC$
(3) $A + \bar{A} \bar{B} = A + \bar{B}$
(4) $A\bar{B} + \bar{A}C + \bar{B}C = A\bar{B} + \bar{A}C$
(5) $A + B + \bar{A}\bar{B}C = A + B + C$
(6) $AB + BC + AC = (A + B)(B + C)(C + A)$

<details class="answer">
<summary>答案</summary>

对偶规则：$+ \leftrightarrow \cdot$、$1 \leftrightarrow 0$，变量与反号都不动。

(1) $\bar{A} + \bar{B} + \bar{C} + ABC = 1$ → 对偶式：$\bar{A}\,\bar{B}\,\bar{C}\,(A + B + C) = 0$

(2) 题干转录有误：原文右式写成 $ABC$，与左式自相矛盾（左式即 $\overline{ABC}$）。按 $\bar{A} + \bar{B} + \bar{C} = \overline{ABC}$ 作答，其对偶式：$\bar{A}\,\bar{B}\,\bar{C} = \overline{A + B + C}$

(3) $A + \bar{A}\bar{B} = A + \bar{B}$ → 对偶式：$A(\bar{A} + \bar{B}) = A\bar{B}$

(4) $A\bar{B} + \bar{A}C + \bar{B}C = A\bar{B} + \bar{A}C$ → 对偶式：$(A + \bar{B})(\bar{A} + C)(\bar{B} + C) = (A + \bar{B})(\bar{A} + C)$

(5) $A + B + \bar{A}\bar{B}C = A + B + C$ → 对偶式：$AB(\bar{A} + \bar{B} + C) = ABC$

(6) $AB + BC + AC = (A + B)(B + C)(C + A)$ → 对偶式：$(A + B)(B + C)(C + A) = AB + BC + AC$（该式自对偶，对偶式与原式相同）

</details>

## 3.10 直接写出下列各函数的反函数表达式及对偶函数表达式。

(1) $F = (A + B)(B + C)(C + D)$
(2) $F = \bar{A}BC + B\bar{C}\bar{D} + B\bar{C} + D$
(3) $F = [(A\bar{C} + B)D + BE]C$
(4) $F = A + \overline{BC} + \overline{BC} + \bar{A}$
(5) $F = [\bar{A}(C + B)][A\bar{C}D + (\bar{C} + B)D]$
(6) $F = \overline{\overline{\overline{AC +B} + CD} + \bar{A}\bar{D}} + \overline{\bar{C} + \bar{B}}$

<details class="answer">
<summary>答案</summary>

记反函数为 $\bar{F}$（反演规则：$+\leftrightarrow\cdot$、变量取反、$0\leftrightarrow1$），对偶函数为 $F^{D}$（只换 $+\leftrightarrow\cdot$ 与 $0\leftrightarrow1$，变量不取反）。


**(1)** 原式 $F$ 的最小项集合为 $\sum m(5,6,7,10,11,13,14,15)$

　$\bar{F} = \bar{A}\bar{B} + \bar{B}\bar{C} + \bar{C}\bar{D}$

　$F^{D} = AB + BC + CD$

**(2)** 原式 $F$ 的最小项集合为 $\sum m(1,3,4,5,6,7,9,11,12,13,15)$

　$\bar{F} = \bar{B}\bar{D} + AC\bar{D}$

　$F^{D} = BD + \bar{A}\bar{C}D$

**(3)**

　$\bar{F} = \bar{B} + \bar{C} + \bar{D}\bar{E}$

　$F^{D} = B + C + DE$

**(4)** 原式 $F$ 的最小项集合为 $\sum m(0,1,2,3,4,5,6,7)$

　$\bar{F} = 0$

　$F^{D} = 0$

**(5)** 原式 $F$ 的最小项集合为 $\sum m(5,7)$

　$\bar{F} = A + \bar{B} + \bar{D}$

　$F^{D} = B + D + \bar{A}$

**(6)**

　$\bar{F} = 0$

　$F^{D} = 0$

（第 (4) 题原文 $\overline{BC}$ 出现两次，按去重后 $F = A + \bar{A} + \overline{BC} = 1$ 处理，故 $\bar{F} = 0$、$F^{D} = 0$。）

</details>

## 3.11 写出下列各式的最小项表达式。

(1) $F = A\bar{C} + \bar{A}C + BC$
(2) $F = A\bar{B} + \bar{A}B + BCD$
(3) $F = ABC + ABCD + A\bar{D}$
(4) $F = ABC + ACD + B\bar{D} + \bar{A}C$
(5) $F = (C + \bar{A}B)[(\bar{A} + B) \cdot C + A]$
(6) $F = \overline{\overline{\overline{AC +B} + CD} + \bar{A}\bar{D}} + \overline{\bar{C} + \bar{B}}$

<details class="answer">
<summary>答案</summary>

(1) $F = \sum m(1,3,4,6,7)$

(2) $F = \sum m(4,5,6,7,8,9,10,11,15)$

(3) $F = \sum m(8,10,12,14,15)$

(4) $F = \sum m(2,3,5,6,7,11,13,14,15)$

(5) $F = \sum m(1,3,5,7)$

(6) $F = \sum m(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14)$

（(1)(5) 只含 $A$、$B$、$C$，按 3 变量编号；(2)(3)(4)(6) 含 $D$，按 4 变量编号。）

</details>

## 3.12 写出下列各式的最大项表达式。

(1) $F = A\bar{C} + \bar{A}C + BC$
(2) $F = A\bar{B} + \bar{A}B + BCD$
(3) $F = ABC + ABCD + A\bar{D}$
(4) $F = ABC + ACD + BD + \overline{AC}$
(5) $F = (C + \bar{A}B)[(\bar{A} + B) \cdot C + A]$
(6) $F = \overline{AC + B + CD} + \overline{AD} + \overline{C + B}$

<details class="answer">
<summary>答案</summary>

(1) $F = \prod M(0,2,5)$

(2) $F = \prod M(0,1,2,3,12,13,14)$

(3) $F = \prod M(0,1,2,3,4,5,6,7,9,11,13)$

(4) $F = \prod M(10)$

(5) $F = \prod M(0,2,4,6)$

(6) $F = \prod M(3,5,7,10,11,12,13,14,15)$

（最大项编号即函数取 0 的行；(1)(5) 按 3 变量编号。）

</details>

## 3.13 已知下列逻辑函数 F 的标准表达式，求其反函数的标准表达式。

(1) $F = f(A,B,C) = \bar{A}\bar{B}\bar{C} + \bar{A}B\bar{C} + \bar{A}BC + A\bar{B}C$；
(2) $F = f(A,B,C) = \sum m(0,3,4,7)$；
(3) $F = f(A,B,C,D) = \bar{A}\bar{B}\bar{C}\bar{D} + \bar{A}\bar{B}\bar{C}\bar{D} + \bar{A}\bar{B}\bar{C}\bar{D} + \bar{A}\bar{B}\bar{C}\bar{D}$；
(4) $F = f(A,B,C,D) = \sum m(0,1,2,6,7,8,10,14,15)$；
(5) $F = f(A,B,C) = (\bar{A} + \bar{B} + \bar{C})(\bar{A} + B + \bar{C})(A + \bar{B} + C)$；
(6) $F = f(A,B,C) = \prod M(1,3,4,7)$；
(7) $F = f(A,B,C,D) = \sum m(0,1,3,7,8,9,13) + \sum d(5,11,15)$；
(8) $F = f(A,B,C,D) = \prod M(0,1,6,11) * \prod d(3,14,15)$。

<details class="answer">
<summary>答案</summary>

(1) $F$ 的最小项为 $m_0, m_2, m_5$（原文中 $\bar{A}\bar{B}\bar{C}$ 重复出现两次），故 $\bar{F} = \sum m(1,3,4,6,7) = \bar{A}\bar{B}C + \bar{A}B\bar{C} + A\bar{B}\bar{C} + AB\bar{C} + ABC$

(2) $F = \sum m(0,3,4,7)$，$\bar{F} = \sum m(1,2,5,6)$

(3) 题干四项在 OCR 中完全相同（都是 $\bar{A}\bar{B}\bar{C}\bar{D}$），按去重后 $F = m_0$ 作答：$\bar{F} = \sum m(1 \sim 15)$。**原文应有 4 个不同最小项，此处需对照纸书补正。**

(4) $F = \sum m(0,1,2,6,7,8,10,14,15)$，$\bar{F} = \sum m(3,4,5,9,11,12,13)$

(5) 原式 $= \prod M(2,5,7)$，即 $F = \sum m(0,1,3,4,6)$，$\bar{F} = \sum m(2,5,7)$

(6) $F = \prod M(1,3,4,7) = \sum m(0,2,5,6)$，$\bar{F} = \sum m(1,3,4,7)$

(7) $F = \sum m(0,1,3,7,8,9,13) + \sum d(5,11,15)$，$\bar{F} = \sum m(2,4,6,10,12,14) + \sum d(5,11,15)$

(8) $F = \prod M(0,1,6,11) + \prod d(3,14,15) = \sum m(2,4,5,7,8,9,10,12,13) + \sum d(3,14,15)$，$\bar{F} = \sum m(0,1,6,11) + \sum d(3,14,15)$

</details>

## 3.14 做下列函数的卡诺图。

(1) $Y = \overline{B + \bar{A} \cdot \bar{C}}$
(2) $Y = (A + BC)[D + B(A + \bar{C})]$
(3) $Y = (\bar{B} + A)(B + C + D)(\bar{A} + \bar{C})$
(4) $Y = \sum m(1,3,4,7)$；
(5) $Y = \sum m(0,1,2,3,4,9,14,15)$
(6) $Y = \sum m(0,1,2,10,11,12,13) + \sum d(3,14,15)$
(7) $Y = f(A,B,C) = \prod M(0,2,4,6)$；
(8) $Y = f(A,B,C,D) = \prod M(0,1,6,12,13) * \prod d(3,14,15)$；

<details class="answer">
<summary>答案</summary>

**(1) $Y = B + A\cdot C$**

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 0 | 1 | 1 |
| **1** | 0 | 1 | 1 | 1 |

**(2) $Y = (A + BC)[D + B(A + \bar{C})]$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 0 | 0 | 0 |
| **01** | 0 | 0 | 1 | 0 |
| **11** | 1 | 1 | 1 | 1 |
| **10** | 0 | 1 | 1 | 0 |

**(3) $Y = (\bar{B} + A)(B + C + D)(\bar{A} + \bar{C})$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 1 | 1 | 1 |
| **01** | 0 | 0 | 0 | 0 |
| **11** | 1 | 1 | 0 | 0 |
| **10** | 0 | 1 | 0 | 0 |

**(4) $Y = \sum m(1,3,4,7)$**

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 1 | 0 |
| **1** | 1 | 0 | 1 | 0 |

**(5) $Y = \sum m(0,1,2,3,4,9,14,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 1 | 1 | 1 |
| **01** | 1 | 0 | 0 | 0 |
| **11** | 0 | 0 | 1 | 1 |
| **10** | 0 | 1 | 0 | 0 |

**(6) $Y = \sum m(0,1,2,10,11,12,13) + \sum d(3,14,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 1 | × | 1 |
| **01** | 0 | 0 | 0 | 0 |
| **11** | 1 | 1 | × | × |
| **10** | 0 | 0 | 1 | 1 |

**(7) $Y = f(A,B,C) = \prod M(0,2,4,6)$**

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 1 | 0 |
| **1** | 0 | 1 | 1 | 0 |

**(8) $Y = f(A,B,C,D) = \prod M(0,1,6,12,13) + \prod d(3,14,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 0 | × | 1 |
| **01** | 1 | 1 | 1 | 0 |
| **11** | 0 | 0 | × | × |
| **10** | 1 | 1 | 1 | 1 |

</details>

## 3.15 已知原函数的卡诺图，求其反函数的卡诺图，可以将原函数的卡诺图中 1 变为 0，0 变为 1。用此方法写出题 3.14 中各函数的反函数。

<details class="answer">
<summary>答案</summary>

把 3.14 各卡诺图中原填 1 的格改填 0、填 0 的改填 1（$\times$ 不可用格保持不动），即得反函数的卡诺图。对应地：

(1) $\bar{Y} = \sum m(0,1,4)$

(2) $\bar{Y} = \sum m(0,1,2,3,4,5,6,8,10)$

(3) $\bar{Y} = \sum m(0,4,5,6,7,8,10,11,14,15)$

(4) $\bar{Y} = \sum m(0,2,5,6)$

(5) $\bar{Y} = \sum m(5,6,7,8,10,11,12,13)$

(6) $\bar{Y} = \sum m(4,5,6,7,8,9) + \sum d(3,14,15)$

(7) $\bar{Y} = \sum m(0,2,4,6)$

(8) $\bar{Y} = \sum m(0,1,6,12,13) + \sum d(3,14,15)$

各式的卡诺图形状与 3.14 完全相同，仅 0/1 互换。

</details>

## 3.16 将 3.2 题中各函数用卡诺图表示。

<details class="answer">
<summary>答案</summary>

**(1) 3.2(1) 的 $F$（奇校验）**

| $A\backslash BC$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 0 | 1 |
| **1** | 1 | 0 | 1 | 0 |

**(2) 3.2(2) 的 $F_2$（$X=Y$）**，行为 $x_1x_2$、列为 $y_1y_2$：

| $x_1x_2\backslash y_1y_2$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 0 | 0 | 0 |
| **01** | 0 | 1 | 0 | 0 |
| **11** | 0 | 0 | 1 | 0 |
| **10** | 0 | 0 | 0 | 1 |

**(3) 3.2(3) 的差 $\Delta$**（表中 $I$ 即低位借位 $BI$）

| $A\backslash BI$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 0 | 1 |
| **1** | 1 | 0 | 1 | 0 |

**向高位借位 $BO$**

| $A\backslash BI$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **0** | 0 | 1 | 1 | 1 |
| **1** | 0 | 0 | 1 | 0 |

</details>

## 3.17 将 3.2 题中各函数写成标准与 - 或表达式。

<details class="answer">
<summary>答案</summary>

(1) $F = \sum m(1,2,4,7) = \bar{A}\bar{B}C + \bar{A}B\bar{C} + A\bar{B}\bar{C} + ABC$

(2) $F_1 = \sum m(4,8,9,12,13,14)$（$X>Y$）

　$F_2 = \sum m(0,5,10,15)$（$X=Y$）

　$F_3 = \sum m(1,2,3,6,7,11)$（$X<Y$）

(3) $\Delta = \sum m(1,2,4,7) = \bar{A}\bar{B}C + \bar{A}B\bar{C} + A\bar{B}\bar{C} + ABC$

　$BO = \sum m(1,2,3,7) = \bar{A}\bar{B}C + \bar{A}B\bar{C} + \bar{A}BC$

</details>

## 3.18 将 3.2 题中各函数写成标准或 - 与表达式。

<details class="answer">
<summary>答案</summary>

(1) $F = \prod M(0,3,5,6)$

(2) $F_1 = \prod M(0,1,2,3,5,6,7,10,11,15)$

　$F_2 = \prod M(1,2,3,4,6,7,8,9,11,12,13,14)$

　$F_3 = \prod M(0,4,5,8,9,10,12,13,14,15)$

(3) $\Delta = \prod M(0,3,5,6)$，$BO = \prod M(0,4,5,6)$

</details>

## 3.19 两个逻辑函数的与、或、异或运算，可以通过将它们的卡诺图中对应的最小项，分别作与、或、异或运算来实现。用下列两个函数的与、或、异或运算，验证该运算方法正确。

$F_1 = AB + \bar{A}C + \bar{B}D$

$F_2 = A\bar{B}\bar{C}D + BCD + \bar{B}C$

<details class="answer">
<summary>答案</summary>

$F_1 = AB + \bar{A}C + \bar{B}D = \sum m(1,2,3,6,7,9,11,12,13,14,15)$

$F_2 = A\bar{B}\bar{C}D + BCD + \bar{B}C = \sum m(2,3,7,9,10,11,15)$

把两个卡诺图逐格做同样的运算，结果与「先算函数、再画卡诺图」完全一致：

- 与运算：$F_1 F_2 = \sum m(2,3,7,9,11,15)$
- 或运算：$F_1 + F_2 = \sum m(1,2,3,6,7,9,10,11,12,13,14,15)$
- 异或运算：$F_1 \oplus F_2 = \sum m(1,6,10,12,13,14)$

  即卡诺图是逻辑函数的逐格表示，两函数卡诺图对应格相与／相或／相异或，等价于对函数本身做相应运算，方法正确。

  </details>

## 3.20 用公式法简化下列逻辑函数。

(1) $F = A + AC + BC + \bar{A}\bar{B}C$
(2) $F = AC + AB + \overline{BC} + \overline{AB}\bar{C}$
(3) $F = AB\bar{C} + \bar{A}CD + AC$
(4) $F = A\bar{C}\bar{D} + \bar{B}D + A\bar{B} + \bar{A}C + \bar{B}C$
(5) $F = (C + AB)(A\bar{B} + B)(C + \bar{A})$
(6) $F = (\bar{A} + B)(\bar{A} + B + C)(A + C)(B + C + D)$
(7) $F = \overline{AC} + \overline{BC} + B(\overline{AC} + A\bar{C})$
(8) $F = \overline{AC} + \overline{BC} \cdot B(\overline{AC} + \overline{AC})$

<details class="answer">
<summary>答案</summary>

(1) $F = A + C$

(2) $F = A + \bar{B} + \bar{C}$

(3) $F = AB + AC + CD$

(4) $F = \bar{A}C + \bar{B}C + \bar{B}D + A\bar{C}\bar{D}$

(5) $F = AC + BC$

(6) $F = AB + \bar{A}C$

(7) $F = \bar{A} + \bar{B} + \bar{C}$

(8) $F = \bar{A} + \bar{C}$

（结果均已用卡诺图/QM 复核，与原式逐行等价。）

</details>

## 3.21 用卡诺图法化简下列各函数，写出函数的最简与 - 或表达式。

(1) $F = \bar{A}\bar{B}C + A\bar{C}D + \bar{A}\bar{C} + BC$
(2) $F = \overline{AC} + \overline{CD} + BC + AD$
(3) $F = (A + B)(B + C)(\bar{A} + C)(A + B + C)$
(4) $F = (\bar{A} + B)(\bar{A} + B + C)(A + C)(A + C + D)$
(5) $F = \sum m(0,2,6,7)$
(6) $F = f(A,B,C,D) = \sum m(0,2,5,7,9,10) + \sum d(1,4,8,12,15)$
(7) $F = f(A,B,C,D) = \prod M(2,4,6,13,15)$
(8) $F = f(A,B,C,D) = \prod M(0,2,5,7,9,10) + \prod d(1,4,8,12,15)$

<details class="answer">
<summary>答案</summary>

**(1) $F = \bar{A}\bar{B}C + A\bar{C}D + \bar{A}\bar{C} + BC$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 1 | 1 | 1 |
| **01** | 1 | 1 | 1 | 1 |
| **11** | 0 | 1 | 1 | 1 |
| **10** | 0 | 1 | 0 | 0 |

最简与或式：$F = \bar{A} + BC + \bar{C}D$

（8 格圈 $\bar{A}$：m{0,1,2,3,4,5,6,7}；4 格圈 $\bar{C}D$：m{1,5,9,13}；4 格圈 $BC$：m{6,7,14,15}）

**(2) $F = \overline{AC} + \overline{CD} + BC + AD$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 1 | 1 | 1 |
| **01** | 1 | 1 | 1 | 1 |
| **11** | 1 | 1 | 1 | 1 |
| **10** | 1 | 1 | 1 | 1 |

最简与或式：$F = 1$

（16 格圈 $1$：m{0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15}）

**(3) $F = (A+B)(B+C)(\bar{A}+C)(A+B+C)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 0 | 0 | 0 |
| **01** | 1 | 1 | 1 | 1 |
| **11** | 0 | 0 | 1 | 1 |
| **10** | 0 | 0 | 1 | 1 |

最简与或式：$F = AC + \bar{A}B$

（4 格圈 $\bar{A}B$：m{4,5,6,7}；4 格圈 $AC$：m{10,11,14,15}）

**(4) $F = (\bar{A}+B)(\bar{A}+B+C)(A+C)(A+C+D)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | 0 | 1 | 1 |
| **01** | 0 | 0 | 1 | 1 |
| **11** | 1 | 1 | 1 | 1 |
| **10** | 0 | 0 | 0 | 0 |

最简与或式：$F = AB + \bar{A}C$

（4 格圈 $\bar{A}C$：m{2,3,6,7}；4 格圈 $AB$：m{12,13,14,15}）

**(5) $F = \sum m(0,2,6,7)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 0 | 0 | 1 |
| **01** | 0 | 0 | 1 | 1 |
| **11** | 0 | 0 | 0 | 0 |
| **10** | 0 | 0 | 0 | 0 |

最简与或式：$F = \bar{A}BC + \bar{A}\bar{B}\bar{D}$

（2 格圈 $\bar{A}\bar{B}\bar{D}$：m{0,2}；2 格圈 $\bar{A}BC$：m{6,7}）

**(6) $F = \sum m(0,2,5,7,9,10) + \sum d(1,4,8,12,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | × | 0 | 1 |
| **01** | × | 1 | 1 | 0 |
| **11** | × | 0 | × | 0 |
| **10** | × | 1 | 0 | 1 |

最简与或式：$F = \bar{B}\bar{C} + \bar{B}\bar{D} + \bar{A}BD$

（4 格圈 $\bar{B}\bar{D}$：m{0,2,8,10}；4 格圈 $\bar{B}\bar{C}$：m{0,1,8,9}；2 格圈 $\bar{A}BD$：m{5,7}）

**(7) $F = \prod M(2,4,6,13,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 1 | 1 | 1 | 0 |
| **01** | 0 | 1 | 1 | 0 |
| **11** | 1 | 0 | 0 | 1 |
| **10** | 1 | 1 | 1 | 1 |

最简与或式：$F = A\bar{D} + \bar{A}D + \bar{B}D + \bar{B}\bar{C}$

（4 格圈 $\bar{B}\bar{C}$：m{0,1,8,9}；4 格圈 $\bar{A}D$：m{1,3,5,7}；4 格圈 $A\bar{D}$：m{8,10,12,14}；4 格圈 $\bar{B}D$：m{1,3,9,11}）

**(8) $F = \prod M(0,2,5,7,9,10) + \prod d(1,4,8,12,15)$**

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
| --- | --- | --- | --- | --- |
| **00** | 0 | × | 1 | 0 |
| **01** | × | 0 | 0 | 1 |
| **11** | × | 1 | × | 1 |
| **10** | × | 0 | 1 | 0 |

最简与或式：$F = AB + B\bar{D} + \bar{B}CD$

（4 格圈 $B\bar{D}$：m{4,6,12,14}；4 格圈 $AB$：m{12,13,14,15}；2 格圈 $\bar{B}CD$：m{3,11}）

</details>

## 3.22 用卡诺图法化简 3.21 题中各函数，写出函数的最简或 - 与表达式。

<details class="answer">
<summary>答案</summary>

(1) $F = (\bar{A} + B + \bar{C})(\bar{A} + C + D)$

(2) $F = 1$

(3) $F = (\bar{A} + C)(A + B)$

(4) $F = (\bar{A} + B)(A + C)$

(5) $F = \bar{A}(\bar{B} + C)(B + \bar{D})$

(6) $F = (\bar{A} + \bar{B})(\bar{B} + D)(B + \bar{C} + \bar{D})$

(7) $F = (\bar{A} + \bar{B} + \bar{D})(A + \bar{B} + D)(A + \bar{C} + D)$

(8) $F = (B + C)(B + D)(A + \bar{B} + \bar{D})$

（或-与式由卡诺图中圈 0 得到：每个 0 格圈对应一个或项，圈内变量取反后相或，各或项再相乘。）

</details>

## 3.23 用卡诺图法化简 3.21 题中各函数，写出函数的最简与 - 或非表达式。

<details class="answer">
<summary>答案</summary>

(1) $F = \overline{A\bar{B}C + A\bar{C}\bar{D}}$

(2) $F = 1$

(3) $F = \overline{A\bar{C} + \bar{A}\bar{B}}$

(4) $F = \overline{A\bar{B} + \bar{A}\bar{C}}$

(5) $F = \overline{A + B\bar{C} + \bar{B}D}$

(6) $F = \overline{AB + B\bar{D} + \bar{B}CD}$

(7) $F = \overline{ABD + \bar{A}B\bar{D} + \bar{A}C\bar{D}}$

(8) $F = \overline{\bar{B}\bar{C} + \bar{B}\bar{D} + \bar{A}BD}$

（与-或非式 = 对 $\bar{F}$ 的最简与或式整体取反，可用一级与或非门实现。）

</details>

