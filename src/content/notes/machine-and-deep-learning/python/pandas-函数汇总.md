---
title: "Pandas 函数汇总"
slug: "machine-and-deep-learning/python/pandas-函数汇总"
description: "函数 释义"
publishDate: "2026-08-05"
updatedDate: "2026-08-05"
tags: ["python","Pandas","machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

# Pandas 函数速查表 — 基于网页第 92 章与对话内容

---

## 一、数据结构与创建

| 函数 | 释义 |
|---|---|
| `pd.Series(data, index)` | 创建一维数组，可指定数据和索引 |
| `pd.DataFrame(data, index, columns)` | 创建二维表格，可指定数据、行索引和列名 |
| `pd.Timestamp('2017-10-1')` | 创建单个时间戳标量，替代 datetime，缺失时显示 `NaT` |
| `pd.read_csv(url_or_path, index_col)` | 从 CSV 文件或 URL 读取数据为 DataFrame；`index_col` 指定某列做行索引 |
| `list('ABCDE')` | Python 内置函数，把字符串拆成单字符列表，常用于速成列名 |
| `np.random.rand(rows, cols)` | NumPy 函数，生成指定形状的随机浮点数数组 |
| `np.random.randint(n, size=shape)` | NumPy 函数，生成指定形状的随机整数数组 |

---

## 二、数据查看与概览

| 函数 | 释义 |
|---|---|
| `df.head(n)` | 预览前 n 行数据（默认 5） |
| `df.tail(n)` | 预览后 n 行数据 |
| `df.describe()` | 输出各数值列的计数、均值、标准差、最值等统计概览 |
| `df.index` | 获取行索引（标签） |
| `df.columns` | 获取列名（列标签） |
| `df.shape` | 获取 DataFrame 的形状（行数, 列数） |
| `df.values` | 将 DataFrame 转换为 NumPy 二维数组 |
| `type(obj)` | Python 内置函数，查看对象的类型 |

---

## 三、数据选择与索引

| 函数 | 释义 |
|---|---|
| `df.iloc[行位置, 列位置]` | 基于**整数位置**选择数据（切片左闭右开），`:` 表示全部 |
| `df.loc[行标签, 列标签]` | 基于**标签**选择数据（切片左闭右闭），`:` 表示全部 |
| `df['列名']` | 按列名快速取单列（等价于 `df.loc[:, '列名']`） |
| `df'列1', '列2'` | 按列名列表取多列 |
| `df[布尔Series]` | 布尔索引：传入等长的布尔 Series，筛选对应 `True` 的行 |

---

## 四、数据删除

| 函数 | 释义 |
|---|---|
| `df.drop(labels, axis)` | 按标签删除行（`axis=0`，默认）或列（`axis=1`）；`labels` + `axis` 是通用写法 |
| `df.drop(index=标签)` | 删除指定标签的**行**（自带方向的快捷写法，不能与 `axis` 混用） |
| `df.drop(columns=标签)` | 删除指定标签的**列**（自带方向的快捷写法，不能与 `axis` 混用） |
| `df.drop_duplicates(subset, keep)` | 去重：按指定列去重，`keep='last'` 保留最后一次出现的行 |
| `df.dropna()` | 删除包含缺失值（`NaN`）的行或列 |

---

## 五、缺失值检测

| 函数 | 释义 |
|---|---|
| `df.isna()` | 逐元素判断是否为缺失值，返回布尔 DataFrame（`True` = 缺失） |
| `df.isnull()` | `isna()` 的别名，功能完全相同 |
| `df.notna()` | `isna()` 的反向判断（`True` = 非缺失） |

---

## 六、缺失值填充

| 函数 | 释义 |
|---|---|
| `df.fillna(value)` | 用标量、字典或 Series 填充所有缺失值 |
| `df.fillna(method='ffill')` | 用**前一个**有效值填充（向前填充） |
| `df.fillna(method='bfill')` | 用**后一个**有效值填充（向后填充） |
| `df.fillna(method='ffill', axis=1)` | 沿列方向（左右）向前填充，用同行左边值填右边 |
| `df.fillna(method='ffill', limit=n)` | 限制最多连续填充 n 个缺失值 |
| `df.ffill(limit, axis)` | `fillna(method='ffill')` 的独立方法（推荐写法） |
| `df.bfill(limit, axis)` | `fillna(method='bfill')` 的独立方法（推荐写法） |
| `df.fillna(df.mean())` | 用各列平均值填充缺失值 |

---

## 七、插值填充

| 函数 | 释义 |
|---|---|
| `df.interpolate()` | 线性插值填充缺失值，默认按数据趋势平滑填充 |
| `df.interpolate(method='quadratic')` | 二次插值，适合增长速率不断加快的数据 |
| `df.interpolate(method='pchip')` | 分段三次 Hermite 插值，适合累计分布型数据 |
| `df.interpolate(method='akima')` | Akima 插值，适合平滑绘图（需 Scipy） |

---

## 八、列操作

| 函数 | 释义 |
|---|---|
| `df.insert(loc, column, value)` | 在 DataFrame 指定**位置**插入一列；`loc` 是位置编号不是标签 |

---

## 九、分组聚合

| 函数 | 释义 |
|---|---|
| `df.groupby('列名')` | 按指定列分组，返回 GroupBy 对象 |
| `.mean()` | 求平均值（可用于 GroupBy 或直接用于 DataFrame） |
| `.sum()` | 求和 |
| `.count()` | 计数（非缺失值个数） |
| `.max()` / `.min()` | 最大值 / 最小值 |
| `.median()` | 中位数 |
| `.std()` | 标准差 |
| `.agg([函数1, 函数2])` | 一次计算多个统计量，如 `.agg(['mean','max'])` |
| `df.mean(axis=1)` | 按**行**求平均（`axis=1`），默认 `axis=0` 是按列 |

---

## 十、排序

| 函数 | 释义 |
|---|---|
| `df.sort_values(by, ascending)` | 按某列（或多列）的**数据值**排序；多列时为逐级决胜（先第一列，相同时再用第二列） |
| `df.sort_index(axis, ascending)` | 按行索引（`axis=0`）或列名（`axis=1`）排序 |

---

## 十一、数据透视

| 函数 | 释义 |
|---|---|
| `df.pivot_table(values, index, columns, aggfunc, fill_value, margins)` | 创建二维交叉透视表；`index` 为行分组，`columns` 为列分组，`values` 为聚合对象，`aggfunc` 默认 `'mean'`，`margins=True` 添加总计行列 |

---

## 十二、值映射与替换

| 函数 | 释义 |
|---|---|
| `Series.map(字典或函数)` | Pandas（非 NumPy）方法，将每个元素按映射关系转换；字典中不存在的 key → `NaN` |
| `Series.replace(字典)` | Pandas（非 NumPy）方法，按映射关系替换值；字典中不存在的值 → 原样保留 |

---

## 十三、数据可视化

| 函数 | 释义 |
|---|---|
| `df.plot()` | 调用 Matplotlib 绘制线形图 |
| `df.plot(kind='bar')` | 绘制柱状图 |
| `df.plot(kind='hist')` | 绘制直方图（可指定 `kind` 切换图形样式） |

---

## 十四、轴参数速记

| 参数 | 含义 | 适用场景 |
|---|---|---|
| `axis=0` | 沿行方向操作（对每列运算 / 删行 / 上下方向填充） | `drop`、`mean`、`fillna` 的默认值 |
| `axis=1` | 沿列方向操作（对每行运算 / 删列 / 左右方向填充） | 需要显式指定，不可省略 |

