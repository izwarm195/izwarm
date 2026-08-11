---
title: "SS-QNA-04"
slug: "signals/signals-and-systems/ss-qna/ss-qna-04"
publishDate: "2026-08-05"
createdAt: "2026-08-05T00:00:00Z"
updatedDate: "2026-08-05"
tags: ["SS-QNA","template","signals"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> <span class="callout-badge" data-callout="question"></span>**3.3.3 到底要表达什么？**


> <span class="callout-badge" data-callout="answer"></span>**Answer**
>> 下面是大肥鲸之回答，感觉回答了个寂寞。
> 
> 3.3.3 的核心就一句话：**指数形式傅里叶级数和三角函数形式是同一件事的两种等价写法，指数形式的系数 $F(n\omega_1)$ 恰好把幅度和相位信息合成一个复数**，由此引出"复数频谱"以及它的对称性。
> 
> 拆开说就三点：
> 
> 1. **两种形式等价，系数只是换了个包装。** 同一个 $f(t)$，三角形式用 $\cos/\sin$ 展开（系数是实数 $a_n,b_n$），指数形式用 $e^{jn\omega_1t}$ 展开（系数是复数 $F(n\omega_1)$）。两者通过 $F(n\omega_1)=\frac{a_n-jb_n}{2}$（$n\neq 0$）对应——相当于把"余弦+正弦"两项合并成一个复数，$n$ 和 $-n$ 各分一半。
>     
> 2. **复数频谱怎么读。** 既然 $F(n\omega_1)$ 是复数，就写成模和辐角：$F=|F|e^{j\varphi_n}$。于是 $|F(n\omega_1)|=\frac{1}{2}\sqrt{a_n^2+b_n^2}=\frac{1}{2}c_n$ 是幅度谱，$\varphi_n=\arctan(-b_n/a_n)$ 是相位谱。注意幅度正好是三角形式幅度谱 $c_n$ 的一半，因为指数形式把能量拆到了正、负两个频率上。
>     
> 3. **对称性结论。** 由 $a_n$ 偶、$b_n$ 奇立刻推出 $|F(n\omega_1)|$ 是偶函数、$\varphi_n$ 是奇函数。这就是"实信号的复数频谱共轭对称"的雏形，后面讲傅里叶变换性质时还会见到同一件事。
>     
> 
> 所以这一节本质上是"换视角"：从实数的 $\cos/\sin$ 转到复数的 $e^{j\omega t}$ 后，频谱变成一个复数函数，幅度、相位一目了然，而且天然带着偶、奇对称性。周期矩形脉冲的例子只是为了验证 $F=\frac{a_n}{2}$ 这个对应关系。

