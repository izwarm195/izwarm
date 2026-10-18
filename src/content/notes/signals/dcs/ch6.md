---
title: "第6章 常用的组合逻辑功能器件"
slug: "signals/dcs/ch6"
description: "（1）同一时刻只允许一个单位提出使用请求，设备只允许该单位使用；"
publishDate: "2026-10-18"
createdAt: "2026-10-18T00:00:00Z"
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

(2)  $EI=0, I_{4}=0$，其余为1；

(3)  $EI=0, I_{2}=0, I_{3}=0$，其余为1；

(4)  $EI = 0$,  $I_0 \sim I_7$ 全为 0;

(5)  $EI = 0, I_{0} \sim I_{7}$ 全为1。

## 6.5 用2-4线译码器74139和适当的门电路实现多输出函数

(1)  $Y_{1} = \overline{A_{1}} A_{0} + A_{1} \overline{A_{0}}$;

(2)  $Y_{2} = A_{1}A_{0} + A_{1}A_{0}$;

## 6.6 用五个带使能端的2线-4线译码器可以构建一个4线-16线的译码器。在题6.6图中，

（1）写出使译码器 U1 ~ U4 产生有效的译码输出时，C、D 对应的取值；

(2) 当译码器 U1 工作时，写出对应 A、B 的取值时， $\overline{Y}_{10} \sim \overline{Y}_{13}$ 的输出。

![题6.6图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//77e56f99-4c6a-4ddd-bb7d-adb14575e874/markdown_2/imgs/img_in_image_box_292_81_667_837.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A53Z%2F-1%2F%2Fd1867a685151926db779e02aa6cb107a65c8b8b54ad48798678c66110fe3435f)

## 6.7 试用一个优先编码器 74148 和一个译码器 74138 将 3 位格雷码转换为 3 位二进制码。

## 6.8 写出题 6.8 图所示电路的逻辑函数，并将其化简为最简与 - 或表达式。

![题6.8图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//77e56f99-4c6a-4ddd-bb7d-adb14575e874/markdown_2/imgs/img_in_image_box_299_966_677_1254.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A54Z%2F-1%2F%2F9f6c51228225291cba476c02b328b35f40e2da2f2be0a67b3832bccd50da9f0a)

## 6.9 用74138译码器构成题6.9图所示电路，写出输出F的逻辑表达式，列出真值表并说明电路功能。

![题6.9图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_0/imgs/img_in_image_box_143_75_521_375.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2Fc932b564c002f8653abf754df041c6eac0a4ad054a43f49a3a933c33a552074e)

## 6.10 题6.10图所示电路是由译码器74138及门电路构成的地址译码电路。试列出此译码电路每个输出对应的地址，要求输入地址 $A_{7}\sim A_{0}$用十六进制数码表示。

![题6.10 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_0/imgs/img_in_image_box_636_87_910_379.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A52Z%2F-1%2F%2F511f95a53c306fcefd71d90643bd45502d2e5fe48a8a3be309d3e2653199993a)

## 6.11 试画出译码器74138和门电路产生如下多输出逻辑函数的逻辑图。

（1） $F_{1}=AB$

(2)  $F_{2}=A\ \overline{B}C+AB\ \overline{C}+BC$

(3)  $F_{3}=A\ \overline{BC}+\overline{AB}C$

## 6.12 试用译码器74138和最少的与非门实现逻辑函数

(1)  $F = f(A, B, C) = \sum m(0, 1, 4, 7)$

(2)  $F = f(A, B, C) = A \odot B \odot C$

## 6.13 试用译码器和与非门画出实现下列逻辑函数的逻辑图。

(1)  $Y_1 = \sum m(2,3,4,5)$

(2)  $Y_2 = \sum m(1,2,5,7)$

## 6.14 用译码器 74138 和门电路设计 1 位二进制全减器电路。输入为被减数、减数和来自低位的借位；输出为两数之差及向高位的借位信号。

## 6.15 写出题6.15图中 $Z_{1}$、 $Z_{2}$、 $Z_{3}$的逻辑函数式，并化简为最简的与-或表达式。

![题6.15 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_0/imgs/img_in_image_box_332_857_714_1165.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A52Z%2F-1%2F%2F5ea66056cbc9854c8109ece2fb2f75b3ffa18a68566dcfcf70e89e9d7677d66f)

## 6.16 用二-十进制编码器、译码器、七段显示器，组成一个1位数码显示电路。当0~9十个输入端中某一个接地时，显示相应数码，画出逻辑图。

## 6.17 试用七段集成显示译码器 7448 和七段显示器组成一个 3 位数字的译码显示电路，要求将 089 显示成 89，画出逻辑图。

## 6.18 根据题6.18图所示4选1数据选择器74153（1/2），写出输出Z的最简与-或表达式。

![题6.18 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_1/imgs/img_in_image_box_330_80_629_322.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A53Z%2F-1%2F%2Fe13b0abaa2d656efeca9f70084246701f4131211dd74d875b5a54420b8d5f44a)

## 6.19 由4选1数据选择器74153构成的组合逻辑电路如题6.19图(a)所示，画出题6.19图(b)所示输入

信号作用下，F的输出波形。

![题6.19 图(a)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_1/imgs/img_in_image_box_207_411_500_652.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A53Z%2F-1%2F%2F56bb53ef13179788b4256e4c6c30ea207f21c9065c3dfe127154734e0e2a90e3)

![题6.19 图(b)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_1/imgs/img_in_image_box_576_443_741_644.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A53Z%2F-1%2F%2F5a8441acaf991f7beaceccffc37d23990e81283a20cffa9ab4fb8397e819febc)

## 6.20 由4选1数据选择器74153和门电路构成的组合逻辑电路如题6.20图所示，试写出输出F的最简逻辑函数表达式。

![题6.20图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_1/imgs/img_in_image_box_246_807_703_1103.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A53Z%2F-1%2F%2Fbca69cc9639ecc653e48360da255d3c1cb573bf14d9860e417d609cfa00b047d)

## 6.21 题 6.21 图是用两个 4 选 1 数据选择器组成的逻辑电路，试写出输出 F 与输入 M、N、P、Q 之间的逻辑函数。

![题6.21 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_2/imgs/img_in_image_box_210_79_809_382.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A54Z%2F-1%2F%2F16a000681678df85d5dd5b1031f8d257a87bee5d00824c399733761e31594b50)

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

![题6.27 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_2/imgs/img_in_image_box_341_618_686_827.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A54Z%2F-1%2F%2F71951a4585702406567e2cdfc1ad69b5217f5cf147122048c37f30a6b006363b)

## 6.28 分析题 6.28 图所示电路，写出输出 F 的逻辑函数式。

![题6.28 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//313e5767-ee83-4d47-9adf-9d4b6d5649ae/markdown_2/imgs/img_in_image_box_340_921_694_1168.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A54Z%2F-1%2F%2F134542c9c0e00d29a2332e5dd104496ad6b9a0afe26a4e047738727a539031ab)

## 6.29 试用1片8选1数据选择器设计一个8421BCD码的非法码（0~9以外的4位二进制代码）检测器，画出逻辑图。

## 6.30 试用1个8选1数据选择器74151和非门实现函数

$$
\boldsymbol{Y}=\boldsymbol{E}+\left(\boldsymbol{A}+\boldsymbol{B}+\overline{\boldsymbol{C}}\right)\left(\overline{\boldsymbol{A}}+\boldsymbol{C}+\boldsymbol{B}\boldsymbol{F}\right)\left(\overline{\boldsymbol{B}}+\overline{\boldsymbol{C}}+\overline{\boldsymbol{A}}\overline{\boldsymbol{D}}\right)\left(\boldsymbol{A}+\boldsymbol{C}+\overline{\boldsymbol{B}}\overline{\boldsymbol{F}}\right)
$$

## 6.31 试用数据选择器 74151 分别实现下列逻辑函数

(1)  $F_{1} = \sum m(1,2,3,5,7)$

(2)  $F_2 = \sum m(2,4,5,7,8,10,11,13,14)$

(3)  $F_3 = \sum m(0,1,4,5,6,7,8) + \sum d(9,10,11,12,13,14)$

## 6.32 题6.32图是74138作数据分配器的逻辑图，当EN=1,D=0，在地址输入端轮流输入000~111时，画输出端 $Y_{0}\sim Y_{7}$的波形。

![题6.32 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//9005024a-7a18-4ef0-89d4-8bd6b775508c/markdown_0/imgs/img_in_image_box_341_232_587_467.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A41Z%2F-1%2F%2F76c1896a2a88950f9787e4b09556b3f2a9c0ffaf6b00332f1a454e9d24ef55b1)

## 6.33 试用3片4位数值比较器7485实现两个12位二进制数比较。

## 6.34 试用1片4位数值比较器7485和适量的门电路实现两个5位数值的比较。

## 6.35 试用4位二进制数值比较器7485实现一个判断8位二进制数大于、等于或小于168的逻辑电路，可使用多片7485。

## 6.36 若使用4位数值比较器7485组成10位数值比较器，需要用几片？画出各片之间连接的逻辑图。

## 6.37 试用一片译码器74138和少量的门电路设计一个奇偶校验电路，当输入变量ABCD中有偶数个1时为1，否则为0。ABCD为0000时作偶数个1。

## 6.38 用2个4位二进制加法器74283和适量门电路设计三个4位二进制数相加的逻辑电路。

## 6.39 试用1片74283和少量的门电路设计余3BCD码到2421BCD码的转换电路。

## 6.40 试用4位加法器74283和必要的门电路设计一个加/减运算电器。当控制信号M=0时，两个输入的二进制数相加；当M=1时，两个输入的4位二进制数相减。

## 6.41 用74283设计将余3代码转换成8421BCD的逻辑电路。

## 6.42 用尽量少的74283电路和适当的门电路设计1位余3BCD码的全加器电路。

## 6.43 用两片 74283 和适当的门电路设计 1 位 8421BCD 码的全减电路。

## 6.44 用两片 74283 和适当的门电路设计 1 位余 3BCD 码的全减电路。

## 6.45 根据输入的运算命令（命令是两位二进制数码，自行定义），设计一个电路完成两个1位二进制数A，加、减、与、或四种运算，运算的结果用F输出，进位或者借位用CO输出。要求采用下列两种方法进行设计：

（1）最少化设计方法，采用与非门；

（2）层次化设计方法，可使用二选一数据选择器，1位全加器和适当的门电路。

