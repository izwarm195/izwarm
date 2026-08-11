/**
 * Notes 交互：
 * - 系列树展开（粗指针点击切换；悬停 / 聚焦同步 aria-expanded）
 * - 文章大纲滚动高亮
 * - Notes 内部无缝导航：拦截 /notes/ 链接，fetch 目标页并原位替换底板内容，
 *   pushState 同步 URL；popstate 恢复；直接刷新由服务端渲染恢复。
 */

const shellEl = document.getElementById('notesShell');
const notesBase = import.meta.env.BASE_URL.replace(/\/$/, '') + '/notes';

// ---------- 原 W：悬停展开右栏导航（进入菜单有 260ms 缓冲，避免移入时收起） ----------
const letterW = document.getElementById('letter-w');
let menuTimer: number | undefined;

function currentRail(): HTMLElement | null {
  return document.querySelector('.notes-rail');
}

function openMenu(): void {
  if (menuTimer !== undefined) window.clearTimeout(menuTimer);
  currentRail()?.classList.add('menu-open');
}

function closeMenu(): void {
  menuTimer = window.setTimeout(() => currentRail()?.classList.remove('menu-open'), 260);
}

// 用 Pointer Events：鼠标/触控笔/触摸都覆盖，且 W 与右栏任一触发都可靠展开
// W 常驻在 logo-stage，节点不变，直接绑定
letterW?.addEventListener('pointerenter', openMenu);
letterW?.addEventListener('pointerleave', closeMenu);

// 关键：绑到稳定的 region 容器（SPA 只改它的 innerHTML，节点本身不销毁），
// 而不是会被重建的 <nav class="notes-rail">，避免 SPA 跳转后悬停失效
const railRegion = document.querySelector<HTMLElement>('[data-notes-region="rail"]');
railRegion?.addEventListener('pointerenter', openMenu);
railRegion?.addEventListener('pointerleave', closeMenu);

// ---------- 系列树：原地手风琴展开（整窗不移动，悬停/聚焦激活分支、收起同级） ----------
const seriesWindow = document.getElementById('seriesWindow');

function setNodeActive(node: HTMLElement): void {
  const level = node.parentElement;
  if (level) {
    level.querySelectorAll(':scope > .series-node.active').forEach((sibling) => {
      if (sibling !== node) sibling.classList.remove('active');
    });
  }
  node.classList.add('active');
  const btn = node.querySelector<HTMLButtonElement>('.series-node-btn');
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function deactivateAll(): void {
  if (!seriesWindow) return;
  seriesWindow.querySelectorAll('.series-node.active').forEach((node) => {
    node.classList.remove('active');
    const btn = node.querySelector<HTMLButtonElement>('.series-node-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

if (seriesWindow) {
  document.addEventListener('mouseover', (e) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>('.series-node');
    if (node) setNodeActive(node);
  });
  seriesWindow.addEventListener('focusin', (e) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>('.series-node');
    if (node) setNodeActive(node);
  });
  seriesWindow.addEventListener('mouseleave', deactivateAll);
  seriesWindow.addEventListener('focusout', (e) => {
    if (!seriesWindow.contains(e.relatedTarget as Node | null)) deactivateAll();
  });
}

// ---------- 大纲：点击平滑滚动（并避免默认锚点跳转回顶） ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('.notes-toc a');
  if (!link) return;
  const id = link.getAttribute('href')?.slice(1) ?? '';
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});

// ---------- 大纲滚动高亮 ----------
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

function initToc(): void {
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

// ---------- Notes 内部无缝导航 ----------
async function loadState(url: string, push: boolean): Promise<void> {
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
    if (!currentMain || !nextMain || !currentLeft || !nextLeft || !currentRail || !nextRail) return;

    const currentState = shellEl.dataset.notesState ?? '';
    const nextState = next.dataset.notesState ?? '';

    currentMain.classList.add('notes-swap-out');
    await new Promise((resolve) => setTimeout(resolve, 160));

    currentMain.innerHTML = nextMain.innerHTML;
    currentRail.innerHTML = nextRail.innerHTML;

    // Home / Archive / Tags 共用左栏，切换时不替换；跨 Article 边界才更新左栏
    const bothShared = currentState !== 'article' && nextState !== 'article';
    if (!bothShared) {
      currentLeft.innerHTML = nextLeft.innerHTML;
      currentLeft.scrollTop = 0;
    }

    shellEl.dataset.notesState = nextState;
    currentMain.scrollTop = 0;
    currentMain.classList.remove('notes-swap-out');

    // 进入文章时，中栏“卡片放大 + 正文淡入”，形成无缝扩张感
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
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
    }
  } catch {
    window.location.href = url;
  }
}

if (shellEl && 'fetch' in window) {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (!(href === notesBase || href.startsWith(notesBase + '/'))) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    e.preventDefault();
    void loadState(href, true);
  });
  window.addEventListener('popstate', () => {
    const path = location.pathname;
    if (path === notesBase || path === notesBase + '/' || path.startsWith(notesBase + '/')) {
      void loadState(location.pathname + location.search, false);
    } else {
      // 离开 Notes 回首页：整页加载，保证首页状态干净
      location.reload();
    }
  });
}

initToc();
