# 变更记录（相对原源码）

第一阶段目标是忠实迁移，以下是相对原源码的全部偏离及原因。
每一项都已说明是否影响视觉 / 交互，以及验证方式。

## 1. 媒体地址由 http 调整为 https

- **修改**：`src/config/media.ts` 中所有媒体地址使用
  `https://www.izwarm.top/wp-content/uploads/2026/07/`。
- **原因**：大纲第四节的明确要求；现代浏览器对混合内容有限制。
- **影响**：URL 的目录、日期、大小写、文件名均未改变，视觉 / 交互不受影响。
- **验证**：构建后检查产物中媒体地址均以 `https://` 开头，并通过浏览器实际加载验证。

## 2. GSAP 由 CDN 全局脚本改为 npm 包导入

- **修改**：原页面通过 cdnjs 加载 `gsap/3.12.5/gsap.min.js`，
  新项目改为 `npm install gsap@3.12.5` 并在 `src/scripts/home.ts` 中
  `import { gsap } from 'gsap'`。
- **原因**：保持同一动画库与版本，同时让项目可独立构建、离线打包；
  符合大纲“保留 GSAP、不更换动画库”的要求。
- **影响**：GSAP 时间线、缓动、延迟、坐标完全不变，视觉 / 交互不受影响。
- **验证**：对比迁移后的脚本与原 `home.js`，动画参数逐一相同；
  浏览器中实际点击展开 / 收起验证。

## 3. 内嵌 CSS 拆分为三个样式文件

- **修改**：原 HTML 内嵌 `<style>` 拆分为
  `src/styles/tokens.css`（主题变量）、`src/styles/global.css`（全局基础）、
  `src/styles/home.css`（首页样式）。
- **原因**：大纲第五节要求全局样式与主页样式分离。
- **影响**：选择器与属性值原样保留，视觉不受影响。
- **验证**：构建产物中的 CSS 与原文逐条比对。

## 4. 原 home.js（IIFE）迁移为 TypeScript 模块

- **修改**：`home.js` 迁移至 `src/scripts/home.ts`，
  IIFE 改为模块，加入类型标注与元素空值检查。
- **原因**：大纲第二节 / 第三节要求使用 TypeScript，第六节要求对缺失元素做安全检查。
- **影响**：逻辑、DOM 查询、GSAP 时间线、状态判断、事件绑定顺序均不变；
  仅在元素不存在时不再抛错（正常页面中元素均存在，行为无差异）。
- **验证**：`npm run typecheck` 通过；浏览器中验证初始状态与展开状态。

## 5. 页面结构由 Astro 布局与页面输出

- **修改**：`<html>` / `<head>` / `<body>` 由 `src/layouts/BaseLayout.astro` 输出，
  主页 DOM 放入 `src/pages/index.astro`。
- **原因**：Astro 项目结构要求（大纲第五节）。
- **影响**：DOM 层级、class、id、data 属性、文案均保持不变，视觉不受影响。
- **验证**：构建产物 HTML 与原 HTML 比对。

## 6. 脚本标签不再请求 WordPress 路径

- **修改**：原 `<script src="/wp-content/themes/twentytwentyfive/assets/home.js">`
  改为 Astro 打包脚本。
- **原因**：新项目不依赖 WordPress（大纲核心技术方案）。
- **影响**：不再访问 WordPress 路径，首页脚本行为不变。
- **验证**：构建产物中无 WordPress 路径请求，脚本正常执行。

## 7. 保留的原版行为备注

- 初始 `data-theme="dark"` 位于 `<html>`，而 `window.izwarmSetTheme`
  写入 `document.body`，这是原版既有行为，本次未“修正”，以保持主题行为一致。
- 未新增键盘焦点 / 可访问性增强等新功能，以遵守大纲“不要擅自增加新功能”。
  后续如需可单独评估。

## 8. 新增内容集合最小配置

- **修改**：新增 `src/content.config.ts`，为预留的
  `notes` / `projects` / `works` 目录定义最小内容集合。
- **原因**：Astro 对 `src/content/` 下未定义集合的目录自动生成集合并提示弃用；
  该配置是消除警告的最小方案，也为后续内容页面做准备。
- **影响**：不包含任何页面代码，首页不受影响。
- **验证**：构建日志不再出现自动生成集合的弃用警告。

## 9. 修复展开后字母不可点击的问题

- **修改**：`src/styles/home.css` 新增
  `.landing.expanded #letter-w / #letter-a / #letter-r / #letter-m { pointer-events: auto; }`。
- **原因**：原版 CSS 中 `#letter-* { pointer-events: none; }` 的 ID 选择器优先级
  高于 `.logo-letter { pointer-events: auto; }`，导致展开后字母始终无法接收点击：
  点击会落到背景视频上，触发的是“收起”而非“跳转”。
  原版 JS 已为字母绑定跳转监听、设置了 `cursor:pointer` 和悬停光晕，
  可点击是明确的设计意图，属于“确定存在的错误”（大纲允许修复）。
- **影响**：修复后字母点击可正常跳转，悬停光晕恢复；不影响动画节奏与布局。
- **验证**：无头浏览器点击字母 m，页面跳转至 `/about/`。

## 10. 媒体 HTTPS 加载情况报告（未擅自替换）

- 按大纲第四节要求，所有媒体地址已由 `http://` 调整为 `https://`，
  目录、日期、大小写与文件名均未改变，地址统一集中在 `src/config/media.ts`。
- **发现问题**：`https://www.izwarm.top` 当前返回的 TLS 证书为 `*.starc.cc`
  （签发方 SSL.com，与站点域名不匹配），浏览器对全部 14 个媒体地址
  报 `ERR_CERT_COMMON_NAME_INVALID`；`izwarm.top`（无 www）域名不存在。
  即：按大纲要求的 https 地址目前无法在浏览器中加载媒体。
- **处理**：按大纲“不要擅自替换资源”的要求，地址保持原样未替换。
  待服务器证书修复后即可加载；或按预留机制修改 `src/config/media.ts`
  一处即可切换至本地 `public/media`、对象存储或独立 CDN。
- **涉及地址（14 个）**：
  - logo.png / iz.png / w.png / a.png / r.png / m.png
  - Obsidian-Loop-Dark.mp4 / Obsidian-Loop-Light.mp4
  - video-cover-dark.png / video-cover-light.png
  - ambient-loop.mp3（×2）/ Web_expand.mp3 / Web_dexpand.mp3
- **验证**：无头浏览器观察到的失败详情记录于验证输出。

## 11. 媒体地址切换为本地 public/media/

- **修改**：`src/config/media.ts` 的 `MEDIA_BASE` 由
  `https://www.izwarm.top/wp-content/uploads/2026/07` 改为 `/media`
  （Astro 将 `public/media/` 原样输出到站点根路径，页面以 `/media/...` 访问）。
- **原因**：用户决定将媒体放在本地，不再依赖原 WordPress 媒体服务器
  （其 HTTPS 证书与域名不匹配，详见第 10 条）。本条即第 10 条中
  “预留切换机制”的实际应用，页面与脚本无需改动。
- **影响**：文件放入 `public/media/` 后从本地加载图片 / 视频 / 音频；
  文件放齐前，缺失资源按原设计降级（深色底、封面、无音效），脚本不报错。
  视觉与交互逻辑本身不变。
- **验证**：文件齐备后运行本地开发或构建，确认资源以 `/media/...` 加载；
  构建产物中不再包含原 WordPress 媒体地址。

## 验证方式汇总

- TypeScript 检查：`npm run typecheck`
- 静态构建：`npm run build`
- 本地开发：`npm run dev`
- 构建产物预览：`npm run preview`
- 浏览器检查：无头浏览器加载首页，确认无关键控制台错误、媒体请求正常、
  初始状态与展开状态正确。
