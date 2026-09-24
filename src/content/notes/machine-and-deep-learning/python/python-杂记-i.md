---
title: "Python 杂记 I"
slug: "machine-and-deep-learning/python/python-杂记-i"
description: "import numpy as np"
publishDate: "2026-08-17"
createdAt: "2026-08-17T00:00:00Z"
updatedDate: "2026-08-30T11:17:23"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# 一种比较有趣的数组创建方式

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

# `*args,**kwargs` 是什莫？

`*args` 和 `**kwargs` 是 Python 中接收「不确定数量参数」的两种写法，核心作用就是让你的函数（或这里的方法）足够灵活，不管调用者传几个参数都能接住。

### `*args`：接收任意数量的位置参数

`*args` 会把所有「按位置传入」的多余参数打包成一个 **元组（tuple）**，名字 `args` 可以随便改，关键是前面的星号 `*`。

```python
def demo(*args):
    print(args)          # 一个元组
    print(type(args))    # <class 'tuple'>

demo(1, 2, 3)            # 输出 (1, 2, 3)
demo("a", "b")           # 输出 ('a', 'b')
```

注意：`*args` 只能接收位置参数。像 `demo(x=1)` 这种带名字的传参它接不住。

### `**kwargs`：接收任意数量的关键字参数

`**kwargs` 会把所有「按关键字传入」的多余参数打包成一个 **字典（dict）**，名字 `kwargs` 可以随便改，关键是前面的两个星号 `**`。

```python
def demo2(**kwargs):
    print(kwargs)        # 一个字典
    print(type(kwargs))  # <class 'dict'>

demo2(x=1, y=2)                 # 输出 {'x': 1, 'y': 2}
demo2(name="Tom", age=18)       # 输出 {'name': 'Tom', 'age': 18}
```

### 对照你的代码

回到你贴的这个类：

```python
class Op:
    def __call__(self, *args, **kwargs):
        return self.forward(*args, **kwargs)   # op(x) 等价于 op.forward(x)

    def forward(self, *args, **kwargs):
        raise NotImplementedError

    def backward(self, *args, **kwargs):
        raise NotImplementedError
```

这里用 `*args, **kwargs` 的好处很明显：

1. ** `Op` 类的调用方式完全灵活**。`op(x)`、`op(x, y)`、`op(x, y, w=0.5)` 都能被 `__call__` 接住，不管子类 `forward` 需要什么参数。
2. **参数原样转发**。`self.forward(*args, **kwargs)` 中的星号是「解包（unpacking）」——把元组 `args` 拆开按位置传、把字典 `kwargs` 拆开按关键字传。这样 `__call__` 收到的参数就一个不差地传给了 `forward`。
3. **子类可以有不同的签名**。因为父类用 `*args, **kwargs` 兜底，子类的 `forward(self, x)`、`forward(self, x, y, bias=True)` 都不会报「参数数量不匹配」的错误。

### 两个小要点

- `*args` 和 `**kwargs` 这两个名字是**约定俗成**，写成 `*params`、`**options` **也完全可以，关键是星号。**
- 如果函数里两者都有，位置参数在前、关键字参数在后，顺序必须是 `def f(a, b, *args, **kwargs)` 这样。

  一句话总结：`*args` 收位置参数打包成元组，`**kwargs` 收关键字参数打包成字典，配合解包 `*` / `**` 实现参数透明转发，这也是深度学习框架（如 PyTorch）中 `nn.Module` 风格的类常用的写法。

# 魔法方法 `__xx__`
### ** `__init__` 管「对象的出生」，`__call__` 管「对象的调用」，两者触发时机完全不同**

- `__init__`：在**创建实例时**自动执行一次，负责初始化（存属性、设初值）
- `__call__`：在**把实例当函数调用时**每次执行，负责让对象「可被调用」

```python
class Op:
    def __init__(self, name):        # ① 创建时触发
        self.name = name
        print("初始化：创建对象")

    def __call__(self, x):           # ② 调用时触发
        print("调用：执行运算")
        return x * 2

op = Op("缩放")   # 输出：初始化：创建对象（触发 __init__）
op(10)            # 输出：调用：执行运算（触发 __call__）
```

  关键区别在于：`__init__` 只在 `Op("缩放")` 这一瞬间跑一次；而 `op(10)`、`op(20)` ……调用多少次，`__call__` 就执行多少次。

### 在你之前的 `Op` 类中它们可以如何配合

`__call__` 转发给 `forward`，而 `__init__` 正好用来存储 forward 需要的参数：

```python
class Op:
    def __init__(self, bias=0.0):    # 初始化时保存参数
        self.bias = bias

    def forward(self, x):
        return x + self.bias

    def __call__(self, x):
        return self.forward(x)

op = Op(bias=5)      # __init__ 存下 bias=5
op(3)                # __call__ 转发给 forward → 8
```

这样 `Op` 既像一个「配置好的函数」（`__init__` 收配置），又能像函数一样被直接调用（`__call__`）。

### 还有什么常用的特殊方法？

这些 `__xx__` 方法统称 **魔法方法（dunder methods）**，Python 会按语法自动触发它们，按用途分类如下：

| 类别 | 方法 | 触发时机 |
|---|---|---|
| 创建与销毁 | `__new__`、`__init__`、`__del__` | 新建实例 / 实例被回收 |
| 字符串表示 | `__str__`、`__repr__` | `print()` / `repr()` / 控制台显示 |
| 容器行为 | `__len__`、`__getitem__`、`__setitem__`、`__contains__` | `len(obj)` / `obj[i]` / `obj[i]=v` / `x in obj` |
| 迭代 | `__iter__`、`__next__` | `for x in obj` |
| 运算符重载 | `__add__`、`__sub__`、`__mul__`、`__eq__`、`__lt__`、`__hash__` | `a + b` / `a == b` / `a < b` / `hash(a)` |
| 属性访问 | `__getattr__`、`__setattr__`、`__getattribute__` | 访问/设置属性时 |
| 上下文管理 | `__enter__`、`__exit__` | `with` 语句 |
| 布尔与调用 | `__bool__`、`__call__` | `bool(obj)` / `obj()` |

举两个最常见的例子感受一下：

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):                     # 自定义打印效果
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):               # 让 + 可用
        return Point(self.x + other.x, self.y + other.y)

    def __len__(self):                      # 让 len() 可用
        return 2

p = Point(1, 2) + Point(3, 4)   # 自定义的 __add__
print(p)                        # Point(4, 6)  ← __repr__
print(len(p))                   # 2           ← __len__
```

补充一点：`__str__` 和 `__repr__` 容易混淆—— `__str__` 面向普通用户（`print` 显示用的友好文本），`__repr__` 面向开发者（调试时的详细信息）；如果只实现了其中一个，另一个会默认复用。另外 `__eq__` 和 `__hash__` 是成对的：重写了 `__eq__` 后 `__hash__` 通常也要一起重写，否则对象放进集合或作为字典键时行为会异常。

一句话总结：`__init__` 是生命周期起点，`__call__` 让对象函数化，而整套魔法方法就是 Python 让自定义类「长得像内置类型」的接口。


