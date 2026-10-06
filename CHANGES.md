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

## 12. 修复：Notes 转场时中心文字重新出现

- **修改**：`slideWToNotes` 不再移除 landing 的 `expanded` class
  （仍保留 `expanded = false` 状态变量，用于阻止 resize 干扰）。
- **原因**：移除 class 会让 `.landing.expanded .intro-text { opacity: 0 }` 失效，
  中心文字在底板滑入过程中重新出现。
- **影响**：转场期间中心文字保持隐藏；其余动画不变。
- **验证**：浏览器采样转场过程中的 `intro-text` opacity 恒为 0。

## 13. 修复：Notes 底板打开时点击空白处触发主页动画

- **修改**：landing 点击处理器增加判断——`notesPanel` 处于 `active` 时直接忽略点击。
- **原因**：内嵌转场不跳转页面，底板打开后 landing 的点击监听仍然生效，
  点击空白处会误触“展开 / 收起”动画。
- **验证**：底板打开后点击边角空白区域，landing 状态保持不变。

## 14. 修复：刷新 /notes/ 显示割裂的独立占位页

- **修改**：抽出共用组件 `src/components/home/Landing.astro`，
  首页与 `/notes/` 共用同一页面结构；`/notes/` 直接渲染“底板已打开”的初始状态
  （`panel-open` / `static-open`），删除旧独立页 `src/pages/notes.astro`。
- **原因**：内嵌转场用 `pushState` 把 URL 改为 `/notes/`，刷新时旧实现渲染的是
  另一个占位页，与点击 W 后的体验不一致。
- **影响**：直接访问或刷新 `/notes/` 显示与点击 W 后相同的底板界面；
  “← izwarm”返回按钮可回到展开态首页。
- **验证**：浏览器直接访问并刷新 `/notes/`，确认初始即显示底板、无入场动画。

## 15. 修复：W 滑动方向与停止衰减

- **修改**：
  - 第一段只修改 `wy`（竖直下坠），不再同时修改 `wx`
    （原实现从左上角斜向落下，并非垂直移动）；
  - 第二段 easing 由 `power3.in` 改为 `power3.inOut`，使 W 停下时速度衰减。
- **原因**：按反馈“点击 W 时 W 应垂直移动”“第二次移动停下时速度应有衰减”。
- **验证**：采样 W 运动轨迹，第一段 x 坐标保持不变；第二段接近终点时速度递减。

## 16. 其他小整理

- 在 `BaseLayout` 中引用 `public/favicon/favicon.png`，消除 `/favicon.ico` 404。
- 为底板卡片补充 `notes-card-date / title / excerpt` 排版样式。

## 17. W 转场改为两段；返回恢复展开态

- **修改**（`src/scripts/home.ts`）：
  - 前进 `slideWToNotes`：由三段（竖直→水平→竖直）改为两段——
    第一段竖直下坠到底部（只改 `wy`），第二段水平右移到右下角（只改 `wx`）；
  - 返回 `slideWToHome`：改为两段镜像——第一段水平左移回 W 展开位，
    第二段竖直上移回 W 展开位；同时把其他字母（a/r/m）、iz 与标签
    一并恢复为展开态，landing 保持/恢复 `expanded` class；
  - 抽出 `computeLetterPositions()` 统一计算四个字母的展开位，
    返回不再依赖 `__izSizes` 兜底（直接访问 `/notes/` 时也能正确还原）；
  - `resize` 时若底板打开（`panelOpen`）则跳过重定位，避免 W 被拉回展开位。
- **原因**：按反馈，W 前进应为“一次竖直、一次水平”共两次移动；
  返回后 W 应落在主页点击后的展开态位置，且其他元素同步恢复展开态
  （原实现结尾调用 `expandLogo()` 因 `expanded` 仍为 true 被跳过，状态未恢复）。
- **验证**：浏览器采样 W 路径——前进时 y 先变、x 后变；
  返回时 x 先变、y 后变；返回完成后 W 位于展开位，a/r/m/iz 与标签均为展开态。

## 18. 返回 Home 改为「收起」终态；修复 /notes/ 刷新状态与 Logo 点击

- **修改**（`src/scripts/home.ts`、`src/styles/home.css`）：
  - `slideWToHome`：返回终态由「展开态」改为「主页初始（收起）态」——
    W 两段移动（水平左移 → 竖直上移）回到中心；在 W 第二段开始时，
    a/r/m 先展开（飞出到各自位置）再收起（收回中心），随后大 Logo 淡入、
    标签隐藏、字母全部隐藏于中心；
  - 新增 `resetToHomeInitial()`：统一恢复到收起态，并复位底板与 W 的内联样式；
  - `/notes/` 独立页（刷新 / 直接访问）返回时，动画播完后
    `location.replace('/')` 真正跳回首页文档，避免 URL 为 `/` 但内容仍是
    Notes 底板导致的刷新状态混乱；
  - `.logo-full` 增加 `pointer-events: auto`：初始收起态点击大 Logo 可触发展开
    （此前 logo-stage 的 `pointer-events:none` 会让 Logo 无法命中）。
- **原因**：按反馈，返回时 a/r/m 应先展开再收起（终态为收起）；
  `/notes/` 刷新后状态混乱；主页初始态点击 Logo 无反应。
- **验证**：浏览器检查——返回动画中 W 第二段开始时 a/r/m 飞出再收回；
  返回完成后主页为初始收起态；`/notes/` 刷新后返回会真正回到 `/`；
  初始态点击 Logo 触发展开。

## 19. 修正：返回 Home 的终态为「展开态」（覆盖第 18 条中的收起终态）

- **修改**（`src/scripts/home.ts`）：
  - `slideWToHome`：W 两段移动的终点由「屏幕中心」改回「W 展开位」
    （水平左移回 `pos.w.x`、竖直上移回 `pos.w.y`），底板同步收缩到 W 展开位；
  - a/r/m 在 W 第二段开始时展开，并**停留在展开位**（不再收回）；
  - 收尾改为 `restoreHomeExpanded()`：字母置于展开位并可见、标签显示、
    iz 显示、大 Logo 隐藏，并把 `expanded` 状态同步为 `true`。
- **原因**：按最新反馈，返回后页面应为「主页展开」状态；
  此前终态为收起、且 `expanded` 未同步，导致再点击时误触发收起音效且页面无变化。
- **验证**：浏览器检查——返回后四个字母均在展开位、标签可见、大 Logo 隐藏；
  再点击页面中心可正常收起（有音效、字母收回）。

## 20. 返回动画中 a/r/m 延后出现；底板放大并恰好包裹 W 的右下边缘

- **修改**（`src/scripts/home.ts`、`src/styles/home.css`）：
  - 返回时 a/r/m 的展开时间由 W 第二段起点（delay 0.5s）延后到 0.7s，
    并给时间线末尾增加 0.15s 收尾缓冲，避免展开动画被截断；
  - 底板四周留白由 `clamp(40px, 5vw, 80px)` 缩小为 `clamp(20px, 2.5vw, 44px)`
    （底板更大、仍关于屏幕中心对称）；
  - `applyPanel` 改为让底板右/下边缘始终贴合 W 的右/下边缘（包裹 W），
    前进、返回、`/notes/` 初始态三处统一；W 终点改为
    `W_END_X = vw/2 - margin - wW`、`W_END_Y = vh/2 - margin - wH`，
    使 W 的右下角恰好落在底板右下角。
- **原因**：按反馈，a/r/m 出现偏早；底板应放大且右下边缘恰好包裹 W 的右下边缘；
  主页点击 W 时出现的底板也应同样包裹 W。
- **验证**：浏览器检查——返回时 a/r/m 在 W 第二段中后段才展开；
  前进与返回终态下 W 的右下角与底板右下角重合，底板关于屏幕中心对称。

## 21. 修复 /notes/ 刷新闪现与返回闪跳

- **修改**（`src/scripts/home.ts`、`src/styles/home.css`）：
  - 删除 `.landing.panel-open #letter-w` 的可见规则（改为保持隐藏），
    W 由 `panelOpenInit()` 在右下角位置再显示，消除刷新时 W 在屏幕中心闪现；
  - 返回时不再 `location.replace('/')` 硬跳转（原实现会导致“已恢复展开态 →
    闪回初始态 → 再展开”的闪跳）；改为原地播放返回动画并 `history.pushState`
    把 URL 改为 `/`。刷新时浏览器会按 `/` 重新请求，服务器返回真正的首页，
    URL 与内容保持一致，行为与普通网页一致。
- **原因**：按反馈，/notes/ 首次刷新时 W 在中心闪一下；
  刷新后按 W 返回会出现“展开 → 闪回初始 → 再展开”的闪跳。
- **验证**：浏览器检查——/notes/ 刷新无 W 中心闪现；按 W 返回动画结束后
  停留在展开态且不再闪跳；此时刷新 `/` 显示正常首页。

## 22. 确定公开内容 Frontmatter 规范

- **新增** `docs/content-frontmatter.md`：发布白名单（CPP / English /
  Machine & Deep Learning / Signals 内 Markdown 默认公开）、单篇退出
  （`publish: false` / `status: draft`）、PDF 默认不公开、网站侧规范化字段
  与推导规则、真实示例。
- **修改** `src/content.config.ts`：notes 集合 schema 更新为规范字段
  （title / slug / description / date / updated / category / section / tags / status）。
- **说明**：当前未接入同步脚本；后续实现 `scripts/sync-obsidian.mjs`
  并接入 GitHub Actions 后，由脚本生成符合本规范的公开内容。

## 23. 内容同步脚本 + Notes 列表渲染

- **新增** `scripts/sync-obsidian.mjs`（`npm run sync:notes`）：
  - 遍历白名单目录（CPP / English / Machine & Deep Learning /
    Signals/Signals & Systems），按 `docs/content-frontmatter.md` 规范生成
    67 篇公开笔记到 `src/content/notes/`；
  - 处理：Dataview 块剥离、双链转纯文本、Callout 转标注引用、`==高亮==` 转加粗；
    title/date/slug/category/section/tags 自动推导；`--selftest` 内置自检。
- **修改** `src/pages/index.astro`、`src/pages/notes/index.astro`、
  `src/components/home/Landing.astro`：Notes 底板从内容集合渲染真实卡片
  （日期 / 标题 / 摘要 / 分类），按日期倒序，空集合显示空状态；
  面板内容区支持纵向滚动。
- **修改** `src/content.config.ts`：`slug` 从 schema 移除——它是 Astro
  内容集合的保留字段，会从校验数据中剥离；改为由 Astro 消费为
  `entry.slug`（frontmatter 仍写入 `slug`，页面用 `entry.slug` 生成链接）。
- **说明**：文章详情页与 `/notes/<slug>/` 路由、双链转站内链接、
  PDF/图片附件同步尚未实现。

## 24. 修复：Notes 打开后隐形字母仍可点击跳转

- **修改**（`src/scripts/home.ts`）：`slideWToNotes` 淡出 a/r/m 时同步
  `pointer-events: none`；`restoreHomeExpanded` 恢复展开态时清除内联
  pointer-events（交还 CSS 的 `.landing.expanded #letter-*` 控制）。
- **原因**：主页展开态下打开 Notes 底板时，a/r/m 仅被淡出但保持可点击，
  点击原字母位置会误触跳转（projects / works / about）。
- **验证**：Notes 打开后点击 a/r/m 原位置不再跳转；W 返回后字母恢复可点击。

## 25. Notes 工作台重构（三栏知识库）

- **内容模型升级**：notes 集合改为 `title / description? / publishDate /
  updatedDate? / tags / series / order? / draft? / cover?`；同步脚本同步升级，
  按目录推导 `series` 多级路径，重新生成 67 篇真实笔记；新增 3 篇示例文章
  （三级系列、order、封面、中文标签）用于验证。
- **新增** `src/lib/notes.ts`：集中式数据工具——发布文章、系列树、同系列、
  归档、标签索引、统计、日历、中英文混合字数、稳定排序。
- **新增** Notes 工作台：`NotesShell`（左/中/右三栏）、`NotesRail`
  （W 形导航，hover / focus-within / 移动端底部固定栏）、`NotesSidebar`
  （简介 + 统计 + 日历）、`SeriesExplorer` / `SeriesNode`（递归系列树，
  支持任意深度与中文）、`ArticleSidebar`（自动大纲 + 同系列）、`ArchiveList`。
- **新增路由**：`/notes/` Home、`/notes/[...slug]/` Article、
  `/notes/archive/`、`/notes/tags/`、`/notes/tags/[tag]/`，全部真实 URL 驱动，
  可刷新直达。
- **新增** `src/styles/notes.css`（隐藏滚动条、reduced-motion、响应式、
  `w-shape` 统一非对称圆角）与 `src/scripts/notes.ts`（粗指针点击展开系列、
  大纲滚动高亮）。
- **首页转场调整**：保留 W 滑动 + 磨砂底板动画，动画播完后进入 `/notes/`
  工作台；删除旧内嵌 Notes 面板（卡片、返回逻辑、`panelOpenInit`、
  `slideWToHome` 等死代码）；`Landing.astro` 仅保留空玻璃底板作为转场表面。
- **其他**：`BaseLayout` 支持 `bodyClass`；新增 `public/avatar.svg` 占位头像
  （README 说明替换位置）；外部链接统一 `rel="noopener noreferrer"`。
- **取舍**：系列树桌面展开依赖 hover/focus（CSS），移动端用点击切换；
  日历为按年热力图（最新年份），日期单元格跳转归档对应日期；LaTeX 暂以
  纯文本渲染，后续可接 KaTeX；示例文章会被下一次 `npm run sync:notes` 替换。
- **验证**：`npm run typecheck`、`npm run build` 通过（94 页，含中文标签路由）。

## 26. Notes 工作台迁回底板（无缝内嵌）

- **架构调整**：Notes 三栏工作台不再作为独立整页，而是整体放进首页的
  磨砂“底板”（`Landing.astro` 的 `#notesPanel`）内；`/notes/` 及子路由
  渲染同一页面（底板初始打开），用于直接访问与刷新恢复。
- **无缝导航**：`src/scripts/notes.ts` 拦截 Notes 内部链接，`fetch` 目标页并
  原位替换底板内 `#notesShell` 内容（淡入淡出过渡），`history.pushState`
  同步 URL；`popstate` 恢复对应状态；离开 Notes 回 `/` 时整页加载保证首页干净。
- **首页转场**：点击 W 播放原有滑动转场后，底板原位打开并显示 Home 状态，
  URL 同步为 `/notes/`，不再跳转整页。
- **其他**：`NotesShell` 补上 `id="notesShell"`（无缝导航的替换锚点）；
  `.notes-panel.active` 提供直接访问时的底板铺满尺寸；面板 z-index 调整为 8
  （高于字母层、低于声音按钮）；移动端底板内整体滚动、底部固定导航。
- **验证**：`npm run typecheck`、`npm run build` 通过（94 页）。

## 27. 细节调整：W 居中、菜单收起动画、头像、BGM 按钮位置

- 右栏加宽为 `clamp(100px, 9vw, 128px)`，W 终点改用 `pad = rail/2`
  （`clamp(50px, 4.5vw, 64px)`），使 W 在右栏内水平居中且底板保持对称；
- 右栏菜单收起增加过渡（transform 滑出 + 透明度淡出，visibility 延迟隐藏），
  不再瞬间消失；
- 头像改用 `public/media/profile.png`（需自行放入该文件）、放大到 96px，
  与昵称居中排列；
- BGM 按钮移至右上角，右边缘与 W 右边缘（底板右缘）对齐。

## 28. 统一几何：W 在右栏内水平 + 垂直居中（采纳外部评审方案）

- 引入 `--rail-gap: 20px`（W 距底板右/上边缘的间距，兼作 BGM 上/右内边距）
  与 `--w-size` / `--w-size-h`（由 home.ts 实测 W 尺寸写入 `.notes-shell`）；
- 右栏宽度 = `W宽 + 2×rail-gap`，W 在右栏内水平 + 垂直居中
  （`x = vw/2 - margin - rail-gap - wW/2`，`y = 0`），右边缘距底板右缘 rail-gap；
- 初始小底板 = W 外扩 `PANEL_RING(10px)` 一圈，展开动画重写为
  「先竖直展开、后水平展开」两段，返回动画对称收回；
- 右栏菜单改为右对齐：右边缘与 W 右边缘对齐，从 W 上方
  （竖直中线 + 半个 W 高 + 12px）向上滑出，按钮与 W 等宽；
- BGM 按钮上/右内边距均为 rail-gap，右边缘与 W 右边缘对齐；
- `resize` 时底板打开状态会重算 W 居中位并让底板重新铺满；
- 修复移动端右栏菜单 `visibility` 未恢复导致不可见的问题。
- **验证**：`npm run typecheck` 通过；构建与三条路径（直接访问 /notes/、
  主页点 W 进入、再点 W 返回）的落位验证待本地执行。

## 29. KaTeX 公式、双链转站内链接、日历年份切换

- **KaTeX**：新增 `remark-math` / `rehype-katex` / `katex` 依赖并在
  `astro.config.mjs` 接入，文章页引入 KaTeX 样式；公式（`$...$` / `$$...$$`）
  正常渲染，超宽公式在 `katex-display` 内横向滚动，不撑破布局。
- **双链转换**：`scripts/sync-obsidian.mjs` 改为两遍处理——先建立
  「标题 / 文件名 → slug」索引，再把 `[[笔记]]` / `[[笔记|别名]]` 转为站内链接
  （`/notes/<slug>/`）；未公开或不存在的目标保持纯文本，避免 404；
  自检新增对应断言。
- **日历年份切换**：`src/lib/notes.ts` 新增 `getYears()`；
  `NotesCalendar` 读取 `?year=` 查询参数渲染对应年份，内容跨年度时显示年份
  切换链接；无缝导航的 `popstate` 现在保留 `search`，后退可恢复年份。
- **说明**：3 篇示例文章已被下一次 `npm run sync:notes` 替换（README 已注明）。
- **验证**：`npm run typecheck`、`npm run build` 通过（87 页）；
  产物中 KaTeX 样式与站内链接均已确认。

## 30. 子路径部署适配（base 感知）+ GitHub Actions 自动发布

- `astro.config.mjs` 支持 `ASTRO_BASE` 环境变量；`src/lib/notes.ts` 新增
  `url()` 助手、`src/config/media.ts` 与各组件/脚本的站内链接、媒体路径、
  favicon、无缝导航匹配、`home.ts` 的 pushState/跳转均改为 base 感知；
  同步脚本读取 `ASTRO_BASE` 为生成内容中的站内链接加前缀。
- 新增 `.github/workflows/sync-and-deploy.yml`：Obsidian 私有库
  push（`repository_dispatch`）/ 定时（3 小时）/ 手动 / `main` push →
  拉取私有库 → 同步 → 构建（`ASTRO_BASE=/izwarm/`）→ GitHub Pages 部署。
- 启用步骤（Secrets、Pages 配置、Obsidian 侧触发工作流）写入 README。
- **验证**：本地默认构建（无 base）与 `ASTRO_BASE=/izwarm/` 构建均通过。

## 31. 归档时间/排序、大纲跳转、系列树浮动手风琴

- **归档日期**：CI 拉取 Obsidian 私有库时改为 `fetch-depth: 0`（完整历史）——
  此前浅克隆导致 `git log` 拿不到首次提交日期，无日期笔记全部回退到构建日
  （堆在 8-10）；修复后按 git 首次提交（创建时间代理）推导。
- **归档顺序**：同一月内从新到旧（顶部最新）；同系列列表保持从旧到新。
- **大纲跳转**：点击改用 JS 平滑滚动（`scrollIntoView({ behavior: 'smooth' })`），
  修复"先跳转再回到顶部"，并尊重 `prefers-reduced-motion`。
- **系列树**：改为浮动手风琴窗口——悬停/键盘聚焦激活当前分支并收起同级，
  展开/收起带高度动画；悬停节点通过 `translateY` 锚定保持不动，
  鼠标移开后整窗平滑回到中栏中央；移动端悬停/聚焦同样生效。
- **验证**：`npm run typecheck`、`npm run build` 通过（87 页）。

## 32. 系列树：叶子子系列显示为可展开节点

- **修改** `SeriesNode.astro`：每个系列节点（无论是否有更深子级）都渲染为
  可展开按钮，其下再列出笔记。此前“叶子系列”（如 CPP 的 Examples / Tips /
  Summaries、English 的 Words Daily、ML 的 Python、Signals & Systems 的
  SS-QNA / Text Book）只有笔记没有子级，被直接平铺到上层，导致子系列标签缺失。
- **效果**：CPP → Examples / Tips / Summaries（各自可展开笔记列表）、
  English → Words Daily / Words Summary → 数学英语词汇、
  Machine & Deep Learning → Python、Signals → Signals & Systems →
  SS-QNA / Text Book（随记直接挂在 Signals & Systems 下）。
- **验证**：`npm run typecheck`、`npm run build` 通过；产物中全部子系列按钮已渲染。

## 33. 创建时间清单、系列树原地展开、CI 内链前缀

- **创建时间**：新增 `src/config/created-dates.json` 清单——本地运行
  `npm run sync:notes` 时用文件创建时间（birthtime）刷新并随仓库提交；
  CI 读取清单，无日期笔记（初始批量导入的 28 篇）不再堆到初始提交日 08-03。
  日期推导链：文件名日期 → frontmatter（`created` / `Date` / `Da` / `created_at`）
  → 清单 → git 首次提交 → 文件创建时间。
- **系列树**：移除“整窗平移至悬停位置”的锚定逻辑，改为原地手风琴展开——
  悬停/键盘聚焦激活当前分支并收起同级，鼠标移开后整体收起；窗口随内容
  自然增减并保持居中，不再跳动。
- **CI 内链前缀**：同步步骤补充 `ASTRO_BASE=/izwarm/`，生成内容中的站内链接
  带上 base 前缀，修复部署站点文章内链（如 Signals & System 总目录）失效。
- **验证**：`npm run typecheck`、`npm run build` 通过；本地归档日期分散、
  总目录 17 个章节链接全部正确。

## 34. KaTeX 严格模式、公式规范化、分区 SPA、W 方向过场与 Obsidian 阅读排版

- **KaTeX 严格模式**：`astro.config.mjs` 配置 `throwOnError: false` +
  `strict: 'warn'` + `output: 'htmlAndMathml'`，公式错误不再导致整站构建失败，
  并以 `.katex-error` 样式可见；保留构建期 `remark-math + rehype-katex`，
  不引入客户端重复渲染。
- **公式规范化**：`scripts/sync-obsidian.mjs` 新增 `normalizeObsidianMath()`，
  把同一行内的 `$$…$$` 块公式规范为独占三行（跳过代码围栏），提高 KaTeX
  识别率；写入前对正文统一调用。
- **创建时间（createdAt）**：内容模型新增 `createdAt?: Date`；同步脚本按
  frontmatter → 创建时间清单 → 文件 birthtime → git 首次提交 → 发布日期
  推导；`sortNotes` 与归档改为 order → createdAt → slug 排序，同一天文章
  不再退化为标题排序（归档同月仍从新到旧，同日从早到晚）。
- **分区 SPA 切换**：`NotesShell.astro` 给左 / 中 / 右栏加
  `data-notes-region` 与 `data-notes-state`；`notes.ts` 的 `loadState()`
  只替换中栏与右栏，Home / Archive / Tags 共享左栏时不再整壳重建，
  左栏不再闪烁；跨 Article 边界才更新左栏并重置滚动。
- **W 方向过场**：`home.ts` 的 `slideWToNotes()` 重写为「右栏竖条 →
  向左展开」（`is-rail-seed` / `is-opening-left`，右边缘固定），返回镜像
  执行；新增 `setPanelMotion()` 只在动画期间给底板加方向模糊与投影
  （`.is-panel-moving`），不在每帧计算 blur。
- **长文章快速折叠**：返回首页前先给 shell 加 `is-preparing-collapse`
  （中/左栏淡出 + blur），延迟后再加 `is-collapsing`（隐藏内容）并收缩
  底板，长文收回不再逐帧重排。
- **归档标签右对齐**：`ArchiveList.astro` 拆分 `archive-series` /
  `archive-tags`，标签整体靠右、可换行，窄屏自动换行到底部。
- **底板配色**：深色主题底板加深为 `rgba(72,74,82,.34)` +
  `blur(20px) saturate(1.06) brightness(.83)`；浅色主题单独覆盖
  `rgba(122,126,134,.27)` + `brightness(.93)`，避免浅色模式过灰。
- **文章阅读排版（Obsidian 风格）**：文章区改为浅色「阅读卡」（白底、
  底板同款左下直角圆角）——正文 18px / 1.75 行高，英文 CMU 衬线、中文
  宋体；标题不加粗，h1 楷体、h2 仿宋、h3–h6 继承正文；强调色
  `#3e7575`（链接 / 引用 / 列表标记 / 选区高亮）；代码用 JetBrains Mono；
  KaTeX 块公式居中、带浅色卡片背景与横向滚动，错误公式以红色虚线显示。
- **滚动顺滑**：`html` 与各栏启用 `scroll-behavior: smooth`、
  `overscroll-behavior: contain`，大纲高亮仅在目标变化时更新 class。
- **验证**：`npm run typecheck`、`npm run build` 通过；公式、阅读排版、
  底板过场与归档排序均已在构建产物中确认。

## 35. 其余三字母页面（Projects / Works / About）：转场泛化与两栏布局

- **转场泛化**：`home.ts` 的 `slideWToNotes()` / `slideWToHome()` 泛化为
  `slideLetterToPanel(key)` / `slideLetterToHome(key)`，四个字母共用同一套
  三段式滑动（竖直移动 → 水平右移）+ 磨砂底板延展。竖直方向自动对称：
  W / A 起点在 iz 上方（先下坠到中央），R / M 起点在 iz 下方（先上移到
  中央）——同一坐标公式，无需按字母分支；水平段终点都是右栏内居中。
  返回动画镜像执行，其余字母波浪展开。
- **两栏页面**：Projects / Works / About 三个新路由（`src/pages/{projects,
  works,about}/index.astro`）使用 `NotesShell` 的 `is-page` 变体——左中右
  三栏简化为「内容 + 右栏字母导航」两栏；左栏容器保留为空，供无缝切换时
  由共享模块填入 Notes 侧栏。
- **右栏导航**：新增 `src/components/common/PanelRail.astro`——悬停 / 键盘
  展开右栏菜单；Projects / Works 为 Selected / Timeline / Statistics 子页面
  入口（`/projects/{selected,timeline,statistics}/` 等占位页），About 暂无。
  返回主页由常驻右栏的锚点字母承担（点击反向动画收起底板），不再重复放置
  字母按钮。
- **右栏宽度统一**：右栏宽度、锚点中心与菜单链接宽度统一以 W（与 M 同宽，
  最宽，显示宽约 82px）为基准（`getRailRefW()`），A / R 等较窄字母不再整体
  偏右，四个字母的右栏视觉一致；W 图加载完成前先用兜底值，`window load`
  后按真实宽度重测并重新定位锚点（调试值暴露为 `window.__izRailRefW`）。
- **中心锚定修复（A/R 偏右根因）**：GSAP 从 CSS `translate(-50%,-50%)` 推断
  `xPercent` 时依赖元素 `offsetWidth`（`Math.round(offsetWidth/2) ===
  Math.round(-x) ? -50 : 0`）。A / R 字母图片较小、加载晚于 W / M，GSAP 首次
  解析其 transform 时图片未就绪（offsetWidth=0），`xPercent` 被错误推断为 0
  并缓存，字母失去“以视口中心为锚点”的定位——表现为 A / R 位置整体偏右、
  甚至超出底板右边缘（yPercent 因 CSS `max-height` 固定高而幸存，仅横轴出
  问题）。修复：脚本初始化时对所有字母与 iz 显式
  `gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y: 0 })`，锚定与图片
  加载时机解耦。
- **主页四角视觉还原**：显式锁定中心锚定后，主页展开位的 A / R 会按公式
  x 作为中心偏移（相对原站“左上角锚定、实际中心 = x + 半宽”的既有视觉
  左移半宽）。在 `computeLetterPositions()` 中为 A / R 还原既有中心——
  A 补回半宽（`x = izW/2 + a.w + gap - 30`），R 的负向 x 补回半宽后 r.w
  恰好消去（`x = -(izW/2 + gap + 24)`）；W / M 的 xPercent 原就正确，公式
  不变。主页四角恢复原站视觉，面板右栏锚点保持统一后的正确位置。
- **W 进入 Notes 统一拉取**：从其他页面回主页只 `pushState('/')` 不重载
  首页，底板内 shell 会残留上一页面（如 About）的内容；此前 W 分支直接
  使用首页预渲染的 Notes 内容，导致回主页后再点 W 显示的是残留页面。
  现改为所有字母统一在动画开始时 `fetch` 目标页并原位替换（W 拉取
  `/notes/`，内容与首页预渲染一致，无视觉差异），再点 W 始终显示 Notes。
- **子页面无缝切换**：Projects / Works 主页面与 Selected / Timeline /
  Statistics 子页面之间通过 `fetch` 原位替换底板内容（`notes.ts` 拦截
  两栏页面的本页面子路由），不整页刷新、不出现加载进度条；指向 Notes 的
  链接仍整页跳转以保证右栏锚点字母与路由一致。
- **跨页无缝替换**：抽取 `src/scripts/panel-nav.ts`（`loadPageIntoPanel` /
  `initToc` / `initCodeCopy` / 字母-路径映射），`notes.ts` 与 `home.ts` 共用。
  主页点击 A / R / M 后，底板动画第一段（右栏竖条，左/中栏不可见）期间
  fetch 目标页并原位替换 shell 内容，第二段淡入时已是目标页内容，随后
  `pushState` 同步 URL——与 W → Notes 的原站行为一致；Notes 内部（Home /
  文章 / 归档 / 标签）仍走同一无缝替换，两栏页面指向 Notes 的链接整页
  跳转以保证右栏锚点字母与路由一致。
- **回程**：面板内点击当前字母或右栏 Home / 字母按钮，反向动画收起底板并
  恢复主页展开态（`pushState` 回 `/`），刷新即回到干净首页。
- **验证**：`npm run typecheck`、`npm run build` 通过；`/projects/`、
  `/works/`、`/about/` 与全部 Notes 路由均可构建并返回正确 HTML。

## 36. 热力图改由“每日提交数”驱动（第二阶段：迭代优化）

- **数据源**：`src/config/commit-activity.json` 记录 `YYYY-MM-DD → 当日提交数`，
  由 `scripts/sync-obsidian.mjs` 在同步时用 `git -C vault log --format=%aI -- <白名单根目录>`
  按天统计生成（本地与 CI 一致，CI 需 `fetch-depth: 0` 完整历史，工作流已满足）。
  vault 无 git 历史时不覆盖已有文件；日历年份 = 文章年份 ∪ 提交年份。
- **渲染**：`NotesCalendar.astro` 的颜色档位、tooltip 文案改为提交数
  （1 次 = 1 级，≥4 次封顶 4 级；tooltip 形如 `2026-08-26 · 4 次提交 · 1 篇`）；
  有文章的日期仍可点击跳转归档对应锚点（无提交日以浅描边标识可点），
  仅有提交、无文章的日期只展示热力不设链接。
- **影响**：旧数据中 2026-07 的文章多为导入笔记（vault 首个提交 08-03），
  这些天提交数为 0，热力按新语义显示为空但保留锚点跳转。
- **验证**：`npm run build` 后检查日历单元格 `data-count` 与 `title`。

## 37. Archive 日期去重：同一天只展示一次日期

- **修改**：`ArchiveList.astro` 每条日期只在该天第一条记录上渲染
  `<time>` 并挂 `id` 锚点，同日其余记录只列标题与标签。
- **原因**：原实现同一日期多篇时重复打印日期、且 `id` 重复（非法 HTML）。
- **影响**：视觉上时间线更紧凑；日历跳转锚点仍唯一指向当天首条。
- **验证**：构建产物中 `<time datetime>` 无重复、`archive-entry` 的 id 唯一。

## 38. 首屏提速：删浅色背景视频 + 加载门放宽 + 大图压缩

- **删浅色视频**：`Obsidian-Loop-Light.mp4`（5.8MB）与 `video-cover-light.png`
  （2.6MB）从未被使用（站点固定 `data-theme="dark"`），从 `public/media/`、
  `media.ts`、`Landing.astro`、`home.ts` 全部移除；仅保留深色视频单元素。
- **加载门放宽**：`home.ts` 的 `loadingTarget()` 不再等整段视频缓冲完
  （原按 `buffered/duration`，慢网可能拖到 6MB 全量下载），改为 `canplay`
  即放行；也不再等 BGM 就绪。BGM 双声道元素改 `preload="none"`，首次用户
  交互才真正加载（自动播放限制下首屏下载纯属浪费）。`izwarmSetTheme`
  改为作用于 `documentElement`（原错误地设置 `body` 属性，CSS 不生效）。
- **大图压缩**：`video-cover-dark.png`（2.79MB）→ `video-cover-dark.jpg`
  （约 250KB）；`profile.png`（0.9MB，实际显示 96px）→ `profile.jpg`
  （192px，约 7KB）。首屏媒体合计约减少 10MB 下载量。
- **验证**：构建产物中无任何 Light 视频引用；`dist/media` 只含深色视频与
  jpg 封面/头像；首页 / Notes 页正常渲染。

## 39. Notes 系列树悬浮框：不再整窗收起 / 跳位

- **修改**（`src/styles/notes.css` + `src/scripts/notes.ts`）：
  - 子分支只由 JS `.active`（或键盘 `:focus-within`）展开，移除
    `:hover` 展开规则——悬停态会随兄弟分支收展在静止指针下连锁变化，
    是“从上一个子系列移到下一个系列时整窗收起、到处跳”的根源；
  - 激活改由真实 `pointermove` / `pointerenter` 采样 `elementFromPoint`
    驱动：布局重排不会产生 pointermove，因此不会连锁误激活；
  - `activatePath()` 只展开指针所在节点到根的祖先链，链外同级分支收起；
  - `scheduleDeactivate` 增加“指针是否仍在窗口附近”判定（含刚收起的
    收缩量 140px），内容收缩导致的伪 `pointerleave` 不再整窗收起；
  - `pinSeriesWindow()` 在重新进入时取消待执行的 unpin，避免收起后
    420ms 窗口在指针仍停留时重新垂直居中（“跳到别的地方”）。
- **影响**：展开/收起仍保留手风琴语义与过渡动画；交互更稳。
- **验证**：`npm run typecheck`、`npm run build` 通过；悬停逐级展开、
  滑过多个系列不再触发整体收起与位移（浏览器人工复核）。

## 40. 横向滚动条美化：代码块 / 表格 / 公式统一为半透明圆边灰色细条

- **修改**：`notes.css` 为 `.article-body pre`（代码块）、`table`、`.katex-display`
  （公式块）统一定制滚动条——WebKit/Blink 下轨道透明、滑块半透明灰色圆边
  （`rgba(154,158,168,…)`，10px 高度、上下 2px 空隙、悬停/按下变亮）；
  Firefox 用 `scrollbar-width: thin` + 同色 `scrollbar-color`（track 透明）。
  移除原有仅公式块生效的 5px 青色 webkit 细条。
- **原因**：此前代码块 / 表格只有 Firefox 的 `thin`，Chrome / Edge 显示系统
  默认滚动条（深灰粗条、深色卡片上很突兀）。
- **影响**：仅横向溢出区域的滚动条外观变化；日历等刻意隐藏滚动条的容器不受影响。
- **验证**：`npm run build` 通过；长代码行 / 宽公式 / 宽表格横向拖动可见半透明
  圆边灰条（浏览器人工复核）。

## 41. 修复公式编号 `\tag` 叠在公式右端

- **症状**：物理公式总结系列里 `$$…\tag{9-3}$$` 渲染出的编号 `(9-3)` 压在公式
  尾部（如 `a=-ω²x` 被 `(9-3)` 盖住），而不是贴在公式卡片的内缘右侧。
- **原因**：KaTeX 把编号输出为 `.katex-tag{position:absolute; right:0}`，落点是
  **最近的定位祖先**，而 KaTeX 自带的定位链是 `.katex-html{position:relative}`
  套在 `.katex{position:relative}` 里。KaTeX 默认让 `.katex-display > .katex` 是
  整幅宽的 `display:block`，所以 `right:0` 恰好落在容器右缘；本站为了让短公式居中
  把它改成了 `display:inline-block` + `min-width:max-content`，`.katex` 的宽度
  收缩成**公式自身**宽度，于是编号被摆到公式自己的右端，覆盖公式尾部。
- **踩坑记录（重要）**：第一版只把 `.katex-html` 改成 `position:static`，**完全无效**——
  `.katex` 本身还是 `position:relative`，包含块根本没离开那层 inline-block。
  线上部署后用户反馈「一点没变」，随后用 Blink 实测复现确认：改动前后
  `tag.right` 与 `formula.right` 都是 431，`overlaps=true`。
- **修改**（`src/styles/notes.css`）：
  1. `.article-body .katex-display { position: relative }`（卡片充当包含块）；
  2. `.article-body .katex-display > .katex { position: static }`（**关键**：放开
     KaTeX 自带的 `position:relative`）；
  3. `.article-body .katex-display > .katex > .katex-html { position: static }`
     （同样放开，双保险）；
  4. `.article-body .katex-display > .katex > .katex-html > .katex-tag { right: 20px }`
     与卡片左右 padding 对齐，编号不贴到边框上。
  KaTeX 内部上标 / 分式 / 伸缩括号的绝对定位挂在 `.vlist`、`.katex-base`、
  `.katex-stretchy` 等自带 `position:relative` 的元素上，不依赖 `.katex`。
- **影响**：只有编号的水平落点变化（公式右端 → 卡片内缘内侧 20px）；公式居中方式、
  卡片背景、超宽公式的横向滚动行为均不变。
- **验证**：`npm run build` 冷构建 **144 页** 通过。用无头 Edge（Blink）对**构建产物
  CSS** 做真实排版测量：还原改动前 `tag.right=431 / formula.right=431 / overlaps=true`，
  本产物 `tag.right=757 / card.right=778 / gap=21px / overlaps=false`；同时对分式、
  根号、`\left(\right)` 等复杂公式做前后内部排版比对，卡片尺寸与各 `.katex-base`
  宽度完全一致（`innards same = true`），确认放开 `.katex` 的定位不影响 KaTeX 自身。

## 42. About 拆成 izwarm / Friends 两个模块，新增友链卡

- **修改**：
  1. `src/components/common/PanelRail.astro`：About 从「空菜单」变成两个入口 ——
     `izwarm`（`/about/`，就是原来的 About 页本身）与 `Friends`（`/about/friends/`），
     与 Notes 的三个按钮同一套逻辑（悬停右栏滑出、点击原位换页）；并按
     `Astro.url.pathname` 给当前项加 `aria-current="page"` 高亮（换页时整个 rail
     区域会被换成目标页那份服务端渲染的标记，所以不需要在客户端再算）。
  2. 新增 `src/pages/about/friends/index.astro`（Friends 面板）与
     `src/components/about/FriendCard.astro`（一张卡 = 图标 + 基本信息 + 访问 + 复制）。
  3. 新增 `src/config/friends.ts`：友链数据的唯一来源，加人只改这个文件。
  4. 新增 `public/media/icons/external-link.svg`（自绘，Zest 这一版没有外链图标），
     供「访问」按钮用；「复制」复用已有的 `copy.svg`。
  5. `src/scripts/notes.ts` 增加友链卡「复制」的 document 委托（`data-friend-copy`），
     与文章底部「分享」按钮同一套路；`src/styles/notes.css` 增加卡片与窄屏样式。
- **原因**：About 只有一个占位页，需要容纳两类内容 —— 关于自己（izwarm）与友链
  （Friends）。友链卡参考 <https://hatoya-doublepigeonblog.pages.dev/friends/> 的组织
  方式：一个框里放网页图标、基本信息、以及「访问 / 复制」两个操作。
- **影响**：`/about/` 的 URL、内容、字母 M 的三段式转场全部不变；`/about/friends/`
  由 `stateFromPath()` 推导出的面板状态仍是 `about`，所以两栏布局、窄屏底部工具栏、
  锚点字母都不用改。卡片里的「访问」是真外链（`target="_blank"`），不属于面板路由，
  不会被 `panel-nav` 的链接拦截器接管。
- **验证**：`npm run typecheck` 通过；`npm run build` 冷构建 **145 页**
  （原 144 + 新增 `/about/friends/`）；产物 `dist/about/friends/index.html` 中
  两个 rail 按钮与 `aria-current` 落点正确（`/about/` 高亮 izwarm、`/about/friends/`
  高亮 Friends），友链卡四个部位与 `data-friend-copy` 均正常输出，卡片样式进了
  `dist/_astro/index.*.css`，复制逻辑进了 NotesShell 的脚本包。

## 验证方式汇总

- TypeScript 检查：`npm run typecheck`
- 静态构建：`npm run build`
- 本地开发：`npm run dev`
- 构建产物预览：`npm run preview`
- 浏览器检查：无头浏览器加载首页，确认无关键控制台错误、媒体请求正常、
  初始状态与展开状态正确。
