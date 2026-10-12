---
title: "Python 杂记 VIII - Path类常用方法"
slug: "machine-and-deep-learning/python/python-misc-viii-path"
description: "下面以 Python 的 pathlib.Path 为例。它是面向对象的路径操作类，比 os.path 更直观。"
publishDate: "2026-10-11"
createdAt: "2026-10-11T00:00:00Z"
updatedDate: "2026-10-11T20:49:25"
tags: ["python","machine-learning"]
series: ["Machine & Deep Learning","Python"]
---

下面以 **Python 的 `pathlib.Path` ** 为例。它是面向对象的路径操作类，比 `os.path` 更直观。

```python
from pathlib import Path
```

## 1. 创建与拼接

```python
p = Path("data") / "a.txt"          # data/a.txt
p = Path("data", "sub", "a.txt")    # data/sub/a.txt
p = Path("data").joinpath("a.txt")  # data/a.txt

Path.cwd()      # 当前工作目录
Path.home()     # 用户主目录
```

`Path` 对象不可变，拼接、改名等都会返回新的 `Path`。

## 2. 路径属性

```python
p = Path("/tmp/data/archive.tar.gz")

p.name       # 'archive.tar.gz'
p.stem       # 'archive.tar'
p.suffix     # '.gz'
p.suffixes   # ['.tar', '.gz']
p.parent     # Path('/tmp/data')
p.parents    # 所有父目录的序列
p.parts      # ('/', 'tmp', 'data', 'archive.tar.gz')
p.anchor     # '/'
p.drive      # ''
p.root       # '/'
```

## 3. 路径转换与解析

```python
p.resolve()                 # 转为绝对路径，解析符号链接和 ..
p.absolute()                # 转为绝对路径
p.expanduser()              # 展开 ~
p.as_posix()                # 转为 POSIX 风格字符串
p.as_uri()                  # 转为 file:// URI
p.relative_to("/tmp")       # 相对于某个路径
p.is_relative_to("/tmp")    # 是否位于某个路径下，Python 3.9+
p.with_name("b.txt")        # 替换文件名
p.with_suffix(".md")        # 替换后缀
p.with_stem("new")          # 替换 stem，Python 3.9+
```

## 4. 判断方法

```python
p.exists()          # 是否存在
p.is_file()         # 是否是文件
p.is_dir()          # 是否是目录
p.is_symlink()      # 是否是符号链接
p.is_absolute()     # 是否是绝对路径
p.is_mount()        # 是否是挂载点，Python 3.7+
p.match("*.txt")    # 是否匹配通配符
p.samefile(other)   # 是否指向同一个文件
```

## 5. 读写文件

```python
p.read_text(encoding="utf-8")
p.read_bytes()

p.write_text("hello", encoding="utf-8")
p.write_bytes(b"hello")

with p.open("r", encoding="utf-8") as f:
    content = f.read()
```

## 6. 文件操作

```python
p.touch()                 # 创建空文件或更新时间
p.unlink()                # 删除文件
p.unlink(missing_ok=True) # 不存在也不报错，Python 3.8+
p.rename("new.txt")       # 重命名，返回新 Path
p.replace("new.txt")      # 替换目标
p.chmod(0o644)            # 修改权限
p.stat()                  # 文件状态
p.lstat()                 # 不跟随符号链接的状态
p.symlink_to(target)      # 创建符号链接
p.readlink()              # 读取符号链接指向
```

## 7. 目录操作

```python
d = Path("mydir")

d.mkdir(parents=True, exist_ok=True)  # 创建目录
d.rmdir()                             # 删除空目录
list(d.iterdir())                     # 遍历目录内容
list(d.glob("*.py"))                  # 当前目录匹配
list(d.rglob("*.py"))                 # 递归匹配
```

Python 3.12+ 还支持：

```python
for root, dirs, files in Path(".").walk():
    print(root, dirs, files)
```

## 8. 常见示例

```python
from pathlib import Path

base = Path("output")
base.mkdir(parents=True, exist_ok=True)

file = base / "hello.txt"
file.write_text("你好", encoding="utf-8")

print(file.exists())        # True
print(file.read_text(encoding="utf-8"))
print(file.suffix)          # .txt
print(file.resolve())       # 绝对路径

for f in base.glob("*.txt"):
    print(f.name)
```

## 9. 常用方法速查表

| 功能 | 常用方法 |
|---|---|
| 拼接 | `/`、`joinpath()` |
| 属性 | `name`、`stem`、`suffix`、`parent`、`parts` |
| 转换 | `resolve()`、`absolute()`、`as_posix()`、`as_uri()` |
| 判断 | `exists()`、`is_file()`、`is_dir()`、`is_symlink()` |
| 读写 | `read_text()`、`read_bytes()`、`write_text()`、`write_bytes()`、`open()` |
| 文件 | `touch()`、`unlink()`、`rename()`、`replace()`、`stat()` |
| 目录 | `mkdir()`、`rmdir()`、`iterdir()`、`glob()`、`rglob()` |
| 路径修改 | `with_name()`、`with_suffix()`、`relative_to()` |
| 系统路径 | `Path.cwd()`、`Path.home()` |

如果你指的是 **Java NIO 的 `java.nio.file.Path` **，它的常用方法则包括 `Paths.get()`、`resolve()`、`relativize()`、`normalize()`、`toAbsolutePath()`、`getFileName()`、`getParent()`、`startsWith()`、`endsWith()` 等。
