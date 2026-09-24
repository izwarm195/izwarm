---
title: "Python 杂记 IV"
slug: "machine-and-deep-learning/python/python-杂记-iv"
description: "在 PyTorch 中， torch.cat 用于 将多个张量在已有维度上拼接 （不会增加新维度）。对于二维张量（矩阵），核心是控制 dim 参数："
publishDate: "2026-09-03"
createdAt: "2026-09-03T00:00:00Z"
updatedDate: "2026-09-03T22:07:33"
tags: ["NNDL","PyTorch","python","machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# `torch.cat`

在 PyTorch 中，`torch.cat` 用于**将多个张量在已有维度上拼接**（不会增加新维度）。对于二维张量（矩阵），核心是控制 `dim` 参数：

- ** `dim=0` **（默认）：**垂直拼接**（增加行数），要求**列数相同**。
- ** `dim=1` **：**水平拼接**（增加列数），要求**行数相同**。
### 1. dim=0（垂直堆叠）
相当于把两个表格按行“摞”在一起。

```python
import torch

a = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])   # shape: (2, 3)

b = torch.tensor([[7, 8, 9],
                  [10, 11, 12]]) # shape: (2, 3)

# 在行方向拼接（dim=0）
result = torch.cat([a, b], dim=0)
print(result)
print(result.shape)  # torch.Size([4, 3])
```

**输出**：
```
tensor([[ 1,  2,  3],
        [ 4,  5,  6],
        [ 7,  8,  9],
        [10, 11, 12]])
```

---

### 2. dim=1（水平拼接）
相当于把两个表格按列“并排”贴在一起。

```python
a = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])   # shape: (2, 3)

b = torch.tensor([[7, 8],
                  [9, 10]])     # shape: (2, 2)  # 行数必须相同（都是2）

# 在列方向拼接（dim=1）
result = torch.cat([a, b], dim=1)
print(result)
print(result.shape)  # torch.Size([2, 5])
```

**输出**：
```
tensor([[ 1,  2,  3,  7,  8],
        [ 4,  5,  6,  9, 10]])
```

---

### 3. 关键规则（必看）
- **除拼接维度外，其他维度形状必须完全一致**：
  - `dim=0` 时，各张量的 `shape[1]`（列数）必须相等。
  - `dim=1` 时，各张量的 `shape[0]`（行数）必须相等。
- **不会创建新维度**：如果想增加一个维度（比如把多个二维矩阵叠成三维），请用 `torch.stack`。

  ---

### 4. 结合你的场景（机器学习特征拼接）
如果你在构造 Softmax 回归的输入特征，想把 `x1` 和 `x2` 拼成一个形状为 `(batch_size, 2)` 的特征矩阵：

```python
# 假设 x1, x2 都是一维列向量 shape: (100,)
x1 = torch.randn(100)
x2 = torch.randn(100)

# 先变成二维列向量 (100, 1)，再在列方向拼接 -> (100, 2)
features = torch.cat([x1.unsqueeze(1), x2.unsqueeze(1)], dim=1)
print(features.shape)  # torch.Size([100, 2])
```

---

### 常见错误提醒
- **形状不匹配报错**：`RuntimeError: Sizes of tensors must match except in dimension ...`。仔细检查非拼接维度的尺寸。
- **混淆 cat 和 stack**：`cat` 不增维，`stack` 增维。例如把 3 个 `(2,3)` 用 `stack(dim=0)` 会得到 `(3,2,3)`，而 `cat(dim=0)` 得到 `(6,3)`。

  如果还想了解 `torch.stack` 的区别，或者想在三维图中动态更新权重，随时告诉我。

# `torch.stack`

你问的应该是 ** `torch.stack` **（拼写小笔误）。它和 `torch.cat` 的核心区别是：

- ** `cat`（concatenate）**：在**已有**维度上拼接，**不增加**总维度数（如 2 维 → 2 维）。
- ** `stack`（堆叠）**：**新增**一个维度，把多个张量“叠”在一起，总维度数 **+1**。

  要求所有输入张量**形状必须完全相同**（`cat` 只要求非拼接维度相同）。

  ---

### 二维张量堆叠示例（变成三维）

假设有两个 2×2 的矩阵：

```python
import torch

a = torch.tensor([[1, 2],
                  [3, 4]])   # shape: (2, 2)

b = torch.tensor([[5, 6],
                  [7, 8]])   # shape: (2, 2)
```

#### 1. `dim=0`（在第 0 维堆叠，即最外层）
相当于把两个矩阵作为**两个独立的批次/样本**摞起来。

```python
result = torch.stack([a, b], dim=0)
print(result)
print(result.shape)  # torch.Size([2, 2, 2])
```

**输出**：
```
tensor([[[1, 2],
         [3, 4]],

        [[5, 6],
         [7, 8]]])
```
- 新维度在最前面：`[矩阵a, 矩阵b]`。

  ---

#### 2. `dim=1`（在第 1 维堆叠）
相当于把每个矩阵的**第 1 行/列**分别组合在一起。

```python
result = torch.stack([a, b], dim=1)
print(result)
print(result.shape)  # torch.Size([2, 2, 2])
```

**输出**：
```
tensor([[[1, 2],
         [5, 6]],

        [[3, 4],
         [7, 8]]])
```
- 解读：`result[0]` 是 `a` 和 `b` 的第 0 行组成的矩阵；`result[1]` 是 `a` 和 `b` 的第 1 行组成的矩阵。

  ---

#### 3. `dim=2`（在第 2 维堆叠，即最内层）
相当于把每个矩阵的**对应位置元素**打包成向量。

```python
result = torch.stack([a, b], dim=2)
print(result)
print(result.shape)  # torch.Size([2, 2, 2])
```

**输出**：
```
tensor([[[1, 5],
         [2, 6]],

        [[3, 7],
         [4, 8]]])
```
- 解读：`result[0][0]` = `[a[0][0], b[0][0]]` = `[1, 5]`。

  ---

### 与 `cat` 的直观对比（画个表）

| 操作 | 输入形状 | 输出形状 | 是否增维 | 相同形状要求 |
| :--- | :--- | :--- | :--- | :--- |
| `cat([a,b], dim=0)` | (2,2), (2,2) | **(4, 2)** | ❌ 不增 | 列数必须相同 |
| `stack([a,b], dim=0)` | (2,2), (2,2) | **(2, 2, 2)** | ✅ 增加 | **所有维度必须完全相同** |

---

### 结合你的机器学习场景（特征拼接 vs 堆叠）

- **用 `cat` **：把 `x1` 和 `x2` 拼成一个特征矩阵 `(batch, 2)`，**不增加新维度**。
- **用 `stack` **：如果你有多个批次的特征矩阵 `(batch, 2)`，想合成一个三维张量 `(批次组数, batch, 2)`，就用 `stack`。

  举个实际例子——你有 3 个不同的 Softmax 权重向量 `w0, w1, w2`（都是长度为 3 的一维张量），想堆成权重矩阵：

```python
w0 = torch.tensor([1.0, -1.0, 2.0])
w1 = torch.tensor([0.0, 1.0, -1.0])
w2 = torch.tensor([-1.0, 0.5, 0.5])

# 堆成 (3, 3) 的权重矩阵，每一行是一个类别权重
W = torch.stack([w0, w1, w2], dim=0)
print(W.shape)  # torch.Size([3, 3])
```

  ---

### 常见报错提醒
- **形状不匹配**：`stack` 要求所有张量形状**完全一致**，否则报错 `RuntimeError: stack expects each tensor to be equal size`。而 `cat` 只要求非拼接维度一致。
- **维度索引越界**：对于形状 `(2,2)`，`dim` 可选范围是 `0, 1, 2`（等于原维度数），超出会报错。

  如果你是想在之前的三维 Softmax 图中把多个权重向量堆起来循环绘制，或者有其他具体用法，随时告诉我，我可以结合你的代码给出更贴切的示例。
