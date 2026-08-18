---
title: "Tensor & Numpy 函数对比"
slug: "machine-and-deep-learning/python/tensor-and-numpy-函数对比"
description: "Numpy 函数汇总 (/notes/machine and deep learning/python/numpy 函数汇总/)"
publishDate: "2026-08-17"
createdAt: "2026-08-17T15:33:31.672Z"
updatedDate: "2026-08-18T01:22:20+08:00"
tags: ["python","machine-learning","PyTorch"]
series: ["Machine & Deep Learning","Python"]
---

[Numpy 函数汇总](/notes/machine-and-deep-learning/python/numpy-函数汇总/)
### **一、数组创建**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.array` | `torch.tensor` / `torch.as_tensor` | `torch.tensor` 默认复制 Python 数据并推断类型；`torch.as_tensor` 尽量共享内存、不复制 |
| `np.arange` | `torch.arange` | 必须显式写 `start,end`（默认 step=1，dtype 默认 int 64） |
| `np.linspace` | `torch.linspace` | 用 `steps` 而非 `num`，可指定 `dtype` |
| `np.ones` | `torch.ones` | 另有 `torch.ones_like`、`torch.full` |
| `np.zeros` | `torch.zeros` | 另有 `torch.zeros_like`、`torch.empty` |
| `np.eye` | `torch.eye` | 参数一致 |
| `np.frombuffer` | `torch.frombuffer` | 从 Python buffer 创建 1 维 tensor，共享内存 |
| `np.fromfile` | — | 无直接对应；用 `torch.save` / `torch.load` 存取二进制 |
| `np.fromfunction` | — | 无内置；可 `torch.tensor([[f(i,j) for j in ...] for i in ...])` |
| `np.fromiter` | — | 无内置；可 `torch.tensor(list(it))` |
| `np.fromstring` | — | 无内置 |
| （`np.from_numpy`） | `torch.from_numpy` | NumPy→Tensor 零拷贝桥接，重点掌握 |

### **二、tensor 属性（对应 ndarray 属性）**

| ndarray | tensor | 备注 |
|---|---|---|
| `ndarray.T` | `tensor.T` | 2 维还可用 `tensor.t()`、`tensor.mT`（转置）、`tensor.mH`（共轭转置） |
| `ndarray.dtype` | `tensor.dtype` | torch 用 `torch.float32` 等，无字符串形式 |
| `ndarray.imag` | `tensor.imag` | 仅复数 tensor |
| `ndarray.real` | `tensor.real` | 仅复数 tensor |
| `ndarray.size` | `tensor.numel()` | `tensor.size` 在 torch 里已被 `shape` 取代 |
| `ndarray.itemsize` | `tensor.element_size()` | 单位字节 |
| `ndarray.nbytes` | `tensor.nbytes` | 属性，非方法 |
| `ndarray.ndim` | `tensor.ndim` / `tensor.dim()` | |
| `ndarray.shape` | `tensor.shape` / `tensor.size()` | `size()` 可传参取某维长度 |
| `ndarray.strides` | `tensor.stride()` | 元素级步进（非字节） |

### **三、形状操作**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.reshape` | `torch.reshape` / `tensor.reshape` | 返回视图或副本视情况而定；`tensor.view` 仅对连续内存有效 |
| `np.ravel` | `torch.ravel` / `tensor.ravel` | 另有 `torch.flatten`（从某维起压平） |
| `np.resize` | — | 无直接对应；`torch.resize_` 语义危险，不建议替代 |
| `np.moveaxis` | `torch.moveaxis` / `tensor.movedim` | |
| `np.swapaxes` | `torch.swapaxes` / `tensor.swapaxes` | |
| `np.transpose` | `torch.transpose` / `tensor.permute` | `permute` 一次性重排多轴，更常用 |
| （扩展） | `torch.squeeze` / `torch.unsqueeze` | 增减尺寸为 1 的维度 |
| （扩展） | `torch.tile` / `torch.repeat` / `torch.expand` | `repeat` 复制内存，`expand` 广播视图不占内存 |

### **四、维度 / 类型转换**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.atleast_1d` | `torch.atleast_1d` | |
| `np.atleast_2d` | `torch.atleast_2d` | |
| `np.atleast_3d` | `torch.atleast_3d` | |
| `np.asarray` | `torch.as_tensor` / `torch.from_numpy` | |
| `np.asanyarray` | `torch.as_tensor` | |
| `np.asmatrix` | — | torch 无 matrix 类型，`torch.mm` 只针对 2 维 |
| `np.asfarray` | `tensor.float()` / `tensor.to(torch.float)` | |
| `np.asarray_chkfinite` | — | 可用 `torch.isfinite(x).all()` 自行检查 |
| `np.asscalar` | `tensor.item()` | 仅 0 维 tensor 可用 |
| `.astype()` | `tensor.to(dtype)` / `tensor.type()` / `tensor.float()` 等 | `to` 最通用（可指 dtype/device） |

### **五、拼接与堆叠**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.concatenate` | `torch.cat` | |
| `np.stack` | `torch.stack` | |
| `np.column_stack` | `torch.column_stack` | |
| `np.hstack` | `torch.hstack` | |
| `np.vstack` | `torch.vstack` | |
| `np.dstack` | `torch.dstack` | |

### **六、拆分**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.split` | `torch.split` / `torch.tensor_split` | `torch.split` 按块大小拆，`tensor_split` 按数量拆；另有 `torch.chunk` |
| `np.hsplit` | `torch.hsplit` | |
| `np.vsplit` | `torch.vsplit` | |
| `np.dsplit` | `torch.dsplit` | |

### **七、元素增删改**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.delete` | — | 无内置；用索引/布尔掩码切片 `torch.cat((x[:i], x[i+1:]))` |
| `np.insert` | — | 无内置；用 `torch.cat((x[:i], val, x[i:]))` |
| `np.append` | `torch.cat((a, b))` | NumPy 默认展平为 1 维再拼；torch 沿轴拼接，不自动展平，需先 `torch.ravel` |

### **八、翻转**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.fliplr` | `torch.fliplr` | |
| `np.flipud` | `torch.flipud` | |
| （通用 `np.flip`） | `torch.flip` | 沿指定维度反序 |

### **九、随机数（基础）**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.random.rand` | `torch.rand` | [0,1) 均匀分布 |
| `np.random.randn` | `torch.randn` | 标准正态 |
| `np.random.randint` | `torch.randint` | 必须写 `low,high` 两个边界 |
| `np.random.random_sample` | `torch.rand` | 同 `torch.empty(...).uniform_()` |
| `np.random.random` | `torch.rand` | 同上 |
| `np.random.ranf` | `torch.rand` | 同上 |
| `np.random.sample` | `torch.rand` | 同上 |
| `np.random.choice` | `torch.multinomial` / `torch.randint` | 等概率可 `torch.randint`；带权重用 `torch.multinomial` |
| （`np.random.seed`） | `torch.manual_seed` | 另有 `torch.Generator` 手动管理 |

### **十、概率分布（`np.random` 模块 → `torch.distributions`）**

PyTorch 把分布采样统一封装到 `torch.distributions` 模块，实例化后调用 `.sample()`、`.log_prob()`。少数基础分布也保留了张量原地方法（`normal_`、`uniform_`、`cauchy_`、`exponential_`、`geometric_`、`log_normal_`、`bernoulli_`），更接近 `np.random` 的写法。

| NumPy (`np.random.*`) | PyTorch | 备注 |
|---|---|---|
| `beta` | `torch.distributions.Beta` | |
| `binomial` | `torch.distributions.Binomial` | |
| `chisquare` | `torch.distributions.Chi2` | |
| `dirichlet` | `torch.distributions.Dirichlet` | |
| `exponential` | `torch.distributions.Exponential` | 或 `x.exponential_()` |
| `f` | `torch.distributions.FisherSnedecor` | |
| `gamma` | `torch.distributions.Gamma` | |
| `geometric` | `torch.distributions.Geometric` | 或 `x.geometric_()` |
| `gumbel` | `torch.distributions.Gumbel` | |
| `hypergeometric` | — | 无内置 |
| `laplace` | `torch.distributions.Laplace` | |
| `logistic` | — | 无独立内置；可用 Sigmoid 变换 `torch.sigmoid(torch.randn(...))` |
| `lognormal` | `torch.distributions.LogNormal` | 或 `x.log_normal_()` |
| `logseries` | — | 无内置 |
| `multinomial` | `torch.distributions.Multinomial` | |
| `multivariate_normal` | `torch.distributions.MultivariateNormal` | 低秩场景有 `LowRankMultivariateNormal` |
| `negative_binomial` | `torch.distributions.NegativeBinomial` | |
| `noncentral_chisquare` | — | 无内置 |
| `noncentral_f` | — | 无内置 |
| `normal` | `torch.distributions.Normal` | 或 `x.normal_()` |
| `pareto` | `torch.distributions.Pareto` | |
| `poisson` | `torch.distributions.Poisson` | |
| `power` | — | 无内置 |
| `rayleigh` | — | 无内置 |
| `standard_cauchy` | `torch.distributions.Cauchy` | 或 `x.cauchy_()` |
| `standard_exponential` | `torch.distributions.Exponential` | |
| `standard_gamma` | `torch.distributions.Gamma` | |
| `standard_normal` | `torch.distributions.Normal(0,1)` | 等价 `torch.randn` |
| `standard_t` | `torch.distributions.StudentT` | |
| `triangular` | — | 无内置，可自行实现 |
| `uniform` | `torch.distributions.Uniform` | 或 `x.uniform_()` |
| `vonmises` | `torch.distributions.VonMises` | |
| `wald` | — | Wald（逆高斯）无内置 |
| `weibull` | `torch.distributions.Weibull` | |
| `zipf` | — | 无内置 |

### **十一、三角函数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.sin` | `torch.sin` | |
| `np.cos` | `torch.cos` | |
| `np.tan` | `torch.tan` | |
| `np.arcsin` | `torch.arcsin` | 另有 `torch.asin` 别名 |
| `np.arccos` | `torch.arccos` | 另有 `torch.acos` 别名 |
| `np.arctan` | `torch.arctan` | 另有 `torch.atan`、`torch.atan2` |
| `np.hypot` | `torch.hypot` | |
| `np.degrees` | `torch.rad2deg` | |
| `np.radians` | `torch.deg2rad` | |
| `np.deg2rad` | `torch.deg2rad` | |
| `np.rad2deg` | `torch.rad2deg` | |

### **十二、双曲函数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.sinh` | `torch.sinh` | |
| `np.cosh` | `torch.cosh` | |
| `np.tanh` | `torch.tanh` | |
| `np.arcsinh` | `torch.arcsinh` | |
| `np.arccosh` | `torch.arccosh` | |
| `np.arctanh` | `torch.arctanh` | |

### **十三、数值修约**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.around` | `torch.round` | torch 用四舍五入（半数取偶），与 `np.round` / `np.rint` 同行为 |
| `np.round_` | `torch.round` | 同上 |
| `np.rint` | `torch.round` | 同上 |
| `np.fix` | `torch.trunc` | |
| `np.floor` | `torch.floor` | |
| `np.ceil` | `torch.ceil` | |
| `np.trunc` | `torch.trunc` | 另有 `torch.frac` 取小数部分 |

### **十四、求和、求积、差分**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.sum` | `torch.sum` / `tensor.sum` | |
| `np.prod` | `torch.prod` | |
| `np.nansum` | `torch.nansum` | |
| `np.nanprod` | `torch.nanprod` | |
| `np.cumsum` | `torch.cumsum` | |
| `np.cumprod` | `torch.cumprod` | |
| `np.nancumsum` | `torch.nancumsum` | |
| `np.nancumprod` | — | 无内置 |
| `np.diff` | `torch.diff` | |
| `np.ediff1d` | `torch.diff` | 展平后等价 `torch.diff(torch.ravel(x))` |
| `np.gradient` | `torch.gradient` | |
| `np.cross` | `torch.cross` | |
| `np.trapz` | `torch.trapezoid` / `torch.trapz` | 新名 `torch.trapezoid` |

### **十五、指数与对数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.exp` | `torch.exp` | 另有 `torch.expm1` = $e^x-1$ |
| `np.log` | `torch.log` | 另有 `torch.log1p` = $\ln(1+x)$ |
| `np.log10` | `torch.log10` | |
| `np.log2` | `torch.log2` | |

### **十六、算术运算**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.add` | `torch.add` | 也可 `+` |
| `np.subtract` | `torch.subtract` | 也可 `-` |
| `np.multiply` | `torch.multiply` | 也可 `*` |
| `np.divide` | `torch.divide` | 也可 `/`；整数除法用 `torch.div(..., rounding_mode="trunc/floor")` |
| `np.power` | `torch.pow` | 也可 `**` |
| `np.reciprocal` | `torch.reciprocal` | |
| `np.negative` | `torch.negative` | 也可 `-x` |
| `np.fmod` | `torch.fmod` | C 风格，结果符号同被除数 |
| `np.mod` | `torch.remainder` | Python 风格，结果符号同除数；注意与 `np.fmod` 区分 |
| `np.remainder` | `torch.remainder` | 同上 |
| `np.modf` | `torch.modf` | 返回 `(fractional, integral)` 元组 |

### **十七、矩阵与向量积**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.dot` | `torch.dot`（1D）/ `torch.mm`（2D）/ `torch.matmul`（任意维） | `dot` 只支持 1 维向量 |
| `np.vdot` | `torch.vdot` | 1 维向量点积 |
| `np.inner` | `torch.inner` | |
| `np.outer` | `torch.outer` | |
| `np.matmul` | `torch.matmul` | 也可 `@` 运算符 |
| `np.tensordot` | `torch.tensordot` | |
| `np.kron` | `torch.kron` | |

### **十八、其他数学函数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.sqrt` | `torch.sqrt` | 另有 `torch.rsqrt` = $1/\sqrt{x}$ |
| `np.cbrt` | — | 无内置；可用 `torch.sign(x)*torch.abs(x).pow(1/3)` |
| `np.square` | `torch.square` | |
| `np.absolute` | `torch.abs` / `torch.absolute` | 支持复数 |
| `np.fabs` | `torch.abs` | torch 不分 float/int |
| `np.sign` | `torch.sign` / `torch.sgn` | `sgn` 对复数定义与 NumPy 更接近 |
| `np.maximum` | `torch.maximum` | 另有 `torch.max` 返回逐维最大 |
| `np.minimum` | `torch.minimum` | 另有 `torch.min` |
| `np.nan_to_num` | `torch.nan_to_num` | |
| `np.interp` | — | 无逐元素版本；对齐张量用 `torch.nn.functional.interpolate` |
| `np.angle` | `torch.angle` | 复数辐角 |
| `np.real` | `torch.real` | |
| `np.imag` | `torch.imag` | |
| `np.conj` | `torch.conj` | 另有 `torch.conj_physical` |
| `np.convolve` | `torch.nn.functional.conv1d` | 需 reshape 成 `(1,1,L)` 格式，注意翻转（可用 `torch.flip` 对齐语义） |

### **十九、线性代数（`np.linalg` → `torch.linalg`）**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `linalg.cholesky` | `torch.linalg.cholesky` | |
| `linalg.qr` | `torch.linalg.qr` | |
| `linalg.svd` | `torch.linalg.svd` | 默认只返回 `(U,S,Vh)` |
| `linalg.eig` | `torch.linalg.eig` | 返回 `(eigenvalues, eigenvectors)` 复数 tensor |
| `linalg.eigh` | `torch.linalg.eigh` | |
| `linalg.eigvals` | `torch.linalg.eigvals` | |
| `linalg.eigvalsh` | `torch.linalg.eigvalsh` | |
| `linalg.norm` | `torch.linalg.norm` / `torch.norm` | |
| `linalg.cond` | `torch.linalg.cond` | |
| `linalg.det` | `torch.linalg.det` | |
| `linalg.slogdet` | `torch.linalg.slogdet` | |
| `linalg.matrix_rank` | `torch.linalg.matrix_rank` | |
| `linalg.solve` | `torch.linalg.solve` | 另有 `torch.linalg.solve_triangular` |
| `linalg.tensorsolve` | `torch.linalg.tensorsolve` | |
| `linalg.lstsq` | `torch.linalg.lstsq` | |
| `linalg.inv` | `torch.linalg.inv` | |
| `linalg.pinv` | `torch.linalg.pinv` | Moore-Penrose 伪逆 |
| `linalg.tensorinv` | — | 无内置 |
| `np.trace` | `torch.trace` | 也可 `torch.diagonal(x).sum()` 取任意对角 |

### **二十、排序**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.sort` | `torch.sort` | torch 返回 `(values, indices)` 元组，NumPy 只返回值 |
| `np.lexsort` | — | 无内置多键间接排序 |
| `np.argsort` | `torch.argsort` | 另有 `torch.msort`（沿第 0 维排序的稳定版 `torch.sort(stable=True)`） |
| `np.msort` | `torch.sort(x, dim=0).values` / `torch.msort` | |
| `np.sort_complex` | — | 可自定义按 `(real, imag)` 键排序 |
| （扩展） | `torch.topk` / `torch.kthvalue` | 取前 k 大与第 k 小 |

### **二十一、搜索与计数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.argmax` | `torch.argmax` | |
| `np.nanargmax` | — | 可用 `torch.argmax(torch.where(torch.isnan(x), -inf, x))` 替代 |
| `np.argmin` | `torch.argmin` | |
| `np.nanargmin` | — | 同理用 `torch.where` + `torch.argmin` |
| `np.argwhere` | `torch.argwhere` | 返回 `(N, ndim)` 形状，直接就是按元素分组的索引 |
| `np.nonzero` | `torch.nonzero(as_tuple=True)` | 默认 `as_tuple=False` 返回 `(N, ndim)`；`as_tuple=True` 才和 NumPy 的对齐 |
| `np.flatnonzero` | `torch.nonzero(x.flatten()).squeeze(1)` | |
| `np.where` | `torch.where` | 三元条件用法一致；单参数时 `torch.where(cond)` 需 `as_tuple` 才等价 |
| `np.searchsorted` | `torch.searchsorted` | |
| `np.extract` | `x[mask]` | 用布尔索引直接取 |
| `np.count_nonzero` | `torch.count_nonzero` | |

### **二十二、常用常数**

| NumPy | PyTorch | 备注 |
|---|---|---|
| `np.pi` | `torch.pi` | |
| `np.e` | `torch.e` | |
| `np.euler_gamma` | — | torch 未内置欧拉常数，可用 NumPy 或 `scipy.special` |
| `np.inf` | `torch.inf` | 另有 `-torch.inf` |
| `np.nan` | `torch.nan` | |
| `np.PINF` / `np.NINF` | `torch.inf` / `-torch.inf` | torch 用符号表达 |
| `np.newaxis` | `torch.newaxis`（即 `None`）/ `torch.unsqueeze` | |
| `np.finfo` / `np.iinfo` | `torch.finfo` / `torch.iinfo` | 查询 dtype 的机器精度、数值范围 |

需要的话，我可以把这份对照直接整理成一份 Markdown 笔记文件（保留原文档的 YAML frontmatter 风格）导出给你。
