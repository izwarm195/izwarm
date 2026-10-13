---
title: "Python 杂记 11 - register_buffer"
slug: "machine-and-deep-learning/python/misc/11-register-buffer"
description: "register_buffer 是 PyTorch nn.Module 自带的方法，用来把一个 不需要训练、但属于模型一部分的张量 注册到模块里。它不是你自己定义的，而是继承自 nn.Module 。"
publishDate: "2026-10-12"
createdAt: "2026-10-12T00:00:00Z"
updatedDate: "2026-10-12T20:15:57"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python","Python 杂记"]
---

# `nn.Module::register_buffer`
`register_buffer` 是 PyTorch `nn.Module` 自带的方法，用来把一个**不需要训练、但属于模型一部分的张量**注册到模块里。它不是你自己定义的，而是继承自 `nn.Module`。

---

## 1. 在代码里在哪用

在 `CausalSelfAttention.__init__` 里：

```python
mask = torch.triu(torch.ones(block_size, block_size), diagonal=1).bool()
self.register_buffer('mask', mask)
```

意思是：

- 创建一个 `block_size × block_size` 的上三角布尔掩码；
- 把它注册成名为 `'mask'` 的 buffer；
- 之后在 `forward` 里直接用 `self.mask`：

```python
att = att.masked_fill(self.mask[:T, :T], float('-inf'))
```

  ---

## 2. 它在哪里定义

`register_buffer` 定义在 PyTorch 的 `torch.nn.Module` 类里，源码位置大致是：

```text
torch/nn/modules/module.py
```

所有继承 `nn.Module` 的类都能调用它，包括 `CausalSelfAttention`。

你不需要 `import` 它，也不需要自己写，它是父类方法。

---

## 3. 它到底做了什么

调用：

```python
self.register_buffer('mask', mask)
```

等价于在模块里登记：

```text
名字：'mask'
张量：mask
属性：不是 Parameter，不需要梯度
```

登记之后：

1. `self.mask` 可以像普通属性一样访问；
2. 调用 `model.to(device)` 时，`mask` 会自动跟着搬到 GPU/CPU；
3. 保存 `state_dict()` 时，`mask` 会被包含；
4. 加载 `state_dict()` 时，`mask` 会被恢复；
5. `mask` **不会**出现在 `model.parameters()` 里，不参与优化器更新；
6. `mask` 的 `requires_grad` 默认是 `False`，不计算梯度。

   ---

## 4. 和普通属性、Parameter 的区别

### 普通属性

```python
self.mask = mask
```

可以访问，但：

- `model.to(device)` 不会自动搬它；
- `state_dict()` 不会保存它；
- 如果换了设备，`self.mask` 可能还在 CPU，导致设备不匹配。

### `nn.Parameter`

```python
self.mask = nn.Parameter(mask)
```

会被当成可训练参数：

- 出现在 `model.parameters()`；
- 优化器会更新它；
- 需要梯度；
- 对固定掩码来说完全没必要。

### `register_buffer`

正好介于两者之间：

- 像属性一样访问；
- 自动随模型迁移设备；
- 保存/加载；
- 不训练、不更新。

  这就是它最适合固定掩码的原因。

  ---

## 5. 为什么这里要用 buffer

因果掩码是固定的，不需要学习：

```text
上三角为 True，对角线及以下为 False
```

如果每次前向都重新生成：

```python
mask = torch.triu(torch.ones(T, T), diagonal=1).bool()
```

也能跑，但：

- 每次都要新建张量；
- 如果忘了放到正确设备，会报错；
- 不能随 `state_dict` 保存。

  用 `register_buffer` 后：

- 只生成一次；
- 自动跟模型走；
- 代码干净。

  ---

## 6. 完整例子

```python
class CausalSelfAttention(nn.Module):
    def __init__(self, n_embd, n_head, block_size, dropout=0.0):
        super().__init__()
        ...
        mask = torch.triu(torch.ones(block_size, block_size), diagonal=1).bool()
        self.register_buffer('mask', mask)

    def forward(self, x):
        B, T, C = x.shape
        ...
        att = att.masked_fill(self.mask[:T, :T], float('-inf'))
        ...
```

---

## 7. 一句话总结

```text
register_buffer 是 nn.Module 的方法，用来注册不需要梯度、但要随模型保存和迁移的张量。
它在 torch/nn/modules/module.py 中定义。
代码里用它保存因果掩码，避免每次前向重建，并保证 mask 自动放到正确设备。
```
