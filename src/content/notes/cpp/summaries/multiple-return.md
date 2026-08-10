---
title: "Multiple Return"
slug: "cpp/summaries/multiple-return"
description: "C++ 函数默认只能返回一个值，但实际开发中经常需要返回多个数据。Cherno 以一个真实的 OpenGL 着色器解析函数为例——需要同时返回 顶点着色器源码 和 片段着色器源码 （两个字符串）——逐一讲解了五种应对策略，并给出了自己的偏好。"
publishDate: "2026-07-21"
updatedDate: "2026-07-21"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

---

---
### **处理 C++ 多返回值的五种方法：Cherno 最推崇结构体**

C++ 函数默认只能返回一个值，但实际开发中经常需要返回多个数据。Cherno 以一个真实的 OpenGL 着色器解析函数为例——需要同时返回**顶点着色器源码**和**片段着色器源码**（两个字符串）——逐一讲解了五种应对策略，并给出了自己的偏好。

---

#### **方法一：输出参数（引用/指针传递）**

不返回值，而是让调用者在外面创建变量，通过引用或指针传进函数，函数直接写入：

```cpp
void ParseShader(const std::string& filepath,
                 std::string& outVertexSource,
                 std::string& outFragmentSource) {
    outVertexSource = vs;
    outFragmentSource = fs;
}
```

调用端：

```cpp
std::string vs, fs;
ParseShader("shader.glsl", vs, fs);
```

**Cherno 的观点**：性能上不错，因为字符串本身就在调用方的栈帧上构造好了，避免了额外的拷贝。但代码上略显笨重——需要先声明变量再传进去，不够简洁。如果改用**指针**（`std::string*`）而非引用，则可以传 `nullptr` 表示"我不关心某个返回值"，使用上也更显式（`&vs` 提醒你数据会被写入），但代价是函数内部需要做空指针检查。

---

#### **方法二：返回数组（`std::array` 或原始指针）**

所有返回值是同类型时，可以打包进一个数组返回：

```cpp
std::array<std::string, 2> ParseShader() {
    std::array<std::string, 2> result;
    result[0] = vs;
    result[1] = fs;
    return result;
}
```

也可以返回 `std::vector`。Cherno 指出关键区别：`std::array` 在**栈**上分配（更快），`std::vector` 的底层存储在**堆**上（有额外分配开销）。两种方案的共同问题是：只有类型相同时才能用，而且通过索引访问缺乏语义含义。

---

#### **方法三：`std::pair`**

C++ 标准库提供的二元组：

```cpp
std::pair<std::string, std::string> ParseShader() {
    return std::make_pair(vs, fs);
}

// 使用
auto sources = ParseShader();
sources.first;   // 顶点着色器
sources.second;  // 片段着色器
```

比数组好一点——不同解索引，用 `first`/`second` 语义稍微清晰。但 Cherno 认为问题没解决：**到底 first 是顶点还是片段？** 代码里看不出，必须去查函数文档或用注释标注，可读性差。

---

#### **方法四：`std::tuple`**

`std::pair` 的泛化版本，支持任意数量、任意类型的返回值：

```cpp
std::tuple<std::string, std::string> ParseShader() {
    return std::make_tuple(vs, fs);
}

// 使用
auto sources = ParseShader();
std::get<0>(sources);  // 顶点着色器
std::get<1>(sources);  // 片段着色器
```

Cherno 对这一方法评价极低。`std::get<0>` 和 `std::get<1>` 比 `first`/`second` 更难读——连一个像样的名字都没有，只剩冰冷的数字索引。他认为这属于"糟糕的代码风格"，维护者必须时刻记住索引对应的含义。

---

#### **方法五：自定义结构体 —— Cherno 的最爱**

```cpp
struct ShaderProgramSource {
    std::string VertexSource;
    std::string FragmentSource;
};

ShaderProgramSource ParseShader() {
    return { vs, fs };
}

// 使用
auto sources = ParseShader();
sources.VertexSource;    // 一目了然
sources.FragmentSource;  // 一目了然
```

本质和 `std::pair` 一样——都是两个字符串组成一个结构体——但**变量有名字**。Cherno 认为这才是核心优势：代码即文档，调用者永远不会搞混哪个是哪个。性能上和 pair 完全没有区别（都是在栈上构造），代码却清晰得多。他总结道："我每次都回到结构体这个方案，因为它让代码更易读，而且你永远不会把字段搞混。"
