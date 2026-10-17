---
title: "《复变函数》定理公式总结"
slug: "complex/formulas/toc"
description: "第一章 复数与复变函数 定理公式总结 —— 复数代数运算 · 几何表示与辐角 · 乘幂与方根 · 复球面 · 区域 · 复变函数 · 极限与连续"
publishDate: "2026-10-17"
createdAt: "2026-10-17T00:00:00Z"
tags: ["complex","complex-formula","moc"]
series: ["Complex","复变函数定理公式总结"]
---

# 《复变函数》定理公式总结

> 按章拆分为 7 篇，均存放在 `Complex/复变函数定理公式总结/` 文件夹。
> 每篇**只保留结论性公式**（定义式、定理式与常用结论），省略推导与中间式；每条公式的文字说明不超过一行；公式编号（如 `(3.4.1)`）与原书一致，便于回查教材。

## 分章定理公式总结

- [第一章 复数与复变函数 定理公式总结](/notes/complex/formulas/ch1/) —— 复数代数运算 · 几何表示与辐角 · 乘幂与方根 · 复球面 · 区域 · 复变函数 · 极限与连续
- [第二章 解析函数 定理公式总结](/notes/complex/formulas/ch2/) —— 导数与微分 · 解析函数 · C-R 方程与判定定理 · 指数与对数 · 乘幂 · 三角与双曲 · 反函数
- [第三章 复变函数的积分 定理公式总结](/notes/complex/formulas/ch3/) —— 积分定义与参数法 · 柯西-古萨定理 · 复合闭路定理 · 原函数与牛顿-莱布尼茨公式 · 柯西积分公式 · 高阶导数 · 调和函数
- [第四章 复变函数项级数 定理公式总结](/notes/complex/formulas/ch4/) —— 复数项级数 · 阿贝尔定理与收敛半径 · 幂级数运算 · 泰勒级数 · 洛朗级数
- [第五章 留数及其应用 定理公式总结](/notes/complex/formulas/ch5/) —— 孤立奇点分类 · 零点与极点 · 无穷远点 · 留数定理与三条规则 · 三类实积分
- [第六章 共形映射 定理公式总结](/notes/complex/formulas/ch6/) —— 转动角与伸缩率 · 共形映射 · 分式线性映射（保圆/保对称/保交比）· 幂函数与指数函数映射
- [第七章 解析函数在科技中的应用选讲 定理公式总结](/notes/complex/formulas/ch7/) —— 平面流速场与静电场复势 · 对数留数 · 辐角原理 · 儒歇定理 · 茹科夫斯基函数

## 使用说明

- 每篇笔记内部：`## 第 x 节 节名` 对应教材小节，`### x.y 小节名` 为节内主题分组；公式块右下角的编号即教材公式号。
- 章末有上一章 / 总目录 / 下一章的导航，可直接顺序刷公式。
- 教材原文（库内）：`Signals\Text books\复变函数（第二版） (王锦森) (z-library.sk, 1lib.sk, z-lib.sk).pdf_by_PaddleOCR-VL-1.6.md`

## 核心公式速查

| 主题 | 公式 | 编号 |
| --- | --- | --- |
| C-R 方程 | $u_{x}=v_{y},\ u_{y}=-v_{x}$ | (2.1.7) |
| 柯西-古萨 | $\oint_{C}f\,\mathrm{d}z=0$ | (3.2.1) |
| 柯西积分公式 | $f(z_{0})=\dfrac{1}{2\pi\mathrm{i}}\oint_{C}\dfrac{f(z)}{z-z_{0}}\mathrm{d}z$ | (3.4.1) |
| 高阶导数 | $f^{(n)}(z)=\dfrac{n!}{2\pi\mathrm{i}}\oint_{C}\dfrac{f(\zeta)}{(\zeta-z)^{n+1}}\mathrm{d}\zeta$ | (3.4.4) |
| 泰勒级数 | $c_{n}=\dfrac{f^{(n)}(z_{0})}{n!}$ | (4.3.1) |
| 洛朗级数 | $c_{n}=\dfrac{1}{2\pi\mathrm{i}}\oint_{C}\dfrac{f(\zeta)}{(\zeta-z_{0})^{n+1}}\mathrm{d}\zeta$ | (4.4.3) |
| 留数定理 | $\oint_{C}f\,\mathrm{d}z=2\pi\mathrm{i}\sum\mathrm{Res}[f,z_{k}]$ | (5.2.2) |
| 辐角原理 | $N-P=\dfrac{1}{2\pi}\Delta_{C}\mathrm{Arg}\,f(z)$ | (7.2.2) |
| 上半平面 $\to$ 单位圆 | $w=\mathrm{e}^{\mathrm{i}\theta}\dfrac{z-\lambda}{z-\overline{\lambda}}$ | (6.2.6) |

