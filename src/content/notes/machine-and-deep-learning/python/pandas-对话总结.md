---
title: "Pandas 对话总结"
slug: "machine-and-deep-learning/python/pandas-对话总结"
description: "标签（Label） ：索引上的显式命名（整数、字符串等），用 .loc 选择，切片 左闭右闭 。"
publishDate: "2026-08-05"
updatedDate: "2026-08-05"
tags: ["python","Pandas","machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# Pandas 数据处理基础 — 对话知识点总结

> 基于「动手实战人工智能 AI By Doing」第 92 章的学习对话记录

---

## 一、索引与标签

### 1. 标签 vs 索引位置
- **标签（Label）**：索引上的显式命名（整数、字符串等），用 `.loc` 选择，切片**左闭右闭**。
- **索引位置（Position）**：物理排列顺序（0, 1, 2…），用 `.iloc` 选择，切片**左闭右开**。
- 即使标签恰好是数字，`.loc[2]` 也是按标签 `2` 取值，而非第 3 行。

### 2. `a.loc[:, 'Name']` vs `a['Name']`
- 两者取单列时**结果完全相同**。
- `a['Name']` 是快捷取列语法；`a.loc[:, 'Name']` 是通用标签索引器，能同时控制行和列，支持切片和多列。

---

## 二、数据删减：`drop()`

### 核心参数关系
| 需求 | 写法 |
|---|---|
| 删行 | `drop(labels=行标签, axis=0)` 或 `drop(index=行标签)` |
| 删列 | `drop(labels=列名, axis=1)` 或 `drop(columns=列名)` |

- **`labels` + `axis`**：通用通道，由 `axis` 决定方向。
- **`index=` / `columns=`**：自带方向的快捷通道，**不能**再配合 `axis` 使用，否则报错。
- `axis=0` 是默认值（行方向）。

---

## 三、数据读取与索引设定

### `index_col`（`read_csv()` 参数）
- 指定 CSV 中哪一列成为**行索引**。
- `index_col='id'`：`id` 列提升为行标签；不指定则自动生成 0, 1, 2… 的索引。

---

## 四、缺失值处理

### 检测缺失值
- `df['age'].isnull()`：返回布尔 Series，`True` 表示缺失。
- `df[df['age'].isnull()]`：**布尔索引**，筛选出 age 为缺失的所有行。
- 时间戳列的缺失值标记为 `NaT`，数值列为 `NaN`。

### 填充缺失值：`fillna()`

| 用法 | 写法 |
|---|---|
| 固定值填充 | `fillna(0)` 或 `fillna({'A': 0, 'B': 1})` |
| 向前填充 | `fillna(method='ffill')` 或 `df.ffill()` |
| 向后填充 | `fillna(method='bfill')` 或 `df.bfill()` |
| 限制连续填充 | `fillna(method='ffill', limit=1)` |
| 按行方向填充 | `fillna(method='ffill', axis=1)` |
| 均值填充 | `fillna(df.mean()['C':'E'])` |

- `ffill()` 和 `bfill()` 是独立的 Pandas 方法，等价于 `fillna(method=...)` 的推荐写法。

---

## 五、数据操作与类型转换

### `df.insert()`
- `insert(loc=位置, column='列名', value=值)`
- 在**任意指定位置**插入一列（`df['新列'] = 值` 只能加到最右）。
- `loc` 是**位置编号**（不是标签）。

### `pd.Timestamp`
- Pandas 的单时间点标量，等效增强版 `datetime`。
- `pd.Timestamp('2017-10-1')` 创建时间戳，缺失时显示 `NaT`。

### `list('ABCDE')`
- 把字符串拆成单字符列表：`['A','B','C','D','E']`。
- 同类转换函数：`tuple()`、`set()`、`sorted()`、`np.array()`、`pd.Series()`。

### 可迭代对象
| 容器类 | 惰性/流式类 |
|---|---|
| `list`、`tuple`、`str`、`set`、`dict`、`range`、`bytes` | 生成器、文件对象、`enumerate`、`zip`、`map`、`filter` |

---

## 六、聚合与排序

### `groupby()` 分组聚合
```python
df.groupby('animal')['age'].mean()
```
- 三段式：**分组 → 选列 → 聚合**。
- 不选列则对所有数值列聚合；可一次计算多种统计量用 `.agg(['mean','max'])`。

### 排序方法

| 方法 | 依据 | 示例 |
|---|---|---|
| `sort_values()` | 按数据值 | `df.sort_values(['A', 'B'], ascending=[False, True])` |
| `sort_index()` | 按行/列索引 | `df.sort_index(axis=1)` |

- 多列排序是**逐级决胜**：先按第一列排，值相同时才用第二列。若第一列全部不重复，则第二列不会体现效果。

### 按行求平均
```python
df.mean(axis=1)   # 每行算一个均值
```
- `axis=0` = 沿行方向（按列汇总）；`axis=1` = 沿列方向（按行汇总）。

---

## 七、值映射

### `Series.map()` 和 `Series.replace()`

| | `map` | `replace` |
|---|---|---|
| 归属 | Pandas Series 方法 | Pandas Series/DataFrame 方法 |
| 未知值处理 | 变成 `NaN` | 原样保留 |
| 其他用法 | 可传函数做逐元素变换 | 主要用于值替换 |

- 两者都是 **Pandas 方法**，不是 NumPy 函数。`np.` 开头的才是 NumPy。

---

## 八、数据透视表：`pivot_table()`

```python
df.pivot_table(values='age', index='animal', columns='gender', aggfunc='mean')
```
- 用 `index`（行）和 `columns`（列）交叉出格子，用 `values` 字段按 `aggfunc` 聚合。
- `margins=True` 添加行/列总计。
- 与 `groupby()` 的区别：`pivot_table` 是二维交叉表，相当于 `groupby` 的二维升级版。

---

## 九、总结要点速记

| 维度 | 关键区分 |
|---|---|
| 选择 | `.loc`（标签）/ `.iloc`（位置） |
| 删除 | `labels` + `axis`（通用）/ `index` / `columns`（专用，禁混用） |
| 排序 | `sort_values`（按值）/ `sort_index`（按标签） |
| 缺失 | 检测 `isnull()` / 填充 `ffill()` `bfill()` |
| 聚合 | `groupby`（一维）/ `pivot_table`（二维交叉） |
| 映射 | `map`（未知值→NaN）/ `replace`（未知值→保留） |

