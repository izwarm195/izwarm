---
title: "Python 杂记 12 - einsum"
slug: "machine-and-deep-learning/python/misc/12-einsum"
description: "einsum（Einstein summation，爱因斯坦求和） 是一种用“索引标记”统一表达张量运算的写法，常见于 NumPy、PyTorch、TensorFlow、JAX 等。"
publishDate: "2026-10-18"
createdAt: "2026-10-18T00:00:00Z"
updatedDate: "2026-10-18T20:59:39"
tags: ["machine-learning","python","PyTorch"]
series: ["Machine & Deep Learning","Python","Python 杂记"]
---

**einsum（Einstein summation，爱因斯坦求和）** 是一种用“索引标记”统一表达张量运算的写法，常见于 NumPy、PyTorch、TensorFlow、JAX 等。

核心规则：

1. 每个输入张量的维度用字母标记，如 `i,j,k`。
2. 输出中保留哪些索引，由 `->` 右边决定。
3. 没出现在输出里的索引会被求和。
4. 同一输入里重复的索引表示取对角线。
5. `...` 表示广播/保留任意多前置维度。

   基本形式：

```python
np.einsum("输入索引->输出索引", 张量...)
```

## 常见例子

### 1. 矩阵乘法

```python
C = np.einsum("ij,jk->ik", A, B)
```

等价于：

```python
C = A @ B
```

因为 `j` 不在输出中，所以对 `j` 求和：

\[
C_{ik}=\sum_j A_{ij}B_{jk}
\]

### 2. 转置

```python
B = np.einsum("ij->ji", A)
```

等价于：

```python
B = A.T
```

### 3. 求和

```python
s = np.einsum("ij->", A)
```

等价于：

```python
s = A.sum()
```

### 4. 按行求和 / 按列求和

```python
row_sum = np.einsum("ij->i", A)  # 每行求和
col_sum = np.einsum("ij->j", A)  # 每列求和
```

### 5. 迹 trace

```python
tr = np.einsum("ii->", A)
```

等价于：

```python
tr = np.trace(A)
```

### 6. 取对角线

```python
d = np.einsum("ii->i", A)
```

等价于：

```python
d = np.diag(A)
```

### 7. 外积

```python
C = np.einsum("i,j->ij", a, b)
```

等价于：

```python
C = np.outer(a, b)
```

### 8. 逐元素乘再求和 / 内积

```python
s = np.einsum("i,i->", a, b)
```

等价于：

```python
s = np.dot(a, b)
```

### 9. 逐元素乘法

```python
C = np.einsum("ij,ij->ij", A, B)
```

等价于：

```python
C = A * B
```

### 10. batch 矩阵乘法

```python
C = np.einsum("bij,bjk->bik", A, B)
```

等价于：

```python
C = np.matmul(A, B)
```

## 隐式输出

也可以不写 `->`：

```python
np.einsum("ij,jk", A, B)
```

隐式规则是：输出索引为在输入中**只出现一次**的索引，并按字母排序。因此：

```python
np.einsum("ij,jk", A, B)
```

等价于：

```python
np.einsum("ij,jk->ik", A, B)
```

但实际代码中建议显式写 `->`，更清晰。

## PyTorch 用法

```python
import torch

C = torch.einsum("bij,bjk->bik", A, B)
```

和 NumPy 基本一致。

## 性能注意

`einsum` 很灵活，但不一定总是最快。对于矩阵乘法等标准运算，通常 `@` / `matmul` 更快。NumPy 中可以开启优化：

```python
np.einsum("ij,jk->ik", A, B, optimize=True)
```

复杂表达式可考虑 `opt_einsum`。

## 一句话总结

`einsum` 就是：

> 用索引描述“哪些维度参与相乘、哪些维度保留、哪些维度求和”的通用张量运算 DSL。

例如：

```python
np.einsum("ij,jk->ik", A, B)
```

读作：`A[i,j] * B[j,k]`，对 `j` 求和，得到 `C[i,k]`。
