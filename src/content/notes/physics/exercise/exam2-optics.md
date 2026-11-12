---
title: "月考二 错题复盘 光学"
slug: "physics/exercise/exam2-optics"
description: "第 17、18 题是同一个错误：把 b sin theta pm k lambda 当成 明纹 。这是全卷最贵的一处，一错就是两题。"
publishDate: "2026-11-10"
createdAt: "2026-11-10T00:00:00Z"
tags: ["physics","exercise","错题"]
series: ["Physics","Exercise"]
---

# 月考二 错题复盘：光学（第十一章）

> <img class="callout-badge" src="/media/icons/circled-info.svg" alt="info">**说明**
> - 卷面 27 道选择，红笔标记 **13 道错**（48%）。本页只复盘这 13 道，其余 14 道在末尾一句话带过。
> - 每题按「题干摘要 → 你错在哪 → 正解」三层写；正解折叠，先自己重算再看。
> - 公式全部回链 [第十一章 光学 公式总结](/notes/physics/formula/ch11/) 的教材式号，便于对照原式。

<details class="callout-fold">
<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract"><strong>本节包含</strong></summary>

- 一、错题总表
- 二、六个错因（按性质归类）
- 三、逐题订正（13 题）
- 四、必须背死的 8 条判据
- 五、复述自测（5 题）
- 六、下次的检查清单

</details>

  ---

## 一、错题总表

| 题号 | 考点 | 你的答案 | 正确答案 | 错因标签 |
| --- | --- | --- | --- | --- |
| 3 | 迈克耳孙测折射率 | A | **C** | 单程/双程 |
| 5 | 双缝暗纹位置与间距 | B | **A**（633 nm） | 数错级次 + 忘乘 2 |
| 6 | 双孔干涉（起点是极大） | D | **B**（$7\lambda/6$） | 起点边界 |
| 7 | 斜入射薄膜 + 暗纹计数 | A | **B**（11 条） | 计数 + 斜入射 |
| 9 | 劈尖：$L$ 变小 | D | **C** | 混淆"间距"与"数目" |
| 13 | 望远镜分辨本领 | 60 | **D**（117 m） | 漏 1.22 |
| 16 | 单缝变宽 + 平移 | B、C | **B** | 只答一半 |
| 17 | 单缝明纹衍射角 | C（6.89°） | **B**（5.16°） | 明暗条件用反 |
| 18 | 单缝半波带判定 | D | **A** | 明暗条件用反 |
| 19 | 双缝 + 单缝包络 | B | **C** | 两套间距混用 |
| 21 | 光栅级次重叠 | C | **D**（400~507 nm） | 重叠区间取错 |
| 22 | 缺级 | A | **B**（(1)(3)） | 缺级比值不唯一 |
| 23 | 反射光栅读图 | D | **B**（650 条/mm） | 读数偏小 |

---

## 二、六个错因

### 1. 明暗条件用反：单缝的明纹是"半波长的奇数倍"

第 17、18 题是同一个错误：把 $b\sin\theta=\pm k\lambda$ 当成**明纹**。这是全卷最贵的一处，一错就是两题。

$$
b\sin\theta=
\begin{cases}
\pm k\lambda, & k=1,2,\cdots & \text{暗纹}\\[4pt]
\pm(2k+1)\dfrac{\lambda}{2}, & k=1,2,\cdots & \text{明纹}
\end{cases}
\tag{11-23, 11-24}
$$

- 记忆锚点：**单缝与双缝恰好相反**——双缝 $k\lambda$ 明、单缝 $k\lambda$ 暗；原因是单缝只留一个波面，偶数个半波带两两抵消。

### 2. 双程因子：凡"往返"必乘 2

第 3 题漏了 2，第 5 题漏了 2（两侧各一条暗纹），第 7 题漏了"再加 1 条"。

$$
2(n-1)l=N\lambda\ \Longrightarrow\ n=\frac{N\lambda}{2l}+1
$$

- 迈克耳孙干涉仪的光在同一臂里**走两遍**，所以式 (11-20) 才是 $\Delta d=\Delta n\dfrac{\lambda}{2}$ 而不是 $\lambda$。
- 判断口诀：**看到"镜面/反射"就想双程，看到"透射过一片介质"才是单程**。

### 3. 边界条件：先写 $\Delta(x)$，再看它从多少出发

第 6 题的正解不是 $\Delta=\lambda$，而是 $\Delta=3\lambda$——因为探测器从 A 点出发时 $\Delta$ 已经是 $4\lambda$ 了。

$$
\Delta(x)=\sqrt{a^{2}+x^{2}}-x,\qquad \Delta(0)=a=4\lambda
$$

- $\Delta$ 随 $x$ 单调递减、极限为 0，所以沿途的极大依次是 $4\lambda,3\lambda,2\lambda,\lambda$，**"第一次"是 $\Delta=3\lambda$**。
- 这类题的通用动作：**先算起点值 → 再判断增减 → 最后数第几次**。三步缺一不可。

### 4. 把"条纹间距"和"条纹数目"绑在一起

第 9 题的陷阱：$L$ 变小时 $\theta$ 变大、间距 $b$ 变小，但**数目不变**。

$$
\theta\approx\frac{\Delta D}{L},\qquad b=\frac{\lambda}{2n\theta},\qquad N=\frac{L}{b}=\frac{2n\Delta D}{\lambda}
$$

- $N$ 只与**滚柱直径差 $\Delta D$** 有关，与 $L$ 无关（$L$ 在 $N=L/b$ 里被约掉了）。所以"间距变小、数目不变"。
- 反向对照第 11 题（牛顿环）：那是 $d$ 变、环半径变、**环数也变**——两者的区别在于"改变的是角度还是厚度"。

### 5. 只算一个因素，忘了题目给了两个动作

第 16 题"缝变宽"+"缝平移"是两个独立效果，必须分别判：宽度决定**宽窄**，位置决定**中心在哪儿**。

$$
\Delta x_{0}=\frac{2\lambda f}{b}\ \ (\text{只由 }b\text{ 定}),\qquad \text{零级方向}=\text{缝心与透镜光心的连线}
$$

- 缝上移 → 零级方向下倾 → 中央明纹中心**下移**；缝变宽 → $\Delta x_0$ 变小 → **变窄**。

### 6. 多解条件：缺级、重叠都不是唯一一段

第 22 题只找了 $d/b=3$（得 (1)），漏掉 $d/b=3/2$（得 (3)）；第 21 题把重叠区间只取了一段。

$$
\frac{b+b'}{b}=\frac{k}{k'}\ \ (\text{缺级}),\qquad k\lambda=2\lambda'\ \ (\text{三级压二级})
\tag{11-35}
$$

- 缺级的本质是"$k$ 级主极大正好落在单缝暗纹上"，所以只要 $d/b$ 写成 $3{:}1$ 或 $3{:}2$ 都能让 $3,6,9,\cdots$ 全缺。

  ---

## 三、逐题订正

### 3.1 第 3 题　迈克耳孙干涉仪测空气折射率

> 一臂放长 $l$ 的密封玻璃管，管内 1 atm 空气；抽真空后视场移过 $N$ 条，求 $n$。

**你错在哪**：写成 $(n-1)l=N\lambda$，得 $n=\dfrac{N\lambda}{l}+1$（选 A）。漏了光在管内**往返两次**。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：C</strong></summary>

管内抽空后，该臂光程减少 $2(n-1)l$（往返各一次），每减少一个 $\lambda$ 就移过一条：

$$
2(n-1)l=N\lambda\ \Longrightarrow\ n=\frac{N\lambda}{2l}+1
$$

与式 (11-20) $\Delta d=\Delta n\dfrac{\lambda}{2}$ 是同一件事。

</details>

### 3.2 第 5 题　双缝的"第 5 条暗纹"

> $d=0.30\ \mathrm{mm}$，$d'=1.20\ \mathrm{m}$，中央明纹一侧第 5 条暗纹与另一侧第 5 条暗纹相距 $22.78\ \mathrm{mm}$，求 $\lambda$。

**你错在哪**：选了 B（518 nm）。两处可能：把"第 5 条暗纹"取成 $k=5$（应为 $k=4$），或者把 $22.78\ \mathrm{mm}$ 当成单侧距离（少乘 2）。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：A，$\lambda\approx633\ \mathrm{nm}$</strong></summary>

暗纹位置 $x=\pm(2k+1)\dfrac{d'\lambda}{2d}$，第 5 条取 $k=4$，即 $x_5=\dfrac{9d'\lambda}{2d}$。两侧之间：

$$
2x_5=\frac{9d'\lambda}{d}=22.78\ \mathrm{mm}
$$

$$
\lambda=\frac{22.78\times10^{-3}\times0.30\times10^{-3}}{9\times1.20}=6.33\times10^{-7}\ \mathrm{m}
$$

顺带记住 $k=0$ 那条（$x=\dfrac{d'\lambda}{2d}$）是**第一条暗纹**，不是中央。

</details>

### 3.3 第 6 题　双孔干涉：起点本身就是一个极大

> $\lambda$ 的电磁波垂直射到墙上，墙上 A、B 两孔相距 $a=4\lambda$；探测器从 A 出发沿垂直墙的直线 AP 右移，在 Q 点**第 1 次**测到极大，求 AQ。

**你错在哪**：直接令 $\Delta=\lambda$，得 $x=\dfrac{15\lambda}{2}$（选 D）。这算的是"**最后一个**极大"，不是第一个。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B，$x=\dfrac{7\lambda}{6}$</strong></summary>

设 $AQ=x$，则 $BQ=\sqrt{16\lambda^{2}+x^{2}}$，$\Delta(x)=\sqrt{16\lambda^{2}+x^{2}}-x$。

起点 $x=0$ 处 $\Delta=4\lambda$（本身是极大），$\Delta$ 单调降到 0，故**第一次极大**对应 $\Delta=3\lambda$：

$$
\sqrt{16\lambda^{2}+x^{2}}-x=3\lambda
\Longrightarrow 16\lambda^{2}+x^{2}=x^{2}+6\lambda x+9\lambda^{2}
\Longrightarrow x=\frac{7\lambda}{6}
$$

若从 $\Delta=0$ 的等效中心算起才是 $15\lambda/2$——题目给的起点不是中心。

</details>

### 3.4 第 7 题　斜入射薄膜：暗纹要"数个数"

> Ta₂O₅ 膜（$n_2=2.2$）镀在玻璃（$n_3=1.5$）上，楔形从 $1.40\ \mu\mathrm{m}$ 渐变到 0；$\lambda=598\ \mathrm{nm}$，入射角 $30^\circ$。求反射光暗纹中心数目。

**你错在哪**：算出 $k=0,\cdots,10$ 却数成了 9 条（选 A）。$k$ 从 0 数到 10 是 **11 个**值，且 $d=0$ 的棱边那条（$k=0$）也是暗纹。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B，11 条</strong></summary>

空气 $n_1=1$、膜 $n_2=2.2$、玻璃 $n_3=1.5$：上界面 $1<2.2$ 有 $\pi$ 跃变，下界面 $2.2>1.5$ **没有**，故只加一次 $\dfrac{\lambda}{2}$：

$$
\Delta_r=2d\sqrt{n_2^{2}-n_1^{2}\sin^{2}i}+\frac{\lambda}{2}
=2d\sqrt{4.84-0.25}+\frac{\lambda}{2}
$$

暗纹 $\Delta_r=(2k+1)\dfrac{\lambda}{2}$，得 $2d\times2.1424=k\lambda$：

$$
k_{\max}=\frac{2\times1.40\times2.1424}{0.598}=10.03\ \Longrightarrow\ k=0,1,\cdots,10
$$

共 **11 条**。斜入射时不能用 $n_2$ 代替 $\sqrt{n_2^{2}-n_1^{2}\sin^{2}i}$（这里 2.142 vs 2.2，恰好不改变条数，但换成 $i=60^\circ$ 就会差一条）。

</details>

### 3.5 第 9 题　劈尖的"数目"与"间距"

> 两滚柱直径略有差别、间距 $L$，夹在两块平板玻璃间形成空气劈尖。$L$ 稍微变小，则 $L$ 范围内条纹如何变化。

**你错在哪**：选了 D（数目增加、间距变小）。间距确实变小，但**数目不变**。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：C（数目不变，间距变小）</strong></summary>

$$
\theta\approx\frac{\Delta D}{L}\uparrow,\qquad b=\frac{\lambda}{2\theta}\downarrow,\qquad N=\frac{L}{b}=\frac{2\Delta D}{\lambda}
$$

$N$ 与 $L$ 无关——$L$ 变小只是把同样的条数挤进更短的一段。**这是"改变角度不改厚度差"的典型**：相邻条纹永远对应 $\Delta d=\dfrac{\lambda}{2n}$，总数只由最大厚度差 $\Delta D$ 定。

</details>

### 3.6 第 13 题　望远镜的最小分辨距离

> 月地距离 $3.84\times10^{8}\ \mathrm{m}$，口径 $2.4\ \mathrm{m}$，$\lambda=600\ \mathrm{nm}$，求刚能分辨的两点距离。

**你错在哪**：写了 60（m）。漏掉 1.22，或把口径当成了半径。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：D，$117\ \mathrm{m}$</strong></summary>

$$
\theta_0=1.22\frac{\lambda}{D}=1.22\times\frac{600\times10^{-9}}{2.4}=3.05\times10^{-7}\ \mathrm{rad}
$$

$$
s=\theta_0 L=3.05\times10^{-7}\times3.84\times10^{8}=117\ \mathrm{m}
$$

圆孔用 1.22、单缝不用 1.22，这是两套公式最容易串的地方（式 11-27、11-28）。

</details>

### 3.7 第 16 题　单缝变宽 + 平移

> 单缝 $a$ 稍变宽，同时沿 $y$ 轴正向微移，屏幕 C 上中央明纹将如何。

**你错在哪**：写了 B、C 两个（单选），说明"中心移不移"这一半没判死。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B（变窄，中心位置向下移动）</strong></summary>

- 宽度：$\Delta x_0=\dfrac{2\lambda f}{b}$，$b\uparrow\Rightarrow$ 变窄。
- 位置：中央明纹中心就是 $\theta=0$ 的方向，由**缝心与透镜光心的连线**决定；缝上移，该连线在焦面上落到下方 $\Rightarrow$ 中心下移。

  一句话：**宽度看缝宽，位置看缝心**，两者互不干扰。

</details>

### 3.8 第 17 题　单缝的二级明纹衍射角

> $b=10\ \mu\mathrm{m}$，$\lambda=600\ \mathrm{nm}$，求二级**明纹**中心的衍射角。

**你错在哪**：卷面写的是 $10000\sin\theta=2\times600$，即用 $b\sin\theta=k\lambda$，得 $\sin\theta=0.12$、$\theta=6.89^\circ$（选 C）。这是**暗纹**公式。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B，$5.16^\circ$</strong></summary>

二级明纹取 $k=1$：

$$
b\sin\theta=(2k+1)\frac{\lambda}{2}=\frac{3\lambda}{2}
\Longrightarrow \sin\theta=\frac{3\times600}{2\times10^{4}}=0.09
$$

$$
\theta=\arcsin 0.09=5.16^{\circ}
$$

反过来，若题目问"二级**暗纹**"，答案才是 $6.89^\circ$——你算出的数没错，只是套错了公式。

</details>

### 3.9 第 18 题　半波带数的判定

> $b=0.60\ \mathrm{mm}$，$f=0.40\ \mathrm{m}$，$\lambda=600\ \mathrm{nm}$，焦面上 $x=1.2\ \mathrm{mm}$ 的 P 点是明是暗、几个半波带。

**你错在哪**：选了 D（明纹、3 个半波带）。$b\sin\theta=3\lambda$ 对应的是**暗纹**，且半波带数是 $2k=6$ 而不是 $k=3$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：A（暗纹中心，6 个半波带）</strong></summary>

$$
\sin\theta\approx\frac{x}{f}=\frac{1.2}{400}=3\times10^{-3}
$$

$$
b\sin\theta=0.60\times10^{-3}\times3\times10^{-3}=1.8\times10^{-6}=3\lambda
$$

半波带数 $=\dfrac{b\sin\theta}{\lambda/2}=\dfrac{3\lambda}{\lambda/2}=6$，**偶数 → 暗纹**。

判据只有一条：**半波带数偶则暗、奇则明**，不必再记 $k$ 的奇偶。

</details>

### 3.10 第 19 题　双缝 + 单缝：两套间距别混

> 双缝衍射实验中，把每条缝都变窄（缝中心位置不变），则如何。

**你错在哪**：选了 B（干涉条纹间距变宽、单缝中央亮纹内条纹数减少）。缝变窄**不影响** $d$，所以干涉间距不变；而单缝中央亮纹变宽，里面的条纹**变多**。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：C（干涉条纹间距不变，单缝中央亮纹内条纹数目增多）</strong></summary>

- 干涉间距：$\Delta x=\dfrac{d'\lambda}{d}$，$d$ = 缝心间距，**没变** $\Rightarrow$ 不变。
- 衍射包络：单缝中央亮纹宽 $\Delta x_0=\dfrac{2\lambda f}{b}\propto\dfrac{1}{b}$，$b\downarrow\Rightarrow$ 变宽。
- 包络变宽而条纹间距不变 $\Rightarrow$ 中央亮纹内条纹数增多。

  这张卷子第 20 题（$N$ 与 $b:b'$）考的是同一套"包络 $\times$ 干涉"图像，两题要连着看。

</details>

### 3.11 第 21 题　白光光栅的级次重叠

> 白光 $400\sim760\ \mathrm{nm}$ 垂直照光栅，第二级与第三级有重叠，求屏上能看到的**第三级**光谱被重叠部分的波长范围。

**你错在哪**：选了 C（400~476 nm）。区间端点取错了。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：D，$400\sim507\ \mathrm{nm}$</strong></summary>

位置正比于 $k\lambda$。第三级占 $3\lambda\in[1200,2280]$，第二级占 $2\lambda'\in[800,1520]$。第三级被第二级盖住的部分：

$$
3\lambda=2\lambda',\ \lambda'\in[400,760]\ \Longrightarrow\ \lambda\in[267,507]\ \mathrm{nm}
$$

再与第三级自身范围 $[400,760]$ 取交：

$$
\lambda\in[400,507]\ \mathrm{nm}
$$

记忆：**短波端先重叠**（$\lambda$ 小的级次靠内），所以区间左端恒为 400。

</details>

### 3.12 第 22 题　缺级的比值不唯一

> 平行单色光垂直照光栅，级次是 3 的倍数的主极大均不出现。下列哪些成立：(1) $b=2a$；(2) $b=3a$；(3) $b=0.5a$；(4) $b=1.5a$。

**你错在哪**：卷面推导只写了 $\dfrac{a+b}{a}=3\Rightarrow b=2a$，于是选 A（只有 (1)）。漏了 (3)。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B（(1)、(3)）</strong></summary>

缺级：$k$ 级主极大落在单缝暗纹上，

$$
\frac{b+b'}{b}=\frac{k}{k'}
\tag{11-35}
$$

要求 $k=3,6,9,\cdots$ 全部缺，即对每个 $k=3m$ 都能找到整数 $k'=m\cdot\dfrac{3}{d/b}$：

- $\dfrac{d}{b}=3$（即 $b=2a$）：$k'=m$，整数 ✓
- $\dfrac{d}{b}=\dfrac{3}{2}$（即 $b=0.5a$）：$k'=2m$，整数 ✓
- $\dfrac{d}{b}=4$（$b=3a$）：$k=3$ 对应 $k'=0.75$ ✗
- $\dfrac{d}{b}=2.5$（$b=1.5a$）：$k=3$ 对应 $k'=1.2$ ✗

  所以 (1)、(3) 都成立。**"3 的倍数全缺"等价于 $d/b$ 是 $3{:}1$ 或 $3{:}2$**。

</details>

### 3.13 第 23 题　把光盘轨道当反射光栅

> 绿色激光（$550\ \mathrm{nm}$）近乎垂直打在光盘上，反射后在光源背侧、与光盘平行的直尺（距盘 $60\ \mathrm{cm}$）上看到光点。求轨道密度。

**你错在哪**：读数取了 $x\approx4.7\ \mathrm{cm}$，得 $\sin\theta\approx0.078$、$d\approx7.0\ \mu\mathrm{m}$、密度 $\approx141$ 条/mm，于是选 D（150）。一级光点其实在 $x\approx23\ \mathrm{cm}$ 处，你的 $x$ 小了约 5 倍，$d$ 就大了 5 倍。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>正解：B，650 条/mm</strong></summary>

光盘轨道是反射式光栅，垂直入射时

$$
d\sin\theta=k\lambda,\qquad \tan\theta=\frac{x}{L}
$$

取一级（$k=1$）、$x\approx23\ \mathrm{cm}$、$L=60\ \mathrm{cm}$：

$$
\theta=\arctan\frac{23}{60}=20.9^{\circ},\quad \sin\theta=0.357
$$

$$
d=\frac{550\ \mathrm{nm}}{0.357}=1.54\ \mu\mathrm{m}
\Longrightarrow \rho=\frac{1}{d}=650\ \text{条/mm}
$$

合理性校验：CD 轨道间距 1.6 μm（≈625 条/mm）、DVD 0.74 μm（≈1350 条/mm）——四个选项里只有 650 落在"CD"这个物理事实上，其余三个都不是任何商用光盘的轨道间距。**做不完就用物理常识兜底。**

</details>

---

## 四、必须背死的 8 条判据

| # | 判据 | 一句话 |
| --- | --- | --- |
| 1 | 单缝：$k\lambda$ 暗、$(2k+1)\dfrac{\lambda}{2}$ 明 | 与双缝**相反** |
| 2 | 半波带数 $=\dfrac{b\sin\theta}{\lambda/2}$，偶暗奇明 | 不用记 $k$ 的奇偶 |
| 3 | 往返必乘 2：迈克耳孙 $2(n-1)l=N\lambda$ | 反射即双程 |
| 4 | 半波损失：**只有一侧** $n$ 增大时加 $\dfrac{\lambda}{2}$ | 两侧都增/都减则不加 |
| 5 | 斜入射薄膜用 $\sqrt{n_2^{2}-n_1^{2}\sin^{2}i}$ | 不能直接用 $n_2$ |
| 6 | 等厚干涉：$\Delta d=\dfrac{\lambda}{2n}$，条数只由最大厚度差定 | 与 $L$、劈尖角无关 |
| 7 | 圆孔 1.22、单缝不乘 1.22 | 分辨本领 $\theta_0=1.22\lambda/D$ |
| 8 | 缺级 $\dfrac{d}{b}=\dfrac{k}{k'}$，比值可约分 | 3 的倍数全缺 $\Leftrightarrow 3{:}1$ 或 $3{:}2$ |

---

## 五、复述自测

> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**1.**
> 单缝宽 $b$、波长 $\lambda$，屏上 $b\sin\theta=2.5\lambda$ 处是明是暗？几个半波带？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答</strong></summary>

半波带数 $=2.5\lambda\div(\lambda/2)=5$，**奇数 → 明纹**（$k=2$ 的二级明纹）。

</details>
> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**2.**
> 迈克耳孙干涉仪一臂的玻璃管长 $10\ \mathrm{cm}$，抽空后移过 100 条，$\lambda=600\ \mathrm{nm}$，求 $n$。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答</strong></summary>

$2(n-1)l=N\lambda\Rightarrow n=1+\dfrac{100\times600\times10^{-9}}{2\times0.10}=1+3\times10^{-4}=1.0003$。

</details>
> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**3.**
> 劈尖的玻璃板间夹一根直径 $D$ 的细丝、长 $L$，若把细丝换成直径 $2D$ 的，条纹数与间距各怎么变？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答</strong></summary>

间距 $b=\dfrac{\lambda L}{2nD}\propto\dfrac{1}{D}$，**减半**；条数 $N=\dfrac{2nD}{\lambda}\propto D$，**加倍**。（对照第 9 题：改 $L$ 只改间距，改 $D$ 两者都改。）

</details>
> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**4.**
> 空气劈尖（玻璃 $n=1.5$）与"油膜劈尖"（$n_{\text{油}}=1.2$ 夹在空气中），棱边处分别是明是暗？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答</strong></summary>

空气劈尖：上界面 $1.5\to1$ 无跃变、下界面 $1\to1.5$ 有跃变，$d=0$ 处 $\Delta=\dfrac{\lambda}{2}$，**暗**。
油膜夹在空气中：上界面 $1\to1.2$ 有跃变、下界面 $1.2\to1$ 无跃变，$d=0$ 处 $\Delta=\dfrac{\lambda}{2}$，也是**暗**。
若膜夹在两块玻璃之间（$1.5\to1.2\to1.5$），两侧都有跃变，$d=0$ 处 $\Delta=0$，**明**。

</details>
> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**5.**
> 光栅 $d=3b$，前 6 级主极大里哪几级看不到？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答</strong></summary>

$d/b=3\Rightarrow k=3,6$ 缺级。故 0、1、2、4、5 可见，3、6 缺。

</details>

---

## 六、下次的检查清单

- [ ] 动笔前先在草稿上写一行"**明纹条件 = ？暗纹条件 = ？**"，单缝双缝各写一次，避免 17/18 那种连环错。
- [ ] 凡出现"反射""往返""镜面"，回头确认公式里有没有那个 2。
- [ ] 干涉题的 $x$ 是**到中央**的距离还是**两条纹之间**的距离，圈一下单位。
- [ ] 薄膜题先画两层界面、标两个箭头的 $n$ 变化方向，再决定加不加 $\dfrac{\lambda}{2}$。
- [ ] 读数/看图题（第 23 题那类）：先在图上标出"中央光点"和"一级光点"，再量，别拿中间某个杂散点当一级。
- [ ] 单选就是单选，第 16 题那种两个动作的题，**最后只留一个字母**。

  ---

## 附：做对的 14 题（保持）

第 1（$\Delta\varphi=2\pi nl/\lambda$）、2（光源下移、中央明纹上移且间距不变）、4（劳埃德镜半波损失）、8（上板平移：向棱边移、间距不变）、10（$n_1<n_2>n_3$ 只加一次 $\dfrac{\lambda}{2}$）、11（牛顿环上移：向心收缩、环心明暗交替）、12（双 $\pi$ 跃变 → 内疏外密 4 个暗环）、14（相干叠加）、15（$\Delta x_0\propto\lambda/b$，$\dfrac{2}{5}$ 倍）、20（$N=4$、$b:b'=1:2$）、24（光栅衍射测波长最准）、25（自然光与线偏振光强比 1）、26（$i_B=35.3^{\circ}$）。

---

[← 第十一章 光学 公式总结](/notes/physics/formula/ch11/) · 第七周作业 光栅衍射 分辨本领

