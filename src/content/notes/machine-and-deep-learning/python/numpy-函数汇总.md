---
title: "Numpy 函数汇总"
slug: "machine-and-deep-learning/python/numpy-函数汇总"
description: "以下是网页中 NumPy 函数的完整分类整理，每个函数后附带简短注释。"
publishDate: "2026-07-01"
createdAt: "2026-07-26T00:00:00Z"
updatedDate: "2026-08-14T01:36:05+08:00"
tags: ["machine-learning","python"]
series: ["Machine & Deep Learning","Python"]
---

以下是网页中 NumPy 函数的完整分类整理，每个函数后附带简短注释。

---

### **一、数组创建**

| 函数                | 注释                    |
| ----------------- | --------------------- |
| `np.array`        | 从列表或元组创建 ndarray 数组   |
| `np.arange`       | 在区间内创建均匀间隔的值，类似 range |
| `np.linspace`     | 在区间内返回等间隔的样本，可指定数量    |
| `np.ones`         | 创建全 1 数组              |
| `np.zeros`        | 创建全 0 数组              |
| `np.eye`          | 创建对角线为 1、其余为 0 的二维数组  |
| `np.frombuffer`   | 从缓冲区创建 1 维数组          |
| `np.fromfile`     | 从文本或二进制文件构建数组         |
| `np.fromfunction` | 通过函数返回值创建数组           |
| `np.fromiter`     | 从可迭代对象创建 1 维数组        |
| `np.fromstring`   | 从字符串创建 1 维数组          |

### **二、ndarray 属性**

| 属性 | 注释 |
|---|---|
| `ndarray.T` | 数组转置，等同于 `.transpose()` |
| `ndarray.dtype` | 数组元素的数据类型 |
| `ndarray.imag` | 数组元素的虚部 |
| `ndarray.real` | 数组元素的实部 |
| `ndarray.size` | 数组总元素个数 |
| `ndarray.itemsize` | 单个元素的字节数 |
| `ndarray.nbytes` | 数组总字节数 |
| `ndarray.ndim` | 数组维度数 |
| `ndarray.shape` | 数组形状元组 |
| `ndarray.strides` | 各维度步进的字节数 |

### **三、形状操作**

| 函数 | 注释 |
|---|---|
| `np.reshape` | 不改变数据，仅改变形状（返回副本） |
| `np.ravel` | 将数组扁平化为 1 维，支持行优先 / 列优先 |
| `np.resize` | 改变原数组尺寸（直接修改原数组） |
| `np.moveaxis` | 将指定轴移动到新位置 |
| `np.swapaxes` | 交换两个轴的位置 |
| `np.transpose` | 数组转置，高维可指定轴顺序 |

### **四、维度 / 类型转换**

| 函数 | 注释 |
|---|---|
| `np.atleast_1d` | 将输入至少视为 1 维数组 |
| `np.atleast_2d` | 将输入至少视为 2 维数组 |
| `np.atleast_3d` | 将输入至少视为 3 维数组 |
| `np.asarray` | 将输入转换为 ndarray 数组 |
| `np.asanyarray` | 将输入转换为 ndarray（或子类） |
| `np.asmatrix` | 将输入转换为矩阵类型 |
| `np.asfarray` | 将输入转换为 float 数组 |
| `np.asarray_chkfinite` | 转换数组并检查 NaN / inf |
| `np.asscalar` | 将大小为 1 的数组转为标量 |
| `.astype()` | ndarray 方法，转换数据类型 |

### **五、拼接与堆叠**

| 函数 | 注释 |
|---|---|
| `np.concatenate` | 沿指定轴连接多个数组 |
| `np.stack` | 沿新轴堆叠数组序列（增加维度） |
| `np.column_stack` | 将 1 维数组作为列堆叠成 2 维 |
| `np.hstack` | 水平（列方向）堆叠 |
| `np.vstack` | 垂直（行方向）堆叠 |
| `np.dstack` | 沿深度方向堆叠 |

### **六、拆分**

| 函数 | 注释 |
|---|---|
| `np.split` | 沿指定轴拆分为多个子数组 |
| `np.hsplit` | 水平方向拆分 |
| `np.vsplit` | 垂直方向拆分 |
| `np.dsplit` | 深度方向拆分 |

### **七、元素增删改**

| 函数 | 注释 |
|---|---|
| `np.delete` | 沿指定轴删除子数组 |
| `np.insert` | 沿指定轴在索引前插入值 |
| `np.append` | 将值附加到数组末尾，默认展平为 1 维 |

### **八、翻转**

| 函数 | 注释 |
|---|---|
| `np.fliplr` | 左右翻转数组（列镜像） |
| `np.flipud` | 上下翻转数组（行镜像） |

### **九、随机数（基础）**

| 函数 | 注释 |
|---|---|
| `np.random.rand` | [0,1) 均匀分布的随机浮点数 |
| `np.random.randn` | 标准正态分布的随机样本 |
| `np.random.randint` | [low, high) 区间随机整数 |
| `np.random.random_sample` | [0,1) 区间随机浮点数 |
| `np.random.random` | 同 random_sample |
| `np.random.ranf` | 同 random_sample |
| `np.random.sample` | 同 random_sample |
| `np.random.choice` | 从给定数组中随机抽样 |

### **十、概率密度分布（np.random 模块）**

| 函数 | 注释 |
|---|---|
| `beta` | Beta 分布 |
| `binomial` | 二项分布 |
| `chisquare` | 卡方分布 |
| `dirichlet` | Dirichlet 分布 |
| `exponential` | 指数分布 |
| `f` | F 分布 |
| `gamma` | Gamma 分布 |
| `geometric` | 几何分布 |
| `gumbel` | Gumbel 分布 |
| `hypergeometric` | 超几何分布 |
| `laplace` | 拉普拉斯双指数分布 |
| `logistic` | 逻辑分布 |
| `lognormal` | 对数正态分布 |
| `logseries` | 对数系列分布 |
| `multinomial` | 多项分布 |
| `multivariate_normal` | 多变量正态分布 |
| `negative_binomial` | 负二项分布 |
| `noncentral_chisquare` | 非中心卡方分布 |
| `noncentral_f` | 非中心 F 分布 |
| `normal` | 正态分布 |
| `pareto` | Pareto II / Lomax 分布 |
| `poisson` | 泊松分布 |
| `power` | [0,1] 内的功率分布 |
| `rayleigh` | 瑞利分布 |
| `standard_cauchy` | 标准 Cauchy 分布 |
| `standard_exponential` | 标准指数分布 |
| `standard_gamma` | 标准 Gamma 分布 |
| `standard_normal` | 标准正态分布 |
| `standard_t` | 标准学生 t 分布 |
| `triangular` | 三角分布 |
| `uniform` | 均匀分布 |
| `vonmises` | von Mises 分布 |
| `wald` | Wald / 反高斯分布 |
| `weibull` | 威布尔分布 |
| `zipf` | Zipf 分布 |

### **十一、三角函数**

| 函数 | 注释 |
|---|---|
| `np.sin` | 正弦 |
| `np.cos` | 余弦 |
| `np.tan` | 正切 |
| `np.arcsin` | 反正弦 |
| `np.arccos` | 反余弦 |
| `np.arctan` | 反正切 |
| `np.hypot` | 已知两直角边求斜边 |
| `np.degrees` | 弧度转角度 |
| `np.radians` | 角度转弧度 |
| `np.deg2rad` | 角度转弧度（同上） |
| `np.rad2deg` | 弧度转角度（同上） |

### **十二、双曲函数**

| 函数 | 注释 |
|---|---|
| `np.sinh` | 双曲正弦 |
| `np.cosh` | 双曲余弦 |
| `np.tanh` | 双曲正切 |
| `np.arcsinh` | 反双曲正弦 |
| `np.arccosh` | 反双曲余弦 |
| `np.arctanh` | 反双曲正切 |

### **十三、数值修约**

| 函数 | 注释 |
|---|---|
| `np.around` | 四舍五入到指定小数位 |
| `np.round_` | 同 around |
| `np.rint` | 修约到最近整数 |
| `np.fix` | 向 0 方向取整 |
| `np.floor` | 向下取整 |
| `np.ceil` | 向上取整 |
| `np.trunc` | 截断取整（同 fix） |

### **十四、求和、求积、差分**

| 函数 | 注释 |
|---|---|
| `np.sum` | 沿指定轴求和 |
| `np.prod` | 沿指定轴求乘积 |
| `np.nansum` | 求和，NaN 视为 0 |
| `np.nanprod` | 求乘积，NaN 视为 1 |
| `np.cumsum` | 累积求和 |
| `np.cumprod` | 累积求乘积 |
| `np.nancumsum` | 累积求和，NaN 视为 0 |
| `np.nancumprod` | 累积求乘积，NaN 视为 1 |
| `np.diff` | 第 n 个离散差分 |
| `np.ediff1d` | 相邻元素差 |
| `np.gradient` | N 维数组梯度 |
| `np.cross` | 两向量叉积 |
| `np.trapz` | 梯形法则积分 |

### **十五、指数与对数**

| 函数 | 注释 |
|---|---|
| `np.exp` | 计算 eˣ |
| `np.log` | 自然对数 ln |
| `np.log10` | 以 10 为底的对数 |
| `np.log2` | 以 2 为底的对数 |

### **十六、算术运算**

| 函数 | 注释 |
|---|---|
| `np.add` | 逐元素加法 |
| `np.subtract` | 逐元素减法 |
| `np.multiply` | 逐元素乘法 |
| `np.divide` | 逐元素除法 |
| `np.power` | 逐元素幂运算 |
| `np.reciprocal` | 逐元素取倒数 |
| `np.negative` | 逐元素取负数 |
| `np.fmod` | 逐元素取余（C 风格） |
| `np.mod` | 逐元素取余 |
| `np.remainder` | 逐元素取余 |
| `np.modf` | 分离整数部分和小数部分 |

### **十七、矩阵与向量积**

| 函数 | 注释 |
|---|---|
| `np.dot` | 两数组点积 |
| `np.vdot` | 两向量点积 |
| `np.inner` | 两数组内积 |
| `np.outer` | 两向量外积 |
| `np.matmul` | 矩阵乘积 |
| `np.tensordot` | 张量点积 |
| `np.kron` | Kronecker 乘积 |

### **十八、其他数学函数**

| 函数 | 注释 |
|---|---|
| `np.sqrt` | 平方根 |
| `np.cbrt` | 立方根 |
| `np.square` | 平方 |
| `np.absolute` | 绝对值（支持复数） |
| `np.fabs` | 绝对值（仅浮点） |
| `np.sign` | 符号函数 |
| `np.maximum` | 逐元素取两数组最大值 |
| `np.minimum` | 逐元素取两数组最小值 |
| `np.nan_to_num` | NaN 替换为 0 |
| `np.interp` | 一维线性插值 |
| `np.angle` | 复数的辐角 |
| `np.real` | 复数的实部 |
| `np.imag` | 复数的虚部 |
| `np.conj` | 共轭复数 |
| `np.convolve` | 一维线性卷积 |

### **十九、线性代数（np.linalg）**

| 函数 | 注释 |
|---|---|
| `linalg.cholesky` | Cholesky 分解 |
| `linalg.qr` | QR 分解 |
| `linalg.svd` | 奇异值分解 |
| `linalg.eig` | 特征值与特征向量 |
| `linalg.eigh` | Hermitian / 对称矩阵特征值 |
| `linalg.eigvals` | 仅特征值 |
| `linalg.eigvalsh` | Hermitian / 对称矩阵特征值 |
| `linalg.norm` | 矩阵或向量范数 |
| `linalg.cond` | 矩阵条件数 |
| `linalg.det` | 行列式 |
| `linalg.slogdet` | 行列式的符号与对数 |
| `linalg.matrix_rank` | 矩阵的秩 |
| `linalg.solve` | 求解线性方程组 |
| `linalg.tensorsolve` | 求解张量方程 |
| `linalg.lstsq` | 最小二乘解 |
| `linalg.inv` | 逆矩阵 |
| `linalg.pinv` | 伪逆矩阵（Moore-Penrose） |
| `linalg.tensorinv` | N 维数组的逆 |
| `np.trace` | 对角线元素之和 |

### **二十、排序**

| 函数 | 注释 |
|---|---|
| `np.sort` | 沿指定轴排序 |
| `np.lexsort` | 多键间接排序 |
| `np.argsort` | 返回排序后的索引 |
| `np.msort` | 沿第 1 轴排序 |
| `np.sort_complex` | 复数排序 |

### **二十一、搜索与计数**

| 函数 | 注释 |
|---|---|
| `np.argmax` | 最大值索引 |
| `np.nanargmax` | 最大值索引（忽略 NaN） |
| `np.argmin` | 最小值索引 |
| `np.nanargmin` | 最小值索引（忽略 NaN） |
| `np.argwhere` | 非 0 元素索引（按元素分组） |
| `np.nonzero` | 非 0 元素索引（按轴分组） |
| `np.flatnonzero` | 非 0 元素索引（展平后） |
| `np.where` | 按条件选择元素 |
| `np.searchsorted` | 查找元素应插入的索引位置 |
| `np.extract` | 提取满足条件的元素 |
| `np.count_nonzero` | 非 0 元素计数 |
# 二十二、常用常数
| 常数               | 写法                                        | 值（近似）      |
| ---------------- | ----------------------------------------- | ---------- |
| π                | `np.pi`                                   | 3.14159265 |
| e                | `np.e`                                    | 2.71828183 |
| γ                | `np.euler_gamma`                          | 0.57721566 |
| $\infty$         | `np.inf`                                  | —          |
| $NaN$            | `np.nan`                                  | —          |
| 新 NumPy 版本的无穷/非数 | `np.PINF`、`np.NINF`、`np.PZERO`、`np.NZERO` | —          |


