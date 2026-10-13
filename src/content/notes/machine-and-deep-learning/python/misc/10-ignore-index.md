---
title: "Python 杂记 10 - ignore_index(-100) 与 CrossEntropy"
slug: "machine-and-deep-learning/python/misc/10-ignore-index"
description: "tgt_out 设成 100 ，是因为 PyTorch 的 F.cross_entropy 默认把 100 当作“忽略这个标签”的标记 ，也叫 ignore_index 。"
publishDate: "2026-10-11"
createdAt: "2026-10-11T00:00:00Z"
updatedDate: "2026-10-11T20:50:26"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python","Python 杂记"]
---

# `-100` & CrossEntropy

`tgt_out` 设成 `-100`，是因为 **PyTorch 的 `F.cross_entropy` 默认把 `-100` 当作“忽略这个标签”的标记**，也叫 `ignore_index`。

代码里：

```python
tgt_out = torch.full((n, TGT_LEN), -100, dtype=torch.long)
```

先把整个张量填成 `-100`，表示“这些位置都没有监督标签”。然后只填真实有效的位置：

```python
tgt_out[row, :len(t) - 1] = torch.tensor(t[1:])
```

所以最终：

- 有效 token 位置：真实 token id，比如 `你`、`好`、`EOS`；
- 右填充位置：`-100`。

  ---

## 为什么不用 `PAD=0` 来填充标签？

因为 `PAD=0` 在词表里是一个**真实存在的 id**。如果标签位置写 `0`，`cross_entropy` 会把它当成一个正常类别，要求模型去预测 `PAD`。但模型不应该被训练去预测填充符，也不应该在填充位置产生损失。

所以需要一个**不在词表里的特殊值**，专门表示“忽略我”。PyTorch 选了 `-100` 作为默认忽略值。

---

## `F.cross_entropy` 怎么忽略？

代码里：

```python
loss = F.cross_entropy(logits.reshape(-1, logits.size(-1)), targets.reshape(-1))
```

没有显式传 `ignore_index`，因为默认就是：

```python
ignore_index=-100
```

等价于：

```python
loss = F.cross_entropy(..., ignore_index=-100)
```

计算时，所有标签为 `-100` 的位置：

- 不参与 loss 求和；
- 不产生梯度；
- 不影响参数更新。

  ---

## 例子

假设中文是 `你好`，`TGT_LEN=8`：

```text
tgt_in  = [BOS, 你, 好, PAD, PAD, PAD, PAD, PAD]
tgt_out = [你, 好, EOS, -100, -100, -100, -100, -100]
```

训练时：

| 位置 | 输入 | 标签 | 是否计算损失 |
|---:|---|---|---|
| 0 | BOS | 你 | 是 |
| 1 | 你 | 好 | 是 |
| 2 | 好 | EOS | 是 |
| 3 | PAD | -100 | 否 |
| 4 | PAD | -100 | 否 |
| ... | ... | ... | 否 |

模型只在有真实标签的位置被监督，填充位置完全跳过。

---

## 如果手动实现，也可以这样

```python
mask = tgt_out != -100
loss = F.cross_entropy(logits[mask], tgt_out[mask])
```

但 PyTorch 的 `ignore_index=-100` 把这件事内置了，一行就完成，更省事。

---

一句话总结：

```text
-100 是 F.cross_entropy 默认的 ignore_index；
tgt_out 用 -100 填充 pad 位置，让这些位置不参与损失和梯度；
不用 0，是因为 0 是 PAD 的真实 id，会被当成正常类别训练。
```
