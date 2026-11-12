---
title: "《复变函数》核心题型汇总"
slug: "complex/core-problems/toc"
description: "第一章 复数与复变函数 核心题型 —— 商与共轭 · 共轭恒等式 · 三角与指数式 · 复向量 · 方根 · 直线方程 · 图形识别 · 旋转法 · 极限不存在 · 连续性（10 型）"
publishDate: "2026-11-05"
createdAt: "2026-11-05T00:00:00Z"
tags: ["complex","complex-problem","moc"]
series: ["Complex","复变函数核心题型汇总"]
---

# 《复变函数》核心题型汇总

> 按章拆分为 7 篇，均存放在 `Complex/复变函数核心题型汇总/` 文件夹。
> 做法：**逐章模仿教材例题的题型**，每个题型配 **2 道自编题 + 精简答案**（只留关键式，不复述文字）。
> 共 **67 个题型 / 134 道题**；所有可数值检验的结果均已用数值积分 / 数值追踪复核。

## 分章题型

- [第一章 复数与复变函数 核心题型](/notes/complex/core-problems/ch1/) —— 商与共轭 · 共轭恒等式 · 三角与指数式 · 复向量 · 方根 · 直线方程 · 图形识别 · 旋转法 · 极限不存在 · 连续性（10 型）
- [第二章 解析函数 核心题型](/notes/complex/core-problems/ch2/) —— 定义法证可导 · 连续不可导 · 解析性研究 · C-R 判别 · 验证解析求导 · 常值判定 · 正交曲线族 · Ln 多值 · 一般乘幂（9 型）
- [第三章 复变函数的积分 核心题型](/notes/complex/core-problems/ch3/) —— 参数方程法 · 基本积分公式 · 路径相关 · 估值不等式 · 复合闭路 · N–L 公式 · 选支积分 · 柯西公式 · 高阶导数求导 · 高阶导数算积分 · 由实部/虚部求解析函数（12 型）
- [第四章 复变函数项级数 核心题型](/notes/complex/core-problems/ch4/) —— 等比级数 · 敛散判别 · 收敛半径 · $\frac{1}{z-b}$ 展开 · 泰勒展开 · $0<|z|<\infty$ 洛朗 · 多圆环域洛朗 · 以奇点为中心洛朗（8 型）
- [第五章 留数及其应用 核心题型](/notes/complex/core-problems/ch5/) —— 可去/本性 · 零点级 · 极点级 · 扩充复平面与 $\infty$ · 一级极点积分 · 高阶极点留数 · $\infty$ 处留数 · $\int_0^{2\pi}$ · $\int_0^{\pi}$ · $\int_{-\infty}^{\infty}$ 与 $R(x)\mathrm{e}^{\mathrm{i}ax}$（10 型）
- [第六章 共形映射 核心题型](/notes/complex/core-problems/ch6/) —— 伸缩率与转动角 · 上半平面→单位圆 · 单位圆→单位圆 · 上半平面→圆 · 上半平面→上半平面 · 角形域→单位圆 · 圆弧域→简单域 · 带形域→单位圆 · 相切圆→上半平面 · 半带形域→上半平面（10 型）
- [第七章 解析函数在科技中的应用选讲 核心题型](/notes/complex/core-problems/ch7/) —— 复势求速度/流线 · 源汇与偶极子 · 电场复势 · 对数留数 · 辐角原理判半平面 · Rouché 证根数 · Rouché 单位圆 · Rouché 圆环域（8 型）

## 使用说明

- 每个题型标题后的括号标注对应教材例题号，便于回查原书。
- 答案区用 `>` 引用块，一行一步，只保留公式；推导细节需自行补全。
- 教材原文（库内）：`Signals\Text books\复变函数（第二版） (王锦森) (z-library.sk, 1lib.sk, z-lib.sk).pdf_by_PaddleOCR-VL-1.6.md`
- 配套公式速查：[《复变函数》定理公式总结](/notes/complex/formulas/toc/)

## 核心公式速查

| 主题 | 公式 |
| --- | --- |
| 参数方程法 | $\displaystyle\int_C f\,\mathrm{d}z=\int_\alpha^\beta f[z(t)]z'(t)\,\mathrm{d}t$ |
| 基本积分公式 | $\displaystyle\oint_{|z-z_0|=r}\frac{\mathrm{d}z}{(z-z_0)^{n+1}}=\begin{cases}2\pi\mathrm{i},&n=0\\0,&n\neq0\end{cases}$ |
| 柯西积分公式 | $f(z_0)=\dfrac{1}{2\pi\mathrm{i}}\displaystyle\oint_C\frac{f(z)}{z-z_0}\mathrm{d}z$ |
| 高阶导数 | $f^{(n)}(z)=\dfrac{n!}{2\pi\mathrm{i}}\displaystyle\oint_C\frac{f(\zeta)}{(\zeta-z)^{n+1}}\mathrm{d}\zeta$ |
| 洛朗系数 | $c_n=\dfrac{1}{2\pi\mathrm{i}}\displaystyle\oint_C\frac{f(\zeta)}{(\zeta-z_0)^{n+1}}\mathrm{d}\zeta$ |
| 留数规则一 | $\mathrm{Res}[f,z_0]=\dfrac{1}{(m-1)!}\lim\limits_{z\to z_0}\dfrac{\mathrm{d}^{m-1}}{\mathrm{d}z^{m-1}}\big[(z-z_0)^mf\big]$ |
| 留数规则二 | $\mathrm{Res}\Big[\dfrac{\varphi}{\psi},z_0\Big]=\dfrac{\varphi(z_0)}{\psi'(z_0)}$ |
| 留数定理 | $\displaystyle\oint_C f\,\mathrm{d}z=2\pi\mathrm{i}\sum_k\mathrm{Res}[f,z_k]$ |
| 上半平面→单位圆 | $w=\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-\lambda}{z-\bar\lambda}$ |
| 单位圆→单位圆 | $w=\mathrm{e}^{\mathrm{i}\varphi}\dfrac{z-\alpha}{1-\bar\alpha z}$ |
| 辐角原理 | $N-P=\dfrac{1}{2\pi}\Delta_C\mathrm{Arg}\,f(z)$ |
| 儒歇定理 | $|f|>|g|\Rightarrow f$ 与 $f+g$ 在 $C$ 内零点数相同 |

