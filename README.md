# izwarm

基于 Astro + TypeScript 重建的个人主页（第一阶段：首页一比一迁移）。

原站由 WordPress 渲染页面；新项目完全独立，不依赖 WordPress 页面渲染。
媒体资源（图片 / 视频 / 音频）当前从本地 `public/media/` 目录加载，
页面通过 `/media/...` 访问。如需切换回原 WordPress 地址、对象存储或独立 CDN，
只需修改 `src/config/media.ts` 中的 `MEDIA_BASE`。

## 技术栈

- Astro（静态站点构建）
- TypeScript
- GSAP 3.12.5（动画库，与原站版本一致）
- 原生 HTML / CSS

## 目录结构

```text
izwarm/
├── public/
│   ├── favicon/          # 预留：网站图标
│   └── media/            # 本地媒体资源（页面通过 /media/... 访问）
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   └── Landing.astro  # 首页（含 W → 各字母页面转场）
│   │   ├── notes/             # Notes 工作台组件（三栏骨架、右栏、系列树等）
│   │   └── common/
│   │       └── PanelRail.astro  # 两栏页面（Projects/Works/About）右栏字母导航
│   ├── config/
│   │   ├── media.ts      # 媒体资源地址（唯一配置点）
│   │   └── site.ts       # 站点配置
│   ├── content/
│   │   ├── notes/        # 预留：Notes 内容
│   │   ├── projects/     # 预留：Projects 内容
│   │   └── works/        # 预留：Works 内容
│   ├── content.config.ts # 内容集合配置
│   ├── lib/
│   │   └── notes.ts      # Notes 数据工具（系列树/归档/标签/统计/日历/字数）
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro   # 首页
│   │   ├── projects/     # Projects 两栏页面
│   │   ├── works/        # Works 两栏页面
│   │   ├── about/        # About 两栏页面
│   │   └── notes/        # Notes 工作台路由（见下文）
│   ├── scripts/
│   │   ├── home.ts       # 首页脚本（字母展开 / 转场 / BGM，由原 home.js 迁移）
│   │   ├── notes.ts      # Notes 交互（系列树展开、大纲高亮、无缝导航）
│   │   └── panel-nav.ts  # 面板无缝导航共享模块（fetch 替换、字母-路径映射）
│   └── styles/
│       ├── tokens.css    # 主题变量
│       ├── global.css    # 全局样式
│       ├── home.css      # 首页样式
│       └── notes.css     # 面板工作台样式（三栏 / 两栏）
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
├── README.md
└── CHANGES.md            # 变更记录（相对原源码的偏离说明）
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

打开 http://localhost:4321 查看首页。

### 类型检查

```bash
npm run typecheck
```

### 静态构建

```bash
npm run build
```

构建产物输出到 `dist/`。

### 本地预览构建产物

```bash
npm run preview
```

## 部署

执行 `npm run build` 后，将 `dist/` 部署到任意静态托管服务
（Netlify、Vercel、Cloudflare Pages、Nginx 等）即可。
站点地址如需调整，修改 `astro.config.mjs` 中的 `site` 字段。
部署到子路径（如 GitHub Pages 的 `/izwarm/`）时设置环境变量
`ASTRO_BASE=/izwarm/` 再构建，站内链接与媒体路径会自动带上前缀；
本地开发无需设置。

### 自动发布（GitHub Actions）

仓库已内置 `.github/workflows/sync-and-deploy.yml`：
Obsidian 私有仓库 push（`repository_dispatch`）、每 3 小时定时、
手动触发、网站 `main` push 都会触发：拉取私有 Obsidian 库 →
`npm ci` → `node scripts/sync-obsidian.mjs <库路径>` → `npm run build`
（`ASTRO_BASE=/izwarm/`）→ 部署到 GitHub Pages。

启用步骤：

1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**；
2. Settings → Secrets and variables → Actions 添加：
   - `OBSIDIAN_REPO`：私有 Obsidian 仓库，如 `izwarm195/obsidian`
   - `OBSIDIAN_TOKEN`：Personal Access Token（`repo` 权限，
     可读取私有库；如需 Obsidian 侧触发也用同一 token）
3. 在 Obsidian 私有仓库添加 `.github/workflows/notify-website.yml`
   （内容见下），并配置 `WEBSITE_TOKEN` secret（可用同一个 PAT）：

   ```yaml
   name: Notify website
   on:
     push:
       branches: [main]
   jobs:
     notify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/github-script@v7
           with:
             github-token: ${{ secrets.WEBSITE_TOKEN }}
             script: |
               await github.rest.repos.createDispatchEvent({
                 owner: 'izwarm195',
                 repo: 'izwarm',
                 event_type: 'obsidian-update',
               })
   ```

配置完成前首次运行会因缺少 Secret 失败，属预期；配置后手动
`workflow_dispatch` 跑一次验证即可。

### 虚拟主机手动部署（FTP）

域名解析到虚拟主机（如彩虹云香港）的站点采用手动部署：
CI 不再执行 FTP 上传，避免境外 IP 被动端口被主机防火墙拦截导致失败。

```bash
# 1. 构建（虚拟主机挂在根路径，不需要 ASTRO_BASE）
npx astro build --outDir dist-host

# 2. 用 FileZilla 等工具，将 dist-host/ 下的全部内容
#    上传到虚拟主机的网站根目录（如 /wwwroot/）
```

如需放行 CI 自动 FTP 部署，需在主机控制台/防火墙放行 FTP 被动端口
范围（Pure-FTPd 的 `PasvPortRange`），并确认未限制境外 IP 访问。

## 媒体资源说明

所有媒体地址集中在 `src/config/media.ts`，页面与脚本不直接写地址。
需要的文件如下，请按原文件名放入 `public/media/` 目录（区分大小写）：

| 文件名 | 用途 |
| --- | --- |
| `logo.png` | 完整 Logo |
| `iz.png` | 字母 iz |
| `w.png` / `a.png` / `r.png` / `m.png` | 字母 w / a / r / m |
| `Obsidian-Loop-Dark.mp4` | 深色主题背景视频 |
| `Obsidian-Loop-Light.mp4` | 浅色主题背景视频 |
| `video-cover-dark.png` | 深色视频封面（poster） |
| `video-cover-light.png` | 浅色视频封面（poster） |
| `ambient-loop.mp3` | 背景音乐（页面两个音频元素共用同一文件） |
| `Web_expand.mp3` | 展开音效 |
| `Web_dexpand.mp3` | 收回音效 |

若某些文件缺失，页面按原设计降级（深色底 / 封面 / 无音效），脚本不会报错。
文件放齐后运行 `npm run dev` 或 `npm run build` 即可从本地加载。

## 字母页面（Notes / Projects / Works / About）

四个字母页面共享同一套「字母转场 + 磨砂底板」机制，由 `src/scripts/home.ts`
的 `slideLetterToPanel(key)` / `slideLetterToHome(key)` 驱动（`panel-nav.ts`
提供共享的无缝替换逻辑）：

- **去程**：首页展开态点击字母，播放三段式滑动（竖直移动 → 水平右移），
  字母落位右栏，磨砂底板随之铺开。竖直方向自动对称——W / A 在 iz 上方
  （先下坠到中央），R / M 在 iz 下方（先上移到中央），终点都是右栏内居中；
- **回程**：面板内点击当前字母（或右栏 Home / 字母按钮），反向动画收起底板，
  恢复首页展开态；
- **内容切换**：W → Notes 用首页预渲染内容原位铺开；A / R / M → 对应页面在
  动画期间 `fetch` 目标页并原位替换底板内容（`pushState` 同步 URL），
  与 Notes 内部无缝导航一致。

### Notes 工作台（三栏）

Notes 工作台整体承载在磨砂“底板”内：首页点击字母 W 播放滑动转场，底板原位
打开即显示 Notes 工作台；`/notes/` 等路由用于直接访问与刷新恢复，渲染的是
同一页面（底板初始打开）。Notes 内部的状态切换（Home / 文章 / 归档 / 标签）
通过 `fetch` 原位替换底板内容 + `pushState` 同步 URL 无缝进行，不整页跳转；
浏览器前进 / 后退与直接刷新均可正确恢复。

- `/notes/`：Home —— 左栏简介 / 自动统计 / 文章日历，中栏递归系列树
- `/notes/[...slug]/`：Article —— 左栏自动大纲 + 同系列列表，中栏正文
- `/notes/archive/`：Archive —— 按年 / 月分组的文章归档
- `/notes/tags/`：Tags —— 全部标签
- `/notes/tags/[tag]/`：单标签文章列表

桌面为左 / 中 / 右三栏，右栏是 W 形导航（Home / Tags / Archive，悬停、键盘
focus 或移动端底部固定栏展开）；手机为单栏 + 底部导航（底板内滚动）。
所有统计、归档、标签、日历均由 `src/lib/notes.ts` 从内容集合自动派生。
正文支持 LaTeX 公式（KaTeX）与站内双链跳转；日历在内容跨年度时显示年份切换。
文章正文渲染为浅色「阅读卡」，遵循 Obsidian 阅读样式（宋体正文、楷体 h1、
仿宋 h2、强调色 `#3e7575`），与深色磨砂底板形成对比。

### Projects / Works / About（两栏）

这三个页面暂时为「内容 + 右栏导航」两栏布局（`NotesShell` 的 `is-page`
变体）：返回主页由常驻右栏的锚点字母承担（点击反向动画收起底板）；
悬停 / 键盘展开右栏菜单，Projects / Works 为 Selected / Timeline /
Statistics 三个子页面入口，About 暂无导航。左栏容器保留为空，供无缝切换
到 Notes 时由 `panel-nav` 填入侧栏内容。

- `/projects/`：Projects 主页 —— 内容建设中
  - `/projects/selected/`：精选项目
  - `/projects/timeline/`：项目时间线
  - `/projects/statistics/`：项目统计
- `/works/`：Works 主页 —— 内容建设中
  - `/works/selected/`：精选作品
  - `/works/timeline/`：作品时间线
  - `/works/statistics/`：作品统计
- `/about/`：About —— 内容建设中

主页面与子页面之间（如 `/projects/` ↔ `/projects/selected/`）通过 `fetch`
原位替换底板内容无缝切换（不整页刷新、不出现加载进度条）；指向 Notes 的
链接仍整页跳转（右栏锚点字母与路由一致）。后续可在此基础上扩展各页内容
与导航。

### 内容模型

`src/content.config.ts` 的 notes 集合字段：`title`、`description?`、
`publishDate`、`createdAt?`（创建时间，含时刻，用于同一天排序）、
`updatedDate?`、`tags`、`series`（多级路径数组）、`order?`、`draft?`、
`cover?`。`slug` 由 Astro 保留为 entry slug。

**系列数统计口径**：目录树中所有层级的系列节点数量（每个唯一前缀计一次）。
**字数统计口径**：中英文混合——CJK 逐字计数，拉丁词按词计数（见 `countWords`）。

### 草稿规则

- `draft: true` 的文章生产构建（`npm run build`）不展示；
- 开发环境可用 `getPublishedNotes(true)` 预览（当前页面默认不展示草稿）；
- 同步脚本跳过 `status: draft` 与 `publish: false` 的笔记。

### 示例内容与头像

- `src/content/notes/example-series/` 下有 3 篇带 `order`、封面、中文标签的示例文章，
  用于验证三级系列、大纲、标签与归档；运行 `npm run sync:notes` 会以白名单目录
  的真实内容重新生成整个 `src/content/notes/`（示例会被替换）。
- 头像读取 `public/media/profile.png`（`src/config/media.ts` 的 `profile` 字段），
  请将头像文件以该文件名放入 `public/media/`。

## 后续扩展

已预留目录：`src/components/home`、`src/content/{projects,works}`、
`public/favicon`、`public/media`。Projects / Works / About 页面骨架已就绪
（两栏布局 + 转场），后续在各自 `src/pages/{projects,works,about}/` 页面内
补充内容即可。

Obsidian 私有库 → 网站的内容发布规则（白名单目录、公开 Frontmatter、
slug 与字段推导）见 [docs/content-frontmatter.md](./docs/content-frontmatter.md)。

同步公开笔记到 `src/content/notes/`：

```bash
npm run sync:notes          # 使用脚本内默认的本地库路径
npm run sync:notes <path>   # 或指定 Obsidian 库路径
```

本地同步会同时刷新 `src/config/created-dates.json`（无日期笔记的真实创建时间
清单），并在生成的 frontmatter 中写入 `createdAt`，请随改动一起提交；CI 会
读取它，确保初始批量导入的笔记不堆在同一个日期，同一天内的文章按创建时间
从早到晚排序。

## 变更记录

见 [CHANGES.md](./CHANGES.md)。
