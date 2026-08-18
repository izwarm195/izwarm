---
title: "Python 杂记"
slug: "machine-and-deep-learning/python/python-杂记"
description: "一种比较有趣的数组创建方式"
publishDate: "2026-08-18T01:22:20+08:00"
createdAt: "2026-08-17T16:21:36.736Z"
updatedDate: "2026-08-18T01:22:20+08:00"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

- 一种比较有趣的数组创建方式
```python
import numpy as np
arr = np.fromfunction(lambda a,b:a+b,(5,5))
```

### 问题一：一定要用 lambda 吗？

**不一定。** 只要是"接受参数、返回一个值"的函数都行。lambda 只是写起来短。

```python
# 用什么函数都行
def add(a, b):
    return a + b

np.fromfunction(add, (5, 5))   # 效果和 lambda 完全一样
```

甚至可以用 NumPy 自带的 ufunc：

```python
np.fromfunction(np.add, (5, 5))
```

lambda 之所以常被用来配 `fromfunction`，是因为这个函数往往只用一次、逻辑简单，不值得单独 `def` 一个命名函数。

---

### 问题二：`(5, 5)` 是迭代器吗？

**不是。** `(5, 5)` 是一个**元组（tuple）**，表示目标数组的**形状（shape）**——5 行 5 列。

它不是用来迭代的，而是告诉 NumPy："我要生成一个 5×5 的数组"。

---

### `fromfunction` 到底怎么工作？

它会先构造两组**索引坐标数组**，再把它们作为参数传给函数：

```python
np.fromfunction(lambda a, b: a + b, (5, 5))
```

1. NumPy 生成两个坐标网格：

```
a = [[0, 0, 0, 0, 0],      a 是"行号"
     [1, 1, 1, 1, 1],
     [2, 2, 2, 2, 2],
     [3, 3, 3, 3, 3],
     [4, 4, 4, 4, 4]]

b = [[0, 1, 2, 3, 4],      b 是"列号"
     [0, 1, 2, 3, 4],
     [0, 1, 2, 3, 4],
     [0, 1, 2, 3, 4],
     [0, 1, 2, 3, 4]]
```

2. 计算 `a + b`：

```
[[0, 1, 2, 3, 4],
 [1, 2, 3, 4, 5],
 [2, 3, 4, 5, 6],
 [3, 4, 5, 6, 7],
 [4, 5, 6, 7, 8]]
```

   ---

### 关键：你的函数会被"向量化调用"一次

注意，`lambda a, b: a + b` 不是被循环调用 25 次，而是**一次性**收到两个 5×5 的坐标数组，向量化地算一次就出结果。

所以这里 `a + b` 是**数组加法**（NumPy 的广播运算），不是 Python 的标量加法，这一点很多人会误解。

---

### 用普通函数时的陷阱

如果你写成：

```python
def my_func(i, j):
    return i + j   # 这里是标量加法
```

传给 `fromfunction` 时，`i` 和 `j` 实际是**整个坐标数组**，所以 `i + j` 仍然是向量化运算，没问题。

但如果你用了 `math.sin` 这种只能处理标量的函数，就会报错：

```python
import math
np.fromfunction(lambda a, b: math.sin(a) + b, (5, 5))
# ❌ math.sin 不接受数组
```

应该用 `np.sin`：

```python
np.fromfunction(lambda a, b: np.sin(a) + b, (5, 5))
```

---

### 一句话总结

`(5, 5)` 是形状元组，不是迭代器；`lambda` 不是必须的，任何函数都行。`fromfunction` 的本质是：**根据形状生成坐标网格，然后把整个网格一次性传给函数做向量化计算**。
