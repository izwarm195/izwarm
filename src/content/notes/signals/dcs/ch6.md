---
title: "第6章 常用的组合逻辑功能器件"
slug: "signals/dcs/ch6"
description: "（1）同一时刻只允许一个单位提出使用请求，设备只允许该单位使用；"
publishDate: "2026-10-18"
createdAt: "2026-10-18T00:00:00Z"
updatedDate: "2026-11-01T11:23:09"
tags: ["signals"]
series: ["Signals","数字电路与系统"]
---

## 6.1 4个单位A、B、C、D共用一套测试设备，在下列两种情况下设计其相应的编码电路。

（1）同一时刻只允许一个单位提出使用请求，设备只允许该单位使用；

（2）同一时刻允许多个单位提出使用请求，设备要按用户的优先顺序提供服务，优先级由高到低的顺序是A、B、C、D。

## 6.2 设计一个优先编码器，优先级由高到低的四个高电平输入有效信号为 A、B、C、D，输出编码信号 $Y_{0}$、Y 也是高电平有效，无有效信号指示信号为 W，高电平有效。

## 6.3 某医院有 A、B、C、D 病房，每个病房设有呼叫按钮，同时在护士值班室内对应地装有一号、二号、三号四号 4 个指示灯。同一时刻只允许一个指示灯亮。设定 A、B、C、D 病房呼叫按钮的优先级顺序为自高到低，试用优先编码器 74148 和门电路设计实现该逻辑的电路。

## 6.4 确定优先编码器 74148 在下列输入情况下，芯片输出端的状态。

（1） $I_{5}=1,I_{2}=1$，其余为0；

(2)  $\overline{EN}=0, I_{4}=0$，其余为1；

(3)  $\overline{EN}=0, I_{2}=0, I_{3}=0$，其余为1；

(4)  $\overline{EN} = 0$,  $I_0 \sim I_7$ 全为 0;

(5)  $\overline{EN} = 0, I_{0} \sim I_{7}$ 全为1。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

74148 的输入、输出**全部低电平有效**：$I_k=0$ 才是「该路有请求」，$\overline{EN}=0$ 才允许编码。输出为反码，编码 $k$ 对应 $\overline{Y_2}\overline{Y_1}\overline{Y_0}=\overline{k_2k_1k_0}$；有有效输入时 $Y_S=1$、$\overline{Y_{EX}}=0$，无有效输入时 $Y_S=0$、$\overline{Y_{EX}}=1$。

| 小题 | 有效的输入（=0） | 优先级最高者 | $\overline{Y_2}\overline{Y_1}\overline{Y_0}$ | $Y_S$ | $\overline{Y_{EX}}$ |
| --- | --- | --- | --- | --- | --- |
| (1) | $I_7,I_6,I_4,I_3,I_1,I_0$ | $I_7$ | 0 0 0 | 1 | 0 |
| (2) | $I_4$ | $I_4$ | 0 1 1 | 1 | 0 |
| (3) | $I_3,I_2$ | $I_3$ | 1 0 0 | 1 | 0 |
| (4) | $I_7 \sim I_0$ 全部 | $I_7$ | 0 0 0 | 1 | 0 |
| (5) | 无（全为 1） | — | 1 1 1 | 0 | 1 |

逐条：

(1) $I_5$、$I_2$ 为 1 是**无效**电平，其余 $I_7,I_6,I_4,I_3,I_1,I_0$ 全为 0 都有效，最高优先级是 $I_7$，编 7 的反码 $000$。题中未给 $\overline{EN}$，按使能有效（$\overline{EN}=0$）处理。

(2) 只有 $I_4$ 有效，编 4（$100$）的反码 $011$。

(3) $I_3$、$I_2$ 同时有效，$I_3$ 优先，编 3（$011$）的反码 $100$。

(4) 八路全部有效，$I_7$ 优先，编 7，反码 $000$。

(5) 八路全为 1，无有效请求：输出全为 1（$111$），$Y_S=0$ 表示"输出不是有效编码"，$\overline{Y_{EX}}=1$。

注：(1) 与 (4) 结果相同，因为把 $I_5$、$I_2$ 拉高并不能屏蔽优先级更高的 $I_7$；要只编 $I_5$，必须把 $I_7 \sim I_6$ 置 1。

</details>

## 6.5* 用2-4线译码器74139和适当的门电路实现多输出函数

(1)  $Y_{1} = \overline{A_{1}} A_{0} + A_{1} \overline{A_{0}}$;

(2)  $Y_{2} = \overline{A_{1}A_{0}} + A_{1}A_{0}$;

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

74139 半片的输出就是四个最小项的非：$\overline{O_i}=\overline{m_i}$，所以 $m_i=\overline{\overline{O_i}}$。

**(1)** $Y_1=\overline{A_1}A_0+A_1\overline{A_0}=m_1+m_2$，取两次反：

$$
Y_1=\overline{\overline{m_1}\cdot\overline{m_2}}=\overline{\overline{O_1}\cdot\overline{O_2}}
$$

即把 $\overline{O_1}$、$\overline{O_2}$ 送二输入与非门。

**(2)** 先按最小项拆开：$\overline{A_1A_0}=m_0+m_1+m_2$，$A_1A_0=m_3$，于是

$$
Y_2=m_0+m_1+m_2+m_3=\overline{\overline{O_0}\cdot\overline{O_1}\cdot\overline{O_2}\cdot\overline{O_3}}
$$

四路输出全送四输入与非门。

![题6.5 逻辑图](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/301b561c1b755dc95ab5f29a2c0bd893.svg)

注：(2) 式化简后恒等于 1（$\overline{A_1A_0}+A_1A_0\equiv1$），按最小项写就是四项全取，故接成四输入与非门。若按同或理解（$\overline{A_1}\,\overline{A_0}+A_1A_0=m_0+m_3$），则只把 $\overline{O_0}$、$\overline{O_3}$ 送二输入与非门。

</details>

## 6.6 用五个带使能端的2线-4线译码器可以构建一个4线-16线的译码器。在题6.6图中，

（1）写出使译码器 U1 ~ U4 产生有效的译码输出时，C、D 对应的取值；

(2) 当译码器 U1 工作时，写出对应 A、B 的取值时， $\overline{Y}_{10} \sim \overline{Y}_{13}$ 的输出。

![题6.6图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/18f34621b12c29f7f85535af42f98c54.svg)

## 6.7 试用一个优先编码器 74148 和一个译码器 74138 将 3 位格雷码转换为 3 位二进制码。

## 6.8* 写出题 6.8 图所示电路的逻辑函数，并将其化简为最简与 - 或表达式。

![题6.8图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/62b5243be03d6b2354c98825b2931296.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

三个使能为 $E_0=1$、$\overline{E_1}=0$、$\overline{E_2}=0$，芯片处于译码状态；地址端 $A_2A_1A_0$ 依次接 $A$、$B$、$C$，故 $\overline{Y_i}=\overline{m_i}$（$m_i$ 是 $ABC$ 的最小项）。

与门取 $\overline{Y_0}$、$\overline{Y_2}$、$\overline{Y_4}$、$\overline{Y_6}$ 四路，输出端带取反圈，所以

$$
F=\overline{\overline{Y_0}\,\overline{Y_2}\,\overline{Y_4}\,\overline{Y_6}}=\overline{\overline{m_0}\,\overline{m_2}\,\overline{m_4}\,\overline{m_6}}=m_0+m_2+m_4+m_6
$$

$$
=\overline{A}\,\overline{B}\,\overline{C}+\overline{A}B\overline{C}+A\overline{B}\,\overline{C}+AB\overline{C}=\overline{C}
$$

最简与-或表达式：$F=\overline{C}$。

</details>

## 6.9 用74138译码器构成题6.9图所示电路，写出输出F的逻辑表达式，列出真值表并说明电路功能。

![题6.9图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/cd5c440ea3a87b9e17315469223c457a.svg)

## 6.10* 题6.10图所示电路是由译码器74138及门电路构成的地址译码电路。试列出此译码电路每个输出对应的地址，要求输入地址 $A_{7}\sim A_{0}$用十六进制数码表示。

![题6.10 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/3e2716dd7186277a16b1db115788ed94.svg)

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

三个使能端必须同时满足才译码：

- $E_1=A_3$，高有效 → 要求 $A_3=1$；
- $\overline{E_2}=\overline{A_4A_5}$（与非门），低有效 → 要求 $A_4A_5=1$，即 $A_4=1$、$A_5=1$；
- $\overline{E_3}=A_6+A_7$（或门），低有效 → 要求 $A_6+A_7=0$，即 $A_6=0$、$A_7=0$。

  于是高 5 位固定为 $A_7A_6A_5A_4A_3=00111$，低 3 位 $A_2A_1A_0$ 决定选中哪一路：

  | 输出 | $A_2A_1A_0$ | 对应地址 |
  | --- | --- | --- |
  | $\overline{Y_0}$ | 0 0 0 | 38H |
  | $\overline{Y_1}$ | 0 0 1 | 39H |
  | $\overline{Y_2}$ | 0 1 0 | 3AH |
  | $\overline{Y_3}$ | 0 1 1 | 3BH |
  | $\overline{Y_4}$ | 1 0 0 | 3CH |
  | $\overline{Y_5}$ | 1 0 1 | 3DH |
  | $\overline{Y_6}$ | 1 1 0 | 3EH |
  | $\overline{Y_7}$ | 1 1 1 | 3FH |

  即该片覆盖 **38H ~ 3FH** 共 8 个地址，写作 $A_7\sim A_0=0011\,1xxx$。

</details>

## 6.11 试画出译码器74138和门电路产生如下多输出逻辑函数的逻辑图。

（1） $F_{1}=AB$

(2)  $F_{2}=A\ \overline{B}C+AB\ \overline{C}+BC$

(3)  $F_{3}=A\ \overline{BC}+\overline{AB}C$

## 6.12 试用译码器74138和最少的与非门实现逻辑函数

(1)  $F = f(A, B, C) = \sum m(0, 1, 4, 7)$

(2)  $F = f(A, B, C) = A \odot B \odot C$

## 6.13* 试用译码器和与非门画出实现下列逻辑函数的逻辑图。

(1)  $Y_1 = \sum m(2,3,4,5)$

(2)  $Y_2 = \sum m(1,2,5,7)$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

74138 输出 $\overline{Y_i}=\overline{m_i}$，故 $Y=\sum m=\overline{\prod \overline{Y_i}}$ —— 最小项取反后再与非。

$$
Y_1=\sum m(2,3,4,5)=\overline{\overline{Y_2}\,\overline{Y_3}\,\overline{Y_4}\,\overline{Y_5}}=\overline{A}B+A\overline{B}=A\oplus B
$$

$$
Y_2=\sum m(1,2,5,7)=\overline{\overline{Y_1}\,\overline{Y_2}\,\overline{Y_5}\,\overline{Y_7}}=\overline{B}C+\overline{A}B\overline{C}+ABC
$$

![题6.13 逻辑图](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/b31b5870a20d8f39876d9ed8c15e4805.svg)

</details>

## 6.14 用译码器 74138 和门电路设计 1 位二进制全减器电路。输入为被减数、减数和来自低位的借位；输出为两数之差及向高位的借位信号。

## 6.15 写出题6.15图中 $Z_{1}$、 $Z_{2}$、 $Z_{3}$的逻辑函数式，并化简为最简的与-或表达式。

![题6.15 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/4bfeddee0a8632d3218dc24aafd1dd7b.svg)

## 6.16 用二-十进制编码器、译码器、七段显示器，组成一个1位数码显示电路。当0~9十个输入端中某一个接地时，显示相应数码，画出逻辑图。

## 6.17 试用七段集成显示译码器 7448 和七段显示器组成一个 3 位数字的译码显示电路，要求将 089 显示成 89，画出逻辑图。

## 6.18 根据题6.18图所示4选1数据选择器74153（1/2），写出输出Z的最简与-或表达式。

![题6.18 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/0c7b496ccf500c4b1190bd75f320c917.svg)

## 6.19* 由4选1数据选择器74153构成的组合逻辑电路如题6.19图(a)所示，画出题6.19图(b)所示输入信号作用下，F的输出波形。

![题6.19 图(a)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/985a8245dd4cde92ae808aa9d870a9c0.svg)

![题6.19 图(b)](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/74a90e0738d9fdf3588f8ac3e0d13cdf.svg)

## 6.20 由4选1数据选择器74153和门电路构成的组合逻辑电路如题6.20图所示，试写出输出F的最简逻辑函数表达式。

![题6.20图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/5e5d145b4612194a7678cfb0d04e96b5.svg)

## 6.21 题 6.21 图是用两个 4 选 1 数据选择器组成的逻辑电路，试写出输出 F 与输入 M、N、P、Q 之间的逻辑函数。

![题6.21 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/8342cee414bd36c8c2ab1700ea6fbc69.svg)

## 6.22 用数据选择器设计一用2个开关控制一个电灯亮灭的逻辑电路，要求改变任何一个开关的状态可使电灯由亮变灭或由灭变亮。

## 6.23 试用4选1数据选择器实现逻辑函数 $F = A \overline{B} C + A \overline{C} + \overline{B} C$。

## 6.24 试用4选1数据选择器74153（1/2）和最少的与非门实现逻辑函数

$$
Q=X T+Z\overline{W}+\overline{Y}Z W
$$

## 6.25 试用4选1数据选择器和门电路实现函数

$$
F=\overline{S}_{1}\overline{S}_{0}+\overline{S}_{0}W+V W+S_{0}\overline{W}
$$

## 6.26 试用2个4选1数据选择器和反相器实现函数

$$
\begin{aligned}\boldsymbol{F}&=\overline{\boldsymbol{E}}+\overline{\boldsymbol{A}}\overline{\boldsymbol{B}}\overline{\boldsymbol{C}}\overline{\boldsymbol{D}}\overline{\boldsymbol{E}}+\overline{\boldsymbol{A}}\overline{\boldsymbol{B}}\overline{\boldsymbol{C}}\overline{\boldsymbol{D}}\overline{\boldsymbol{E}}+\boldsymbol{A}\overline{\boldsymbol{B}}\overline{\boldsymbol{C}}\overline{\boldsymbol{D}}\overline{\boldsymbol{E}}+\boldsymbol{A}\overline{\boldsymbol{B}}\overline{\boldsymbol{D}}\overline{\boldsymbol{E}}\boldsymbol{F}+\boldsymbol{B}\boldsymbol{C}\boldsymbol{E}\end{aligned}
$$

## 6.27 已知用数据选择器 74151 构成的逻辑电路如题 6.27 图所示，写出输出 F 的逻辑函数表达式，并化成最简与 - 或表达式。

![题6.27 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/eefd7d05f54f2574ac6e4a8045a0e1c9.svg)

## 6.28* 分析题 6.28 图所示电路，写出输出 F 的逻辑函数式。

![题6.28 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/2e1cdff536c4d63cbb42e68170511ace.svg)

## 6.29 试用1片8选1数据选择器设计一个8421BCD码的非法码（0~9以外的4位二进制代码）检测器，画出逻辑图。

## 6.30 试用1个8选1数据选择器74151和非门实现函数

$$
\boldsymbol{Y}=\boldsymbol{E}+\left(\boldsymbol{A}+\boldsymbol{B}+\overline{\boldsymbol{C}}\right)\left(\overline{\boldsymbol{A}}+\boldsymbol{C}+\boldsymbol{B}\boldsymbol{F}\right)\left(\overline{\boldsymbol{B}}+\overline{\boldsymbol{C}}+\overline{\boldsymbol{A}}\overline{\boldsymbol{D}}\right)\left(\boldsymbol{A}+\boldsymbol{C}+\overline{\boldsymbol{B}}\overline{\boldsymbol{F}}\right)
$$

## 6.31* 试用数据选择器 74151 分别实现下列逻辑函数

(1)  $F_{1} = \sum m(1,2,3,5,7)$

(2)  $F_2 = \sum m(2,4,5,7,8,10,11,13,14)$

(3)  $F_3 = \sum m(0,1,4,5,6,7,8) + \sum d(9,10,11,12,13,14)$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

74151 输出 $W=\sum m_i D_i$：地址端接哪几位变量，数据端就填该最小项在函数里的值。

**(1)** 三变量，$A_2A_1A_0=ABC$：

| $D_0$ | $D_1$ | $D_2$ | $D_3$ | $D_4$ | $D_5$ | $D_6$ | $D_7$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 1 | 1 | 1 | 0 | 1 | 0 | 1 |

**(2)** 四变量，$A_2A_1A_0=ABC$，$D$ 进数据端：

| $D_0$ | $D_1$ | $D_2$ | $D_3$ | $D_4$ | $D_5$ | $D_6$ | $D_7$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | $\overline{D}$ | 1 | $D$ | $\overline{D}$ | 1 | $D$ | $\overline{D}$ |

**(3)** 同上，含无关项 $d(9\sim14)$，按最简取：

| $D_0$ | $D_1$ | $D_2$ | $D_3$ | $D_4$ | $D_5$ | $D_6$ | $D_7$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 |

使能端 $\overline{S}=0$。

</details>

## 6.32 题6.32图是74138作数据分配器的逻辑图，当EN=1,D=0，在地址输入端轮流输入000~111时，画输出端 $Y_{0}\sim Y_{7}$的波形。

![题6.32 图](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/669795661e5d4a7613b46dc81c7583d9.svg)

## 6.33 试用3片4位数值比较器7485实现两个12位二进制数比较。

## 6.34* 试用1片4位数值比较器7485和适量的门电路实现两个5位数值的比较。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

7485 只比 4 位，5 位要先用门电路判最高位 $A_4$、$B_4$，把结果送**级联输入**：

$$
a>b=A_4\overline{B_4},\qquad a<b=\overline{A_4}B_4,\qquad a=b=A_4\odot B_4
$$

低 4 位 $A_3\sim A_0$、$B_3\sim B_0$ 接 7485 的 $A$、$B$ 两组，输出 $O_{A>B}$、$O_{A<B}$、$O_{A=B}$ 即为 5 位比较结果。

逻辑：$A_4\ne B_4$ 时由级联输入直接决定；$A_4=B_4$ 时 7485 比低 4 位。需 2 个与门（各配 1 个反相器）+ 1 个同或门，$a=b$ 也可用 $\overline{a>b+a<b}$ 省一个同或门。

</details>

## 6.35 试用4位二进制数值比较器7485实现一个判断8位二进制数大于、等于或小于168的逻辑电路，可使用多片7485。

## 6.36 若使用4位数值比较器7485组成10位数值比较器，需要用几片？画出各片之间连接的逻辑图。

## 6.37 试用一片译码器74138和少量的门电路设计一个奇偶校验电路，当输入变量ABCD中有偶数个1时为1，否则为0。ABCD为0000时作偶数个1。

## 6.38* 用2个4位二进制加法器74283和适量门电路设计三个4位二进制数相加的逻辑电路。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

第一片：$A+B\to S^{(1)}$、进位 $C_1$；第二片：$S^{(1)}+C$，进位输入接 $C_1$。

$$
\{C_2,S_3S_2S_1S_0\}=A+B+C
$$

![题6.38 逻辑图](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/b32e2739ad7cf989b9040ade9a5c7791.svg)

</details>

## 6.39 试用1片74283和少量的门电路设计余3BCD码到2421BCD码的转换电路。

## 6.40 试用4位加法器74283和必要的门电路设计一个加/减运算电器。当控制信号M=0时，两个输入的二进制数相加；当M=1时，两个输入的4位二进制数相减。

## 6.41 用74283设计将余3代码转换成8421BCD的逻辑电路。

## 6.42 用尽量少的74283电路和适当的门电路设计1位余3BCD码的全加器电路。

## 6.43 用两片 74283 和适当的门电路设计 1 位 8421BCD 码的全减电路。

## 6.44 用两片 74283 和适当的门电路设计 1 位余 3BCD 码的全减电路。

## 6.45* 根据输入的运算命令（命令是两位二进制数码，自行定义），设计一个电路完成两个1位二进制数A，加、减、与、或四种运算，运算的结果用F输出，进位或者借位用CO输出。要求采用下列两种方法进行设计：

（1）最少化设计方法，采用与非门；

（2）层次化设计方法，可使用二选一数据选择器，1位全加器和适当的门电路。

---

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

设命令 $M_1M_0$：$00$ 加、$01$ 减、$10$ 与、$11$ 或。

| $M_1M_0$ | 运算 | $F$ | $CO$ |
| --- | --- | --- | --- |
| 0 0 | $A+B$ | $A\oplus B$ | $AB$（进位） |
| 0 1 | $A-B$ | $A\oplus B$ | $\overline{A}B$（借位） |
| 1 0 | $AB$ | $AB$ | 0 |
| 1 1 | $A+B$ | $A+B$ | 0 |

**(1) 最少化（与非门）**

$$
F=\overline{M_1}(A\oplus B)+M_1\big[M_0(A+B)+AB\big]
$$

$$
CO=\overline{M_1}\,B\,(\overline{M_0}A+M_0\overline{A})
$$

两项都化成与非-与非式后用与非门搭。

**(2) 层次化（2 选 1 + 全加器）**

加减只差进位，和都是 $A\oplus B$：

$$
B'=B\oplus M_0,\qquad FA(A,B',M_0)\Rightarrow S=A\oplus B,\ C_o
$$

$$
F=M_1\,?\,\big[M_0?\,(A+B):AB\big]\,:\,S
$$

$$
CO=\overline{M_1}\cdot C_o
$$

即：1 个异或门（$B\oplus M_0$）+ 1 个全加器 + 与门、或门各 1 + 2 个二选一选择器（$M_0$ 选与/或，$M_1$ 选逻辑/算术）。

</details>

## 附 本章主要器件示意图与真值表

本章 6.1 ~ 6.45 反复用到 8 种集成器件，这里统一给出逻辑符号与功能表。**符号标注一律照教材**（图 6.5、6.13、6.21、6.23、6.20 及表 6.3、6.6、6.7、6.10、6.11）；图中引脚在框边带小圆圈者为低电平有效。

### 1. 74148 8 线-3 线优先编码器

![74148 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/37a6b25257e324ee066b6c61d3a1b6f7.svg)

输入 $\overline{I_7}\sim\overline{I_0}$、使能 $\overline{EN}$、输出 $\overline{Y_2}\overline{Y_1}\overline{Y_0}$ 全部低电平有效；$I_7$ 优先级最高。$Y_S$ 为选通输出（高有效，1 表示有有效输入），$\overline{Y_{EX}}$ 为扩展输出（低有效，用于级联）。

| $\overline{EN}$ | $\overline{I_7}$ | $\overline{I_6}$ | $\overline{I_5}$ | $\overline{I_4}$ | $\overline{I_3}$ | $\overline{I_2}$ | $\overline{I_1}$ | $\overline{I_0}$ | $\overline{Y_2}\overline{Y_1}\overline{Y_0}$ | $Y_S$ | $\overline{Y_{EX}}$ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| H | X | X | X | X | X | X | X | X | H H H | H | H |
| L | H | H | H | H | H | H | H | H | H H H | L | H |
| L | X | X | X | X | X | X | X | L | L L L | H | L |
| L | X | X | X | X | X | X | L | H | L L H | H | L |
| L | X | X | X | X | X | L | H | H | L H L | H | L |
| L | X | X | X | X | L | H | H | H | L H H | H | L |
| L | X | X | X | L | H | H | H | H | H L L | H | L |
| L | X | X | L | H | H | H | H | H | H L H | H | L |
| L | X | L | H | H | H | H | H | H | H H L | H | L |
| L | L | H | H | H | H | H | H | H | H H H | H | L |

> 教材图 6.5 把使能端记作 $\overline{EI}$、表 6.3 记作 $\overline{EN}$，本笔记统一用 $\overline{EN}$。

### 2. 74138 3 线-8 线译码器

![74138 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/bef1b2a91739cd33de39f6f209ee294f.svg)

$E_3$ 高有效，$\overline{E_1}$、$\overline{E_0}$ 低有效，三者同时满足才允许译码；输出 $\overline{Y_0}\sim\overline{Y_7}$ 低电平有效。

| $E_3$ | $\overline{E_1}$ | $\overline{E_0}$ | $A_2A_1A_0$ | 有效输出 |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 0 0 | $\overline{Y_0}$ |
| 1 | 0 | 0 | 0 0 1 | $\overline{Y_1}$ |
| 1 | 0 | 0 | 0 1 0 | $\overline{Y_2}$ |
| 1 | 0 | 0 | 0 1 1 | $\overline{Y_3}$ |
| 1 | 0 | 0 | 1 0 0 | $\overline{Y_4}$ |
| 1 | 0 | 0 | 1 0 1 | $\overline{Y_5}$ |
| 1 | 0 | 0 | 1 1 0 | $\overline{Y_6}$ |
| 1 | 0 | 0 | 1 1 1 | $\overline{Y_7}$ |
| 0 | × | × | × × × | 无（全部为 1） |
| × | 1 | × | × × × | 无（全部为 1） |
| × | × | 1 | × × × | 无（全部为 1） |

「有效输出」指该端输出 0，其余 7 个端全部输出 1。地址 $A_2A_1A_0$ 中 $A_0$ 为最低位。

### 3. 74139 双 2 线-4 线译码器

![74139 引脚图](https://s3.su.bcebos.com/izwarm-obsidian/2026/11/005fd9a25eeacb397862b6767aff7462.svg)

一片 16 脚封装内含两个独立的 2 线-4 线译码器，两半用 a、b 区分：a 半占 1~7 脚（8 脚 GND），b 半占 9~15 脚（16 脚 $V_{CC}$）。$\overline{E}$ 低有效，输出低有效。两半功能完全相同，下表对 a、b 两半通用。

| $\overline{E}$ | $A_1A_0$ | 有效输出 |
|---|---|---|
| 1 | × × | 无（全 1） |
| 0 | 0 0 | $\overline{O_{0}}$ |
| 0 | 0 1 | $\overline{O_{1}}$ |
| 0 | 1 0 | $\overline{O_{2}}$ |
| 0 | 1 1 | $\overline{O_{3}}$ |

> 引脚名带 a、b 后缀：a 半为 $\overline{E_a}$、$A_{0a}$、$A_{1a}$、$\overline{O_{0a}}\sim\overline{O_{3a}}$，b 半同形。教材表 6.6 的列序是 $A_0$、$A_1$，表中写作 $A_1A_0$ 是为了与二进制权位对应。

### 4. 7448 七段显示译码器

![7448 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/1a3446c2e85c37ddd200d29aa6a57b61.svg)

8421BCD 输入 $A_3A_2A_1A_0$（底部），段输出 $Y_a\sim Y_g$（顶部）高电平有效，配共阴极显示器。$\overline{LT}$ 灯测试、$\overline{RBI}$ 灭零输入、$\overline{BI}/\overline{RBO}$ 熄灭输入 / 灭零输出，均低有效。

| $A_3A_2A_1A_0$ | $Y_aY_bY_cY_dY_eY_fY_g$ | 显示 |
|---|---|---|
| 0 0 0 0 | 1 1 1 1 1 1 0 | 0 |
| 0 0 0 1 | 0 1 1 0 0 0 0 | 1 |
| 0 0 1 0 | 1 1 0 1 1 0 1 | 2 |
| 0 0 1 1 | 1 1 1 1 0 0 1 | 3 |
| 0 1 0 0 | 0 1 1 0 0 1 1 | 4 |
| 0 1 0 1 | 1 0 1 1 0 1 1 | 5 |
| 0 1 1 0 | 1 0 1 1 1 1 1 | 6 |
| 0 1 1 1 | 1 1 1 0 0 0 0 | 7 |
| 1 0 0 0 | 1 1 1 1 1 1 1 | 8 |
| 1 0 0 1 | 1 1 1 1 0 1 1 | 9 |
| 1 0 1 0 ~ 1 1 1 1 | 0 0 0 0 0 0 0 | 熄灭 |

特殊控制：$\overline{LT}=0$ 且 $\overline{RBO}=1$ 时 $Y_a\sim Y_g$ 全为 1（全亮，测试用）；$\overline{LT}=1$、$\overline{RBI}=0$ 且输入 0000 时 $Y_a\sim Y_g$ 全为 0 且 $\overline{RBO}=0$（灭零）；$\overline{BI}=0$ 时无论输入如何 $Y_a\sim Y_g$ 全为 0。

### 5. 74153 双 4 选 1 数据选择器

![74153 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/ebc556296f0681343296f0dd0ed54a74.svg)

两个 4 选 1 共用地址 $A_1$、$A_0$，各自有独立的低有效使能 $\overline{1S}$、$\overline{2S}$。$\overline{S}=1$ 时该半输出恒为 0。

| $\overline{S}$ | $A_1$ | $A_0$ | $W$ |
|---|---|---|---|
| 1 | × | × | 0 |
| 0 | 0 | 0 | $D_0$ |
| 0 | 0 | 1 | $D_1$ |
| 0 | 1 | 0 | $D_2$ |
| 0 | 1 | 1 | $D_3$ |

$$
W=\overline{A_0}\,\overline{A_1}D_0+A_0\overline{A_1}D_1+\overline{A_0}A_1D_2+A_0A_1D_3 \tag{6-9}
$$

### 6. 74151 8 选 1 数据选择器

![74151 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/12ae6aecc2eae0ad94f4b8586c0fd2f4.svg)

地址 $A_2A_1A_0$，$\overline{S}$ 低有效使能；$W$ 输出原码，$\overline{W}$ 输出反码。

| $\overline{S}$ | $A_2$ | $A_1$ | $A_0$ | $W$ | $\overline{W}$ |
|---|---|---|---|---|---|
| 1 | × | × | × | 0 | 1 |
| 0 | 0 | 0 | 0 | $D_0$ | $\overline{D_0}$ |
| 0 | 0 | 0 | 1 | $D_1$ | $\overline{D_1}$ |
| 0 | 0 | 1 | 0 | $D_2$ | $\overline{D_2}$ |
| 0 | 0 | 1 | 1 | $D_3$ | $\overline{D_3}$ |
| 0 | 1 | 0 | 0 | $D_4$ | $\overline{D_4}$ |
| 0 | 1 | 0 | 1 | $D_5$ | $\overline{D_5}$ |
| 0 | 1 | 1 | 0 | $D_6$ | $\overline{D_6}$ |
| 0 | 1 | 1 | 1 | $D_7$ | $\overline{D_7}$ |

$$
W=\sum_{i=0}^{7}m_i D_i \tag{6-11}
$$

### 7. 7485 4 位数值比较器

![7485 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/58c8babc1e973cf889a79c2336604606.svg)

三个输出均高有效。$a>b$、$a<b$、$a=b$ 是小写的级联输入：单片使用时接 $0$、$0$、$1$；多片级联时低位片的三个输出接高位片的对应输入。

| A 与 B 的关系 | $O_{A>B}$ | $O_{A<B}$ | $O_{A=B}$ |
|---|---|---|---|
| $A>B$ | 1 | 0 | 0 |
| $A<B$ | 0 | 1 | 0 |
| $A=B$ | 0 | 0 | 1 |

$$
O_{A=B}=(A_0\odot B_0)(A_1\odot B_1)(A_2\odot B_2)(A_3\odot B_3)(a=b) \tag{6-35}
$$

### 8. 74283 4 位二进制加法器

![74283 逻辑符号](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/9ce71c65e13e8a9e29d4af607652e7c5.svg)

$$
\{C_0,\,S_3S_2S_1S_0\}=P_3P_2P_1P_0+Q_3Q_2Q_1Q_0+C_{-1}
$$

| $C_{-1}$ | 功能 |
|---|---|
| 0 | 输出 4 位和 $S$，$C_0$ 为向高位的进位 |
| 1 | 输出 $P+Q+1$，即作加 1（增量）运算 |

两个常用接法：$C_{-1}=0$ 直接作加法器；把 $Q$ 逐位取反再令 $C_{-1}=1$，即得 $P-Q$（补码减法，$C_0$ 取反后为借位标志）。级联时低位片的 $C_0$ 接高位片的 $C_{-1}$。

