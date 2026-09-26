/**
 * Notes / 面板页面交互：
 * - 系列树展开（真实指针移动采样激活分支，布局重排不换枝；聚焦同步 aria-expanded）
 * - 文章大纲滚动高亮（共享模块 initToc）
 * - 面板内部无缝导航：拦截 /notes/ 链接，点击即切换布局并显示文章骨架（底板立刻出现），
 *   目标页 fetch 完成后原位替换（悬停预取让多数点击直接命中缓存），
 *   pushState 同步 URL；popstate 恢复；直接刷新由服务端渲染恢复。
 *   两栏页面（Projects / Works / About）与 Notes 之间的切换走同一机制。
 */
import {
  initCodeCopy,
  initToc,
  isNarrowLayout,
  isPanelPath,
  loadPageIntoPanel,
  prefetchPage,
  syncArticleFolds,
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

// ---------- 系列树：指针移动驱动的手风琴（布局重排不会连锁换枝/整窗收起） ----------
// SPA 换页只替换 [data-notes-region] 的子节点，所以 #seriesWindow 每次都会被重建。
// 监听必须挂在「当次」的那个节点上，并在每次换页后重新绑定（syncSeriesTree）——
// 否则从文章/归档切回笔记首页时，新树一个监听都没有，表现为手机上点不开系列栏，
// 而刷新一次又好（刷新是服务端直出，走的是初始绑定那一次）。
let seriesWindow: HTMLElement | null = null;
/** 已经绑过监听的节点；与当前节点相同则不重复绑定 */
let boundSeriesWindow: HTMLElement | null = null;
/** 最近一次按下用的指针类型：触屏点击也会让按钮取得焦点，据此跳过 focusin 的激活 */
let lastPointerType = '';
let seriesTimer: number | undefined;
let unpinTimer: number | undefined;
let activeNode: HTMLElement | null = null;
let sampleRaf = 0;
let lastX = -1;
let lastY = -1;

function setNodeExpanded(node: HTMLElement, expanded: boolean): void {
  node.classList.toggle('active', expanded);
  const btn = node.querySelector<HTMLButtonElement>('.series-node-btn');
  if (btn) btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

/** 展开 node 到根的整条祖先链，链外的同级分支全部收起 */
function activatePath(node: HTMLElement): void {
  if (!seriesWindow) return;
  const keep = new Set<HTMLElement>();
  for (let el: HTMLElement | null = node; el && el !== seriesWindow; el = el.parentElement) {
    if (el.classList.contains('series-node')) keep.add(el);
  }
  seriesWindow.querySelectorAll<HTMLElement>('.series-node.active').forEach((n) => {
    if (!keep.has(n)) setNodeExpanded(n, false);
  });
  keep.forEach((n) => setNodeExpanded(n, true));
  activeNode = node;
}

function deactivateAll(): void {
  if (!seriesWindow) return;
  seriesWindow.querySelectorAll<HTMLElement>('.series-node.active').forEach((node) => {
    setNodeExpanded(node, false);
  });
  activeNode = null;
  // 等收起过渡结束后再解除固定，窗口平滑回到垂直居中
  scheduleUnpin();
}

// 悬停期间固定系列窗口顶边：窗口高度随展开/收起变化时不再重新垂直居中，
// 否则内容会在静止的指针下方滑动，导致误激活下一个系列（"一连串上滑"）。
function pinSeriesWindow(ev?: PointerEvent): void {
  if (ev?.pointerType === 'touch') return;
  if (unpinTimer !== undefined) {
    window.clearTimeout(unpinTimer);
    unpinTimer = undefined;
  }
  if (!seriesWindow || seriesWindow.dataset.pinned === '1') return;
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
  if (!seriesWindow) return;
  if (unpinTimer !== undefined) window.clearTimeout(unpinTimer);
  unpinTimer = window.setTimeout(() => {
    unpinTimer = undefined;
    unpinSeriesWindow();
  }, 420);
}

/** 指针是否仍在窗口附近（含刚收起的收缩量）：窗口缩小时浏览器会触发伪 leave，据此拦截整窗收起 */
function isPointerNearWindow(): boolean {
  if (!seriesWindow || lastX < 0) return false;
  const r = seriesWindow.getBoundingClientRect();
  const pad = 140;
  return lastX >= r.left - pad && lastX <= r.right + pad && lastY >= r.top - pad && lastY <= r.bottom + pad;
}

/** 离开后延后收起，期间再次进入任意系列节点即取消 */
function scheduleDeactivate(): void {
  if (seriesTimer !== undefined) window.clearTimeout(seriesTimer);
  seriesTimer = window.setTimeout(() => {
    seriesTimer = undefined;
    // 内容收缩造成的“假离开”不整窗收起；只有指针真正离开窗口附近才全部收起
    if (isPointerNearWindow()) return;
    deactivateAll();
  }, 260);
}

function cancelDeactivate(): void {
  if (seriesTimer !== undefined) {
    window.clearTimeout(seriesTimer);
    seriesTimer = undefined;
  }
}

// 激活只发生在真实指针移动（pointermove / pointerenter 采样）时：
// 兄弟分支收展引起的布局重排不会产生 pointermove，从上一个子系列滑向
// 下一个系列时因此不会出现“一排节点连续被误激活→整窗收起”的连锁反应。
function sampleAndActivate(x: number, y: number): void {
  lastX = x;
  lastY = y;
  const el = document.elementFromPoint(x, y);
  const node = el ? el.closest<HTMLElement>('.series-node') : null;
  if (node && node !== activeNode) {
    cancelDeactivate();
    activatePath(node);
  }
}

function onSeriesPointerMove(e: PointerEvent): void {
  if (e.pointerType === 'touch') return;
  cancelDeactivate();
  lastX = e.clientX;
  lastY = e.clientY;
  if (sampleRaf) return;
  sampleRaf = requestAnimationFrame(() => {
    sampleRaf = 0;
    sampleAndActivate(lastX, lastY);
  });
}

/** 把系列树交互挂到当前这个 #seriesWindow 上 */
function bindSeriesTree(win: HTMLElement): void {
  win.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch') return;
    pinSeriesWindow(e);
    cancelDeactivate();
    sampleAndActivate(e.clientX, e.clientY);
  });
  win.addEventListener('pointermove', onSeriesPointerMove);
  win.addEventListener('pointerleave', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    scheduleDeactivate();
  });
  win.addEventListener('pointerdown', (e) => {
    lastPointerType = e.pointerType;
  }, true);
  win.addEventListener('focusin', (e) => {
    // 触屏点击也会让按钮取得焦点（Android 必然，部分 iOS 也会）。那一路交给下面的
    // click 处理，否则「focus 展开 + click 收起」互相抵消，表现就是点了没反应。
    if (lastPointerType === 'touch') return;
    const node = (e.target as HTMLElement).closest<HTMLElement>('.series-node');
    if (node) {
      pinSeriesWindow();
      cancelDeactivate();
      activatePath(node);
    }
  });
  win.addEventListener('focusout', (e) => {
    if (!win.contains(e.relatedTarget as Node | null)) scheduleDeactivate();
  });

  // 触屏没有 hover：桌面端靠指针移动驱动的系列树，在手机上改为点击展开/收起。
  // hover 能力在点击时现查而不是绑定时快照：接上鼠标 / iPad 触控板会让 hover
  // 能力中途改变，快照一旦失真，这个点击分支就永久失效。
  win.addEventListener('click', (e) => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const btn = (e.target as HTMLElement | null)?.closest<HTMLButtonElement>('.series-node-btn');
    if (!btn) return;
    const node = btn.closest<HTMLElement>('.series-node');
    if (!node) return;
    e.preventDefault();
    cancelDeactivate();
    if (node.classList.contains('active')) {
      setNodeExpanded(node, false);
      activeNode = null;
      // Android 上点击会让按钮获得焦点，:focus-within 还撑着展开态，必须一并放开
      btn.blur();
      scheduleUnpin();
    } else {
      activatePath(node);
    }
  });
}

/**
 * 重新指向当前的 #seriesWindow：每次 SPA 换页后都要调用。
 * 旧节点已被替换，跨节点的状态（定时器、激活节点、固定态）全部作废，
 * 残留下来会作用到刚换上的新树上。
 */
function syncSeriesTree(): void {
  if (seriesTimer !== undefined) {
    window.clearTimeout(seriesTimer);
    seriesTimer = undefined;
  }
  if (unpinTimer !== undefined) {
    window.clearTimeout(unpinTimer);
    unpinTimer = undefined;
  }
  activeNode = null;
  lastX = -1;
  lastY = -1;
  seriesWindow = document.getElementById('seriesWindow');
  if (!seriesWindow || seriesWindow === boundSeriesWindow) return;
  boundSeriesWindow = seriesWindow;
  bindSeriesTree(seriesWindow);
}

document.addEventListener('izwarm:panel-swap', syncSeriesTree);
syncSeriesTree();

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

/** 链接是否由面板接管；返回需要 fetch 的站内路径，否则 null（交给浏览器整页处理） */
function panelTargetFor(link: HTMLAnchorElement): string | null {
  const href = link.getAttribute('href') ?? '';
  if (!href || link.target === '_blank' || link.hasAttribute('download')) return null;
  if (href.startsWith('#') || href.startsWith('?')) return null; // 页内锚点 / 年份切换走整页
  const state = shellEl?.dataset.notesState ?? '';
  if ((NOTES_STATES as readonly string[]).includes(state)) {
    return href === notesBase || href.startsWith(notesBase + '/') ? href : null;
  }
  const pageBase = panelBase + '/' + state + '/';
  return href === pageBase || href.startsWith(pageBase) ? href : null;
}

if (shellEl && 'fetch' in window) {
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
    if (!link) return;
    const target = panelTargetFor(link);
    if (!target) return;
    e.preventDefault();
    // 立刻切布局 + 摆骨架（底板先出现），正文随后填入
    void loadPageIntoPanel(target, true, { immediate: true, title: link.textContent?.trim() ?? '' });
  });

  // 悬停预取：指针在链接上停留约 90ms 就开始取目标页，
  // 点击时多数已命中缓存 → 直接换成正文，不再出现骨架。
  let prefetchTimer: number | undefined;
  let hoveredLink: HTMLAnchorElement | null = null;
  document.addEventListener(
    'pointerover',
    (e) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a') ?? null;
      if (link === hoveredLink) return;
      hoveredLink = link as HTMLAnchorElement | null;
      if (prefetchTimer !== undefined) window.clearTimeout(prefetchTimer);
      prefetchTimer = undefined;
      const target = link ? panelTargetFor(link as HTMLAnchorElement) : null;
      if (!target) return;
      prefetchTimer = window.setTimeout(() => prefetchPage(target), 90);
    },
    true
  );

  window.addEventListener('popstate', () => {
    const path = location.pathname;
    // 底板已被收起时（窄屏「返回首页」字母是就地收起的）不能再往不可见的底板里换内容，
    // 否则回退后页面看起来是空的
    const panelVisible = document.getElementById('notesPanel')?.classList.contains('active') ?? false;
    if (isPanelPath(path) && panelVisible) {
      void loadPageIntoPanel(location.pathname + location.search, false);
    } else {
      // 离开面板回首页 / 底板已收起：整页加载，保证状态干净
      location.reload();
    }
  });
}

// ---------- 文章侧栏的折叠面板（大纲 / 同系列） ----------
// 桌面端保持改造前的行为：始终展开，点标题也不折叠（preventDefault 会取消
// summary 的默认展开/收起，键盘 Enter 触发的是同一条合成 click，一并覆盖）；
// 手机端默认收起，由用户点标题展开。
document.addEventListener(
  'click',
  (e) => {
    const head = (e.target as HTMLElement | null)?.closest?.('summary.notes-fold-head');
    if (head && !isNarrowLayout()) e.preventDefault();
  },
  true
);

initCodeCopy();
initToc();
syncArticleFolds();
