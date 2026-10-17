/**
 * 归档的标签筛选。
 *
 * 标签已经并进归档页（没有独立的标签页了）：
 * - 顶部标签条上的任意一个标签、或某条记录右侧的 #tag，点下去都只是就地过滤下方归档，
 *   不换页、不刷新；
 * - 再点一次已选中的标签（或「全部」/「清除」）= 取消筛选；
 * - 筛选状态写进 URL 的 ?tag=，所以刷新、分享链接、从文章页点标签回到归档，
 *   都能还原到同一个视图。
 *
 * 监听全部挂在 document 的捕获阶段：SPA 换页会把归档里的节点整体换掉，
 * 绑在节点上的监听下一次就没了（系列树踩过这个坑）；捕获阶段 + stopPropagation
 * 还能抢在 panel-nav 的换页逻辑之前把「点标签」这件事拦下来。
 */

const ROOT = '[data-archive]';

/** 当前筛选的标签；null = 全部 */
let current: string | null = null;
/** document 监听只绑一次 */
let bound = false;

function root(): HTMLElement | null {
  return document.querySelector<HTMLElement>(ROOT);
}

function readUrlTag(): string | null {
  const tag = new URLSearchParams(location.search).get('tag')?.trim() ?? '';
  return tag ? tag : null;
}

function writeUrlTag(tag: string | null): void {
  const next = new URL(location.href);
  if (tag) next.searchParams.set('tag', tag);
  else next.searchParams.delete('tag');
  const query = next.searchParams.toString();
  // replaceState：筛选是同一页的视图变化，不该在历史里留下一长串中间态
  history.replaceState(history.state, '', next.pathname + (query ? `?${query}` : '') + next.hash);
}

interface ApplyOptions {
  /** 是否把筛选写回地址栏（初次按 URL 还原时不必再写） */
  syncUrl?: boolean;
  /** 是否播一次淡入，让「筛掉了哪些」看得出来 */
  animate?: boolean;
}

function applyTag(tag: string | null, opts: ApplyOptions = {}): void {
  const el = root();
  if (!el) return;
  const { syncUrl = true, animate = true } = opts;
  const next = tag?.trim() ? tag.trim() : null;
  const changed = next !== current;
  current = next;

  // 标签条：选中的那个亮起来；「全部」只在没筛选时亮
  el.querySelectorAll<HTMLElement>('.tag-chip').forEach((chip) => {
    const chipTag = chip.dataset.tag ?? '';
    const on = next === null ? chipTag === '' : chipTag === next;
    chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  let total = 0;
  el.querySelectorAll<HTMLElement>('[data-archive-year]').forEach((year) => {
    const rows = [...year.querySelectorAll<HTMLElement>('.archive-entry')];
    let visible = 0;
    let prevDate = '';
    for (const row of rows) {
      const tags = (row.dataset.tags ?? '').split('|').filter(Boolean);
      const show = next === null || tags.includes(next);
      row.hidden = !show;
      row.classList.remove('is-last');
      if (!show) continue;
      // 同一天只显示一次日期：当天第一条被筛掉后，剩下的那条要接回日期
      const date = row.dataset.date ?? '';
      row.classList.toggle('is-repeat', date === prevDate);
      prevDate = date;
      visible += 1;
    }
    // 时间轴的线收在最后一条可见记录上
    rows.filter((row) => !row.hidden).at(-1)?.classList.add('is-last');

    year.hidden = visible === 0;
    total += visible;
    const count = year.querySelector<HTMLElement>('[data-year-count]');
    if (count) count.textContent = String(visible);
  });

  const status = el.querySelector<HTMLElement>('[data-archive-status]');
  if (status) {
    status.hidden = next === null;
    const label = status.querySelector<HTMLElement>('[data-filter-label]');
    if (label) label.textContent = next ? `#${next}` : '';
    const count = status.querySelector<HTMLElement>('[data-filter-count]');
    if (count) count.textContent = String(total);
  }

  const empty = el.querySelector<HTMLElement>('[data-archive-empty]');
  if (empty) {
    empty.hidden = total !== 0;
    if (total === 0 && next) empty.textContent = `没有 #${next} 的文章。`;
  }

  if (changed && animate) {
    const body = el.querySelector<HTMLElement>('[data-archive-body]');
    if (body) {
      body.classList.remove('is-filtering');
      void body.offsetWidth; // 强制重排，让同一个动画能连续播两次
      body.classList.add('is-filtering');
    }
  }

  if (syncUrl) writeUrlTag(next);
}

function bind(): void {
  if (bound) return;
  bound = true;
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement | null;
      const clear = target?.closest<HTMLElement>('[data-tag-clear]') ?? null;
      const hit = clear ?? target?.closest<HTMLElement>('[data-tag]') ?? null;
      if (!hit) return;
      // 不在归档页（比如文章页的 #tag）：交给普通链接跳转，
      // SPA 换到归档后由 initArchiveFilter 按 URL 还原筛选
      if (!root()) return;
      event.preventDefault();
      event.stopPropagation();
      if (clear) {
        applyTag(null);
        return;
      }
      const tag = hit.dataset.tag?.trim() ?? '';
      applyTag(!tag || tag === current ? null : tag);
    },
    true
  );
}

/** 页面载入 / SPA 换页后调用：绑定监听并按 URL 还原筛选 */
export function initArchiveFilter(): void {
  if (!root()) return;
  bind();
  applyTag(readUrlTag(), { syncUrl: false, animate: false });
}
