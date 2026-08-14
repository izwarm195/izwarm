---
title: "Numpy 对话总结 I"
slug: "machine-and-deep-learning/python/numpy-对话总结-i"
description: "常用创建方式："
publishDate: "2026-07-29"
createdAt: "2026-07-29T00:00:00Z"
updatedDate: "2026-08-05T15:40:42+08:00"
tags: ["machine-learning","python"]
series: ["Machine & Deep Learning","Python"]
---

## 1. 数组创建与形状

- 常用创建方式：
  - `np.array()`：由列表、元组创建数组。
  - `np.arange(start, stop, step)`：按步长生成半开区间 `[start, stop)`。
  - `np.linspace(start, stop, num)`：在指定区间均匀取 `num` 个值，默认包含终点。
  - `np.zeros()`、`np.ones()`、`np.eye()`：创建全 0、全 1、单位矩阵等数组。
  - `np.fromfunction()`：根据索引坐标和函数规则生成数组。
  - `np.fromiter()`：从可迭代对象直接构建一维数组；Python 3 的 `range` 本身就是可迭代对象。

- `shape` 表示每一维的长度：
  - `(4,)`：一维，4 个元素。
  - `(2, 3)`：2 行 3 列。
  - `(4, 3, 2)`：4 个块，每块 3 行，每行 2 个元素。

- `reshape()` 只改变查看方式，元素总数必须不变：
  ```python
  np.arange(10).reshape(5, 2)
  ```

- `reshape(order="F")` 按列优先顺序读取和填充元素；默认 `order="C"` 为行优先。

- `resize()` 会直接修改原数组形状；`reshape()` 通常返回一个新视图或新数组，原变量本身不变。

  ---

## 2. 维度、轴与广播

- `axis` 是数组维度编号：
  - 二维数组中，`axis=0` 沿行方向聚合，得到每一列的结果。
  - 二维数组中，`axis=1` 沿列方向聚合，得到每一行的结果。
  - 聚合操作会“压缩”对应轴。

```python
a.sum(axis=0)  # 每列求和
a.sum(axis=1)  # 每行求和
```

- `keepdims=True` 可以保留被聚合的维度，便于后续广播：

```python
a.mean(axis=1, keepdims=True)
# 原 shape: (m, n)
# 结果 shape: (m, 1)
```

- `np.mean(a, axis=1, keepdims=True)` 与 `a.mean(axis=1, keepdims=True)` 结果和性能基本等价：
  - `a.mean()`：简洁，适合明确知道 `a` 是 ndarray 的场景。
  - `np.mean(a)`：更通用，可直接接收列表等输入，正式代码中常见。

- 广播从右往左对齐维度；每个维度必须相等，或其中一边为 1。

```python
A = np.ones((5, 5, 3))
B = 2 * np.ones((5, 5))

A * B            # 报错：末尾维度 3 和 5 不匹配
A * B[:, :, None]  # 正确：B 变成 (5, 5, 1)，最后一维可广播到 3
```

- `None` 或 `np.newaxis` 用于插入长度为 1 的轴：

```python
B[:, :, None].shape  # (5, 5, 1)
```

  ---

## 3. 数组索引、切片与赋值

- NumPy 二维索引格式是：

```python
a[行索引, 列索引]
```

```python
a[1, 2]      # 第 2 行、第 3 列
a[1]         # 第 2 行全部列，等价于 a[1, :]
a[:, 2]      # 所有行的第 3 列
a[:, -1]     # 最后一列
```

- Python 原生嵌套列表必须写成：

```python
lst[1][2]
```

  而 ndarray 可以写：

```python
a[1, 2]
```

- 切片格式为 `[start:stop:step]`，终止位置不包含：

```python
a[0:3, 2:4]  # 前 3 行，第 3、4 列
a[:, ::2]    # 所有行，每隔一列取一个
a[::-1, :]   # 行倒序
```

- 标量索引会降低维度，切片通常保留维度：

```python
a[:, 2].shape    # (行数,)
a[:, 2:3].shape  # (行数, 1)
```

- 花式索引中，两个整数索引数组按位置一一配对，而不是生成所有组合：

```python
a[[1, 2], [3, 4]]
# 等价于 [a[1, 3], a[2, 4]]
```

- **若要选择行列的全部组合，使用 `np.ix_` ：**

```python
a[np.ix_([0, 2], [1, 3, 4])]
```

- 可直接使用二维坐标数组进行随机赋值：

```python
rows = np.random.randint(0, 5, 3)
cols = np.random.randint(0, 5, 3)
a[rows, cols] = 1
```

- 要保证随机位置不重复，可以先从展平索引无放回抽样，再转成二维坐标：

```python
flat_idx = np.random.choice(25, 3, replace=False)
rows, cols = np.unravel_index(flat_idx, (5, 5))
a[rows, cols] = 1
```

  ---

## 4. 布尔索引与逻辑运算

- NumPy 数组条件组合必须使用：
  - `&`：逐元素且。
  - `|`：逐元素或。
  - `~`：逐元素非。

```python
a[(a > 2) & (a < 7)]
a[(a < 2) | (a > 7)]
a[~(a > 5)]
```

- 必须给每个比较表达式加括号：

```python
(a > 2) & (a < 7)  # 正确
a > 2 & a < 7      # 错误或语义不符合预期
```

- 不要用 `and`、`or`、`not` 处理 ndarray 条件，因为它们不能做逐元素布尔运算，常导致“数组真值不明确”错误。

- `~` 的含义取决于 dtype：
  - 布尔数组：逻辑非。
  - 整数数组：逐位取反，满足 `~x == -(x + 1)`。
  - 浮点数组：不支持，会报错。

```python
~np.array([True, False])  # [False, True]
~np.array([0, 1, 2])      # [-1, -2, -3]
```

- `np.logical_not()` 是逻辑非，适用于任意可转为布尔值的数组：

```python
Z = np.random.randint(0, 2, 100)
np.logical_not(Z, out=Z)
```

- ==`out=Z` 表示将结果直接写回原数组，避免额外分配临时数组。对 0/1 数组，逻辑结果会以 `0/1` 写回整型数组。==

  ---

## 5. 随机数与随机抽样

- `np.random.randint(low, high, size)` 生成整数，范围是半开区间 `[low, high)`：

```python
np.random.randint(0, 25, 3)
# 可能为 0~24，绝不会为 25
```

- 对于 5×5 数组，共有 25 个元素，展平索引为 `0~24`：

```python
np.put(a, np.random.randint(0, 25, 3), 1)
```

  含义：从展平后的 25 个位置中随机挑选 3 个，改为 `1`。随机索引可重复，因此实际被修改的位置可能少于 3 个。

- `np.random.choice(a, size, replace=True, p=None)` 用于随机抽样：

```python
np.random.choice(10, 5)
```

  等价于从 `0~9` 中等概率、有放回地抽取 5 次。

- `replace` 控制是否允许重复：
  - `replace=True`：有放回，允许重复。
  - `replace=False`：无放回，不允许重复。

```python
np.random.choice(10, 5, replace=False)
```

- `p` 可以指定抽样概率：

```python
np.random.choice(5, 10, p=[0.1, 0.1, 0.2, 0.3, 0.3])
```

  ---

## 6. 排序与 `argsort`

- `np.sort()` 返回排序后的值。
- `np.argsort()` 返回“排序后元素对应的原索引”。

```python
a = np.random.randint(0, 100, 36).reshape(6, 6)
a[a[:, 0].argsort()]
```

  执行过程：

1. `a[:, 0]` 取第一列。
2. `.argsort()` 返回第一列从小到大对应的原行号。
3. `a[...]` 按这些行号重排行。

  因此，这行代码实现了：**按二维数组第一列升序排序整个数组的行**。

```python
a[a[:, 0].argsort()]
# 等价于
a[a[:, 0].argsort(), :]
```

  ---

## 7. `np.put`、展平索引与二维坐标

- `np.put(a, indices, values)` 按数组展平后的顺序修改元素。
- 二维数组 `(m, n)` 中，展平索引和二维坐标可互相转换：

```python
flat_index = 12
row, col = np.unravel_index(flat_index, (5, 5))
# (2, 2)
```

- 用二维坐标索引通常更直观：

```python
a[rows, cols] = 1
```

- 用展平索引适合统一处理任意维数组，或需要无放回抽样时：

```python
idx = np.random.choice(a.size, 3, replace=False)
a.flat[idx] = 1
```

  ---

## 8. 结构化数组

- 结构化数组允许一个 ndarray 同时保存不同类型、不同字段的数据。

```python
dtype = [
    ('position', [('x', float), ('y', float)]),
    ('color', [('r', float), ('g', float), ('b', float)])
]

Z = np.zeros(10, dtype=dtype)
```

- 按字段访问：

```python
Z['position']['x']
Z['color']['r']
```

- 适用于记录型数据，例如二维位置、RGB 颜色、用户信息或传感器数据。

  ---

## 9. 生成三角网格的唯一边

下面代码从三角形面定义中提取所有不重复的无向边：

```python
faces = np.random.randint(0, 100, (10, 3))

F = np.roll(faces.repeat(2, axis=1), -1, axis=1)
F = F.reshape(len(F) * 3, 2)
F = np.sort(F, axis=1)

G = F.view(dtype=[('p0', F.dtype), ('p1', F.dtype)])
G = np.unique(G)
```

- `faces` 的每一行表示一个三角形，例如：

```python
[10, 30, 50]
```

  其中 `10`、`30`、`50` 是顶点编号，不是坐标值。它表示一个三角形由第 10、30、50 号顶点构成。

- 一个三角形 `[a, b, c]` 有三条边：

```python
(a, b), (b, c), (c, a)
```

- `repeat` + `roll` + `reshape` 将每个三角形展开成三条边。
- `np.sort(F, axis=1)` 让无向边统一表示：

```python
(50, 10) -> (10, 50)
```

- `view` 成结构化数组后，`np.unique()` 可以按整行边坐标去重。
- 最终结果是：所有三角形中不重复的无向边集合。

  ---

## 10. `bincount` 与计数工具

- `np.bincount(x)`：统计非负整数数组中每个整数出现次数。

```python
x = np.array([1, 5, 5, 0, 1, 5, 1])
np.bincount(x)
# [1, 3, 0, 0, 0, 3]
```

- `np.unique(x, return_counts=True)`：适合任意类型或稀疏标签。

```python
np.unique(x, return_counts=True)
# (array([0, 1, 5]), array([1, 3, 3]))
```

- `np.histogram(x, bins)`：适合连续数值按区间分箱统计。

```python
np.histogram(x, bins=[0, 2, 6])
```

- `np.count_nonzero(x == k)`：统计某一个值出现的次数。

- `bincount` 的优势是支持 `weights`，可按标签分组加总：

```python
labels = np.array([0, 1, 0, 1, 0])
values = np.array([10, 20, 30, 40, 50])

np.bincount(labels, weights=values)
# [90., 60.]
```

  这类似 SQL 的 `GROUP BY label` 加 `SUM(value)`。

  ---

## 11. `stride_tricks` 与滑动窗口

- `ndarray.strides` 表示沿每个轴移动一个元素时，需要跨越的字节数。
- `numpy.lib.stride_tricks` 利用 shape 和 strides，以不同方式查看同一段内存，通常不复制数据。

```python
a = np.arange(12).reshape(3, 4)
a.strides
```

- `as_strided()` 可手动定义 shape 和 strides，灵活但危险；若 strides 设置不正确，可能访问数组边界外的内存。

```python
from numpy.lib.stride_tricks import as_strided
```

- 日常推荐使用安全的 `sliding_window_view()`：

```python
from numpy.lib.stride_tricks import sliding_window_view

x = np.arange(10)
sliding_window_view(x, window_shape=3)
# [[0, 1, 2],
#  [1, 2, 3],
#  ...
#  [7, 8, 9]]
```

- 典型用途：
  - 时间序列的滑动窗口特征。
  - 图像卷积前提取局部 patch。
  - 构造连续序列的监督学习样本。

```python
ts = np.arange(100)
X = sliding_window_view(ts[:-1], 10)
y = ts[10:]
```

    ---

## 12. 数学函数与数值行为

- `np.add.reduce(a)` 与 `np.sum(a)` 本质等价，都是沿指定轴做累加。
- `np.nan == np.nan` 的结果是 `False`。
- `0 * np.nan` 的结果仍是 `nan`。
- 标准 `np.sqrt(-1)` 会产生 `nan`；需要复数结果时可使用：

```python
np.emath.sqrt(-1)
# 1j
```

- `Z <- Z` 不是赋值；Python 会把它解析为：

```python
Z < (-Z)
```

  即逐元素比较 `Z` 是否小于其相反数。

  ---

## 13. 数据导入：`loadtxt` 与 `genfromtxt`

- `np.loadtxt()`：
  - 适合格式干净、列数一致、类型一致的文本数据。
  - 通常更快。
  - 遇到缺失值或混合类型时较严格。

- `np.genfromtxt()`：
  - 可处理缺失值、注释、混合类型、字段名称等复杂情况。
  - 可用 `missing_values` 指定缺失值标记。
  - 可用 `filling_values` 填补缺失值。
  - `dtype=None` 时可自动推断每列的数据类型。
  - `names=True` 可从文件头读取字段名并生成结构化数组。

```python
data = np.genfromtxt(
    "data.csv",
    delimiter=",",
    names=True,
    dtype=None,
    encoding="utf-8"
)
```

    ---

## 14. 编码习惯与常见坑

- 推荐始终使用：

```python
import numpy as np
```

  不要使用：

```python
from numpy import *
```

  因为它可能覆盖 Python 内置函数，例如 `sum`。

```python
sum(range(5), -1)
```

- Python 内置 `sum` 中第二个参数是初始值；NumPy 的 `sum` 中第二个位置参数常被解释为 `axis`。混用可能产生完全不同的行为。

- 布尔逻辑使用 `&`、`|`、`~`，不要使用 `and`、`or`、`not`。
- 随机整数的上界默认不包含：`randint(low, high)` 是 `[low, high)`。
- 使用 `np.random.randint()` 生成坐标时允许重复；若要求位置唯一，使用：

```python
np.random.choice(total, size, replace=False)
```

  ---

## 15. VS Code 与 Jupyter 常用操作

- Jupyter 单元格执行：
  - `Shift + Enter`：运行当前单元格并跳到下一格。
  - `Ctrl + Enter`：运行当前单元格，停留在当前格。
  - `Esc` 后按 `A`：在上方插入单元格。
  - `Esc` 后按 `B`：在下方插入单元格。
  - `Esc` 后按 `M`：切换为 Markdown 单元格。
  - `Esc` 后按 `Y`：切换为代码单元格。

- VS Code 标签页切换：
  - `Ctrl + Tab`：在最近使用的标签间切换。
  - `Ctrl + PageDown`：切换到下一个标签。
  - `Ctrl + PageUp`：切换到上一个标签。

- 多处手动编辑或对齐可使用多光标：
  - `Alt + 单击`：添加光标。
  - 适合对齐结构化 dtype、批量修改变量名等场景。

## 16. 数组基本操作速记

### 改变形状与维度

```python
a.reshape(2, 3)       # 改变形状，元素总数不变
a.ravel()             # 展平为一维，通常返回视图
a.flatten()           # 展平为一维，返回副本
a.resize(2, 3)        # 原地改变数组尺寸
np.atleast_2d(a)      # 至少变成二维
np.atleast_3d(a)      # 至少变成三维
```

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**`np.atleast_xd()` 可以传入多个数组！**
> 例如：`X,Y=np.atleast_2d(Z[:,0],Z[:,0])`
### 转置与轴操作

```python
a.T                   # 二维数组转置；高维数组为轴顺序反转
a.transpose()         # 转置
np.swapaxes(a, 0, 1)  # 交换两个轴
np.moveaxis(a, 0, -1) # 将某轴移动到指定位置
```

### 拼接与堆叠

```python
np.concatenate([a, b], axis=0)  # 沿已有轴连接
np.stack([a, b], axis=0)        # 新增一个轴再堆叠
np.vstack([a, b])               # 垂直堆叠，等价于按行拼接
np.hstack([a, b])               # 水平堆叠，等价于按列拼接
np.column_stack([a, b])         # 将一维数组视为列进行拼接
```

核心区别：

- `concatenate`：沿**已有的轴**拼接，维度数量通常不变。
- `stack`：先创建一个**新轴**，维度数量增加 1。

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.concatenate([a, b])
# [1, 2, 3, 4, 5, 6]，shape 为 (6,)

np.stack([a, b])
# [[1, 2, 3],
#  [4, 5, 6]]，shape 为 (2, 3)
```

  ---

## 17. 视图与副本

NumPy 中最容易踩坑的概念之一是：有些操作返回**视图**，有些操作返回**副本**。

- 视图：与原数组共享数据；修改一方可能影响另一方。
- 副本：拥有独立数据；修改不会互相影响。

```python
a = np.arange(10)
b = a[2:5]       # 通常是视图
b[0] = 99
# a 也会发生变化
```

```python
a = np.arange(10)
b = a2, 3, 4 # 花式索引通常产生副本
b[0] = 99
# a 不会变化
```

  常见规律：

  | 操作 | 通常结果 |
  |---|---|
  | 普通切片 `a[1:5]` | 视图 |
  | `reshape()` | 尽量返回视图 |
  | `ravel()` | 尽量返回视图 |
  | `a.T` | 通常是视图 |
  | 花式索引 `a1, 3` | 副本 |
  | 布尔索引 `a[a > 3]` | 副本 |
  | `flatten()` | 副本 |
  | `.copy()` | 明确副本 |

  若需要确保独立，显式写：

```python
b = a[2:5].copy()
```

  ---

## 18. 高维数组的索引思维

对于 shape 为：

```python
a.shape == (2, 5, 3)
```

可理解为：

- 第 0 轴：2 个大块。
- 第 1 轴：每个大块有 5 行。
- 第 2 轴：每行有 3 个元素。

  访问单个元素：

```python
a[1, 2, 0]
```

  含义是：

> 第 2 个大块、第 3 行、第 1 列。

多个整数数组同时索引时，仍然遵循“一一配对”规则：

```python
a[[0, 1], [1, 2], [1, 2]]
```

等价于：

```python
np.array([
    a[0, 1, 1],
    a[1, 2, 2]
])
```

---

## 19. `np.where` 的两种常见用法

### 返回满足条件的位置

```python
a = np.array([3, 8, 1, 9])
np.where(a > 5)
# (array([1, 3]),)
```

返回的是索引位置。

### 按条件二选一

```python
np.where(a > 5, 100, 0)
# [  0, 100,   0, 100]
```

含义是：

> 元素大于 5 时填 100，否则填 0。

也可以用于二维数组：

```python
a = np.arange(9).reshape(3, 3)
np.where(a % 2 ** 0, a, -1)
# 偶数保留，奇数替换为 -1
```

---

## 20. `NaN`、无穷大与缺失值

### `NaN` 的特点

```python
np.nan ** np.nan  # False
```

因为 `NaN` 表示“不是一个数”，它不等于包括自己在内的任何值。

判断 `NaN`：

```python
np.isnan(a)
```

忽略 `NaN` 的统计函数：

```python
np.nanmean(a)
np.nansum(a)
np.nanmax(a)
np.nanmin(a)
```

### 无穷大

```python
np.inf       # 正无穷
-np.inf      # 负无穷
np.isinf(a)  # 判断是否为无穷
np.isfinite(a)  # 判断是否为有限数
```

### 清理非有限数值

```python
a[~np.isfinite(a)] = 0
```

含义是：将 `NaN`、`inf`、`-inf` 全部替换为 0。

---

## 21. 按条件筛选与替换

### 条件筛选

```python
a = np.arange(10)

a[a > 5]
# [6, 7, 8, 9]
```

### 原地替换

```python
a[a > 5] = 0
```

### 多条件替换

```python
a[(a > 2) & (a < 7)] = -1
```

### 截断数值范围

```python
a = np.array([-3, 2, 8, 15])
a.clip(0, 10)
# [0, 2, 8, 10]
```

等价于：

```python
np.clip(a, 0, 10)
```

---

## 22. 聚合函数与 `keepdims`

常用聚合：

```python
np.sum(a)
np.mean(a)
np.min(a)
np.max(a)
np.std(a)
np.var(a)
np.prod(a)
```

沿轴计算：

```python
a.sum(axis=0)   # 每列
a.sum(axis=1)   # 每行
```

例如：

```python
a = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

a.mean(axis=1)
# [2., 5.]
```

保留维度：

```python
a.mean(axis=1, keepdims=True)
# [[2.],
#  [5.]]
```

这常用于标准化：

```python
row_mean = a.mean(axis=1, keepdims=True)
a_centered = a - row_mean
```

每一行都会减去自己的均值。

---

## 23. 标准化与归一化的广播写法

### 每列标准化

```python
mean = a.mean(axis=0, keepdims=True)
std = a.std(axis=0, keepdims=True)

z = (a - mean) / std
```

每一列均值约为 0，标准差约为 1。

### 每行归一化

```python
row_min = a.min(axis=1, keepdims=True)
row_max = a.max(axis=1, keepdims=True)

scaled = (a - row_min) / (row_max - row_min)
```

每一行会映射到 `[0, 1]` 区间。

注意：若某行所有元素都相同，分母会是 0，需要额外处理。

```python
denom = row_max - row_min
scaled = np.divide(
    a - row_min,
    denom,
    out=np.zeros_like(a, dtype=float),
    where=denom != 0
)
```

---

## 24. NumPy 的函数式接口与方法式接口

很多 NumPy 函数都有两种写法：

```python
np.sum(a)
a.sum()

np.mean(a)
a.mean()

np.sort(a)
a.sort()
```

注意一个重要区别：

```python
np.sort(a)  # 返回排序后的新数组，原 a 通常不变
a.sort()    # 原地排序，返回 None
```

```python
a = np.array([3, 1, 2])

b = np.sort(a)
# a 仍是 [3, 1, 2]
# b 是 [1, 2, 3]

a.sort()
# a 变为 [1, 2, 3]
```

选择原则：

- 希望保留原数据：优先用 `np.sort(a)`。
- 追求内存效率、明确要改原数组：用 `a.sort()`。
- `np.mean(a)` 与 `a.mean()` 在计算结果上等价，主要是风格差异。

  ---

## 25. 实用调试方法

遇到数组形状、广播或索引问题时，优先打印这些信息：

```python
print(a)
print(a.shape)
print(a.ndim)
print(a.dtype)
print(a.size)
```

遇到广播问题时，单独检查每一部分：

```python
print(A.shape)
print(B.shape)
print(B[:, :, None].shape)
```

遇到复杂索引时，拆开写：

```python
idx = a[:, 0].argsort()
print(idx)
print(a[idx])
```

遇到随机结果难以复现时，固定随机种子：

```python
np.random.seed(42)
```

更推荐现代随机数生成器：

```python
rng = np.random.default_rng(42)
a = rng.integers(0, 100, size=(6, 6))
```

---

## 26. 推荐的学习路径

1. 熟练掌握 `shape`、`ndim`、`axis`、`reshape`。
2. 重点练习二维数组的索引、切片与布尔索引。
3. 理解广播规则，尤其是 `None` / `np.newaxis` 补轴。
4. 熟悉聚合、排序、`argsort`、`where`、`unique`、`bincount`。
5. 学会区分视图和副本，避免意外改动原数组。
6. 再接触结构化数组、`stride_tricks`、高级花式索引等进阶主题。

## 27. 最重要的速记规则

```python
# 形状
a.shape

# 二维索引
a[行, 列]

# 二维切片
a[行切片, 列切片]

# 条件组合
(a > x) & (a < y)

# 逐元素逻辑非
~mask

# 改形状
a.reshape(...)

# 保留维度
a.mean(axis=1, keepdims=True)

# 给数组补一个末尾轴
a[:, :, None]

# 根据排序索引重排行
a[a[:, 0].argsort()]

# 无放回随机抽样
np.random.choice(a.size, k, replace=False)

# 展平索引转二维坐标
np.unravel_index(indices, a.shape)

# 检查 NaN
np.isnan(a)

# 按整数标签计数
np.bincount(labels)

# 安全滑动窗口
np.lib.stride_tricks.sliding_window_view(a, window_shape)
```
```
```markdown
## 28. 数组的数据类型 `dtype`

NumPy 数组中的元素通常具有统一类型，可通过 `dtype` 查看：

```python
a = np.array([1, 2, 3])
a.dtype
# dtype('int64')，具体位数会受系统影响
```

创建时指定类型：

```python
a = np.array([1.1, 2.2, 3.3], dtype=np.float32)
```

常见类型：

| 类型 | 含义 |
|---|---|
| `np.int8` / `np.int16` / `np.int32` / `np.int64` | 有符号整数 |
| `np.uint8` / `np.uint16` / `np.uint32` / `np.uint64` | 无符号整数 |
| `np.float16` / `np.float32` / `np.float64` | 浮点数 |
| `np.bool_` | 布尔值 |
| `np.complex64` / `np.complex128` | 复数 |

类型转换：

```python
a = np.array([1.2, 2.8, 3.9])
a.astype(int)
# [1, 2, 3]，直接截断小数部分
```

`astype()` 默认返回新数组：

```python
b = a.astype(np.float32)
```

---

## 29. 数组内存信息

几个常用属性：

```python
a.shape      # 每个轴的长度
a.ndim       # 维度数量
a.size       # 元素总数
a.dtype      # 元素类型
a.itemsize   # 单个元素占用字节数
a.nbytes     # 元素总字节数
a.strides    # 沿每个轴移动一个元素的字节跨度
```

示例：

```python
a = np.arange(9).reshape(3, 3)

a.size      # 9
a.itemsize  # 通常为 8，若 dtype 是 int64
a.nbytes    # 72，即 9 * 8
a.strides   # (24, 8)
```

对 `(3, 3)` 的 `int64` 数组：

- 横向移动一列：跨过 1 个元素，即 8 字节。
- 纵向移动一行：跨过 3 个元素，即 `3 * 8 = 24` 字节。

  ---

## 30. `arange`、`linspace` 与随机数的区别

### `arange`

按固定步长生成：

```python
np.arange(0, 10, 2)
# [0, 2, 4, 6, 8]
```

区间是 `[start, stop)`，不包含终点。

浮点步长时可能受浮点精度影响：

```python
np.arange(0, 1, 0.1)
```

### `linspace`

按固定数量均匀生成：

```python
np.linspace(0, 10, 6)
# [0., 2., 4., 6., 8., 10.]
```

默认包含终点；若不需要终点：

```python
np.linspace(0, 10, 5, endpoint=False)
# [0., 2., 4., 6., 8.]
```

### 随机数组

```python
np.random.rand(2, 3)
# [0, 1) 的均匀分布浮点数

np.random.randn(2, 3)
# 标准正态分布的浮点数

np.random.randint(0, 10, size=(2, 3))
# [0, 10) 的随机整数
```

选择原则：

- 已知间隔：`arange`。
- 已知要几个点：`linspace`。
- 需要随机样本：`rand`、`randn`、`randint`、`choice`。

  ---

## 31. 矩阵转置与矩阵乘法

### 转置

```python
a = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

a.T
# [[1, 4],
#  [2, 5],
#  [3, 6]]
```

`a.T` 等价于：

```python
a.transpose()
```

注意：一维数组转置没有变化：

```python
x = np.array([1, 2, 3])

x.shape    # (3,)
x.T.shape  # (3,)
```

若需要列向量，必须显式补轴：

```python
x[:, None]
# [[1],
#  [2],
#  [3]]
```

### 逐元素乘法与矩阵乘法

```python
A * B
```

表示逐元素相乘，两个数组需要能广播。

```python
A @ B
```

表示矩阵乘法。

```python
np.dot(A, B)
```

对于二维数组通常也表示矩阵乘法，但 `@` 的语义更清晰。

示例：

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

A * B
# [[ 5, 12],
#  [21, 32]]

A @ B
# [[19, 22],
#  [43, 50]]
```

---

## 32. 常见线性代数操作

NumPy 线性代数模块：

```python
import numpy.linalg as la
```

常见操作：

```python
la.det(A)       # 行列式
la.inv(A)       # 逆矩阵
la.solve(A, b)  # 解线性方程组 A @ x = b
la.eig(A)       # 特征值与特征向量
la.svd(A)       # 奇异值分解
la.norm(A)      # 范数
```

解方程组时推荐：

```python
x = np.linalg.solve(A, b)
```

而不是：

```python
x = np.linalg.inv(A) @ b
```

原因是 `solve()` 通常更稳定、更高效，也避免显式计算逆矩阵。

---

## 33. `sum`、`cumsum`、`diff` 与 `reduce`

### 求和

```python
a.sum()
np.sum(a)
np.add.reduce(a)
```

对普通数组，这三种都可用于求和。

```python
np.add.reduce(a, axis=0)
```

等价于：

```python
a.sum(axis=0)
```

### 累积和

```python
a = np.array([1, 2, 3, 4])
np.cumsum(a)
# [1, 3, 6, 10]
```

### 相邻差分

```python
np.diff(a)
# [1, 1, 1]
```

`np.diff(a)` 计算的是：

```python
a[1:] - a[:-1]
```

二维数组可指定轴：

```python
np.diff(a, axis=0)  # 相邻行的差
np.diff(a, axis=1)  # 相邻列的差
```

---

## 34. 随机数的可复现性

传统写法：

```python
np.random.seed(42)
a = np.random.randint(0, 100, 10)
```

同一版本和环境下，重复运行通常得到相同随机序列。

更推荐的新写法：

```python
rng = np.random.default_rng(42)

a = rng.integers(0, 100, size=10)
b = rng.random((3, 4))
c = rng.choice(10, 3, replace=False)
```

优点：

- 随机状态独立，不会污染全局随机状态。
- 更适合函数、模块和大型项目。
- 同一个种子可重复得到相同结果。

  ---

## 35. `np.unique` 的扩展用法

```python
a = np.array([4, 2, 2, 7, 4, 4, 9])
```

仅返回去重且排序后的值：

```python
np.unique(a)
# [2, 4, 7, 9]
```

返回每个唯一值首次出现的位置：

```python
np.unique(a, return_index=True)
```

返回每个元素对应的唯一值编号：

```python
values, inverse = np.unique(a, return_inverse=True)
```

可用于把分类标签编码为连续整数：

```python
labels = np.array(["cat", "dog", "cat", "bird"])

classes, encoded = np.unique(labels, return_inverse=True)

# classes: ['bird', 'cat', 'dog']
# encoded: [1, 2, 1, 0]
```

返回频次：

```python
values, counts = np.unique(a, return_counts=True)
```

二维数组按行去重：

```python
a = np.array([
    [1, 2],
    [3, 4],
    [1, 2]
])

np.unique(a, axis=0)
# [[1, 2],
#  [3, 4]]
```

较旧的 NumPy 版本不支持 `axis=0` 时，可用结构化 `view` 技巧实现按整行去重。

---

## 36. 排序函数的区别

```python
np.sort(a)        # 返回排序后的副本
a.sort()          # 原地排序
np.argsort(a)     # 返回排序索引
np.partition(a, k) # 部分排序
np.argpartition(a, k) # 部分排序索引
```

`np.partition` 适合只关心第 `k` 小元素，而不需要完全排序：

```python
a = np.array([9, 1, 7, 3, 5])

np.partition(a, 2)
# 前 3 个位置是最小的三个值，但它们内部不保证完全有序
```

找前 `k` 小元素的索引：

```python
idx = np.argpartition(a, k)[:k]
```

如果还需要将这 `k` 个值内部排序：

```python
idx = idx[np.argsort(a[idx])]
```

---

## 37. `meshgrid` 与坐标网格

`np.meshgrid()` 根据一维坐标轴生成二维或高维坐标网格。

```python
x = np.array([0, 1, 2])
y = np.array([10, 20])

X, Y = np.meshgrid(x, y)
```

结果：

```python
X
# [[0, 1, 2],
#  [0, 1, 2]]

Y
# [[10, 10, 10],
#  [20, 20, 20]]
```

每个位置 `(i, j)` 的二维坐标是：

```python
(X[i, j], Y[i, j])
```

典型用途：

- 计算二维函数值。
- 绘制曲面或等高线。
- 构造网格坐标。
- 图像或空间数据计算。

```python
Z = X**2 + Y**2
```

  ---

## 38. 成对距离矩阵与广播

对于一维坐标点，可利用广播快速计算所有点之间的距离。

```python
x = np.array([1, 4, 7])

D = np.abs(x[:, None] - x[None, :])
```

结果：

```python
# [[0, 3, 6],
#  [3, 0, 3],
#  [6, 3, 0]]
```

二维平面点：

```python
points = np.array([
    [0, 0],
    [3, 4],
    [6, 8]
])

diff = points[:, None, :] - points[None, :, :]
D = np.sqrt((diff ** 2).sum(axis=-1))
```

形状变化：

```python
points.shape             # (N, 2)
points[:, None, :].shape # (N, 1, 2)
points[None, :, :].shape # (1, N, 2)
diff.shape               # (N, N, 2)
D.shape                  # (N, N)
```

这种方法基于广播，速度快且代码短，但当 `N` 很大时会创建 `(N, N, 维度)` 的数组，内存占用较高。

---

## 39. 常见错误信息对应思路

### 广播失败

```text
ValueError: operands could not be broadcast together
```

检查：

```python
print(A.shape, B.shape)
```

从右向左检查每一维是否相等，或其中一边是否为 `1`。

### 索引越界

```text
IndexError: index ... is out of bounds
```

检查索引范围：

```python
0 <= index < a.shape[axis]
```

### 布尔掩码维度不匹配

```text
IndexError: boolean index did not match indexed array
```

检查 mask 对应维度是否一致：

```python
a.shape
mask.shape
```

### 数组真值不明确

```text
ValueError: The truth value of an array is ambiguous
```

不要写：

```python
if a > 0:
    ...
```

根据需求改成：

```python
if np.any(a > 0):
    ...
```

或：

```python
if np.all(a > 0):
    ...
```

---

## 40. 建议保留的 NumPy 编码风格

```python
import numpy as np
```

优先使用明确的关键字参数：

```python
a.mean(axis=1, keepdims=True)
rng.integers(low=0, high=100, size=(6, 6))
```

给中间步骤起有意义的名字：

```python
row_order = a[:, 0].argsort()
a_sorted = a[row_order]
```

复杂表达式优先拆开：

```python
row_mean = a.mean(axis=1, keepdims=True)
row_std = a.std(axis=1, keepdims=True)
normalized = (a - row_mean) / row_std
```

需要避免改变原数组时，显式复制：

```python
result = a.copy()
```

需要改变原数组且在意内存时，使用原地操作或 `out=`：

```python
np.logical_not(mask, out=mask)
np.add(a, b, out=a)
```
```
```markdown
## 41. 常见数组生成模板

### 创建固定值数组

```python
np.zeros((3, 4))                 # 全 0 浮点数组
np.ones((3, 4), dtype=int)       # 全 1 整数数组
np.full((3, 4), fill_value=7)    # 全部填 7
np.empty((3, 4))                 # 未初始化数组，内容不可预测
```

`np.empty()` 速度快，但不能假设初始内容是 0；只有在后续会覆盖全部元素时才适合使用。

### 创建规则数组

```python
np.arange(12).reshape(3, 4)

np.eye(4)        # 4×4 单位矩阵
np.diag([1, 2, 3])  # 以给定元素生成对角矩阵

np.triu(np.ones((4, 4)))  # 上三角
np.tril(np.ones((4, 4)))  # 下三角
```

### 根据已有数组创建

```python
np.zeros_like(a)
np.ones_like(a)
np.full_like(a, 9)
```

这些函数会自动继承 `a` 的形状，默认也继承其 dtype。

---

## 42. `repeat`、`tile` 与 `broadcast_to`

三者都和“重复”有关，但机制不同。

### `repeat`：逐元素重复

```python
a = np.array([1, 2, 3])

np.repeat(a, 2)
# [1, 1, 2, 2, 3, 3]
```

二维例子：

```python
a = np.array([[1, 2], [3, 4]])

np.repeat(a, 2, axis=0)
# [[1, 2],
#  [1, 2],
#  [3, 4],
#  [3, 4]]
```

### `tile`：按完整块平铺

```python
a = np.array([1, 2, 3])

np.tile(a, 2)
# [1, 2, 3, 1, 2, 3]
```

二维平铺：

```python
np.tile(a, (2, 3))
# [[1, 2, 3, 1, 2, 3, 1, 2, 3],
#  [1, 2, 3, 1, 2, 3, 1, 2, 3]]
```

### `broadcast_to`：零拷贝广播视图

```python
a = np.array([1, 2, 3])

np.broadcast_to(a, (4, 3))
# [[1, 2, 3],
#  [1, 2, 3],
#  [1, 2, 3],
#  [1, 2, 3]]
```

它通常返回只读视图，因此不能直接修改：

```python
b = np.broadcast_to(a, (4, 3))
b[0, 0] = 99  # ValueError：通常不可写
```

选择建议：

| 需求 | 推荐 |
|---|---|
| 每个元素连续重复 | `repeat` |
| 整个数组按块复制 | `tile` |
| 仅为计算匹配形状，不想复制数据 | 广播或 `broadcast_to` |

---

## 43. `take`、`choose` 与 `put`

### `np.take`

沿展平数组或指定轴按索引取值：

```python
a = np.arange(12).reshape(3, 4)

np.take(a, [0, 5, 10])
# [0, 5, 10]
```

指定轴：

```python
np.take(a, [0, 2], axis=1)
# 取第 0、2 列
```

它与花式索引相似，但当索引轴需要动态传入时，`take` 更方便。

### `np.choose`

按“选择器数组”从多个候选数组中逐元素选值：

```python
selector = np.array([0, 1, 0, 1])
a = np.array([10, 10, 10, 10])
b = np.array([20, 20, 20, 20])

np.choose(selector, [a, b])
# [10, 20, 10, 20]
```

实际项目中，`np.where()` 往往更直观：

```python
np.where(selector == 0, a, b)
```

### `np.put`

按展平索引原地写入：

```python
a = np.arange(9).reshape(3, 3)

np.put(a, [0, 4, 8], 99)

# [[99,  1,  2],
#  [ 3, 99,  5],
#  [ 6,  7, 99]]
```

`np.put` 会直接改动 `a`，且默认按 C 顺序展平索引。

---

## 44. `ravel`、`flatten` 与 `.flat`

### `ravel`

```python
a.ravel()
np.ravel(a)
```

将数组展为一维；如果内存布局允许，通常返回视图，开销较低。

```python
a = np.arange(6).reshape(2, 3)

a.ravel()
# [0, 1, 2, 3, 4, 5]
```

### `flatten`

```python
a.flatten()
```

总是返回副本，更安全但需要额外内存。

### `.flat`

`.flat` 是一维迭代器，可按展平顺序读写原数组：

```python
a = np.arange(9).reshape(3, 3)

a.flat[4]
# 4

a.flat[4] = 99
```

随机修改若干展平位置时，可写：

```python
idx = np.random.choice(a.size, 3, replace=False)
a.flat[idx] = 1
```

---

## 45. `delete`、`insert` 与 `append`

这些函数通常会创建新数组，因为 ndarray 的大小不可原地自由伸缩。

### 删除行或列

```python
a = np.arange(12).reshape(3, 4)

np.delete(a, 1, axis=0)  # 删除第 2 行
np.delete(a, 2, axis=1)  # 删除第 3 列
```

不指定 `axis` 时先展平：

```python
np.delete(a, [0, 3])
```

### 插入

```python
a = np.arange(6).reshape(2, 3)

np.insert(a, 1, [99, 99, 99], axis=0)
# 在第 1 行前插入一行
```

### 追加

```python
np.append(a, [6, 7, 8])
```

不指定 `axis` 时会先展平。

若频繁追加数据，不建议反复调用 `np.append()`；更高效的做法是先用 Python list 收集，最后统一转换为 ndarray。

---

## 46. `split` 与索引边界

### 等分数组

```python
a = np.arange(12)

np.split(a, 3)
# [array([0, 1, 2, 3]),
#  array([4, 5, 6, 7]),
#  array([8, 9, 10, 11])]
```

`np.split()` 要求能整除，否则会报错。

### 不等分切割

```python
np.array_split(a, 5)
```

允许每段长度不完全一致。

### 指定分割位置

```python
np.split(a, [3, 8])
# [array([0, 1, 2]),
#  array([3, 4, 5, 6, 7]),
#  array([8, 9, 10, 11])]
```

`[3, 8]` 表示在索引 3 和 8 之前切开。

### 二维数组专用快捷方式

```python
np.vsplit(a, 2)  # 沿行方向切
np.hsplit(a, 2)  # 沿列方向切
np.dsplit(a, 2)  # 沿第三维切
```

---

## 47. `pad`：数组填充

`np.pad()` 常用于图像、卷积、时间序列边界处理。

```python
a = np.array([1, 2, 3])

np.pad(a, pad_width=2)
# [0, 0, 1, 2, 3, 0, 0]
```

指定填充值：

```python
np.pad(a, 2, mode="constant", constant_values=-1)
# [-1, -1, 1, 2, 3, -1, -1]
```

二维数组：

```python
a = np.ones((2, 3))

np.pad(a, ((1, 1), (2, 2)))
```

含义：

- 第 0 轴前后各补 1 行；
- 第 1 轴前后各补 2 列。

  常见模式：

```python
np.pad(a, 1, mode="edge")      # 用边缘值填充
np.pad(a, 1, mode="reflect")   # 镜像反射填充
np.pad(a, 1, mode="wrap")      # 循环填充
```

  ---

## 48. 掩码数组 `MaskedArray`

掩码数组适合处理“值存在但应忽略”的数据，例如缺失值、无效传感器读数。

```python
a = np.array([1, 2, -999, 4])

m = np.ma.masked_equal(a, -999)
```

此时 `-999` 被标记为无效值：

```python
m.mean()
# 约为 2.3333，而不是把 -999 也算进去
```

也可以手动指定 mask：

```python
data = np.array([1, 2, 3, 4])
mask = np.array([False, True, False, False])

m = np.ma.array(data, mask=mask)
```

与 `NaN` 的区别：

- `NaN` 常用于浮点数组的缺失数值。
- MaskedArray 可用于整数等任意 dtype，也能将“原始值”与“是否有效”分开保存。
- 许多 NumPy 函数可识别 MaskedArray 并忽略被遮蔽值。

  ---

## 49. 高效条件运算：`where` 与 `out`

### `where=` 参数

很多 NumPy 通用函数支持 `where`，可以只在满足条件的位置计算或写入：

```python
a = np.array([1, 2, 3, 4])
out = np.zeros_like(a)

np.multiply(a, 10, out=out, where=a > 2)
# out = [0, 0, 30, 40]
```

注意：若不传 `out`，`where=False` 的位置可能未初始化，不应依赖其值。

### 防止除以零

```python
numerator = np.array([10, 20, 30])
denominator = np.array([2, 0, 5])

result = np.divide(
    numerator,
    denominator,
    out=np.zeros_like(numerator, dtype=float),
    where=denominator != 0
)

# [5., 0., 6.]
```

### 原地加减乘除

```python
np.add(a, 1, out=a)
np.multiply(a, 2, out=a)
np.maximum(a, 0, out=a)
```

适合大数组，能减少临时数组和内存占用。

---

## 50. `all`、`any` 与逻辑判断

```python
a = np.array([True, True, False])
```

```python
np.all(a)  # False：不是所有元素都为 True
np.any(a)  # True：至少有一个元素为 True
```

数值数组中，0 视为 False，非 0 视为 True：

```python
np.any(np.array([0, 0, 5]))  # True
np.all(np.array([1, 2, 3]))  # True
```

沿轴判断：

```python
a = np.array([
    [1, 0, 3],
    [4, 5, 6]
])

np.any(a, axis=1)
# [True, True]

np.all(a, axis=1)
# [False, True]
```

常见应用：

```python
np.all(a >= 0)       # 是否所有元素非负
np.any(a < 0)        # 是否存在负数
np.allclose(a, b)    # 两个浮点数组是否近似相等
```

浮点数组比较建议使用：

```python
np.allclose(a, b)
```

而不要直接依赖：

```python
a == b
```

因为浮点运算存在精度误差。

---

## 51. `isclose` 与浮点比较

```python
a = 0.1 + 0.2
b = 0.3

a == b
# 通常为 False
```

原因是二进制浮点数无法精确表示许多十进制小数。

使用：

```python
np.isclose(a, b)
# True
```

比较数组：

```python
np.isclose(x, y)
```

检查是否全部近似相等：

```python
np.allclose(x, y)
```

可调整容差：

```python
np.allclose(x, y, rtol=1e-5, atol=1e-8)
```

近似判断条件为：

$$
|x - y| \leq \text{atol} + \text{rtol} \cdot |y|
$$

---

## 52. 读取文本数据的实践模板

### 干净的纯数值 CSV

```python
data = np.loadtxt(
    "data.csv",
    delimiter=",",
    skiprows=1
)
```

适用于：

- 每行列数一致；
- 全部是数值；
- 无缺失值；
- 格式稳定。

### 有缺失值或混合类型的 CSV

```python
data = np.genfromtxt(
    "data.csv",
    delimiter=",",
    names=True,
    dtype=None,
    encoding="utf-8",
    missing_values=["", "NA", "N/A"],
    filling_values=np.nan
)
```

常用参数：

| 参数               | 用途                |
| ---------------- | ----------------- |
| `delimiter`      | 分隔符，例如 `","`、`\t` |
| `skip_header`    | 跳过文件开头的行数         |
| `names=True`     | 第一行作为字段名          |
| `usecols`        | 仅读指定列             |
| `dtype`          | 指定或推断数据类型         |
| `missing_values` | 缺失值标记             |
| `filling_values` | 缺失值替代值            |
| `converters`     | 自定义某列转换函数         |
| `usemask=True`   | 返回掩码数组            |

---

## 53. 输入输出的编码注意点

读取中文或其他非 ASCII 文本时，常需要显式指定编码：

```python
np.genfromtxt(
    "data.csv",
    delimiter=",",
    dtype=None,
    names=True,
    encoding="utf-8"
)
```

如果文件来自某些 Windows 软件，可能需要尝试：

```python
encoding="gbk"
```

或：

```python
encoding="utf-8-sig"
```

若字段名有空格、特殊字符或与 Python 关键字冲突，NumPy 可能会自动修改字段名。读取后应检查：

```python
print(data.dtype.names)
```

---

## 54. 处理分类标签的常用技巧

原始标签：

```python
labels = np.array(["red", "blue", "red", "green", "blue"])
```

编码成连续整数：

```python
classes, codes = np.unique(labels, return_inverse=True)

# classes: ['blue', 'green', 'red']
# codes:   [2, 0, 2, 1, 0]
```

得到每个类别频次：

```python
counts = np.bincount(codes)
```

恢复原始标签：

```python
recovered = classes[codes]
```

这是一套常见流程：

```python
classes, codes = np.unique(labels, return_inverse=True)
counts = np.bincount(codes)
```

适用于统计、分组、标签预处理和简单机器学习任务。
```markdown
## 55. 随机分布速查

除均匀随机数和整数随机数外，NumPy 还支持多种概率分布。

```python
rng = np.random.default_rng(42)
```

### 常用分布

```python
rng.normal(loc=0, scale=1, size=1000)       # 正态分布
rng.uniform(low=0, high=1, size=1000)       # 均匀分布
rng.integers(low=0, high=10, size=1000)     # 随机整数
rng.binomial(n=10, p=0.5, size=1000)        # 二项分布
rng.poisson(lam=3, size=1000)               # 泊松分布
rng.exponential(scale=2, size=1000)         # 指数分布
rng.choice(10, size=5, replace=False)       # 无放回抽样
```

旧接口与新接口的对应关系：

| 旧接口 | 推荐新接口 |
|---|---|
| `np.random.rand(2, 3)` | `rng.random((2, 3))` |
| `np.random.randn(2, 3)` | `rng.standard_normal((2, 3))` |
| `np.random.randint(0, 10, 5)` | `rng.integers(0, 10, 5)` |
| `np.random.choice(...)` | `rng.choice(...)` |
| `np.random.normal(...)` | `rng.normal(...)` |

现代代码中建议使用 `np.random.default_rng()` 创建独立随机数生成器。

---

## 56. 广播规则完整速记

两个数组做逐元素运算时，NumPy 从**最右侧维度**开始比较。

每一对对齐维度必须满足至少一项：

1. 两个长度相等；
2. 其中一个长度为 `1`；
3. 某数组缺少该维度，视为长度 `1`。

```python
(3, 4)      # 可以与 (4,) 广播
(3, 4)      # 可以与 (3, 1) 广播
(2, 3, 4)   # 可以与 (3, 4) 广播
(2, 3, 4)   # 可以与 (2, 1, 4) 广播
```

不能广播：

```python
(5, 5, 3)
(5, 5)
```

从右对齐：

```text
A: (5, 5, 3)
B: (   5, 5)
↑
3 ≠ 5，且都不是 1
```

正确补轴：

```python
A = np.ones((5, 5, 3))
B = np.ones((5, 5))

A * B[:, :, None]
# B: (5, 5) -> (5, 5, 1) -> 广播为 (5, 5, 3)
```

常用补轴方式：

```python
x[:, None]        # (n,) -> (n, 1)
x[None, :]        # (n,) -> (1, n)
a[:, :, None]     # (m, n) -> (m, n, 1)
a[None, :, :]     # (m, n) -> (1, m, n)
```

---

## 57. 行向量、列向量与外积

一维数组本身没有“行”或“列”方向：

```python
x = np.array([1, 2, 3])
x.shape
# (3,)
```

将它视为行向量：

```python
x[None, :]
# shape: (1, 3)
```

将它视为列向量：

```python
x[:, None]
# shape: (3, 1)
```

计算外积：

```python
x[:, None] * x[None, :]
# [[1, 2, 3],
#  [2, 4, 6],
#  [3, 6, 9]]
```

也可以写：

```python
np.outer(x, x)
```

点积：

```python
x @ x
# 14
```

注意区分：

```python
x * x       # 逐元素：[1, 4, 9]
x @ x       # 点积：14
np.outer(x, x)  # 外积：3×3 矩阵
```

---

## 58. `einsum`：通用张量运算表示法

`np.einsum()` 可用字母标识轴，统一表达求和、转置、矩阵乘法、批量计算等操作。

### 向量点积

```python
np.einsum("i,i->", x, y)
# 等价于 x @ y
```

### 矩阵乘法

```python
np.einsum("ij,jk->ik", A, B)
# 等价于 A @ B
```

### 矩阵转置

```python
np.einsum("ij->ji", A)
# 等价于 A.T
```

### 按行求和

```python
np.einsum("ij->i", A)
# 等价于 A.sum(axis=1)
```

### 每行平方和

```python
np.einsum("ij,ij->i", A, A)
# 等价于 (A ** 2).sum(axis=1)
```

### 批量矩阵乘法

```python
# A: (batch, m, n)
# B: (batch, n, p)
C = np.einsum("bmn,bnp->bmp", A, B)
```

初学阶段不必强记复杂表达式；先掌握 shape、`axis`、广播和 `@`，需要简化高维运算时再使用 `einsum`。

---

## 59. `np.apply_along_axis` 与向量化

`np.apply_along_axis()` 用于沿某个轴，对每个一维切片运行 Python 函数：

```python
a = np.arange(12).reshape(3, 4)

np.apply_along_axis(np.max, axis=1, arr=a)
# [3, 7, 11]
```

自定义函数：

```python
def range_size(x):
return x.max() - x.min()

np.apply_along_axis(range_size, axis=1, arr=a)
# 每行的最大值减最小值
```

但它本质上仍会多次调用 Python 函数，通常不如真正的 NumPy 向量化高效。

优先选择：

```python
a.max(axis=1) - a.min(axis=1)
```

而不是：

```python
np.apply_along_axis(range_size, axis=1, arr=a)
```

原则：

> 能用 NumPy 内置 ufunc、广播、聚合函数完成，就不要用 Python 循环或 `apply_along_axis`。

---

## 60. 向量化与 ufunc

NumPy 的核心效率来自 ufunc，即“通用函数”，它们能对数组逐元素在底层循环中运行。

常见 ufunc：

```python
np.add(a, b)
np.subtract(a, b)
np.multiply(a, b)
np.divide(a, b)
np.power(a, 2)
np.sqrt(a)
np.exp(a)
np.log(a)
np.abs(a)
np.maximum(a, b)
np.minimum(a, b)
```

大多都可用运算符简写：

```python
a + b
a - b
a * b
a / b
a ** 2
```

ufunc 的优势：

- 自动支持数组逐元素计算；
- 支持广播；
- 常支持 `out=` 原地写入；
- 常支持 `where=` 条件计算；
- 比 Python `for` 循环高效得多。

```python
result = np.empty_like(a, dtype=float)

np.sqrt(a, out=result, where=a >= 0)
```

---

## 61. 通用函数的 `reduce`、`accumulate` 与 `outer`

许多 ufunc 不只是能逐元素计算，还支持：

### `reduce`：沿轴累计归约成较低维

```python
np.add.reduce(a)
# 等价于 np.sum(a)

np.multiply.reduce(a)
# 等价于 np.prod(a)

np.maximum.reduce(a)
# 等价于 np.max(a)
```

### `accumulate`：保留每一步累计结果

```python
np.add.accumulate([1, 2, 3, 4])
# [1, 3, 6, 10]

np.multiply.accumulate([1, 2, 3, 4])
# [1, 2, 6, 24]
```

### `outer`：对两个数组所有元素两两运算

```python
x = np.array([1, 2, 3])
y = np.array([10, 20])

np.add.outer(x, y)
# [[11, 21],
#  [12, 22],
#  [13, 23]]

np.multiply.outer(x, y)
# [[10, 20],
#  [20, 40],
#  [30, 60]]
```

`outer` 在构造距离矩阵、组合表、核函数计算中很有用。

---

## 62. `argmax`、`argmin` 与 `unravel_index`

### 找最大值或最小值的位置

```python
a = np.array([
[3, 8, 1],
[6, 2, 9]
])

a.argmax()
# 5：展平后的最大值索引

a.max()
# 9
```

将展平索引转换为二维位置：

```python
np.unravel_index(a.argmax(), a.shape)
# (1, 2)
```

也可直接写：

```python
np.unravel_index(np.argmax(a), a.shape)
```

沿指定轴找位置：

```python
a.argmax(axis=0)
# 每列最大值所在行

a.argmax(axis=1)
# 每行最大值所在列
```

若含有 `NaN`，可使用：

```python
np.nanargmax(a)
np.nanargmin(a)
```

---

## 63. 高级索引：`take_along_axis`

`np.take_along_axis()` 专门用于“每行/每列按不同索引位置取值”。

```python
a = np.array([
[10, 20, 30],
[40, 50, 60]
])

idx = np.array([
[2, 0],
[1, 2]
])

np.take_along_axis(a, idx, axis=1)
# [[30, 10],
#  [50, 60]]
```

典型场景：每行取最大值对应元素。

```python
idx = a.argmax(axis=1, keepdims=True)
row_max = np.take_along_axis(a, idx, axis=1)

# [[30],
#  [60]]
```

取每行排序后的前 2 个元素：

```python
idx = np.argsort(a, axis=1)[:, -2:]
top2 = np.take_along_axis(a, idx, axis=1)
```

---

## 64. `searchsorted`：在有序数组中找插入位置

```python
a = np.array([10, 20, 30, 40])

np.searchsorted(a, 25)
# 2
```

意思是：将 25 插入索引 2 的位置，数组仍保持升序。

```python
np.searchsorted(a, [5, 10, 25, 50])
# [0, 0, 2, 4]
```

处理重复值：

```python
a = np.array([1, 2, 2, 2, 3])

np.searchsorted(a, 2, side="left")
# 1

np.searchsorted(a, 2, side="right")
# 4
```

常见用途：

- 数值分箱；
- 根据阈值定位；
- 排名计算；
- 有序时间轴定位。

---

## 65. `histogram` 与连续变量分箱

```python
x = np.array([0.2, 0.8, 1.3, 2.7, 3.1])

counts, edges = np.histogram(x, bins=[0, 1, 2, 3, 4])
```

结果含义：

```python
counts
# [2, 1, 1, 1]

edges
# [0, 1, 2, 3, 4]
```

一般情况下，区间规则是：

```text
[0, 1), [1, 2), [2, 3), [3, 4]
```

即前面各箱左闭右开，最后一个箱通常包含右端点。

自动分箱：

```python
counts, edges = np.histogram(x, bins=10)
```

二维直方图：

```python
H, x_edges, y_edges = np.histogram2d(x, y, bins=20
```

---

## 66. 排序、查找、统计常用组合

### 每行最大值及位置

```python
idx = a.argmax(axis=1)
values = a[np.arange(a.shape[0]), idx]
```

或：

```python
idx = a.argmax(axis=1, keepdims=True)
values = np.take_along_axis(a, idx, axis=1)
```

### 每行最小值归一化

```python
row_min = a.min(axis=1, keepdims=True)
a_shifted = a - row_min
```

### 选出大于阈值的元素及位置

```python
mask = a > threshold
values = a[mask]
rows, cols = np.where(mask)
```

### 找前 `k` 大元素

```python
k = 3

idx = np.argpartition(a, -k)[-k:]
idx = idx[np.argsort(a[idx])[::-1]]
top_values = a[idx]
```

二维数组每行前 `k` 大值可结合：

```python
idx = np.argpartition(a, -k, axis=1)[:, -k:]
values = np.take_along_axis(a, idx, axis=1)
```

若要求每行结果也从大到小排列，还需要对 `values` 和对应 `idx` 再排序。

---

## 67. `np.vectorize` 不是真正的向量化

```python
def f(x):
return x * x + 1

vf = np.vectorize(f)
vf(np.arange(5))
```

虽然写法像数组运算，但 `np.vectorize()` 主要是 Python 层的便利包装，本质仍逐个调用 Python 函数，通常不会显著加速。

优先改写为真正的数组表达式：

```python
x = np.arange(5)
x * x + 1
```

需要根据条件分支时，优先考虑：

```python
np.where(x > 0, x, -x)
np.select(conditions, choices, default=...)
```

而不是 `np.vectorize()`。

---

## 68. 性能与内存的核心原则

### 优先数组运算，少写 Python 循环

```python
# 不推荐
result = []
for x in a:
result.append(x * 2)

# 推荐
result = a * 2
```

### 谨慎构造超大中间数组

成对距离矩阵：

```python
diff = points[:, None, :] - points[None, :, :]
```

会构造 shape 为 `(N, N, D)` 的中间数组；当 `N` 很大时，内存可能迅速耗尽。

### 尽量复用输出缓冲区

```python
out = np.empty_like(a)
np.multiply(a, 2, out=out)
```

### 避免反复拼接

```python
# 不推荐：循环内不断扩容复制
for item in items:
a = np.append(a, item)
```

更好的方式：

```python
values = []
for item in items:
values.append(item)

a = np.array(values)
```

### 选择适当 dtype

```python
a = np.zeros((10000, 10000), dtype=np.float64)
```

所需内存约为：

$$
10000 \times 10000 \times 8 = 800000000 \text{ bytes}
$$

约 800 MB。若精度允许，使用 `float32` 可将内存减半。

---

## 69. 数组形状检查清单

处理报错或复杂表达式时，依次确认：

```python
print(a.shape)
print(a.ndim)
print(a.dtype)
```

对每一步都检查：

```python
x = a[:, None]
print(x.shape)

y = b[None, :]
print(y.shape)

z = x - y
print(z.shape)
```

针对典型目标形状：

| 目标 | 常见写法 |
|---|---|
| `(n, 1)` | `x[:, None]` |
| `(1, n)` | `x[None, :]` |
| `(m, n, 1)` | `a[:, :, None]` |
| `(1, m, n)` | `a[None, :, :]` |
| 展平为 `(N,)` | `a.ravel()` |
| 保留二维单列 | `a[:, i:i+1]` |
| 取成一维列 | `a[:, i]` |

核心习惯：

> 不要只看数组打印出来的值；每次不确定时，先看 `shape`。


