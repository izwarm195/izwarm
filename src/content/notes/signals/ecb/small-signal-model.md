---
title: "小信号模型"
slug: "signals/ecb/small-signal-model"
description: "非线性器件在 Q 点线性化，只剩一个增量电导。"
publishDate: "2026-11-16"
createdAt: "2026-11-16T00:00:00Z"
tags: ["signals","electronics"]
series: ["Signals","电子电路基础"]
---

---

# 小信号模型

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**依据**
> 《电子线路 线性部分》第5版 第 1–3 章，符号与该书一致。

## 一、一个式子

$$
g=\left.\frac{\mathrm{d}i}{\mathrm{d}v}\right|_{Q}
$$

- 非线性器件在 Q 点线性化，只剩一个增量电导。

## 二、符号与端口

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/a70beacfa3e73f10252856645fb20882.svg" /></div>

<div style="text-align:center">图 1 器件符号与端口，自左至右：二极管、三极管、N 沟道结型管、P 沟道结型管、N 沟道增强型 MOS 管</div>

## 三、二极管

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/107a71f3e193f969575a36caa1239e38.svg" /></div>

<div style="text-align:center">图 2 二极管小信号模型</div>

$$
r_j=\frac{V_T}{I_Q},\qquad V_T=26\ \mathrm{mV}
$$

$$
r_d=r_j+r_s
$$

- 高频再并 $C_j$。

## 四、三极管

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/b6b89ce755969a73ed45e63eb9dd12f7.svg" /></div>

<div style="text-align:center">图 3 三极管小信号模型</div>

$$
r_{be}=\frac{V_T}{I_{BQ}}=(1+\beta)\frac{V_T}{I_{EQ}}=(1+\beta)r_e
$$

$$
g_m=\frac{\beta}{r_{be}}=\frac{\alpha}{r_e}\approx\frac{I_{CQ}}{V_T}
$$

$$
\omega_T=\frac{g_m}{C_{b'e}+C_{b'c}}
$$

- 图 3(a) 低频，图 3(b) 混合 $\pi$。

## 五、场效应管

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/4cefbea82f9214872325563cfbea9897.svg" /></div>

<div style="text-align:center">图 4 场效应管小信号模型</div>

$$
g_{ds}=\frac{1}{r_{ds}}\approx\frac{I_{DQ}}{|V_A|}
$$

$$
\mu=g_m r_{ds},\qquad g_{mb}=\eta g_m
$$

- 结型管与 MOS 管同模型，只换 $g_m$ 的算法。
- 栅极开路，$r_{gs}\to\infty$。

## 六、结型管

$$
i_D=I_{DSS}\left(1-\frac{v_{GS}}{V_{GS(\mathrm{off})}}\right)^2
$$

$$
g_{m0}=\frac{2I_{DSS}}{\left|V_{GS(\mathrm{off})}\right|}
$$

$$
g_m=g_{m0}\left(1-\frac{V_{GSQ}}{V_{GS(\mathrm{off})}}\right)=g_{m0}\sqrt{\frac{I_{DQ}}{I_{DSS}}}
$$

$$
g_m=\frac{2I_{DQ}}{\left|V_{GSQ}-V_{GS(\mathrm{off})}\right|}
$$

$$
r_{ds}=\frac{|V_A|}{I_{DQ}},\qquad V_A=50\sim100\ \mathrm{V}
$$

- 末式最快：只要 $I_{DQ}$ 与 $V_{GSQ}$。
- 非饱和区：$R_{\mathrm{on}}=\dfrac{V_{GS(\mathrm{off})}^{2}}{2I_{DSS}\left(v_{GS}-V_{GS(\mathrm{off})}\right)}$。

## 七、$g_m$ 速算

<div style="text-align:center"><img src="https://s3.su.bcebos.com/izwarm-obsidian/2026/11/036a94d67291fd51cfee2d9b16096b0f.svg" /></div>

<div style="text-align:center">图 5 Q 点切线与 $g_m$</div>

| 器件 | 电流 | 电压 | $g_m$ |
| --- | --- | --- | --- |
| 二极管 | $I_Q$ | $V_T=26\ \mathrm{mV}$ | $I_Q/V_T$ |
| 三极管 | $I_{CQ}$ | $V_T=26\ \mathrm{mV}$ | $I_{CQ}/V_T$ |
| MOS 管 | $I_{DQ}$ | $\frac{1}{2}\left(V_{GSQ}-V_{GS(\mathrm{th})}\right)$ | $\dfrac{2I_{DQ}}{V_{GSQ}-V_{GS(\mathrm{th})}}$ |
| 结型管 | $I_{DQ}$ | $\frac{1}{2}\left|V_{GSQ}-V_{GS(\mathrm{off})}\right|$ | $\dfrac{2I_{DQ}}{\left|V_{GSQ}-V_{GS(\mathrm{off})}\right|}$ |

- 全部是「Q 点电流 ÷ 一个电压」，不必先求 $I_{DSS}$、$g_{m0}$、$\beta$。

  数例：

- 二极管 $I_Q=1\ \mathrm{mA}$：$r_j=26\ \Omega$。
- 三极管 $I_{CQ}=1\ \mathrm{mA}$：$g_m=38.5\ \mathrm{mS}$，$r_{be}=\beta/g_m$。
- 结型管 $I_{DQ}=1\ \mathrm{mA}$、$V_{GSQ}=-1.5\ \mathrm{V}$、$V_{GS(\mathrm{off})}=-4\ \mathrm{V}$：$g_m=\dfrac{2\ \mathrm{mA}}{2.5\ \mathrm{V}}=0.8\ \mathrm{mS}$。

  校核：$I_{DSS}=\dfrac{I_{DQ}}{\left(1-V_{GSQ}/V_{GS(\mathrm{off})}\right)^2}=2.56\ \mathrm{mA}$，$g_{m0}=\dfrac{2\times2.56}{4}=1.28\ \mathrm{mS}$，$g_m=g_{m0}\sqrt{\dfrac{1}{2.56}}=0.8\ \mathrm{mS}$。

## 八、一句话

> 小信号模型只有一件事：Q 点电流除以一个电压。

