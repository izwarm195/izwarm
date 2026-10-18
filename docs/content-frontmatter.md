# 公开内容 Frontmatter 规范（Notes）

> 目标：Obsidian 私有库 → 同步脚本 → Astro 站点。本文定义“公开笔记”在网站侧使用的
> 规范化 Frontmatter，以及发布白名单规则。已与仓库主人确认（2026-08-10，内容模型
> 于 Notes 工作台重构时升级为 series / publishDate 模型）。

## 1. 发布规则

- **白名单目录**：`CPP`、`English`、`Machine & Deep Learning`、
  `Signals/Signals & Systems`（精确到该子目录）、`Signals/数字电路与系统`、`Physics`、
  `Complex`
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

热力图的三条信号（色相 / 深浅 / 金框）来自三个不同的数据源：

- **有没有文章（色相）**：来自站点自己的笔记数据 —— 当日 `publishDate` 的笔记数。
  有文章走主题色 `--accent`，只有提交走白色，都没有则是空格子。
- **提交深浅**：`git log` 按天统计的提交数，两份同构数据相加后按全年最大值归一。
  - vault 提交：同步脚本遍历白名单根目录的历史，生成
    `src/config/commit-activity.json`（`YYYY-MM-DD → 提交数`）。
  - 网站仓库提交：同一个脚本对整个网站仓库跑一遍 `git log`，生成
    `src/config/web-commit-activity.json`。CI 里 `actions/checkout` 必须
    `fetch-depth: 0`，否则只克隆到一个提交，这份数据会退化成 1 天。
  - 任一份取不到 git 历史时脚本会告警并保留原文件，不会静默沿用旧数据。
- **金框（第三件事）**：网站仓库当天有提交的格子加一圈 `--cal-gold`。
  底色已经被"有没有文章"占住，所以这一条只用边框表达，不改颜色。
  图例第三项即此项。

**编辑数不再参与着色**：笔记的 `createdAt` / `updatedDate`（即 `updated_at`）
仍会算进日历（`CalendarDay.touched`），但强度轴只认提交总数。

> 安全闸：同步脚本在"一个候选笔记都没有"（vault 路径写错/未检出）时会告警并**不做任何写入**，
> 不会清空 `src/content/notes/`。

## 7. 折叠块（Obsidian 折叠 callout → `<details>`）

习题答案（`Signals/数字电路与系统`、`Complex`）与物理笔记的「本节包含」都用 **Obsidian 折叠
callout** 写：`> [!类型]- 标题` 默认收起，`> [!类型]+ 标题` 默认展开。这是 vault 侧的**唯一**
写法 —— 不要手写 `<details>` HTML 块：那样在 Obsidian 阅读视图里块内公式不会被渲染，
而站点侧也拿不到块内结构。

```markdown
## 2.1 将下列二进制数转换为十进制数。

(1) 1011.101

> [!answer]- 答案
>
> (1) $1011.101_{2} = 11.625_{10}$
```

同步脚本（`sync-obsidian.mjs` 的 `foldCallouts()`，跑在 markdown 解析之前）把整块转成：

```html
<details class="answer">
<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer"><strong>答案</strong></summary>

(1) $1011.101_{2} = 11.625_{10}$

</details>
```

要点：

- **必须转成 HTML 块 + 空行的形式**，块内正文才会被当普通 markdown 解析 —— 公式照常交给
  KaTeX，真值表照常成表，列表照常成列表；直接塞进 `<summary>` 后面不空行就会整段退化成纯文本。
- 块内每行的 `> ` 前缀会被剥掉；`> > …` 这类嵌套引用剥一层后仍是引用（符合原意）。
- 紧跟着的下一个 callout 另起一块，不会把两段答案并进同一个 `details`。
- 列表内的 callout（`- > [!note]`）与嵌套 callout（`> > [!x]`）不在这里处理，仍走原来的
  逐行 callout 规则（只是不折叠）；代码围栏里的 `> [!x]-` 样例也不会被改写。
- 类名：`answer` → `details.answer`；其他类型 → `details.callout-fold`。两者外观相同
  （`src/styles/notes.css` 用 `:is(.answer, .callout-fold)` 共用一套规则），但只有 `answer`
  会被「展开全部答案」按钮一起开合。
- `description` 会自动跳过整个 `<details>` 块，不会把答案或 HTML 标签当摘要。

站点侧（`src/pages/notes/[...slug].astro` + `src/scripts/panel-nav.ts`）：

- **单个展开 / 收起**走浏览器原生 `<details>`：脚本不 `preventDefault`、不代管 `open`，
  `-` / `+` 的默认状态由同步脚本写成的 `open` 属性决定；
- **全部展开 / 收起**由正文上方的「展开全部答案 / 收起全部答案（N 题）」按钮负责，
  只切换所有 `details.answer` 的 `open`，文案随状态在两种说法间切换；
- 判据优先 `class="answer"`；渲染器若把 class 剥掉，退回 `<summary>` 文本恰为「答案」的块。
  两条判据在服务端（渲染按钮与否）与客户端（收集折叠块）各判一次，没有答案块的笔记
  （如第 5 章当时只有题目、物理笔记只有「本节包含」）不会渲染出空工具栏，也不报错。

配套的同步侧处理：`normalizeTableDelimiters()` 会把「表头 5 格、分隔行只写 4 个 `---`」的
GFM 表格按表头格数补齐。Obsidian 阅读视图对这类表是宽容的，`remark-gfm` 不是 —— 分隔行格数
不一致时**整张表不成立**，会退化成一段带竖线的普通段落（数电笔记的卡诺图曾如此）。

## 8. 图片尺寸（`![说明|宽度](url)`）

vault 里的图几乎都是 Obsidian 导出的公式 SVG 与代码 / 曲线截图，原图普遍 1200px 以上，
而正文栏只有约 772px。原来只写 `max-width: 100%`，效果就是**每张图都撑满整栏** ——
一张两行的公式也占满一屏宽。现在分两层控制：

**① 默认宽度（全局）**：`--article-img-width`，定义在 `src/styles/tokens.css`，默认 `66%`
（正文栏约 772px → 约 510px）。**所有没单独写尺寸的图都按这个比例显示**，包括原本比它小的图
（会被等比放大，纯文字小截图可能发虚，这类图建议单独写 `|360` 之类）。
想整体改比例只改这一个值；手机（≤900px）回到 `100%`，否则两百多像素看不清字。

**② 逐张指定（vault 侧）**：用 Obsidian 自己的尺寸语法，阅读视图里同样生效。
`src/lib/rehype-image-size.mjs`（rehype 插件，构建时跑）把它转成 `img` 的 `style`：

| vault 写法 | 生成的样式 | 效果 |
| --- | --- | --- |
| `![说明\|360](url)` | `width: 360px; max-width: 100%` | 固定 360px 宽，居中 |
| `![说明\|360x240](url)` | `width: 360px; aspect-ratio: 360 / 240` | 同时定宽高比，窄屏被压窄时等比缩、不变形 |
| `![说明\|60%](url)` | `width: 60%; max-width: 100%` | 相对正文栏宽（60% ≈ 460px） |
| `![说明\|100%](url)` | `width: 100%; max-width: 100%` | 铺满整栏 —— 大架构图、宽表截图用这个 |
| `![](url)` | 不加行内样式 | 走默认 66% |

要点：

- 尺寸后缀写在 **alt** 里，构建时会被剥掉，不会混进无障碍文本；`![|360](url)`（无说明）
  也认，剥完就是 `alt=""`，当装饰图处理。
- 行内 `width` 的优先级高于样式表，所以 `|100%` 一定能盖掉默认的 66%；
  行内再带一条 `max-width: 100%`，`|1200` 这种写超宽的也会被压回正文栏内。
- 只作用于正文（`.article-body`）里的 `<img>`；`cover`、callout 徽标（`.callout-badge`）、
  文章卡片缩略图、首页配图都不受影响。
- **图片写在表格单元格里时**，`|` 会被当成列分隔符，要写成 `![说明\|360](url)`（GFM 转义），
  否则整张表会被拆列。表格外的图不用转义。
- 正文之外（首页、About 等手写 Astro 组件里的图）不走这套规则，直接改组件或 CSS。
- **按系列改默认比例**：`[...slug].astro` 把 frontmatter 里 `series` 的末级写到
  `.article-body[data-series]`，所以 `notes.css` 可以按系列下发变量，例如数电
  （`数字电路与系统`）整组压到 45%：`.article-body[data-series='数字电路与系统'] { --article-img-width: 45% }`。
  新增一个系列要换比例，照这个写法加一条即可，不用动内容。


