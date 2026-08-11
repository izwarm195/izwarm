---
title: "cast"
slug: "cpp/summaries/cast"
description: "适用于数值类型转换、 void 转回对象指针、继承体系中的已知转换等。"
publishDate: "2026-07-13"
createdAt: "2026-07-13T00:00:00Z"
updatedDate: "2026-07-13"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

## C++ 推荐的四种命名转换

### 1. `static_cast`：正常且有明确关系的转换

适用于数值类型转换、`void*` 转回对象指针、继承体系中的已知转换等。

```cpp
double value = 3.14;
int number = static_cast<int>(value); // 结果为 3
```

```cpp
int x = 10;
void* raw = &x;
int* p = static_cast<int*>(raw);
```

向上转型也可使用：

```cpp
class Base {};
class Derived : public Base {};

Derived d;
Base* base = static_cast<Base*>(&d);
```

规范建议：

- 数值窄化时显式使用，说明你知道可能丢失信息。
- 普通隐式转换已经清楚且安全时，不必滥用。
- 不要用它从无关指针类型互转。
- 基类指针向派生类指针转换虽然可能编译，但若对象实际不是派生类，使用结果可能产生未定义行为。

```cpp
Base* base = new Base;
Derived* derived = static_cast<Derived*>(base); // 能否编译取决于类定义，但很危险
```

---

### 2. `dynamic_cast`：多态继承中的运行时安全转换

用于把基类指针或引用向派生类转换，并在运行时检查对象的实际类型。基类必须是**多态类型**，通常至少有一个虚函数。

```cpp
class Base {
public:
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    void work() {}
};

Base* base = new Derived;

if (Derived* derived = dynamic_cast<Derived*>(base)) {
    derived->work();
}
```

指针转换失败返回 `nullptr`：

```cpp
Derived* p = dynamic_cast<Derived*>(base);

if (p == nullptr) {
    // 实际对象不是 Derived
}
```

引用转换失败会抛出 `std::bad_cast`：

```cpp
try {
    Derived& ref = dynamic_cast<Derived&>(*base);
} catch (const std::bad_cast&) {
    // 转换失败
}
```

规范建议：

- 只用于多态继承关系。
- 基类应有虚析构函数，尤其是可能通过基类指针删除对象时。
- 如果设计中经常大量使用 `dynamic_cast`，可能表示类的接口设计需要重新考虑。
- 只需要调用共同行为时，应优先使用虚函数，而不是先判断具体类型。

---

### 3. `const_cast`：添加或移除 `const` / `volatile`

它只能改变类型的 cv 限定，不负责改变底层数据表示。

```cpp
void oldApi(char* text);

const char* message = "hello";
oldApi(const_cast<char*>(message));
```

但这只有在 `oldApi` **保证不会修改内容**时才勉强可接受。

最重要的规则：如果原对象本来就是 `const`，去掉 `const` 后再修改，行为未定义。

```cpp
const int x = 10;
int* p = const_cast<int*>(&x);
*p = 20; // 未定义行为
```

若原对象本来不是 `const`，只是通过 `const` 视图访问，则去掉限定后修改原对象可以合法：

```cpp
int x = 10;
const int* cp = &x;

int* p = const_cast<int*>(cp);
*p = 20; // 合法，因为原对象 x 不是 const
```

规范建议：

- 新代码应尽量通过正确设计接口避免它。
- 常见合理用途是兼容签名错误、但实际上不会修改数据的旧式 API。
- 不要用它掩盖 const-correctness 问题。

---

### 4. `reinterpret_cast`：底层表示或地址解释转换

这是风险最高的转换，常用于底层系统编程、硬件接口、序列化边界或与特殊 API 交互。

```cpp
int value = 42;
unsigned char* bytes =
    reinterpret_cast<unsigned char*>(&value);
```

把一种对象指针转换为另一种对象指针：

```cpp
char* raw = nullptr;
int* p = reinterpret_cast<int*>(raw);
```

但“成功转换”不代表“可以安全解引用”。以下问题仍需满足：

- 地址对 `int` 是否正确对齐；
- 对象的实际生命周期是否已经开始；
- 是否违反严格别名规则；
- 内存中是否真的存在合法的 `int` 对象。

```cpp
char buffer[sizeof(int)];
int* p = reinterpret_cast<int*>(buffer);
*p = 42; // 可能涉及对齐、对象生命周期等问题，不能仅凭转换通过就认为安全
```

规范建议：

- 普通业务代码尽量不要用。
- 转换后的指针在解引用前必须确认对象类型、生命周期和对齐要求。
- 仅查看对象表示时，`char*`、`unsigned char*` 或 `std::byte*` 是特殊允许的方向。
- 做按位复制时，现代 C++ 更适合使用 `std::bit_cast` 或 `std::memcpy`。

---

## `std::bit_cast`：复制位模式，而非强行解释地址

C++20 提供 `std::bit_cast`，用于两个大小相同且满足要求的类型之间复制位表示：

```cpp
#include <bit>
#include <cstdint>

float value = 1.0f;
std::uint32_t bits = std::bit_cast<std::uint32_t>(value);
```

它通常比下面这种做法安全、清楚：

```cpp
std::uint32_t bits =
    *reinterpret_cast<std::uint32_t*>(&value); // 容易违反严格别名规则
```

注意，`bit_cast` 得到的是一个新值，不是指向原对象的另一种指针。

---

## 函数式转换与构造

以下也是显式转换或构造语法：

```cpp
int a = int(3.14);  // 函数式转换
int b{3};           // 列表初始化
```

对于类类型，常常表达的是构造对象：

```cpp
std::string text("hello");
std::string other{"world"};
```

基本类型转换更推荐 `static_cast`，因为意图更明确：

```cpp
int a = static_cast<int>(3.14);
```

列表初始化的优势是能阻止很多窄化转换：

```cpp
// int x{3.14}; // 编译错误：不允许窄化
int x = static_cast<int>(3.14); // 明确表示有意舍弃小数
```

---

## C 风格转换为什么不推荐

```cpp
(int*)a
```

读代码时无法立刻判断它是在：

- 从 `void*` 恢复为 `int*`；
- 从其他指针类型强行重解释；
- 去除 `const`；
- 进行继承体系中的指针转换；
- 同时完成多个转换步骤。

而命名转换能直接表达意图：

```cpp
static_cast<int*>(a)       // 已知类型关系
reinterpret_cast<int*>(a)  // 底层地址重解释
const_cast<int*>(a)        // 只改变 const
dynamic_cast<int*>(a)      // 此例本身通常不成立；用于类的多态转换
```

它们也更容易搜索和代码审查。

---

## 选择规则

| 需求                       | 推荐写法                         |
| ------------------------ | ---------------------------- |
| 数值类型转换                   | `static_cast<T>(value)`      |
| 明确接受窄化或截断                | `static_cast<T>(value)`      |
| `void*` 转回原对象指针          | `static_cast<T*>(ptr)`       |
| 派生类指针转基类指针               | 通常隐式转换，或 `static_cast`       |
| 多态基类安全地向下转换              | `dynamic_cast<T*>(ptr)`      |
| 只改变 `const` / `volatile` | `const_cast<T>(value)`       |
| 无关指针或底层地址重解释             | `reinterpret_cast<T>(value)` |
| 相同大小类型复制位模式              | `std::bit_cast<T>(value)`    |
| 构造类对象                    | `T{arguments...}`            |
| 不允许窄化的初始化                | 列表初始化 `T{value}`             |

---

## 对 `(int*)a` 应如何改写

必须先看 `a` 的真实类型和转换目的。

```cpp
void* a = /* ... */;
int* p = static_cast<int*>(a);
```

这里表示：`a` 原本应当指向一个 `int` 对象，现在从通用指针恢复类型。

```cpp
char* a = /* ... */;
int* p = reinterpret_cast<int*>(a);
```

这里表示：强行把同一个地址解释成 `int*`。转换可能成功，但不保证解引用合法。

```cpp
const int* a = /* ... */;
int* p = const_cast<int*>(a);
```

这里仅移除 `const`，但能否通过 `p` 修改，取决于原对象是否真正为非 `const`。

因此，不能机械地把所有 `(int*)a` 都替换成同一个 `cast`；应该先问：**这次转换到底想表达哪一种关系？**
