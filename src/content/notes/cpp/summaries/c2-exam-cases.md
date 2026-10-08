---
title: "二级C++上机综合案例三例"
slug: "cpp/summaries/c2-exam-cases"
description: "案例 主线 覆盖的核心语法 真题原型"
publishDate: "2026-09-18"
createdAt: "2026-09-18T00:00:00Z"
tags: ["cpp","summaries","ncre","上机题"]
series: ["CPP","Summaries"]
---

---

---

# 二级 C++ 上机综合案例三例：一次串完核心语法

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**这份笔记怎么用**
> 用**三个完整可运行的程序**覆盖二级 C++ 上机题（基本操作题 18 分 / 简单应用题 24 分 / 综合应用题 18 分）真正会考的核心语法。每个案例都是"题目要求 → 完整代码 → 实测输出 → 逐段语法点评 → 易错点 → 变形追问"。
> 代码已在 **MSVC（VS2022, C++14）实测编译运行通过**，输出为真实运行结果，可直接抄进 IDE 对照。
> 三个案例的题型原型都来自 `第5版.pdf` 里 2011—2015 年 10 套真题的综合应用题。
> 公共基础部分（选择题 1–10 题）见 [CS 26-09-18 二级C++选择题公共基础知识速补](/notes/cpp/summaries/c2-basics/)。

## 0. 语法地图：三个案例怎么分工

| 案例 | 主线 | 覆盖的核心语法 | 真题原型 |
|---|---|---|---|
| **案例一** Student 成绩册 | 类与对象 | 访问权限、构造/析构、初始化列表、**常数据成员与常成员函数**、**静态数据成员与静态成员函数**、对象数组、**深拷贝（拷贝构造）**、new/delete | 2013年3月（类与对象：静态/常/友元）、2014年9月（Date 类：成员、默认构造、重载构造、常成员函数类外定义） |
| **案例二** 人员管理 | 继承与多态 | 三种继承方式与访问权限、**派生类构造/析构顺序**、**基类指针 + 虚函数（动态绑定）**、非虚函数对照（静态绑定）、**虚析构**、纯虚函数与抽象类、同名隐藏、**虚继承消二义** | 2012年3月（Planet/Earth 派生类构造与成员函数）、2011年3月（A/B/C/D 虚继承 + 类名限定作用域） |
| **案例三** 复数 + 模板 + 文件 | 运算符重载 / 模板 / 流 | **成员与非成员运算符重载**、返回引用支持链式、运算符重载的限制、**函数模板**、**类模板与非类型模板参数**、ostream 重载、iomanip 格式控制、fstream 读写 | 2011年9月（函数模板 insert）、2012年9月（字符串处理与字符数组）、2015年9月（字符数组反转 + 类 + 静态函数） |

> 一句话记忆：**案例一考"一个类自己怎么写好"，案例二考"类与类之间怎么联动"，案例三考"把类用得像内置类型一样顺手"。**

---

# 案例一：Student 成绩册（类与对象核心语法）

## 题目要求

设计一个 `Student` 类，保存姓名（`char*`，动态申请）、分数、学号；要求：

1. 支持"姓名 + 分数 + 学号"的构造，且能省参数（默认值）；
2. 学号是**常量**，创建后不可改；
3. 用**静态成员**统计当前存在的学生对象个数，并能用 `Student::getTotal()` 直接查询；
4. 提供**常成员函数**读取姓名、分数、学号，使其能作用于 `const` 对象与常引用；
5. 支持**对象数组**，并提供拷贝构造，使"复制一个学生再改分数"不影响原对象。

## 完整代码

```cpp
#include <iostream>
#include <cstring>
using namespace std;

class Student {
public:
    // 构造函数重载（带默认参数）+ 初始化列表
    Student(const char* n = "noname", double s = 0.0, int no = 0)
        : id(no), score(s), changes(0)      // 常数据成员 id 只能用初始化列表赋值
    {
        name = new char[strlen(n) + 1];     // 自己申请内存 → 必须自己释放
        strcpy(name, n);
        ++total;                            // 静态成员：所有对象共享一份
    }

    // 拷贝构造函数：深拷贝，否则两个对象指向同一块内存（double free）
    Student(const Student& other)
        : id(other.id), score(other.score), changes(0)
    {
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);
        ++total;
    }

    ~Student() { delete[] name; --total; }

    // 常成员函数：不修改对象状态，const 对象/常引用也能调用
    const char* getName() const { return name; }
    double getScore() const { return score; }
    int getId() const { return id; }
    int getChanges() const { return changes; }

    void setScore(double s) { score = s; ++changes; }   // 普通成员函数可修改状态

    // 静态成员函数：没有 this 指针，只能访问静态成员，可用 类名:: 直接调用
    static int getTotal() { return total; }

private:
    char* name;
    double score;
    const int id;          // 常数据成员
    int changes;
    static int total;      // 静态数据成员：类内声明
};

int Student::total = 0;    // 类外定义并初始化（只此一次）

// 形参是 const 对象数组 → 内部只能调用常成员函数
double average(const Student arr[], int n) {
    double sum = 0;
    for (int i = 0; i < n; ++i) sum += arr[i].getScore();
    return n ? sum / n : 0;
}

int main() {
    cout << "0) 还没有对象，静态成员 = " << Student::getTotal() << endl;

    Student s[3] = { Student("Alice", 92.5, 1),
                     Student("Bob",   88.0, 2),
                     Student("Cara",  95.5, 3) };
    cout << "1) 建完对象数组，对象数 = " << Student::getTotal() << endl;

    Student copy(s[0]);                       // 显式调用拷贝构造函数
    cout << "2) 拷贝一份后，对象数 = " << Student::getTotal() << endl;

    copy.setScore(100.0);
    cout << "3) 原件 " << s[0].getName() << " = " << s[0].getScore()
         << "；副本 " << copy.getName() << " = " << copy.getScore() << endl;
    cout << "   原件修改次数 = " << s[0].getChanges()
         << "，副本修改次数 = " << copy.getChanges() << endl;

    {
        Student temp("Temp", 60.0, 9);
        cout << "4) 进入块内，对象数 = " << Student::getTotal() << endl;
    }
    cout << "5) 走出块（析构一个），对象数 = " << Student::getTotal() << endl;

    const Student& best = s[2];               // 常引用
    cout << "6) 常引用只能调常成员函数：" << best.getName()
         << " " << best.getScore() << endl;

    cout << "7) 平均分 = " << average(s, 3) << endl;
    return 0;
}
```

## 运行结果（MSVC 实测）

```text
0) 还没有对象，静态成员 = 0
1) 建完对象数组，对象数 = 3
2) 拷贝一份后，对象数 = 4
3) 原件 Alice = 92.5；副本 Alice = 100
   原件修改次数 = 0，副本修改次数 = 1
4) 进入块内，对象数 = 5
5) 走出块（析构一个），对象数 = 4
6) 常引用只能调常成员函数：Cara 95.5
7) 平均分 = 92
```

> 第 3 行是关键证据：**改副本没有影响原件**，说明拷贝构造做了深拷贝。如果把拷贝构造函数删掉（用编译器默认的），第 3 行会变成"原件也是 100"，而且程序结束时会**重复释放同一块内存而崩溃**（double free）——这就是改错题最爱埋的雷。

## 逐段语法点评

| 代码位置 | 语法点 | 考法 |
|---|---|---|
| `Student(...) : id(no), score(s), changes(0)` | **初始化列表**；`const` 数据成员、引用成员、无默认构造的成员对象**只能**在初始化列表里赋值 | 改错/填空：常数据成员在函数体里 `id = no;` 是错的 |
| `name = new char[strlen(n)+1]; strcpy(...)` | 动态内存 + `<cstring>` 的 `strlen/strcpy`（考点：`strlen` **不含 `\0`**，所以申请要 **+1**） | 填空：占坑题高频 |
| `Student(const Student& other)` | **拷贝构造函数**，形参必须是**同类对象的引用**（不能传值，否则无限递归） | 选择题：拷贝构造的形参形式 |
| `delete[] name;` | 数组 new 要用 **`delete[]`** 配对 | 改错题常把 `delete[]` 写成 `delete` |
| `const char* getName() const` | **常成员函数**：`const` 放在参数表之后；不能修改数据成员，也不能调用非常成员函数 | 选择题：`const` 位置的含义 |
| `static int total;` + `int Student::total = 0;` | **静态数据成员**：类内声明、**类外定义并初始化**（不写 `static`），全类共享一份 | 填空/改错：类外定义漏写或写成 `static int Student::total = 0;` 都是错的 |
| `static int getTotal()` | **静态成员函数**：无 `this`，**只能访问静态成员**，可 `类名::` 直接调用 | 选择题：静态成员函数能否访问普通数据成员 |
| `Student s[3] = {...}` | **对象数组**：每个元素都调一次构造函数；析构时按**逆序**逐个析构 | 选择题：数组长度为 n 就调 n 次构造 |
| `average(const Student arr[], int n)` | `const` 对象只能调用**常成员函数** | 改错：`arr[i].getScore()` 若没有 `const` 修饰则编译失败 |
| 注释里被刻意排除的两行 | `best.setScore(1);` 对常对象调非常成员函数 → **编译错误** | 选择题：常对象只能调常成员函数 |

## 易错点 / 改错题高频

1. **常数据成员只能在初始化列表里赋值**，任何函数体里的赋值都是编译错误。
2. **静态数据成员必须在类外定义一次**（`int Student::total = 0;`），否则链接错误；`static` 关键字在类外定义中不再写。
3. **静态成员函数没有 `this`**，因此不能访问非静态成员，也不能声明为 `const`。
4. **浅拷贝陷阱**：类里有指针成员却没有自定义拷贝构造 → 两个对象共用内存 → 修改互相影响 + double free。判据就是"有没有 `new`/`delete`"。
5. `const` 的三种位置别混：`const char* p`（指向常量）、`char* const p`（指针本身是常量）、`void f() const`（常成员函数）。
6. 对象数组的构造次数 = 元素个数；**析构顺序与构造顺序相反**。

## 变形与追问

- **加一个友元函数**：`friend double total(const Student&, const Student&);`——友元不是成员函数，没有 `this`，但可以访问私有成员；真题（2013年3月）常与静态成员一起考。
- **加一个常数据成员 `static const int MAX = 100;`**：整型静态常成员可以在类内直接初始化。
- **改写成类外定义成员函数**：真题（2014年9月 Date 类）要求"完成成员函数 `print()` 的类外定义"，注意写成 `void Student::print() const { ... }` —— **类外定义也要补上 `const`**，这是最常见的丢分点。
- **对象指针与 `new`**：`Student* p = new Student("Zed", 70, 4); ... delete p;`——用 `new` 创建对象同样调用构造函数，只是这次由你负责 `delete`。

  ---

# 案例二：人员管理（继承、虚函数与多态）

## 题目要求

设计 `Person`（抽象基类）、`Student`、`Teacher` 三个类：

1. `Person` 有姓名与纯虚函数 `show()`，并能作为基类指针指向派生类对象，通过指针调用时行为取**实际对象**的版本；
2. 派生类构造时先调用基类构造，析构时相反；
3. 用**基类指针数组**统一管理不同派生类对象，并能正确 `delete`（不泄漏）；
4. 演示**同名函数隐藏**与**虚继承解决菱形继承二义性**（真题 2011年3月的 A/B/C/D）。

## 完整代码

```cpp
#include <iostream>
#include <string>
using namespace std;

// ---------- A/B/C/D：抽象基类 + 虚函数 + 虚析构 ----------
class Person {
public:
    Person(const string& n) : name(n) { cout << "    Person 构造 -> " << name << endl; }
    virtual ~Person() { cout << "    Person 析构 -> " << name << endl; }
    virtual void show() const = 0;                     // 纯虚函数 → Person 是抽象类
    void whoAmI() const { cout << "    我是 Person（非虚函数：静态绑定）" << endl; }
    const string& getName() const { return name; }
protected:
    string name;                                        // protected：派生类可用，外部不可
};

class Student : public Person {
public:
    Student(const string& n, int i) : Person(n), id(i)
    { cout << "    Student 构造 -> " << n << endl; }
    ~Student() { cout << "    Student 析构 -> " << name << endl; }
    void show() const { cout << "    学生 " << name << "，学号 " << id << endl; }
    void whoAmI() const { cout << "    我是 Student（非虚函数：静态绑定）" << endl; }
private:
    int id;
};

class Teacher : public Person {
public:
    Teacher(const string& n, const string& t) : Person(n), title(t)
    { cout << "    Teacher 构造 -> " << n << endl; }
    ~Teacher() { cout << "    Teacher 析构 -> " << name << endl; }
    void show() const { cout << "    教师 " << name << "，职称 " << title << endl; }
    void whoAmI() const { cout << "    我是 Teacher（非虚函数：静态绑定）" << endl; }
private:
    string title;
};

// ---------- E：菱形继承与虚继承（2011 年 3 月真题原型） ----------
class MyClassA {
public:
    void fun() { cout << "MyClassA::fun" << endl; }
    int data;
};

class MyClassB : virtual public MyClassA {              // 虚继承：只保留一份 A 子对象
public:
    void fun() { cout << "MyClassB::fun" << endl; }
};

class MyClassC : virtual public MyClassA {
public:
    void fun() { cout << "MyClassC::fun" << endl; }
};

class MyClassD : public MyClassB, public MyClassC {
public:
    void fun() {
        cout << "MyClassD::fun" << endl;
        MyClassB::fun();            // 用 类名:: 限定作用域，避开同名隐藏与二义性
        MyClassC::fun();
        MyClassA::fun();            // 虚继承下 A 只有一份，这句才不产生二义性
    }
};

int main() {
    cout << "** A. 派生类对象的构造 / 析构顺序 **" << endl;
    {
        Student s("Wang", 3);
        cout << "    （块结束，先析构派生类，再析构基类）" << endl;
    }

    cout << "\n== B. 基类指针 + 虚函数 = 动态绑定 ==" << endl;
    Person* ps[3];
    ps[0] = new Student("Wang", 3);
    ps[1] = new Teacher("Li", "教授");
    ps[2] = new Student("Zhao", 8);
    for (int i = 0; i < 3; ++i) ps[i]->show();          // 调用的都是"实际对象"的版本

    cout << "\n== C. 同一个指针调非虚函数 = 静态绑定 ==" << endl;
    for (int i = 0; i < 3; ++i) ps[i]->whoAmI();        // 全部打印 Person 版本

    cout << "\n** D. 删除对象：虚析构函数才不泄漏 **" << endl;
    for (int i = 0; i < 3; ++i) delete ps[i];

    cout << "\n** E. 虚继承消除菱形继承的二义性 **" << endl;
    MyClassD d;
    d.fun();
    d.data = 1;                                          // 只有一份 A，故不二义
    cout << "d.data = " << d.data << endl;
    return 0;
}
```

## 运行结果（MSVC 实测）

```text
** A. 派生类对象的构造 / 析构顺序 **
    Person 构造 -> Wang
    Student 构造 -> Wang
    （块结束，先析构派生类，再析构基类）
    Student 析构 -> Wang
    Person 析构 -> Wang

== B. 基类指针 + 虚函数 = 动态绑定 **
    Person 构造 -> Wang
    Student 构造 -> Wang
    Person 构造 -> Li
    Teacher 构造 -> Li
    Person 构造 -> Zhao
    Student 构造 -> Zhao
    学生 Wang，学号 3
    教师 Li，职称 教授
    学生 Zhao，学号 8

** C. 同一个指针调非虚函数 = 静态绑定 **
    我是 Person（非虚函数：静态绑定）
    我是 Person（非虚函数：静态绑定）
    我是 Person（非虚函数：静态绑定）

** D. 删除对象：虚析构函数才不泄漏 **
    Student 析构 -> Wang
    Person 析构 -> Wang
    Teacher 析构 -> Li
    Person 析构 -> Li
    Student 析构 -> Zhao
    Person 析构 -> Zhao

** E. 虚继承消除菱形继承的二义性 ==
MyClassD::fun
MyClassB::fun
MyClassC::fun
MyClassA::fun
d.data = 1
```

> BC 两段放在一起看最有价值：**同一个 `Person*` 指针，调 `show()`（虚函数）按实际对象走，调 `whoAmI()`（非虚函数）一律按指针的静态类型 `Person` 走**。这正是 2012年3月真题解析强调的那句话："要想通过指向派生类对象的基类指针调用派生类的成员函数版本，就必须把基类的该函数声明为虚函数。"

## 逐段语法点评

| 代码位置 | 语法点 | 考法 |
|---|---|---|
| `class Student : public Person` | **公有继承**：基类 public → public，protected → protected；私有继承会让基类成员在派生类里降为 private | 选择题：三种继承方式下访问权限的变化 |
| `Student(...) : Person(n), id(i)` | **派生类构造函数必须调用基类构造函数**（不写就调基类默认构造，基类没有默认构造就报错） | 填空/改错：初始化列表里漏掉基类构造 |
| 运行结果 A 段 | **构造顺序：基类 → 派生类；析构顺序：派生类 → 基类** | 选择题：几乎必考 |
| `virtual void show() const = 0;` | **纯虚函数**；含纯虚函数的类是**抽象类**，不能实例化，但可定义指针/引用 | 选择题：抽象类能否创建对象 |
| `Person* ps[3]; ps[i]->show();` | **基类指针 + 虚函数 = 动态绑定**（运行时按实际对象找函数版本） | 综合应用/选择：给出输出结果 |
| `whoAmI()` 非虚 | **静态绑定**：编译期就按指针类型决定调哪个版本；派生类同名函数会**隐藏**基类版本 | 选择/改错：为什么输出全是基类版本 |
| `virtual ~Person()` | **虚析构函数**：通过基类指针 `delete` 派生类对象时，保证派生类析构函数被调用 | 选择题：不写虚析构会怎样（派生类资源不释放） |
| `protected: string name;` | protected 成员：派生类内部可用，类外不可访问 | 填空：Planet/Earth 真题里的 `distance/revolve` 就是 protected |
| `MyClassD::fun()` 里 `MyClassB::fun()` | 用 **`类名::` 限定作用域**调用被隐藏的基类函数 | 填空：真题第 4 处填空就是写这句 |
| `class MyClassB : virtual public MyClassA` | **虚继承**：菱形继承时只保留一份公共基类子对象，消除二义性 | 填空：2011年3月真题 1、2、3 处填空 |

## 易错点 / 改错题高频

1. **派生类构造函数必须"负责"基类构造**：在初始化列表里写 `: Person(n)`；否则编译器会去找基类的**默认构造函数**，找不到就报错。
2. **虚函数必须"声明与定义一致"**：派生类里写 `void show() const`，基类的 `const` 不能丢，否则不构成覆盖（override），而是**隐藏**，多态失效。
3. **虚函数在派生类中自动是虚函数**，可以省略 `virtual`，但写上更清楚（考试阅卷也认）。
4. **同名隐藏**：派生类定义了与基类同名的函数（哪怕参数不同、非虚），基类所有同名重载版本都被隐藏，要 `Base::f()` 才能调。
5. **`delete` 基类指针必须有虚析构**，否则只调基类析构，派生类里 `new` 的资源泄漏。
6. **虚继承只在菱形继承时需要**；写成 `virtual public`，位置在继承方式前。
7. 派生类**不能直接访问基类的 private 成员**——编译器报错，这就是"为什么真题里 1 处填空要填 protected"。

## 变形与追问

- **纯虚函数 → 普通虚函数**：把 `= 0` 去掉就能实例化 `Person`，这时 `Person p("x")` 合法，`p.show()` 调基类版本。
- **虚函数返回基类指针/引用**（链式调用）与**虚析构**组合，是"多态 + 内存管理"的综合考法。
- **虚基类的构造顺序**：虚基类子对象**最先**构造，其后才按继承顺序构造普通基类；析构相反。
- **基类指针数组 + 循环调用**：考试常给你一段 main，让你写出输出结果（一定会用到"虚函数按实际对象、非虚函数按静态类型"这条）。

  ---

# 案例三：复数 + 模板 + 文件（运算符重载、模板、流）

## 题目要求

1. 写一个 `Complex` 类，要求 `+`、`+=`、`-`（负号）、`[]`、`==`、`<<` 都能像内置类型一样用，`c1 += c2 += c3` 能连续写；
2. 写**函数模板** `bubbleSort`，同一份代码既能排 `double` 数组也能排 `string` 数组；
3. 写**类模板** `Stack<T, N>`，容量用非类型模板参数给定，并演示"栈满"边界；
4. 用 `ofstream/ifstream` + `iomanip` 把数据写文件再读回，验证格式控制。

## 完整代码

```cpp
#include <iostream>
#include <iomanip>
#include <fstream>
#include <string>
using namespace std;

// ---------- 1. 函数模板：一份代码排不同类型的数组 ----------
template <typename T>
void bubbleSort(T a[], int n) {
    for (int i = 0; i < n - 1; ++i)
        for (int j = 0; j < n - 1 - i; ++j)
            if (a[j] > a[j + 1]) { T t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
}

template <typename T>
void printArray(const T a[], int n, const char* tag) {
    cout << tag << ": ";
    for (int i = 0; i < n; ++i) cout << a[i] << " ";
    cout << endl;
}

// ---------- 2. 类模板 + 非类型模板参数：定长栈 ----------
template <class T, int N = 8>
class Stack {
public:
    Stack() : top(0) {}
    bool push(const T& v) {
        if (top == N) return false;
        data[top++] = v;
        return true;
    }
    bool pop(T& v) {
        if (top == 0) return false;
        v = data[--top];
        return true;
    }
    bool empty() const { return top == 0; }
    static int capacity() { return N; }        // 静态成员函数返回非类型模板参数
private:
    T data[N];
    int top;
};

// ---------- 3. 运算符重载：复数类 ----------
class Complex {
    // << 的左操作数是 ostream，必须重载为非成员函数，故声明为友元
    friend ostream& operator<<(ostream& os, const Complex& c);
    friend Complex operator+(const Complex& a, const Complex& b);
public:
    Complex(double r = 0, double i = 0) : re(r), im(i) {}

    Complex& operator+=(const Complex& c) {     // 返回引用 → 支持链式调用
        re += c.re;
        im += c.im;
        return *this;
    }
    Complex operator-() const { return Complex(-re, -im); }   // 单目运算符
    double operator[](int i) const { return i ** 0 ? re : im; } // [] 只能重载为成员函数
    bool operator**(const Complex& c) const { return re ** c.re && im ** c.im; }

private:
    double re, im;
};

ostream& operator<<(ostream& os, const Complex& c) {
    os << c.re << (c.im >= 0 ? "+" : "") << c.im << "i";
    return os;                                   // 返回流引用，才能 cout << a << b
}

Complex operator+(const Complex& a, const Complex& b) {
    return Complex(a.re + b.re, a.im + b.im);
}

int main() {
    cout << "** 1. 函数模板：同一份代码处理 double 与 string **" << endl;
    double d[5] = { 3.5, 1.2, 9.8, 4.4, 2.0 };
    string w[4] = { "pear", "apple", "orange", "banana" };
    bubbleSort(d, 5);  printArray(d, 5, "  double 排序后");
    bubbleSort(w, 4);  printArray(w, 4, "  string 排序后");

    cout << "\n** 2. 类模板 + 非类型模板参数 **" << endl;
    Stack<int> si;                       // 省略第二个参数，用默认 N = 8
    Stack<string, 3> ss;                 // 显式指定容量 3，写满即失败的边界
    for (int i = 1; i <= 3; ++i) si.push(i * 11);
    cout << "  Stack<int> 容量 = " << Stack<int>::capacity()
         << "，栈内元素（出栈顺序）：";
    int v;
    while (si.pop(v)) cout << v << " ";
    cout << endl;
    cout << "  Stack<string,3> push 四次的结果：";
    const char* words[4] = { "one", "two", "three", "four" };
    for (int i = 0; i < 4; ++i)
        cout << (ss.push(words[i]) ? "ok " : "满 ");
    cout << endl;

    cout << "\n** 3. 运算符重载 **" << endl;
    Complex c1(1, 2), c2(3, -4), c3(0.5, 0.5);
    cout << "  c1 = " << c1 << "，c2 = " << c2 << endl;
    cout << "  c1 + c2 = " << c1 + c2 << "（非成员 operator+）" << endl;
    c1 += c2 += c3;                       // 返回引用，可以链式
    cout << "  c1 += c2 += c3 之后：" << c1 << " / " << c2 << endl;
    cout << "  -c1 = " << -c1 << "，c1[0] = " << c1[0] << "，c1[1] = " << c1[1] << endl;
    cout << "  c1 ** c1 ？" << (c1 ** c1 ? "true" : "false")
         << "；c1 ** c2 ？" << (c1 ** c2 ? "true" : "false") << endl;

    cout << "\n** 4. 文件流 + iomanip 格式控制 **" << endl;
    const char* path = "case3_out.txt";
    ofstream fout(path);                  // 写出
    if (!fout) { cout << "  文件打开失败" << endl; return 1; }
    fout << fixed << setprecision(2);
    fout << c1[0] << " " << c1[1] << endl;
    fout << "总分 " << setw(8) << 276.5 << endl;
    fout.close();

    ifstream fin(path);                   // 读回
    double re, im;
    string label;
    double total;
    fin >> re >> im;
    fin >> label >> total;
    cout << "  读回：re = " << re << "，im = " << im
         << "，" << label << " = " << total << endl;
    cout << "  按 3 位小数格式打印总分：" << fixed << setprecision(3) << total << endl;
    fin.close();
    return 0;
}
```

## 运行结果（MSVC 实测）

```text
** 1. 函数模板：同一份代码处理 double 与 string **
  double 排序后: 1.2 2 3.5 4.4 9.8 
  string 排序后: apple banana orange pear 

** 2. 类模板 + 非类型模板参数 **
  Stack<int> 容量 = 8，栈内元素（出栈顺序）：33 22 11 
  Stack<string,3> push 四次的结果：ok ok ok 满 

** 3. 运算符重载 **
  c1 = 1+2i，c2 = 3-4i
  c1 + c2 = 4-2i（非成员 operator+）
  c1 += c2 += c3 之后：4.5-1.5i / 3.5-3.5i
  -c1 = -4.5+1.5i，c1[0] = 4.5，c1[1] = -1.5
  c1 ** c1 ？true；c1 ** c2 ？false

** 4. 文件流 + iomanip 格式控制 **
  读回：re = 4.5，im = -1.5，总分 = 276.5
  按 3 位小数格式打印总分：276.500
```

## 逐段语法点评

| 代码位置 | 语法点 | 考法 |
|---|---|---|
| `template <typename T> void bubbleSort(T a[], int n)` | **函数模板**：`typename T` 与 `class T` 等价；编译器按实参推导 `T` | 填空：真题（2011年9月）`insert` 函数模板的形参表声明 |
| `bubbleSort(d, 5)` / `bubbleSort(w, 4)` | **模板实参推导**，通常不用写 `bubbleSort<double>(...)` | 改错：显式写错的模板实参 |
| `template <class T, int N = 8> class Stack` | **类模板 + 非类型模板参数**（`int N` 是值不是类型） | 填空/改错：`template<class T, int N>` 的写法 |
| `Stack<int> si;` / `Stack<string, 3> ss;` | 类模板**必须显式给实参**（不能像函数模板那样推导）；第二个参数可用默认值 | 选择：类模板的实例化 |
| `static int capacity() { return N; }` | 静态成员函数可以返回非类型模板参数 | 综合应用：模板类里写静态成员 |
| `friend ostream& operator<<(...)` | **`<<` 必须是非成员函数**（左操作数是流），要在类里声明为**友元**才能访问私有成员 | 选择题：哪些运算符只能重载为成员函数 |
| `Complex& operator+=(const Complex&)` | **返回引用 `*this`** 才能支持 `a += b += c` 链式；返回 `Complex` 也能用但多一次拷贝 | 改错：返回类型写成 `void` 或 `Complex` 的后果 |
| `Complex operator-() const` | **单目运算符重载**，无参数 | 选择：单目/双目重载的参数个数 |
| `double operator[](int i) const` | `[]` 只能重载为**成员函数** | 选择：`=`、`[]`、`()`、`->`、`?:` 及类型转换运算符**只能**作成员重载 |
| `operator+` 定义在类外 | 非成员重载可让"左操作数隐式转换"也生效（`1.5 + c` 也能用） | 综合应用：为什么要写成友元+非成员 |
| `if (!fout) {...}` | 流对象可作条件判断是否打开成功 | 填错：忘记判断文件是否打开 |
| `fixed << setprecision(2)` / `setw(8)` | `<iomanip>` 的格式控制；`setw` 只对**下一个**输出有效，`fixed/setprecision` 持续生效 | 选择/填空：输出格式题 |
| `while (si.pop(v))` | 用 `bool` 返回值控制循环，顺带演示栈空/栈满边界 | 综合应用 |

## 易错点 / 改错题高频

1. **运算符重载的限制（按题库口径背这一句）**：`=`、`[]`、`()`、`->`（有的题写 `->*`）、`?:` 这五个运算符以及所有类型转换运算符**只能**作为成员函数重载；`<<`/`>>` 因为左操作数是流，通常重载为**非成员 + 友元**。
2. **不能改变运算符原有的操作数个数**：`+` 仍是双目，`-` 作为负号仍是单目。
3. **不能发明新运算符**（如 `**`），`.`、`::`、`.*`、`sizeof` 明确不可重载。
   > <img class="callout-badge" src="/media/icons/triangle-exclaimation.svg" alt="warning">**口径提示**
   > 严格按 ISO C++ 标准，`?:` 是**根本不能重载**的；但题库/本书把 `?:` 算进了上面那"只能作成员函数重载"的五项里。**应试按题库口径作答**（问"哪些只能作成员函数重载"就选这五项），知道这个分歧即可，别在考场上纠结。
4. **`+=` 返回引用**才会返回左值、支持链式；**`+` 返回对象**（或 const 对象）而不是引用，因为它是新值。
5. **`operator<<` 必须返回 `ostream&`**，否则 `cout << a << b` 会编译失败。
6. **类模板不能省略实参**；函数模板通常可以推导。
7. **`setw` 是一次性的**，`setprecision` 配合 `fixed` 才固定小数位。
8. **文件流用完 `close()`**；`ifstream` 读不到数据时流处于失败状态，之后的读操作都无效（真题常考"读回结果与写入不一致的原因"）。

## 变形与追问

- **拷贝赋值运算符**：`Complex& operator=(const Complex&)`——若类里有指针成员（如案例一），**必须自己写并处理自赋值**（`if (this ** &c) return *this;`），否则浅拷贝 double free。
- **模板 + 运算符重载**：把 `Complex` 写成 `template <class T> class ComplexT`，`+`/`<<` 也跟着模板化，这是"综合应用题压轴"的常见形态。
- **字符串处理（2012年9月真题）**：`strlen` 求长度、`strcpy` 连 `\0` 一起拷、`strcat` 拼接、`strcmp` 比较（>`0` 返回正数、`**0` 相等）；字符数组逆序就是"首尾对称交换到中间"。
- **枚举与符号常量（2014年9月真题）**：`enum{a, b, c=5, d};` → `a=0, b=1, c=5, d=6`；未赋值的枚举值在前一个基础上 +1；枚举表用**逗号**分隔、整体以**分号**结束。

  ---

# 附 A：考试环境与编译提示

| 项目 | 老环境（考试用 VC6） | 现代编译器（VS2022 / g++） |
|---|---|---|
| 头文件 | `#include <iostream.h>`，无命名空间问题 | `#include <iostream>` + `using namespace std;`（否则要写 `std::cout`）——**这是 2015年3月改错题的原考点** |
| `main` | 常见 `void main()` | 标准要求 `int main()`，末尾 `return 0;` |
| 字符串函数 | `<string.h>` | `<cstring>` |
| 一句提醒 | 考试按题目给的框架写，**不要改动 main 和其他已有代码** | 若源码存为 UTF-8 而编译器按 GBK 解读，中文注释会报奇怪的语法错误：加 `/utf-8`（MSVC）或存成 GB2312/BOM |
| 常用编译命令 | — | MSVC：`cl /EHsc /W3 /utf-8 文件.cpp`；g++：`g++ -std=c++14 -Wall 文件.cpp -o 文件` |

> 本笔记本地的验证环境：`_codex_cases\build.bat`（调用 VS2022 `vcvars64.bat` + `cl /EHsc /W3 /utf-8`），三个案例均编译运行通过、零错误（案例一有 `strcpy` 的安全性警告 C4996，考场上常见，加 `#define _CRT_SECURE_NO_WARNINGS` 可消除）。

# 附 B：核心语法速查表（按考法归档）

| 语法主题 | 必须能背出来的点 | 主要考法 | 对应案例 |
|---|---|---|---|
| 类与访问权限 | public / protected / private 三档；默认 private（class）/ public（struct） | 选择、填空 | 案例一 |
| 构造函数 | 与类同名、无返回类型、可重载、可带默认参数；**初始化列表**给 const/引用成员赋值 | 填空、改错 | 案例一 |
| 拷贝构造 | 形参为 `const 类名&`；有指针成员就要深拷贝 | 选择、改错 | 案例一 |
| 析构函数 | 无参无返回、不可重载；`new[]` 配 `delete[]` | 选择、改错 | 案例一 |
| 常成员 | `const` 数据成员只能初始化列表；`函数() const` 可作用于常对象 | 选择、改错 | 案例一 |
| 静态成员 | 数据成员类内声明+类外定义；函数成员无 `this`，只访问静态成员，可 `类名::` 调用 | 填空、选择 | 案例一 |
| 友元 | `friend` 声明在类内；不是成员，无 `this`，可访问私有成员 | 选择、填空 | 案例一/三 |
| 继承 | `class B : public A`；派生类构造先调基类构造，析构相反 | 选择、填空 | 案例二 |
| 虚函数与多态 | 基类指针/引用 + 虚函数 = 动态绑定；非虚函数 = 静态绑定 | 选择、综合应用 | 案例二 |
| 虚析构 | 通过基类指针 `delete` 派生类对象必须虚析构 | 选择 | 案例二 |
| 纯虚函数 | `= 0`；抽象类不能实例化；派生类必须实现 | 选择、填空 | 案例二 |
| 同名隐藏 | 派生类同名函数隐藏基类所有同名版本，需 `Base::f()` | 填空 | 案例二 |
| 虚继承 | `class B : virtual public A`；菱形继承只留一份基类子对象 | 填空 | 案例二 |
| 函数模板 | `template <typename T>`；实参可推导 | 填空、改错 | 案例三 |
| 类模板 | `template <class T, int N = 8>`；实参**不可省略** | 填空、改错 | 案例三 |
| 运算符重载 | `=`、`[]`、`()`、`->`、`?:` 只能成员；`+=` 返回引用；`<<` 非成员+友元，返回 `ostream&` | 选择、综合应用 | 案例三 |
| 字符串 | `strlen`（不含 `\0`）、`strcpy`（连 `\0` 拷）、`strcat`、`strcmp` | 填空（改错高频） | 案例三 |
| 枚举 | 未赋值从 0 递增；赋过值则其后 +1 | 选择、填空 | 案例三 |
| 文件与格式 | `ofstream/ifstream` + 打开成功判断 + `close()`；`fixed/setprecision/setw` | 填空、综合应用 | 案例三 |

# 附 C：三分钟自测

1. 常数据成员在构造函数体里赋值会怎样？（编译错误，只能初始化列表）
2. 静态数据成员为什么必须类外定义？类外还写不写 `static`？（只声明不定义会链接错误；类外不再写 `static`）
3. 类里有 `new` 却没写拷贝构造，会发生什么？（浅拷贝 → 互相影响 + double free）
4. 通过基类指针调虚函数和非虚函数，分别按谁的版本走？（虚函数按实际对象，非虚函数按指针静态类型）
5. 为什么基类析构要写成 `virtual`？（否则 `delete` 基类指针时派生类析构不被调用）
6. 哪些运算符只能重载为成员函数？（`=`、`[]`、`()`、`->`、`?:` 和类型转换运算符）
7. `operator<<` 为什么必须是非成员函数？（左操作数是 `ostream` 对象）
8. 类模板的实参能不能省略？函数模板呢？（类模板不能，函数模板通常可以推导）
9. `strlen("abcd")` 等于几？申请空间为什么要 +1？（等于 4；要留 `\0` 的位置）
10. 菱形继承的 `d.fun()` 报二义性怎么修？（虚继承 `virtual public`，或用 `类名::` 限定作用域）

   ---

> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**相关文件**
> - 三个案例的源码与一键编译脚本：`_codex_cases\case1_student.cpp`、`case2_person.cpp`、`case3_tools.cpp`、`build.bat`
> - 公共基础（选择题 1–10 题）速补：[CS 26-09-18 二级C++选择题公共基础知识速补](/notes/cpp/summaries/c2-basics/)
> - 真题素材来源：`第5版.pdf`（2011 年 3 月—2015 年 9 月共 10 套二级 C++ 真题）OCR 全文

