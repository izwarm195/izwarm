---
title: "电子电路基础 基本放大器"
slug: "signals/ecb/basic-amplifier"
description: "v_s ：欲放大的输入信号电压， v_s V_{sm} sin omega t ； V_{BB} 、 V_{CC} ：偏置电压； R_L ：负载电阻。"
publishDate: "2026-11-20"
createdAt: "2026-11-20T00:00:00Z"
tags: ["signals","electronics"]
series: ["Signals","电子电路基础"]
---

---

# 电子电路基础 基本放大器

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**依据**
> 课件《电子电路基础》4.1–4.2（`基本、差分` 第 1–27 页），符号与课件一致。
> 公式为 PaddleOCR-VL 识别结果人工校订，插图为识别出的原始截图。

## 4.1 放大器的基本概念

### 4.1.1 放大的原理和实质

$v_s$：欲放大的输入信号电压，$v_s=V_{sm}\sin\omega t$；$V_{BB}$、$V_{CC}$：偏置电压；$R_L$：负载电阻。

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/9f998c07b9357e4ca90abb899ab2e618.jpg" /></div>

<div style="text-align:center">基本共射放大电路</div>

$$
v_{BE}=v_s+V_{BB}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/8c6e21192b1b1d98fe979cb3fbc6d254.jpg" /></div>

<div style="text-align:center">输入回路的波形</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/348c406d1f43d2974e5873fc59e6a9f4.jpg" /></div>

<div style="text-align:center">输出回路的波形（b）</div>

$$
i_{\mathrm{B}}=I_{\mathrm{BQ}}+i_{\mathrm{b}}=I_{\mathrm{BQ}}+I_{\mathrm{bm}}\sin\omega t
$$

$$
i_{\mathrm{C}}=\beta i_{\mathrm{B}}=\beta I_{\mathrm{BQ}}+\beta i_{\mathrm{b}}=I_{\mathrm{CQ}}+I_{\mathrm{cm}}\sin\omega t
$$

$$
v_{\mathrm{CE}}=V_{\mathrm{CC}}-i_{\mathrm{C}}R_{\mathrm{L}}=V_{\mathrm{CC}}-I_{\mathrm{CQ}}R_{\mathrm{L}}-I_{\mathrm{cm}}R_{\mathrm{L}}\sin\omega t
$$

$$
-I_{\mathrm{cm}}R_{\mathrm{L}}\sin\omega t=-V_{\mathrm{om}}\sin\omega t=v_{\mathrm{o}}
$$

- 只要 $R_L$ 足够大，输出信号电压振幅 $V_{om}$ 就可大于输入信号电压振幅 $V_{sm}$，实现放大功能。

  **功率分析**（各量的直流分量与交流分量分开算）：

  $$
  P_{I}=\frac{1}{2\pi}\int_{0}^{2\pi}v_{BE}\cdot i_{B}\,\mathrm{d}\omega t=\frac{1}{2\pi}\int_{0}^{2\pi}(V_{sm}\sin\omega t+V_{BB})(I_{BQ}+I_{bm}\sin\omega t)\,\mathrm{d}\omega t=V_{BB}I_{BQ}+\frac{1}{2}V_{sm}I_{bm}
  $$

  $$
  P_{\mathrm{D}}=\frac{1}{2\pi}\int_{0}^{2\pi}V_{\mathrm{CC}}\cdot i_{\mathrm{c}}\,\mathrm{d}\omega t=\frac{1}{2\pi}\int_{0}^{2\pi}V_{\mathrm{CC}}(I_{\mathrm{CQ}}+I_{\mathrm{cm}}\sin\omega t)\,\mathrm{d}\omega t=V_{\mathrm{CC}}I_{\mathrm{CQ}}
  $$

  $$
  P_{\mathrm{L}}=\frac{1}{2\pi}\int_{0}^{2\pi}i_{\mathrm{C}}^{2}R_{\mathrm{L}}\,\mathrm{d}\omega t=I_{\mathrm{CQ}}^{2}R_{\mathrm{L}}+\frac{1}{2}I_{\mathrm{cm}}^{2}R_{\mathrm{L}}
  $$

  $$
  P_{\mathrm{C}}=\frac{1}{2\pi}\int_{0}^{2\pi}i_{\mathrm{C}}v_{\mathrm{CE}}\,\mathrm{d}\omega t=V_{\mathrm{CC}}I_{\mathrm{CQ}}-I_{\mathrm{CQ}}^{2}R_{\mathrm{L}}-\frac{1}{2}I_{\mathrm{cm}}^{2}R_{\mathrm{L}}
  $$

- $P_I$ 由信号源与 $V_{BB}$ 共同提供，$P_D$ 由 $V_{CC}$ 提供，$P_C$ 是管耗，$P_L$ 是负载上的功率。

### 4.1.2 放大器的性能指标

当晶体管工作在放大模式、且叠加在直流工作点上的信号幅度很小时，可用小信号等效电路分析，把它看作有源线性四端网络。

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/41ac1b107091dbf10bd39957b93dbfca.jpg" /></div>

<div style="text-align:center">放大器作为有源线性四端网络</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/19beb27cacbeda32c8cf831767ec7c7e.jpg" /></div>

<div style="text-align:center">输入端口与信号源 $v_s=i_s R_s$</div>

#### 一、输入电阻、输出电阻

$$
R_i=\frac{v_i}{i_i}
$$

- 若放大器的前面是另一级放大器，则该级输入电阻是前一级的负载，即 $R_{Ln}=R_{i(n+1)}$。

  $R_o$ 是在独立电压源短路（$v_s=0$）或独立电流源开路（$i_s=0$）、保留信号源内阻的条件下，由 $R_L$ 两端向放大器看进去的等效电阻。

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/92cc88526433d3b4ac76b4ee16b6a25a.jpg" /></div>

  <div style="text-align:center">求 $R_o$ 的电路</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/bbca2b020ecdc3642f3232d592b6bdc4.jpg" /></div>

  <div style="text-align:center">（a）</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/6f09e4381089c89f61660c3d1688ecea.jpg" /></div>

  <div style="text-align:center">（b）等效信号源</div>

  此时可定义 $R_o=v/i$ 为放大器的输出电阻。对负载 $R_L$ 而言，放大器可看作它的信号源：$v_{ot}$ 为移去 $R_L$ 后的输出电压，$i_{on}$ 为将 $R_L$ 短路的输出电流，则有 $v_{ot}=-i_{on}R_o$。

#### 二、增益

增益又称放大倍数，定义为输出量对输入量的比值。

| 电压增益 | 电流增益 |
| --- | --- |
| $A_v=\dfrac{v_o}{v_i}$ | $A_i=\dfrac{i_o}{i_i}$ |
| 互导增益 | 互阻增益 |
| $A_g=\dfrac{i_o}{v_i}$ | $A_r=\dfrac{v_o}{i_i}$ |

增益转换：$A_v=\dfrac{v_o}{v_i}=\dfrac{-i_oR_L}{i_iR_i}=-A_i\dfrac{R_L}{R_i}$。

负载开路（$R_L$ 开路）时的电压增益 $A_{vt}=\dfrac{v_{ot}}{v_i}$，此时

$$
A_v=A_{vt}\frac{R_L}{R_0+R_L}
$$

- $R_0/R_L$ 越小，$A_v$ 越大。

  同理，负载短路时的电流增益 $A_{in}=\dfrac{i_{on}}{i_i}$，此时

  $$
  A_i=A_{in}\frac{R_o}{R_o+R_L}
  $$

- $R_L/R_o$ 越小，$A_i$ 越大。

  源增益：

  $$
  A_{vs}=A_v\frac{R_i}{R_s+R_i},\qquad A_{is}=A_i\frac{R_s}{R_s+R_i}
  $$

- $R_s/R_i$ 越小 $A_{vs}$ 越大；$R_i/R_s$ 越小 $A_{is}$ 越大。$R_s$ 为信号源内阻。

#### 三、不同组态对 $R_i$ 与 $R_o$ 的要求

在输入端，为了有效地激励放大器，且在 $R_s$ 变化时力求维持输入量不变：

- 输入量为 $v_i$：要求 $R_i\gg R_s$，理想 $R_i\to\infty$。
- 输入量为 $i_i$：要求 $R_i\ll R_s$，理想 $R_i\to0$。

  在输出端，为了把信号有效地送到负载上，且在 $R_L$ 变化时力求输出量不变：

- 输出量为 $v_o$：要求 $R_o\ll R_L$，理想 $R_o\to0$。
- 输出量为 $i_o$：要求 $R_o\gg R_L$，理想 $R_o\to\infty$。

## 4.2 基本放大器

场效应管的三种基本组态：

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/31b1959ddaa096c3c2ccc1c1ad684a9f.jpg" /></div>

<div style="text-align:center">共源</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/4faea0f246556d424cb6e06b5e31f9e7.jpg" /></div>

<div style="text-align:center">共漏</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/5f850e82c9c7fa8ad64d003d103d032a.jpg" /></div>

<div style="text-align:center">共栅</div>

### 4.2.1 共源、共栅和共漏放大器性能

#### 一、共源放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/c806b67085b3ead7d0eec3ca1bd744cc.jpg" /></div>

<div style="text-align:center">（a）共源放大电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/e280fe2cd389782611b0315876a12326.jpg" /></div>

<div style="text-align:center">（b）小信号等效电路</div>

$$
R_i\to\infty
$$

$$
R_o'=r_{ds},\qquad R_o=r_{ds}\parallel R_D
$$

$$
A_{vs}=A_v=\frac{v_o}{v_i}=-g_m(R_o\parallel R_L)
$$

**例** 共源放大电路如图，N 沟道 EMOSFET 参数 $V_{GS(\mathrm{th})}=2\ \mathrm{V}$，$\mu_nC_{ox}W/(2l)=0.25\ \mathrm{mA/V^2}$，$\lambda=0$，$V_{DD}=20\ \mathrm{V}$；$C_G$、$C_D$ 为耦合电容，$C_s$ 为旁路电容。求 $R_i$、$R_o$ 与 $A_v$。

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/8985cb53d36d4cf666c70620507e22f0.jpg" /></div>

<div style="text-align:center">例题电路</div>

$$
V_G=\frac{R_{G2}}{R_{G1}+R_{G2}}V_{DD}=\frac{80}{80+120}\times20=8\ \mathrm{V}
$$

$$
V_{GS}=V_G-I_DR_S=8-4I_D
$$

$$
\frac{\mu_nC_{ox}W}{2l}(V_{GS}-V_{GS(\mathrm{th})})^2=0.25(8-4I_D-2)^2=(3-2I_D)^2
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/354dec0c2b13c73fe06b76757799b293.jpg" /></div>

<div style="text-align:center">（a）转移特性与负载线</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/27eede0a12d9e58145c83077f49acec5.jpg" /></div>

<div style="text-align:center">（b）图解法求 $Q$ 点</div>

舍去 $2.25\ \mathrm{mA}$，故工作点电流 $I_{DQ}=1\ \mathrm{mA}$，跨导

$$
g_m=2\sqrt{\frac{\mu_nC_{ox}W}{2l}I_{DQ}}=1\ \mathrm{mS}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/c8f3e3f28e8bcd2e063d1fa836660b82.jpg" /></div>

<div style="text-align:center">（a）交流通路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/47ed439ca3a060004dc75924bc660f64.jpg" /></div>

<div style="text-align:center">（b）小信号等效电路</div>

$$
R_i=R_{G1}\parallel R_{G2}=\frac{80\times120}{80+120}=48\ \mathrm{k\Omega}
$$

$$
R_o=r_{ds}\parallel R_D=R_D=10\ \mathrm{k\Omega}
$$

$$
A_v=\frac{v_o}{v_i}=-g_m(R_o\parallel R_L)=-5
$$

$$
A_{vs}=\frac{v_o}{v_s}=\frac{R_i}{R_s+R_i}A_v=\frac{48}{0.05+48}A_v\approx A_v=-5
$$

#### 二、共栅放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/a36c4368cc97dc23b5cd519a4ac56264.jpg" /></div>

<div style="text-align:center">共栅放大电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/5fbb6734dda593d63e0a0b4724704662.jpg" /></div>

<div style="text-align:center">（a）小信号等效电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/0c9d80aa9399dc426e9b1744dae25ee0.jpg" /></div>

<div style="text-align:center">（b）小信号等效电路</div>

$$
v_{sg}=(i_i-g_mv_{sg})r_{ds}+i_iR_L',\qquad R_L'=R_D\parallel R_L
$$

$$
R_i=\frac{v_i}{i_i}=\frac{v_{sg}}{i_i}=\frac{r_{ds}+R_L'}{1+g_mr_{ds}}\ \Longrightarrow\ R_i=\frac{v_i}{i_i}=\frac{1}{g_m}
$$

$$
v=(i+g_mv_{sg})r_{ds}+iR_s=i(r_{ds}+R_s+g_mR_sr_{ds})
$$

$$
R_o'=\frac{v}{i}=R_s+(1+g_mR_s)r_{ds},\qquad R_o=R_o'\parallel R_D\approx R_D
$$

$$
A_i=-\frac{R_D}{R_D+R_L},\qquad A_v=-A_i\frac{R_L}{R_i}=(1+g_mr_{ds})\frac{R_D}{r_{ds}+R_L}'
$$

#### 三、共漏放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/c9315018493faeee60c869e1604dea79.jpg" /></div>

<div style="text-align:center">共漏放大电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/95f5680f9e4959c02f058c69819c996a.jpg" /></div>

<div style="text-align:center">小信号等效电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/cab0cf756d7e4e8b25ed6cc2f273b5bf.jpg" /></div>

<div style="text-align:center">推导 $R_o$ 的等效电路</div>

$$
R_i\to\infty
$$

$$
v_{gs}=v_i-v_o,\qquad v_o=g_mv_{gs}(r_{ds}\parallel R_S\parallel R_L)
$$

$$
A_v=\frac{g_mR_L'}{1+g_mR_L'}
$$

$$
R_o=\frac{v}{i}=r_{ds}\parallel R_S\parallel\frac{1}{g_m}\approx\frac{1}{g_m}
$$

#### 四、小结

| 性能 \ 组态 | 共源（CS） | 共栅（CG） | 共漏（CD） |
| --- | --- | --- | --- |
| $R_i$ | $\to\infty$ | $1/g_m$ | $\to\infty$ |
| $R_o'$ | $r_{ds}$ | $r_{ds}+R_s+g_mR_sr_{ds}$ | $1/g_m$ |
| $R_o$ | $r_{ds}\parallel R_D\approx R_D$ | $R_o'\parallel R_D\approx R_D$ | $1/g_m$ |
| $A_v$ | $-g_m(r_{ds}\parallel R_o\parallel R_L)$ | $g_m(r_{ds}\parallel R_D\parallel R_L)$ | $\approx1$ |

### 4.2.2 共射、共基和共集放大器的性能

#### 一、共射放大器

**1. 基本共射放大器**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/33e80020f94a7dbb82e2ff0221460804.jpg" /></div>

<div style="text-align:center">基本共射放大器</div>

电流增益可由三电极间的电流关系直接写出：输入电流 $i_i=i_b$，输出电流 $i_o$ 是负载 $R_L$ 与放大器输出电阻对受控源的分流值。

$$
A_i=\frac{i_o}{i_i}=\beta\frac{R_o}{R_o+R_L}=g_mr_{be}\frac{R_o}{R_o+R_L}
$$

$$
A_v=-A_i\frac{R_L}{R_i}
$$

$$
A_v=\frac{v_o}{v_i}=-\frac{\beta(R_o\parallel R_L)}{R_i}=-\frac{\beta(r_{ce}\parallel R_C\parallel R_L)}{r_{bb'}+r_{b'e}}
$$

若 $r_{bb'}$ 忽略不计，则

$$
A_v\approx-g_m(r_{ce}\parallel R_C\parallel R_L)\approx-g_mR_L'
$$

- 提高 $g_m$（即增大 $I_{CQ}$）、增大 $R_L$ 与 $R_C$ 均可提高共射电压增益；$R_L$ 近似开路时 $A_{vt}\approx-g_mr_{ce}$ 达到最大。

  $$
  g_m\approx\frac{I_{CQ}}{V_T},\qquad r_{ce}\approx\frac{|V_A|}{I_{CQ}},\qquad A_{vt\max}=-\frac{|V_A|}{V_T}
  $$

  **2. 有源负载放大器**

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/cafe14c22e36193e84c99b307966cbc9.jpg" /></div>

  <div style="text-align:center">电阻 $R_C$ 作负载的共射放大器</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/689ee1e292d17221a8cd6c42c058946a.jpg" /></div>

  <div style="text-align:center">PNP 管作有源负载</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/4195c8fbb4f9ca823b94d7add974c16e.jpg" /></div>

  <div style="text-align:center">有源负载等效为 $r_{ce2}$</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/082f815f8c0c94bc78ea0ec78bda3338.jpg" /></div>

  <div style="text-align:center">小信号等效电路</div>

  负载很大时要提高电压增益就得增大 $R_c$，但大电阻工艺上难实现，且 $R_c$ 增大会把 $T_1$ 的静态工作点推向饱和区，压缩动态范围。

  改用 PNP 管作负载：直流电阻很小、交流电阻很大；且 $I_{CQ}$ 直接受 $T_2$ 管（相当于电流源）控制，热稳定性取决于 $T_2$。

  $$
  I_{CQ1}=I_{CQ2},\qquad V_{CEQ1}=V_{CC}-V_{ECQ2},\qquad V_{CE1\max}=V_{CC}-V_{EC2(\mathrm{sat})}
  $$

  $$
  A_{vt}=-g_m\frac{r_{ce}}{2}=-\frac{|V_A|}{2V_T}
  $$

  **3. 发射极接电阻的共射放大器**

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/e7f43fa1ac10ff06f0846dc94469ee84.jpg" /></div>

  <div style="text-align:center">发射极接 $R_E$ 的共射放大器</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/badb9e890623d8132715f92981da4c0d.jpg" /></div>

  <div style="text-align:center">交流通路</div>

  若忽略 $r_{ce}$，流过 $R_E$ 的电流为 $(1+\beta)i_b$：

  $$
  R_i=\frac{v_i}{i_i}\approx r_{bb'}+r_{b'e}+(1+\beta)R_E,\qquad R_o=R_c
  $$

  $$
  A_i=\frac{i_o}{i_i}=\beta\frac{R_C}{R_C+R_L}
  $$

  $$
  A_v=-A_i\frac{R_L}{R_i}=-\frac{\beta(R_C\parallel R_L)}{r_{bb'}+r_{b'e}+(1+\beta)R_E}=-\frac{\beta R_L'}{r_{bb'}+r_{b'e}+(1+\beta)R_E}
  $$

  当 $(1+\beta)R_E\gg r_{bb'}+r_{b'e}$ 且 $\beta\gg1$ 时

  $$
  A_v\approx-\frac{R_L'}{R_E}
  $$

#### 二、共基放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/6c77f29c384a6df98cde0ea30cf97ec5.jpg" /></div>

<div style="text-align:center">共基放大电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/41a5a8aa08eed47d55cab9a63b14eb56.jpg" /></div>

<div style="text-align:center">求 $R_o$ 的等效电路</div>

$$
R_i=\frac{v_i}{i_i}=\frac{r_{bb'}+r_{be}'}{1+\beta},\qquad A_i=\frac{i_o}{i_i}=-\alpha\frac{R_C}{R_C+R_L}
$$

$$
A_v=-A_i\frac{R_L}{R_i}=\frac{\alpha(1+\beta)}{r_{bb'}+r_{be}'}(R_C\parallel R_L)=\frac{\beta R_L'}{r_{bb'}+r_{be}'}
$$

- 忽略 $r_{bb}'$ 时 $A_v\approx g_mR_L'$。

  $$
  R_o'=R_s\parallel r_{be}'+[1+g_m(R_s\parallel r_{be})]r_{ce}\approx r_{ce}\left(1+\frac{\beta R_s}{R_s+r_{be}}\right)
  $$

  $$
  R_o=R_C\parallel r_{ce}\left(1+\frac{\beta R_s}{R_s+r_{be}}\right)\approx R_C
  $$

#### 三、共集放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/0e851a74880219b45b61a7e97f0609cb.jpg" /></div>

<div style="text-align:center">共集放大电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/20e0c725b5f16ce98b13d290020debb4.jpg" /></div>

<div style="text-align:center">小信号等效电路</div>

$$
R_i=\frac{v_i}{i_i}=r_{bb'}+r_{b'e}+(1+\beta)R_E'
$$

$$
R_o'=\frac{r_{bb'}+r_{b'e}+R_s}{1+\beta}
$$

$$
R_o=R_o'\parallel R_E=\frac{r_{bb'}+r_{be}'+R_s}{1+\beta}\parallel R_E\approx\frac{r_{bb'}+r_{be}'+R_s}{1+\beta}
$$

$$
A_i=-(1+\beta)\frac{R_E}{R_E+R_L},\qquad A_v=-A_i\frac{R_L}{R_i}=\frac{(1+\beta)R_E'}{r_{bb'}+r_{b'e}+(1+\beta)R_E'}
$$

#### 四、小结

| 性能 \ 组态 | 共发 | 共基 | 共集 |
| --- | --- | --- | --- |
| $R_i$ | $r_{bb'}+r_{be}'$ | $\dfrac{r_{bb'}+r_{be}'}{1+\beta}$ | $r_{bb'}+r_{be}+(1+\beta)R_E'$ |
| $R_o'$ | $r_{ce}$ | $r_{ce}\left(1+\dfrac{\beta R_s}{R_s+r_{be}}\right)$ | $\approx\dfrac{r_{bb'}+r_{be}+R_s}{1+\beta}$ |
| $A_{in}$ | $\beta$ | $-\alpha$ | $-(1+\beta)$ |
| $A_v$ | $-g_mR_L'$ | $g_mR_L'$ | $\approx1$ |

### 4.2.3 集成 MOS 放大器

#### 一、E/E 与 E/D MOS 放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/73eef5e5809fef891efdd425a8f3ea6c.jpg" /></div>

<div style="text-align:center">（a）E/E</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/68b09548033e74a0cfbe5d987f94019c.jpg" /></div>

<div style="text-align:center">（b）E/D</div>

$$
R_d=\frac{1}{g_{d2}+g_{m2}+g_{mb2}}
$$

$$
R_o=r_{ds1}\parallel R_d=\frac{1}{g_{ds1}+g_{ds2}+g_{m2}+g_{mb2}}
$$

$$
A_v=\frac{v_o}{v_i}=-g_{m1}R_o=\frac{-g_{m1}}{g_{ds1}+g_{ds2}+g_{m2}+g_{mb2}}
$$

$$
A_v=\frac{-g_{m1}}{g_{m2}+g_{mb2}}=\frac{-g_{m1}}{g_{m2}(1+\eta_2)},\qquad \eta_2=\frac{g_{mb2}}{g_{m2}}=0.1\sim0.3
$$

$T_2$ 饱和区条件：$v_{GS2}>v_{GS(\mathrm{th})2}$；且

$$
g_m=\sqrt{2\mu_nC_{ox}WI_{DQ}/l}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/30d905ab77ca62854e77fc543b2e4b56.jpg" /></div>

<div style="text-align:center">E/D 放大器的小信号等效电路</div>

$$
A_v=-\sqrt{\frac{(W/l)_1}{(W/l)_2}}\cdot\frac{1}{1+\eta_2}
$$

#### 二、CMOS 放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/eb3336c2461b40205102eb541e360eb6.jpg" /></div>

<div style="text-align:center">CMOS 器件剖面结构</div>

**1. 电流源负载 CMOS 放大器**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/d3e9e3fe0f6a394772149f09f8dd956c.jpg" /></div>

<div style="text-align:center">电流源负载 CMOS 放大器</div>

$T_1$、$T_2$ 的饱和区条件：$v_{GS1}>v_{GS(\mathrm{th})1}$、$v_{DS1}>v_{GS1}-v_{GS(\mathrm{th})1}$；$v_{GS2}=V_{GG}-V_{DD}<V_{GS(\mathrm{th})2}$、$v_{DS2}=v_{DS1}-V_{DD}<v_{GS2}-V_{GS(\mathrm{th})2}$。

$$
A_v=-g_{m1}(r_{ds1}\parallel r_{ds2})=-\frac{1}{\sqrt{I_{DQ}}}\cdot\frac{1}{\lambda_1+\lambda_2}\sqrt{\frac{2\mu_nC_{ox}W_1}{l_1}}
$$

**2. 推挽 CMOS 放大器**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/e30fbc28921bc9ca1958409657573d9a.jpg" /></div>

<div style="text-align:center">推挽 CMOS 放大器</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/fd9718d0e25ff85586e20a8a30d92c22.jpg" /></div>

<div style="text-align:center">电压传输特性</div>

$$
A_v=\frac{v_o}{v_i}=-\frac{g_{m1}+g_{m2}}{g_{ds1}+g_{ds2}}
$$

传输特性实测点：

| $v_I$ / V | 0.2 | 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $v_{OUT}$ / V | 5.0 | 5.0 | 5.0 | 4.9 | 4.5 | 1.7 | 0.5 | 0.2 | 0.1 | 0.1 | 0.1 |

#### 三、共栅、共漏放大器

**1. 共栅放大器**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/5370ff24d14b66c37601b9ca54dc53e4.jpg" /></div>

<div style="text-align:center">CMOS 共栅放大器</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/2e37aaea644907ffd30f2072e9569ac1.jpg" /></div>

<div style="text-align:center">交流通路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/40b07708ddf84c2bac04c2ead946b53d.jpg" /></div>

<div style="text-align:center">小信号等效电路</div>

$$
R_i=\frac{v_i}{i_i}=\frac{r_{ds1}+r_{ds2}}{1+g_{m1}r_{ds1}}
$$

- 计入体效应：$R_i=\dfrac{r_{ds1}+r_{ds2}}{1+(g_{m1}+g_{mb1})r_{ds1}}\approx\dfrac{1}{g_{m1}+g_{mb1}}\left(1+\dfrac{r_{ds2}}{r_{ds1}}\right)$。

  $$
  A_v=\frac{v_o}{v_i}=\frac{(1+g_{m1}r_{d1})r_{d2}}{r_{d1}+r_{d2}}\approx g_{m1}(r_{d1}\parallel r_{d2})
  $$

- 计入体效应：$A_v\approx(g_{m1}+g_{mb1})(r_{d1}\parallel r_{d2})$。

  **2. 共漏放大器**

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/67b94f1c1f2430f4ee95657184992e8b.jpg" /></div>

  <div style="text-align:center">CMOS 共漏放大器</div>

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/fae64e1e06210327f5cc520e39fd664d.jpg" /></div>

  <div style="text-align:center">小信号等效电路</div>

  $$
  A_v=\frac{g_{m1}}{g_{m1}+g_{mb1}+1/r_{ds1}+1/r_{ds2}}\approx\frac{g_{m1}}{g_{m1}+g_{mb1}}=\frac{1}{1+\eta_1}
  $$

## 一句话

> 三种组态的分工：共源（共射）管增益、共栅（共基）管带宽与低输入阻抗、共漏（共集）管缓冲——输入电阻看栅（基）极怎么接，输出电阻看漏（集）极怎么接。

