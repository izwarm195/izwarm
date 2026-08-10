---
title: "cstdlib"
slug: "cpp/summaries/cstdlib"
description: "<cstdlib 中的内容 和 <stdlib.h 几乎完全相同，区别在于前者把符号包装进了 std:: 命名空间（不过大多数实现也同时在全局命名空间中提供它们）。新代码里应该优先用 <cstdlib 加 std:: 前缀。"
publishDate: "2026-07-10"
updatedDate: "2026-07-10"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

### `<cstdlib>` 是 C 标准库 `<stdlib.h>` 的 C++ 版本，提供了大量通用的工具函数——从内存管理、类型转换到随机数、排序和环境交互。它和 C++ 标准库的其他部分（如 `<iostream>`）一样被广泛使用。

---

## 头文件本质

```cpp
#include <cstdlib>   // C++ 风格：所有符号放在 std 命名空间下
#include <stdlib.h>  // C 风格：所有符号放在全局命名空间
```

`<cstdlib>` 中的内容**和** `<stdlib.h>` 几乎完全相同，区别在于前者把符号包装进了 `std::` 命名空间（不过大多数实现也同时在全局命名空间中提供它们）。新代码里应该优先用 `<cstdlib>` 加 `std::` 前缀。

---

## 分类概览

### 一、内存管理（C 风格）

C++ 有自己的 `new` / `delete`，但在与 C 接口交互或实现底层容器时，这些函数仍然会出现：

| 函数 | 作用 |
|------|------|
| `std::malloc(size)` | 分配 `size` 字节的未初始化内存，返回 `void*` |
| `std::calloc(n, size)` | 分配 `n * size` 字节，**初始化为 0** |
| `std::realloc(ptr, size)` | 调整已分配内存块的大小 |
| `std::free(ptr)` | 释放 `malloc`/`calloc`/`realloc` 分配的内存 |

```cpp
#include <cstdlib>

int* arr = static_cast<int*>(std::malloc(5 * sizeof(int)));
// 使用 arr...
std::free(arr);
```

注意：不要混用 `malloc` / `free` 与 `new` / `delete`。

---

### 二、数值转换

这是日常编程中最常用的功能——C 风格字符串与数值之间的转换：

| 函数 | 作用 |
|------|------|
| `std::atoi(str)` | 字符串 → `int`（无错误检测） |
| `std::atol(str)` | 字符串 → `long` |
| `std::atoll(str)` | 字符串 → `long long` |
| `std::atof(str)` | 字符串 → `double` |
| `std::strtol(str, &end, base)` | 字符串 → `long`，带回特殊符号检测和基数指定 |
| `std::strtoll(str, &end, base)` | 字符串 → `long long` |
| `std::strtoul(str, &end, base)` | 字符串 → `unsigned long` |
| `std::strtoull(str, &end, base)` | 字符串 → `unsigned long long` |
| `std::strtof / strtod / strtold` | 字符串 → `float` / `double` / `long double` |

`atoi` 系列简单但安全性差（输入 `"abc"` 返回 0 且无法区分错误），`strto*` 可以通过第二个参数判断转换是否成功。另外，C++11 提供了更现代的 `std::stoi` / `std::stod` 系列（在 `<string>` 中），通常优先用它们。

---

### 三、随机数生成（不推荐继续使用）

| 函数 | 作用 |
|------|------|
| `std::rand()` | 返回 `[0, RAND_MAX]` 之间的伪随机整数 |
| `std::srand(seed)` | 设置随机种子 |

虽然随处可见，但 `std::rand()` 在现代 C++ 中**不推荐使用**，原因：模运算引入偏差、周期短、跨平台一致性差。C++11 引入了 `<random>` 库，提供了 `std::mt19937`、`std::uniform_int_distribution` 等高质量替代品。

```cpp
#include <random>
#include <iostream>

std::mt19937 rng(std::random_device{}());
std::uniform_int_distribution<int> dist(1, 6);
std::cout << dist(rng);   // 现代写法
```

---

### 四、整数算术函数（C++11 / C++17 扩展）

从 C++11 开始，`<cstdlib>` 还提供了一些有用的整数运算函数。它们被放在 `std` 命名空间中：

| 函数 | 作用 | 引入版本 |
|------|------|----------|
| `std::abs(int)` | 整数绝对值 | C++11 |
| `std::labs(long)` | `long` 绝对值 | C++11 |
| `std::llabs(long long)` | `long long` 绝对值 | C++11 |
| `std::div(int, int)` | 同时返回商和余数，存于 `std::div_t` | C++11 |
| `std::ldiv(long, long)` | 返回 `std::ldiv_t` | C++11 |
| `std::lldiv(long long, long long)` | 返回 `std::lldiv_t` | C++11 |
| `std::size_t`、`std::div_t`、`std::ldiv_t`、`std::lldiv_t` | 配套类型 | — |

这里就涉及之前我们反复提到的那个问题：用 `std::abs` 取 `long long` 的绝对值时，务必显式 `std::` 作用域或者直接用 `std::llabs`，避免重载解析落到 C 的老 `abs(int)` 上把值截断。

```cpp
long long x = -3000000000LL;
auto a = std::llabs(x);    // 明确，无误
auto b = std::abs(x);      // 在 C++ 中 OK（有重载），但要确定 #include <cstdlib>
```

`std::div` 示例——一次运算同时拿到商和余数：

```cpp
auto result = std::div(17, 5);
// result.quot = 3
// result.rem  = 2
```

---

### 五、程序控制与系统交互

| 函数 | 作用 |
|------|------|
| `std::system(cmd)` | 调用操作系统命令行 |
| `std::exit(status)` | 正常终止程序，会调用静态对象的析构函数和 `atexit` 注册的回调 |
| `std::_Exit(status)` (C++11) / `std::_exit(status)` | 立即终止，**不**执行清理 |
| `std::abort()` | 异常终止（发送 `SIGABRT`），不清理 |
| `std::atexit(func)` | 注册一个在 `exit` 时回调的函数 |
| `std::at_quick_exit(func)` (C++11) | 注册一个在 `quick_exit` 时回调的函数 |
| `std::quick_exit(status)` (C++11) | 快速退出，执行 `at_quick_exit` 注册的回调但不执行静态析构 |
| `std::getenv(name)` | 获取环境变量的值，返回 `char*` |

```cpp
#include <cstdlib>
#include <iostream>

void cleanup() {
    std::cout << "Cleaning up...
";
}

std::atexit(cleanup);
std::exit(0);    // 会打印 "Cleaning up..."
// std::abort(); // 不会
```

---

### 六、排序与搜索（`std::qsort` / `std::bsearch`）

```cpp
void std::qsort(void* base, std::size_t n, std::size_t size,
                int (*cmp)(const void*, const void*));

void* std::bsearch(const void* key, const void* base,
                   std::size_t n, std::size_t size,
                   int (*cmp)(const void*, const void*));
```

但别用它们。C++ 的 `std::sort`（`<algorithm>`）是类型安全的，且通常更快，因为编译器可以对比较函数内联优化，而 `qsort` 的回调是通过函数指针的间接调用。

---

### 七、杂项常量与类型

| 符号 | 含义 |
|------|------|
| `EXIT_SUCCESS` | 程序成功退出码（通常是 0） |
| `EXIT_FAILURE` | 程序失败退出码 |
| `RAND_MAX` | `rand()` 能返回的最大值 |
| `MB_CUR_MAX` | 当前 locale 中多字节字符的最大字节数 |
| `NULL` | 空指针常量（C++ 中更推荐用 `nullptr`） |
| `std::size_t` | 无符号整数，`sizeof` 的返回类型 |
| `std::div_t` / `std::ldiv_t` / `std::lldiv_t` | `div` 系列的返回结构体 |

---

## 何时用 `<cstdlib>` vs C++ 原生方案

| 场景 | `<cstdlib>` 方案 | 更推荐的 C++ 方案 |
|------|-------------------|-------------------|
| 字符串转数值 | `std::atoi` / `std::strtol` | `std::stoi`（`<string>`，抛异常） |
| 随机数 | `std::srand` + `std::rand` | `<random>`：`std::mt19937` + 分布 |
| 动态内存 | `std::malloc` / `std::free` | `new` / `delete` 或智能指针 |
| 排序 | `std::qsort` | `std::sort`（`<algorithm>`） |
| 搜索 | `std::bsearch` | `std::binary_search` / `std::lower_bound`（`<algorithm>`） |
| 程序退出 | `std::exit` / `std::abort` | 可继续用 `<cstdlib>` 中的，没有本质上更优的 C++ 替代 |
| 绝对值（整数） | `std::abs` / `std::llabs` | 直接用 `<cstdlib>` 是正常选择 |
| 环境变量 | `std::getenv` | 可继续用，无非更高一层的标准替代 |

---

总而言之，`<cstdlib>` 是 C++ 从 C 继承来的工具箱。在现代 C++ 代码中，很多功能已经有了更安全、更类型化或更高效的替代（随机数、排序、字符串转换等），但 `std::exit`、`std::llabs`、`std::strtol` 等仍在使用。了解它可以让读过 C 风格代码时不困惑，写新代码时也能在合适的边界上正确选择。
