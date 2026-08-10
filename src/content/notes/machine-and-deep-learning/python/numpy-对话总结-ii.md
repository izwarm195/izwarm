---
title: "Numpy 对话总结 II"
slug: "machine-and-deep-learning/python/numpy-对话总结-ii"
description: "1、np.atleast_xd 传入多参数"
date: "2026-08-02"
updated: "2026-08-02"
category: "Machine & Deep Learning"
section: "Python"
tags: ["machine-learning","python"]
status: "published"
---

1、np.atleast_xd 传入多参数
是的，`np.atleast_2d`（以及 `1d`、`3d`）都支持同时传入多个数组。
### 签名

```python
numpy.atleast_2d(*arys)
```

`*arys` 表示可以接收任意数量的数组参数，返回值也是同样数量的数组（打包在元组里，可直接解包）。

### 具体例子

```python
Z = np.array([
    [0, 10],
    [1, 20],
    [2, 30]
])

X, Y = np.atleast_2d(Z[:, 0], Z[:, 1])
```

等价于：

```python
X = np.atleast_2d(Z[:, 0])
Y = np.atleast_2d(Z[:, 1])
```

2、fill_diagonal 和类似函数

`np.fill_diagonal` 属于"原地修改数组特定区域"这一类函数。以下几组功能相近：

---

### **对角线族**

```python
np.fill_diagonal(a, val)             # 主对角线填 val
np.fill_diagonal(a, val, wrap=True)  # 允许非方阵，超出不报错

np.diag(a)                           # 提取对角线 / 用一维数组构造对角矩阵
np.diag_indices(n)                   # 返回 (n,) 方阵对角线的索引
np.diag_indices_from(a)              # 根据数组形状返回对角线索引
np.diagflat(v)                       # 用 v 构造对角矩阵（v 可以是 2D，展平后用）
```

---

### **三角矩阵族**

```python
np.triu(a, k=0)     # 上三角，k 控制偏移量
np.tril(a, k=0)     # 下三角
```

它们返回**副本**而非原地修改；原地赋值可结合花式索引：

```python
a[np.triu_indices_from(a, k=1)] = 0   # 上三角（不含对角线）置零
a[np.tril_indices_from(a, k=-1)] = 0  # 下三角（不含对角线）置零
```

相关索引工具：

```python
np.triu_indices(n)           # (n, n) 上三角的索引
np.triu_indices_from(a)      # 根据数组形状生成上三角索引
np.tril_indices(n)
np.tril_indices_from(a)
```

---
### **索引网格工具**

这些返回的是坐标数组而非直接修改，但可用于花式索引赋值：

```python
a[np.triu_indices_from(a, k=1)] = 0

rows, cols = np.indices(a.shape)
mask = rows > cols
a[mask] = 0
```

---

### **mask 与 where 原地赋值**

本质上也是"选定区域后修改"：

```python
a[a > threshold] = 0                 # 大于阈值的元素置零
np.put(a, indices, values)           # 按展平索引原地写入
np.putmask(a, mask, values)          # 按布尔掩码原地写入
np.place(a, condition, values)       # 按条件原地写入（values 不够会重复）
```

---

### **快速对照表**

| 操作 | 函数 / 写法 |
|---|---|
| 主对角线填值 | `np.fill_diagonal(a, val)` |
| 主对角线提取 | `np.diag(a)` |
| 上三角置零 | `a[np.triu_indices_from(a, k=1)] = 0` |
| 下三角置零 | `a[np.tril_indices_from(a, k=-1)] = 0` |
| 上三角返回 | `np.triu(a)` |
| 下三角返回 | `np.tril(a)` |
| 大于某值全改 | `a[a > x] = val` |
| 按掩码改值 | `np.putmask(a, mask, val)` |
| 按展平索引改值 | `np.put(a, idx, val)` |
| 按条件改值 | `np.place(a, cond, val)` |
| 任意对角线改值 | `a[rows, cols] = val` + `np.diag_indices_from` |

---

### 一句话总结

`np.fill_diagonal` 的核心特点是**原地修改 + 对角线**。同一家族里：`triu/tril` 返回副本（需配合索引才能原地改），`put/putmask/place` 覆盖更通用的区域修改，`diag_indices/triu_indices` 负责生成目标区域的坐标索引。

3、True/False 的统计 & `np.nonzero()`
### 是的，NumPy 的 `sum` 对布尔数组自动按 `True=1, False=0` 计算

拆开来看：

```python
prices = np.random.randint(50, 150, (30, 5))

step1 = np.diff(prices, axis=0)      # (29, 5)，每天相对前一天的价格变化
step2 = step1 > 0                     # (29, 5)，布尔数组，涨为 True，跌为 False
step3 = step2.sum(axis=0)             # (5,)，每列 True 的个数 = 上涨天数
```

`step2.sum(axis=0)` 的效果等同于"数每只股票有多少天是上涨的"，因为 `True` 参与求和时被当作 `1`，`False` 被当作 `0`。

---

### 这其实是 Python 的一个通用特性

`bool` 是 `int` 的子类，`True ** 1`，`False ** 0`，所以：

```python
True + True + False   # → 2
np.array([True, False, True]).sum()   # → 2
```

不只是 NumPy，Python 原生也这样：

```python
sum([True, False, True])   # → 2
```

---

### 如果不想依赖隐式转换，也可以显式写

```python
(step2).sum(axis=0)              # 隐式，常用
step2.astype(int).sum(axis=0)    # 显式，但多一步
np.count_nonzero(step2, axis=0)  # 语义最明确
```

`np.count_nonzero` 在语义上就是"统计 True 的个数"，和 `.sum()` 在布尔数组上结果完全一样，但读起来更直白。日常写代码两种都可以，`.sum()` 更短，`count_nonzero` 表意更清楚。
