---
title: "SS-QNA-05"
slug: "signals/signals-and-systems/ss-qna/ss-qna-05"
publishDate: "2026-08-06"
createdAt: "2026-08-06T00:00:00Z"
updatedDate: "2026-08-06"
tags: ["SS-QNA","template","signals"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> **[question]**
> 为什么这里的 $a_{0}$ 会有不同？为什么在三角函数形式下的傅里叶分解， 其正余弦分量是 $\frac{2}{T}$ 的形式而不是 $\frac{1}{T}$？也即为什么直流分量的幅值会是正余弦分量振幅的 $\frac{1}{2}$？



> **[answer]**
> # - 首先为什么这个教材这么写：
> > 注意在郑君里及很多教材中，$a_0$ 就是 $a_n$ 中 $a=0$ 的情况，因此 $f(t)=\frac{a_0}{2}+\dots$
> 
> 这实际上是因为这本书对傅里叶级数的阐释，是基于“正交分解”这一概念的。因此在统一的形式
> $$\begin{aligned}a_{0}&=\frac{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\cos0\omega_{1}t\mathrm{d}t}{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}\cos^{2}0\omega_{1}t\mathrm{d}t}=\frac{1}{T_{1}}\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\cos0\omega_{1}t\mathrm{d}t\\&=\frac{1}{T_{1}}\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\mathrm{d}t\end{aligned}$$
> $$\begin{aligned}a_{n}&=\frac{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\cos n\omega_{1}t\mathrm{d}t}{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}\cos^{2}n\omega_{1}t\mathrm{d}t}=\frac{2}{T_{1}}\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\cos n\omega_{1}t\mathrm{d}t\\b_{n}&=\frac{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\sin n\omega_{1}t\mathrm{d}t}{\displaystyle\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}\sin^{2}n\omega_{1}t\mathrm{d}t}=\frac{2}{T_{1}}\int_{-\frac{T_{1}}{2}}^{\frac{T_{1}}{2}}f(t)\sin n\omega_{1}t\mathrm{d}t\end{aligned}
> $$
> 下，直流分量直接写 $a_0$ 更为自然。
> # - 其次为什么有一个 $\frac{1}{2}$?
> 这其实是一个直观理解的问题。实际上就是我蠢。画个图
> Pasted image 20260806204500.png
> 
