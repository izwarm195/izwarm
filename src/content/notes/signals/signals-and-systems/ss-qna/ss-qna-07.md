---
title: "SS-QNA-07"
slug: "signals/signals-and-systems/ss-qna/ss-qna-07"
publishDate: "2026-08-12"
createdAt: "2026-08-12T00:00:00Z"
updatedDate: "2026-08-13T14:57:43+08:00"
tags: ["SS-QNA","template","signals"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**$f(t)$ 能不能写成 $\frac{1}{2\pi j}\int_{-\infty}^{\infty}F(s)e^{st}ds$?**


> <img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer">****不能。拉普拉斯逆变换的积分路径不是整个实轴，而是复平面上平行于虚轴的 Bromwich 路径。****
> 
> 正确的拉普拉斯逆变换公式是：
> 
> $$
> f(t) = \frac{1}{2\pi j} \int_{\sigma - j\infty}^{\sigma + j\infty} F(s) \, e^{st} \, ds
> $$
> 
> ---
> 
> ## # **两个关键区别**
> 
> **1. 积分路径不是 $(-\infty, \infty)$，而是 $\sigma - j\infty$ 到 $\sigma + j\infty$**
> 
> $s = \sigma + j\omega$，$\sigma$ 固定，$\omega$ 从 $-\infty$ 跑到 $+\infty$。写成 $d\omega$ 时：
> 
> $$
> f(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} F(\sigma + j\omega) \, e^{\sigma t} \, e^{j\omega t} \, d\omega
> $$
> 
> 写成 $ds = j\,d\omega$ 时，积分上下限从 $\omega = -\infty$ 和 $+\infty$ 变成 $s = \sigma - j\infty$ 和 $s = \sigma + j\infty$：
> 
> $$
> f(t) = \frac{1}{2\pi j} \int_{\sigma - j\infty}^{\sigma + j\infty} F(s) \, e^{st} \, ds
> $$
> 
> **$\sigma$ 不能是任意的**——它必须大于 $F(s)$ 所有极点的实部（即积分路径必须在所有极点的右边），否则积分不收敛。
> 
> **2. 分母是 $2\pi j$，不是 $2\pi$**
> 
> 从 $d\omega$ 到 $ds$ 时，$ds = j\,d\omega$，所以：
> 
> $$
> \frac{1}{2\pi} \int_{-\infty}^{\infty} (\cdots) \, d\omega
> = \frac{1}{2\pi j} \int_{\sigma - j\infty}^{\sigma + j\infty} (\cdots) \, ds
> $$
> 
> $j$ 从分子跑到分母。
> 
> ---
> 
> ## # **结论**
> 
> $$
> \boxed{
> f(t) = \frac{1}{2\pi j} \int_{\sigma - j\infty}^{\sigma + j\infty} F(s) \, e^{st} \, ds
> }
> $$
> 
> 而不是 $\int_{-\infty}^{\infty} (\cdots) \, ds$。$s$ 在复平面上跑，不是在实轴上跑。

