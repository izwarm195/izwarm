---
title: "衍射波带重叠 专题（半波带·缺级·光谱重叠）"
slug: "physics/zone-overlap"
description: "同一个词\"重叠\"在衍射里其实指三件不同的事，判别式和后果完全不同："
publishDate: "2026-11-12"
createdAt: "2026-11-12T00:00:00Z"
updatedDate: "2026-11-12T21:45:31"
tags: ["physics","optics","diffraction"]
series: ["Physics"]
---

# 衍射中的"波带重叠"专题（半波带 · 缺级 · 光谱重叠）

## 0. 三种"重叠"一览

同一个词"重叠"在衍射里其实指三件不同的事，判别式和后果完全不同：

| 现象 | 重叠的是什么 | 判别式 | 后果 |
|---|---|---|---|
| 半波带**抵消** | 相邻半波带在同一衍射方向上的振动 | 光程差 $\lambda/2$、相位差 $\pi$ | 波带数为偶数→暗，奇数→明 |
| 光栅**缺级** | 单缝衍射的暗纹包络 与 多缝干涉的主极大 | $\dfrac{d}{b}=\dfrac{k}{k'}$ | 第 $k$ 级主极大"消失" |
| 光谱**级次重叠** | 不同波长的不同级主极大 | $k_1\lambda_1=k_2\lambda_2$ | 高级次短波端压到低级次长波端 |

一条主线：**光栅衍射强度 = 单缝衍射因子 × 多缝干涉因子**，前两种"重叠"都是这句话的直接推论。

---

## 一. 半波带法：波带数决定明暗

### 划分规则

单缝宽 $b$，平行光垂直入射，衍射角 $\theta$。用一组平行于缝面的平面把缝上的波阵面切开，使**相邻两条线到屏上 $P$ 点的光程差恰为 $\lambda/2$**，每一份就是一条"半波带"。

$$
\text{波带数}\;N=\frac{b\sin\theta}{\lambda/2}=\frac{2b\sin\theta}{\lambda}
$$

### 为什么相邻波带抵消

同一波带上各点同相；相邻两波带对应点光程差 $\lambda/2$、相位差 $\pi$，振幅近似相等、方向相反，于是**成对抵消**。

| 波带数 $N$ | 叠加结果 | 屏上 |
|---|---|---|
| 偶数 $2k$ | 全部成对抵消 | 暗纹 |
| 奇数 $2k+1$ | 抵消后余下一个波带 | 明纹（$k$ 级） |
| $\to0$（$\theta=0$） | 所有波带同相叠加 | 中央明纹，最亮 |

### 公式

$$
\text{暗纹：}\quad b\sin\theta=\pm k\lambda\qquad k=1,2,3,\cdots
$$

$$
\text{明纹：}\quad b\sin\theta=\pm\left(2k+1\right)\frac{\lambda}{2}\qquad k=1,2,3,\cdots
$$

屏上位置 $x=f\tan\theta\approx f\sin\theta$；中央明纹半角宽 $\sin\theta_1=\lambda/b$，线宽 $\Delta x_0=2f\lambda/b$。

### 两点必须记住的性质

- **明纹条件是近似的。** 缝上"余下的那个波带"仍有宽度、且随 $\theta$ 增大而变小，加上倾斜因子，所以明纹并不严格在 $(2k+1)\lambda/2$ 处，而是略向中央偏移，且**级次越高强度越弱**（中央明纹集中了约 90% 的能量）。
- **同一方向上"明暗互换"看波带数奇偶。** 这类题的套路是：固定 $\theta$，改变 $b$ 或 $\lambda$，算出新的 $N$，看奇偶。

  ---

## 二. 缺级：单缝暗纹与主极大"重叠"

### 强度式子

$$
I=I_0\left(\frac{\sin u}{u}\right)^{2}\left(\frac{\sin N'\delta/2}{\sin\delta/2}\right)^{2},\qquad u=\frac{\pi b\sin\theta}{\lambda},\quad \delta=\frac{2\pi d\sin\theta}{\lambda}
$$

第一个因子是**单缝衍射包络**（把主极大"罩"住的形状），第二个因子给出**多缝干涉的锐利主极大**。

### 缺级的判别

某一方向上同时满足

$$
\text{主极大：}d\sin\theta=k\lambda,\qquad \text{单缝暗纹：}b\sin\theta=k'\lambda
$$

即该级主极大正好落在衍射包络的零点上，振幅为零，这个主极大**看不到**：

$$
\boxed{\ \frac{d}{b}=\frac{k}{k'}\ }\qquad \left(k'=1,2,3,\cdots\right)
$$

所以缺级一定是 $d/b$ 的**整数倍级次**：若 $d/b=m$，则 $k=\pm m,\pm2m,\pm3m,\cdots$ 全部缺级。

### 解题步骤（固定四步）

1. 求 $d/b$，写出缺级集合 $\{k=nm\}$；
2. 求最高级次 $k_{\max}=d/\lambda$，并检查 $k=k_{\max}$ 时是否已到 $\theta=90^{\circ}$（到了就不算）；
3. 可见级次 $=$ $\left\{0,\pm1,\cdots,\pm k_{\max}\right\}$ 去掉缺级；
4. 数条数时别忘了 $k=0$ 只算一条。

   ---

## 三. 光谱重叠：不同级次压在一起

### 重合条件

同一光栅中，波长 $\lambda_1$ 的第 $k_1$ 级与波长 $\lambda_2$ 的第 $k_2$ 级出现在同一衍射方向，条件是

$$
k_1\lambda_1=k_2\lambda_2
$$

求"光栅常量"的常规题就是这样：先由 $\dfrac{k_1}{k_2}=\dfrac{\lambda_2}{\lambda_1}$ 化成最简整数比，再由"第 $n$ 次重合"把 $k_1,k_2$ 乘上 $n$。

### 白光的高级次光谱必然交叠

第 $k$ 级光谱的角色散范围是 $\left[k\lambda_{\min},\,k\lambda_{\max}\right]$。第 $k$ 级与第 $k+1$ 级**不重叠**的条件：

$$
\left(k+1\right)\lambda_{\min}>k\lambda_{\max}
\quad\Longleftrightarrow\quad
\frac{\lambda_{\max}}{\lambda_{\min}}<1+\frac{1}{k}
$$

白光 $\lambda_{\max}/\lambda_{\min}=760/400=1.9$：

- $k=1$：$1+1/1=2>1.9$ → 第一、二级不重叠；
- $k=2$：$1+1/2=1.5<1.9$ → 第二、三级**开始重叠**。

  自由光谱范围 $\Delta\lambda=\lambda/k$（第 $k$ 级的相邻级次刚好不重叠的波长宽度）。

  ---

## 四. 习题与解答

### 1.
一单缝宽 $b=5.0\times10^{-5}\ \mathrm{m}$，用 $\lambda=500\ \mathrm{nm}$ 的平行光垂直照射，透镜焦距 $f=2.0\ \mathrm{m}$。（1）在 $\sin\theta=0.025$ 的方向上是明纹还是暗纹？属第几级？有几个半波带？（2）屏上该点到中心的距离是多少？（3）若把缝宽增大到 $1.0\times10^{-4}\ \mathrm{m}$，同一方向上又是什么情况？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>解答</strong></summary>

（1）光程差

$$
b\sin\theta=5.0\times10^{-5}\times0.025=1.25\times10^{-6}\ \mathrm{m}=2.5\lambda
$$

半波带数

$$
N=\frac{2b\sin\theta}{\lambda}=\frac{2\times1.25\times10^{-6}}{500\times10^{-9}}=5
$$

$N=5$ 为奇数，余下一个波带未被抵消，故是**明纹**；由 $b\sin\theta=\left(2k+1\right)\dfrac{\lambda}{2}$ 得 $2k+1=5$，即第 **2** 级明纹，5 个半波带。

（2）

$$
x=f\tan\theta\approx f\sin\theta=2.0\times0.025=5.0\times10^{-2}\ \mathrm{m}=50\ \mathrm{mm}
$$

（3）缝宽加倍后同一方向的光程差加倍

$$
b'\sin\theta=2.50\times10^{-6}\ \mathrm{m}=5\lambda,\qquad N'=10
$$

$N'$ 为偶数，10 个半波带两两抵消，故变成第 **5** 级**暗纹**。这就是"固定方向、改缝宽，明暗互换"的标准套路：只看 $N$ 的奇偶。

</details>

### 2.
一光栅的光栅常量 $d=6.0\times10^{-6}\ \mathrm{m}$，透光缝宽 $b=2.0\times10^{-6}\ \mathrm{m}$，用 $\lambda=600\ \mathrm{nm}$ 的平行光垂直照射。求能观察到的全部级次、缺级，以及共看到多少条谱线。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>解答</strong></summary>

缺级由

$$
\frac{d}{b}=\frac{6.0\times10^{-6}}{2.0\times10^{-6}}=3
$$

决定，缺级为 $k=\pm3,\pm6,\pm9,\cdots$。

最高级次

$$
k_{\max}=\frac{d}{\lambda}=\frac{6.0\times10^{-6}}{600\times10^{-9}}=10
$$

$k=10$ 时 $\sin\theta=1$ 即 $\theta=90^{\circ}$，已出屏幕范围，故 $k$ 只取 $0,\pm1,\cdots,\pm9$。

去掉缺级

$$
k=0,\ \pm1,\ \pm2,\ \pm4,\ \pm5,\ \pm7,\ \pm8
$$

共 $1+2\times6=13$ 条谱线（$k=0$ 只算一条）。

</details>

### 3.
用每毫米刻有 250 条刻痕的平面透射光栅观察 $\lambda=500\ \mathrm{nm}$ 的单色光，发现第二级主极大缺级。求：（1）光栅常量与缝宽；（2）实际能看到的全部级次；（3）若改用 $\lambda'=400\ \mathrm{nm}$ 照射，缺级会怎样变化？

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>解答</strong></summary>

（1）

$$
d=\frac{1\ \mathrm{mm}}{250}=4.0\times10^{-6}\ \mathrm{m}
$$

第 2 级缺级说明 $d/b=2$（首次缺级即第 2 级）

$$
b=\frac{d}{2}=2.0\times10^{-6}\ \mathrm{m}
$$

（2）

$$
k_{\max}=\frac{d}{\lambda}=\frac{4.0\times10^{-6}}{500\times10^{-9}}=8
$$

$k=8$ 对应 $\sin\theta=1$，不计。缺级 $k=\pm2,\pm4,\pm6$，故可见

$$
k=0,\ \pm1,\ \pm3,\ \pm5,\ \pm7
$$

共 11 条。

（3）缺级的位置由 $\dfrac{d}{b}=2$ 决定，与波长**无关**——同一个缝和栅，缺级永远是 $k=\pm2,\pm4,\pm6,\cdots$。变化的只是最高级次

$$
k_{\max}=\frac{4.0\times10^{-6}}{400\times10^{-9}}=10\quad\left(k=10\ \text{在 }90^{\circ}\text{ 处，不计}\right)
$$

此时可见 $k=0,\pm1,\pm3,\pm5,\pm7,\pm9$，共 13 条。**缺级由几何决定，级次范围由波长决定。**

</details>

### 4.
$d=3.0\times10^{-6}\ \mathrm{m}$，白光 $400\sim760\ \mathrm{nm}$ 垂直入射。求：（1）第 1、2 级光谱是否重叠？（2）从第几级起重叠？（3）第 2、3 级重叠的波长范围。

<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>解答</strong></summary>

先算各级明纹的角范围 $\sin\theta=k\dfrac{\lambda}{d}$，$\dfrac{1}{d}=3.33\times10^{5}\ \mathrm{m^{-1}}$

$$
\begin{aligned}
k=1:\quad & \sin\theta=0.133\sim0.253\\
k=2:\quad & \sin\theta=0.267\sim0.507\\
k=3:\quad & \sin\theta=0.400\sim0.760
\end{aligned}
$$

（1）$0.253<0.267$，第 1、2 级**不重叠**。

（2）$0.507>0.400$，第 2、3 级**重叠**，故从第 2 级起。

（3）重叠区 $\sin\theta=0.400\sim0.507$

$$
\lambda_3=\frac{d}{3}\sin\theta\approx400\sim507\ \mathrm{nm},\qquad
\lambda_2=\frac{d}{2}\sin\theta\approx600\sim760\ \mathrm{nm}
$$

校验：$2\lambda_2=3\lambda_3$，$\sin\theta=0.40$ 处 $2\times600=3\times400$。

</details>

---

## 五. 易错点

- **暗纹公式是严格的，明纹公式是近似的。** 用 $b\sin\theta=(2k+1)\lambda/2$ 求明纹位置会略有偏差，且级次越高越不准、强度越弱。
- **缺级 ≠ 缺级"没光"。** 缺级方向上仍有衍射光，只是多缝干涉主极大为零，实际强度极小。
- **$k_{\max}=d/\lambda$ 必须检查 \(\theta=90^{\circ}\)。** 恰好等于整数的那个 $k$ 出现在屏幕上无穷远处，不计入"实际看到"的级次。
- **数条数**：$k=0$ 一条、正负级各若干，别把它当成 $2k_{\max}+1$ 直接减缺级数。
- **级次重叠的方向**：是"高级次的短波端"压到"低级次的长波端"，不要反。
- **斜入射**时所有缝上光程差多一项，暗纹条件变为 $b\left(\sin\theta\pm\sin i\right)=k\lambda$，缺级判据 $\dfrac{d}{b}=\dfrac{k}{k'}$ 不变。

