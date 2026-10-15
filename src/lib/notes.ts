/**
 * Notes 内容集中数据处理模块。
 * 所有系列、归档、标签、统计、日历、字数计算都从这里派生，组件不得各自实现。
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;
export interface TocItem {
  depth: number;
  slug: string;
  text: string;
}

/** 站点 base（子路径部署时由 ASTRO_BASE 提供，如 /izwarm/；本地为空） */
export const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 为站内绝对路径补上 base 前缀 */
export const url = (path: string): string => baseUrl + (path.startsWith('/') ? path : '/' + path);

export const noteUrl = (note: Note): string => url(`/notes/${note.slug}/`);

/** 创建时间（含时刻）：缺省回退 publishDate，用于同一天内排序 */
function creationTime(note: Note): number {
  return note.data.createdAt?.valueOf() ?? note.data.publishDate.valueOf();
}

// ---------- 智能排序 ----------
const CN_DIGIT: Record<string, number> = {
  零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
};

/** 中文数字（一~九十九）→ 数字 */
function chineseNumeral(s: string): number {
  if (CN_DIGIT[s] !== undefined) return CN_DIGIT[s];
  if (s === '十') return 10;
  if (s.startsWith('十')) return 10 + (CN_DIGIT[s[1]] ?? 0);
  if (s.endsWith('十')) return (CN_DIGIT[s[0]] ?? 0) * 10;
  const parts = s.split('十');
  if (parts.length === 2) return (CN_DIGIT[parts[0]] ?? 0) * 10 + (CN_DIGIT[parts[1]] ?? 0);
  return 999;
}

/**
 * 名称排序键：总目录最先、第X章按中文/阿拉伯数字排、附录最后。
 * 返回 null 表示无特殊键，走通用自然排序。
 */
function nameSortKey(name: string): number | null {
  if (/总目录|index|toc/i.test(name)) return -2;
  const ch = name.match(/第([一二三四五六七八九十\d]+)章/);
  if (ch) {
    const n = ch[1];
    return (/^\d+$/.test(n) ? parseInt(n, 10) : chineseNumeral(n)) * 10;
  }
  if (/附录|appendix/i.test(name)) return 999;
  return null;
}

/** 通用智能比较：特殊键优先，其次按数字感知的自然顺序 */
export function smartCompare(a: string, b: string): number {
  const ka = nameSortKey(a);
  const kb = nameSortKey(b);
  if (ka !== null && kb !== null) return ka - kb;
  if (ka !== null) return -1;
  if (kb !== null) return 1;
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true, sensitivity: 'base' });
}

/** 获取已发布文章（draft 默认排除；开发环境可用 includeDraft 查看并自行标记） */
export async function getPublishedNotes(includeDraft = false): Promise<Note[]> {
  const all = await getCollection('notes');
  const list = includeDraft ? all : all.filter((n) => !n.data.draft);
  return sortNotes(list);
}

/** vault 里标了 moc 标签的总目录笔记：同一系列里它是索引，永远排最后 */
function isMoc(note: Note): boolean {
  return note.data.tags.includes('moc');
}

/**
 * 标题里的「序号」：第X章 / 第X节 / 第X次（中文数字也认）、开头的「01」、
 * 中间的「Python 杂记 09 …」「Stage 3 …」这类独立数字、结尾的罗马数字「对话总结 II」。
 * 抽不出序号就返回 null —— 这些笔记维持原来的时间顺序（很多笔记的时间就是它的顺序，
 * 比如「CE 26-07-09 数字反转」这类，标题里已经没有日期了）。
 */
function titleNumber(title: string): number | null {
  const chapter = title.match(/第\s*([一二三四五六七八九十百\d]+)\s*[章节次篇讲课]/);
  if (chapter) {
    const raw = chapter[1];
    return /^\d+$/.test(raw) ? parseInt(raw, 10) : chineseNumeral(raw);
  }
  // 中间那个独立数字：两边要有空白或右侧是连接符，别把「SS-QNA-01」这种编号里的数当序号
  const middle = title.match(/(?:^|\s)(\d{1,4})(?=\s|[-–—]|$)/);
  if (middle) return parseInt(middle[1], 10);
  const roman = title.match(/\s(I{1,3}|IV|V|VI)$/);
  if (roman) return ['I', 'II', 'III', 'IV', 'V', 'VI'].indexOf(roman[1]) + 1;
  return null;
}

/**
 * 稳定排序：order → moc 垫底 → 序号（第 9 章在 第 10 章前面，中文数字也认）
 * → 创建时间（同日从早到晚）→ slug。
 * 「有号」的永远排在「没号」的前面：章节在前，附录 / 阅读随记这类垫在章节之后。
 */
export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    const am = isMoc(a) ? 1 : 0;
    const bm = isMoc(b) ? 1 : 0;
    if (am !== bm) return am - bm;
    const an = titleNumber(a.data.title);
    const bn = titleNumber(b.data.title);
    if (an !== bn) {
      if (an === null) return 1;
      if (bn === null) return -1;
      return an - bn;
    }
    const created = creationTime(a) - creationTime(b);
    if (created !== 0) return created;
    return smartCompare(a.slug, b.slug);
  });
}

// ---------- 系列树 ----------
export interface SeriesNode {
  name: string;
  path: string[];
  children: SeriesNode[];
  notes: Note[];
}

export function buildSeriesTree(notes: Note[]): SeriesNode[] {
  const root: SeriesNode = { name: '', path: [], children: [], notes: [] };
  for (const note of notes) {
    let node = root;
    for (const seg of note.data.series) {
      let child = node.children.find((c) => c.name === seg);
      if (!child) {
        child = { name: seg, path: [...node.path, seg], children: [], notes: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.notes.push(note);
  }
  return sortSeriesNodes(root.children);
}

function sortSeriesNodes(nodes: SeriesNode[]): SeriesNode[] {
  return [...nodes]
    .sort((a, b) => smartCompare(a.name, b.name))
    .map((node) => ({
      ...node,
      notes: sortNotes(node.notes),
      children: sortSeriesNodes(node.children),
    }));
}

/** 与当前文章同直接子系列的文章（含自身，供侧栏列表高亮当前项） */
export function getSiblingNotes(notes: Note[], current: Note): Note[] {
  const key = current.data.series.join('\u0000');
  return sortNotes(notes.filter((n) => n.data.series.join('\u0000') === key));
}

// ---------- 归档 ----------
export interface ArchiveMonth {
  month: string;
  notes: Note[];
}
export interface ArchiveYear {
  year: string;
  months: ArchiveMonth[];
}

export function getArchiveData(notes: Note[]): ArchiveYear[] {
  const years = new Map<string, Map<string, Note[]>>();
  for (const note of notes) {
    const d = note.data.publishDate;
    const y = String(d.getUTCFullYear());
    const m = `${y}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!years.has(y)) years.set(y, new Map());
    const months = years.get(y)!;
    if (!months.has(m)) months.set(m, []);
    months.get(m)!.push(note);
  }
  return [...years.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, list]) => ({
          month,
          // 归档：发布日期从新到旧；同一天按创建时间从早到晚，再按 order / slug
          notes: [...list].sort(
            (a, b) => {
              const published = b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
              if (published !== 0) return published;
              const created = creationTime(a) - creationTime(b);
              if (created !== 0) return created;
              const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
              const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
              if (ao !== bo) return ao - bo;
              return a.slug.localeCompare(b.slug);
            }
          ),
        })),
    }));
}

// ---------- 标签 ----------
export interface TagIndex {
  tag: string;
  notes: Note[];
}

export function getTagsIndex(notes: Note[]): TagIndex[] {
  const map = new Map<string, Note[]>();
  for (const note of notes) {
    for (const tag of note.data.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(note);
    }
  }
  return [...map.entries()]
    .map(([tag, list]) => ({ tag, notes: sortNotes(list) }))
    .sort((a, b) => b.notes.length - a.notes.length || a.tag.localeCompare(b.tag, 'zh-Hans-CN'));
}

// ---------- 统计 ----------
export interface NotesStats {
  articles: number;
  series: number;
  tags: number;
  words: number;
}

/** 系列数 = 目录树中所有层级的系列节点数量（每个唯一前缀计一次） */
export function getNotesStats(notes: Note[]): NotesStats {
  const seriesSet = new Set<string>();
  const tagSet = new Set<string>();
  let words = 0;
  for (const note of notes) {
    let path = '';
    for (const seg of note.data.series) {
      path = path ? `${path}\u0000${seg}` : seg;
      seriesSet.add(path);
    }
    for (const tag of note.data.tags) tagSet.add(tag);
    words += countWords(note.body ?? '');
  }
  return { articles: notes.length, series: seriesSet.size, tags: tagSet.size, words };
}

/** 中英文混合字数：CJK 逐字计数，拉丁词按词计数 */
export function countWords(text: string): number {
  const cleaned = text.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`|=\-\[\]()!]/g, ' ');
  const cjk = cleaned.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g)?.length ?? 0;
  const latin =
    cleaned
      .replace(/[\u3400-\u4dbf\u4e00-\u9fff]/g, ' ')
      .match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  return cjk + latin;
}

// ---------- 日历 ----------
export interface CalendarDay {
  date: string;
  month: number;
  /** 当日文章数（决定该日是否可点击跳转归档） */
  notes: number;
  /** 当日创建或修改过的笔记数：来自笔记真实时间（frontmatter updated_at / 创建时间） */
  touched: number;
  /** 当日 Obsidian 库提交数（vault git 历史，来自同步脚本生成的 commit-activity.json） */
  commits: number;
  /** 当日网站仓库提交数（本站 git 历史，来自 web-commit-activity.json） */
  webCommits: number;
}
export interface CalendarData {
  year: number;
  days: CalendarDay[];
}

/** 每日提交数映射：YYYY-MM-DD → 当日 commit 数（vault 与网站仓库各一份） */
export type CommitActivity = Record<string, number>;

export function getCalendarData(
  notes: Note[],
  year: number,
  activity: CommitActivity,
  webActivity: CommitActivity = {},
): CalendarData {
  const noteCounts = new Map<string, number>();
  /** 当天有"写入"的笔记数：创建时间 ∪ 修改时间（同一篇同日只记一次） */
  const touchedCounts = new Map<string, number>();
  const bump = (map: Map<string, number>, key: string): void => {
    map.set(key, (map.get(key) ?? 0) + 1);
  };
  for (const note of notes) {
    const published = note.data.publishDate;
    if (published.getUTCFullYear() === year) bump(noteCounts, formatDate(published));
    const days = new Set<string>();
    for (const d of [note.data.createdAt, note.data.updatedDate]) {
      if (d && d.getUTCFullYear() === year) days.add(formatDate(d));
    }
    for (const day of days) bump(touchedCounts, day);
  }
  const days: CalendarDay[] = [];
  for (let m = 0; m < 12; m++) {
    const dim = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    for (let day = 1; day <= dim; day++) {
      const key = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: key,
        month: m,
        notes: noteCounts.get(key) ?? 0,
        touched: touchedCounts.get(key) ?? 0,
        commits: activity[key] ?? 0,
        webCommits: webActivity[key] ?? 0,
      });
    }
  }
  return { year, days };
}

export function getLatestYear(notes: Note[]): number {
  let year = 0;
  for (const note of notes) {
    const y = note.data.publishDate.getUTCFullYear();
    if (y > year) year = y;
  }
  return year;
}

/** 有文章的所有年份（降序） */
export function getYears(notes: Note[]): number[] {
  return [...new Set(notes.map((note) => note.data.publishDate.getUTCFullYear()))].sort((a, b) => b - a);
}

/** 有提交记录的所有年份（降序） */
export function getActivityYears(activity: CommitActivity): number[] {
  return [...new Set(Object.keys(activity).map((key) => Number(key.slice(0, 4))))].sort((a, b) => b - a);
}

/** 日历年份 = 文章年份 ∪ 提交年份（降序去重） */
export function getCalendarYears(notes: Note[], activity: CommitActivity): number[] {
  return [...new Set([...getYears(notes), ...getActivityYears(activity)])].sort((a, b) => b - a);
}

/** 统一日期格式化（UTC，避免时区偏移），返回 YYYY-MM-DD */
export function formatDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

// ---------- 主页工作台 ----------

/** 当天提交总数：Obsidian 库 + 网站仓库。热力图与单日详情共用它当深浅基准 */
export function dayCommits(d: { commits: number; webCommits: number }): number {
  return d.commits + d.webCommits;
}

/**
 * 提交数 → 着色强度（32%~100%，sqrt 归一）。
 * 热力图格子和「单日详情」里那一个格子必须同色，所以两边都走这一个函数。
 */
export function shadeFor(commits: number, maxCommits: number): number {
  if (commits <= 0 || maxCommits <= 0) return 32;
  return Math.round((32 + 68 * Math.sqrt(commits / maxCommits)) * 10) / 10;
}

/** 站点第一篇文章的日期：整格填金那一天 */
export function firstArticleDate(notes: Note[]): string | null {
  if (notes.length === 0) return null;
  return formatDate(
    notes.reduce((min, n) => (n.data.publishDate < min ? n.data.publishDate : min), notes[0].data.publishDate)
  );
}

/** 日历年份：?year= 有效就用它，否则最新的一年（热力图与主页其余模块必须同一年） */
export function resolveCalendarYear(
  requested: number,
  notes: Note[],
  activity: CommitActivity
): number {
  const years = getCalendarYears(notes, activity);
  return years.includes(requested) ? requested : (years[0] ?? new Date().getUTCFullYear());
}

/** 正文 → 纯文本（只给摘要用）：代码块、行间公式、HTML 标签、markdown 记号一律剔掉 */
function plainText(md: string, max = 900): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|=\-\\$[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/**
 * 预览摘要：先 frontmatter 的 description，不够长就接着往下取正文（去掉重复的首段）。
 * description 本身就是正文第一段，直接拼接会原样重复一遍，所以先在正文里把它切掉。
 */
export function noteExcerpt(note: Note, max = 300): string {
  const desc = (note.data.description ?? '').replace(/\s+/g, ' ').trim();
  if (desc.length >= max) return desc.slice(0, max) + '…';
  const body = plainText(note.body ?? '');
  const rest = desc && body.startsWith(desc) ? body.slice(desc.length) : body;
  const text = `${desc} ${rest}`.replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/** 侧栏预览卡要用的一篇笔记的全部字段（构建期算好，前端只做显示 / 隐藏） */
export interface HomePreview {
  slug: string;
  href: string;
  title: string;
  date: string;
  series: string;
  words: number;
  excerpt: string;
}

/** 「单日详情」一天的全部数据（整年每一天都有，没活动的日子三栏为空、占比条为 0） */
export interface HomeDay {
  date: string;
  month: number;
  /** 与热力图格子一致：有文章 = article，只有提交 = commit，什么都没有 = empty */
  kind: 'article' | 'commit' | 'empty';
  /** 与热力图格子一致的着色强度 */
  pct: number;
  /** 当天网站仓库是否也提交过（金框） */
  web: boolean;
  /** 是不是第一篇文章那天（整格金） */
  first: boolean;
  published: Note[];
  updated: Note[];
  /** 当天网站仓库的提交主题，一条一行 */
  commits: string[];
  /** 当天第一次出现的（子）系列 / 标签 */
  series: string[];
  tags: string[];
  /** 当天发表的文章字数合计（更新的不算：一篇改一行也会把全文重算一遍，数字虚高） */
  words: number;
}

export interface HomeBoard {
  featured: Note[];
  latest: Note[];
  previews: HomePreview[];
  days: HomeDay[];
  /** 默认展示的一天：最近一个有活动的日子（Obsidian 或网站） */
  defaultDate: string | null;
  /** 默认预览的文章：精选第一篇，缺省退回最新一篇 */
  defaultSlug: string | null;
}

/**
 * 主页工作台（左预览 / 左详情 / 中系列 / 右三块）的全部数据。
 *
 * 全部构建期算完直接写进 HTML，前端只做显示 / 隐藏两件事 ——
 * 悬停预览要即时，点热力图要即时，没有一次网络往返。
 */
export function getHomeBoard(
  notes: Note[],
  year: number,
  activity: CommitActivity,
  webActivity: CommitActivity,
  webCommits: Record<string, string[]>,
  featuredTitles: string[]
): HomeBoard {
  const calendar = getCalendarData(notes, year, activity, webActivity);
  const maxCommits = calendar.days.reduce((max, day) => Math.max(max, dayCommits(day)), 0);
  const firstDate = firstArticleDate(notes);

  // 同一天可能有多篇：按创建时间早→晚，和归档里的顺序一致
  const byPublish = new Map<string, Note[]>();
  const byTouch = new Map<string, Note[]>();
  for (const note of notes) {
    const published = formatDate(note.data.publishDate);
    if (!byPublish.has(published)) byPublish.set(published, []);
    byPublish.get(published)!.push(note);

    const touched = new Set<string>();
    for (const d of [note.data.createdAt, note.data.updatedDate]) {
      if (d) touched.add(formatDate(d));
    }
    // 当天发表的就不再重复算成「更新」
    for (const day of touched) {
      if (day === published) continue;
      if (!byTouch.has(day)) byTouch.set(day, []);
      byTouch.get(day)!.push(note);
    }
  }

  // 系列 / 标签的「创建日」= 它底下最早一篇文章的发布日期
  const seriesFirst = new Map<string, string>();
  const tagFirst = new Map<string, string>();
  const keepEarliest = (map: Map<string, string>, key: string, date: string): void => {
    const prev = map.get(key);
    if (prev === undefined || date < prev) map.set(key, date);
  };
  for (const note of notes) {
    const date = formatDate(note.data.publishDate);
    let path = '';
    for (const seg of note.data.series) {
      path = path ? `${path} / ${seg}` : seg;
      keepEarliest(seriesFirst, path, date);
    }
    for (const tag of note.data.tags) keepEarliest(tagFirst, tag, date);
  }

  const days: HomeDay[] = [];
  for (const d of calendar.days) {
    const published = byPublish.get(d.date) ?? [];
    const updated = byTouch.get(d.date) ?? [];
    const commits = webCommits[d.date] ?? [];
    // 没有任何活动的日子不进详情：热力图上那些空格子点不动，也就不需要它们的一天
    if (published.length === 0 && updated.length === 0 && commits.length === 0) continue;
    const commitsToday = dayCommits(d);
    days.push({
      date: d.date,
      month: d.month,
      kind: d.notes > 0 ? 'article' : commitsToday > 0 ? 'commit' : 'empty',
      pct: shadeFor(commitsToday, maxCommits),
      web: d.webCommits > 0,
      first: d.date === firstDate,
      published,
      updated,
      commits,
      series: [...seriesFirst].filter(([, day]) => day === d.date).map(([name]) => name),
      tags: [...tagFirst].filter(([, day]) => day === d.date).map(([name]) => name),
      words: published.reduce((sum, note) => sum + countWords(note.body ?? ''), 0),
    });
  }
  days.sort((a, b) => b.date.localeCompare(a.date));

  const previewOf = (note: Note): HomePreview => ({
    slug: note.slug,
    href: noteUrl(note),
    title: note.data.title,
    date: formatDate(note.data.publishDate),
    series: note.data.series.join(' / '),
    words: countWords(note.body ?? ''),
    excerpt: noteExcerpt(note),
  });

  const byTitle = new Map(notes.map((note) => [note.data.title, note]));
  const featured = featuredTitles
    .map((title) => byTitle.get(title))
    .filter((note): note is Note => note !== undefined);

  const latest = [...notes]
    .sort(
      (a, b) =>
        b.data.publishDate.valueOf() - a.data.publishDate.valueOf() || creationTime(b) - creationTime(a)
    )
    .slice(0, 3);

  const previews = notes.map(previewOf);
  const defaultNote = featured[0] ?? latest[0] ?? null;

  return {
    featured,
    latest,
    previews,
    days,
    // days 已按日期倒序，第一条就是最近一个有活动的日子
    defaultDate: days[0]?.date ?? null,
    defaultSlug: defaultNote?.slug ?? null,
  };
}
