---
title: "SS-QNA-02"
slug: "signals/signals-and-systems/ss-qna/ss-qna-02"
publishDate: "2026-08-02"
updatedDate: "2026-08-02"
tags: ["SS-QNA","signals","signals-systems"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> **[question]**
> 前面已经推出，单位冲激响应相当于零输入响应，为什么会在 $n\le m$ 的时候出现$\delta (t)$呢？


> **[answer]**
> 这是一个冲激平衡的问题，书中只讨论了 $n > m$ 的情形！
> 关于后面两种情况的分析，详见https://www.bilibili.com/video/BV1tV4y1n7HP/
> 以及郑君里教材写出的清晰的分析思路
> Pasted image 20260802235335.png

> **[important]** 而且经过我的神秘思考
> 从
> $$\frac{d^nr(t)}{dt^n}有\frac{d^n \delta(t)}{dt^n}$$ 
> 所推出的
> 
> $$
> 	\frac{d^{n-1}r(t)}{dt^n}有\frac{d^{n-1} \delta(t)}{dt^n}
> $$
> 到最后的
> 
> $$
> 	\frac{d^n \delta(t)}{dt^n}
> $$
> 是不会被抵消的。阿尤 AI 说的比我好我直接粘贴
> 
>  ****不会互相抵消，因为它们处于 $\delta(t)$ 的不同阶导数上，彼此线性无关。****
> 
>  ****类比：多项式匹配****
> 
> 冲激平衡法的本质，和多项式系数匹配一样。$\delta(t)$ 的各阶导数 $\delta(t), \delta'(t), \delta''(t), \ldots$ 是广义函数空间中**线性无关**的基。就像你不能用 $x^2$ 去抵消 $x^3$ 一样，你不能用 $\delta^{(n-1)}(t)$ 去抵消 $\delta^{(n)}(t)$。
> 
> ---
> 
> ### **具体推导过程**
> 
> 假设 $n=m$，右边最高是 $\delta^{(n)}(t)$。从最高阶开始匹配：
> 
> - **第 $n$ 阶**：左边只有 $r^{(n)}(t)$ 这一项能产生 $\delta^{(n)}(t)$，所以 $r^{(n)}(t)$ 必须包含 $\delta^{(n)}(t)$。
> - **积分一次**：$r^{(n)}(t) \supset \delta^{(n)}(t)$ $\Rightarrow$ $r^{(n-1)}(t) \supset \delta^{(n-1)}(t)$。
> - **再积分**：$r^{(n-2)}(t) \supset \delta^{(n-2)}(t)$，$\ldots$，一直到 $r(t) \supset \delta(t)$。
> 
> 现在把这些代入微分方程左边：
> 
> $$
> a_n\big[\delta^{(n)}+\cdots\big] \;+\; a_{n-1}\big[\delta^{(n-1)}+\cdots\big] \;+\; \cdots \;+\; a_0\big[\delta+\cdots\big]
> $$
> 
> 展开后，$\delta^{(n)}$ 只出现在第一项，$\delta^{(n-1)}$ 只出现在第二项，$\ldots$，$\delta$ 只出现在最后一项。它们**各居其位、互不干扰**。
> 
> ---
> 
> ### **那会不会在某个中间阶次抵消？**
> 
> 唯一可能发生抵消的是**同一阶 $\delta$ 导数**来自不同路径。比如：
> 
> - $r^{(n)}$ 的冲激部分贡献 $\delta^{(n)}$
> - $r^{(n-1)}$ 求导后也贡献 $\delta^{(n)}$（因为 $r^{(n-1)}$ 含 $\delta^{(n-1)}$，求导变 $\delta^{(n)}$）
> 
> 但这里 $r^{(n)}$ 本身就是 $r^{(n-1)}$ 的导数，所以 $r^{(n)}$ 中的 $\delta^{(n)}$ 和 $r^{(n-1)}$ 求导产生的 $\delta^{(n)}$ 是**同一个来源，不是两个独立项**。我们只是从高到低逐级确定各阶冲激的系数，最终所有系数由方程两边对应的 $\delta$ 导数阶次一一匹配确定，不存在"重复计数导致抵消"的问题。
> 
> ---
> 
> ### **结论**
> 
> 冲激平衡法按 $\delta$ 的导数阶次从高到低逐级匹配，每一阶独立求解对应系数。$\delta^{(k)}$ 和 $\delta^{(j)}$（$k \neq j$）是线性无关的，永远不可能互相抵消。这就像解方程时，$x^3$ 的系数和 $x^2$ 的系数各管各，不会串门。




