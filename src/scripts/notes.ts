/**
 * Notes 交互：
 * - 系列树展开（粗指针点击切换；悬停 / 聚焦同步 aria-expanded）
 * - 文章大纲滚动高亮
 * - Notes 内部无缝导航：拦截 /notes/ 链接，fetch 目标页并原位替换底板内容，
 *   pushState 同步 URL；popstate 恢复；直接刷新由服务端渲染恢复。
 */

const shellEl = document.getElementById('notesShell');

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

letterW?.addEventListener('mouseenter', openMenu);
letterW?.addEventListener('mouseleave', closeMenu);
document.addEventListener('mouseover', (e) => {
  if ((e.target as HTMLElement).closest('.notes-rail')) openMenu();
});
document.addEventListener('mouseout', (e) => {
  if ((e.target as HTMLElement).closest('.notes-rail')) closeMenu();
});

// ---------- 系列树（事件委托，内容替换后依然生效） ----------
const coarse = window.matchMedia('(pointer: coarse)').matches;

function syncSeriesAria(node: Element | null): void {
  if (!(node instanceof HTMLElement)) return;
  const btn = node.querySelector<HTMLButtonElement>('.series-node-btn');
  if (!btn) return;
  const open = node.classList.contains('open') || node.matches(':hover') || node.matches(':focus-within');
  btn.setAttribute('aria-expanded', String(open));
}

if (coarse) {
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.series-node-btn');
    const node = btn?.closest<HTMLElement>('.series-node');
    if (!btn || !node) return;
    node.classList.toggle('open');
    syncSeriesAria(node);
  });
} else {
  document.addEventListener('mouseover', (e) =>
    syncSeriesAria((e.target as HTMLElement).closest('.series-node'))
  );
  document.addEventListener('mouseout', (e) =>
    syncSeriesAria((e.target as HTMLElement).closest('.series-node'))
  );
  document.addEventListener('focusin', (e) =>
    syncSeriesAria((e.target as HTMLElement).closest('.series-node'))
  );
  document.addEventListener('focusout', (e) =>
    syncSeriesAria((e.target as HTMLElement).closest('.series-node'))
  );
}

// ---------- 大纲滚动高亮 ----------
let tocObserver: IntersectionObserver | null = null;

function initToc(): void {
  tocObserver?.disconnect();
  tocObserver = null;
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
      const id = current.target.id;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
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
    shellEl.classList.add('notes-swap-out');
    await new Promise((resolve) => setTimeout(resolve, 160));
    shellEl.innerHTML = next.innerHTML;
    shellEl.classList.remove('notes-swap-out');
    if (doc.title) document.title = doc.title;
    if (push) history.pushState({}, '', url);
    document.querySelectorAll<HTMLElement>('.notes-col').forEach((col) => {
      col.scrollTop = 0;
    });
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
    if (!(href === '/notes' || href.startsWith('/notes/'))) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    e.preventDefault();
    void loadState(href, true);
  });
  window.addEventListener('popstate', () => {
    const path = location.pathname;
    if (path === '/notes/' || path === '/notes' || path.startsWith('/notes/')) {
      void loadState(location.pathname + location.search, false);
    } else {
      // 离开 Notes 回首页：整页加载，保证首页状态干净
      location.reload();
    }
  });
}

initToc();
