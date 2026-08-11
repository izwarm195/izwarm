---
title: "Lambda"
slug: "cpp/tips/lambda"
description: "C++11 提供了对匿名函数的支持,称为 Lambda 函数(也叫 Lambda 表达式)。"
publishDate: "2026-07-16"
createdAt: "2026-07-16T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["cpp","tips"]
series: ["CPP","Tips"]
---

## Lambda 函数与表达式

C++11 提供了对匿名函数的支持,称为 Lambda 函数(也叫 Lambda 表达式)。

Lambda 表达式把函数看作对象。Lambda 表达式可以像对象一样使用，比如可以将它们赋给变量和作为参数传递，还可以像函数一样对其求值。

Lambda 表达式本质上与函数声明非常类似。Lambda 表达式具体形式如下:

```cpp
[capture](parameters)->return-type{body}
```

例如：
```cpp
[](int x, int y){ return x < y ; }
```
如果没有返回值可以表示为：
```cpp
[capture](parameters){body}
```
例如：

```cpp
[]{ ++global_x; } 
```

在一个更为复杂的例子中，返回类型可以被明确的指定如下：
```
[](int x, int y) -> int { int z = x + y; return z + x; }
```
本例中，一个临时的参数 z 被创建用来存储中间结果。如同一般的函数，z 的值不会保留到下一次该不具名函数再次被调用时。

如果 lambda 函数没有传回值（例如 void），其返回类型可被完全忽略。

在Lambda表达式内可以访问当前作用域的变量，这是Lambda表达式的闭包（Closure）行为。 与JavaScript闭包不同，C++变量传递有传值和传引用的区别。可以通过前面的[]来指定：
```cpp
[]      // 有定义任何变量。使用未定义变量会引发错误。
[x, &y] // x以传值方式传入（默认），y以引用方式传入。
[&]     // 任何被使用到的外部变量都隐式地以引用方式加以引用。
[=]     // 任何被使用到的外部变量都隐式地以传值方式加以引用。
[&, x]  // x显式地以传值方式加以引用。其余变量以引用方式加以引用。
[=, &z] // z显式地以引用方式加以引用。其余变量以传值方式加以引用。
```
另外有一点需要注意。对于`[=]`或`[&]`的形式，lambda 表达式可以直接使用 this 指针。但是，对于`[]`的形式，如果要使用 this 指针，必须显式传入：
```cpp
[this]() { this->someFunc(); }();
```

---
### **Lambda 表达式的核心使用场景**

Lambda 本质上就是一个**可以随手定义、用完即弃的匿名函数**。以下是几种最常见的用法：

---

**1. 作为回调函数传给算法**

```cpp
std::vector<int> v = {3, 1, 4, 1, 5};
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
```

**2. 传给 STL 算法做条件判断**

```cpp
std::vector<int> v = {1, 2, 3, 4, 5, 6};
auto it = std::find_if(v.begin(), v.end(), [](int x) { return x > 3; });
```

**3. 捕获外部变量**

```cpp
int threshold = 3;
auto it = std::find_if(v.begin(), v.end(), [threshold](int x) { return x > threshold; });
```

`[=]` 捕获所有按值，`[&]` 捕获所有按引用，`[this]` 捕获当前对象指针。

**4. 临时事件处理 / 一次性函数**

```cpp
auto once = [&]() { std::cout << "只执行一次的逻辑" << std::endl; };
once();
```

**5. 配合 `std::thread` 启动线程**

```cpp
std::thread t([](const std::string& msg) { std::cout << msg; }, "hello");
t.join();
```

**6. 配合 `mutable` 修改按值捕获的副本**

```cpp
int x = 8;
auto f = [x]() mutable { x++; std::cout << x; };  // 输出 9
f();
// x 在外部仍然是 8
```

---

# Some Q&A
##
> ```cpp
> int p = [&]()
{
x++;
return 0;
};
> ```
> 这个为什么报错

### 你定义了一个 lambda，但没有调用它；然后试图把整个函数对象塞进一个 `int` 变量

---

### 问题在这

```cpp
int p = [&]()
{
    x++;
    return 0;
};   // ← 少了一对括号 ()
```

`[&]() { ... }` 是一个 **lambda 表达式**，它的类型是一个**匿名函数对象**（编译器生成的闭包类型），不是 `int`。所以编译器告诉你：类型不匹配，不能把函数对象赋给 `int`。

---

### 修复方法——加上 `()` 立即调用

```cpp
int p = [&]()
{
    x++;
    return 0;
}();   // ← 这行末尾的 () 就是调用
```

末尾的 `()` 立即执行这个 lambda，lambda 返回 `0`，刚好是 `int`，`p` 就能接收了。

---

### 两种方式对比

| 写法 | 含义 |
|---|---|
| `auto f = [&]() { return 0; };` | 把 lambda **本身**存为变量 `f`，后面用 `f()` 调用 |
| `int p = [&]() { return 0; }();` | 定义 lambda 并**当场调用**，把返回值赋给 `p` |

你的代码想走第二种，只是漏了末尾那对括号。

> ```cpp
> 那如果我用auto p = [&]()
{
x++;
return 0;
};p是什么类型？
auto p = [&]()
{
x++;
};呢？
> ```

### `p` 是一个**编译器生成的匿名闭包类型**，不是 `std::function`，也不是函数指针

两种情况下 `p` 的类型都属于"独一无二、没有名字"的闭包类，大致可以想象成编译器背地里帮你写了这样的东西：

---

#### 情况一：有返回值

```cpp
auto p = [&]()
{
    x++;
    return 0;
};
p();  // 返回 0，类型是 int
```

编译器生成的伪代码大概是：

```cpp
class __some_unique_lambda_1 {
    // 内部存了对外部变量的引用（因为 [&]）
public:
    int operator()() const { x++; return 0; }  // 返回 int
};
__some_unique_lambda_1 p;
```

- `operator()` 返回 `int`
- `p()` 的值是 `0`
- `sizeof(p)` 通常很小（只存了几个引用），一般 8 字节左右（64 位下）

---

#### 情况二：无返回值

```cpp
auto p = [&]()
{
    x++;
};    // 没有 return 语句
p(); // 返回 void
```

```cpp
class __some_unique_lambda_2 {
public:
    void operator()() const { x++; }  // 返回 void
};
__some_unique_lambda_2 p;
```

- `operator()` 返回 `void`
- `p()` 没有返回值，你只能执行它，不能把结果赋给变量

---

### 核心结论

| | `auto p = [&]() { x++; return 0; };` | `auto p = [&]() { x++; };` |
|---|---|---|
| `p` 的类型 | 编译器生成的唯一闭包类型 | 另一个不同的唯一闭包类型 |
| `p()` 返回类型 | `int` | `void` |
| 本质 | 可调用对象（functor） | 可调用对象（functor） |
| 是否等于 `std::function` | 不是，但可以隐式转换 | 不是，但可以隐式转换 |

两个 lambda 就算长得一模一样，它们的类型也是**不同的**——`decltype(p)` 和 `decltype(q)` 永远不会是同一个类型。这就是为什么你不能把两个 lambda 直接 `=` 互赋，但可以用 `std::function` 来统一包装它们。
