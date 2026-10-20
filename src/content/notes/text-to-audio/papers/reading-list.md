---
title: "X-LANCE 研读清单"
slug: "text-to-audio/papers/reading-list"
description: "Batch A · XACLE 速成（10/19–10/25，只读方法 + 实验节）★ 唯一有硬日期的一批"
publishDate: "2026-09-24"
createdAt: "2026-09-24T00:00:00Z"
updatedDate: "2026-10-20T17:10:00"
tags: ["text-to-audio"]
series: ["Text-to-Audio","Papers"]
---

# TTA 阅读路径与 X-LANCE 论文清单

> **2026-10-20 更新（对齐 v10，现行）**：AudioLDM 前置知识覆盖计划（大二上） 已升到 **v10**，科研主线从 DCASE 换成 **XACLE 2027**（10/19 环境与基线逐位复现）。本清单随之换挡，**四处实质改动**：
> ① **阅读组织从「四层」改为「四批（Batch A–D）」并挂上日期**——§1 换成四批阅读线，§1.1 用一张映射表交代四层地基分别落在哪批、哪些层已结项；原因是**精读时机已到**（计划 §1 原则 1）：基础全部就位，不再做「先泛读再精读」的两段式。
> ② **XACLE 编码器线并入 Batch A**：新增 M2D / M2D-CLAP（2027 基线）、BEATs、MoEScore（2026 冠军）、RELATE、XACLE Challenge 2026 五篇；原来「CLAP 排在 L4 深处」的读法要改——**CLAP 现在是 Batch A 第 4 篇，10 月内必读**。
> ③ **DCASE 支线（v9 新增的 §5.1）作废**：见计划 v9「DCASE 作废、主线改 XACLE 2027」。§5.1 保留作历史记录并加删除线说明，不删。
> ④ **顶部那张「现状盘点」翻篇**：原来的结论是「只有叶子、没有树干」，现在**地基已补齐**，缺口换成了 XACLE 编码器线 + 每篇论文的固定产出。判断结论必须跟着改，否则这张表会误导你自己。
> 另：**Transformer 前置已于 2026-10 完成**（含从零手写 Encoder–Decoder，见 [NNDL 26-10-13 手写 Transformer](/notes/machine-and-deep-learning/nndl/26-10-13-transformer/)），第 0 层地基不再有欠账。
>
> **历史变更**：2026-10-17（目标换挡为「高水平会议 + DCASE」，新增 DCASE 支线）｜2026-09-24（库扩到 131 条，确认缺的是地基参考文献）。
> 地基导入文件 `生成模型地基参考文献.ris`（20 条）**已于 2026-10-20 删除**——内容全部在 Zotero 库里，留着只会在 `Papers/` 里制造第二真源（见 §6）。

---

## 0. 现状盘点（结论先行）

| 类别                 | 库内情况                                                                                           | 判断             |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------------- |
| X-LANCE 核心（TTA 主线） | ✅ MeanAudio / Resonate / Audio ControlNet / FineLAP                                            | 已齐，可直接开始       |
| AudioLDM 系与 TTA 变体 | ✅ AudioLDM、AudioLDM 2、TANGO、Tango 2、Make-An-Audio、Auffusion、AudioLCM、PicoAudio、FreeAudio、ARC 等 | 已齐（且偏多）        |
| **XACLE 编码器线**     | ✅ CLAP / M2D-CLAP / TangoFlux 已在库；⚠️ **BEATs、MoEScore、RELATE、XACLE Challenge 2026 未确认**       | 🚩 **v10 新增缺口** |
| V2A / Foley 系      | ⚠️ 已录入 **30+ 篇**（MMAudio、Diff-Foley、FoleyCrafter、Kling-Foley…）                                 | **按你的决定归档，不读** |
| **生成模型地基**         | ✅ DDPM / DDIM / LDM / CFG / flow matching / rectified flow / Mean Flows / VAE / DiT **已补齐**        | ✅ 不再缺        |
| **后训练与可控地基**       | ✅ DPO / GRPO / ControlNet / Drifting / DriftAudio 已补                                            | ✅ 不再缺        |
| **音频表示与评测**        | ✅ CLAP / EnCodec / HiFi-GAN / FAD / AudioCaps / Clotho 已补                                        | ✅ 不再缺        |

> **一句话（v10 换口径）**：库已经**不是「只有叶子没有树干」**了——地基补齐之后，现在的缺口是 **XACLE 这条新主线的编码器与标注协议文献**，以及**每篇论文的固定产出（结构图 + 前向公式）**。读没读 ≠ 读没读完。

---

## 1. 阅读顺序（四批，带日期与过关门槛）

> 与 AudioLDM 前置知识覆盖计划（大二上） §3 一一对应。**每篇的固定产出**（否则不算读完）：**结构图（截论文原图，PicGo 传图床）+ 主要前向公式**；正文只写公式，每式配 1–2 条必要注释，不写表态段。
>
> **存放规则**：一篇论文一个文件夹，文件夹名用最短标识——`Papers/CLAP/CLAP.md`、`Papers/AudioLDM/AudioLDM.md`。

```
Batch A · XACLE 速成（10/19–10/25，只读方法 + 实验节）★ 唯一有硬日期的一批
   RELATE → XACLE Challenge 2026 → MoEScore → CLAP → M2D / M2D-CLAP → BEATs ｜可选 PEA-Frame
      ↓ 门槛：能画出「音频塔 → 投影 → 联合空间 → 打分头」；说清 seen→unseen 到底考的是什么

Batch B · TTA 主线（12/4–1/10，与 MeanAudio 复现同步）
   AudioLDM 2 → Flow Matching + Rectified Flow → Mean Flows → MeanAudio → TangoFlux
      ↓ 门槛：能对比 DDPM vs mean flows 的取舍；AudioLDM 2 全链路画得出来；跑通推理

Batch C · 后训练（寒假，与 FdAudio / TinyAudio 复现同步）
   FdAudio → Drifting → DriftAudio → Resonate → TinyAudio ｜配套 TTA-Bench
      ↓ 门槛：三种后训练范式（FD 锚定 / drifting / RL-GRPO）能同口径对比

Batch D · 前沿旁支（大二下起，按需，不占主线）
   WavFlow / Stable Audio 3 / Omni2Sound / AudioX / ELSA / Audio ControlNet·FreeAudio
```

**★ 必须提前的一项（不变）**：`Mean Flows for One-step Generative Modeling`（NeurIPS 2025）——它是 MeanAudio 的**直接方法基础**，跳过它读 MeanAudio 会变成背结论。v10 里它仍是 Batch B 的枢纽。

### 1.1 四层地基 → 四批阅读线的映射（v10）

四层知识是**概念**，四批是**阅读顺序**；两者不是两条线，下面这张表说明哪层在哪批落地、哪些层已经结项。

| 四层（计划 §6） | 内容 | 落在哪些批 | 状态（2026-10-20） |
|---|---|---|---|
| **L0 生成范式家族** | DDPM → DDIM → Flow Matching → Mean Flows → Drifting | Batch B（主）+ Batch C（后训练侧） | ✅ 资源齐，待精读（Batch B 起） |
| **L1 核心架构** | LDM | Batch B 第 1 篇（经 AudioLDM 2 落地） | ✅ 已读通，验收项见计划 §6 |
| **L2 基础生成模型** | DDPM / 采样 / CFG | Batch B 前置（不单独占批次） | ✅ 已读通 |
| **L3 音频表示** | 波形 / STFT / 梅尔 / 音频 VAE / 声码器 | Batch B 实践侧；Batch C 复现时再回查 | ✅ 已读通 |
| **L4 跨模态对齐** | CLAP / 文本编码器 | **Batch A 第 4 篇（前置）** + Batch B 条件注入 | 🚩 **正在读**（笔记 [CLAP](/notes/text-to-audio/papers/clap/)，10/20） |
| **评估与实现** | FAD / FD / KLD / CLAP score / IS；AudioCaps、Clotho | Batch A 尾（XACLE 指标口径）+ Batch C | 🚩 只读了结论，未实操 |

> **读法**：L0–L3 已经是「回查」而非「新学」；**L4 与评估是本学期唯一还在欠账的两块**，且都压在 Batch A 里。

---

## 2. 论文清单（地基 20 篇 + v10 新增 XACLE 线）

### 2.1 地基（2026-09-24 新增，见 RIS）

| 层 | 论文 | 标识符 | 落到哪批 | 为什么必须 |
|---|---|---|---|---|
| L2 | **DDPM** (Ho et al., NeurIPS 2020) | arXiv `2006.11239` | B | 扩散的起点 |
| L2 | **DDIM** (Song et al., ICLR 2021) | arXiv `2010.02502` | B | 少步采样，MeanAudio 的对照面 |
| L1 | **LDM** (Rombach et al., CVPR 2022) | arXiv `2112.10752` | B | AudioLDM 的架构来源 |
| L2 | **CFG** (Ho & Salimans, 2022) | arXiv `2207.12598` | B | 条件生成机制 |
| ★ | **Mean Flows** (Geng et al., **NeurIPS 2025**) | [NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/file/6d13e085b79d454da5910e4ca82a3d9d-Paper-Conference.pdf) ⚠️作者/arXiv待核实 | B | **MeanAudio 的直接基础** |
| — | **Flow Matching** (Lipman et al., ICLR 2023) | arXiv `2210.02747` | B | mean flows 所在范式 |
| — | **Rectified Flow** (Liu et al., ICLR 2023) | arXiv `2209.14577` | B | 与 mean flows 直接可比 |
| L1 | **VAE** (Kingma & Welling, ICLR 2014) | arXiv `1312.6114` | B | 潜空间理论基础 |
| — | **DiT** (Peebles & Xie, ICCV 2023) | arXiv `2212.09748` | B/C | Transformer 骨干取代 UNet |
| 可控 | **ControlNet** (Zhang et al., ICCV 2023) | arXiv `2302.05543` | D | Audio ControlNet 的直接来源 |
| 后训练 | **DPO** (Rafailov et al., NeurIPS 2023) | arXiv `2305.18290` | C | Resonate 的直接来源 |
| 后训练 | **GRPO / DeepSeekMath** (Shao et al., 2024) | arXiv `2402.03300` | C | Resonate 的 RL 算法 |
| L4 | **CLAP** (Elizalde et al., ICASSP 2023) | arXiv `2206.04769` | **A** | 四层前置的 L4；**已出笔记 [CLAP](/notes/text-to-audio/papers/clap/)（10/20）** |
| L3 | **EnCodec** (Défossez et al., 2022) | arXiv `2210.13438` | B | 离散音频 token |
| L3 | **HiFi-GAN** (Kong et al., NeurIPS 2020) | arXiv `2010.05646` | B | 梅尔谱→波形 |
| 基线 | **AudioGen** (Kreuk et al., ICLR 2023) | arXiv `2209.15352` | B | 自回归路线对照 |
| 基线 | **Stable Audio Open** (Evans et al., 2024) | arXiv `2407.14358` | B | 开源权重 + 长音频 |
| 评测 | **FAD** (Kilgour et al., **Interspeech 2019**) | arXiv `1812.08466` | A/C | 主指标原文（注意年份，常被误引） |
| 数据集 | **AudioCaps** (Kim et al., NAACL 2019) | arXiv `1811.10861` | B/C | 主评测集 |
| 数据集 | **Clotho** (Drossos et al., ICASSP 2020) | arXiv `1910.09387` | B | 主评测集 |
| L3 可选 | **AudioMAE** (Huang et al., NeurIPS 2022) | arXiv `2207.06405` | B | 掩码自监督音频表征 |

### 2.2 XACLE 编码器与标注线（v10 新增）

> 这一块是 v10 之前完全没有的。**理由**：科研主线换成 XACLE 2027 之后，「读懂 TTA」已经不够，还要「读懂怎么给一段音频打对齐分」——这是评测侧问题，编码器选择与标注协议直接决定上限。

| 论文 | 标识符 / 出处 | 状态 | 为什么现在读 |
|---|---|---|---|
| **RELATE** (Kanamori et al., Interspeech 2025) | ⚠️ **库内未见** | 🚩 待检索入库 | 主观对齐数据集与标注协议，XACLE 的祖先 |
| **XACLE Challenge 2026** (Okamoto et al., ICASSP 2026, pp. 21877–21879) | ⚠️ **库内未见** | 🚩 待检索入库 | 任务定义、seen setting、官方结果口径 |
| **MoEScore** | arXiv `2601.06829` | ⚠️ **库内未见** | 🚩 待检索入库 | 2026 冠军：4 专家（LAION / MGA / M2D-CLAP + BEATs-RoBERTa）+ 门控 |
| **CLAP** | arXiv `2206.04769` | ✅ 已在库 `TLX9KRF7` | ✅ **已读，见 [CLAP](/notes/text-to-audio/papers/clap/)** |
| **M2D-CLAP** | arXiv `2406.02032` | ✅ 已在库 `A4KBZ3MS` | 🚩 2027 基线编码器；注意 `80x1001p16` 的 patch 设计 |
| **BEATs** (Chen et al., ICASSP 2023) | arXiv `2212.05055` | ⚠️ **库内未见**（库内仅 HiFi-GAN 同作者） | 🚩 最强通用音频编码器之一，几乎必然进集成 |
| **TangoFlux** | arXiv `2412.21037` | ✅ 已在库 `7IN3IP4P` | Batch B 对照 + 复现替代方案 |
| **TMU System for XACLE** | arXiv `2602.00604` | ✅ 已在库 `KPPPI6C7` | 用 CLAP 伪标签训 LALM —— 有现成的强基线可借鉴 |
| 可选 **PEA-Frame** | HG `facebook/pe-a-frame-small` | ⚠️ 模型非论文，白名单内 | 可能带来增量，排在 Batch A 之后 |

> **一句话**：Batch A 六篇里，**库内只齐了 3 篇（CLAP / M2D-CLAP / TangoFlux）**，RELATE、XACLE Challenge 2026、MoEScore、BEATs 四篇要先补检索入库——**这是 10/25 检查点之前唯一与阅读有关的硬任务**。（比赛本身的硬任务是缓存 + 双留出 CV + 两个快基线，见计划 §4.2。）

### 2.3 后训练与一步生成线（v10 补记）

| 论文 | 出处 | 落到哪批 | 定位 |
|---|---|---|---|
| **Drifting** | arXiv `2602.04770` | C | 与 Mean Flows 同源（邓明扬 / 何恺明） |
| **DriftAudio** | arXiv `2609.27598` | C | 把 drifting 用到一步 TTA 的分布后训练 |
| **FdAudio** | arXiv `2607.10421` | C | FD 锚定 + MeanFlow 一致性约束 |
| **TinyAudio** | arXiv `2609.31525` | C | 87M 紧凑模型；「主观赢、客观输」的矛盾 |
| **DCASE 支线**（已作废） | — | ❌ | 见 §5.1 历史记录 |

---

## 3. 复现可行性核实（2026-09-24 实测，⚠️ 对象已被 v10 更换）

> ⚠️ **这张表已经过期**：v10 把复现三对象换成 **MeanAudio / FdAudio / TinyAudio**（计划 §4.3）。本表留作「MeanAudio / Resonate / Audio ControlNet 均已放权重」的历史证据，**不要再按它安排工作**。新的可行性核实见 §8。

| 项目 | 官方仓库 | 权重/可复现性 |
|---|---|---|
| **MeanAudio** | `xiquan-li/MeanAudio` | ✅ HF 模型 `AndreasXi/MeanAudio` + Space `chenxie95/MeanAudio` |
| **Resonate** | `xiquan-li/Resonate` | ✅ HF 模型 `AndreasXi/Resonate` + Space `chenxie95/Resonate`；仓库提供 **Pre-training / SFT / DPO / GRPO 全流程代码** |
| **Audio ControlNet** | `juhayna-zh/AudioControlNet`（README 在 **master** 分支） | ✅ HF checkpoints（`juhayna/audio-controlnet`）+ Space；控制类型：**响度 / 音高 / 事件** |

**关键判断**：三者**都放了推理权重** → L0/L1 级复现可行。
但 ⚠️ **Resonate 的 GRPO 训练需要 Large Audio Language Model 作 reward model**，全流程训练算力需求高，**本科阶段不建议做完整训练复现**。

---

## 4. 复现里程碑的现实分级（v10 重写：对象换成 MeanAudio / FdAudio / TinyAudio）

目标从「复现 Resonate / Audio ControlNet」改为「复现 MeanAudio / FdAudio / TinyAudio」（计划 §4.3），按复现深度分三档：

| 档 | 内容 | 可行性 |
|---|---|---|
| **必达** | MeanAudio 推理跑通 + 在 AudioCaps/Clotho 上复现 FAD / KL / CLAP（与论文表格同口径） | ✅ 现实（权重与代码齐全，风险最低） |
| **冲刺** | FdAudio 单步 + 25 步两套指标对齐，验证「FD 后训练涨点、多步不塌」 | ⚠️ 评测需 AudioCaps test 真值音频，BEATs 要手动挂 `PYTHONPATH` |
| **不建议** | ~~完整 GRPO 训练复现（需 LALM reward + 大量采样）~~ → 本条保留，仅适用于 Resonate 那条旧线 | ❌ 算力不划算 |

> **建议把里程碑定义为「三篇跑通 + 一篇 L1 指标复现 + 一份差异报告」**，而不是"两个系统完整重训"。定题需要的恰恰是**知道哪个环节有空白**，而这来自"跑通 + 对比"，不来自"重训成功"。
>
> **v10 补记（算力判断已更新）**：上面「不建议」一档只管 **TTA 的大模型**（480M / 3M 对数据）。**XACLE 不适用**——只训 1.84 M 的 head，20 epoch ≈ 1.6 h，本机可放心多 seed 多折（计划原则 7 的 v10 补充）。复现三对象的日期已落地：① MeanAudio 12/4–12/20、② FdAudio 1/11–2/7、③ TinyAudio 2/8–2/21。

---

## 5. 时间表（v10 起挂上真实日期）

> 与 AudioLDM 前置知识覆盖计划（大二上） §2 的排期表一致；**这里是阅读视角的压缩版**，含日期冲突时以计划为准。

| 时段 | 阅读 | 代码 / 科研 | 产出 |
|---|---|---|---|
| **10/19–10/25**<br>Batch A | 六篇速成（只读方法 + 实验节）：RELATE／XACLE Challenge／MoEScore／**CLAP**／M2D-CLAP／BEATs | XACLE：embedding 缓存 → 双留出 CV → 排序损失 + SVR 两个快基线 | 六份笔记（结构图 + 前向公式）；**CLAP 已完成（10/20）** |
| **10/26–11/18**<br>保底期 | Batch A 回查（按需，**不新增**） | Model 1–12；冻结 4 个 system；报告初稿 | 每周必报「全局 SRCC + 组内 SRCC」 |
| **11/19–12/3**<br>挑战期 | 暂停 | test 推理 → 12/3 提交 → 报告定稿 | 预测 CSV + YAML + 技术报告 |
| **12/4–12/20**<br>Batch B 前三篇 | AudioLDM 2 → Flow Matching + Rectified Flow → Mean Flows | **复现 ① MeanAudio**（推理 + FAD/KL 对齐） | 复现指标表 + 差异报告（≥3 个具体差异点） |
| **12/21–1/10**<br>期末 | Batch B 后两篇（轻读：MeanAudio / TangoFlux） | 差异报告写作（**不跑实验**） | — |
| **1/11–2/7**<br>寒假 | Batch C 前三篇 | **复现 ② FdAudio**（单步 / 25 步指标对齐） | 三种后训练范式的同口径对比素材 |
| **2/8–2/21** | Batch C 后两篇 | **复现 ③ TinyAudio**（代码未发布则换 TangoFlux） | — |
| **2/22–4/30**<br>大二下 | Batch D 按需 | 开源项目（`ttaeval` 首选） | 定题（优先走评测侧，避开 X-LANCE 组内主线） |

> ⚠️ **v10 的硬约束**：XACLE 六周半会吃掉原本给阅读主线的时间，**Batch B 整体后移到 12 月**。这是有意的交换——用一次完整闭环换掉「读了但没交付」。若 10/25 检查点不过，立刻退回「只交基线」，把 11 月还给阅读。

### 5.1 DCASE 支线（2026-10-17 新增 → **2026-10-19 作废**，保留作历史）

> ~~依据 保研 大纲 v2：「DCASE 挑战赛 + 自主研究」双线并行。挑战赛的价值在于**任务、基线、评测与时间节点都是现成的**——比"自己想一个课题"更容易在本科阶段跑通一轮完整闭环。~~
>
> **作废原因**：计划 v9 已把主线从 DCASE 换为 **XACLE 2027**；DCASE 的任务与 XACLE 不重叠，同时推进两条会两头都跑不通。**本小节整体退役，不再执行**，仅保留以说明「为什么曾经想做 DCASE」。

| 动作（已退役） | 内容 |
|---|---|
| **任务调研** | 捋清 DCASE 历届任务分类（声事件检测 / 声源分离 / 音频字幕 / 生成…） |
| **读基线** | 每个候选任务读官方 baseline 论文 + Task Description |
| **决定参赛与否** | 判断标准：能否在现有算力与时间下产出可提交结果 |
| **并入阅读路径** | ~~DCASE 相关方法论文并入本清单第 0–1 层~~ |

> **与 X-LANCE 主线的关系（仍然成立）**：无论走 DCASE 还是 XACLE，产出的技术报告 / workshop 论文都是"会议论文"这条线的一部分，**服务于 X-LANCE 申请，不产生保研加分**（见 保研 大纲 §0.1）。**这条判断没有随赛道更换而改变——XACLE 前 5 名被邀请投 ICASSP 2027，同样是会议不是期刊。**

---

## 6. Zotero 库卫生提醒

2026-09-24 清点发现（**2026-10-20 复核：基本已处理，剩下三条在 Zotero 侧**）：

| # | 项 | 2026-10-20 状态 |
|---|---|---|
| 1 | 未挂靠的附件条目约 40+ 条（`Preprint PDF` 28 / `PDF` 10 / `Full Text PDF` 9 / `Snapshot`） | ✅ 已清理（当前库 123 条条目，未见此类孤儿） |
| 2 | 重复条目：AudioLDM 2、Auffusion、MusicLDM、FreeAudio、PicoAudio、Retrieval-Augmented TTA、ARC、Diffsound、Audio-Journey、AudioLCM | ⚠️ 残留 1 条：`CYSIY6EY`「Majumder2024_Tango2」是导入残留的**孤儿父条目**，已被 `T7EXW39T`（Tango 2 正式条目，带 PDF）取代 → 建议删除 |
| 3 | `X-LANCE_TTA` 与 `提交版本` 是导入残留的集合 | 🚩 仍在，可归并或删除 |
| 4 | 建议集合结构：`地基` / `TTA 基线` / `X-LANCE` / `V2A（归档）` / `数据集与评测` | 🚩 目前只有 `Base` 一个集合 —— **结构未建** |
| 5 | **`Papers/` 里的 RIS 导入包**（`TextToAudio_AudioLDM.ris` 321 行、`X-LANCE_TTA.ris`、`生成模型地基参考文献.ris`） | ✅ **2026-10-20 三个全删**：它们导入的内容都已在库内，留在 vault 里等于给 Zotero 造第二真源 |
| 6 | **`Papers/TextToAudio_downloads/`（10 个 PDF + 交付清单）** | ✅ **2026-10-20 整目录删除**：10 个 PDF 与 Zotero storage 逐一 **SHA-256 相同**；交付清单自 2026-08-23 起从未勾完成，vault 内零引用。**Zotero 为唯一真源**，Obsidian 不再囤 PDF |

> **v10 追加**：Batch A 缺的四篇（RELATE / XACLE Challenge 2026 / MoEScore / BEATs）**需要先入库**，否则 10/25 检查点前的阅读任务无源可读。建议入库时直接挂进新建的 `XACLE` 集合，别再加进 `Base`。

---

## 7. 归档（按你的决定不读）

V2A / Foley 系 30+ 篇（MMAudio、Diff-Foley、Foleygen、FoleyCrafter、Kling-Foley、HunyuanVideo-Foley、ThinkSound、AudioX、LoVA、Frieren、V2A-Mapper…）以及 `Omni2Sound`：
**保留在库、标记为归档**。仅当选题转向 V2A / Foley / 空间音频时再启用。Omni2Sound 的**开源评测基准**在走"评测侧产出"时可以单独取用。

> **v10 注**：`AudioX`（ICLR 2026）在计划里同时出现在 **Batch D 前沿旁支** 与这里的归档名单——两份文档冲突时，**以计划为准：AudioX 解禁进 Batch D**，因为它和 XACLE 的「音频理解 + 生成统一」有交集。其余 V2A / Foley 篇目维持归档。

---

## 8. 复现对象的权重核实（占位，待 12 月补）

> v10 把复现三对象从 MeanAudio / Resonate / Audio ControlNet 改成了 **MeanAudio / FdAudio / TinyAudio**（§3 那张表仍是旧内容，仅作历史记录，日期以 §4、§5 为准）。FdAudio 与 TinyAudio 的仓库与权重可用性**本次未核实**——计划里已标：TinyAudio 的代码与权重到 2026-09-14 仍是 "coming soon"，FdAudio 评测需 AudioCaps test 真值音频、BEATs 要手动挂 `PYTHONPATH`。**12/4 开始复现前先跑一遍可用性检查，别到寒假才发现没代码。**

*内容由 AI 生成，仅供参考；导入后请抽查 2–3 条元数据。*

