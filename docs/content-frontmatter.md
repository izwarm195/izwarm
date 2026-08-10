# 公开内容 Frontmatter 规范（Notes）

> 目标：Obsidian 私有库 → 同步脚本 → Astro 站点。本文定义“公开笔记”在网站侧使用的
> 规范化 Frontmatter，以及发布白名单规则。已与仓库主人确认（2026-08-10，内容模型
> 于 Notes 工作台重构时升级为 series / publishDate 模型）。

## 1. 发布规则

- **白名单目录**：`CPP`、`English`、`Machine & Deep Learning`、
  `Signals/Signals & Systems`（精确到该子目录）内的所有 Markdown **默认公开**，
  无需逐篇添加字段。`Signals` 下的其他子目录（如 `Signals/Text books`）不在白名单内。
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
| `slug` | string | 是 | 路径式永久链接，如 `cpp/summaries/const-correctness`；可用 `slug:` 覆盖。**Astro 保留字段**：不写入集合 schema，作为 entry slug 使用（页面通过 `entry.slug` 读取） |
| `description` | string | 否 | 笔记 `description`；缺省取正文首段 |
| `publishDate` | Date | 是 | 文件名日期 → `Date` / `Da` → Git 首次提交 |
| `updatedDate` | Date | 否 | Git 最近提交或 `updated_at` |
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
- **slug**：白名单根目录内相对路径逐段 slugify（小写；空格与 `&` 转 `-`；
  中文保留，由框架 URL 编码）。示例：
  - `CPP/Summaries/CS 26-07-09 const-correctness.md` →
    `cpp/summaries/const-correctness`
  - `English/Words Daily/WD 26-08-03.md` →
    `english/words-daily/wd-26-08-03`
  - `Signals/Signals & Systems/SS-QNA/SS-QNA-01.md` →
    `signals/signals-and-systems/ss-qna/ss-qna-01`
- **series**：白名单根目录名 + 根目录内相对路径，如
  `CPP/Summaries` → `["CPP", "Summaries"]`；
  `English/Words Summary/数学英语词汇` → `["English", "Words Summary", "数学英语词汇"]`。
- **tags**：保留 Obsidian `tags`；缺失时为空数组；另自动加入分类标签
  （`cpp` / `english` / `machine-learning` / `signals`）。
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
cover: /media/video-cover-dark.png
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
- 生成第 2 节规范化 Frontmatter，写入 `src/content/notes/`；
- 校验：slug 唯一、标题与日期缺失、未公开内部链接、疑似敏感信息、附件是否已授权。
