---
title: "Numpy 综合案例"
slug: "machine-and-deep-learning/python/numpy-综合案例"
description: "题目： 给定一个 (m, n) 的随机整数矩阵，如果某个元素为 0，则将该元素所在的行和列全部置为 0。"
publishDate: "2026-08-01"
createdAt: "2026-08-01T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["machine-learning","python"]
series: ["Machine & Deep Learning","Python"]
---

### 1. 矩阵"十字零"变换

**题目：** 给定一个 `(m, n)` 的随机整数矩阵，如果某个元素为 0，则将该元素所在的行和列全部置为 0。

**要求：** 使用 NumPy 向量化方式实现，不显式写 Python 循环。

**示例：**

```python
输入：
[[1, 2, 0],
 [4, 5, 6],
 [0, 8, 9]]

输出：
[[0, 0, 0],
 [0, 5, 0],
 [0, 0, 0]]
```

**提示：** 先用 `np.where` 找出所有 0 的行号和列号，再用 `np.unique` 去重，最后用花式索引批量赋值。

<details>
<summary>参考答案</summary>

```python
import numpy as np

a = np.random.randint(0, 5, (5, 5))
print("原数组：")
print(a)

rows, cols = np.where(a == 0)
rows = np.unique(rows)
cols = np.unique(cols)

a[rows, :] = 0
a[:, cols] = 0

print("\n 结果：")
print(a)
```
</details>

> <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**不自己写学了跟没学一样。**
> 1、np.where 默认<=>  np.where[a!=0 ]
> 2、np.unique(rows)还要赋值呢


---

### 2. 滑动窗口统计

**题目：** 给定一个一维时间序列 `x` 和窗口大小 `w`，不使用 Python 循环，计算每个窗口内的均值、最大值和最小值，返回三个等长的新数组。

**要求：** 利用 `sliding_window_view` 和聚合函数完成。

**示例：**

```python
x = np.array([1, 3, 5, 2, 8, 6, 4])
w = 3

# 窗口1: [1,3,5] → mean=3, max=5, min=1
# 窗口2: [3,5,2] → mean=3.33, max=5, min=2
# ...
```

**提示：** `np.lib.stride_tricks.sliding_window_view(x, w)` 返回 shape 为 `(n-w+1, w)` 的视图。

<details>
<summary>参考答案</summary>

```python
from numpy.lib.stride_tricks import sliding_window_view

x = np.array([1, 3, 5, 2, 8, 6, 4])
w = 3

windows = sliding_window_view(x, w)

means = windows.mean(axis=1)
maxs = windows.max(axis=1)
mins = windows.min(axis=1)

print("滑动均值：", means)
print("滑动最大值：", maxs)
print("滑动最小值：", mins)
```
</details>

---

### 3. 成对距离矩阵与最近邻

**题目：** 随机生成 `N` 个二维平面上的点（坐标在 `[0, 100)`），计算所有点之间的欧氏距离矩阵 `D`（shape `(N, N)`），然后找出每个点最近的邻居（排除自身），输出每个点的最近邻索引和距离。

**要求：** 全部使用广播和向量化操作，不写显式循环。

**提示：** 
- `diff = points[:, None, :] - points[None, :, :]` 得到 `(N, N, 2)`
- 沿 `axis=-1` 求平方和再开根号
- 自身距离设为无穷大后用 `argmin`

<details>
<summary>参考答案</summary>

```python
N = 10
rng = np.random.default_rng(42)
points = rng.uniform(0, 100, (N, 2))

diff = points[:, None, :] - points[None, :, :]
D = np.sqrt((diff ** 2).sum(axis=-1))

# 排除自身：将自身距离设为无穷大
np.fill_diagonal(D, np.inf)

nearest_idx = D.argmin(axis=1)          # 每行最小值的列索引
nearest_dist = D[np.arange(N), nearest_idx]

print("每个点的最近邻索引：", nearest_idx)
print("最近邻距离：", nearest_dist)
```
</details>

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**这个广播真是抽象**
> 
> 计算点集距离方法目前见到两种：
> 1、按轴相减
> ```python
> import numpy as np
> N = 10
> points = np.random.randint(0,100,(N,2))
> X,Y = np.atleast_2d(points[:,0],points[:,1])
>注意这里X,Y变成了二维的横向的数组，而不是竖的，
> 这是因为points[:,0]输出1维数组，而points[:,0:1]则是二维。
> Distance =  np.sqrt((X-X.T)**2+(Y-Y.T)**2)
> print(Ditance)
> ```
> 2、立体广播
> ```python
> import numpy as np
> N = 10
> points = np.random.randint(0,100,(N,2))
> # 直接广播
> Diff = points[:,None,:] - points[None,:,:]
> # 平方、沿轴求和、开方
> Distance = np.sqrt(np.sum(Diff **2 , axis = 1))
> print(Distance)
> ```

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**另外如果要求最小距离索引，需：**
>  ``` python
>  np.fill_diagonal(D, np.inf)
>  ```

### 4. 股票数据多条件筛选

**题目：** 模拟 30 天的股票数据，每天有 5 只股票，生成一个 `(30, 5)` 的随机价格数组（范围 `[50, 150)`）。实现以下操作：

1. 找出所有**单日涨幅超过 5%** 的（日, 股票）位置。
2. 计算每只股票的 30 日收益率（最后一天价格 / 第一天价格 - 1）。
3. 找出 30 天中**每只股票的最高价出现在哪一天**。
4. 筛选出"30 天中有超过 10 天是上涨的"股票。

**要求：** 全部使用 NumPy 向量化操作。

<details>
<summary>参考答案</summary>

```python
rng = np.random.default_rng(42)
prices = rng.uniform(50, 150, (30, 5))

# 1. 单日涨幅超过 5% 的位置
daily_return = np.diff(prices, axis=0) / prices[:-1]
rows, cols = np.where(daily_return > 0.05)
print("涨幅超过 5% 的 (日, 股票)：")
for r, c in zip(rows, cols):
    print(f"  第 {r+1} 日 → 第 {r+2} 日，股票 {c}")

# 2. 每只股票的 30 日收益率
total_return = prices[-1] / prices[0] - 1
print("\n 每只股票 30 日收益率：", total_return)

# 3. 每只股票最高价出现在哪一天
max_day = prices.argmax(axis=0)
print("每只股票最高价日：", max_day)

# 4. 超过 10 天上涨的股票
up_days = (np.diff(prices, axis=0) > 0).sum(axis=0)
strong_stocks = np.where(up_days > 10)[0]
print(f"上涨天数 > 10 的股票索引：{strong_stocks}")
print(f"上涨天数：{up_days}")
```
</details>

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**Note**
> 注意 `np.diff()` 
> `np.nonzero()` 代替 `np.sum(axis=0)` 语义更明确
---

### 5. 自定义图像卷积核

**题目：** 生成一个 `(10, 10)` 的随机灰度图像（值在 `[0, 255]`），使用 `sliding_window_view` 提取所有 `3×3` 的滑动窗口，然后实现以下卷积核的效果（不调用 `scipy` 等外部库）：

1. **均值模糊**：`3×3` 全 1/9 的核。
2. **边缘检测**：水平 Sobel 核 `[[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]`。

输出原图和处理后的两张图（用 `print` 打印数值矩阵即可）。

**提示：** 窗口 shape 为 `(8, 8, 3, 3)`，将核 reshape 为 `(1, 1, 3, 3)` 后与窗口逐元素相乘再沿最后两个轴求和。

<details>
<summary>参考答案</summary>

```python
from numpy.lib.stride_tricks import sliding_window_view

rng = np.random.default_rng(42)
img = rng.integers(0, 256, (10, 10))
print("原图：")
print(img)

# 提取 3×3 窗口
windows = sliding_window_view(img, (3, 3))  # (8, 8, 3, 3)

# 1. 均值模糊
kernel_blur = np.ones((3, 3)) / 9
blurred = (windows * kernel_blur).sum(axis=(2, 3))
print("\n 均值模糊后：")
print(blurred.astype(int))

# 2. 水平 Sobel 边缘检测
kernel_sobel = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
])
edges = (windows * kernel_sobel).sum(axis=(2, 3))
print("\nSobel 边缘检测：")
print(edges.astype(int))
```
</details>


