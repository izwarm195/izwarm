---
title: "Numpy, Scipy 复数总结"
slug: "machine-and-deep-learning/python/numpy-scipy-复数总结"
description: "NumPy 和 SciPy 原生支持复数， complex64 、 complex128 就是复数类型。"
publishDate: "2026-08-13"
createdAt: "2026-08-13T06:56:48.107Z"
updatedDate: "2026-09-03T19:12:16+08:00"
tags: ["python","machine-learning","signals","audio"]
series: ["Machine & Deep Learning","Python"]
---

### NumPy 与 SciPy 的复数运算

NumPy 和 SciPy 原生支持复数，`complex64`、`complex128` 就是复数类型。

---

### 一、复数的基本表示

```python
import numpy as np

# 两种写法
z = 1 + 2j          # Python 原生复数
z = np.complex128(1 + 2j)   # NumPy 复数

# 复数数组
z = np.array([1 + 2j, 3 - 4j, 5 + 0j])
z.dtype           # dtype('complex128')
```

---

### 二、复数属性与常用函数

```python
z = np.array([1 + 2j, 3 - 4j])

z.real            # 实部 [1, 3]
z.imag            # 虚部 [2, -4]
z.conj()          # 共轭 [1-2j, 3+4j]
np.conjugate(z)   # 同上
np.angle(z)       # 幅角（相位）
np.abs(z)         # 模长，等于 sqrt(re² + im²)
```

模长示例：

```python
np.abs(3 + 4j)    # → 5.0
```

---

### 三、复数运算

```python
a = 1 + 2j
b = 3 - 4j

a + b             # (4-2j)
a - b
a * b             # (11+2j)
a / b             # 复数除法
```

注意：**复数的"大小"比较没有定义**，不能像实数那样排序：

```python
np.array([1+2j, 3-4j]).max()   # 报错，复数无法比较大小
np.array([1+2j, 3-4j]).real    # 但可以比较实部或模长
```

---

### 四、NumPy 特定复数函数

```python
np.sqrt(-1 + 0j)          # → 1j（复数开方）

# 对实数数组返回复数结果
np.emath.sqrt(np.array([-1.0, 4.0]))   # → [1j, 2]
# np.sqrt 会对负数返回 nan，emath.sqrt 则返回复数
```

`np.emath` 专门处理这类"实数输入、复数输出"的场景。

---

### 五、复数矩阵与线性代数

```python
A = np.array([[1+1j, 2], [3, 4-1j]])

np.linalg.det(A)        # 行列式
np.linalg.inv(A)        # 逆矩阵
np.linalg.eig(A)        # 特征值（可能为复数）
np.linalg.svd(A)        # 奇异值分解
```

**共轭转置**（量子力学、信号处理常用）：

```python
A.conj().T            # 共轭转置，记作 A^H
```

或：

```python
A.conjugate().T
```

---

### 六、SciPy 中的复数应用

SciPy 扩展了更多复数相关的科学计算：

```python
from scipy import linalg, fft, signal
```

**1. 复数线性代数（scipy.linalg）**

```python
from scipy.linalg import solve, eigvals, expm

A = np.array([[1+1j, 2], [3, 4-1j]])
b = np.array([1+1j, 2-1j])
x = solve(A, b)        # 解复数线性方程组
eigvals(A)             # 特征值
expm(A)                # 矩阵指数
```

SciPy 的 `linalg` 还支持 `sqrtm`（矩阵平方根）、`logm`、`sinm` 等复矩阵函数，比 NumPy 的 `linalg` 更丰富。

**2. 傅里叶变换（scipy.fft）**

```python
from scipy.fft import fft, ifft

t = np.linspace(0, 1, 500, endpoint=False)
x = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*20*t)

X = fft(x)        # 复数频谱
freqs = np.fft.fftfreq(len(x), d=1/500)

magnitude = np.abs(X)    # 幅度谱
phase = np.angle(X)      # 相位谱
X_recovered = ifft(X)    # 逆变换还原
```

FFT 输出天然是复数，这是复数在 SciPy 中最常见的应用之一。

**3. 信号处理（scipy.signal）**

```python
from scipy.signal import hilbert, freqz

z = hilbert(x)           # 希尔伯特变换，得到解析信号（复数）
envelope = np.abs(z)     # 包络
```

---

### 七、复数常见陷阱

**陷阱 1：`0j` 的作用**

```python
np.sqrt(-1)      # → nan（实数域报 warning）
np.sqrt(-1 + 0j) # → 1j（复数域正确）
```

只要带上 `+0j`，NumPy 就按复数规则计算。

**陷阱 2：比较要用模长或实部**

```python
z = np.array([1+2j, 3-4j])

# 找模长最大的元素
z[np.argmax(np.abs(z))]     # → (3-4j)，模长 5
```

**陷阱 3：`np.abs` 不是 `abs` 的别名**

两者都能用，但 `np.abs` 对数组向量化，Python 内置 `abs` 对复数数组会报错：

```python
abs(np.array([1+2j, 3-4j]))   # ❌ 报错
np.abs(np.array([1+2j, 3-4j])) # ✅
```

---
###  八、 `np.emath`：面向"实数输入、复数输出"的数学函数模块

`emath` 全称 extended math（扩展数学），它提供的一组函数，在普通数学函数对实数域会产生 `nan` 或报错的地方，规范地返回复数结果。

标准 `np.sqrt` 对负数返回 `nan`：

```python
import numpy as np

np.sqrt(-1)       # → nan，并触发 RuntimeWarning
np.sqrt(np.array([-1.0, 4.0]))   # → [nan, 2.]
```

`np.emath.sqrt` 则返回复数：

```python
np.emath.sqrt(-1)                          # → 1j
np.emath.sqrt(np.array([-1.0, 4.0]))       # → [0.+1.j, 2.+0.j]
```

#### 函数

`emath` 复用了 `np.lib.scimath` 里面的函数，主要覆盖那些"定义域有限制"的运算：

| 函数 | 作用 | 定义域受限点 |
|---|---|---|
| `sqrt` | 平方根 | 负数 |
| `log` | 自然对数 | 负数、0 |
| `log2` | 以 2 为底对数 | 负数、0 |
| `log10` | 以 10 为底对数 | 负数、0 |
| `logn` | 以 n 为底对数 | 负数、0 |
| `log1p` | log(1+x) | x < -1 |
| `arccos` | 反余弦 | 超出 [-1, 1] |
| `arcsin` | 反正弦 | 超出 [-1, 1] |
| `arctanh` | 反双曲正切 | 超出 [-1, 1] |
| `power` | 幂运算 | 负数底数、分数指数等 |

---

#### 典型例子

**对数**

```python
np.log(-1)          # → nan（警告）
np.emath.log(-1)    # → 3.14159265...j  （即 ln(-1) = iπ）
```

**反三角函数超出定义域**

```python
np.arcsin(2.0)          # → nan
np.emath.arcsin(2.0)    # → (1.57079633+1.3169579j)
```

**幂运算**

```python
np.emath.power(-1, 0.5)   # → 6.12e-17 + 1j（约等于 1j，-1 的平方根）
```

---

#### `np.lib.scimath`

`np.emath` 本质上是 `np.lib.scimath` 的一个更友好的入口别名，两者内容基本一致：

```python
np.emath.sqrt
np.lib.scimath.sqrt
# 是同一个底层函数
```

日常用 `np.emath` 这个更短、更直觉的名字即可。

