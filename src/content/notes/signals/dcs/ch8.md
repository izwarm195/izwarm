---
title: "第8章 时序逻辑电路的分析与设计"
slug: "signals/dcs/ch8"
description: "题8.2 图(a)"
publishDate: "2026-10-18"
createdAt: "2026-10-18T00:00:00Z"
tags: ["signals"]
series: ["Signals","数字电路与系统"]
---

## 8.1 试说明组合逻辑电路与时序逻辑电路在电路结构和输入输出关系上的区别。

## 8.2 试画出题8.2图(a)所示电路的输出Y、Z波形。输入信号A和时钟CP的波形如题8.2图(b)所示，触发器的初始状态为0。

![题8.2 图(a)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_1/imgs/img_in_image_box_296_923_705_1082.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A49Z%2F-1%2F%2F1261d1f3a018798887aa3793d5c3614c408c146594b95559dd0a1b1bd454c57c)

![题8.2 图(b)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_1/imgs/img_in_image_box_290_1107_732_1204.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A50Z%2F-1%2F%2F9e4289fe515286f1a700982447774d4d6ed196d8557c7bb472e2e2c1e478da05)

## 8.3 电路的时序图如题8.3图所示，画出电路的状态转换图，其中Y为输出。

## 8.4 电路的时序图如题8.4图所示，画出电路的状态转换真值表和状态转移图，其中X为输入，Y为输出。

![题8.4 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_2/imgs/img_in_image_box_220_92_723_539.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2F8e354b50937dec87aedc16daf9eaea44e282dd133afc901df7975e59c7ec061e)

## 8.5 两个前边沿 D 触发器构成的同步时序逻辑电路驱动方程和输出方程为

$$
D_{1}=X_{1}X_{2}+X_{1}Q_{1}^{n}+X_{2}Q_{2}^{n}
$$

$$
D_{2}=X_{1}\oplus X_{2}\oplus Q_{1}^{~}
$$

$$
Z=Q_{2}^{*}
$$

输入信号的波形如题8.5图所示，试画出初态为00时 $Q_{1}$、 $Q_{2}$和Z的波形。

![题8.5图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_2/imgs/img_in_image_box_260_698_679_839.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2Fe47a73a0db692b24e43791411d0673e93f0b58f91c44c1c8d1a21753906162ca)

## 8.6 电路如题8.6图(a)所示，画出题8.6图(b)中的 $Q_{0}$、 $Q_{1}$波形（初始状态为00）。

![题8.6 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_2/imgs/img_in_image_box_137_912_458_1072.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2F33aac87f3afd717fd78b8dd983d322f8abfa1f75cea8934b0065d4473d50862c)

![题8.6 图(b)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_2/imgs/img_in_image_box_516_918_812_1089.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2Ff1ffa5f5eb50cb36e64737dbf978f594c1b67ebd1a40367abcb18c33a36cbe7e)

## 8.7 电路如题8.7图所示，画出在脉冲作用下 $Q_{3}Q_{2}Q_{1}Q_{0}$的输出波形（初态为0000）。

![题8.7图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//aa506a3d-0b97-4b4d-b39e-a70e5fdd1052/markdown_2/imgs/img_in_image_box_149_1193_796_1430.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2F427f2c45697f95769d9bef9edcd24a485965505120bb56bc5e7eb78ec3f8be86)

## 8.8 写出题8.8图所示电路的状态转移方程、输出方程、状态转移真值表、状态转换图和时序图。

![题8.8图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_0/imgs/img_in_image_box_281_108_766_290.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A41Z%2F-1%2F%2Fe1c3e1387432130eb77981b7acb650477a5c5341eb47260f7d5585bc6e200877)

## 8.9 电路如题8.9图(a)所示，在题8.9图(b)中画出Q的波形，触发器的初始状态为0。

![题8.9图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_0/imgs/img_in_image_box_101_368_946_593.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A41Z%2F-1%2F%2F32ed2b18e76f5c1a4eaecb7f3c0436ed99d527a0e4166244302f6d8de55d6cdc)

## 8.10 分析题 8.10 图所示电路, 写出状态转移真值表和状态转换图。

![题8.10图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_0/imgs/img_in_image_box_255_681_789_960.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A41Z%2F-1%2F%2Faf4e61fdaf13186fef5987553a5380ac6bc5e3c68fd0e7cc974b2b12a4962bb5)

## 8.11 电路如题 8.11 图所示，两个触发器的初态都为 0，画出 Z 的波形。

![题8.11 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_0/imgs/img_in_image_box_320_1051_724_1274.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A41Z%2F-1%2F%2F100f5d9dffbfc0f798b333a844943c42d5eef3144d2f21e13f1b51be3f56b16d)

## 8.12 分析题 8.12 图所示电路，写出状态转移方程、输出方程、状态转移表、状态图和时序图。

![题8.12图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_1/imgs/img_in_image_box_304_889_771_1093.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A42Z%2F-1%2F%2F397f013f1f0f9edca3a49d313f4cf402c3bea050c4eea8a2e8058965e8712020)

## 8.13 分析题 8.13 图所示的逻辑电路，写出状态转移方程、状态转移表和状态图。

![题8.13图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_1/imgs/img_in_image_box_263_561_800_835.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A42Z%2F-1%2F%2F2ec856cfc73d560ac68f1cdfa50610e6cd1d247ebb41cdd31fb43e8f867149b5)

## 8.14 分析题 8.14 图所示的逻辑电路，写出状态转移方程、输出方程、状态转移表和状态图。

![题8.14图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_1/imgs/img_in_image_box_213_251_947_525.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A42Z%2F-1%2F%2F7b650fd73e6819c9e82847c67ed8caf0bcc882328c986d18b0e5a2d4b8e2f1b3)

## 8.15

> <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**第 8.15 题在原书中仅有插图，OCR 未识别出题干，暂缺。**

## 8.16 分析题8.16图所示的逻辑电路，写出状态转移真值表和状态图。

![题8.16图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_268_997_743_1136.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A44Z%2F-1%2F%2Fdec9cfb5ab4a6c70d61ba60f0313b5191ef461fd3c17a0365aecf7ac6d4e1551)

## 8.17 分析如题8.17图所示电路，写出其状态转移真值表，画出时序图。

![题8.17图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_587_775_893_952.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A43Z%2F-1%2F%2F3d5c161c1a61403578d863174a423f89166cd045b9e698f8b177bfcba469e9ca)

## 8.18 电路如题8.18图(a)所示，画出(b)中B、C的波形，触发器的初始状态为0。

![题8.18 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_190_441_814_690.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A43Z%2F-1%2F%2F6763ef8edd2e1c71a2af6bf67d7af3d25061f43c8fc038c08cd5c0bc7886ccf9)

## 8.19 分析题8.19图所示电路，写出其状态方程和时钟方程，作出状态转移真值表。

![题8.19图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_132_131_873_387.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A43Z%2F-1%2F%2F3cc7fd261ec5c64e30afb92b61b8410725dc0d00d388844aa9293cde83dc321f)

## 8.20 分析题8.20图所示电路，写出状态转移方程，画出状态转移表和时序图。

![题8.20图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_1/imgs/img_in_image_box_143_1152_933_1360.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A43Z%2F-1%2F%2Febe648979f8bc8a714d61708b628ffac864ff45e38e8b7587073aa8766eb6a80)

![题8.20 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_114_762_527_935.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A43Z%2F-1%2F%2Fa3721f9656f44b691816b089c38d3cdf2d9857e401d0b2a4eae2303d3912a90a)

![题8.20 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//cb8270c5-735a-4cb1-91f4-abcae3d3e895/markdown_2/imgs/img_in_image_box_259_1192_753_1409.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A44Z%2F-1%2F%2F49dab243833646e0bdf9a18b0e337c471d4a94bdec1b0aa28b4c4efc8b0a8dd8)

## 8.21 时序电路的状态转换图如题8.21图所示，若该电路的初态为00，当输入序列X=010110（左位先入），写出电路的输出序列Z。

![题8.21 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_0/imgs/img_in_image_box_233_177_731_357.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A47Z%2F-1%2F%2F485a58399c8e3baeb938bfd4c35f18a67028dee6c87b76b84672491ee9078e3b)

## 8.22 化简题 8.22 图所示的状态图。

![题8.22 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_0/imgs/img_in_image_box_121_517_426_924.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A47Z%2F-1%2F%2Fd972cec1614c962cac8915014251e3bc882b9a2deb57ef38b21c40bc169f474d)

## 8.23 化简题 8.23 图所示的状态图。

![题8.23 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_0/imgs/img_in_image_box_497_625_826_925.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A47Z%2F-1%2F%2Feeb647862d2cfa82b3f78ebfd740132be7b0635ccf668083e44277b89e6822c6)

## 8.24 化简题 8.24 图所示的状态图。

![题8.24 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_0/imgs/img_in_image_box_309_1011_636_1386.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A48Z%2F-1%2F%2Ff78e1018c3faaeb1caed803f180dca2361f59467cebbd14750ac1a5204a0758d)

## 8.25 已知状态表如题 8.25 表所示，作出对应的状态图。

<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td rowspan="2">现态</td><td colspan="4">次态/输出  $Z_1$</td><td rowspan="2">输出  $Z_2$</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>$X_2X_1=00$</td><td style='text-align: center; word-wrap: break-word;'>$X_2X_1=01$</td><td style='text-align: center; word-wrap: break-word;'>$X_2X_1=11$</td><td style='text-align: center; word-wrap: break-word;'>$X_2X_1=10$</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>$S_0$</td><td style='text-align: center; word-wrap: break-word;'>$S_0/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_1/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_2/1$</td><td style='text-align: center; word-wrap: break-word;'>$S_3/0$</td><td style='text-align: center; word-wrap: break-word;'>1</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>$S_1$</td><td style='text-align: center; word-wrap: break-word;'>$S_1/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_2/1$</td><td style='text-align: center; word-wrap: break-word;'>$S_0/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_3/1$</td><td style='text-align: center; word-wrap: break-word;'>1</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>$S_2$</td><td style='text-align: center; word-wrap: break-word;'>$S_2/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_1/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_3/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_3/0$</td><td style='text-align: center; word-wrap: break-word;'>0</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>$S_3$</td><td style='text-align: center; word-wrap: break-word;'>$S_3/0$</td><td style='text-align: center; word-wrap: break-word;'>$S_0/1$</td><td style='text-align: center; word-wrap: break-word;'>$S_2/1$</td><td style='text-align: center; word-wrap: break-word;'>$S_2/0$</td><td style='text-align: center; word-wrap: break-word;'>1</td></tr></table>

## 8.26 设计111序列检测器。

## 8.27 设计 1110 序列检测器。

## 8.28 设计同步时序电路，状态图如题8.28图所示。

![题8.28图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_1/imgs/img_in_image_box_276_507_743_780.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A49Z%2F-1%2F%2Fd85eeae507a3a54cabfd1912460a565cd31b1be312d76443f734ca4976bbb7cb)

## 8.29 用 D 触发器和门电路设计一个同步时序电路，状态图如题 8.29 图所示。

![题8.29 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_1/imgs/img_in_image_box_286_873_743_1124.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A49Z%2F-1%2F%2Feb7e155ba75cb3b038b7dfd4eee5933d51be9df4ed0a7d2f614374d7682d39fa)

## 8.30 用 D 触发器设计逻辑电路实现如题 8.30 图所示的状态转移。

![题8.30图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_1/imgs/img_in_image_box_657_1142_989_1400.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A50Z%2F-1%2F%2F8bddc2a1f6b02b9f8ab1f84e9486f8cda18dc8fd64464c8a91f94c557baceeb8)

## 8.31 试用 D 触发器设计一个可控模计数器，要求

当X=1时，计数器的输出 $Q_{2}Q_{1}Q_{0}$的状态转换如题8.31图(a)；

当X=0时，计数器的输出 $Q_{2}Q_{1}Q_{0}$的状态转换如题8.31图(b)。

## 8.32 试用后沿 D 触发器设计同步时序电路，电路状态转换图如题 8.32 图，按照如下编码：

$$
S_{0}:\mathbf{0}\mathbf{0},S_{1}:\mathbf{1}\mathbf{0},S_{2}:\mathbf{0}\mathbf{1}。
$$

![题8.32 图(a)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_2/imgs/img_in_image_box_273_74_635_195.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2F53e89354570ae150eeb357607b7222aec13f48d6c290a0af0b0d7772dd56019d)

![题8.32 图(b)](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_2/imgs/img_in_image_box_215_246_700_361.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2Faa733ed5d92dd81e32cfa240800a680ea3eb43225a34826134173e6371fe3c8f)

![题8.32 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_2/imgs/img_in_image_box_294_452_637_656.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A51Z%2F-1%2F%2F904f08d9d2c6eeaebe2aa1f8d2bac8bc5aba53209486791fe2b08ee55e16cdea)

## 8.33 根据题8.33表所示的状态表，分别用D触发器和J-K触发器设计电路。

<table border=1 style='margin: auto; word-wrap: break-word;'><tr><td rowspan="2">$A^{n}B^{n}$</td><td colspan="2">$A^{n+1}B^{n+1}$</td><td colspan="2">Z</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>X=0</td><td style='text-align: center; word-wrap: break-word;'>X=1</td><td style='text-align: center; word-wrap: break-word;'>X=0</td><td style='text-align: center; word-wrap: break-word;'>X=1</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>00</td><td style='text-align: center; word-wrap: break-word;'>11</td><td style='text-align: center; word-wrap: break-word;'>00</td><td style='text-align: center; word-wrap: break-word;'>0</td><td style='text-align: center; word-wrap: break-word;'>1</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>01</td><td style='text-align: center; word-wrap: break-word;'>00</td><td style='text-align: center; word-wrap: break-word;'>01</td><td style='text-align: center; word-wrap: break-word;'>0</td><td style='text-align: center; word-wrap: break-word;'>0</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>10</td><td style='text-align: center; word-wrap: break-word;'>01</td><td style='text-align: center; word-wrap: break-word;'>11</td><td style='text-align: center; word-wrap: break-word;'>1</td><td style='text-align: center; word-wrap: break-word;'>0</td></tr><tr><td style='text-align: center; word-wrap: break-word;'>11</td><td style='text-align: center; word-wrap: break-word;'>00</td><td style='text-align: center; word-wrap: break-word;'>00</td><td style='text-align: center; word-wrap: break-word;'>1</td><td style='text-align: center; word-wrap: break-word;'>1</td></tr></table>

## 8.34 用 D 触发器设计一个时序逻辑电路，实现题 8.34 图所示的时序。

![题8.34 图](https://pplines-online.bj.bcebos.com/deploy/official/paddleocr/pp-ocr-vl-16-online//29482de4-d4ad-4569-b7cc-2ef58fe11a28/markdown_2/imgs/img_in_image_box_171_1115_759_1279.jpg?authorization=bce-auth-v1%2FALTAKDN8mY5KlNI7zaRpLmOqrw%2F2026-09-10T02%3A52%3A52Z%2F-1%2F%2Fbdc1b9062e0554d5df919a30da3aa3212ac77db614d0f575139a8d9a671d6d2c)

## 8.35 试用 D 触发器设计一个同步五进制加法计数器。

## 8.36 用 D 触发器和门电路设计一个十一进制计数器，并检查设计的电路能否启动。

## 8.37 用 D 触发器和适当的门电路设计时序电路，两输入端 $X_{1}$、 $X_{2}$ 在连续两个时钟或两个以上时钟输入一

致时，输出Y为1。

## 8.38 用上升沿 D 触发器设计 4 位二进制异步加法计数器。

## 8.39 用下降沿 D 触发器设计 3 位二进制异步减法计数器。

## 8.40 用 D 触发器和门电路设计一个序列信号发生器电路，周期性输出“0010110111”的序列。

