---
title: "Python 杂记 II"
slug: "machine-and-deep-learning/python/python-杂记-ii"
description: "assert 是 Python 的 断言语句 ，用于在代码里声明\"这里某个条件必须成立\"，如果条件不成立就立刻抛异常终止程序。"
publishDate: "2026-08-27"
createdAt: "2026-08-27T00:00:00Z"
updatedDate: "2026-08-30T09:28:08"
tags: ["python","machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# `Assert` 
`
assert` 是 Python 的**断言语句**，用于在代码里声明"这里某个条件必须成立"，如果条件不成立就立刻抛异常终止程序。

**语法：**

```python
assert 条件, "条件不成立时的错误提示信息"
```

等价于：

```python
if not 条件:
    raise AssertionError("条件不成立时的错误提示信息")
```

**在你这本书的代码里最常见的用法**——检查张量/数组的**形状（shape）是否正确**，例如《神经网络与深度学习》各章 notebook 里经常出现：

```python
assert X.shape[0] ** y.shape[0], "样本数不一致"
assert outputs.shape ** (batch_size, num_classes)
```

**作用：**

1. **调试/防御**：在关键位置确认数据形状、数值范围符合预期，提前发现问题，而不是等后面算错。
2. **文档化**：读代码的人看到 `assert` 就知道这里隐含的约束。
3. 条件为真时**什么都不做**（零开销逻辑，只是判断一下），不产生返回值。

   **注意事项：**

- 断言失败抛的是 `AssertionError`，程序直接崩溃——这是设计意图，不是 bug，说明你的输入不满足约定。
- 不要在 `assert` 里写"必要业务逻辑"（比如 `assert data = load()` 这种），因为 Python 用 `python -O` 运行时**会跳过所有 assert**，生产代码里的校验不该依赖它。
- 普通用户输入校验建议用 `if ... raise ValueError(...)`，`assert` 更适合"程序员之间约定"的内部检查。

   **小例子：**

```python
import numpy as np
X = np.zeros((100, 8))   # 100 个样本，8 维特征
w = np.zeros((8, 3))     # 权重
assert X.shape[1] == w.shape[0], "矩阵维度不匹配，无法相乘"
y = X @ w                # 安全执行
print(y.shape)           # (100, 3)
```

   一句话：** `assert` 就是"我断言这里一定成立，不成立就当场报错"**，在深度学习代码里主要用来卡 shape、卡数值范围，防止静默出错。

   `.uniform_()` 是 PyTorch 中一个**原地操作（in-place）**的张量方法（注意方法名末尾的下划线），用于将调用它的张量中的元素填充为指定区间上的均匀分布随机数。

   它与 `torch.rand` 最大的区别在于：** `.uniform_()` 不创建新张量，而是直接修改已有的张量**，内存效率更高。

# `tensor.uniform_()`
### 1. 函数签名
```python
tensor.uniform_(from=0, to=1)
```

- ** `from` **：区间下界，默认为 `0`。
- ** `to` **：区间上界，默认为 `1`。
- **返回值**：返回填充后的原张量（原地修改，无新内存分配）。

  ---

### 2. 基础用法示例
```python
import torch

# 1. 先创建容器，再填充 [2, 5) 区间
x = torch.empty(3, 4)   # 预先分配内存（未初始化）
x.uniform_(2, 5)        # 原地填充，范围 2 到 5
print(x)

# 2. 直接修改已有张量（覆盖原有值）
y = torch.ones(5)       # [1, 1, 1, 1, 1]
y.uniform_(-1, 1)       # 全部变成 [-1, 1) 之间的随机数
print(y)

# 3. 默认区间 [0, 1)
z = torch.zeros(2, 2)
z.uniform_()            # 等价于 z.uniform_(0, 1)
print(z)
```

---

### 3. 与 `torch.rand` 的核心对比
| 特性 | `torch.rand(size)` | `tensor.uniform_(a, b)` |
| :--- | :--- | :--- |
| **内存分配** | 每次调用都**新建**一个张量 | **复用**已有张量，不分配新内存 |
| **调用方式** | 函数式，传入形状 | 方法式，调用已有的张量实例 |
| **典型场景** | 快速生成临时张量 | 网络权重初始化、循环中反复填充缓冲区 |
| **性能** | 常规 | 更优（避免了内存分配开销） |

**性能对比示例**：
```python
import time

# 方式1: 每次新建（较慢）
start = time.time()
for _ in range(1000):
    a = torch.rand(1000, 1000)  # 每次都申请新内存
print(time.time() - start)

# 方式2: 原地复用（更快）
buf = torch.empty(1000, 1000)
start = time.time()
for _ in range(1000):
    buf.uniform_(0, 1)          # 复用同一块内存
print(time.time() - start)
```

---

### 4. 重要细节与注意事项
- **边界定义**：生成的随机数属于 **半开区间 `[from, to)` **（由于浮点数精度，极少情况会刚好等于 `to`，但理论保证小于 `to`）。
- **数据类型与设备**：张量原有的 `dtype` 和 `device`（CPU/GPU）会保留，无需重复指定。
- **浮点数类型限制**：如果张量是整数类型（如 `torch.int32`），调用 `.uniform_()` 会**报错**。必须确保张量是浮点类型（`float32` / `float64`）。
  ```python
  # 错误示例
  int_tensor = torch.randint(0, 10, (2,2))
  # int_tensor.uniform_(0, 1)  
  # 报错: RuntimeError: "uniform_" not implemented for 'Long'
  
  # 正确做法：转为浮点再填充
  float_tensor = int_tensor.float()
  float_tensor.uniform_(0, 1)
  ```

  ---

### 5. 常见应用场景
- **神经网络权重初始化**（替代 `nn.init.uniform_`）：
  ```python
  import torch.nn as nn
  linear = nn.Linear(128, 256)
  nn.init.uniform_(linear.weight, -0.1, 0.1)  
  # 底层其实就是调用了 weight.uniform_()
  ```
- **循环中动态重置数据**：在训练循环中，频繁生成噪声或随机掩码时，使用预分配缓冲区 + `.uniform_()` 可以有效减少显存/内存波动。

  ---

### 一句话总结
** `tensor.uniform_(a, b)` = 将已有的 `tensor` 原地面修改为 `[a, b)` 上的均匀随机数，比 `torch.rand` 更节省内存。**

如果你是想问它与 `torch.rand` 的取舍，简单来说：**一次性生成用 `rand`，多次重复填充用 `uniform_` **。😊
