---
title: "Vector Optimizing"
slug: "cpp/summaries/vector-optimizing"
description: "https://www.youtube.com/watch?v HcESuwmlHEY"
publishDate: "2026-07-20"
createdAt: "2026-07-20T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

---

---
https://www.youtube.com/watch?v=HcESuwmlHEY
### **优化 `std::vector` 的核心理念：减少拷贝**

`vector` 慢的根本原因只有两个——**拷贝**和**重新分配内存**。所有优化手段都围绕这两点展开。

---

#### **拷贝从哪来？**

Cherno 用自定义 `Vertex` 类做了实验，在拷贝构造函数里加了一行 `std::cout << "Copied\n";`。向 vector 添加 3 个元素后，控制台打印了 **6 次 "Copied"**。

这 6 次拷贝由两部分构成：

1. **栈到堆的搬运（3 次）**：每个 `Vertex` 对象先在 `main` 的栈上构造，`push_back` 时再拷贝到 vector 在堆上分配的内存里。
2. **扩容时的旧数据搬迁（3 次）**：vector 默认容量从 1→2→3 逐次增长，每次扩容都需要把旧数据全部拷贝到新内存。具体来说：加第 2 个元素时拷贝 1 个旧元素，加第 3 个时拷贝 2 个旧元素，合计 $1 + 2 = 3$ 次。

   ---

#### **优化策略 1：`reserve` —— 杜绝扩容**

```cpp
std::vector<Vertex> vertices;
vertices.reserve(3);  // 提前申请好 3 个元素的空间
```

`reserve(n)` 直接向系统申请一块能容纳 n 个对象的**原始内存**，不构造任何对象。这样后续 `push_back` 时容量始终够用，永远不会触发扩容搬迁。

需要注意的是 `reserve` 和 `resize` / `vector(n)` 完全不同——后者会调用默认构造函数创建 n 个对象，而 `reserve` 只分配裸内存。视频中演示了如果在构造函数里传 3，会因为 `Vertex` 没有默认构造函数而编译失败。

加上 `reserve(3)` 后，3 个元素的拷贝次数从 6 降到了 **3**（只剩栈到堆的搬运）。

---

#### **优化策略 2：`emplace_back` —— 原地构造**

```cpp
// 之前：先在栈上构造，再拷贝进 vector
vertices.push_back(Vertex(1, 2, 3));

// 之后：直接把构造参数传给 vector，在 vector 内部构造
vertices.emplace_back(1, 2, 3);
```

`emplace_back` 接收的是**构造函数的参数列表**，而不是一个已构造好的对象。它利用可变参数模板和完美转发，直接在 vector 管理的内存上调用构造函数，彻底消除了临时对象的创建和拷贝步骤。

结合 `reserve(3)` + `emplace_back`，控制台干干净净——**0 次拷贝**。

---

#### **最终最佳实践**

```cpp
std::vector<Vertex> vertices;
vertices.reserve(3);                    // 提前分配内存
vertices.emplace_back(1, 2, 3);         // 直接在 vector 内部构造
vertices.emplace_back(4, 5, 6);
vertices.emplace_back(7, 8, 9);
```

---

#### **底层启示**

Cherno 反复强调一个原则——**了解你的环境（Know Your Environment）**。优化不是靠玄学，而是弄清楚三件事：数据存在哪里（栈还是堆）、什么时候会触发拷贝、什么时候会触发内存分配。你越清楚这些底层机制，就越能自然地写出高效的代码。这节课只是优化的开胃菜，后续系列会深入到缓存行对齐、自定义分配器等更底层的主题。
