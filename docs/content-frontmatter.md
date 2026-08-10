# 公开内容 Frontmatter 规范（Notes）

> 目标：Obsidian 私有库 → 同步脚本 → Astro 站点。本文定义“公开笔记”在网站侧使用的
> 规范化 Frontmatter，以及发布白名单规则。已与仓库主人确认（2026-08-10）。

## 1. 发布规则

- **白名单目录**：`CPP`、`English`、`Machine & Deep Learning`、
  `Signals/Signals & Systems`（精确到该子目录）内的所有 Markdown **默认公开**，
  无需逐篇添加字段。`Signals` 下的其他子目录（如 `Signals/Text books`）不在白名单内。
- **单篇退出**：笔记 Frontmatter 写 `publish: false` 则不公开。
- **草稿 / 归档**：`status: draft` 不发布；`status: archived` 从列表隐藏，
  但永久链接可保留。
- **PDF 默认不公开**：白名单目录内的 PDF（JOIN C++ 精选题集、IEEE Spectrum、
  nndl-practice 等）默认只以笔记摘要 + 来源信息形式呈现；确需公开时，
  在对应笔记 Frontmatter 中显式声明附件白名单。
- **始终排除**：`.obsidian/`、`.trash/`、`Templates/`、`Log/`、`_QuickAdd/`、
  `*.canvas`、`*.excalidraw`、`*.base` 等非内容文件（即使位于白名单目录内）。
- **现有笔记无需修改**：所有字段由同步脚本自动推导；若笔记内已写
  `title` / `slug` / `description` / `date` / `tags` 等字段，则优先使用笔记值。

## 2. 网站侧规范化 Frontmatter（生成字段）

| 字段 | 类型 | 必填 | 来源 / 说明 |
| --- | --- | --- | --- |
| `title` | string | 是 | 笔记 `title`；缺省取文件名（去前缀与日期） |
| `slug` | string | 是 | 路径式永久链接，如 `cpp/summaries/const-correctness`；可用 `slug:` 覆盖。**Astro 保留字段**：不写入集合 schema，作为 entry slug 使用（页面通过 `entry.slug` 读取） |
| `description` | string | 否 | 笔记 `description`；缺省取正文首段 |
| `date` | Date | 是 | 文件名日期 → `Date` / `Da` → Git 首次提交 |
| `updated` | Date | 否 | Git 最近提交或 `updated_at` |
| `category` | string | 是 | 顶层白名单目录名：CPP / English / Machine & Deep Learning / Signals |
| `section` | string | 否 | 白名单根目录内的相对子路径（如 Summaries、Words Daily、Python、Signals & Systems/SS-QNA） |
| `tags` | string[] | 否 | 保留 Obsidian 标签，自动补一个分类标签 |
| `status` | enum | 是 | `published` / `archived` / `draft` |

> `sourcePath` 仅在构建期使用（校验与溯源），不写入公开集合 schema，也不进入构建产物。

## 3. 字段推导规则

- **title**：去掉扩展名；剥离前缀 `CS `、`CE `、`WD `、`WS `、`SS-QNA-`
  以及日期段 `YY-MM-DD`；中文保留。示例：
  `CS 26-07-09 const-correctness.md` → `const-correctness`；
  `SS-QNA-01.md` → `SS-QNA-01`；`第二章 连续时间系统时域分析.md` → 原名保留。
- **date**：文件名日期 `26-07-09` → `2026-07-09`；否则解析现有
  `Date: 26-07-09` / `Da: 26-07`；否则取 Git 首次提交日期。
- **slug**：白名单根目录内相对路径逐段 slugify（小写；空格与 `&` 转 `-`；
  中文保留，由框架 URL 编码）。示例：
  - `CPP/Summaries/CS 26-07-09 const-correctness.md` →
    `cpp/summaries/const-correctness`
  - `English/Words Daily/WD 26-08-03.md` →
    `english/words-daily/wd-26-08-03`
  - `Machine & Deep Learning/Python/Numpy 函数汇总.md` →
    `machine-and-deep-learning/python/numpy-函数汇总`
  - `Signals/Signals & Systems/SS-QNA/SS-QNA-01.md` →
    `signals/signals-and-systems/ss-qna/ss-qna-01`
- **category**：白名单根目录名（原样保留，含空格与 `&`）。
- **section**：根目录内的一级及以上相对路径，如 `Words Daily`、
  `Python`、`Signals & Systems/SS-QNA`。
- **tags**：保留 Obsidian `tags`；缺失时为空数组；另自动加入分类标签
  （`cpp` / `english` / `machine-learning` / `signals`）。
- **status**：缺省 `published`；`publish: false` 或 `status: draft` 的笔记不产出。

## 4. 示例

`CPP\Summaries\CS 26-07-09 const-correctness.md` 生成：

```yaml
---
title: const-correctness
slug: cpp/summaries/const-correctness
description: const-correctness 要点总结
date: 2026-07-09
updated: 2026-08-10
category: CPP
section: Summaries
tags:
  - cpp
  - summaries
status: published
---
```

`English\Words Daily\WD 26-08-03.md` 生成：

```yaml
---
title: WD 26-08-03
slug: english/words-daily/wd-26-08-03
date: 2026-08-03
category: English
section: Words Daily
tags:
  - english
  - vocabulary
status: published
---
```

## 5. 同步脚本职责（后续实现）

- 遍历白名单目录，跳过非 Markdown 与排除项；
- 解析 YAML Frontmatter，按第 1 节规则判定是否发布；
- 转换 Obsidian 语法：`[[双链]]` → 站内链接、`![[图片]]` → 图片引用、
  `> [!note]` Callout → 带类型容器、`==高亮==` → 强调；剥离 `dataviewjs` 块；
- LaTeX（`$...$` / `$$...$$`）保留，供后续 KaTeX 渲染；
- 生成第 2 节规范化 Frontmatter，写入 `src/content/notes/`（或构建缓存目录）；
- 校验：slug 唯一、标题与日期缺失、未公开内部链接、疑似敏感信息、附件是否已授权。
