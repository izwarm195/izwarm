---
title: "cmath pow()"
slug: "cpp/summaries/cmath-pow"
description: "..."
publishDate: "2026-07-11"
createdAt: "2026-07-11T00:00:00Z"
updatedDate: "2026-08-04T12:25:14+08:00"
tags: ["cpp","summaries"]
series: ["CPP","Summaries"]
---

```cpp
...
int getinte(int a)
{
	int result{ 0 };
	int temp{ 0 };
	for (int i = 0; i < 3; i++)
	{
		result += (a % (pow(10, i + 1)) - temp) * static_cast<int>(pow(10, 2 - 2 * i));
		temp = a % static_cast<int>(pow(10, i + 1));
	}
	return result;
}
...
```
只能改成`static_cast<int>pow(...)` 而这样算出来的结果是错的。
### `pow` 在这段代码里有 **3 个严重问题**，外加 **1 个算法层面的设计问题**。

---

## 问题 1：`pow` 返回 `double`，传到 `%` 里是隐式窄化

`%` 要求两个操作数都是整数。你写的：

```cpp
a % (pow(10, i + 1))
```

`pow(10, i+1)` 返回 `double`（比如 `100.0`），编译器会把它隐式转换成 `int`。这本身语法上能通过（带警告），但埋下了问题 2 的雷。

---

## 问题 2：浮点精度 —— `pow(10, 2)` 可能是 `99.999999`

这是 `pow` 在整数场景下最经典的坑。`pow(10, 2)` 在浮点运算后可能得到：

```
99.99999999999999   // 而不是 100.0
```

`static_cast<int>(99.999...)` → `99`，而不是 `100`。整个数字提取逻辑就此崩盘。对于 `pow(10, n)` 在小整数 n 的范围内，某些平台/编译器下恰好是精确的，**但 C++ 标准不保证这一点**——这是一个定时炸弹。

---

## 问题 3：`pow(10, -2)` 被 `static_cast<int>` 截断为 `0`（致命）

看你的循环，当 `i = 2` 时：

```cpp
static_cast<int>(pow(10, 2 - 2 * 2))
= static_cast<int>(pow(10, -2))
= static_cast<int>(0.01)
= 0
```

乘以 `0` 意味着第 `i=2` 轮迭代**什么也不加**。这一轮本应提取百位数字放到个位，现在直接丢了。所以无论输入什么三位数，结果都是错的（缺最后一位）。

---

## 问题 4：用 `pow` 算整数幂本身就不合适

`pow` 走的是通用浮点指数运算（`exp(n * log(10))` 之类），对于 `10^0`、`10^1`、`10^2` 这种场景：
- **性能差**：整数乘法 1 个周期，`pow` 几百个周期
- **精度不可靠**：浮点舍入误差
- **可读性差**：别人要揣摩半天你这 `pow(10, 2-2*i)` 到底在算什么

---

## 修正建议：用整数算术代替 `pow`

你的 `getinte` 函数意图是把一个三位数（如 `123`）的数字顺序反转（得 `321`）。用 `pow` 完全是绕远路：

```cpp
int getinte(int a) {
    int ones  = a % 10;           // 个位
    int tens  = (a / 10) % 10;    // 十位
    int hundreds = a / 100;       // 百位
    return ones * 100 + tens * 10 + hundreds;  // 反转
}
```

零 `pow`，零浮点，零风险。

---

如果你非要保留循环风格（比如为了通用化），那用整数累乘替代 `pow`：

```cpp
int getinte(int a) {
    int result = 0;
    int multiplier = 100;   // 10^(n-1)，n=3
    for (int i = 0; i < 3; i++) {
        result += (a % 10) * multiplier;
        a /= 10;
        multiplier /= 10;
    }
    return result;
}
```

---

## 额外提醒：`deci` 的提取也有浮点隐患

```cpp
double deci{ ((original - inte) * 10) };
```

如果输入 `123.4`，`original - inte` 在 IEEE 754 下可能是 `0.3999999999...`，乘以 10 是 `3.999999999...`，存储为 `double` 显示时可能看到 `3.99999` 而非 `4.0`。

修正：加一个四舍五入：

```cpp
double deci{ std::round((original - inte) * 10) };
```

---

## 总结

| 问题                   | 原因                           | 修正        |
| -------------------- | ---------------------------- | --------- |
| `double` 传进 `%`      | `pow` 返回 `double`            | 用整数算术替代   |
| 浮点精度 `99.999` → `99` | `pow` 底层用浮点运算                | 用整数乘法/除法  |
| `pow(10, -2)` 截断为 0  | `static_cast<int>(0.01) = 0` | 避免负数幂     |
| 性能 + 可读性             | `pow` 是为浮点设计的                | 整数幂用循环或查表 |

一句话：**`pow` 是用来算 $2.5^{3.7}$ 的，不是用来算 $10^2$ 的。** 整数幂永远优先用整数运算。
