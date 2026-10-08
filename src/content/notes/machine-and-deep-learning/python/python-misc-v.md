---
title: "Python 杂记 V"
slug: "machine-and-deep-learning/python/python-misc-v"
description: "torch.squeeze 是 PyTorch 中用于 删除维度大小为 1 的函数。它返回输入张量的一个 视图 （View），与原始数据共享内存。"
publishDate: "2026-09-06"
createdAt: "2026-09-06T00:00:00Z"
updatedDate: "2026-09-06T16:22:39"
tags: ["machine-learning","PyTorch","python"]
series: ["Machine & Deep Learning","Python"]
---

# `torch.squeeze`

`torch.squeeze` 是 PyTorch 中用于**删除维度大小为 1** 的函数。它返回输入张量的一个**视图**（View），与原始数据共享内存。

### 1. 函数签名
```python
torch.squeeze(input, dim=None, *, out=None) -> Tensor
```

### 2. 参数详解
- ** `input` **：输入的张量。
- ** `dim` **（可选）：指定要删除的维度索引。
  - **不传**：删除**所有**大小为 1 的维度。
  - **传入指定维度**：仅当该维度大小为 1 时删除，否则**保持不变**（不会报错）。

### 3. 代码示例
```python
import torch

x = torch.randn(1, 3, 1, 5)  # 形状: (1, 3, 1, 5)

# 1. 不传 dim：删除所有尺寸为1的维度
y = torch.squeeze(x)
print(y.shape)  # 输出: torch.Size([3, 5])  (去掉了第0维和第2维)

# 2. 传入 dim=0（该维度是1，成功删除）
z = torch.squeeze(x, dim=0)
print(z.shape)  # 输出: torch.Size([3, 1, 5])

# 3. 传入 dim=1（该维度是3，不是1，原样返回，不报错）
w = torch.squeeze(x, dim=1)
print(w.shape)  # 输出: torch.Size([1, 3, 1, 5]) (形状完全不变)
```

### 4. 重要注意事项（高频踩坑点）
- **返回的是视图（View）**：`y = torch.squeeze(x)` 返回的新张量与 `x` 共享底层内存。如果修改 `y` 的数据，`x` 也会同步改变。
  ```python
  x = torch.randn(1, 2)
  y = torch.squeeze(x)
  y[0] = 999
  print(x)  # x 的第一个元素变成了 999
  ```
- **批量维度处理**：常用于深度学习推理时，去掉 Batch 维度（如 `[1, 3, 224, 224]` -> `[3, 224, 224]`）。
- **原地操作**：有对应的 in-place 版本 `torch.squeeze_()`，会直接修改原张量。
- **与 `unsqueeze` 对应**：`unsqueeze` 是增加维度大小为 1 的操作，两者常配合使用以调整矩阵乘法的广播机制。

  如果你需要对特定形状做更精细的控制（比如只删除第一维，不管其他维是否是 1），就用 `dim` 参数；如果想“摊平”所有单例维度，直接调用 `torch.squeeze(x)` 即可。

#  `.T` & `.t()`

在 PyTorch 中，`.T` 和 `.t()` **绝对不是同义词**，它们最大的区别在于**维度限制**和**转置逻辑**。很多人会把它们混淆成 NumPy 里的用法，但在 PyTorch 里要特别小心。

### 1. `.t()` —— 仅适用于 2D 及以下（矩阵转置）
- **限制**：只能用于 **0 维（标量）、1 维（向量）和 2 维（矩阵）**。如果张量维度 > 2，直接报错 `RuntimeError`。
- **效果**：
  - 2D：标准的矩阵转置（交换行和列）。
  - 1D 或 0 D：返回原张量本身（不变）。
- **返回值**：返回视图（View），与原始数据共享内存。

### 2. `.T` —— 适用于任意维度（交换第 0 维和第 1 维）
- **限制**：**没有维度限制**，适用于任意维度的张量。
- **效果**：它是 `torch.transpose(input, 0, 1)` 的别名，**只交换第 0 维和第 1 维**，其他维度（第 2、3...维）的位置保持原样不动。
- **返回值**：返回视图（View）。

  ---

### 代码对比（含 3D 张量，这是最易错的点）

```python
import torch

# 1. 对比 2D 矩阵 (两者效果一样)
x_2d = torch.randn(2, 3)
print(x_2d.t().shape)   # torch.Size([3, 2])
print(x_2d.T.shape)     # torch.Size([3, 2])

# 2. 对比 3D 张量 (截然不同！)
x_3d = torch.randn(2, 3, 5)  # 形状: (2, 3, 5)

# .t() 会报错！
# x_3d.t()  # RuntimeError: t() expects a tensor with <= 2 dimensions, but self is 3D

# .T 正常工作：只交换第0维(2)和第1维(3)，第2维(5)原地不动
print(x_3d.T.shape)   # 输出: torch.Size([3, 2, 5])  
# 注意！结果是 (3, 2, 5)，而不是把三个维度倒序的 (5, 3, 2)
```

---

### 3. 拓展补充：如果你想要“多维全部倒序”或“批量矩阵转置”

- ** `torch.permute` **：如果你想把 3D `(2, 3, 5)` 变成 `(5, 3, 2)`，需要手动指定维度顺序：`x_3d.permute(2, 1, 0)`。
- ** `.mT` **（PyTorch 1.9+ 引入）：专门用于**批量矩阵转置**，交换**最后两个维度**。这在批量注意力计算中极常用。
  ```python
  x_batch = torch.randn(4, 2, 3)  # (批次, 行, 列)
  print(x_batch.mT.shape)         # 输出: torch.Size([4, 3, 2]) (交换了最后两维)
  ```

  ---

### 4. 重要共有特性（连续性问题）
`.T` 和 `.t()` 返回的都是**视图（View）**，不会复制内存。但转置操作通常会导致张量在内存中变得**不连续（non-contiguous）**。

如果你在转置后直接调用 `.reshape()` 或执行某些需要连续内存的运算（如 `view`），可能会报错。**安全操作**是：转置后如果需要改变形状，记得加上 `.contiguous()`：

```python
x = torch.randn(2, 3)
y = x.T.contiguous()  # 强制内存连续化
```

**总结记忆口诀**：
- `.t()` —— **小写 t，只爱二维**（多维报错）。
- `.T` —— **大写 T，只换前两维**（多维不报错，但别以为它全反转了）。
- 如果要做批量矩阵乘法转置，优先用 `.mT`。
