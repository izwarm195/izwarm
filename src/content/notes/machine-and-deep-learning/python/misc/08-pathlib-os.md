---
title: "Python 杂记 08 - pathlib 与 os"
slug: "machine-and-deep-learning/python/misc/08-pathlib-os"
description: "在现代 Python 开发中，两者的使用场景非常明确：优先使用 pathlib ，只有在特定特殊场景下才退回使用 os 。"
publishDate: "2026-09-16"
createdAt: "2026-09-16T00:00:00Z"
updatedDate: "2026-09-16T23:07:41"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","Python","Python 杂记"]
---

# `pathlib` & `os`

在现代 Python 开发中，两者的使用场景非常明确：优先使用 `pathlib`，只有在特定特殊场景下才退回使用 `os` 。
`pathlib` 是 Python 3.4 引入的面向对象路径库，用来全面替代 `os.path` 和 `os` 中的路径操作。

### 1. 核心对比

| **维度**             | **os / os.path**                     | **pathlib.Path**          |
| ------------------ | ------------------------------------ | ------------------------- |
| **编程范式**           | **面向字符串**（将路径视为普通的 `str` 字符串）        | **面向对象**（将路径视为 `Path` 对象） |
| **跨平台（Win/Linux）** | 需要手动处理斜杠 `\` 与 `/`（如 `os.path.join`） | **自动适配**（直接用 `/` 符号拼接路径）  |
| **可读性**            | 多层嵌套时代码较冗长、不直观                       | 链式调用，语义清晰                 |
|                    |                                      |                           |
### 2. 什么时候用 `pathlib`？（绝大多数日常开发）
只要涉及到**路径拼装、文件读写、创建/删除目录、获取文件后缀或文件名**等常规操作，都推荐使用 `pathlib`。

#### ① 路径拼接更直观

- ** `os` **：`os.path.join(base_dir, "checkpoints", "v1", "model.pt")`
- ** `pathlib` **：`Path(base_dir) / "checkpoints" / "v1" / "model.pt"` （用 `/` 运算符直观拼接）
#### ② 获取路径属性更简洁

- ** `os` **：
	```python
    folder = os.path.dirname(filepath)
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    ```

- ** `pathlib` **：
    ```python
    p = Path(filepath)
    folder = p.parent     # 父目录
    filename = p.name     # 带后缀的文件名
    stem = p.stem         # 纯文件名 (无后缀)
    ext = p.suffix        # 后缀 (.pt)
    ```

#### ③ 创建文件夹与遍历文件

- ** `os` **：
    ```python
    os.makedirs("checkpoints/v1", exist_ok=True)
    # 查找所有 .pt 文件
    import glob
    files = glob.glob("checkpoints/**/*.pt", recursive=True)
    ```

- ** `pathlib` **：
    ```python
    Path("checkpoints/v1").mkdir(parents=True, exist_ok=True)
    # 查找所有 .pt 文件
    files = list(Path("checkpoints").rglob("*.pt"))
    ```

### 3. 什么时候用 `os`？（特定场景）

虽然 `pathlib` 很方便，但在以下场景中仍然需要用 `os`：
1. **处理系统环境变量**

   `os.environ["CUDA_VISIBLE_DEVICES"] = "0"`（环境变量操作属于系统接口，只能用 `os`）。
2. **底层进程与系统调用**

   例如 `os.system()`、`os.walk()`（在大规模目录递归遍历时 `os.walk` 的速度通常略快于 `pathlib`）、`os.cpu_count()` 等。
3. **兼容非常老旧的第三方库或 C 扩展**

   极少数老的第三方库只接收 Python 纯字符串（`str`）作为路径，不认识 `Path` 对象（不过现代 PyTorch、TensorFlow、Pandas 等均已完美支持 `Path` 对象）。若遇到此类库，可以用 `str(path_obj)` 转换，或者直接用 `os`。

### 总结选择建议

- **默认首选**：写新的代码（如深度学习训练脚本、`Runner` 类、数据处理逻辑）时，**统一使用 `pathlib.Path` **。

- **次选退路**：只有在读取环境变量、调用系统级进程指令，或者维护旧项目代码时，才使用 `os`。

  在 Python 中，`pathlib.Path` 是面向对象处理文件路径的标准方式。相比传统的 `os.path`，它不仅跨平台兼容性好（自动处理 Windows 与 Linux 斜杠），而且代码更加直观简洁。

# `Path`

### 1. 创建与路径拼接

```Python
from pathlib import Path

# 创建 Path 对象
p = Path("checkpoints/v1/model.pt")
current_dir = Path.cwd()            # 获取当前工作目录
home_dir = Path.home()              # 获取用户主目录

# 路径拼接：直接使用 / 运算符（不再需要 os.path.join）
data_dir = Path("data")
file_path = data_dir / "processed" / "train.csv"
```

### 2. 提取路径属性（解析路径）

假设路径为 `p = Path("checkpoints/v1/best_model.pt")`：

|**属性 / 方法**|**返回结果**|**说明**|
|---|---|---|
|** `p.parent` **| `Path("checkpoints/v1")` |父目录|
|** `p.parents[1]` **| `Path("checkpoints")` |祖先目录（按层级索引）|
|** `p.name` **| `"best_model.pt"` |完整文件名（带后缀）|
|** `p.stem` **| `"best_model"` |纯文件名（不带后缀）|
|** `p.suffix` **| `".pt"` |文件后缀名|
|** `p.suffixes` **| `[".tar", ".gz"]` |多重后缀名列表（如 `.tar.gz`）|
|** `p.is_absolute()` **| `False` |是否为绝对路径|

### 3. 文件与目录操作

#### ① 创建目录与删除

```Python
dir_path = Path("checkpoints/v1")

# 创建文件夹（parents=True 自动建多级目录，exist_ok=True 目录存在时不报错）
dir_path.mkdir(parents=True, exist_ok=True)

# 删除空目录 / 删除文件
dir_path.rmdir()       # 只能删空文件夹
file_path.unlink(missing_ok=True) # 删除文件（missing_ok 存在才删，不报错）
```

#### ② 判断与检查

```Python
p = Path("data/train.csv")

p.exists()      # 文件或目录是否存在 (True/False)
p.is_file()     # 是否是文件
p.is_dir()      # 是否是目录
```

### 4. 遍历与文件查找

```Python
folder = Path("checkpoints")

# 1. 遍历当前目录下的所有子文件/文件夹
for child in folder.iterdir():
    print(child)

# 2. 查找当前目录下特定后缀的文件 (不递归)
pt_files = list(folder.glob("*.pt"))

# 3. 递归查找所有子目录下的特定文件 (包含深层文件夹)
all_pt_files = list(folder.rglob("*.pt"))  # 等价于 folder.glob("**/*.pt")
```

### 5. 快速读写文件

对于轻量文本或字节文件，不需要写 `with open(...)` 即可快速完成读写：

```Python
p = Path("notes.txt")

# 写数据
p.write_text("Hello PyTorch!", encoding="utf-8")

# 读数据
content = p.read_text(encoding="utf-8")
```

### 6. 类型转换（与旧库兼容）

极少数老的第三方库只接收 `str` 类型的路径，可以直接将 `Path` 转为 `str`：

```Python
path_obj = Path("checkpoints/model.pt")

# 转为纯字符串
path_str = str(path_obj)
```
