---
title: "static"
slug: "cpp/summaries/static"
description: "位置 含义 生命周期 可见性"
date: "2026-07-10"
updated: "2026-07-10"
category: "CPP"
section: "Summaries"
tags: ["cpp","summaries"]
status: "published"
---

### `static` 在 C++ 中有 **五种不同的含义**，取决于它出现的位置。再加上 `extern` 作为它的对立面，一起梳理。

---

## 速查总表

| 位置                 | 含义       | 生命周期 | 可见性     |
| ------------------ | -------- | ---- | ------- |
| 全局变量/函数前           | 内部链接     | 程序全程 | 仅当前翻译单元 |
| 局部变量前              | 持久化局部变量  | 程序全程 | 仅当前函数内  |
| 类成员变量前             | 类级共享变量   | 程序全程 | 按访问修饰符  |
| 类成员函数前             | 不依赖实例的函数 | —    | 按访问修饰符  |
| 全局变量/函数（不加 static） | 外部链接（默认） | 程序全程 | 全程序可见   |

---

## 一、Static 在类 / 结构体外（翻译单元级）

### 1.1 全局变量加 `static` —— 内部链接

不加 `static` 的全局变量默认具有**外部链接**，可以被其他 `.cpp` 文件通过 `extern` 访问。加了 `static` 后变为**内部链接**，符号只在当前翻译单元（即当前 `.cpp` 文件）内可见。

```cpp
// a.cpp
static int s_counter = 0;    // 只在 a.cpp 内可见
int g_counter = 0;           // 全程序可见

// b.cpp
extern int g_counter;        // OK，链接到 a.cpp 的 g_counter
// extern int s_counter;     // 链接错误！a.cpp 的 s_counter 不可见
```

这就是 Cherno 在"Static in C++"那一集里讲的核心：**`static` 在全局作用域 = 限制符号只在当前翻译单元内可用**，相当于给变量/函数加了一层"私密性"。这避免了不同 `.cpp` 文件中的同名全局变量发生链接冲突。

### 1.2 全局函数加 `static`

效果完全相同——函数被标记为内部链接，其他 `.cpp` 文件无法调用它：

```cpp
// utils.cpp
static void helper() { /* ... */ }   // 仅 utils.cpp 内可用
void public_api() { helper(); }      // 全程序可用
```

> **Note for C++**：C++ 中更推荐用**匿名命名空间**代替 `static` 来限制全局符号的可见性：
> ```cpp
> namespace {
>     int s_counter = 0;     // 等价于 static int s_counter = 0;
>     void helper() { }      // 等价于 static void helper()
> }
> ```
> 匿名命名空间在 C++ 标准中被明确推荐用于此目的，且对类型和模板更友好（`static` 不能用于类型定义）。

### 1.3 函数内的局部 `static` 变量

这大概是使用频率最高的 `static` 用法之一。一个局部变量标记 `static` 后，它的**生命周期变成整个程序运行期**（而不是函数调用结束后销毁），但**作用域仍然局限在函数内部**。初始化只执行一次。

```cpp
int getNextID() {
    static int id = 0;   // 只在第一次调用时初始化为 0
    return ++id;         // 每次调用返回 1, 2, 3, ...
}
```

Cherno 的比喻：这就像是把一个"全局变量"塞进了函数的肚子里，外部看不到，但它一直活着。常用于单例、缓存、或需要跨调用保持状态的计数器。

---

## 二、Static 在类 / 结构体内（类级成员）

这是当前你在看的视频（Static for Classes and Structs）的主题。
### 2.1 静态成员变量 —— 所有实例共享一份

给类的成员变量加 `static`，意味着这个变量**不属于任何一个具体的对象实例**，而是属于**整个类**。所有实例看到的是同一个变量。

```cpp
class Entity {
public:
    static int count;     // 声明（不分配内存）
    Entity() { count++; }
    ~Entity() { count--; }
};

// 必须在类外定义（分配内存）
int Entity::count = 0;   // 甚至可以不给初值
```

三个关键点：
- **类内声明，类外定义**——不定义会报 `unresolved external symbol`（Cherno 视频 3:00 处展示的错误）
- 通过 `Entity::count` 访问，而非 `e.count`（虽然后者语法上也合法，但误导人）
- 它在所有对象创建之前就存在，在 `main` 之前初始化

C++17 起可以通过 `inline static` 在类内直接定义（省去类外定义）：

```cpp
class Entity {
public:
    inline static int count = 0;   // C++17：声明即定义
};
```

### 2.2 静态成员函数 —— 不依赖实例的方法

加 `static` 的成员函数**没有 `this` 指针**。这意味着：
- 可以通过类名直接调用（`Entity::print()`），不需要对象
- **不能访问非静态成员变量**（因为它不知道是哪个实例的）
- 可以访问静态成员变量和静态成员函数

```cpp
class Entity {
    int x, y;                        // 非静态成员
    static int count;                // 静态成员
public:
    static void printStatus() {
        // std::cout << x;           // 错误！哪个实例的 x？
        std::cout << count;          // OK，count 是类级共享的
    }
};

// 调用
Entity::printStatus();              // 正确：不需要对象
Entity e;
e.printStatus();                    // 语法上合法，但误导性
```

Cherno 在 6:30 处解释了为什么：**编译器在底层其实是把非静态成员函数"翻译"成一个普通函数，额外传一个隐藏的 `this` 参数**。而 `static` 函数不要这个隐藏参数，所以它无法引用任何实例的成员——就像在类外写了一个普通函数。

---

## 三、`extern` —— `static` 的对立面

如果说全局 `static` 把符号"锁在"当前文件里，那 `extern` 就是把符号"对外开放"。

### 3.1 `extern` 变量的本质

`extern` 不是定义变量，而是**声明**：告诉编译器"这个变量已经在别处（另一个 `.cpp` 文件中）定义过了，你去找链接器要"。

```cpp
// config.cpp  —— 定义（分配内存）
int globalVolume = 80;             // 默认外部链接

// main.cpp    —— 声明（不分配内存）
extern int globalVolume;           // 告诉编译器：这个变量在别处
std::cout << globalVolume;         // 80
```

如果 `config.cpp` 中的变量加了 `static`，那 `main.cpp` 的 `extern` 声明将导致**链接错误**——这正是 `static` 在全局作用域中"阻断外部可见性"的核心作用。

### 3.2 `extern` 函数

函数默认就是 `extern` 的（外部链接），所以通常不需要显式写：

```cpp
// math.cpp
int add(int a, int b) { return a + b; }   // 默认 extern

// main.cpp
int add(int a, int b);                     // 声明，等同于 extern int add(...)
```

### 3.3 `extern "C"` —— 跨 C/C++ 链接

当 C++ 代码需要调用 C 写的库（或反之），需要用 `extern "C"` 告诉 C++ 编译器不要做名称修饰：

```cpp
extern "C" {
    #include "some_c_library.h"
}

// 或者单个函数
extern "C" void legacy_function(int x);
```

---

## 四、`static` vs `extern` 对比一览

| | `static`（全局） | 默认（无修饰） | `extern` |
|------|:--:|:--:|:--:|
| 链接类型 | 内部 | 外部 | 外部（仅声明） |
| 其他 .cpp 可访问 | 否 | 是 | 是 |
| 是定义还是声明 | 定义 | 定义 | 声明（不分配内存） |
| 可定义多次（不同文件） | 可以（每个 TU 独立） | 不可以（ODR 违规） | 声明可重复，定义只能一次 |

---

## 五、实践规则总结

1. **全局变量**尽量用匿名命名空间代替 `static`；如果必须用全局，优先考虑 `static` 限制可见性。
2. **函数内的 `static` 局部变量**是初始化开销昂贵的对象或需要跨调用保持状态时的首选，它天然线程安全（C++11 起保证初始化只执行一次）。
3. **类的 `static` 成员变量**必须在类外定义（C++17 起可选 `inline static` 省去这步），初始化顺序按定义顺序。
4. **类的 `static` 成员函数**适合写工具函数、工厂方法、或者不需要实例状态的逻辑。
5. **`extern` 用于跨文件共享**，但要配合头文件使用（在头文件中放 `extern` 声明，在唯一的一个 `.cpp` 中放定义）。
6. **别用 `static` 加 `extern` 同时修饰一个变量**——这在语义上是矛盾的。

[^1]: 

