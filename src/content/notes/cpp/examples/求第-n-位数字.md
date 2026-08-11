---
title: "求第 n 位数字"
slug: "cpp/examples/求第-n-位数字"
description: "输入一个正整数 n，输出从 1 开始依次写下所有正整数后，第 n 位上的数字。例如：写下：12345678910111213..."
publishDate: "2026-07-12"
createdAt: "2026-07-12T00:00:00Z"
updatedDate: "2026-07-12"
tags: ["cpp","examples"]
series: ["CPP","Examples"]
---

# 问题描述
---
输入一个正整数 n，输出从 1 开始依次写下所有正整数后，第 n 位上的数字。例如：写下：12345678910111213...

| input  | 15  |
| ------ | --- |
| output | 2   |

# 我的程序
---
```cpp
#include <iostream>

int multipler(int s)
{
	int mul = 1;
	for (int i = 0; i < s; i++)
	{
		mul *= 10;
	}
	return mul;
}

int main()
{
	int num = 1;
	int digits = 1;
	int n;
	int size = 1;
	std::cin >> n;
	//找到粗略digits
	do
	{
		num++;
		size = num / 10 + 1;
		digits += size;
		//std::cout << digits << "\t " << num << std::endl;
		
	} while (digits < n);
	int delta = digits - n;
	//num最后一位向前减
	int result = (num % multipler(delta + 1) - num % multipler(delta)) / multipler(delta);
	std::cout << result;
}
```

# 参考程序
---

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int num = 1;    // 当前要处理的数字，从 1 开始。
    int count = 0;   // 记录目前已经写下了多少个数字。
    while (true) {    // 无限循环，直到找到第 n 个数字为止。
        int temp = num;    // 临时保存当前数字。
        // ---  计算当前数字 num 的位数 ---
        int digits = 0;
        int t = temp;
        while (t > 0) {
            digits++;    // 每除以 10 一次，位数加 1
            t /= 10;
        }
        // ---  判断第 n 个数字是否在当前数字 num 内 ---
        // 如果写下当前数字后，总长度 count + digits 达到了或超过了 n，
        // 说明目标数字在这个数里面。
        if (count + digits >= n) {
            // 求出目标数字在 num 中的位置：
            // 例如 n=11, count=9, digits=2 => pos = (9+2) - 11
            // = 0
            // 表示需要从右往左取第 (pos+1) 个数字。
            int pos = count + digits - n;
            // ---  倒序取位 ---
            // 例如 num=10, pos=0，说明要取最右边第1个数字。
            // 每循环一次去掉 num 的最后一位，直到到达目标位。
            while (pos--) temp /= 10;

            // 输出目标数字的个位。
            cout << temp % 10;
            break;    // 找到了就退出循环。
        }
        // ---  若目标数字不在当前数字中 ---
        // 说明我们还没数到第 n 个数字，继续下一个。
        count += digits;    // 更新累计数字数目。
        num++;              // 继续处理下一个整数。
    }
    return 0;
}

```
