# 公开内容 Frontmatter 规范（Notes）

> 目标：Obsidian 私有库 → 同步脚本 → Astro 站点。本文定义“公开笔记”在网站侧使用的
> 规范化 Frontmatter，以及发布白名单规则。已与仓库主人确认（2026-08-10，内容模型
> 于 Notes 工作台重构时升级为 series / publishDate 模型）。

## 1. 发布规则

- **白名单目录**：`CPP`、`English`、`Machine & Deep Learning`、
  `Signals/Signals & Systems`（精确到该子目录）、`Signals/数字电路与系统`、`Physics`
  内的所有 Markdown **默认公开**，无需逐篇添加字段。`Signals` 下的其他子目录不在白名单内。
- **单篇退出**：笔记 Frontmatter 写 `publish: false` 则不公开。
- **草稿 / 归档**：`status: draft` 不发布；`draft: true` 在生产构建隐藏、
  开发环境可预览。
- **PDF 默认不公开**：白名单目录内的 PDF 默认只以笔记摘要 + 来源信息形式呈现；
  确需公开时，在对应笔记 Frontmatter 中显式声明附件白名单。
- **始终排除**：`.obsidian/`、`.trash/`、`Templates/`、`Log/`、`_QuickAdd/`、
  `*.canvas`、`*.excalidraw`、`*.base` 等非内容文件。
- **现有笔记无需修改**：所有字段由同步脚本自动推导；若笔记内已写
  `title` / `slug` / `description` / `tags` / `series` / `order` 等字段，
  则优先使用笔记值。

## 2. 网站侧规范化 Frontmatter（生成字段）

| 字段 | 类型 | 必填 | 来源 / 说明 |
| --- | --- | --- | --- |
| `title` | string | 是 | 笔记 `title`；缺省取文件名（去前缀与日期） |
| `slug` | string | 是 | 路径式永久链接，如 `cpp/summaries/const-correctness`；由 分类目录 + 子目录 + 标题推导，中文段落按 `scripts/slug-aliases.mjs` 换成 ASCII 代号（见 §3）。**Astro 保留字段**：不写入集合 schema，作为 entry slug 使用（页面通过 `entry.slug` 读取） |
| `description` | string | 否 | 笔记 `description`；缺省取正文首段 |
| `publishDate` | Date | 是 | 文件名日期 → `Date` / `Da` → `created-dates.json` 清单 → Git 首次提交 |
| `updatedDate` | Date | 否 | 只取笔记 `updated_at`（真实编辑时间）；缺失则不输出（**不再回退 Git 最近提交**，见 §6） |
| `tags` | string[] | 否 | 保留 Obsidian 标签，自动补一个分类标签 |
| `series` | string[] | 否 | 多级系列路径，如 `["English", "Words Summary", "数学英语词汇"]`，由白名单目录结构推导 |
| `order` | number | 否 | 同系列内排序权重（缺省按日期、再按标题稳定排序） |
| `draft` | boolean | 否 | `true` 时生产构建不展示 |
| `cover` | string | 否 | 封面图片路径 |

> `sourcePath` 仅在构建期使用（校验与溯源），不写入公开集合 schema。

## 3. 字段推导规则

- **title**：去掉扩展名；剥离前缀 `CS `、`CE `、`WD `、`WS `、`SS-QNA-`
  以及日期段 `YY-MM-DD`；中文保留。示例：
  `CS 26-07-09 const-correctness.md` → `const-correctness`；
  `SS-QNA-01.md` → `SS-QNA-01`；`第二章 连续时间系统时域分析.md` → 原名保留。
- **publishDate**：文件名日期 `26-07-09` → `2026-07-09`；否则解析现有
  `Date: 26-07-09` / `Da: 26-07`；否则取 Git 首次提交日期。
- **slug**：白名单根目录内相对路径逐段 slugify（小写；空格与 `&` 转 `-`），
  中文段落先按 `scripts/slug-aliases.mjs` 换成 ASCII 代号。示例：
  - `CPP/Summaries/CS 26-07-09 const-correctness.md` →
    `cpp/summaries/const-correctness`
  - `English/Words Daily/WD 26-08-03.md` →
    `english/words-daily/wd-26-08-03`
  - `Signals/Signals & Systems/SS-QNA/SS-QNA-01.md` →
    `signals/signals-and-systems/ss-qna/ss-qna-01`
  - `Signals/数字电路与系统/第3章 逻辑函数及其简化.md` →
    `signals/dcs/ch3`
  - `Physics/第九章 振动 公式总结.md` → `physics/ch9`

  **为什么要换**：`slugify` 保留中文（`\p{L}`），而浏览器把每个中文字符百分号编码成 9 个字符，
  于是 `signals/数字电路与系统/第3章-逻辑函数及其简化` 会变成 168 字符的 URL。换代号后
  全站笔记 URL 平均从 82 字符降到 39，最长从 226 降到 73，且路径里不再出现百分号编码。

  代号来源按优先级：
  1. `scripts/slug-aliases.mjs` 的人工别名表，键是**原文段落**（标题或目录名，一字不差，
     含 `&`、`（）`、全角引号），值只允许 `[a-z0-9-]`。同一张表既管目录名也管笔记标题，
     所以 `数学英语词汇` 目录和它里面的同名笔记一行就够。想让某一章自定义（如
     `ch9-oscillation`）也直接在这一行覆盖规则。
  2. 章节规则：`第3章…` / `第九章…` → `ch3` / `ch9`（阿拉伯与中文数字都认）；`第1节…` → `s1`；`附录` → `appendix`。
  3. 都没有 → 保留 slugify 后的中文（不会静默丢字），并在同步结尾用 `warn` 把段落原文列出来，
     照着往别名表补一行即可。

  两条护栏：**slug 撞车会直接抛错中止同步**（两篇笔记映射到同一 slug 会互相覆盖产出文件，
  等于静默丢一篇），抛错发生在清空输出目录之前，不会破坏已同步内容；别名表的值也会被
  `--selftest` 校验必须是纯 ASCII 片段。

  > 注意：`slug:` frontmatter **不能**覆盖站点 slug（同步脚本自己生成 slug，不读笔记里的同名字段）。
- **series**：白名单根目录名 + 根目录内相对路径，如
  `CPP/Summaries` → `["CPP", "Summaries"]`；
  `English/Words Summary/数学英语词汇` → `["English", "Words Summary", "数学英语词汇"]`。
- **tags**：保留 Obsidian `tags`；缺失时为空数组；另自动加入分类标签
  （`cpp` / `english` / `machine-learning` / `signals` / `physics`）。
- **updatedDate**：只认笔记里的 `updated_at`（Time Things 插件写入的真实编辑时间）。
  该字段是热力图与"更新于"的唯一真实时间来源，因此不再回退 Git 最近提交日期。
  注意插件的 `modifiedKeyFormat` 必须用 `YYYY` 这样的合法 token；若写成 `YY-MM-DD[T]HH:mm:ss`，
  插件会把 `YY` 原样写进笔记（`updated_at: YY-09-16T23:18:58`）。同步脚本会按上下文年份把
  这类占位符补全（`YY-09-15T19:42:56` → `2026-09-15T19:42:56`），不会丢弃。
- **draft**：`status: draft` 或 `publish: false` 的笔记不产出；
  手写内容可用 `draft: true` 在开发时预览、生产构建隐藏。

## 4. 示例

`CPP\Summaries\CS 26-07-09 const-correctness.md` 生成：

```yaml
---
title: const-correctness
slug: cpp/summaries/const-correctness
description: const-correctness 要点总结
publishDate: 2026-07-09
updatedDate: 2026-07-09
tags:
  - cpp
  - summaries
series:
  - CPP
  - Summaries
---
```

手写文章可显式指定系列、排序与封面：

```yaml
---
title: 示例文章
publishDate: 2026-08-01
tags:
  - 示例
series:
  - 示例系列
  - 第一层
  - 第二层
order: 1
cover: /media/video-cover-dark.jpg
---
```

## 5. 同步脚本职责

- 遍历白名单目录，跳过非 Markdown 与排除项；
- 解析 YAML Frontmatter，按第 1 节规则判定是否发布；
- 转换 Obsidian 语法：`[[双链]]` → 站内链接（已发布笔记转 `/notes/<slug>/`，
  未公开或不存在时保持纯文本，避免生成 404 链接）、
  `![[图片]]` → 图片引用、`> [!note]` Callout → 带类型容器、`==高亮==` → 强调；
  剥离 `dataviewjs` 块；
- LaTeX（`$...$` / `$$...$$`）保留（当前以纯文本渲染，后续可接 KaTeX）；
- URL 段落代号：中文目录名与笔记标题按 `scripts/slug-aliases.mjs` 换成 ASCII 代号，章节走规则；
  没有代号的段落保留中文并在同步结尾 `warn` 列出；slug 撞车直接抛错中止（见 §3）；
- 表格分隔行按表头格数补齐：Obsidian 阅读视图对「表头 5 格、分隔行只写 4 个 `---`」是宽容的，
  `remark-gfm` 不是 —— 格数不一致时整张表不成立，会退化成一段带竖线的普通段落（见 §7）；
- 生成第 2 节规范化 Frontmatter，写入 `src/content/notes/`；
- 校验：slug 唯一、标题与日期缺失、未公开内部链接、疑似敏感信息、附件是否已授权。

## 6. 热力图（Notes 首页日历）数据来源

热力图强度 = **当日 vault 提交数 + 当日创建/修改过的笔记数**：

- **提交数**：同步脚本用 `git log` 遍历白名单根目录的历史，生成
  `src/config/commit-activity.json`（`YYYY-MM-DD → 提交数`）。vault 不可用或无 git 历史时
  脚本会告警并保留原文件，不会静默沿用旧数据。
- **编辑数**：来自笔记自身的 `createdAt` / `updatedDate`（即 `updated_at`）。
  只按提交数着色时，"写了笔记但那天没有备份提交"的日子会整片空白，
  持续写作看起来就像热力图没更新，所以两者相加决定档位。

因此热力图能反映真实写作日，而不是 vault 的备份提交日（vault 常是隔几天批量备份一次）。

> 安全闸：同步脚本在"一个候选笔记都没有"（vault 路径写错/未检出）时会告警并**不做任何写入**，
> 不会清空 `src/content/notes/`。

## 7. 习题答案折叠块（`<details class="answer">`）

章节习题笔记（目前是 `Signals/数字电路与系统`）的约定：每道题（`## N.M`）后面跟**一个**原生
折叠块，块内是完整 markdown（表格、`$LaTeX$`、列表都可以）。

```markdown
## 2.1 将下列二进制数转换为十进制数。

(1) 1011.101

<details class="answer">
<summary>答案</summary>

(1) 11.625

</details>
```

**`<summary>` 之后必须空一行**：`<details>` 起始标签按 CommonMark 属于 HTML 块，靠空行结束，
之后的 markdown 才会被正常解析成段落 / 表格 / 公式；少了那个空行，块内内容会整段退化成纯文本。
`</details>` 前面也留一个空行，成对收尾。

站点侧（`src/pages/notes/[...slug].astro` + `src/scripts/panel-nav.ts`）：

- **单个展开 / 收起**走浏览器原生 `<details>`：脚本不 `preventDefault`、不代管 `open`；
- **全部展开 / 收起**由正文上方的「展开全部答案 / 收起全部答案（N 题）」按钮负责，
  只切换所有 `details.answer` 的 `open`，文案随状态在两种说法间切换；
- 判据优先 `class="answer"`；渲染器若把 class 剥掉，退回 `<summary>` 文本恰为「答案」的块。
  两条判据在服务端（渲染按钮与否）与客户端（收集折叠块）各判一次，没有答案块的章节
  （如第 5 章当时只有题目）不会渲染出空工具栏，也不报错。

配套的同步侧处理：`normalizeTableDelimiters()` 会把「表头 5 格、分隔行只写 4 个 `---`」的
GFM 表格按表头格数补齐。Obsidian 阅读视图对这类表是宽容的，`remark-gfm` 不是 —— 分隔行格数
不一致时**整张表不成立**，会退化成一段带竖线的普通段落（数电笔记的卡诺图曾如此）。

