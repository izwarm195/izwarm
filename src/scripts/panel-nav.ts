/**
 * 面板无缝导航共享模块（home.ts / notes.ts 共用）。
 *
 * 所有"字母页面"（Notes / Projects / Works / About）共享同一个磨砂底板
 * （#notesPanel）与同一个内容容器（#notesShell + data-notes-region 区域约定）。
 * 页面内部状态切换通过 fetch 目标页 HTML → 提取 #notesShell 各区域 → 原位替换，
 * 与 W → Notes 的原站行为一致。
 *
 * 本模块只导出函数与常量，不执行 DOM 查询（无副作用），供两个脚本各自打包内联。
 */

/** Notes 工作台的四个状态（三栏）；其余为两栏页面状态 */
export const NOTES_STATES = ['home', 'article', 'archive', 'tags'] as const;
export type PanelStateName = (typeof NOTES_STATES)[number] | 'projects' | 'works' | 'about';

/** 字母 → 面板页面路径（站内绝对路径，不含 base；url() 会补 base 前缀） */
export const PAGE_TARGETS: Record<string, string> = {
  w: '/notes/',
  a: '/projects/',
  r: '/works/',
  m: '/about/',
};

/** 站点 base（子路径部署时由 ASTRO_BASE 提供，如 /izwarm/；本地为空） */
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 从当前 URL 推断面板字母（w/a/r/m）；非面板路径默认 w */
export function currentPageKey(): 'w' | 'a' | 'r' | 'm' {
  const path = location.pathname;
  const rel = siteBase && path.startsWith(siteBase) ? path.slice(siteBase.length) : path;
  if (rel.startsWith('/notes')) return 'w';
  if (rel.startsWith('/projects')) return 'a';
  if (rel.startsWith('/works')) return 'r';
  if (rel.startsWith('/about')) return 'm';
  return 'w';
}

/** 面板页面路径判断（含 base 前缀）；否则视为主页等非面板路径 */
export function isPanelPath(path: string): boolean {
  const rel = siteBase && path.startsWith(siteBase) ? path.slice(siteBase.length) : path;
  return (
    rel.startsWith('/notes') ||
    rel.startsWith('/projects') ||
    rel.startsWith('/works') ||
    rel.startsWith('/about')
  );
}

// ---------- 大纲滚动高亮（替换后重新初始化） ----------
let tocObserver: IntersectionObserver | null = null;
let activeHeadingId = '';

/** 窄屏断点，与 notes.css / home.css 的 @media (max-width: 900px) 保持一致 */
export const NARROW_MAX = 900;

export function isNarrowLayout(): boolean {
  return window.innerWidth <= NARROW_MAX;
}

/**
 * 文章侧栏的两个折叠面板（大纲 / 同系列）：
 * 手机端默认收起，正文不再被"通篇只用 # 分节"的长笔记目录推到屏幕之外；
 * 桌面端始终展开（并取消 summary 的折叠行为），电脑端体验与改造前一致。
 */
export function syncArticleFolds(): void {
  const narrow = isNarrowLayout();
  document.querySelectorAll<HTMLDetailsElement>('details.notes-fold').forEach((fold) => {
    fold.open = !narrow;
  });
}

function setActiveHeading(id: string): void {
  if (!id || id === activeHeadingId) return;
  activeHeadingId = id;
  document.querySelector<HTMLAnchorElement>('.notes-toc a.active')?.classList.remove('active');
  document
    .querySelector<HTMLAnchorElement>(`.notes-toc a[href="#${CSS.escape(id)}"]`)
    ?.classList.add('active');
}

export function initToc(): void {
  tocObserver?.disconnect();
  tocObserver = null;
  activeHeadingId = '';
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.notes-toc a'));
  if (links.length === 0 || !('IntersectionObserver' in window)) return;
  const headings = links
    .map((a) => document.getElementById(a.getAttribute('href')?.slice(1) ?? ''))
    .filter((el): el is HTMLElement => el !== null);
  if (headings.length === 0) return;
  tocObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const current = visible[0];
      if (!current) return;
      setActiveHeading(current.target.id);
    },
    { rootMargin: '-15% 0px -70% 0px' }
  );
  headings.forEach((h) => tocObserver?.observe(h));
}

// ---------- 代码块 / 公式复制按钮（替换后重新初始化） ----------
function fallbackCopy(text: string, done: () => void): void {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } catch {
    /* 复制失败不阻断交互 */
  }
  ta.remove();
  done();
}

function attachCopyButton(container: HTMLElement, label: string, getText: () => string): void {
  if (container.querySelector(':scope > .code-copy')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'code-copy';
  btn.title = label;
  btn.setAttribute('aria-label', label);
  const icon = document.createElement('img');
  icon.src = `${siteBase}/media/icons/copy.svg`;
  icon.alt = '';
  icon.width = 15;
  icon.height = 15;
  btn.appendChild(icon);
  btn.addEventListener('click', () => {
    const text = getText();
    const done = () => {
      btn.classList.add('copied');
      icon.src = `${siteBase}/media/icons/circled-check.svg`;
      setTimeout(() => {
        btn.classList.remove('copied');
        icon.src = `${siteBase}/media/icons/copy.svg`;
      }, 1400);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  });
  container.appendChild(btn);
}

export function initCodeCopy(): void {
  // 代码块：复制代码文本
  document.querySelectorAll<HTMLElement>('.article-body pre').forEach((pre) => {
    attachCopyButton(pre, '复制代码', () => pre.querySelector('code')?.innerText ?? pre.innerText);
  });
  // 行间公式：复制 LaTeX 源码（data-latex 由 rehype-math-latex 注入）
  document.querySelectorAll<HTMLElement>('.article-body .math-block').forEach((block) => {
    attachCopyButton(block, '复制公式', () => block.getAttribute('data-latex') ?? block.innerText);
  });
}

// ---------- 面板内容无缝替换 ----------
/**
 * 目标页 HTML 预取缓存：悬停链接时先取，点击时直接命中。
 * 上限 3 页（长笔记单页可达数 MB，不能无限堆积）。
 */
const pageCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();
const CACHE_LIMIT = 3;
/** 面板导航序号：用于丢弃被后续点击取代的过期响应 */
let navSeq = 0;

function storePage(url: string, html: string): void {
  pageCache.set(url, html);
  while (pageCache.size > CACHE_LIMIT) {
    const oldest = pageCache.keys().next().value;
    if (oldest === undefined) break;
    pageCache.delete(oldest);
  }
}

async function loadHtml(url: string): Promise<string> {
  const cached = pageCache.get(url);
  if (cached !== undefined) return cached;
  const running = inflight.get(url);
  if (running) return running;
  const task = fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    storePage(url, html);
    return html;
  });
  inflight.set(url, task);
  try {
    return await task;
  } finally {
    inflight.delete(url);
  }
}

/** 悬停预取：失败静默（点击时会重新请求并按老逻辑降级整页跳转） */
export function prefetchPage(url: string): void {
  if (pageCache.has(url) || inflight.has(url)) return;
  void loadHtml(url).catch(() => undefined);
}

export interface PanelNavOptions {
  /** 点击导航：不等网络，先切布局 + 摆骨架，正文到了再替换 */
  immediate?: boolean;
  /** 骨架卡片上的标题（取被点击链接的文本），让"立刻出现"的底板是正确的文章 */
  title?: string;
}

function isNotesState(state: string): boolean {
  return (NOTES_STATES as readonly string[]).includes(state);
}

/** 由 URL 推断目标面板状态（含 base 前缀），用于点击后立即切布局 */
export function stateFromPath(url: string): string {
  const path = url.split(/[?#]/)[0];
  const rel = siteBase && path.startsWith(siteBase) ? path.slice(siteBase.length) : path;
  const seg = rel.split('/').filter(Boolean);
  if (seg[0] === 'notes') {
    if (seg.length <= 1) return 'home';
    if (seg[1] === 'archive') return 'archive';
    if (seg[1] === 'tags') return 'tags';
    return 'article';
  }
  if (seg[0] === 'projects' || seg[0] === 'works' || seg[0] === 'about') return seg[0];
  return 'home';
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;'
  );
}

/** 骨架行：宽度错落，视觉上更像正文而不是条码 */
const LINE_WIDTHS = [96, 88, 92, 74, 90, 62, 94, 85, 70, 91, 80, 58];
function skeletonLines(count: number, offset = 0): string {
  return Array.from(
    { length: count },
    (_, i) =>
      `<span class="notes-skeleton-line" style="width:${LINE_WIDTHS[(i + offset) % LINE_WIDTHS.length]}%"></span>`
  ).join('');
}

/** 目标页 HTML 未到时的占位：文章卡先出现，正文后填 */
function skeletonMarkup(state: string, title: string): string {
  if (state === 'article') {
    return (
      '<article class="article notes-skeleton" aria-busy="true" aria-live="polite">' +
      `<h1 class="notes-skeleton-title">${escapeHtml(title) || '文章'}</h1>` +
      '<div class="notes-skeleton-chips"><span></span><span></span><span></span></div>' +
      `<div class="notes-skeleton-body">${skeletonLines(9)}</div>` +
      '<p class="notes-skeleton-hint">正在加载正文…</p>' +
      '</article>'
    );
  }
  return `<p class="notes-skeleton-hint notes-skeleton-standalone" aria-busy="true">正在加载…</p>`;
}

function leftSkeletonMarkup(): string {
  return (
    '<div class="notes-sidebar notes-skeleton">' +
    '<section class="notes-toc-wrap">' +
    '<h2 class="notes-section-label">大纲</h2>' +
    `<div class="notes-skeleton-body">${skeletonLines(8)}</div>` +
    '</section>' +
    '<section class="notes-siblings-wrap">' +
    '<h2 class="notes-section-label">同系列</h2>' +
    `<div class="notes-skeleton-body">${skeletonLines(3, 4)}</div>` +
    '</section>' +
    '</div>'
  );
}

/** 点击后立刻把底板摆好（布局 + 骨架 + 卡片展开动画），不等 fetch */
function showSkeleton(shellEl: HTMLElement, state: string, title: string): void {
  const main = shellEl.querySelector<HTMLElement>('[data-notes-region="main"]');
  if (!main) return;
  shellEl.dataset.notesState = state;
  shellEl.classList.toggle('is-page', !isNotesState(state));
  main.innerHTML = skeletonMarkup(state, title);
  main.scrollTop = 0;
  if (state === 'article') {
    const left = shellEl.querySelector<HTMLElement>('[data-notes-region="left"]');
    if (left) {
      left.innerHTML = leftSkeletonMarkup();
      left.scrollTop = 0;
      left.classList.remove('notes-left-fade');
    }
    main.classList.add('notes-swap-in');
    main.addEventListener('animationend', () => main.classList.remove('notes-swap-in'), { once: true });
  }
}

/** 把解析好的目标页原位替换进底板；返回是否替换成功 */
async function swapPanel(shellEl: HTMLElement, doc: Document, opts: { grow: boolean }): Promise<boolean> {
  const next = doc.getElementById('notesShell');
  const currentMain = shellEl.querySelector<HTMLElement>('[data-notes-region="main"]');
  const nextMain = next?.querySelector<HTMLElement>('[data-notes-region="main"]');
  const currentLeft = shellEl.querySelector<HTMLElement>('[data-notes-region="left"]');
  const nextLeft = next?.querySelector<HTMLElement>('[data-notes-region="left"]');
  const currentRail = shellEl.querySelector<HTMLElement>('[data-notes-region="rail"]');
  const nextRail = next?.querySelector<HTMLElement>('[data-notes-region="rail"]');
  if (!next || !currentMain || !nextMain || !currentRail || !nextRail) return false;

  const currentState = shellEl.dataset.notesState ?? '';
  const nextState = next.dataset.notesState ?? '';

  // 左栏是否替换：Notes 的 Home / Archive / Tags 共享左栏，切换时不替换；
  // 跨越文章边界（article ↔ 其他）或两栏页面 ↔ Notes 时左栏结构不同，必须替换
  const currentIsPage = !isNotesState(currentState);
  const nextIsPage = !isNotesState(nextState);
  const bothShared = !currentIsPage && !nextIsPage && currentState !== 'article' && nextState !== 'article';
  const leftWillSwap = !bothShared;

  currentMain.classList.add('notes-swap-out');
  if (leftWillSwap && currentLeft) currentLeft.classList.add('notes-left-fade');
  await new Promise((resolve) => setTimeout(resolve, 160));

  // 直接搬运已解析文档里的节点：长笔记（数 MB HTML）避免 innerHTML 二次解析
  currentMain.replaceChildren(...Array.from(nextMain.childNodes));
  currentRail.replaceChildren(...Array.from(nextRail.childNodes));

  if (leftWillSwap && currentLeft && nextLeft) {
    currentLeft.replaceChildren(...Array.from(nextLeft.childNodes));
    currentLeft.scrollTop = 0;
    void currentLeft.offsetWidth; // 强制重排，让移除 fade 类后执行淡入过渡
    currentLeft.classList.remove('notes-left-fade');
  }

  shellEl.dataset.notesState = nextState;
  shellEl.classList.toggle('is-page', nextIsPage);
  currentMain.scrollTop = 0;
  currentMain.classList.remove('notes-swap-out');

  // 进入文章时，中栏"卡片放大 + 正文淡入"，形成无缝扩张感
  // （骨架已播过展开动画时只做淡入，避免正文再缩一次）
  if (nextState === 'article' && opts.grow) {
    currentMain.classList.add('notes-swap-in');
    currentMain.addEventListener('animationend', () => currentMain.classList.remove('notes-swap-in'), {
      once: true,
    });
  }
  return true;
}

/**
 * fetch 目标面板页面，提取 #notesShell 各区域并原位替换当前底板内容。
 * - immediate：点击触发的导航，先切布局+骨架（底板立刻出现），正文到了再替换
 * - push=true 时 pushState 同步 URL（不做等待）；失败降级整页跳转
 */
export async function loadPageIntoPanel(
  url: string,
  push: boolean,
  opts: PanelNavOptions = {}
): Promise<void> {
  const shellEl = document.getElementById('notesShell');
  if (!shellEl) return;
  // 导航序号：长笔记加载期间用户又点了一篇时，先返回的旧响应不得覆盖新页面
  const seq = ++navSeq;
  const alreadyFetched = pageCache.has(url);
  if (opts.immediate && !alreadyFetched) showSkeleton(shellEl, stateFromPath(url), opts.title ?? '');
  if (push) history.pushState({}, '', url);

  let html: string;
  try {
    html = await loadHtml(url);
  } catch {
    if (seq === navSeq) window.location.href = url; // 网络/HTTP 失败：整页跳转兜底
    return;
  }
  if (seq !== navSeq) return;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const swapped = await swapPanel(shellEl, doc, { grow: !opts.immediate || alreadyFetched });
  if (!swapped) {
    if (seq === navSeq) window.location.href = url;
    return;
  }
  if (seq !== navSeq) return;

  if (doc.title) document.title = doc.title;
  const hash = url.includes('#') ? url.slice(url.indexOf('#')) : '';
  initToc();
  initCodeCopy();
  syncArticleFolds();
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ block: 'start' });
  }
}
