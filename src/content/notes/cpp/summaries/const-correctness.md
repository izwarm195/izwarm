---
title: "const-correctness"
slug: "cpp/summaries/const-correctness"
description: "一句话： 任何不该被修改的东西，都应该声明为 const ，让编译器来帮你检查。 它不是某个单独的语法规则，而是一条贯穿变量、参数、返回值、成员函数的系统性约定。"
date: "2026-07-09"
updated: "2026-07-09"
category: "CPP"
section: "Summaries"
tags: ["cpp","summaries"]
status: "published"
---

---

## 什么是 const-correctness

一句话：**任何不该被修改的东西，都应该声明为 `const`，让编译器来帮你检查。** 它不是某个单独的语法规则，而是一条贯穿变量、参数、返回值、成员函数的系统性约定。

---

## 一、const 变量 —— 防止意外修改

最基本用法，声明"这个值初始化之后就不会再变"：

```cpp
const int MAX_SIZE = 100;
const double PI = 3.1415926535;

// MAX_SIZE = 200;   // 编译错误
```

C++ 中更推荐用 `const` 而非 `#define` 宏，因为它有类型检查、有作用域、可以被调试器识别。

和指针组合时，`const` 的位置决定了"谁"不可变：

```cpp
int x = 10;

const int* p1 = &x;    // 指向的"内容"不可变（底层 const）
int* const p2 = &x;    // 指针"本身"不可变（顶层 const）
const int* const p3 = &x;  // 两者都不可变

// *p1 = 20;  // 错误：指向的内容不能改
p1 = nullptr;   // 可以：指针本身可以改

// p2 = nullptr;  // 错误：指针本身不能改
*p2 = 20;     // 可以：指向的内容可以改
```

记忆技巧：`const` 在 `*` 左边 → 内容不可改；`const` 在 `*` 右边 → 指针本身不可改。

---

## 二、const 引用 —— 避免拷贝，保证只读

这是 C++ 中最常用的传参方式。当函数只需要读数据而不需要修改时：

```cpp
// 不好：按值传递大对象，触发拷贝
void print(std::vector<int> data) { /* ... */ }

// 不好：非 const 引用，调用者担心数据会被篡改，也无法接受临时对象
void print(std::vector<int>& data) { /* ... */ }

// 正确：const 引用，零拷贝 + 承诺只读 + 可接受临时对象
void print(const std::vector<int>& data) { /* ... */ }
```

上一轮你写的那段代码中 `max(long long int &a, long long int &b)` —— 虽然 `long long` 只有 8 字节，拷贝成本极低，但用非 const 引用：
- 语义上暗示"我可能修改你的变量"，实际并没有
- 无法传递临时对象或字面量
- 这就是违反 const-correctness 的典型例子

对于小类型（如 `int`、`double`、指针），直接按值传递反而更清晰；对于大对象（如 `std::string`、`std::vector`），用 `const T&`。

---

## 三、const 成员函数 —— 这个函数不改变对象状态

在类中，用 `const` 标记成员函数，承诺"调用这个函数不会修改对象的任何成员"：

```cpp
class Person {
public:
    const std::string& name() const { return name_; }  // const 成员函数
    void setName(const std::string& name) { name_ = name; }  // 非 const
private:
    std::string name_;
};

void process(const Person& p) {
    std::cout << p.name();   // 可以：name() 是 const
    // p.setName("Bob");      // 错误：setName() 不是 const，且 p 是 const 引用
}
```

**物理 const vs 逻辑 const：**

- **物理 const**：对象的内存布局完全不变。编译器默认保证的就是这个。
- **逻辑 const**：外部观察者看来对象状态不变，但内部可能有缓存或互斥量需要修改。这种情况用 `mutable`：

```cpp
class Cache {
public:
    int compute() const {
        if (!cached_) {                    // const 函数中
            cached_ = true;                // 修改 mutable 成员，合法
            result_ = expensive_calc();    // 修改 mutable 成员，合法
        }
        return result_;
    }
private:
    mutable bool cached_ = false;          // mutable 绕开 const
    mutable int result_ = 0;
};
```

---

## 四、const 返回值 —— 防止无意义的赋值

按值返回时**不要**加 `const`（会阻止移动语义），C++11 以后尤其如此。按引用或指针返回时，可以根据需要加：

```cpp
// 按值返回，不要加 const（C++11+ 会阻断移动）
std::string getName() { return name_; }         // 好
// const std::string getName() { return name_; } // 差

// 返回引用且不希望外部修改
const std::string& name() const { return name_; }
```

返回 `const` 引用还学涉及一个重要概念——**生命周期延长**。把一个临时对象绑定到 `const` 引用上，临时对象会活到引用离开作用域：

```cpp
std::string getName();

// const 引用绑到临时对象，生命周期延长到 block 结束
const std::string& ref = getName();   // OK

// 非 const 引用不行
// std::string& ref = getName();      // 编译错误
```

---

## 五、顶层 const 与底层 const（附赠术语澄清）

这个概念在讨论 `const` 的传递和类型转换时很重要：

- **顶层 const**：对象本身是常量（如 `int* const p`，`const int x`）
- **底层 const**：对象指向/引用的内容是常量（如 `const int* p`，`const int& r`）

传参或赋值时，**顶层 const 会被忽略**，底层 const 必须保持一致：

```cpp
void f(int x);         // 接受 int
void f(const int x);   // 重定义冲突：顶层 const 被忽略

void g(int& x);        // 接受 int&
void g(const int& x);  // 合法重载：底层 const 不同
```

这就解释了为什么 `void f(const T)` 和 `void f(T)` 不能构成重载——按值传递时，`const` 是顶层的，调用方不关心函数内部是否修改自己的拷贝。

---

## 六、实践 checklist

日常写代码时，可以按这个顺序自查：

| 检查项 | 规则 |
|--------|------|
| 局部变量 | 值不会变就加 `const` |
| 函数参数（只读） | 大对象用 `const T&`，小对象直接按值 |
| 函数参数（会改） | 用指针 `T*`（暗示可为空）或非 const 引用 `T&` |
| 成员函数 | 不修改成员的就标记 `const` |
| 成员变量 | 不变的就声明 `const`（在初始化列表里绑定） |
| 按值返回 | 不加 `const`（C++11+），保留移动语义 |
| 按引用返回 | 外部不应修改时返回 `const T&` |
| 类型转换 | 不要用 `const_cast` 去掉 const（除非与 C API 的边界代码） |

---

### **const_cast 的合理使用边界**

原则上不到万不得已不要用 `const_cast`，但有一个公认的例外场景：**封装 C 风格 API**。

很多 C 库的函数签名不区分 const（如 `strlen` 之前的老 API），但你的接口承诺了 const-correctness：

```cpp
// C 库：实际不修改输入，但签名没有 const
void legacy_log(char* msg);

// 你的封装：对外保证只读
void safe_log(const char* msg) {
    legacy_log(const_cast<char*>(msg));  // 唯一正当用途
}
```

除了这种"C 库适配"和极少数缓存延迟初始化场景之外，`const_cast` 出现就说明设计有问题。

---

> **小结**：const-correctness 本质上是一种"用类型系统表达意图"的纪律——所有在你代码中拿到一个对象的人，都能通过它的 const 标记来确定自己能对它做什么、不能做什么。编译器是最严格的执行者，利用好它是 C++ 程序员的基本功。

---


