---
title: "Python 杂记 VII"
slug: "machine-and-deep-learning/python/python-杂记-vii"
description: "我实测对比了一下：同 seed 下前向输出 max diff 0.0 ，参数量都是 131。逻辑上完全等价——都是 4→16→3，隐层 ReLU，输出层线性出 logits。"
publishDate: "2026-09-10"
createdAt: "2026-09-10T00:00:00Z"
updatedDate: "2026-09-15T19:42:56"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# `nn.Sequential` & 更朴实的前向
## 结论：这两个是同一个模型，只是"组织方式"不同

我实测对比了一下：同 seed 下前向输出 `max|diff| = 0.0`，参数量都是 131。逻辑上完全等价——都是 4→16→3，隐层 ReLU，输出层线性出 logits。

```python
# PDF 4.5.3（第 129 页）
class IrisMLP(nn.Module):
    def __init__(self, in_dim=4, hidden=16, n_class=3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden),
            nn.ReLU(),
            nn.Linear(hidden, n_class),
        )
    def forward(self, inputs):
        return self.net(inputs)
```

```python
# notebook
class IrisMLP(nn.Module):
    def __init__(self, in_dim=4, hidden=16, n_class=3):
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden)
        self.fc2 = nn.Linear(hidden, n_class)
    def forward(self, x):
        h = F.relu(self.fc1(x))
        return self.fc2(h)
```

注意 `nn.Sequential` 版本**仍然是 `nn.Module` 子类**，不是另起炉灶；两版都重写了 `forward`。区别只在"层怎么登记"和"前向怎么串"。

## 具体差异

**1. 子模块的名字 → 可寻址性**

`Sequential` 里的层只有序号名，没有语义名：

```
PDF 版:      IrisMLP((net): Sequential((0): Linear(4,16) (1): ReLU() (2): Linear(16,3)))
notebook 版: IrisMLP((fc1): Linear(4,16)  (fc2): Linear(16,3))
```

于是取权重得写 `model.net[0].weight`，隐藏层/输出层没法按语义定位。notebook 版 `model.fc1.weight` 更明确，做逐层初始化（Kaiming/ `nn.init.normal_`）、看某层梯度、冻结某一层、只微调最后一层（`model.fc2 = nn.Linear(hidden, k)`）都顺手。** `model.net[0]` 这种索引是脆的**——中间插一层 BatchNorm，后面所有索引都得改。

**2. `state_dict` 的 key 不同 → checkpoint 不互通**（这是最实际的坑）

```
Sequential 版: ['net.0.weight', 'net.0.bias', 'net.2.weight', 'net.2.bias']
notebook  版: ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']
```

notebook 第 5 节 `runner.load('./models/iris_best.pt')` 存的是 notebook 版的 key，直接喂给 PDF 版的模型会报 missing/unexpected keys。要复用得重映射：

```python
sd = torch.load('models/iris_best.pt', weights_only=True)
remap = {k.replace('fc1.', 'net.0.').replace('fc2.', 'net.2.'): v for k, v in sd.items()}
pdf_model.load_state_dict(remap)
```

**3. 表达能力：`Sequential` 只能表达"一条直线串下去"**

一旦前向需要分支——残差相加、多输入 concat、跳连、返回中间激活、按条件走不同路径、层间权重共享——就写不了，必须展开 `forward`。书的第 5 章正好是例子：ResNet 18 里 `m1..m5` 都用 `nn.Sequential` 攒（PDF 第 161–162 页），但 `ResBlock` 的前向 `F.relu(x + identity)` 照样得手写。

反过来，层多的时候 `Sequential` 明显更短：写 8 层 MLP 不用手敲 8 行前向。

**4. 函数式 API 放不进 `Sequential` **

`F.relu` 是函数不是 Module，塞不进 `nn.Sequential`。这也是为什么 PDF 版必须写成 `nn.ReLU()` ——而 `nn.ReLU` 内部 forward 就是调 `F.relu`，所以两者数值完全一样。notebook 版里两种混用（`nn.Linear` + `F.relu`）在自定义 `forward` 里是完全正常的写法。

## 书里其实两种写法都在用

- **第 1.5 节 TinyMLP**（PDF 第 40 页）、**第 4.5.3 节 IrisMLP**（第 129 页）→ `nn.Sequential`
- **第 4.3.1 节 `Model_MLP_L2_V2` **（PDF 第 115–116 页）→ 就是 notebook 那种写法：`self.fc1 / self.fc2` + `self.act_fn`

  而且 4.3.1 那版的前向是 `z1=fc1(x) → a1=act(z1) → z2=fc2(a1) → a2=act(z2)`，**输出层确实接了激活**。第 129 页那句提醒正是在说这里改了：

> 与第 4.3.1 节的两层版本相比，这里输出层不再接激活函数，而是直接输出未归一化分数（Logits）．分类决策只需要比较类别得分的相对大小（或后续 argmax），并不需要显式概率；同时 `nn.CrossEntropyLoss` 内部已经做了 log_softmax……

（4.3.1 是二分类用 sigmoid、配 `BCELoss` 的语境，输出接 sigmoid 是合理的；换成多分类 + CrossEntropyLoss 就必须去掉。）所以上一轮的结论在 PDF 里有原文背书。

## 实用取舍

- 演示 / 教学 / 纯前馈 → `Sequential`，代码最短、`print(model)` 结构最清爽。
- 要做逐层权重操作、冻结、取中间特征、加残差或分支 → 显式属性 + 手写 `forward`。
- 两者可以混：`self.net = nn.Sequential(...)` 打包主体，再单独留 `self.head = nn.Linear(...)` 方便换分类头。

# `.flat` & `.flatten()`
`.flat` 和 `.flatten()` 经常让人混淆，核心区别是：

- ** `.flat` 是属性**，返回一个**迭代器**，不复制数据，用来遍历。
- ** `.flatten()` 是方法**，返回一个**新的一维数组/张量**，通常会复制数据。

  ---

## 1. NumPy 中的区别

```python
import numpy as np

a = np.array([[1, 2],
              [3, 4]])

print(a.flat)        # <numpy.flatiter object at ...>
print(a.flatten())   # [1 2 3 4]
```

| 特性 | `a.flat` | `a.flatten()` |
|---|---|---|
| 类型 | `numpy.flatiter` 迭代器 | `numpy.ndarray` 一维数组 |
| 是否复制 | 否，是原数组的视图 | 是，返回副本 |
| 能否索引 | 可以，如 `a.flat[0]` | 可以，如 `b[0]` |
| 能否赋值修改原数组 | 可以，`a.flat[0] = 99` 会改 `a` | 不可以，改的是副本 |
| 能否重复迭代 | 访问一次得到新迭代器，但迭代完就耗尽 | 返回的数组可重复迭代 |
| 形状 | 没有 `.shape` 属性 | 有 `.shape`，如 `(4,)` |
| 典型用途 | 遍历所有元素 | 需要一维数组副本 |

示例：

```python
a = np.array([[1, 2], [3, 4]])

# .flat 是迭代器
for x in a.flat:
    print(x)   # 1 2 3 4

# .flatten() 返回新数组
b = a.flatten()
print(b)       # [1 2 3 4]

# .flat 可以修改原数组
a.flat[0] = 99
print(a)       # [[99  2]
               #  [ 3  4]]

# .flatten() 修改的是副本
b[0] = 100
print(a)       # 原数组不变
```

补充：`.ravel()` 也是展平，但它**尽量返回视图**，不保证复制；`.flatten()` **总是复制**。

```python
c = a.ravel()   # 可能是视图，也可能是副本
d = a.flatten() # 一定是副本
```

---

## 2. 在你的 matplotlib 代码中

```python
fig, axes = plt.subplots(2, 10)
```

`axes` 是形状为 `(2, 10)` 的 NumPy 数组。

- `axes.flat`：返回一个迭代器，依次产出 20 个 `Axes`。
- `axes.flatten()`：返回一个形状为 `(20,)` 的一维数组，里面是 20 个 `Axes`。

  两种写法都能遍历：

```python
for ax in axes.flat:
    ...

for ax in axes.flatten():
    ...
```

  区别：

- `axes.flat` 更轻量，不复制数组；
- `axes.flatten()` 会新建一个一维数组，但元素还是原来那些 `Axes` 对象的引用，所以修改 `Axes` 本身仍然会影响原图；
- 如果你只是想遍历，推荐 `axes.flat`；
- 如果你需要一个可反复使用的一维数组，比如后面还要按索引取，用 `axes.flatten()` 或 `axes.ravel()`。

  注意 `.flat` 迭代器用完就耗尽：

```python
f = axes.flat
for ax in f:
    ...
for ax in f:   # 第二次不会执行，因为迭代器已耗尽
    ...
```

  所以一般直接写 `for ax in axes.flat:`，每次访问都会得到新的迭代器。

  ---

## 3. PyTorch 中的情况

PyTorch 的 `Tensor` 没有 NumPy 那种 `.flat` 迭代器属性。常用的是：

```python
import torch

x = torch.tensor([[1, 2], [3, 4]])

y = x.flatten()        # tensor([1, 2, 3, 4])
z = x.view(-1)         # 要求内存连续
w = x.reshape(-1)      # 更灵活，必要时复制
```

`torch.flatten()` 还可以只展平部分维度：

```python
x = torch.randn(2, 3, 4, 5)
y = x.flatten(1, 2)    # 展平第 1 到第 2 维，形状 (2, 12, 5)
```

对应 NumPy：

```python
a = np.random.randn(2, 3, 4, 5)
b = a.reshape(2, 12, 5)   # NumPy 没有 flatten(start_dim, end_dim)
```

---

## 4. 一句话选择建议

- **遍历所有元素/子图**：用 `.flat`。
- **需要一维数组且不介意复制**：用 `.flatten()`。
- **想要尽量不复制地展平 NumPy 数组**：用 `.ravel()`。
- **PyTorch 展平**：用 `.flatten()`、`.view(-1)` 或 `.reshape(-1)`。


  你的直觉很敏锐，但在 Python 的实际运行机制中，这里使用 `try...finally` **不仅仅是为了可读性，更主要的作用是提供“异常安全性”（Exception Safety）**。



  如果不使用 `try...finally`，一旦代码发生崩溃，就会导致**模型状态发生不可逆的“污染”**。


# `try...finally`
### 1. 没有 `try...finally` 会发生什么？

我们对比一下写法：
```python
# ❌ 不用 try...finally 的写法
def evaluate(self, loader):
    was_training = self.model.training
    self.model.eval()

    # 假设这里的代码在运行到第 5 个 batch 时报错了（比如 DataLoader 里的数据损坏、内存溢出 CUDA OOM 等）
    for batch in loader:
        out = self.model(*inputs)  # <--- 突然抛出异常崩溃！

    self.model.train(was_training)  # ❌ 这行代码永远不会被执行到！
```

**连锁反应：**

由于程序抛出了异常，代码提前打断，`self.model.train(was_training)` 没有被执行。

此时，`self.model.training` 永远留在了 `False` 状态。

如果外层调用者用 `try...except` 捕获了这个异常并尝试继续（或者在 Jupyter Notebook 中修补数据后直接接着跑下一个 unit），你的模型其实已经静默地变成了 `eval` 模式。后续的训练就会在**没有 Dropout、没有更新 BatchNorm 累积统计量**的状态下继续跑，导致模型训练效果变差甚至指标异常，而且这种 Bug **非常隐蔽，极难排查**。
### 2. 用了 `try...finally` 会怎样？

```Python
# ✅ 使用 try...finally
def evaluate(self, loader):
    was_training = self.model.training
    self.model.eval()
    try:
        # 即使这里中途抛出任何 Error 导致程序中断
        for batch in loader:
            ...
    finally:
        # 💥 Python 保证：无论 try 块里是正常 return 还是中途报错崩溃，
        # finally 里面的代码都“一定会”被强制执行！
        self.model.train(was_training)
```

有了 `finally` 块：

- **正常返回时**：计算完毕，恢复模型原始状态。

- **抛出异常时**：在异常向上传播前，Python **先强制恢复模型原始状态**，再把报错抛给你。

### 总结

`try...finally` 在这里扮演的是一个“状态现场保护者”的角色（类似于资源管理里的 `with` 语句）。

- **可读性**：确实让人一眼看出“不管发生什么，最后都要恢复状态”。
- **核心价值**：**防止异常中断导致 `model.training` 状态泄露**，确保代码在任何意外崩溃后，模型状态依然是安全且一致的。
