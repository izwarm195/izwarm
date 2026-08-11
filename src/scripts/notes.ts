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

// 底板动画完全结束后才允许悬停展开菜单（动画期间 W 会移动，悬停不稳定）
function isPanelSettled(): boolean {
  return document.querySelector('#notesPanel')?.classList.contains('is-settled') ?? false;
}

function currentRail(): HTMLElement | null {
  return document.querySelector('.notes-rail');
}

function openMenu(): void {
  if (!isPanelSettled()) return;
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
let seriesTimer: number | undefined;

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
  // 等收起过渡结束后再解除固定，窗口平滑回到垂直居中
  scheduleUnpin();
}

// 悬停期间固定系列窗口顶边：窗口高度随展开/收起变化时不再重新垂直居中，
// 否则内容会在静止的指针下方滑动，导致连续激活下一个系列（“一连串上滑”）。
let unpinTimer: number | undefined;

function pinSeriesWindow(ev?: PointerEvent): void {
  if (!seriesWindow || seriesWindow.dataset.pinned === '1') return;
  if (ev?.pointerType === 'touch') return;
  if (unpinTimer !== undefined) {
    window.clearTimeout(unpinTimer);
    unpinTimer = undefined;
  }
  const container = seriesWindow.parentElement;
  if (!container) return;
  const cRect = container.getBoundingClientRect();
  const wRect = seriesWindow.getBoundingClientRect();
  const offset = Math.max(0, wRect.top - cRect.top);
  seriesWindow.style.marginTop = offset + 'px';
  seriesWindow.style.alignSelf = 'flex-start';
  seriesWindow.dataset.pinned = '1';
}

function unpinSeriesWindow(): void {
  if (!seriesWindow) return;
  seriesWindow.style.marginTop = '';
  seriesWindow.style.alignSelf = '';
  delete seriesWindow.dataset.pinned;
}

function scheduleUnpin(): void {
  if (unpinTimer !== undefined) window.clearTimeout(unpinTimer);
  unpinTimer = window.setTimeout(() => {
    unpinTimer = undefined;
    unpinSeriesWindow();
  }, 420);
}

// 从一个系列滑到另一个系列时，若下一个分支更矮，窗口会瞬间收缩导致鼠标短暂离开；
// 延后收起并允许重新进入任意系列节点时取消，避免整个系列栏直接收起。
function scheduleDeactivate(): void {
  if (seriesTimer !== undefined) window.clearTimeout(seriesTimer);
  seriesTimer = window.setTimeout(() => {
    seriesTimer = undefined;
    deactivateAll();
  }, 220);
}

function cancelDeactivate(): void {
  if (seriesTimer !== undefined) {
    window.clearTimeout(seriesTimer);
    seriesTimer = undefined;
  }
}

if (seriesWindow) {
  seriesWindow.addEventListener('pointerenter', (e) => pinSeriesWindow(e));
  document.addEventListener('mouseover', (e) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>('.series-node');
    if (node) {
      cancelDeactivate();
      setNodeActive(node);
    }
  });
  seriesWindow.addEventListener('focusin', (e) => {
    const node = (e.target as HTMLElement).closest<HTMLElement>('.series-node');
    if (node) {
      pinSeriesWindow();
      cancelDeactivate();
      setNodeActive(node);
    }
  });
  seriesWindow.addEventListener('mouseleave', scheduleDeactivate);
  seriesWindow.addEventListener('focusout', (e) => {
    if (!seriesWindow.contains(e.relatedTarget as Node | null)) scheduleDeactivate();
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

// ---------- 代码块复制按钮 ----------
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');

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

function initCodeCopy(): void {
  // 代码块：复制代码文本
  document.querySelectorAll<HTMLElement>('.article-body pre').forEach((pre) => {
    attachCopyButton(pre, '复制代码', () => pre.querySelector('code')?.innerText ?? pre.innerText);
  });
  // 行间公式：复制 LaTeX 源码（data-latex 由 rehype-math-latex 注入）
  document.querySelectorAll<HTMLElement>('.article-body .math-block').forEach((block) => {
    attachCopyButton(block, '复制公式', () => block.getAttribute('data-latex') ?? block.innerText);
  });
}

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

    // Home / Archive / Tags 共用左栏，切换时不替换；跨 Article 边界才更新左栏
    const bothShared = currentState !== 'article' && nextState !== 'article';
    const leftWillSwap = !bothShared;

    currentMain.classList.add('notes-swap-out');
    if (leftWillSwap) currentLeft.classList.add('notes-left-fade');
    await new Promise((resolve) => setTimeout(resolve, 160));

    currentMain.innerHTML = nextMain.innerHTML;
    currentRail.innerHTML = nextRail.innerHTML;

    if (leftWillSwap) {
      currentLeft.innerHTML = nextLeft.innerHTML;
      currentLeft.scrollTop = 0;
      void currentLeft.offsetWidth; // 强制重排，让移除 fade 类后执行淡入过渡
      currentLeft.classList.remove('notes-left-fade');
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
    initCodeCopy();
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

initCodeCopy();
initToc();
