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

## 验证方式汇总

- TypeScript 检查：`npm run typecheck`
- 静态构建：`npm run build`
- 本地开发：`npm run dev`
- 构建产物预览：`npm run preview`
- 浏览器检查：无头浏览器加载首页，确认无关键控制台错误、媒体请求正常、
  初始状态与展开状态正确。
