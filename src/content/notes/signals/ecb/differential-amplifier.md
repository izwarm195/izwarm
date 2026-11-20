---
title: "电子电路基础 差分放大器"
slug: "signals/ecb/differential-amplifier"
description: "差分放大器（差动放大器）广泛用于集成电路，它由两个对称的共源放大器通过源极电阻 R_{ss} 相耦合而成。"
publishDate: "2026-11-20"
createdAt: "2026-11-20T00:00:00Z"
tags: ["signals","electronics"]
series: ["Signals","电子电路基础"]
---

---

# 电子电路基础 差分放大器

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**依据**
> 课件《电子电路基础》4.3–4.4（`基本、差分` 第 28–51 页），符号与课件一致。
> 公式为 PaddleOCR-VL 识别结果人工校订，插图为识别出的原始截图。

## 4.3 差分放大器

### 4.3.1 电路结构

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/36bd8671d4772c86d13a7f8cea1cb754.jpg" /></div>

<div style="text-align:center">差分放大器基本电路</div>

差分放大器（差动放大器）广泛用于集成电路，它由两个对称的共源放大器通过源极电阻 $R_{ss}$ 相耦合而成。

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/612323e4d574de520bfb49dcf90df04e.jpg" /></div>

<div style="text-align:center">直流通路</div>

$$
v_{i1}=v_{i2}=0
$$

$$
I_{SS}=I_{SQ1}+I_{SQ2}=I_{DQ1}+I_{DQ2}
$$

$$
I_{DQ1}=I_{DQ2}=I_{DQ}=I_{SS}/2
$$

$$
V_{DQ1}=V_{DQ2}=V_{DD}-I_{DQ}R_D,\qquad V_{OQ}=V_{DQ1}-V_{DQ2}=0
$$

$$
V_s=-V_{GSQ}
$$

$$
I_{ss}=2I_{DQ}=\frac{V_s-V_{ss}}{R_{ss}}=\frac{-V_{GSQ}-V_{ss}}{R_{ss}}
$$

$$
V_{GSQ}=V_{GS(\mathrm{th})}+\sqrt{\frac{2I_{DQ}l}{\mu_nC_{ox}W}}
$$

- 静态时两管电流相等、两漏极电位相等，输出为零——这是「对称」的直接结果。

### 4.3.2 性能特点

**差模信号**：两输入端作用数值相等、极性相反的信号，即 $v_{i1}=-v_{i2}$。

$$
v_{id1}=-v_{id2}=\frac{v_{id}}{2},\qquad v_{id1}-v_{id2}=v_{id}
$$

**共模信号**：两输入端作用数值相等、极性相同的信号，即 $v_{i1}=v_{i2}$。

$$
v_{ic1}=v_{ic2}=v_{ic}
$$

实际加到两输入端的信号往往既非纯差模、也非纯共模：

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/05d58201f1590f180edb1cd7bca0a343.jpg" /></div>

<div style="text-align:center">任意输入信号的分解</div>

$$
v_{i1}=\frac{v_{i1}+v_{i2}}{2}+\frac{v_{i1}-v_{i2}}{2},\qquad v_{i2}=\frac{v_{i1}+v_{i2}}{2}-\frac{v_{i1}-v_{i2}}{2}
$$

$$
v_{ic}=\frac{v_{i1}+v_{i2}}{2},\qquad v_{id}=v_{i1}-v_{i2}
$$

$$
v_{i1}=v_{ic}+\frac{v_{id}}{2},\qquad v_{i2}=v_{ic}-\frac{v_{id}}{2}
$$

输出同理：

$$
v_{oc}=\frac{v_{o1}+v_{o2}}{2},\qquad v_{od}=v_{o1}-v_{o2}
$$

$$
v_{o1}=v_{oc}+\frac{v_{od}}{2},\qquad v_{o2}=v_{oc}-\frac{v_{od}}{2}
$$

- 差放的核心特点：对差模与共模信号具有完全不同的放大能力。

### 4.3.3 差模、共模等效电路与指标

#### 一、差模等效电路

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/3ed4fce84d3c87908a5b5bdc6fb3caa5.jpg" /></div>

<div style="text-align:center">差模交流电路</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/9433e28771f88ca38da6f6b9e2fb6557.jpg" /></div>

<div style="text-align:center">差模半电路</div>

$$
i_{D1}=I_{DQ1}+i_d,\qquad i_{D2}=I_{DQ2}-i_d
$$

电路两边对称，差模输入下两管产生等值反向的增量电流，共同流入 $R_{ss}$ 时相消，故对差模信号 $R_{ss}$ 可视为短路。

**性能指标定义**

- 双端增益：双端差模输出电压对差模输入电压之比。

  $$
  A_{vd}=\frac{v_{od}}{v_{id}}
  $$

- 单端输出差模增益：$A_{vd1}=\dfrac{v_{od}/2}{v_{id}}=\dfrac{1}{2}A_{vd}$；输出取 $v_{od2}$ 时 $A_{vd2}=-\dfrac{1}{2}A_{vd}$。
- 差模输入电阻：$R_{id}=\dfrac{v_{id}}{i_{id}}$。
- 差模输出电阻：单端输出时为任一输出端到地的电阻；双端输出时为两端看进去的电阻，即两放大器输出电阻之和。

#### 二、共模等效电路

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/eff9a8de74a625c9ba0ee140b3694833.jpg" /></div>

<div style="text-align:center">共模交流电路</div>

$$
i_{D1}=I_{DQ1}+i_d,\qquad i_{D2}=I_{DQ2}+i_d
$$

共模输入下两管产生等值同向的增量电流，流入 $R_{ss}$ 时叠加，故对共模信号相当于接入 $2R_{ss}$。

- 输入共模信号时 $v_{oc}$ 始终为零，双端共模增益为零。

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/2136642a6fc39c20f5d1a90b4e6f3723.jpg" /></div>

  <div style="text-align:center">共模半电路（发射极/源极接 $2R_{SS}$）</div>

  $$
  R_{ic}\to\infty
  $$

  $$
  R_{oc}'=r_{ds}+2R_{SS}+2g_mr_{ds}R_{SS}
  $$

  忽略 $r_{ds}$ 时 $v_{gs}=\dfrac{v_{ic}}{1+2g_mR_{SS}}$，故

  $$
  A_{vc}=\frac{v_{oc1}}{v_{ic}}=\frac{-g_mR_D}{1+2g_mR_{SS}}\approx-\frac{R_D}{2R_{SS}}
  $$

#### 三、共模抑制比

$$
K_{CMR}=\left|\frac{A_{vd}/2}{A_{vc}}\right|,\qquad K_{CMR}(\mathrm{dB})=20\log K_{CMR}
$$

$$
K_{CMR}\approx g_mR_{SS}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/cb5d6f75d56013a413174803f54e3a95.jpg" /></div>

<div style="text-align:center">用电流源 $T_3$ 代替 $R_{SS}$</div>

#### 四、合成输出信号

$$
v_{o1}=v_{oc}+\frac{1}{2}v_{od}=A_{vc}v_{ic}+\frac{1}{2}A_{vd}v_{id}=\frac{1}{2}A_{vd}\left[v_{id}+\frac{1}{K_{CMR}}v_{ic}\right]
$$

$$
v_{o2}=v_{oc}-\frac{1}{2}v_{od}=-\frac{1}{2}A_{vd}\left[v_{id}-\frac{1}{K_{CMR}}v_{ic}\right]
$$

$$
v_o=v_{o1}-v_{o2}=A_{vd}v_{id}=A_{vd}(v_{i1}-v_{i2})
$$

- 双端输出时共模分量抵消，只剩差模——共模抑制靠「相减」。

#### 五、双极性管差分放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/1ca8662f527c8368bb4cdc47611ba689.jpg" /></div>

<div style="text-align:center">双极性管差分放大器</div>

$$
R_{id}=2(r_{bb'}+r_{be}),\qquad R_{od}'=2r_{ce}
$$

$$
A_{vd}=-\frac{\beta R_c}{r_{bb'}+r_{be}}\approx-g_mR_c
$$

$$
R_{ic}=r_{bb'}+r_{be}+(1+\beta)2R_{EE},\qquad R_{oc}\approx R_C
$$

$$
A_{vc}=-\frac{\beta R_c}{r_{bb'}+r_{be}+(1+\beta)2R_{EE}}\approx-\frac{R_c}{2R_{EE}}
$$

$$
K_{CMR}=\left|\frac{A_{vd}/2}{A_{vc}}\right|=g_mR_{EE}
$$

### 4.3.4 差模传输特性

#### 一、双极性差放的差模传输特性

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/2f9ca9a41894cb9b7385d83c93468819.jpg" /></div>

<div style="text-align:center">双极性差分放大器</div>

理想情况下流过 $R_{EE}$ 的电流不变，可用理想电流源代替 $R_{EE}$。

$$
i_{C1}=I_Se^{\frac{v_{BE1}}{V_T}},\qquad i_{C2}=I_Se^{\frac{v_{BE2}}{V_T}}
$$

$$
I_{EE}\approx i_{C1}+i_{C2}=i_{C1}\left(1+\frac{i_{C2}}{i_{C1}}\right)=i_{C1}\left(1+e^{\frac{v_{BE2}-v_{BE1}}{V_T}}\right)
$$

$$
v_{ID}=v_{BE1}-v_{BE2}
$$

$$
i_{C1}=\frac{I_{EE}}{1+e^{-\frac{v_{ID}}{V_T}}}=\frac{I_{EE}e^{\frac{v_{ID}}{V_T}}}{1+e^{\frac{v_{ID}}{V_T}}}=\frac{1}{2}I_{EE}+\frac{1}{2}I_{EE}\frac{e^{\frac{v_{ID}}{V_T}}-1}{1+e^{\frac{v_{ID}}{V_T}}}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/26339b9c653dfc46006d4235432439b6.jpg" /></div>

<div style="text-align:center">差模传输特性的推导</div>

$$
\frac{e^{\frac{v_{ID}}{V_T}}-1}{1+e^{\frac{v_{ID}}{V_T}}}=\frac{e^{\frac{v_{ID}}{2V_T}}-e^{-\frac{v_{ID}}{2V_T}}}{e^{\frac{v_{ID}}{2V_T}}+e^{-\frac{v_{ID}}{2V_T}}}=\operatorname{th}\left(\frac{v_{ID}}{2V_T}\right)
$$

$$
i_{C1}=\frac{1}{2}I_{EE}+\frac{1}{2}I_{EE}\operatorname{th}\left(\frac{v_{ID}}{2V_T}\right)
$$

$$
i_{C2}=\frac{I_{EE}}{1+e^{\frac{v_{ID}}{V_T}}}=\frac{1}{2}I_{EE}-\frac{1}{2}I_{EE}\operatorname{th}\left(\frac{v_{ID}}{2V_T}\right)
$$

$$
i_{C1}-i_{C2}=I_{EE}\operatorname{th}\left(\frac{v_{ID}}{2V_T}\right)
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/fee2ad8085a2337b2da2a238975911fc.jpg" /></div>

<div style="text-align:center">（a）差模传输特性曲线</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/a62b6e1671ab415fd0b92c5f7c854037.jpg" /></div>

<div style="text-align:center">（b）归一化传输特性</div>

- $v_{ID}=0$ 时 $i_{C1}=i_{C2}=I_{CQ}=I_{EE}/2$。
- $|v_{ID}|$ 足够小（$\le26\ \mathrm{mV}$）时曲线近似为直线，实现线性放大。
- $|v_{ID}|$ 大于 $26\ \mathrm{mV}$ 后进入非线性区，可利用它做非线性运算；到 $4V_T\approx104\ \mathrm{mV}$ 时进入限幅区，一管导通、一管截止。
- 截止管的发射结会被击穿，故须限制 $v_{ID}$，引入最大差模输入电压 $V_{(BR)BEO}$。

#### 二、MOS 差放的差模传输特性

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/3be5e1d366ffc25372043d525255670e.jpg" /></div>

<div style="text-align:center">MOS 差分放大器</div>

$$
i_{D1}=\frac{\mu_nC_{ox}W}{2l}(v_{GS1}-V_{GS(\mathrm{th})})^2=K(v_{GS1}-V_{GS(\mathrm{th})})^2
$$

$$
i_{D2}=\frac{\mu_nC_{ox}W}{2l}(v_{GS2}-V_{GS(\mathrm{th})})^2=K(v_{GS2}-V_{GS(\mathrm{th})})^2
$$

$$
v_{ID}=\sqrt{\frac{i_{D1}}{K}}-\sqrt{\frac{i_{D2}}{K}}=\sqrt{\frac{I_{SS}-i_{D2}}{K}}-\sqrt{\frac{i_{D2}}{K}}
$$

$$
i_{D1}=\frac{I_{SS}}{2}+\frac{I_{SS}}{2}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)\sqrt{1-\frac{1}{4}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)^2}
$$

$$
i_{D2}=\frac{I_{SS}}{2}-\frac{I_{SS}}{2}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)\sqrt{1-\frac{1}{4}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)^2}
$$

$$
i_{D1}-i_{D2}=I_{SS}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)\sqrt{1-\frac{1}{4}\left(\frac{v_{ID}}{V_{GSQ}-V_{GS(\mathrm{th})}}\right)^2}
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/05624687bbbaaff4efe2763e02f7cbab.jpg" /></div>

<div style="text-align:center">MOS 差放差模传输特性</div>

- $|v_{ID}|\ll2(V_{GSQ}-V_{GS(\mathrm{th})})$ 时特性为直线，斜率即跨导：

  $$
  g_m=\frac{i_{D1}-i_{D2}}{v_{ID}}=\frac{I_{SS}}{V_{GSQ}-V_{GS(\mathrm{th})}}
  $$

- 双端输出差模增益 $A_{vd}=-g_mR_D$。
- 增大 $v_{ID}$ 进入非线性区；当 $|v_{ID}|=\sqrt{2}(V_{GSQ}-V_{GS(\mathrm{th})})$ 时 $i_{D1}=I_{SS}$、$i_{D2}=0$（或反之），进入限幅区。

## 4.4 电流源电路及其应用

电流源电路要求：

1. 提供电流 $I$，其值在外界因素变化时力求稳定不变。
2. 两端电压变化时保持电流恒定，即交流内阻趋于无穷。

### 4.4.1 镜像电流源

#### 一、双极性晶体管镜像电流源

**1. 基本镜像电流源**

$T_1$、$T_2$ 是严格配对的两管，$T_1$ 接成二极管并由 $V_{CC}$ 经 $R$ 提供 $I_R$，$T_2$ 的集电极电流即输出电流 $I_O=i_{C2}$。

$$
i_{C2}=I_O=\frac{I_{s2}}{I_{s1}}i_{C1}=\frac{S_{E2}}{S_{E1}}i_{C1}
$$

$$
I_R=\frac{V_{CC}-V_{BE(\mathrm{on})}}{R}
$$

$$
I_O=\frac{I_R}{1+2/\beta}\approx I_R\left(1-\frac{2}{\beta}\right)
$$

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/b269fd9ab54faea9f189b2bd040a1a4a.jpg" /></div>

<div style="text-align:center">基本镜像电流源</div>

**2. 减小 $\beta$ 影响的镜像电流源**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/619318dd9fc4c0c3f1b89379ce9bb42d.jpg" /></div>

<div style="text-align:center">减小 $\beta$ 影响的镜像电流源</div>

利用 $T_3$ 的电流放大作用，减小 $(i_{B1}+i_{B2})$ 对 $I_R$ 的分流，使 $i_{C1}$ 更接近 $I_R$，从而减小有限 $\beta$ 引入的误差。

$$
I_O=\frac{\beta^2+\beta}{\beta^2+\beta+2}I_R\approx I_R,\qquad I_R=\frac{V_{CC}-2V_{BE(\mathrm{on})}}{R}
$$

- 精度比普通镜像源提高约 $\beta$ 倍；$I_{B3}$ 比 $2I_B$ 小 $\beta_3$ 倍，$I_{C2}$ 与 $I_R$ 更接近。输出电阻仍为 $T_2$ 的 $r_{ce2}$。

  **3. 比例式镜像电流源**

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/01d1842f57df5f23c0cad03e2f181797.jpg" /></div>

  <div style="text-align:center">比例式镜像电流源</div>

  $$
  v_{BE1}+i_{E1}R_1=v_{BE2}+i_{E2}R_2
  $$

  当 $I_{s1}=I_{s2}=I_s$ 且忽略基区宽度调制效应：

  $$
  v_{BE1}-v_{BE2}=V_T\ln\frac{i_{C1}}{I_s}-V_T\ln\frac{i_{C2}}{I_s}=V_T\ln\frac{i_{C1}}{i_{C2}}
  $$

  若 $i_{C1}$、$i_{C2}$ 近似相等则 $v_{BE1}$、$v_{BE2}$ 抵消；$\beta$ 足够大时 $i_{E1}\approx i_{C1}$、$i_{E2}\approx i_{C2}=I_O$，于是

  $$
  I_O\approx I_R\frac{R_1}{R_2},\qquad I_R=\frac{V_{CC}-V_{BE(\mathrm{on})}}{R+R_1}
  $$

- 两个发射极电阻使两管电流成固定比例，即构成比例电流源。

  $$
  R_o=\left(1+\frac{\beta R_2}{R\parallel R_1+r_{be2}+R_2}\right)r_{ce2}+\frac{(R\parallel R_1+r_{be2})R_2}{R\parallel R_1+r_{be2}+R_2}\approx\left(1+\frac{\beta R_2}{R\parallel R_1+r_{be2}+R_2}\right)r_{ce2}
  $$

  **4. 微电流源**

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/6e5c3dc77ee2eb0f9a4f31f76f9c7907.jpg" /></div>

  <div style="text-align:center">微电流源</div>

  $$
  v_{BE1}=v_{BE2}+i_{E2}R_2,\qquad i_{E2}=\frac{v_{BE1}-v_{BE2}}{R_2}
  $$

  $$
  I_R\approx I_{E1}\approx I_{S1}e^{V_{BE1}/V_T},\qquad I_O=I_{C2}\approx I_{E2}\approx I_{S2}e^{V_{BE2}/V_T}
  $$

  $$
  \Delta V_{BE}=V_{BE1}-V_{BE2}=V_T\left(\ln\frac{I_R}{I_{S1}}-\ln\frac{I_O}{I_{S2}}\right)
  $$

  $I_{S1}=I_{S2}$ 时

  $$
  I_O\approx\frac{V_T}{R_2}\ln\frac{I_R}{I_O},\qquad I_R=\frac{V_{CC}-V_{BE(\mathrm{on})}}{R}
  $$

- 串入 $R_2$ 得到比基准电流小许多倍的微电流，适用于微功耗集成电路。

#### 二、MOS 镜像电流源

**1. 基本镜像电流源**

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/80f2f4587e63aa262183afd22a24f5b6.jpg" /></div>

<div style="text-align:center">（a）</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/f3eb50598c17ddb70e51b316f2138551.jpg" /></div>

<div style="text-align:center">（b）MOS 镜像电流源</div>

$$
I_O=i_{D2}=\frac{(W/l)_2}{(W/l)_1}I_R
$$

- 改变宽长比即可改变输出电流与参考电流之比；MOS 集成电路中为省面积、改性能，电阻几乎都用 MOS 有源电阻取代。

### 4.4.3 电流源的应用

#### 一、有源负载差分放大器

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/563e4c3116d19fd3282b0234ea5dc9ef.jpg" /></div>

<div style="text-align:center">有源负载差分放大器</div>

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/663c352f6376a4b1f3a73ce7985548e9.jpg" /></div>

<div style="text-align:center">交流通路</div>

$T_3$、$T_4$ 是放大管，$T_1$、$T_2$ 构成镜像电流源作负载，其中 $T_1$ 为参考电流端、$T_2$ 为电流输出端。

- 避免了静态电流双重设定的缺点；
- 具有双端输出转单端输出的功能。

  **差模作用**

  $$
  i_{d3}=\frac{1}{2}g_{m3}v_{id},\qquad i_{d4}=-\frac{1}{2}g_{m4}v_{id}
  $$

  $$
  i_{d2}=i_{d1}=i_{d3}=\frac{1}{2}g_{m3}v_{id}
  $$

  $$
  i_o=i_{d2}-i_{d4}=\frac{1}{2}g_{m3}v_{id}-\left(-\frac{1}{2}g_{m4}v_{id}\right)
  $$

  $$
  g_{m3}=g_{m4}=g_m\ \Longleftrightarrow\ i_o=g_mv_{id}
  $$

  输出电阻 $r_{ds2}\parallel r_{ds4}$，故

  $$
  A_{vd}=g_m(r_{ds2}\parallel r_{ds4})
  $$

  <div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/c1da0c35cab60318f0e924a4e4e36741.jpg" /></div>

  <div style="text-align:center">有源负载差分放大器</div>

  **共模作用**

  $$
  i_o=i_{d2}-i_{d4}=g_{m3}v_{ic}-g_{m4}v_{ic}=0
  $$

- 注意电路两边不对称：$T_3$ 的负载是 $1/g_{m1}$，低阻抗有利于电流传输；$T_4$ 的负载是 $r_{ds2}$，高阻抗有利于提高增益。因此输出只能取自 $T_4$ 的漏极。

## 一句话

> 差放只认「差」：$R_{SS}$（$R_{EE}$）对差模短路、对共模变 $2R$，于是差模增益照常算、共模增益被压到 $R_D/2R_{SS}$，比值就是 $K_{CMR}\approx g_mR_{SS}$。

