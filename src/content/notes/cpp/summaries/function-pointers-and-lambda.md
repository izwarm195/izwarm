---
title: "function pointers & lambda"
slug: "cpp/summaries/function-pointers-and-lambda"
description: "这一集 Cherno 继续延续上一集 auto 的节奏，系统讲解了 C++ 中的 函数指针 。以下是核心内容："
publishDate: "2026-07-25"
updatedDate: "2026-07-25"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

---

---


这一集 Cherno 继续延续上一集 `auto` 的节奏，系统讲解了 C++ 中的**函数指针**。以下是核心内容：

---

### **一、什么是函数指针**

函数在编译后就是二进制中的一段 CPU 指令，有其内存地址。函数指针就是**把函数的地址赋值给一个变量**，从而可以像操作普通变量一样操作函数——包括将其作为参数传递给另一个函数。

### **二、基本语法与声明**

定义一个最简函数：

```cpp
void HelloWorld() {
    std::cout << "Hello World!" << std::endl;
}
```

获取函数指针时**不加括号**（加括号会调用函数而非获取地址）：

```cpp
auto function = HelloWorld;   // 隐式转换，等价于 &HelloWorld
function();                     // 通过指针调用
```

显式写出类型时，语法如下：

```cpp
void(*function)() = HelloWorld;
```

可以解读为：`function` 是一个指针，指向一个返回 `void`、无参数的函数。

如果函数带参数：

```cpp
void HelloWorld(int a) { std::cout << "Value: " << a << std::endl; }

void(*function)(int) = HelloWorld;
function(8);  // 输出 Value: 8
```

### **三、用 typedef 简化声明**

裸函数指针的语法非常丑陋，Cherno 更推荐用 `typedef` 起别名：

```cpp
typedef void(*HelloWorldFunction)(int);
HelloWorldFunction function = HelloWorld;
function(8);
```

这样可读性大幅提升。

### **四、核心应用：将函数作为参数传递**

这是函数指针最重要的用途。Cherno 举了 `for_each` 的经典例子：

```cpp
// 一个遍历 vector 并对每个元素执行某操作的函数
void ForEach(const std::vector<int>& values, void(*func)(int)) {
    for (int value : values)
        func(value);
}

void PrintValue(int value) {
    std::cout << "Value: " << value << std::endl;
}

int main() {
    std::vector<int> values = {1, 5, 4, 2, 3};
    ForEach(values, PrintValue);  // 将 PrintValue 作为参数传入
}
```

这样 `ForEach` 的行为由传入的函数决定——可以替换为任何签名匹配的函数，实现了极高灵活性。

### **五、Lambda 
这一集 Cherno 在上集函数指针的基础上，正式讲解了 C++11 引入的 **Lambda 表达式**。
#### **一、什么是 Lambda**

Lambda 本质上就是一种**匿名函数**——你可以在代码中随时定义一个"一次性"的函数，而不需要像普通函数那样在全局或类作用域中单独声明。Cherno 把 Lambda 称为"quick disposable function"（快速的、可丢弃的函数）。

核心定位：**任何需要使用函数指针的地方，都可以用 Lambda 代替。**

#### **二、Lambda 的基本语法**

一个完整的 Lambda 由三部分组成：

```
[capture](parameters) { body }
```

- **`[]` — 捕获列表（captures）**：决定外部变量如何传入 Lambda 内部。
- **`()` — 参数列表**：和普通函数一样，定义这个 Lambda 接受什么参数。
- **`{}` — 函数体**：Lambda 要执行的代码。

一个最简单的例子：

```cpp
std::vector<int> values = {1, 5, 4, 2, 3};

// Lambda: 打印每个 value
auto lambda = [](int value) {
    std::cout << "Value: " << value << std::endl;
};
```

#### **三、捕获列表详解（Captures）**

捕获列表是 Lambda 区别于普通函数的核心特性——它决定了**外部变量如何被 Lambda "捕获"到内部使用**。

```cpp
int a = 5;

// ❌ 空的捕获列表：无法使用外部变量 a
auto f1 = []() { std::cout << a; };  // 编译错误

// ✅ 按值捕获 a：拷贝一份
auto f2 = [a]() { std::cout << a; };

// ✅ 按引用捕获 a：可以修改原变量
auto f3 = [&a]() { a = 10; };

// ✅ 捕获所有外部变量，全部按值传递
auto f4 = [=]() { /* 能访问所有外部变量，但都是副本 */ };

// ✅ 捕获所有外部变量，全部按引用传递
auto f5 = [&]() { /* 能访问所有外部变量，且能修改 */ };
```

Cherno 特别建议查阅 [cppreference.com](https://en.cppreference.com/w/cpp/language/lambda) 上的 Lambda 文档来了解所有捕获方式的具体细节。

#### **四、重要限制：带捕获的 Lambda 不能直接赋值给裸函数指针**

这是视频中一个非常关键的实践要点。上一集我们用的是 C 风格裸函数指针：

```cpp
void ForEach(const std::vector<int>& values, void(*func)(int));
```

如果你的 Lambda **带有捕获**（即 `[]` 里写了东西），它就不能被隐式转换为裸函数指针，因为捕获引入了额外的状态（相当于 Lambda 变成了一个带有成员变量的函数对象，而不只是纯函数）。

解决办法是使用 `std::function`（需要 `#include <functional>`）：

```cpp
#include <functional>

void ForEach(const std::vector<int>& values, 
             const std::function<void(int)>& func) {
    for (int value : values)
        func(value);
}

int main() {
    std::vector<int> values = {1, 5, 4, 2, 3};
    int a = 5;
    
    // 使用 std::function 后，可以正常捕获 a
    ForEach(values, [a](int value) {
        std::cout << value + a << std::endl;
    });
}
```

#### **五、mutable 关键字**

按值捕获的变量在 Lambda 内部默认是**不可修改**的（这一点和普通函数的按值参数行为不同）：

```cpp
int a = 5;
auto f = [a]() {
    a = 10;  // ❌ 编译错误：a 是只读的
};
```

加上 `mutable` 关键字后则可以修改（但修改的只是副本，不影响原变量）：

```cpp
auto f = [a]() mutable {
    a = 10;  // ✅ 合法，但只修改了副本
};
```

#### **六、实战：`std::find_if`**

Cherno 用 `std::find_if` 展示了 Lambda 在实际场景中的优雅用法。假设要在一个 `vector<int>` 中找到第一个大于 3 的元素：

```cpp
#include <algorithm>
#include <vector>

std::vector<int> values = {1, 5, 4, 2, 3};

auto it = std::find_if(values.begin(), values.end(), [](int value) {
    return value > 3;
});

std::cout << *it << std::endl;  // 输出 5
```

`std::find_if` 对容器中的每个元素调用 Lambda，当 Lambda 返回 `true` 时立即返回对应的迭代器。这种"把条件判断逻辑直接写在调用处"的模式正是 Lambda 最典型的应用场景——你不需要为了一个简单的判断条件去写一个单独的命名函数。

#### **七、核心思想总结**

Lambda 让你可以**把一段"将在未来某个时刻被调用的代码"以内联方式写在调用点**。最常见的场景包括：

- **回调函数**：告诉某个 API"到了某个条件时执行这段代码"。
- **算法中的谓词（predicate）**：如 `std::find_if`、`std::sort` 的自定义比较逻辑。
- **延迟执行**：将一段逻辑保存下来，稍后在合适的时机调用。

正如 Cherno 所强调的：Lambda 的用途和函数指针完全一致，但它更简洁、更具表现力，尤其是在逻辑只被一处使用时，避免了不必要的命名函数污染代码。
