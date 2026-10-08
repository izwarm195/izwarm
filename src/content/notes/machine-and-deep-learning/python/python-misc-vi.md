---
title: "Python 杂记 VI"
slug: "machine-and-deep-learning/python/python-misc-vi"
description: "from functools import partial 导入的 partial ，是 Python 中用于 冻结（固定）函数的部分参数 ，从而生成一个新函数的高阶工具。"
publishDate: "2026-09-07"
createdAt: "2026-09-07T00:00:00Z"
updatedDate: "2026-09-10T17:19:48"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# `from functools import partial` 

`from functools import partial` 导入的 ** `partial` **，是 Python 中用于**冻结（固定）函数的部分参数**，从而生成一个新函数的高阶工具。

通俗来说，**它可以把一个参数繁多的函数，变成参数更少的新函数**，同时把原函数的某些参数“内置”进新函数里。

---

### 1. 核心用法与原理
它的标准写法是：
```python
new_func = partial(func, /, *args, **kwargs)
```
- 当你调用 `new_func` 时，实际执行的是：`func(*args, *call_args, **kwargs, **call_kwargs)`
- **注意顺序**：`partial` 预设的参数会**放在实际调用传入参数的前面**（对于位置参数而言）。

  ---

### 2. 最简单的例子（数学运算）
假设有一个求幂函数：
```python
def power(base, exponent):
    return base ** exponent

# 我们经常需要计算“平方”，即固定 exponent=2
square = partial(power, exponent=2)

print(square(5))  # 输出 25，相当于 power(5, exponent=2)
print(square(10)) # 输出 100
```
这样你就不需要每次写 `power(x, 2)` 了。

---

### 3. 在深度学习 / PyTorch 中的典型场景（结合你之前的提问）
在训练模型时，我们经常需要自定义 `DataLoader` 的 `collate_fn`（数据整理函数），但该函数通常只接收 `batch` 一个参数。如果你有一个需要传入 `tokenizer` 或 `max_len` 的整理函数，就可以用 `partial` 来“固化”它们：

```python
from functools import partial

def my_collate(batch, tokenizer, max_len):
    # 对 batch 进行处理，需要用到 tokenizer 和 max_len
    ...

# 创建 DataLoader 时，固定 tokenizer 和 max_len
train_loader = DataLoader(
    dataset, 
    batch_size=32, 
    collate_fn=partial(my_collate, tokenizer=tokenizer, max_len=128)
)
```
这时候 `partial` 帮你生成了一个**只有 `batch` 一个参数的新函数**，完美契合了 `DataLoader` 的接口要求。

---

### 4. 为什么不用 `lambda`？（`partial` 的优势）
初学者常会用 `lambda x: power(x, 2)` 来实现类似效果。但 `partial` 有两大明显优势：

- **保留元信息**：`partial` 生成的对象会保留原函数的 `__doc__`（文档字符串）和 `__name__`（函数名），方便调试和日志打印；而 `lambda` 会被统一标记为 `<lambda>`。
- **处理默认参数更安全**：`partial` 支持固定关键字参数，且不会像 `lambda` 那样容易被错误地循环引用（特别是在列表推导中）。

  ---

### 5. 一个重要细节（位置参数的顺序问题）
如果你固定的是**位置参数**，新函数调用时传入的参数会**追加在后面**，而非替换。

```python
def add(a, b, c):
    return a + b + c

# 固定 a=10，新函数只接收剩余参数
add_10 = partial(add, 10) 
print(add_10(1, 2))  # 输出 13 （相当于 add(10, 1, 2)）
```
如果想固定后面的参数，必须使用**关键字参数**（如 `partial(add, c=10)`），否则会错位。

---

### 6. 实战小技巧：配合类方法使用
如果你想把某个类的方法独立出来当函数用，但又希望固定 `self` 实例，也可以直接用 `partial`，这比 `lambda` 更优雅。

```python
class Processor:
    def run(self, data, mode='fast'):
        ...

proc = Processor()
# 固定实例 proc，并默认用 'fast' 模式
fast_processor = partial(proc.run, mode='fast')
```

总结一句话：** `partial` 是“预填参数”的万能工厂**，用来简化函数调用、适配接口、减少样板代码，是 Python 函数式编程中非常趁手的利器。如果你在写回调函数（Callback）或需要传递无参函数给调度器时，它往往是最高效的解法。😊

# `torch.randperm()`
`torch.randperm` 是 PyTorch 中用来生成**随机排列**的函数，常用于打乱索引、数据集洗牌等场景。

## 基本用法

```python
torch.randperm(n, *, generator=None, out=None, dtype=torch.int64,
                layout=torch.strided, device=None, requires_grad=False,
                pin_memory=False)
```

返回一个长度为 `n` 的一维张量，内容是 `0` 到 `n-1` 的一个随机排列。

```python
import torch

print(torch.randperm(5))
# 可能输出: tensor([3, 0, 4, 1, 2])
```

等价于 Python 的：

```python
import random
lst = list(range(5))
random.shuffle(lst)
```

也类似于 `numpy.random.permutation(n)`。

## 参数说明

| 参数 | 说明 |
|---|---|
| `n` | 整数，排列范围是 `[0, n-1]` |
| `generator` | 随机数生成器，用于固定随机结果 |
| `out` | 输出张量 |
| `dtype` | 返回张量类型，默认 `torch.int64` |
| `device` | 指定设备，如 `'cuda'` |
| `requires_grad` | 是否记录梯度（一般用不到） |
| `pin_memory` | 是否锁页内存（用于加速 GPU 传输） |

## 常见示例

### 1. 指定设备

```python
idx = torch.randperm(10, device='cuda')
print(idx)
```

### 2. 固定随机种子

```python
g = torch.Generator().manual_seed(42)
print(torch.randperm(5, generator=g))
# 每次运行结果相同
```

### 3. 打乱数据集

```python
dataset_size = 100
indices = torch.randperm(dataset_size)

for i in indices:
    x, y = dataset[i]   # 按随机顺序取数据
    # 训练...
```

### 4. 打乱张量行

```python
x = torch.randn(10, 3)          # 10 个样本，每个 3 维
shuffled = x[torch.randperm(x.size(0))]
print(shuffled.shape)            # torch.Size([10, 3])
```

## 注意事项

- `torch.randperm(n)` 返回的是**整数张量**，不是浮点数。
- 如果要生成随机浮点数，应该用 `torch.rand` 或 `torch.randn`。
- 排列是均匀随机的，每个排列出现概率相同。
- `torch.randperm` 没有 `torch.nn` 版本，它是顶层 API。
- `n` 必须是非负整数，且不能超过平台支持的范围。

## 与相关函数对比

| 函数 | 作用 |
|---|---|
| `torch.randperm(n)` | 返回 `0..n-1` 的随机排列 |
| `torch.rand(n)` | 返回 `[0, 1)` 均匀分布的浮点数 |
| `torch.randn(n)` | 返回标准正态分布的浮点数 |
| `torch.randint(low, high, size)` | 返回指定范围内的随机整数，可重复 |

简单说：** `torch.randperm(n)` = 把 `0` 到 `n-1` 随机洗牌。** `torch.randperm` 是 PyTorch 中用来生成**随机排列**的函数，常用于打乱索引、数据集洗牌等场景。

## 基本用法

```python
torch.randperm(n, *, generator=None, out=None, dtype=torch.int64,
                layout=torch.strided, device=None, requires_grad=False,
                pin_memory=False)
```

返回一个长度为 `n` 的一维张量，内容是 `0` 到 `n-1` 的一个随机排列。

```python
import torch

print(torch.randperm(5))
# 可能输出: tensor([3, 0, 4, 1, 2])
```

等价于 Python 的：

```python
import random
lst = list(range(5))
random.shuffle(lst)
```

也类似于 `numpy.random.permutation(n)`。

## 参数说明

| 参数 | 说明 |
|---|---|
| `n` | 整数，排列范围是 `[0, n-1]` |
| `generator` | 随机数生成器，用于固定随机结果 |
| `out` | 输出张量 |
| `dtype` | 返回张量类型，默认 `torch.int64` |
| `device` | 指定设备，如 `'cuda'` |
| `requires_grad` | 是否记录梯度（一般用不到） |
| `pin_memory` | 是否锁页内存（用于加速 GPU 传输） |

## 常见示例

### 1. 指定设备

```python
idx = torch.randperm(10, device='cuda')
print(idx)
```

### 2. 固定随机种子

```python
g = torch.Generator().manual_seed(42)
print(torch.randperm(5, generator=g))
# 每次运行结果相同
```

### 3. 打乱数据集

```python
dataset_size = 100
indices = torch.randperm(dataset_size)

for i in indices:
    x, y = dataset[i]   # 按随机顺序取数据
    # 训练...
```

### 4. 打乱张量行

```python
x = torch.randn(10, 3)          # 10 个样本，每个 3 维
shuffled = x[torch.randperm(x.size(0))]
print(shuffled.shape)            # torch.Size([10, 3])
```

## 注意事项

- `torch.randperm(n)` 返回的是**整数张量**，不是浮点数。
- 如果要生成随机浮点数，应该用 `torch.rand` 或 `torch.randn`。
- 排列是均匀随机的，每个排列出现概率相同。
- `torch.randperm` 没有 `torch.nn` 版本，它是顶层 API。
- `n` 必须是非负整数，且不能超过平台支持的范围。

# TensorDataset / DataLoader
PyTorch 的数据工具模块中导入两个常用类：

```python
from torch.utils.data import TensorDataset, DataLoader
```

- `TensorDataset`：把多个 **张量** 按第一个维度打包成一个数据集。
- `DataLoader`：把数据集包装成 **可迭代的批次加载器**，支持打乱、分批、多进程加载等。

  ---

## 1. TensorDataset 是什么

`TensorDataset` 适合数据已经是 `torch.Tensor` 的情况。

要求所有张量的**第一个维度大小相同**，也就是样本数一致。

```python
import torch
from torch.utils.data import TensorDataset

X = torch.randn(100, 3)              # 100 个样本，每个 3 个特征
y = torch.randint(0, 2, (100,))      # 100 个标签

dataset = TensorDataset(X, y)

print(len(dataset))        # 100
x0, y0 = dataset[0]        # 取出第 0 个样本
print(x0.shape, y0.shape)  # torch.Size([3]) torch.Size([])
```

等价于：

```python
dataset = list(zip(X, y))
```

但 `TensorDataset` 更高效，也支持 PyTorch 的索引协议。

---

## 2. DataLoader 是什么

`DataLoader` 负责从 `Dataset` 中按批次取数据。

```python
from torch.utils.data import DataLoader

loader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True,
    num_workers=0
)

for batch_X, batch_y in loader:
    print(batch_X.shape, batch_y.shape)
    break
```

输出可能是：

```text
torch.Size([16, 3]) torch.Size([16])
```

说明一次取出了 16 个样本。

---

## 3. 完整示例

```python
import torch
from torch.utils.data import TensorDataset, DataLoader

# 1. 构造数据
X = torch.randn(100, 3)
y = torch.randint(0, 2, (100,))

# 2. 标准化，按特征维度做
mean = X.mean(dim=0, keepdim=True)
std = X.std(dim=0, unbiased=False, keepdim=True)
X_norm = (X - mean) / (std + 1e-8)

# 3. 包装成数据集
dataset = TensorDataset(X_norm, y)

# 4. 构造 DataLoader
loader = DataLoader(
    dataset,
    batch_size=16,
    shuffle=True,
    num_workers=0,
    drop_last=False
)

# 5. 迭代
for epoch in range(2):
    print(f"Epoch {epoch}")
    for batch_X, batch_y in loader:
        print(batch_X.shape, batch_y.shape)
```

---

## 4. 常用参数

| 参数 | 作用 |
|---|---|
| `batch_size` | 每批样本数 |
| `shuffle` | 每个 epoch 是否打乱顺序 |
| `num_workers` | 用几个子进程加载数据 |
| `drop_last` | 最后不足一批是否丢弃 |
| `pin_memory` | 是否锁页内存，加速 GPU 传输 |
| `collate_fn` | 自定义如何拼成一个 batch |
| `sampler` | 自定义采样策略 |
| `generator` | 控制随机种子 |

其中 `shuffle=True` 内部效果类似：

```python
indices = torch.randperm(len(dataset))
```

每个 epoch 重新打乱一次。

---

## 5. 和标准化的关系

如果你先做标准化，再放进 `TensorDataset`，要注意统计量来源：

```python
# 正确做法：训练集统计量应用到验证集
train_mean = X_train.mean(dim=0, keepdim=True)
train_std = X_train.std(dim=0, unbiased=False, keepdim=True)

X_train_norm = (X_train - train_mean) / (train_std + 1e-8)
X_val_norm = (X_val - train_mean) / (train_std + 1e-8)

train_dataset = TensorDataset(X_train_norm, y_train)
val_dataset = TensorDataset(X_val_norm, y_val)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
```

验证集不要用 `shuffle=True`，通常保持顺序即可。

---

## 6. 注意事项

- `TensorDataset` 只接受张量，不能直接放 `list`、`numpy.ndarray` 或 `PIL.Image`。
- 所有张量第一维必须相同。
- `DataLoader` 返回的 batch 仍然是张量，可以直接送入模型。
- 如果数据不是张量，应该自定义 `Dataset` 类，实现 `__len__` 和 `__getitem__`。
- 如果报 `ModuleNotFoundError: No module named 'torch'`，说明当前环境没装 PyTorch。

  一句话总结：

```python
dataset = TensorDataset(X, y)          # 打包数据
loader = DataLoader(dataset, batch_size=32, shuffle=True)  # 分批、打乱
for batch_X, batch_y in loader:        # 迭代训练
    ...
```

  如果你是在写训练循环，这行导入通常是配合 `TensorDataset` 和 `DataLoader` 来构建数据管道。
