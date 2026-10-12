---
title: "第2章 数制与码制"
slug: "signals/dcs/ch2"
description: "(1) 1011.101"
publishDate: "2026-09-07"
createdAt: "2026-09-07T00:00:00Z"
updatedDate: "2026-09-10T10:25:05"
tags: ["signals"]
series: ["Signals","数字电路与系统"]
---

## 2.1 将下列二进制数转换为十进制数。

(1) 1011.101
(2) 1110111.01
(3) 1010.11
(4) 1010010.101

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $1011.101_{2} = 11.625_{10}$

(2) $1110111.01_{2} = 119.25_{10}$

(3) $1010.11_{2} = 10.75_{10}$

(4) $1010010.101_{2} = 82.625_{10}$

</details>

## 2.2 将下列十进制数转换为二进制数。

(1) 52.75
(2) 11.125
(3) 127.25
(4) 75.32

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $52.75_{10} = 110100.11_{2}$

(2) $11.125_{10} = 1011.001_{2}$

(3) $127.25_{10} = 1111111.01_{2}$

(4) $75.32_{10} = 1001011.01010001111010111000\dots$（小数部分 $0.32$ 为**无限循环**二进制 $0.\overline{01010001111010111000}$，周期 20 位；取 20 位小数近似为 $1001011.01010001111010111000$）

</details>

## 2.3 计算下列两个二进制数 $A$、$B$ 的 $A+B$、$A-B$、$A\times B$、$A\div B$ 的值。

(1) $A=10101$，$B=1001$
(2) $A=1010101$，$B=101000$
(3) $A=101$，$B=1010$
(4) $A=1011.101$，$B=100.01$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $A=10101$，$B=1001$（即 21、9）

　$A+B = 11110 = 30$

　$A-B = 1100 = 12$

　$A\times B = 10111101 = 189$

　$A\div B = 10.(01)（循环） = 2.3333333333$

(2) $A=1010101$，$B=101000$（即 85、40）

　$A+B = 1111101 = 125$

　$A-B = 101101 = 45$

　$A\times B = 110101001000 = 3400$

　$A\div B = 10.001 = 2.125$

(3) $A=101$，$B=1010$（即 5、10）

　$A+B = 1111 = 15$

　$A-B = -101 = -5$

　$A\times B = 110010 = 50$

　$A\div B = 0.1 = 0.5$

(4) $A=1011.101$，$B=100.01$（即 11.625、4.25）

　$A+B = 1111.111 = 15.875$

　$A-B = 111.011 = 7.375$

　$A\times B = 110001.01101 = 49.40625$

　$A\div B = 10.1(01111000)（循环） = 2.7352941176$

</details>

## 2.4 将下列二进制数转换为八进制数。

(1) 10110.01
(2) 1110101.01
(3) 11010.011
(4) 10100.0101

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10110.01 \rightarrow 26.2$

(2) $1110101.01 \rightarrow 165.2$

(3) $11010.011 \rightarrow 32.3$

(4) $10100.0101 \rightarrow 24.24$

</details>

## 2.5 将下列八进制数转换为二进制数。

(1) 76.23
(2) 11.12
(3) 160.15
(4) 34.75

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $76.23 \rightarrow 111110.010011$

(2) $11.12 \rightarrow 1001.001010$

(3) $160.15 \rightarrow 1110000.001101$

(4) $34.75 \rightarrow 11100.111101$

</details>

## 2.6 将下列二进制数转换为十六进制数。

(1) 10101.011
(2) 11100101.101
(3) 110010.1101
(4) 101001.10101

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10101.011 \rightarrow 15.6$

(2) $11100101.101 \rightarrow E5.A$

(3) $110010.1101 \rightarrow 32.D$

(4) $101001.10101 \rightarrow 29.A8$

</details>

## 2.7 将下列十六进制数转换为二进制数。

(1) 1F3.2
(2) BA02.35
(3) E369.FE
(4) 1C8.01

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $1F3.2 \rightarrow 111110011.0010$

(2) $BA02.35 \rightarrow 1011101000000010.00110101$

(3) $E369.FE \rightarrow 1110001101101001.11111110$

(4) $1C8.01 \rightarrow 111001000.00000001$

</details>

## 2.8 将下列八进制数转换为十六进制数。

(1) 126.2
(2) 6301.35
(3) 1361.76
(4) 526.02

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $126.2 \rightarrow 56.4$

(2) $6301.35 \rightarrow CC1.74$

(3) $1361.76 \rightarrow 2F1.F8$

(4) $526.02 \rightarrow 156.08$

</details>

## 2.9 将下列十六进制数转换为八进制数。

(1) 2F7.3A
(2) AB2.05
(3) F328.106
(4) 1C8.EF

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $2F7.3A \rightarrow 1367.164$

(2) $AB2.05 \rightarrow 5262.012$

(3) $F328.106 \rightarrow 171450.0406$

(4) $1C8.EF \rightarrow 710.736$

</details>

## 2.10 写出下列二进制数的 8 位原码。

(1) 10101
(2) -10101
(3) -1101
(4) 101101
(5) 0

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10101 \rightarrow$ 00010101

(2) $-10101 \rightarrow$ 10010101

(3) $-1101 \rightarrow$ 10001101

(4) $101101 \rightarrow$ 00101101

(5) $0 \rightarrow$ 00000000

（$0$ 的原码为 00000000；8 位原码中 $-0$ 写作 10000000。）

</details>

## 2.11 写出下列二进制数的 8 位反码。

(1) 10111
(2) -10101
(3) -1001
(4) 111111
(5) 0

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10111 \rightarrow$ 00010111

(2) $-10101 \rightarrow$ 11101010

(3) $-1001 \rightarrow$ 11110110

(4) $111111 \rightarrow$ 00111111

(5) $0 \rightarrow$ 00000000

（正数的反码与原码相同；负数反码＝符号位 1、数值位按位取反。）

</details>

## 2.12 写出下列二进制数的 8 位补码，并将补码进行符号扩展求得 16 位的补码。

(1) 101011
(2) -101001
(3) -111111
(4) 111111
(5) 0

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $101011$：8 位补码 00101011；16 位补码（符号扩展）00000000 00101011

(2) $-101001$：8 位补码 11010111；16 位补码（符号扩展）11111111 11010111

(3) $-111111$：8 位补码 11000001；16 位补码（符号扩展）11111111 11000001

(4) $111111$：8 位补码 00111111；16 位补码（符号扩展）00000000 00111111

(5) $0$：8 位补码 00000000；16 位补码（符号扩展）00000000 00000000

</details>

## 2.13 写出下列二进制原码对应的反码和补码。

(1) 10101011
(2) 00100011
(3) 11111111
(4) 00000000

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) 原码 $10101011$（真值 -43）：反码 11010100；补码 11010101

(2) 原码 $00100011$（真值 35）：反码 00100011；补码 00100011

(3) 原码 $11111111$（真值 -127）：反码 10000000；补码 10000001

(4) 原码 $00000000$（真值 0）：反码 00000000；补码 00000000

</details>

## 2.14 写出下列二进制反码对应的原码和补码。

(1) 10101001
(2) 01101011
(3) 11111111
(4) 00000000

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) 反码 $10101001$（真值 -86）：原码 11010110；补码 10101010

(2) 反码 $01101011$（真值 107）：原码 01101011；补码 01101011

(3) 反码 $11111111$（真值 0）：原码 10000000；补码 00000000（$-0$ 的补码按 8 位截断为 00000000）

(4) 反码 $00000000$（真值 0）：原码 00000000；补码 00000000

</details>

## 2.15 写出下列二进制补码对应的原码和反码。

(1) 10101011
(2) 01001010
(3) 111111111
(4) 00000000

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) 补码 $10101011$（真值 -85）：原码 11010101；反码 10101010

(2) 补码 $01001010$（真值 74）：原码 01001010；反码 01001010

(3) 补码 $11111111$（真值 -1）：原码 10000001；反码 11111110

(4) 补码 $00000000$（真值 0）：原码 00000000；反码 00000000

（第 (3) 题原文写作 9 位 `111111111`，按 8 位 $11111111$ 处理，需与纸书核对。）

</details>

## 2.16 计算下列两个无符号数相减的结果，并用十进制表示结果。

(1) 010101-001101
(2) 010001-011010
(3) 111010-000101
(4) 101010-100101

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $010101 - 001101 = 001000_{(2)} = 8_{(10)}$ 

(2) $010001 - 011010 = -1001_{(2)} = -9_{(10)}$ （数值为负，无符号表示需向高位借位）

(3) $111010 - 000101 = 110101_{(2)} = 53_{(10)}$ 

(4) $101010 - 100101 = 000101_{(2)} = 5_{(10)}$ 

</details>

## 2.17 计算下列两个补码相减的结果，并用十进制表示结果（减法变成加法运算）。

(1) 110010-110101
(2) 100100-011010
(3) 011011-001111
(4) 011111-100011

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $110010 - 110101 = 110010 + 001011 = 111101$（$-14 - (-11) = -3$）—— 结果 111101（6 位）

(2) $100100 - 011010 = 100100 + 100110 = 001010$（有进位 1，舍去）（$-28 - 26 = -54$）—— 6 位装不下，按 8 位补码写作 11001010

(3) $011011 - 001111 = 011011 + 110001 = 001100$（有进位 1，舍去）（$27 - 15 = 12$）—— 结果 001100（6 位）

(4) $011111 - 100011 = 011111 + 011101 = 111100$（$31 - (-29) = 60$）—— 6 位装不下，按 8 位补码写作 00111100

（`-` 号操作数取补码即「按位取反加 1」；第 (2)(4) 题结果超出 6 位补码范围 $[-32,31]$，已给出 8 位形式。）

</details>

## 2.18 假设字长 8 位，用二进制补码计算下列两个数 $A$、$B$ 的 $A+B$、$A-B$、$-A+B$、$-A-B$，用十进制数验证；如果结果出现异常，请解释原因。

(1) $A=1010100$，$B=1011$
(2) $A=1110100$，$B=101111$
(3) $A=1101010$，$B=0101110$
(4) $A=1000000$，$B=0111101$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $A=1010100$（$-44$），$B=1011$（$-5$）

　$A+B = 11001111 = -49_{(10)}$

　$A-B = 11011001 = -39_{(10)}$

　$-A+B = 00100111 = 39_{(10)}$

　$-A-B = 00110001 = 49_{(10)}$

(2) $A=1110100$（$-12$），$B=101111$（$-17$）

　$A+B = 11100011 = -29_{(10)}$

　$A-B = 00000101 = 5_{(10)}$

　$-A+B = 11111011 = -5_{(10)}$

　$-A-B = 00011101 = 29_{(10)}$

(3) $A=1101010$（$-22$），$B=0101110$（$46$）

　$A+B = 00011000 = 24_{(10)}$

　$A-B = 10111100 = -68_{(10)}$

　$-A+B = 01000100 = 68_{(10)}$

　$-A-B = 11101000 = -24_{(10)}$

(4) $A=1000000$（$-64$），$B=0111101$（$61$）

　$A+B = 11111101 = -3_{(10)}$

　$A-B = 10000011 = -125_{(10)}$

　$-A+B = 01111101 = 125_{(10)}$

　$-A-B = 00000011 = 3_{(10)}$

（8 位补码范围 $[-128,127]$；上列结果均落在范围内，无溢出异常。）

</details>

## 2.19 16 位的计算机采用二进制补码运算，求出下列十进制数的运算结果。

(1) $13820+2726$
(2) $13850-2925$
(3) $2675-16550$
(4) $-13350-2836$

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $13820+2726 = 16546_{(10)}$，16 位补码：01000000 10100010

(2) $13850-2925 = 10925_{(10)}$，16 位补码：00101010 10101101

(3) $2675-16550 = -13875_{(10)}$，16 位补码：11001001 11001101

(4) $-13350-2836 = -16186_{(10)}$，16 位补码：11000000 11000110

（16 位补码范围 $[-32768,32767]$，四小题均无溢出。）

</details>

## 2.20 计算下列两个反码相减的结果，并用十进制表示结果（减法变成加法运算）。

(1) 110011-110110
(2) 100110-011000
(3) 011010-011110
(4) 011111-100011

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $110011 - 110110 = 110011 + 001001 = 111100$

　（$-12 - (-9) = -3$）—— 结果 111100

(2) $100110 - 011000 = 100110 + 100111 = 001110（循环进位 1，已加回末位）$

　（$-25 - 24 = -49$）—— 6 位装不下，按 8 位反码写作 11001110

(3) $011010 - 011110 = 011010 + 100001 = 111011$

　（$26 - 30 = -4$）—— 结果 111011

(4) $011111 - 100011 = 011111 + 011100 = 111011$

　（$31 - (-28) = 59$）—— 6 位装不下，按 8 位反码写作 00111011

（反码减法：减数取反码相加，若有循环进位须加回末位；第 (2)(4) 题结果超出 6 位反码范围 $[-31,31]$，已给出 8 位形式。）

</details>

## 2.21 用 8421 BCD 码表示下列各数。

(1) 751
(2) 122
(3) 946
(4) 512

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $751 \rightarrow$ 0111 0101 0001

(2) $122 \rightarrow$ 0001 0010 0010

(3) $946 \rightarrow$ 1001 0100 0110

(4) $512 \rightarrow$ 0101 0001 0010

（每 4 位一组表示一位十进制数；8421 BCD。）

</details>

## 2.22 用余 3 BCD 码表示下列各数。

(1) 763
(2) 139
(3) 896
(4) 502

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $763 \rightarrow$ 1010 1001 0110

(2) $139 \rightarrow$ 0100 0110 1100

(3) $896 \rightarrow$ 1011 1100 1001

(4) $502 \rightarrow$ 1000 0011 0101

（每 4 位一组表示一位十进制数；余 3 BCD。）

</details>

## 2.23 将下列 8421 BCD 码表示的数还原成十进制数。

(1) 10010111
(2) 0101100111
(3) 11101111001
(4) 10100000010

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10010111 = 1001 0111 \rightarrow 97$

(2) $0101100111 = 0001 0110 0111 \rightarrow 167$　（原文 10 位，左补 2 个 0 后分组）

(3) $11101111001 = 0111 0111 1001 \rightarrow 779$　（原文 11 位，左补 1 个 0 后分组）

(4) $10100000010 = 0101 0000 0010 \rightarrow 502$　（原文 11 位，左补 1 个 0 后分组）

（第 (2) 题原文为 10 位，其余为 11、8、11 位，均非 4 的倍数；按左补 0 到 4 的倍数分组，结果分别为 97、167、779、502，第 (2) 题建议与纸书核对。）

</details>

## 2.24 将下列余 3 BCD 码表示的数还原成十进制数。

(1) 10111001000
(2) 101000110110
(3) 10000101
(4) 101110111

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $10111001000 = 0101 1100 1000 \rightarrow 295$　（原文 11 位，左补 1 个 0 后分组）

(2) $101000110110 = 1010 0011 0110 \rightarrow 703$

(3) $10000101 = 1000 0101 \rightarrow 52$

(4) $101110111$（9 位）：左补 0 后为 0001 0111 0111，其中 0001 小于 0011，不是合法余 3 码。若按前 8 位 $10111011$ 读作 1011 1011 则为 88；按后 8 位 $01110111$ 则为 44。**原文位数有误，需与纸书核对。**

（余 3 码每位减去 0011 即为十进制数字。）

</details>

## 2.25 实现下列无符号数的减法，其中减数采用十的补数表示。如果结果为负，写出其十的补数，并在其前加上一个负号，验证答案的正确性。

(1) 7137-3068
(2) 153-2102
(3) 2898-7792
(4) 1352-870

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $7137 - 3068$：减数取十的补数 $6932$（$10000-3068$），$7137 + 6932 = 14069$，舍去最高位进位得 **4069**

(2) $153 - 2102$：$153 + 7898 = 8051$，无进位，结果为负；$8051$ 的十的补数为 $1949$，故结果为 **-1949**

(3) $2898 - 7792$：$2898 + 2208 = 5106$，无进位，结果为负；$5106$ 的十的补数为 $4894$，故结果为 **-4894**

(4) $1352 - 870$：减数取十的补数 $9130$（$10000-870$），$1352 + 9130 = 10482$，舍去最高位进位得 **482**

（有进位→结果为正，舍去进位即得；无进位→结果为负，取其十的补数并冠以负号。）

</details>

## 2.26 求出信息数据 $B_{4}B_{3}B_{2}B_{1}$ 为 0101 的海明码，要求偶校验。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

按书中表 2.13 的写法，海明码写成 $i_3i_2i_1i_0c_2c_1c_0$（**信息位在前、校验位在后**），内部按位置 $1\sim7$ 排布，校验位占 1、2、4 位，信息位 $i_0i_1i_2i_3$ 依次占 3、5、6、7 位。

信息 $i_3i_2i_1i_0 = 0101$，即 $i_0=1,\,i_1=0,\,i_2=1,\,i_3=0$。偶校验：

$c_0 = i_0 \oplus i_1 \oplus i_3 = 1$，$c_1 = i_0 \oplus i_2 \oplus i_3 = 0$，$c_2 = i_1 \oplus i_2 \oplus i_3 = 1$

故海明码为 $\boxed{0101\,101}$（即 0101101）。

（与表 2.13 中信息 0101 对应的 1 类海明码 0101101 一致。）

</details>

## 2.27 求出信息数据 $B_{7}B_{6}B_{5}B_{4}B_{3}B_{2}B_{1}$ 为 1001011 的海明码，假设为偶校验。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

7 位信息需要 4 个校验位（$2^4-1=15 \ge 11$），故为 $(11,7)$ 海明码，按表 2.13 的写法为信息位 $B_7\dots B_1$ 后接校验位 $c_3c_2c_1c_0$。

内部位置：校验位占 1、2、4、8 位，信息位 $B_1,B_2,\dots,B_7$ 依次占 3、5、6、7、9、10、11 位。偶校验下各校验位为（直接由位置分组得到）：

$c_0 = B_1 \oplus B_2 \oplus B_4 \oplus B_5 \oplus B_7$，$c_1 = B_1 \oplus B_3 \oplus B_4 \oplus B_6 \oplus B_7$，$c_2 = B_2 \oplus B_3 \oplus B_4$，$c_3 = B_5 \oplus B_6 \oplus B_7$

$B_7\dots B_1 = 1001011$，即 $B_1=1,B_2=1,B_3=0,B_4=1,B_5=0,B_6=0,B_7=1$，代入得 $c_3c_2c_1c_0 = 1010$。

故海明码为 $\boxed{1001011\;1010}$（即 10010111010）。

</details>

## 2.28 海明码为 10110010011，如果在数据传输中发生了一位错误，变成 10010010011，试对该数据进行纠错。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

题面给出的两个码字 $10110010011$、$10010010011$，只有按**位置排列**读才自洽：11 位中第 1、2、4、8 位是校验位，其余为信息位，均按偶校验。

先验证 $10110010011$：四组校验分别为 $(1,3,5,7,9,11)$、$(2,3,6,7,10,11)$、$(4,5,6,7)$、$(8,9,10,11)$，1 的个数都是偶数，确为合法码字。

对 $10010010011$ 计算校验和 $S_8S_4S_2S_1 = 0011$，即**第 3 位出错**。

第 3 位是信息位 $B_1$，取反纠错后得 $\boxed{10110010011}$，与原始海明码恢复一致。

> ⚠️ 约定提示：2.26、2.27 按表 2.13 的"信息位 + 校验位"写法作答；而本题给的两个码字只有在"按位置 1~11 排列"的读法下才满足偶校验（例如 10110010011 的前 7 位 1011001 配校验位 0011 并非表 2.13 规则的合法码，应为 1011）。两题约定不一致，建议与纸书核对。

</details>

