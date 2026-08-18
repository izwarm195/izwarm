/**
 * Notes / 面板页面交互：
 * - 系列树展开（粗指针点击切换；悬停 / 聚焦同步 aria-expanded）
 * - 文章大纲滚动高亮（共享模块 initToc）
 * - 面板内部无缝导航：拦截 /notes/ 链接，fetch 目标页并原位替换底板内容，
 *   pushState 同步 URL；popstate 恢复；直接刷新由服务端渲染恢复。
 *   两栏页面（Projects / Works / About）与 Notes 之间的切换走同一机制。
 */
import {
  initCodeCopy,
  initToc,
  isPanelPath,
  loadPageIntoPanel,
  NOTES_STATES,
} from './panel-nav';

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
// 否则内容会在静止的指针下方滑动，导致连续激活下一个系列（"一连串上滑"）。
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

// ---------- 面板内部无缝导航 ----------
// Notes 状态：拦截 /notes/ 系链接原位替换（Home / 文章 / 归档 / 标签互切）。
// 两栏页面（Projects / Works / About）：拦截本页面子路由（/projects/ 系，
// 如 Selected / Timeline / Statistics），锚点字母不变，同样原位无缝替换；
// 指向 Notes 的链接整页跳转（右栏锚点字母与路由一致）。
const panelBase = import.meta.env.BASE_URL.replace(/\/$/, '');

if (shellEl && 'fetch' in window) {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    const state = shellEl.dataset.notesState ?? '';
    if ((NOTES_STATES as readonly string[]).includes(state)) {
      if (href === notesBase || href.startsWith(notesBase + '/')) {
        e.preventDefault();
        void loadPageIntoPanel(href, true);
      }
      return;
    }
    const pageBase = panelBase + '/' + state + '/';
    if (href === pageBase || href.startsWith(pageBase)) {
      e.preventDefault();
      void loadPageIntoPanel(href, true);
    }
  });
  window.addEventListener('popstate', () => {
    const path = location.pathname;
    if (isPanelPath(path)) {
      void loadPageIntoPanel(location.pathname + location.search, false);
    } else {
      // 离开面板回首页：整页加载，保证首页状态干净
      location.reload();
    }
  });
}

initCodeCopy();
initToc();
