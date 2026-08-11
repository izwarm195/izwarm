---
title: "禁止在int乘int时不开long long"
slug: "cpp/examples/禁止在int乘int时不开long-long"
description: "在比赛中，根据数据范围分析清楚变量的取值范围是非常重要的。int 类型变量与 int 类型变量相乘，往往可能超出 int 类型可以表示的取值范围。"
publishDate: "2026-07-10"
createdAt: "2026-07-10T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["cpp","examples"]
series: ["CPP","Examples"]
---

## 问题描述
在比赛中，根据数据范围分析清楚变量的取值范围是非常重要的。int 类型变量与 int 类型变量相乘，往往可能超出 int 类型可以表示的取值范围。
现在，给出两个 int 类型变量 x、y 及其取值范围，请问 x×y 的值是否可能超过 int 类型可以表示的范围？
> 提示：int 类型可以表示的范围为 $[−2^{31}, 2^{31}−1]$，即 $[−2147483648, 2147483647]$
## 输入格式
输入共两行：
- 第一行为两个整数 $xl, xu$，表示变量 x 的取值范围为 $xl ≤ x ≤ xu$。
- 第二行为两个整数 $yl, yu$，表示变量 y 的取值范围为 $yl ≤ y ≤ yu$。
> 说明：对于测试数据，$0 ≤ xl ≤ xu < 2^{31}，0 ≤ yl ≤ yu < 2^{31}$。

## 输出格式
输出一行，是一个字符串：
- 若会超过，则输出 `long long int`；
- 若不会超过，则输出 `int`。

## 我的程序 
```cpp
#include <iostream>
#include <cstdlib>
long long int max(const long long int &a, const long long int &b) {
	if (std::llabs(a) > std::llabs(b))
		return a;
	else
		return b;
}

int main() {
	long long int xl, xu, yl, yu;
	std::cin >> xl >> xu;
	std::cin >> yl >> yu;
	long long int mul = max(xl, xu) * max(yl, yu);

	std::cout << "mul=" << mul << std::endl;
	std::cout << "max(xl,xu)=" << max(xl, xu) << std::endl;
	std::cout << "max(yl,yu)=" << max(yl, yu) << std::endl;

	if (mul < 0 && mul >= -2147483648) {
		std::cout << "int";
	}
	else if (mul >= 0 && mul <= 2147483647) {
		std::cout << "int";
	}
	else std::cout << "long long int";
}

```

## Notes
- 1、`abs` 可能不适用于 `long long int`
`<cmath>` 是否把 `std::abs` 注入全局命名空间是**实现定义**的，在某些编译器上会退化成 C 语言的 `abs(int)`，把 `long long` 截断为 `int` 再取绝对值——对超出 `int` 范围的值彻底错误。
**修正**：使用 `std::llabs`（C++11 起专为 `long long` 设计）或显式调用 `std::abs`
[CS 26-07-10 cstdlib](/notes/cpp/summaries/cstdlib/)
- 2、常考虑使用 `const` 引用
- 3、先除而非乘
```cpp
	if (xu > INTMAX / yu)
        cout << "long long int" << endl;
```

## 参考程序
```cpp
#include <iostream>
using namespace std;

int main() {
    unsigned int xl, xu, yl, yu;
    cin >> xl >> xu;
    cin >> yl >> yu;
    const long long INTMAX = 2147483647LL;
    if (xu > INTMAX / yu)
        cout << "long long int" << endl;
    else
        cout << "int" << endl;
    return 0;
}
```

