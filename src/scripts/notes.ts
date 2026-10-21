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
  copyText,
  expandSectionsTo,
  initAnswerFolds,
  initCodeCopy,
  initToc,
  initTocMath,
  isNarrowLayout,
  isPanelPath,
  loadPageIntoPanel,
  prefetchPage,
  setSectionCollapsed,
  syncArticleFolds,
  NOTES_STATES,
} from './panel-nav';
import { site } from '../config/site';
import { initArchiveFilter } from './archive-filter';
import { initImageViewer } from './image-viewer';

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

// 归档的标签筛选：初次载入 + 每次 SPA 换页后都要重新跑一遍
// （换页会把归档节点整体换掉，筛选状态只存在 URL 里）
document.addEventListener('izwarm:panel-swap', initArchiveFilter);
initArchiveFilter();

// ---------- 大纲：点击平滑滚动（并避免默认锚点跳转回顶） ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('.notes-toc a');
  if (!link) return;
  const id = link.getAttribute('href')?.slice(1) ?? '';
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  // 目标标题可能落在收起的节里（同级大纲项各自可单独收起）：先瞬时摊开，
  // 否则滚过去只看到一条灰色的标题
  expandSectionsTo(target, true);
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});

// ---------- 正文分节：点标题整行展开 / 收起 ----------
// 委托到 document：SPA 换页把正文整片换掉也不会失效。
// 标题右侧那枚按钮只是键盘 / 读屏入口与视觉提示，鼠标点标题任意处同样生效
// （按钮在标题内部，走的也是这一条路径，所以只会折叠一次）。
// 两个例外：标题里若嵌了链接（markdown 允许），点链接照旧跳转；
// 拖选标题文字收尾时也会冒出一个 click，这时选区没塌陷，不能当成折叠意图。
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  const head = target?.closest?.<HTMLElement>('h1, h2, h3, h4, h5, h6') ?? null;
  const section = head?.parentElement ?? null;
  if (!head || !section?.classList.contains('art-sec')) return;
  if (target?.closest?.('a')) return;
  if (window.getSelection()?.isCollapsed === false) return;
  setSectionCollapsed(section, !section.classList.contains('is-collapsed'));
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
    // /notes/tags/... 只是旧地址的重定向存根（标签已并进归档），不放进面板里替换
    if (href === notesBase + '/tags' || href.startsWith(notesBase + '/tags/')) return null;
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

// ---------- 主页工作台：悬停预览任意文章 / 点热力图换日 ----------
// 两件事的数据在构建期就全部写进了 HTML（见 lib/notes.ts 的 getHomeBoard），
// 这里只做显示 / 隐藏，不请求也不渲染。
// 全部走 document 委托：SPA 换页会把 [data-notes-region] 里的节点整体换掉，
// 绑在节点上的监听下一次就没了（系列树踩过这个坑）；委托天然不受换页影响。
const calBase = import.meta.env.BASE_URL.replace(/\/$/, '') + '/notes';

/** 文章链接 → 笔记 slug；归档 / 标签 / 年份切换这些都不是文章，返回 null */
function noteSlugFromHref(href: string | null): string | null {
  if (!href) return null;
  const path = href.split(/[?#]/)[0];
  if (!path.startsWith(calBase + '/')) return null;
  const rest = path.slice(calBase.length + 1).replace(/\/$/, '');
  if (!rest || rest === 'archive' || rest === 'tags' || rest.startsWith('tags/')) return null;
  return rest;
}

/** undefined = 还没同步过（换页后要重新同步一次），null = 没有可显示的目标 */
let shownPreview: string | null | undefined;
let shownDay: string | null | undefined;

function defaultPreviewSlug(): string | null {
  return document.querySelector<HTMLElement>('.home-preview-item[data-default]')?.dataset.preview ?? null;
}

function defaultDayDate(): string | null {
  return document.querySelector<HTMLElement>('.home-day-body:not([hidden])')?.dataset.day ?? null;
}

/** 显示某篇的预览；slug 为 null 时回到默认那篇 */
function showPreview(slug: string | null): void {
  const want = slug ?? defaultPreviewSlug();
  if (want === shownPreview) return;
  const items = document.querySelectorAll<HTMLElement>('.home-preview-item');
  if (items.length === 0) return;
  shownPreview = want;
  items.forEach((item) => {
    item.hidden = item.dataset.preview !== want;
  });
  // 上一篇的滚动位置留给下一篇没有意义（长摘要会把下一篇的标题顶到卡片外）
  items[0].parentElement?.scrollTo(0, 0);
}

/** 显示某一天的活动详情；返回是否真的切换了（没有这一天的数据就返回 false） */
function showDay(date: string | null): boolean {
  const bodies = document.querySelectorAll<HTMLElement>('.home-day-body');
  if (bodies.length === 0) return false;
  const want = date ?? defaultDayDate();
  if (want === shownDay) return true;
  if (![...bodies].some((body) => body.dataset.day === want)) return false;
  shownDay = want;
  bodies.forEach((body) => {
    const active = body.dataset.day === want;
    body.hidden = !active;
    // 同上：换了一天，列表从头看起
    if (active) body.querySelector<HTMLElement>('.home-day-rows')?.scrollTo(0, 0);
  });
  return true;
}

document.addEventListener(
  'pointerover',
  (e) => {
    const link = (e.target as HTMLElement | null)?.closest?.('a');
    showPreview(link ? noteSlugFromHref(link.getAttribute('href')) : null);
  },
  true
);

// 键盘走到哪篇也换预览（Tab 进系列树时鼠标未必在）
document.addEventListener('focusin', (e) => {
  const link = (e.target as HTMLElement | null)?.closest?.('a');
  if (link) showPreview(noteSlugFromHref(link.getAttribute('href')));
});

// 点热力图某一天 → 换成那天的详情。带修饰键 / 中键仍走原来的归档链接，
// 想「在新标签页打开归档」不受影响。
document.addEventListener('click', (e) => {
  const cell = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('.notes-cal-day[data-date]');
  if (!cell) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (!showDay(cell.dataset.date ?? null)) return;
  e.preventDefault();
});

// 换页后两处的「当前项」缓存作废：新页面上的默认项要重新同步一次
document.addEventListener('izwarm:panel-swap', () => {
  shownPreview = undefined;
  shownDay = undefined;
});

// ---------- 文章底部操作底板：分享链接 / 请我喝咖啡 ----------
// 走 document 委托而不是给按钮单独绑监听：文章页 SPA 换页时区域内容会被整体替换，
// 绑在元素上的监听下一次换页就丢了（系列树踩过这个坑）。
let coffeeModalReturnFocus: HTMLElement | null = null;

function coffeeModalEl(): HTMLElement | null {
  return document.getElementById('coffeeModal');
}

function openCoffee(): void {
  const modal = coffeeModalEl();
  if (!modal || !modal.hidden) return;
  coffeeModalReturnFocus = document.activeElement as HTMLElement | null;
  // 收款卡 342KB，延迟到首次打开才加载
  const img = modal.querySelector<HTMLImageElement>('.coffee-modal-img');
  if (img && !img.src) {
    const src = img.dataset.src;
    if (src) img.src = src;
  }
  modal.hidden = false;
  modal.querySelector<HTMLButtonElement>('.coffee-modal-close')?.focus();
}

function closeCoffee(): void {
  const modal = coffeeModalEl();
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  coffeeModalReturnFocus?.focus();
  coffeeModalReturnFocus = null;
}

/** 分享用地址：去掉 query 与 hash，只留站点根 + 文章路径 */
function shareUrl(): string {
  return location.origin + location.pathname;
}

/** 「提议」复制邮箱后的提示条：贴在操作底板上方，2.2s 后淡出。
 *  底板内节点会被 SPA 换页整体替换，所以每次都从按钮重新查一遍，不缓存。 */
let actionHintTimer: number | undefined;

function showActionHint(btn: HTMLElement, text: string): void {
  const bar = btn.closest<HTMLElement>('.article-actions');
  const hint = bar?.querySelector<HTMLElement>('[data-action-hint]');
  if (!bar || !hint) return;
  hint.textContent = text;
  bar.classList.add('is-hinting');
  window.clearTimeout(actionHintTimer);
  actionHintTimer = window.setTimeout(() => {
    bar.classList.remove('is-hinting');
  }, 2200);
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (target?.closest?.('[data-coffee-close]')) {
    closeCoffee();
    return;
  }
  const btn = target?.closest?.<HTMLButtonElement>('[data-article-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-article-action');

  if (action === 'coffee') {
    openCoffee();
    return;
  }
  if (action === 'suggest') {
    const label = btn.querySelector<HTMLElement>('.action-label');
    const original = label?.textContent ?? '';
    void copyText(site.feedbackEmail).then(() => {
      btn.classList.add('is-done');
      if (label) label.textContent = '已复制';
      showActionHint(btn, '欢迎邮箱反馈');
      window.setTimeout(() => {
        btn.classList.remove('is-done');
        if (label) label.textContent = original;
      }, 1500);
    });
    return;
  }
  if (action !== 'share') return;

  const label = btn.querySelector<HTMLElement>('.action-label');
  const original = label?.textContent ?? '';
  void copyText(shareUrl()).then(() => {
    btn.classList.add('is-done');
    if (label) label.textContent = '已复制';
    window.setTimeout(() => {
      btn.classList.remove('is-done');
      if (label) label.textContent = original;
    }, 1500);
  });
});

// ---------- 友链卡的「复制」：复制对方站点地址 ----------
// 与分享按钮同一个套路：走 document 委托（Friends 面板换页时卡片节点会被整体替换），
// 复制失败也照样给反馈——站点跑在 http 上，看到的多半是 execCommand 那条兜底路径。
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement | null)?.closest?.<HTMLButtonElement>('[data-friend-copy]');
  if (!btn) return;
  const address = btn.getAttribute('data-friend-copy') ?? '';
  if (!address) return;
  const label = btn.querySelector<HTMLElement>('.action-label');
  const original = label?.textContent ?? '';
  void copyText(address).then(() => {
    btn.classList.add('is-done');
    if (label) label.textContent = '已复制';
    window.setTimeout(() => {
      btn.classList.remove('is-done');
      if (label) label.textContent = original;
    }, 1500);
  });
});

// Esc 关闭弹层（弹层在文章页里，换页后节点会被替换，所以监听挂在 document 上）
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCoffee();
});

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

// ---------- 大纲：次级标题的展开 / 收起 ----------
// 委托到 document：SPA 换页会把整棵大纲换掉，绑在节点上的监听下一次就没了。
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement | null)?.closest?.<HTMLButtonElement>('[data-toc-toggle]');
  if (!btn) return;
  const item = btn.closest<HTMLElement>('.notes-toc-item');
  if (!item) return;
  const collapsed = item.classList.toggle('is-collapsed');
  btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  btn.setAttribute('aria-label', collapsed ? '展开子标题' : '收起子标题');
});

initCodeCopy();
initToc();
initTocMath();
syncArticleFolds();
initAnswerFolds();
// 正文图片预览（点图放大 / 滚轮缩放）：只初始化一次，内部走 document 委托，
// 所以 SPA 换页后正文里的新图片同样生效，不需要每次换页重绑
initImageViewer();
