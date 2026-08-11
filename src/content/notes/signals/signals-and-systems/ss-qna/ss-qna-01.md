---
title: "SS-QNA-01"
slug: "signals/signals-and-systems/ss-qna/ss-qna-01"
description: "h(t) left sum_{i 1}^{n}A_{i} mathrm{e}^{ alpha_{i}t} right u(t)"
publishDate: "2026-08-02"
createdAt: "2026-08-02T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["SS-QNA","signals","signals-systems"]
series: ["Signals","Signals & Systems","SS-QNA"]
---

> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**Question**
$$
h(t)=\left[\sum_{i=1}^{n}A_{i}\mathrm{e}^{\alpha_{i}t}\right]u(t)
$$
由冲激响应的微分方程，得到的这个解的形式 h(t)。
>  那么对 h(t)求导会得到冲激函数。然而，一般的响应都能写为 $f\cdot u(t)$ 的形式，难道所有相应都是冲激响应吗？

> <img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer">**Answer**
> 问这个问题的时候没有看懂本节前面的一段话：
> **因此  $\delta (t)$ 作用系统的过程就是，在 0 时刻的瞬间将其能量转化为系统的储能，**
> 因此这个问题应该问的是：
>> 然而，一般的*零输入*响应都能写为 $f\cdot u(t)$ 的形式，难道所有*零输入*响应都是冲激响应吗？
> 
> 当然不是了你个啥子。冲激激励只是在 t=0 的时候瞬间给了一个初始状态，因此产生跳变（不一定是 h(t)直接跳变，后面复制一个 AI 睿智分析），

跳变情况：

| 条件 | $h(t)$ 含 $\delta$ | 跳变情况 |
|------|-------------------|----------|
| $n > m, n-m=1$ | 否 | $h(t)$ 有限跳变（台阶） |
| $n > m, n-m \ge 2$ | 否 | $h(t)$ 连续，但 $h^{(n-m-1)}$ 跳变 |
| $n=m$ | 是，含 $\delta(t)$ | $h(t)$ 含冲激跳变 |
| $n<m$ | 是，含 $\delta$ 及导数 | 多阶冲激 |

