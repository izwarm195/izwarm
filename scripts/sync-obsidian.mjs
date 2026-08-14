#!/usr/bin/env node
/**
 * 同步 Obsidian 白名单目录 → src/content/notes
 * 规则见 docs/content-frontmatter.md。
 *
 * 用法：
 *   node scripts/sync-obsidian.mjs [vault-path]
 *   OBSIDIAN_VAULT=<path> node scripts/sync-obsidian.mjs
 *   node scripts/sync-obsidian.mjs --selftest
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOTS = ['CPP', 'English', 'Machine & Deep Learning', 'Signals/Signals & Systems'];
const SKIP_DIRS = new Set(['.obsidian', '.trash', 'Templates', 'Daily', 'Journal', 'Canvas', 'Private', 'Attachments', '_QuickAdd']);
const VAULT = process.argv[2] || process.env.OBSIDIAN_VAULT || 'D:\\搞学术\\大二暑\\Obsidian';
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/notes');
const MANIFEST = path.resolve(path.dirname(OUT), '../config/created-dates.json');
// 子路径部署（GitHub Pages 的 /izwarm/）时，站内链接带上 base 前缀；本地为空
const SITE_BASE = (process.env.ASTRO_BASE ?? '').replace(/\/$/, '');

// ---------- 纯函数（可单测） ----------
const PREFIX_DATE = /^(?:CS|CE|WD|WS)\s+(\d{2})-(\d{2})-(\d{2})[\s:：]*(.*)$/;

// Obsidian callout 类型 → Zest Interface Icons（本地 media/icons，MIT）
const CALLOUT_ICONS = {
  note: 'note',
  question: 'circled-question',
  faq: 'circled-question',
  help: 'circled-question',
  answer: 'circled-check',
  tip: 'lightbulb',
  hint: 'lightbulb',
  important: 'bullhorn',
  warning: 'triangle-exclaimation',
  caution: 'triangle-exclaimation',
  attention: 'triangle-exclaimation',
  danger: 'circled-x',
  error: 'circled-x',
  failure: 'circled-x',
  bug: 'circled-x',
  success: 'circled-check',
  check: 'circled-check',
  done: 'circled-check',
  example: 'tag',
  quote: 'chat-bubble',
  cite: 'chat-bubble',
  abstract: 'document',
  summary: 'document',
  tldr: 'document',
  info: 'circled-info',
  todo: 'circled-info',
};

function calloutIcon(type) {
  return CALLOUT_ICONS[type] || 'circled-info';
}

function deriveTitle(name, fm) {
  if (fm.title) return String(fm.title);
  const base = name.replace(/\.md$/i, '');
  const m = base.match(PREFIX_DATE);
  return (m && m[4].trim()) || base;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDateStr(s) {
  if (!s) return null;
  const t = String(s).match(/^\s*(\d{2})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})$/);
  if (t) return `20${t[1]}-${t[2]}-${t[3]}T${t[4]}:${t[5]}:${t[6]}`;
  const d = String(s).match(/^\s*(\d{2})-(\d{2})-(\d{2})$/);
  if (d) return `20${d[1]}-${d[2]}-${d[3]}`;
  const m = String(s).match(/^\s*(\d{2})-(\d{2})$/);
  if (m) return `20${m[1]}-${m[2]}-01`;
  return null;
}

function deriveSlug(category, vaultRelDir, title) {
  const parts = [slugify(category), ...vaultRelDir.split(path.sep).map(slugify), slugify(title)];
  return parts.filter(Boolean).join('/');
}

// ---------- 主流程 ----------
async function walk(dir, vaultRel = '') {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    const rel = path.join(vaultRel, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, rel)));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push({ full, rel });
  }
  return out;
}

function gitDate(vault, rel, first) {
  try {
    const args = ['-C', vault, 'log', first ? '--diff-filter=A' : '-1', '--format=%aI', '--', rel];
    const out = execFileSync('git', args, { encoding: 'utf8' }).trim();
    return out.split('\n')[0] || null;
  } catch {
    return null;
  }
}

function firstParagraph(body) {
  for (const line of body.split(/\n+/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('>') || trimmed.startsWith('#') || trimmed.startsWith('```')) continue;
    const t = trimmed.replace(/[*#>`|=\[\]$\\-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (t) return t.length > 140 ? t.slice(0, 140) + '…' : t;
  }
  return '';
}

function convertBody(body, slugIndex) {
  const linkify = (target, label) => {
    const key = target.trim();
    const slug = slugIndex.get(key) ?? slugIndex.get(key.replace(/\.md$/i, ''));
    return slug ? `[${label.trim()}](${noteUrlOf(slug)})` : label.trim();
  };
  return body
    .replace(/```dataviewjs[\s\S]*?```/g, '')
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, target, label) => linkify(target, label))
    .replace(/\[\[([^\]]+)\]\]/g, (_, target) => linkify(target, target))
    // Obsidian callout：隐藏 [!type]，改为 Zest 图标徽标 + 标题
    // 兼容列表内 callout：- > [!note] 标题
    .replace(/^(\s*(?:[-*+]\s+)?(?:>\s*)?)\[!(\w+)\][+-]?[ \t]*(.*)$/gm, (_, quote, type, title) => {
      const t = type.toLowerCase();
      const label = title && title.trim() ? title.trim() : t.charAt(0).toUpperCase() + t.slice(1);
      return `${quote}<img class="callout-badge" src="${SITE_BASE}/media/icons/${calloutIcon(t)}.svg" alt="${t}">**${label}**`;
    })
    // 引用块内本应是标题但漏了空格：> ###标题 → > ### 标题（连续 # 才是标题）
    .replace(/^(\s*>\s*)(#{2,6})(?=\S)/gm, '$1$2 ')
    // 引用块内孤立的单个 #（Obsidian 常当作普通文字）：去掉井号只留文字
    .replace(/^(\s*>\s*)#(?=[^\s#])/gm, '$1')
    .replace(/==([^=]+)==/g, '**$1**');
}

function noteUrlOf(slug) {
  return SITE_BASE + '/notes/' + slug + '/';
}

// Obsidian 公式规范化：把各种“看着是块公式、remark-math 却解析成行内/空公式”的写法
// 统一成 KaTeX 能正确识别的独占三行（$$ / 内容 / $$），跳过代码围栏。
function normalizeObsidianMath(markdown) {
  const lines = markdown.split('\n');
  const out = [];
  let inFence = false;
  let pending = null; // { pre: 行首缩进/引用前缀, body: 内容行[] }

  // 显示公式内容里的杂散 $（PaddleOCR 常见：$$(1) $h(n)=...$$）是语法错误，直接剔除
  const cleanDisplay = (s) => s.replace(/\$/g, '');

  function flushPending() {
    out.push(pending.pre + '$$');
    for (const b of pending.body) out.push(pending.pre + b);
    out.push(pending.pre + '$$');
    pending = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    // 跨行块公式：开 $$ 行已带内容、闭合 $$ 在后续行（含 > 引用前缀）
    if (pending) {
      const bareClose = line.match(/^(\s*(?:>\s*)?)\$\$\s*$/);
      if (bareClose) {
        flushPending();
        continue;
      }
      const contentClose = line.match(/^(\s*(?:>\s*)?)(.*?)\$\$\s*$/);
      if (contentClose && contentClose[2].trim()) {
        pending.body.push(cleanDisplay(contentClose[2].trim()));
        flushPending();
        continue;
      }
      // 下一行又开了一个新 $$ 块：当前块到此为止，按普通行重新处理
      if (/^\s*(?:>\s*)?\$\$/.test(line)) {
        flushPending();
        // 不 continue：让下面的同行/开块规则处理这一行
      } else {
        pending.body.push(cleanDisplay(line.replace(/^\s*(?:>\s*)+/, '')));
        continue;
      }
    }

    // 列表项里的同行块公式：- 说明：$$x$$ → 列表项文本 + 缩进的独占三行
    const listItem = line.match(/^(\s*(?:>\s*)?)([-*+]\s+)(.*?)\$\$(.+?)\$\$\s*(.*)$/);
    if (listItem) {
      const pre = listItem[1];
      const indent = pre + ' '.repeat(listItem[2].length);
      out.push(pre + listItem[2] + listItem[3].trimEnd());
      out.push(indent + '$$');
      out.push(indent + cleanDisplay(listItem[4].trim()));
      out.push(indent + '$$');
      if (listItem[5].trim()) out.push(pre + listItem[2] + listItem[5].trim());
      continue;
    }

    // 同行开闭：$$x$$（可有 > 前缀，$$ 后可带尾随文字）→ 拆成独占三行
    const inline = line.match(/^(\s*(?:>\s*)?)\$\$(.+?)\$\$\s*(.*)$/);
    if (inline) {
      const pre = inline[1];
      out.push(pre + '$$');
      out.push(pre + cleanDisplay(inline[2].trim()));
      out.push(pre + '$$');
      if (inline[3].trim()) out.push(pre + inline[3].trim());
      continue;
    }

    // 编号标签 + 行内开 + $$ 收尾：(2) $x(t)=...$$ → 标签行 + 独占三行显示公式
    const labeled = line.match(/^(\s*(?:>\s*)?)([^\n$]*[^\s$])\s*\$([^\n]+?)\$\$\s*$/);
    if (labeled) {
      out.push(labeled[1] + labeled[2]);
      out.push(labeled[1] + '$$');
      out.push(labeled[1] + cleanDisplay(labeled[3].trim()));
      out.push(labeled[1] + '$$');
      continue;
    }

    // 开 $$ 带内容且同行未闭合 → 挂起收集直到闭合行
    const open = line.match(/^(\s*(?:>\s*)?)\$\$(\s*\S.*)$/);
    if (open) {
      pending = { pre: open[1], body: [cleanDisplay(open[2].trim())] };
      continue;
    }

    // 行中多余的 $$（PaddleOCR：$x$$y$ 应为 $xy$）：仅当行内还有其他 $ 才合并，
    // 避免误伤行中的合法 $$x$$（去掉 $$ 后不再含 $，不会命中）
    const withoutDouble = line.replace(/\$\$/g, '');
    if (line.includes('$$') && withoutDouble.includes('$')) {
      out.push(withoutDouble);
      continue;
    }

    out.push(line);
  }
  if (pending) flushPending();
  return out.join('\n');
}

// Obsidian 源里常用制表符/空格做视觉缩进；CommonMark 会把 4 空格以上缩进当成代码块，
// 夹在行间公式之间的缩进内容会被整段吞掉（里面的公式也不渲染）。
// 这里不再无脑去缩进，而是按行追踪活动列表层级：
// - 列表项/续行重排到合法的 CommonMark 网格（每层缩进 = 父项内容缩进，
//   内容缩进 = 标记位置 + 标记宽度，子弹 2 格、`5. ` 3 格、`10. ` 4 格），
//   保留嵌套列表结构；
// - 行间公式视为当前列表项的内容（缩进进列表），避免公式把列表打断后
//   后续缩进项退化成代码块；
// - 只有脱离列表且缩进 >= 4 空格的孤立文本才去掉缩进，防止被识别为代码块。
function normalizeListIndent(markdown) {
  const lines = markdown.split('\n');
  const out = [];
  let inFence = false;
  let inMath = false;
  let mathIndent = 0;
  let srcStack = []; // 活动列表各层 { w: 源缩进宽度, mw: 输出标记宽度 }

  // 第 level 层列表项的标记缩进 = 前面各层标记宽度之和
  const markerIndent = (stack, level) => stack.slice(0, level).reduce((s, e) => s + e.mw, 0);
  // 当前最内层列表项的内容缩进
  const innerContentIndent = (stack) => stack.reduce((s, e) => s + e.mw, 0);
  // 列表项标记宽度：`- ` → 2，`5. ` → 3，`10. ` → 4
  const markerWidthOf = (stripped) => {
    const m = stripped.match(/^([-*+]|\d+[.)])\s+/);
    if (!m) return 0;
    return (m[1].length > 1 ? m[1].length : 1) + 1;
  };

  const leadingInfo = (line) => {
    let width = 0;
    let chars = 0;
    for (const ch of line) {
      if (ch === ' ') {
        width++;
        chars++;
      } else if (ch === '\t') {
        width += 4 - (width % 4);
        chars++;
      } else {
        break;
      }
    }
    return { width, stripped: line.slice(chars) };
  };

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (!line.trim()) {
      out.push('');
      continue;
    }

    const { width, stripped } = leadingInfo(line);

    // 行间公式内容行（可能以 > 等开头）优先按公式内容处理
    if (inMath) {
      if (/^\$\$\s*$/.test(stripped)) {
        inMath = false;
        out.push(' '.repeat(mathIndent) + '$$');
      } else {
        out.push(' '.repeat(mathIndent) + stripped);
      }
      continue;
    }
    // 行间公式定界符
    if (/^\$\$\s*$/.test(stripped)) {
      inMath = true;
      mathIndent = innerContentIndent(srcStack); // 当前最内层列表项的内容缩进
      out.push(' '.repeat(mathIndent) + '$$');
      continue;
    }

    const contentIndent = innerContentIndent(srcStack); // 输出网格中当前最内层列表项的内容缩进
    const inList = srcStack.length > 0;

    // 引用块：列表内缩进到内容缩进；缩进不足视为脱离列表
    if (stripped.startsWith('>')) {
      if (inList && width >= contentIndent) {
        out.push(' '.repeat(contentIndent) + stripped);
      } else {
        out.push(line);
        srcStack = [];
      }
      continue;
    }

    // 标题：顶格（或缩进不足）时结束列表；列表内且缩进足够时留在项内
    if (/^#{1,6}\s/.test(stripped)) {
      if (inList && width >= contentIndent) {
        out.push(' '.repeat(contentIndent) + stripped);
      } else {
        out.push(width >= 4 ? stripped : line);
        if (inList) srcStack = [];
      }
      continue;
    }

    // 列表项：根据源缩进找到层级，输出到 2 空格/级网格
    const item = stripped.match(/^([-*+]|\d+[.)])\s+/);
    if (item) {
      let level;
      if (!inList) {
        level = 0;
        srcStack = [{ w: width <= 3 ? width : 0, mw: markerWidthOf(stripped) }];
      } else {
        const same = srcStack.map((e) => e.w).lastIndexOf(width);
        if (same >= 0) {
          level = same;
          srcStack = srcStack.slice(0, same + 1);
        } else if (width > srcStack[srcStack.length - 1].w) {
          level = srcStack.length;
          srcStack.push({ w: width, mw: markerWidthOf(stripped) });
        } else {
          let l = srcStack.length - 1;
          while (l >= 0 && srcStack[l].w > width) l--;
          if (l < 0) {
            level = 0;
            srcStack = [{ w: width <= 3 ? width : 0, mw: markerWidthOf(stripped) }];
          } else if (width >= srcStack[l].w + 2) {
            level = l + 1;
            srcStack = srcStack.slice(0, l + 1);
            srcStack.push({ w: width, mw: markerWidthOf(stripped) });
          } else {
            level = l;
            srcStack = srcStack.slice(0, l + 1);
            srcStack[l].w = width;
          }
        }
      }
      out.push(' '.repeat(markerIndent(srcStack, level)) + stripped);
      continue;
    }

    // 其他文本：列表内一律视为当前项的（惰性）续行，缩进到内容缩进，
    // 保持列表层级不被顶格段落打断；脱离列表且 >= 4 空格才去缩进防代码块
    if (inList) out.push(' '.repeat(contentIndent) + stripped);
    else out.push(width >= 4 ? stripped : line);
  }
  return out.join('\n');
}

function toYaml(o) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
}

const CATEGORY_TAG = { CPP: 'cpp', English: 'english', 'Machine & Deep Learning': 'machine-learning', Signals: 'signals' };

async function main() {
  const summary = { published: 0, skipped: 0, errors: [] };
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  // 读取创建时间清单（本地同步时刷新；CI 直接使用，保证无日期笔记有真实创建时间）
  let createdDates = {};
  try {
    createdDates = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  } catch {
    createdDates = {};
  }
  const manifestData = {};

  // 第一遍：解析全部候选笔记（先建立 slug 索引，供双链转换）
  const candidates = [];
  for (const root of ROOTS) {
    const rootDir = path.join(VAULT, root);
    const files = await walk(rootDir, root);
    for (const file of files) {
      let data, content;
      try {
        ({ data, content } = matter(await fs.readFile(file.full, 'utf8')));
      } catch (err) {
        summary.errors.push(`${file.rel}: frontmatter 解析失败`);
        continue;
      }
      const relPosix = file.rel.split(path.sep).join('/');
      let birthtimeIso = null;
      try {
        const st = await fs.stat(file.full);
        if (st.birthtime) manifestData[relPosix] = st.birthtime.toISOString().slice(0, 10);
        birthtimeIso = st.birthtime ? st.birthtime.toISOString() : null;
      } catch {
        /* 忽略 stat 失败 */
      }
      if (data.publish === false || data.status === 'draft') {
        summary.skipped++;
        continue;
      }
      const basename = path.basename(file.rel);
      const title = deriveTitle(basename, data);
      const category = file.rel.split(path.sep)[0];
      const vaultRelDir = path.dirname(file.rel);
      const dirBelow = vaultRelDir === category ? '' : vaultRelDir.slice(category.length + 1);
      const slug = deriveSlug(category, dirBelow, title);
      const fmDate = parseDateStr(data.Date || data.Da || data.created || data.created_at);
      const nameDate = parseDateStr(basename);
      const date =
        nameDate ||
        fmDate ||
        createdDates[relPosix] ||
        gitDate(VAULT, file.rel, true) ||
        (await fs.stat(file.full)).birthtime.toISOString().slice(0, 10);
      // 创建时间（含时刻）：frontmatter → 清单 → 文件创建时间 → git → publishDate
      const createdAt =
        parseDateStr(data.createdAt || data.created) ||
        (createdDates[relPosix] ? createdDates[relPosix] + 'T00:00:00Z' : null) ||
        birthtimeIso ||
        gitDate(VAULT, file.rel, true) ||
        date;
      const updated = parseDateStr(data.updated_at) || gitDate(VAULT, file.rel, false) || date;
      const tags = [
        ...(Array.isArray(data.tags) ? data.tags.map((t) => String(t).replace(/^#/, '')) : []),
        CATEGORY_TAG[category],
      ].filter(Boolean);
      candidates.push({ file, data, content, basename, title, category, dirBelow, slug, date, createdAt, updated, tags });
    }
  }

  // 本地同步时刷新创建时间清单（CI 环境跳过，避免用检出时间覆盖）
  if (!process.env.CI) {
    await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
    await fs.writeFile(MANIFEST, JSON.stringify(manifestData, null, 2) + '\n', 'utf8');
  }

  // 已发布笔记索引：标题 / 文件名 → slug，未公开或不存在时保持纯文本
  const slugIndex = new Map();
  for (const n of candidates) {
    const key = n.basename.replace(/\.md$/i, '');
    if (!slugIndex.has(n.title)) slugIndex.set(n.title, n.slug);
    if (!slugIndex.has(key)) slugIndex.set(key, n.slug);
  }

  // 第二遍：转换双链并写出
  for (const n of candidates) {
      const body = normalizeListIndent(normalizeObsidianMath(convertBody(n.content, slugIndex))).replace(/^\s+/, '');
      const fm = {
        title: n.title,
        slug: n.slug,
        description: n.data.description || firstParagraph(body) || undefined,
        publishDate: n.date,
        createdAt: n.createdAt,
        updatedDate: n.updated,
        tags: [...new Set(n.tags)],
        series: n.dirBelow ? [n.category, ...n.dirBelow.split(path.sep)] : [n.category],
      };

      const outFile = path.join(OUT, ...n.slug.split('/')) + '.md';
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, `---\n${toYaml(fm)}\n---\n\n${body}\n`, 'utf8');
      summary.published++;
  }

  console.log(`published: ${summary.published}, skipped: ${summary.skipped}`);
  for (const e of summary.errors) console.warn(`warn: ${e}`);
}

// ---------- 自检 ----------
function selftest() {
  const assert = (cond, msg, actual, expected) => {
    if (!cond) {
      throw new Error(
        'selftest failed: ' +
          msg +
          (actual !== undefined ? `\n  actual: ${JSON.stringify(actual)}\n  expect: ${JSON.stringify(expected)}` : '')
      );
    }
  };
  assert(slugify('Machine & Deep Learning') === 'machine-and-deep-learning', 'slugify &');
  assert(slugify('第二章 连续时间系统时域分析') === '第二章-连续时间系统时域分析', 'slugify CJK');
  assert(deriveTitle('CS 26-07-09 const-correctness.md', {}) === 'const-correctness', 'title strip');
  assert(deriveTitle('WD 26-08-03.md', {}) === 'WD 26-08-03', 'title keep fallback');
  assert(parseDateStr('26-08-09T19:00:32') === '2026-08-09T19:00:32', 'date time');
  assert(parseDateStr('26-07-09') === '2026-07-09', 'date');
  assert(parseDateStr('YY-08-09T19:00:32') === null, 'broken template date ignored');
  assert(deriveSlug('CPP', 'Summaries', 'const-correctness') === 'cpp/summaries/const-correctness', 'slug path');
  const idx = new Map([['const-correctness', 'cpp/summaries/const-correctness']]);
  assert(
    convertBody('[[const-correctness]]', idx) === '[const-correctness](/notes/cpp/summaries/const-correctness/)',
    'wikilink to published slug'
  );
  assert(convertBody('[[不存在的笔记|别名]]', idx) === '别名', 'unpublished link stays text');
  // callout：隐藏 [!type]，换成 Zest 图标徽标
  assert(
    convertBody('> [!question]\n> 神秘氛围感公式推导', idx) ===
      '> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**Question**\n> 神秘氛围感公式推导',
    'callout badge no title',
    convertBody('> [!question]\n> 神秘氛围感公式推导', idx),
    '> <img class="callout-badge" src="/media/icons/circled-question.svg" alt="question">**Question**\n> 神秘氛围感公式推导'
  );
  assert(
    convertBody('> [!note] 重要说明\n> text', idx) ===
      '> <img class="callout-badge" src="/media/icons/note.svg" alt="note">**重要说明**\n> text',
    'callout badge with title'
  );
  // 列表内 callout：- > [!important] 标题
  assert(
    convertBody('- > [!important] 单位冲激', idx) ===
      '- > <img class="callout-badge" src="/media/icons/bullhorn.svg" alt="important">**单位冲激**',
    'callout badge in list item'
  );
  // 引用内 #：连续 # 补空格成标题，孤立单 # 去掉
  assert(
    convertBody('> ###标题\n> #孤立文字', idx) === '> ### 标题\n> 孤立文字',
    'quote hash normalize'
  );
  // 公式规范化：同行 $$x$$ → 独占三行
  assert(
    normalizeObsidianMath('$$f(t)=A\\cos(\\omega t+\\theta_{0})$$') === '$$\nf(t)=A\\cos(\\omega t+\\theta_{0})\n$$',
    'math same-line split'
  );
  // 同行 $$x$$ + 尾随文字 → 公式三行 + 尾随文字保留
  assert(
    normalizeObsidianMath('$$h(t)=x$$ 由冲激响应得到') === '$$\nh(t)=x\n$$\n由冲激响应得到',
    'math same-line trailing text'
  );
  // 引用内同行 $$x$$ → 带 > 前缀的三行
  assert(
    normalizeObsidianMath('> $$a=b$$') === '> $$\n> a=b\n> $$',
    'math blockquote same-line'
  );
  // 开 $$ 带内容、闭合在下一行 → 合并为三行
  assert(
    normalizeObsidianMath('$$ \\int f(t)\\delta(t-t_{0})dt = f(t_{0})\n$$') ===
      '$$\n\\int f(t)\\delta(t-t_{0})dt = f(t_{0})\n$$',
    'math open-with-content close next line'
  );
  // 引用内开 $$ 带内容、闭合在下一行
  assert(
    normalizeObsidianMath('> $$a&=1\\\\b&=2\n> $$') === '> $$\n> a&=1\\\\b&=2\n> $$',
    'math blockquote open-with-content close next line'
  );
  // 引用内两个相邻的同行走 $$ 块 → 各自拆成三行，不能合并成一个块
  assert(
    normalizeObsidianMath('> $$a_{0}&=x\n> $$a_{n}&=y\n> $$') ===
      '> $$\n> a_{0}&=x\n> $$\n> $$\n> a_{n}&=y\n> $$',
    'math blockquote adjacent same-line blocks'
  );
  // 列表项里的同行块公式 → 列表项文本 + 缩进三行
  assert(
    normalizeObsidianMath('- 单位冲激响应：$$\\delta (t) \\Rightarrow h(t)$$') ===
      '- 单位冲激响应：\n  $$\n  \\delta (t) \\Rightarrow h(t)\n  $$',
    'math list item same-line'
  );
  // 编号标签 + 行内开 + $$ 收尾 → 标签行 + 三行显示公式
  assert(
    normalizeObsidianMath('(2) $x_{2}(t)=1$$') === '(2)\n$$\nx_{2}(t)=1\n$$',
    'math labeled open single close double'
  );
  // 显示块内容里的杂散 $ → 剔除
  assert(
    normalizeObsidianMath('$$(1) $h(n)=2^{n}$x(n)$$') === '$$\n(1) h(n)=2^{n}x(n)\n$$',
    'math stray dollar inside display'
  );
  // 行中多余 $$（OCR：$x$$y$ 应为 $xy$）
  assert(
    normalizeObsidianMath('$\\sin \\omega t$$u(t)$') === '$\\sin \\omega tu(t)$',
    'math mid-line double dollar collapse'
  );
  // 行中的合法 $$x$$（前后有文字）不应被误删
  assert(
    normalizeObsidianMath('由式 $$a=b$$ 可知') === '由式 $$a=b$$ 可知',
    'math mid-line valid pair untouched'
  );
  // 开 $$ 带 \begin，闭合在最后一行末尾 → 合并为三行
  assert(
    normalizeObsidianMath('$$\\begin{aligned}\na&=1\\\\b&=2\n\\end{aligned}$$') ===
      '$$\n\\begin{aligned}\na&=1\\\\b&=2\n\\end{aligned}\n$$',
    'math open-with-content close at last line'
  );
  // 标准三行块公式与代码围栏保持不变
  assert(
    normalizeObsidianMath('$$\na=b\n$$\n\n```\n$$x$$\n```') === '$$\na=b\n$$\n\n```\n$$x$$\n```',
    'math valid block and fence untouched'
  );
  // 缩进规整：嵌套列表保留层级（重排到 2 空格/级网格），代码围栏内不动
  assert(
    normalizeListIndent('\t\t- $x$ 运算\n\t\t\t- 时移运算：\n\n```\n\tcode\n```') ===
      '- $x$ 运算\n  - 时移运算：\n\n```\n\tcode\n```',
    'normalize list indent keeps nesting and fence'
  );
  assert(
    normalizeListIndent('  $$\n\tcos\\omega t\n  $$') === '$$\ncos\\omega t\n$$',
    'normalize math block lines'
  );
  // 行间公式不打断列表：公式缩进进当前列表项，后续更深列表项保持嵌套
  assert(
    normalizeListIndent('- a\n\t- b\n$$\nx\n$$\n\t\t- c\n\t\t\t- d') ===
      '- a\n  - b\n    $$\n    x\n    $$\n    - c\n      - d',
    'math stays inside list, nesting preserved'
  );
  // 脱离列表的孤立缩进文本（>=4 空格）去掉缩进，避免被当成代码块吞掉公式
  assert(
    normalizeListIndent('$$\na\n$$\n    说明文字\n$$\nb\n$$') === '$$\na\n$$\n说明文字\n$$\nb\n$$',
    'orphan indented text dedented at root'
  );
  // 列表项续行保留为项内段落
  assert(
    normalizeListIndent('- 方法：\n\t冲激函数平衡法\n- 结束') === '- 方法：\n  冲激函数平衡法\n- 结束',
    'list continuation paragraph kept'
  );
  // 顶格解释段落不打断嵌套：后续同层编号项仍留在父项内
  assert(
    normalizeListIndent('1. 基于定义\n\t1. 对称性\n由\n$$\nx\n$$\n\t2. 奇偶虚实性\n$$\ny\n$$\n3. 基于时间变量运算') ===
      '1. 基于定义\n   1. 对称性\n      由\n      $$\n      x\n      $$\n   2. 奇偶虚实性\n      $$\n      y\n      $$\n3. 基于时间变量运算',
    'top-level paragraphs keep nested numbering'
  );
  // 顶格标题结束列表
  assert(
    normalizeListIndent('- a\n  b\n## 标题\n- c') === '- a\n  b\n## 标题\n- c',
    'heading ends list'
  );
  // 顶格引用块结束列表
  assert(
    normalizeListIndent('- a\n  b\n> 引用\n- c') === '- a\n  b\n> 引用\n- c',
    'root blockquote ends list'
  );
  console.log('selftest ok');
}

if (process.argv.includes('--selftest')) selftest();
else main();
