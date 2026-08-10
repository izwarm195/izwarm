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

/** 获取已发布文章（draft 默认排除；开发环境可用 includeDraft 查看并自行标记） */
export async function getPublishedNotes(includeDraft = false): Promise<Note[]> {
  const all = await getCollection('notes');
  const list = includeDraft ? all : all.filter((n) => !n.data.draft);
  return sortNotes(list);
}

/** 稳定排序：order → 发布日期 → 标题 */
export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    const d = a.data.publishDate.valueOf() - b.data.publishDate.valueOf();
    if (d !== 0) return d;
    return a.data.title.localeCompare(b.data.title, 'zh-Hans-CN');
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
  return [...nodes].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
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
          // 归档：同一月内从新到旧（同日期按标题稳定排序）
          notes: [...list].sort(
            (a, b) =>
              b.data.publishDate.valueOf() - a.data.publishDate.valueOf() ||
              a.data.title.localeCompare(b.data.title, 'zh-Hans-CN')
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
  count: number;
}
export interface CalendarData {
  year: number;
  days: CalendarDay[];
}

export function getCalendarData(notes: Note[], year: number): CalendarData {
  const counts = new Map<string, number>();
  for (const note of notes) {
    const d = note.data.publishDate;
    if (d.getUTCFullYear() !== year) continue;
    const key = formatDate(d);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const days: CalendarDay[] = [];
  for (let m = 0; m < 12; m++) {
    const dim = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    for (let day = 1; day <= dim; day++) {
      const key = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ date: key, month: m, count: counts.get(key) ?? 0 });
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

/** 统一日期格式化（UTC，避免时区偏移），返回 YYYY-MM-DD */
export function formatDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
