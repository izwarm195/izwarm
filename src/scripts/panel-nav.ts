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
 * fetch 目标面板页面，提取 #notesShell 各区域并原位替换当前底板内容。
 * - left / main / rail 三个 data-notes-region 区域替换（left 两栏页面为空容器）
 * - 同步 shell 的 is-page 变体类与 data-notes-state（决定三栏 / 两栏布局）
 * - push=true 时 pushState 同步 URL；失败降级整页跳转
 */
export async function loadPageIntoPanel(url: string, push: boolean): Promise<void> {
  const shellEl = document.getElementById('notesShell');
  if (!shellEl) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const next = doc.getElementById('notesShell');
    if (!next) return;
    const hash = url.includes('#') ? url.slice(url.indexOf('#')) : '';
    const currentMain = shellEl.querySelector<HTMLElement>('[data-notes-region="main"]');
    const nextMain = next.querySelector<HTMLElement>('[data-notes-region="main"]');
    const currentLeft = shellEl.querySelector<HTMLElement>('[data-notes-region="left"]');
    const nextLeft = next.querySelector<HTMLElement>('[data-notes-region="left"]');
    const currentRail = shellEl.querySelector<HTMLElement>('[data-notes-region="rail"]');
    const nextRail = next.querySelector<HTMLElement>('[data-notes-region="rail"]');
    if (!currentMain || !nextMain || !currentRail || !nextRail) return;

    const currentState = shellEl.dataset.notesState ?? '';
    const nextState = next.dataset.notesState ?? '';

    // 左栏是否替换：Notes 的 Home / Archive / Tags 共享左栏，切换时不替换；
    // 跨越文章边界（article ↔ 其他）或两栏页面 ↔ Notes 时左栏结构不同，必须替换
    const isNotesState = (s: string) => (NOTES_STATES as readonly string[]).includes(s);
    const currentIsPage = !isNotesState(currentState);
    const nextIsPage = !isNotesState(nextState);
    const bothShared =
      !currentIsPage && !nextIsPage && currentState !== 'article' && nextState !== 'article';
    const leftWillSwap = !bothShared;

    currentMain.classList.add('notes-swap-out');
    if (leftWillSwap && currentLeft) currentLeft.classList.add('notes-left-fade');
    await new Promise((resolve) => setTimeout(resolve, 160));

    currentMain.innerHTML = nextMain.innerHTML;
    currentRail.innerHTML = nextRail.innerHTML;

    if (leftWillSwap && currentLeft && nextLeft) {
      currentLeft.innerHTML = nextLeft.innerHTML;
      currentLeft.scrollTop = 0;
      void currentLeft.offsetWidth; // 强制重排，让移除 fade 类后执行淡入过渡
      currentLeft.classList.remove('notes-left-fade');
    }

    shellEl.dataset.notesState = nextState;
    shellEl.classList.toggle('is-page', nextIsPage);
    currentMain.scrollTop = 0;
    currentMain.classList.remove('notes-swap-out');

    // 进入文章时，中栏"卡片放大 + 正文淡入"，形成无缝扩张感
    if (nextState === 'article') {
      currentMain.classList.add('notes-swap-in');
      currentMain.addEventListener(
        'animationend',
        () => currentMain.classList.remove('notes-swap-in'),
        { once: true }
      );
    }

    if (doc.title) document.title = doc.title;
    if (push) history.pushState({}, '', url);
    initToc();
    initCodeCopy();
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  } catch {
    window.location.href = url;
  }
}
