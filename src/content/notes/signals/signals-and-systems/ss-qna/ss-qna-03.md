---
title: "SS-QNA-03"
slug: "signals/signals-and-systems/ss-qna/ss-qna-03"
publishDate: "2026-08-03"
createdAt: "2026-08-03T00:00:00Z"
updatedDate: "2026-08-03"
tags: ["SS-QNA","signals","signals-systems"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> <span class="callout-badge" data-callout="question"></span>**Question**
> 神秘氛围感公式推导
> 
> $$
>	\begin{aligned}{f(t)}&{{}=\sum_{\tau=-\infty}^{\infty}f(\tau)}\\ {}&{{}=\sum_{\tau=-\infty}^{\infty}\int_{\tau_{-}}^{\tau_{+}}f(t)\delta\left(t-\tau\right)\mathrm{d}t}\\ {}&{{}=\int_{-\infty}^{\infty}f(\tau)\delta\left(t-\tau\right)\mathrm{d}\tau}\\ \end{aligned}
> $$


> <span class="callout-badge" data-callout="answer"></span>**Answer**
> $$
> \begin{aligned}
> f(t) 
> &= \sum_{\tau=-\infty}^{\infty} f(\tau) \cdot \delta_{\tau,t} \\[6pt]
> &= \sum_{\tau=-\infty}^{\infty} f(\tau) \cdot \int_{\tau_{-}}^{\tau_{+}} \delta(\xi - \tau) \, d\xi \;\Bigg|_{\xi = t} \\[6pt]
> &= \sum_{\tau=-\infty}^{\infty} \int_{\tau_{-}}^{\tau_{+}} f(\tau) \, \delta(t - \tau) \, dt \\[6pt]
> &= \lim_{\Delta\tau \to 0}\; \sum_{\tau=-\infty}^{\infty} \int_{\tau}^{\tau+\Delta\tau} f(\tau) \, \delta(t - \tau) \, dt \\[6pt]
> &= \int_{-\infty}^{\infty} f(\tau) \, \delta(t - \tau) \, d\tau
> \end{aligned}
> $$
> 
> **最后一步的依据：**
> 
> $$
> \lim_{\Delta\tau \to 0} \sum_{\tau} \int_{\tau}^{\tau+\Delta\tau} \phi(\tau, t) \, dt
> = \int_{-\infty}^{\infty} \phi(\tau, \tau) \, d\tau
> $$
> 
> 其中 $\phi(\tau, t) = f(\tau)\,\delta(t - \tau)$，代入得 $\phi(\tau, \tau) = f(\tau)\,\delta(t - \tau)$，$dt \to d\tau$。

