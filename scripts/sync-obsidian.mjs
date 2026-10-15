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
import { SEGMENT_ALIASES } from './slug-aliases.mjs';

const ROOTS = [
  'CPP',
  'English',
  'Machine & Deep Learning',
  'Signals/Signals & Systems',
  'Signals/数字电路与系统',
  'Physics',
  'Complex',
];
const SKIP_DIRS = new Set(['.obsidian', '.trash', 'Templates', 'Daily', 'Journal', 'Canvas', 'Private', 'Attachments', '_QuickAdd']);
const _posArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const VAULT = _posArg || process.env.OBSIDIAN_VAULT || 'D:\\搞学术\\大二暑\\Obsidian';
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/notes');
const MANIFEST = path.resolve(path.dirname(OUT), '../config/created-dates.json');
// 每日提交数（热力图数据源）：由 vault git 历史生成，YYYY-MM-DD → 当日提交数
const ACTIVITY = path.resolve(path.dirname(MANIFEST), 'commit-activity.json');
// 网站仓库自己的每日提交数（同构的第二份）：热力图上表现为一圈金框
const WEB_ACTIVITY = path.resolve(path.dirname(MANIFEST), 'web-commit-activity.json');
// 网站仓库每日提交主题：主页「单日详情」的网页开发一栏要逐条列出来，光有计数不够
const WEB_COMMITS = path.resolve(path.dirname(MANIFEST), 'web-commits.json');
// 网站仓库根目录：按脚本自身位置定位，不受 cwd 影响
const WEB_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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

/**
 * 时间戳 → ISO。
 *
 * Time Things 插件的 "modifiedKeyFormat" 若写成 `YY-MM-DD[T]HH:mm:ss`，`YY` 不会被
 * 替换（它只替换 MM/DD/HH/mm/ss），笔记里留下的是字面量：`updated_at: YY-09-16T23:18:58`。
 * 这类值必须按上下文补全年份，不能整条丢弃 —— 否则笔记的真实编辑时间全部丢失，
 * 只剩"vault 批量备份提交"的日期，热力图看起来就像一直没更新。
 */
function parseDateStr(s, yearHint) {
  if (!s) return null;
  const raw = String(s).trim();
  // 完整年份的 ISO 日期（frontmatter 的 Date / created / created_at 常直接这么写）。
  // 原来只认两位年份，`Date: 2026-09-07` 一路落到 null，笔记日期只能退回
  // 创建时间清单 / git 首次提交 —— 声明日期被无声忽略，热力图与归档就跟着错位。
  const iso = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/
  );
  if (iso) {
    const [, yy, mm, dd, hh, mi, ss, tz] = iso;
    return hh ? `${yy}-${mm}-${dd}T${hh}:${mi}:${ss ?? '00'}${tz ?? ''}` : `${yy}-${mm}-${dd}`;
  }
  const t = raw.match(/^(\d{2})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})$/);
  if (t) return `20${t[1]}-${t[2]}-${t[3]}T${t[4]}:${t[5]}:${t[6]}`;
  // 年份占位符（YY / YYYY 等未替换的字母）
  const p = raw.match(/^([A-Za-z]{2,4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}):(\d{2}))?$/);
  if (p) {
    const [, , mm, dd, hh, mi, ss] = p;
    const year = placeholderYear(yearHint, mm, dd, hh);
    return hh ? `${year}-${mm}-${dd}T${hh}:${mi}:${ss}` : `${year}-${mm}-${dd}`;
  }
  const d = raw.match(/^(\d{2})-(\d{2})-(\d{2})$/);
  if (d) return `20${d[1]}-${d[2]}-${d[3]}`;
  const m = raw.match(/^(\d{2})-(\d{2})$/);
  if (m) return `20${m[1]}-${m[2]}-01`;
  return null;
}

/** 占位符年份：优先用上下文年份，否则用当前年；算出未来日期（跨年瞬间）则退一年 */
function placeholderYear(yearHint, mm, dd, hh) {
  const hint = Number(yearHint);
  let year = Number.isFinite(hint) && hint > 2000 ? hint : new Date().getUTCFullYear();
  const probe = Date.parse(`${year}-${mm}-${dd}T${hh ?? '00'}:00:00Z`);
  if (Number.isFinite(probe) && probe - Date.now() > 36 * 3600 * 1000) year -= 1;
  return year;
}

// ---------- URL 段落 → ASCII 代号 ----------
const CHINESE_DIGITS = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };

/** 「三」「十五」「二十一」→ 3 / 15 / 21（只用于章节号，最多两位）；非中文数字返回 null */
function chineseNumber(text) {
  if (/^\d+$/.test(text)) return Number(text);
  let value = 0;
  for (const ch of text) {
    if (ch === '十') {
      value = (value || 1) * 10;
      continue;
    }
    const digit = CHINESE_DIGITS[ch];
    if (digit === undefined) return null;
    value += digit;
  }
  return value > 0 ? value : null;
}

/** 段落 → 代号；没有代号时返回 null（调用方决定是保留中文还是登记告警） */
function aliasedSegment(seg) {
  const alias = SEGMENT_ALIASES[seg];
  if (alias !== undefined) return alias;
  if (seg === '附录') return 'appendix';
  const m = seg.match(/^第(\d+|[一二三四五六七八九十]+)([章节])(?:$|[-\s])/);
  if (m) {
    const n = chineseNumber(m[1]);
    if (n !== null) return (m[2] === '章' ? 'ch' : 's') + n;
  }
  return null;
}

/** 含中文却没有别名的段落：同步结束时统一告警，免得默默生成又长又编码的 URL */
const unaliasedSegments = new Set();

function slugPart(seg) {
  const alias = aliasedSegment(seg);
  if (alias !== undefined && alias !== null) return alias;
  if (/[\u4e00-\u9fff]/.test(seg)) unaliasedSegments.add(seg);
  return slugify(seg);
}

function deriveSlug(category, vaultRelDir, title) {
  const parts = [slugify(category), ...vaultRelDir.split(path.sep).map(slugPart), slugPart(title)];
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

/**
 * 某个 vault 文件在 git 历史里的日期。
 * first=true 取「首次提交」（即文件被创建的提交），否则取最后一次。
 *
 * --follow 不能省：vault 侧改笔记标题会连带改文件名，而 git 看到的是一个新路径。
 * 不跟重命名的话，首次提交就落到「改名那一天」，网站上表现为这篇老笔记
 * 突然变成今天新发的文章（创建时间清单也按路径做键，同样会失配）。
 * --follow 只对单个 pathspec 生效，这里正好只传一个路径。
 */
function gitDate(vault, rel, first) {
  try {
    const args = ['-C', vault, 'log', '--follow', first ? '--diff-filter=A' : '-1', '--format=%aI', '--', rel];
    const out = execFileSync('git', args, { encoding: 'utf8' }).trim();
    return out.split('\n')[0] || null;
  } catch {
    return null;
  }
}

/**
 * git log 输出（每行一个作者日期）→ Map<YYYY-MM-DD, number>。
 * 两处提交统计共用同一套解析，避免一处按作者日期、另一处按别的格式对不上。
 */
function countCommitDays(out) {
  const days = new Map();
  for (const line of (out ?? '').trim() ? out.trim().split('\n') : []) {
    const day = line.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) days.set(day, (days.get(day) ?? 0) + 1);
  }
  return days;
}

/**
 * 每日提交数：统计 vault 历史中触及任一白名单根目录的提交，按作者日期计天。
 * 返回值 Map<YYYY-MM-DD, number>；vault 不是 git 仓库时返回空 Map。
 */
function vaultCommitActivity(vault, roots) {
  try {
    const args = ['-C', vault, 'log', '--format=%aI', '--', ...roots];
    return countCommitDays(execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
  } catch {
    /* 忽略：vault 无 git 历史时热力图数据为空 */
    return new Map();
  }
}

/**
 * 网站仓库自己的每日提交数：热力图上给这些日子描金框。
 * 不加 pathspec —— 网站仓库的每个提交都算「网站层面」的动作。
 * 坑：CI 里 actions/checkout 默认 fetch-depth: 1，只克隆一个提交，
 * 工作流里网站仓库那步必须 fetch-depth: 0，否则这里只数得到 1 天。
 */
function webCommitActivity(repo) {
  try {
    const args = ['-C', repo, 'log', '--format=%aI'];
    return countCommitDays(execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
  } catch {
    return new Map();
  }
}

/**
 * 网站仓库每日的提交主题：Map<YYYY-MM-DD, string[]>。
 * 用 %x1f（ASCII 单元分隔符）分隔日期与主题 —— 主题里有空格、中文、冒号，
 * 拿空格或制表符切都会切坏。只取首行（-s 的 subject），不取正文。
 */
function webCommitMessages(repo) {
  try {
    const args = ['-C', repo, 'log', '--format=%aI%x1f%s'];
    const out = execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const byDay = new Map();
    for (const line of out.split('\n')) {
      const [iso, subject] = line.split('\x1f');
      const day = (iso ?? '').slice(0, 10);
      const text = (subject ?? '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !text) continue;
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push(text);
    }
    return byDay;
  } catch {
    return new Map();
  }
}

/** 写一份 activity JSON；days 为空时保留旧文件，但必须出声（静默保留最难排查） */
async function writeActivityFile(file, days, warn) {
  if (days.size === 0) {
    console.warn(`warn: ${warn}，热力图数据未刷新（保留原文件）`);
    return;
  }
  const sorted = [...days.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(Object.fromEntries(sorted), null, 2) + '\n', 'utf8');
  console.log(`activity: ${sorted.length} 天 → ${path.relative(process.cwd(), file)}`);
}

async function writeActivity(vault, roots) {
  // vault 不可用/无 git 历史时保留旧数据：静默保留正是"热力图一直没更新"最难排查的形态
  await writeActivityFile(ACTIVITY, vaultCommitActivity(vault, roots), `${vault} 无可用 git 历史`);
  await writeActivityFile(WEB_ACTIVITY, webCommitActivity(WEB_REPO), `${WEB_REPO} 无可用 git 历史`);
  await writeActivityFile(WEB_COMMITS, webCommitMessages(WEB_REPO), `${WEB_REPO} 无可用 git 历史`);
}

function firstParagraph(body) {
  // 行间公式块先整体挖掉：公式内容（`F=-kx`、`a=-\omega^{2}x`）当摘要只是噪声，
  // 纯公式笔记（如物理公式总结）会因此只剩 "F kx" 这种没有信息量的描述。
  // 换成空格而不是换行，避免把"由式 $$a=b$$ 可知"这类行拆成两个片段。
  const prose = body.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  // 折叠 callout 转出来的 <details> 块整体跳过：里面是答案/「本节包含」这类附属内容，
  // 不该当摘要（物理笔记的折叠块正好在正文最前面，不跳过描述就会变成一段 HTML 标签）。
  let inFold = false;
  for (const line of prose.split(/\n+/)) {
    const trimmed = line.trim();
    if (/^<details\b/i.test(trimmed)) {
      inFold = true;
      continue;
    }
    if (/^<\/details>/i.test(trimmed)) {
      inFold = false;
      continue;
    }
    if (inFold) continue;
    if (!trimmed || trimmed.startsWith('>') || trimmed.startsWith('#') || trimmed.startsWith('```')) continue;
    const t = trimmed
      // 链接/图片只留文字：否则摘要会带上内部 slug，如 "Numpy 函数汇总 (/notes/machine and deep learning/python/numpy 函数汇总/)"
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*#>`|=\[\]$\\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (t) return t.length > 140 ? t.slice(0, 140) + '…' : t;
  }
  return '';
}

/**
 * Obsidian「可折叠 callout」→ 站点 `<details>`。
 *
 * 笔记里写 `> [!answer]- 答案`（`-` 默认收起 / `+` 默认展开），Obsidian 阅读视图
 * 会把它渲染成一个可点开的折叠块。站点这边必须**在 markdown 解析之前**把它变成
 * `<details>`/`<summary>`：这样块内的 markdown（真值表、列表、`$…$` 公式）仍按普通
 * markdown 解析，公式才照常交给 KaTeX —— 用户反馈的「公式渲染不出来」正是因为在
 * vault 里手写 `<details>` HTML 块时，块内内容不会被当成 markdown。
 *
 * 产出形如：
 *   <details class="answer">
 *   <summary><img class="callout-badge" …><strong>答案</strong></summary>
 *   （此处必须空一行，HTML 块到此结束，后面的 markdown 才会被解析）
 *   …被剥掉 `> ` 前缀的正文…
 *
 *   </details>
 *
 * 只处理「整块都在引用里」的折叠 callout：起始行顶格（允许缩进）为 `> [!类型]-/+`，
 * 后续行都以 `>` 开头（`>` 开头的新 callout 会被剥成新行，因此不会误吞下一个）。
 * 列表内的 callout（`- > [!note]`）与嵌套 callout（`> > [!x]`）不在这里处理，
 * 留给 convertBody 的逐行规则，行为与改动前一致（只是不折叠）。
 */
function foldCallouts(markdown) {
  const lines = markdown.split('\n');
  const out = [];
  const opener = /^\s*>\s*\[!([\w-]+)\]([+-])\s*(.*?)\s*$/;

  // 手工外层循环（不用 forEach）：内层要一次吃掉整个引用块，需要手动前进 i
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(opener);
    if (!m) {
      out.push(lines[i]);
      continue;
    }
    // 围栏内的 `> [!x]-` 只是代码示例，按原样输出
    let fences = 0;
    for (let k = 0; k < i; k++) if (/^\s*(?:>\s*)*(```|~~~)/.test(lines[k])) fences++;
    if (fences % 2 === 1) {
      out.push(lines[i]);
      continue;
    }

    const type = m[1].toLowerCase();
    const label = m[3] || type.charAt(0).toUpperCase() + type.slice(1);
    const body = [];
    let next = i + 1;
    for (; next < lines.length; next++) {
      const line = lines[next];
      // 紧跟着的下一个 callout 另起一块：不这样切的话，两个相邻（中间只有 `>` 空行）
      // 的答案会被并进同一个 details，展开一个连另一个也带出来
      if (/^\s*>\s*\[![\w-]+\]/.test(line)) break;
      if (/^\s*>/.test(line)) {
        body.push(line.replace(/^\s*>\s?/, ''));
        continue;
      }
      // 引用块里的空行常写成不带 `>` 的纯空行：算本文内容，继续吃它后面的引用行
      if (/^\s*$/.test(line) && next + 1 < lines.length && /^\s*>/.test(lines[next + 1])) {
        body.push('');
        continue;
      }
      break;
    }

    const cls = type === 'answer' ? 'answer' : 'callout-fold';
    // 去掉正文首尾的空行：分隔用的空行由下面统一补一条，
    // 否则正文本身的开头空行会再叠一条，产出里出现连续空行
    while (body.length > 0 && body[0] === '') body.shift();
    while (body.length > 0 && body[body.length - 1] === '') body.pop();
    const safeLabel = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // `**答案**` 不能用：summary 这一行处在 HTML 块里，不会被当成 markdown
    out.push(`<details class="${cls}"${m[2] === '+' ? ' open' : ''}>`);
    out.push(
      `<summary><img class="callout-badge" src="${SITE_BASE}/media/icons/${calloutIcon(type)}.svg" alt="${type}"><strong>${safeLabel}</strong></summary>`
    );
    out.push('');
    out.push(...body);
    out.push('');
    out.push('</details>');
    i = next - 1; // 内层已消费到 next，外层再 i++ 正好接上
  }
  return out.join('\n');
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
    // 折叠 callout（[!type]- / [!type]+）已由前面的 foldCallouts 整块转成 <details>，
    // 这里只兜住没被它接管的（列表内 / 嵌套引用里的），行为与改动前一致
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

    // 折叠块的 HTML 骨架必须顶格：它们是块级结构，不是列表项的续行。
    // 不拦住的话，折叠块正文以列表结尾时（如物理笔记的「本节包含」），
    // 紧跟的 </details> 会被当成惰性续行缩进 —— 缩进到 4 格就变成代码块，
    // 整个 details 收不了尾，后面整篇笔记都会被吞进折叠块里。
    if (/^<\/?(details|summary)\b/i.test(stripped)) {
      out.push(stripped);
      continue;
    }

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

/**
 * GFM 表格分隔行按表头格数补齐。
 *
 * Obsidian 阅读视图对「表头 5 格、分隔行只写 4 个 ---」的表是宽容的：照样渲染成表格。
 * 站点走 remark-gfm / CommonMark，分隔行格数与表头不一致时**整张表不成立**，
 * 退化成一段满是竖线的普通段落 —— 数电笔记里的卡诺图正好踩了这个坑：
 *
 *   | $A\backslash BC$ | 00 | 01 | 11 | 10 |
 *   | --- | --- | --- | --- |              ← 少一格，整张表作废
 *   | **0** | 0 | 0 | 1 | 1 |
 *
 * 两边的行为对齐到 Obsidian：按表头格数补 `---`（多则截断），已有的对齐写法
 * （`:---:`）原样保留。只在「上一行是表格行」且「本行整行只由 | - : 空格组成」
 * 时才动手，所以普通段落里的横线不会被误判成表格。
 */
function normalizeTableDelimiters(markdown) {
  const lines = markdown.split('\n');
  let inFence = false;

  /** 拆一行：引用前缀、是否带首尾竖线、各格内容（没有竖线时返回 null） */
  const parseRow = (line) => {
    // 不能用 /^(\s*...)(.*)$/：vault 里是混合换行，CRLF 文件按 '\n' 切开后每行尾部留着 \r，
    // 而 `.` 不匹配 \r、`$`（无 m 标志）又只在输入末尾成立 —— 整条正则直接不匹配、返回 null。
    // 前缀也只用空格/制表符，免得把行尾的 \r 吃进缩进里。
    const m = line.match(/^([ \t]*(?:>[ \t]*)*)([\s\S]*)$/);
    const body = m[2].trim();
    if (!body.includes('|')) return null;
    const lead = body.startsWith('|');
    const tail = body.endsWith('|');
    const parts = body
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((s) => s.trim());
    return { prefix: m[1], lead, tail, parts };
  };
  const isDelimiter = (parts) => parts.length > 0 && parts.every((p) => /^:?-+:?$/.test(p));

  for (let i = 0; i < lines.length; i++) {
    // 围栏状态必须从第 0 行开始翻转，否则「文件开头就是代码块」时整块样例都会被当成正文
    if (/^\s*(?:>\s*)*(```|~~~)/.test(lines[i])) inFence = !inFence;
    if (inFence || i === 0) continue;
    const delim = parseRow(lines[i]);
    if (!delim || !delim.lead || !delim.tail || !isDelimiter(delim.parts)) continue;
    const head = parseRow(lines[i - 1]);
    if (!head || isDelimiter(head.parts) || head.parts.length === delim.parts.length) continue;
    const parts = delim.parts.slice(0, head.parts.length);
    while (parts.length < head.parts.length) parts.push('---');
    lines[i] = `${delim.prefix}| ${parts.join(' | ')} |`;
  }
  return lines.join('\n');
}

function toYaml(o) {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
}

const CATEGORY_TAG = {
  CPP: 'cpp',
  English: 'english',
  'Machine & Deep Learning': 'machine-learning',
  Signals: 'signals',
  Physics: 'physics',
  Complex: 'complex',
};

async function main() {
  const summary = { published: 0, skipped: 0, errors: [] };

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
  const slugOwner = new Map();
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
      // slug 撞车必须在这里就炸：两篇笔记映射到同一个 slug 会互相覆盖产出文件，
      // 等于静默丢一篇（别名表把「第N章」压成 chN 之后，这个风险是真实存在的）。
      // 此处在清空输出目录之前，抛错只会中止这次同步，不会破坏已同步内容。
      const clash = slugOwner.get(slug);
      if (clash) {
        throw new Error(
          `slug 冲突：${file.rel} 与 ${clash} 都映射到 "${slug}"。` +
            '请在 scripts/slug-aliases.mjs 里给其中一个换一个代号。'
        );
      }
      slugOwner.set(slug, file.rel);
      const fmDate = parseDateStr(data.Date || data.Da || data.created || data.created_at);
      const nameDate = parseDateStr(basename);
      const date =
        nameDate ||
        fmDate ||
        createdDates[relPosix] ||
        gitDate(VAULT, file.rel, true) ||
        (await fs.stat(file.full)).birthtime.toISOString().slice(0, 10);
      // 创建时间（含时刻）：frontmatter → 清单 → 本机文件创建时间 → git 首次提交 → publishDate
      // CI 里 birthtime 是 checkout 时间而非写作时间，必须让位给 git 首次提交日期，
      // 否则每次构建都会把新笔记算成"今天创建"，热力图/归档日期全被拉到当天。
      const createdAt =
        parseDateStr(data.createdAt || data.created) ||
        (createdDates[relPosix] ? createdDates[relPosix] + 'T00:00:00Z' : null) ||
        (process.env.CI ? null : birthtimeIso) ||
        gitDate(VAULT, file.rel, true) ||
        date;
      // 更新时间只认 frontmatter 里的真实编辑时间（Time Things 的 updated_at）。
      // 不再回退到 git 末次提交：vault 是批量备份提交，回退会让几乎所有笔记都显示
      // "更新于 <最后一次备份日>"，热力图也会在备份日堆出与写作无关的高峰。
      const updated = parseDateStr(data.updated_at) || undefined;
      const tags = [
        ...(Array.isArray(data.tags) ? data.tags.map((t) => String(t).replace(/^#/, '')) : []),
        CATEGORY_TAG[category],
      ].filter(Boolean);
      candidates.push({ file, data, content, basename, title, category, dirBelow, slug, date, createdAt, updated, tags });
    }
  }

  // 每日提交数（热力图）：本地与 CI 都从 vault 完整历史重算；
  // CI 会 checkout fetch-depth: 0，本步在 vault 可用时总是可写（构建产物不入库）
  await writeActivity(VAULT, ROOTS);

  // 安全闸：vault 路径写错/未检出时一个候选都没有，此时绝不能清空已同步内容
  // （否则构建出空站点，且本地内容不可恢复）
  if (candidates.length === 0) {
    console.warn(`warn: 未在 ${VAULT} 找到任何可发布笔记，保留现有 ${OUT}，未做任何写入`);
    return;
  }

  // 已发布笔记索引：标题 / 文件名 → slug，未公开或不存在时保持纯文本
  const slugIndex = new Map();
  for (const n of candidates) {
    const key = n.basename.replace(/\.md$/i, '');
    if (!slugIndex.has(n.title)) slugIndex.set(n.title, n.slug);
    if (!slugIndex.has(key)) slugIndex.set(key, n.slug);
  }

  // 第二遍：先把每篇的正文与 frontmatter 全部算出来，再动输出目录。
  // 顺序很重要：下面第 3 步的 fs.rm 是这条流水线上唯一的破坏性操作，而转换本身
  // 是会抛错的（历史事故：CRLF 让拆行正则返回 null，脚本崩在写回途中，留下一个被
  // 清空了一半的 src/content/notes）。先算后删，任何转换错误都只中止这一次同步。
  const outputs = candidates.map((n) => {
    // 顺序：先整块吃掉折叠 callout（产出 <details>，块内 markdown 照常解析），
    // 再做双链/普通 callout 转换，最后才是公式与列表缩进规范化 —— 此时 callout 正文
    // 已经剥掉 `> ` 前缀，对这两个只看普通 markdown 的函数来说就是一段普通内容。
    const body = normalizeTableDelimiters(
      normalizeListIndent(normalizeObsidianMath(convertBody(foldCallouts(n.content), slugIndex)))
    ).replace(/^\s+/, '');
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
    return {
      file: path.join(OUT, ...n.slug.split('/')) + '.md',
      text: `---\n${toYaml(fm)}\n---\n\n${body}\n`,
    };
  });

  // 本地同步时刷新创建时间清单（CI 环境跳过，避免用检出时间覆盖）
  if (!process.env.CI) {
    await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
    await fs.writeFile(MANIFEST, JSON.stringify(manifestData, null, 2) + '\n', 'utf8');
  }

  // 候选确认、正文全部转换成功后才清空输出目录
  //（同时清掉被改名/取消发布的旧 slug）
  await fs.rm(OUT, { recursive: true, force: true });

  for (const out of outputs) {
    await fs.mkdir(path.dirname(out.file), { recursive: true });
    await fs.writeFile(out.file, out.text, 'utf8');
    summary.published++;
  }

  console.log(`published: ${summary.published}, skipped: ${summary.skipped}`);
  if (unaliasedSegments.size > 0) {
    console.warn(
      `warn: ${unaliasedSegments.size} 个段落还没有 ASCII 代号，URL 里会带中文（每字编码成 9 个字符）：\n` +
        [...unaliasedSegments].map((s) => `  ${s}`).join('\n') +
        '\n  修法：在 scripts/slug-aliases.mjs 里加一行「原文: 短代号」'
    );
  }
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
  // Time Things 格式串未替换时留下字面量 YY-：按上下文年份补全（回归：曾整条丢弃）
  assert(
    parseDateStr('YY-08-09T19:00:32', 2026) === '2026-08-09T19:00:32',
    'YY placeholder year from context',
    parseDateStr('YY-08-09T19:00:32', 2026),
    '2026-08-09T19:00:32'
  );
  assert(
    parseDateStr('YY-09-15T19:42:56') === `${new Date().getUTCFullYear()}-09-15T19:42:56`,
    'YY placeholder falls back to current year'
  );
  assert(parseDateStr('04-07-09') === '2004-07-09', 'numeric two-digit year untouched');
  assert(deriveSlug('CPP', 'Summaries', 'const-correctness') === 'cpp/summaries/const-correctness', 'slug path');
  // 中文书名号等标点 slugify 后不留连字符碎片（真的走中文兜底时才有意义，故直接测 slugify）
  assert(
    slugify('《物理学》下册公式总结') === '物理学-下册公式总结',
    'slug CJK punctuation',
    slugify('《物理学》下册公式总结'),
    '物理学-下册公式总结'
  );
  // 别名表命中 + 章节规则：中文字段一律换成 ASCII 代号，URL 里不再出现百分号编码
  assert(
    deriveSlug('Physics', '', '《物理学》下册公式总结') === 'physics/formulas-vol2',
    'leaf alias'
  );
  assert(
    deriveSlug('Signals', '数字电路与系统', '第3章 逻辑函数及其简化') === 'signals/dcs/ch3',
    'dir alias + chapter rule'
  );
  assert(
    deriveSlug('English', `Words Summary${path.sep}数学英语词汇`, 'Stage 1 - Early Elementary') ===
      'english/words-summary/math-vocab/stage-1-early-elementary',
    'aliased dir keeps ascii leaf'
  );
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
  // 表格分隔行按表头补格（数电笔记的卡诺图：表头 5 格、分隔行只写了 4 个 ---）
  assert(
    normalizeTableDelimiters('| A | B | C | D | E |\n| --- | --- | --- | --- |\n| 0 | 0 | 0 | 1 | 1 |') ===
      '| A | B | C | D | E |\n| --- | --- | --- | --- | --- |\n| 0 | 0 | 0 | 1 | 1 |',
    'table delimiter padded to header width'
  );
  // 已对齐的表原样不动（幂等）
  assert(
    normalizeTableDelimiters('| A | B |\n| :-: | --- |\n| 0 | 1 |') === '| A | B |\n| :-: | --- |\n| 0 | 1 |',
    'well-formed table untouched'
  );
  // 普通段落里的横线不许当成分隔行
  assert(
    normalizeTableDelimiters('说明 | 文字\n---\n正文') === '说明 | 文字\n---\n正文',
    'bare rule is not a table delimiter'
  );
  // 代码块里的表格样例不许改
  assert(
    normalizeTableDelimiters('```\n| A | B |\n| --- |\n```') === '```\n| A | B |\n| --- |\n```',
    'table inside fence untouched'
  );
  // CRLF：vault 里混着 CRLF 文件，行尾的 \r 不能让拆行正则失配（曾整脚本崩在中途）
  assert(
    normalizeTableDelimiters('| A | B | C |\r\n| --- | --- |\r\n| 1 | 2 | 3 |\r\n') ===
      '| A | B | C |\r\n| --- | --- | --- |\n| 1 | 2 | 3 |\r\n',
    'CRLF line endings do not break row parsing'
  );
  // URL 段落代号：字典序优先，其次是章节规则
  assert(aliasedSegment('数字电路与系统') === 'dcs', 'alias table wins');
  assert(aliasedSegment('第3章 逻辑函数及其简化') === 'ch3', 'arabic chapter');
  assert(aliasedSegment('第九章 振动 公式总结') === 'ch9', 'chinese chapter');
  assert(aliasedSegment('第十二章 气体动理论 公式总结') === 'ch12', 'chinese chapter >= 10');
  assert(aliasedSegment('第二十一章 x') === 'ch21', 'chinese chapter 21');
  assert(aliasedSegment('附录') === 'appendix', 'appendix');
  assert(aliasedSegment('第2章') === 'ch2', 'chapter with nothing after it');
  assert(aliasedSegment('关于第3章的内容') === null, 'chapter rule is anchored at the start');
  assert(aliasedSegment('第三次作业') === null, '第N 后面不是章/节就不算章节');
  assert(aliasedSegment('第1节 引言') === 's1', 'section');
  assert(aliasedSegment('没编号的中文标题') === null, 'unaliased returns null');
  // 别名表的值必须是纯 ASCII 片段，否则 URL 里照样会冒出百分号编码
  const badAlias = Object.entries(SEGMENT_ALIASES).find(
    ([key, value]) => !/^[a-z0-9][a-z0-9-]*$/.test(value)
  );
  assert(badAlias === undefined, 'alias values are ascii slugs', badAlias, undefined);

  // ---- 折叠 callout → <details> ----
  // 块内必须留成普通 markdown（空行 + 内容 + 空行）：公式、真值表、列表都靠这个
  const folded = foldCallouts('> [!answer]- 答案\n>\n> (1) $x=1$\n');
  assert(
    folded ===
      '<details class="answer">\n' +
        '<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer">' +
        '<strong>答案</strong></summary>\n' +
        '\n(1) $x=1$\n\n</details>\n',
    'fold callout becomes details',
    folded,
    '<details class="answer">…'
  );
  // `+` = 默认展开；引用里的表格行剥掉 `> ` 之后仍是表格（分隔行紧随表头，中间不能有空行）
  const opened = foldCallouts('> [!abstract]+ 本节包含\n> | a | b |\n> --- | ---\n> 1 | 2\n');
  assert(opened.startsWith('<details class="callout-fold" open>'), 'plus marker opens by default');
  assert(opened.includes('\n| a | b |\n--- | ---\n1 | 2\n'), 'quoted table is unquoted');
  // 引用块到最后一个引用行为止；紧跟着的下一个 callout 另起一块，不能被吞进这一层
  const chained = foldCallouts('> [!answer]- a\n> body\n> [!note] 普通 callout\n');
  assert(
    chained ===
      '<details class="answer">\n' +
        '<summary><img class="callout-badge" src="/media/icons/circled-check.svg" alt="answer">' +
        '<strong>a</strong></summary>\n' +
        '\nbody\n\n</details>\n' +
        '> [!note] 普通 callout\n',
    'next callout starts a new block',
    chained
  );
  // 列表内 / 嵌套引用里的折叠 callout 不在这里接管，原样交回 convertBody
  assert(foldCallouts('- > [!note]- x\n') === '- > [!note]- x\n', 'list callout left alone');
  assert(foldCallouts('> > [!note]- x\n') === '> > [!note]- x\n', 'nested callout left alone');
  // 代码块里的示例不能被改写
  assert(
    foldCallouts('```\n> [!answer]- 答案\n```\n') === '```\n> [!answer]- 答案\n```\n',
    'fenced sample untouched'
  );
  // 折叠块正文以列表结尾时，收尾的 </details> 不能被 normalizeListIndent 当成
  // 列表续行缩进（缩到 4 格会变代码块，整个 details 收不了尾、吞掉后面整篇笔记）
  assert(
    normalizeListIndent(foldCallouts('> [!abstract]- 本节\n> - a\n> - b\n')) ===
      '<details class="callout-fold">\n' +
        '<summary><img class="callout-badge" src="/media/icons/document.svg" alt="abstract">' +
        '<strong>本节</strong></summary>\n' +
        '\n- a\n- b\n\n</details>\n',
    'closing tag stays flush left after a list body',
    normalizeListIndent(foldCallouts('> [!abstract]- 本节\n> - a\n> - b\n'))
  );
  console.log('selftest ok');
}

async function activityOnly() {
  await writeActivity(VAULT, ROOTS);
  console.log(`activity: ${ACTIVITY}`);
  console.log(`activity: ${WEB_ACTIVITY}`);
  console.log(`activity: ${WEB_COMMITS}`);
}

if (process.argv.includes('--selftest')) selftest();
else if (process.argv.includes('--activity-only')) activityOnly();
else main();
