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
│   │   │   └── Landing.astro  # 首页 + Notes 底板共用结构
│   │   └── common/       # 预留：通用组件
│   ├── config/
│   │   ├── media.ts      # 媒体资源地址（唯一配置点）
│   │   └── site.ts       # 站点配置
│   ├── content/
│   │   ├── notes/        # 预留：Notes 内容
│   │   ├── projects/     # 预留：Projects 内容
│   │   └── works/        # 预留：Works 内容
│   ├── content.config.ts # 内容集合配置
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro   # 首页
│   │   └── notes/
│   │       └── index.astro  # Notes（初始即打开底板）
│   ├── scripts/
│   │   └── home.ts       # 首页脚本（由原 home.js 迁移）
│   └── styles/
│       ├── tokens.css    # 主题变量
│       ├── global.css    # 全局样式
│       └── home.css      # 首页样式
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

## 后续扩展

已预留目录：`src/components/home`、`src/components/common`、
`src/content/{notes,projects,works}`、`public/favicon`、`public/media`。
后续可在 `src/pages` 下新增 Notes / Projects / Works / About 页面。

Obsidian 私有库 → 网站的内容发布规则（白名单目录、公开 Frontmatter、
slug 与字段推导）见 [docs/content-frontmatter.md](./docs/content-frontmatter.md)。

同步公开笔记到 `src/content/notes/`：

```bash
npm run sync:notes          # 使用脚本内默认的本地库路径
npm run sync:notes <path>   # 或指定 Obsidian 库路径
```

## 变更记录

见 [CHANGES.md](./CHANGES.md)。
