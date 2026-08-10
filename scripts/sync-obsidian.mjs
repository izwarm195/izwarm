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

// ---------- 纯函数（可单测） ----------
const PREFIX_DATE = /^(?:CS|CE|WD|WS)\s+(\d{2})-(\d{2})-(\d{2})[\s:：]*(.*)$/;

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

function convertBody(body) {
  return body
    .replace(/```dataviewjs[\s\S]*?```/g, '')
    .replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/^>\s*\[!(\w+)\](.*)$/gm, (_, t, r) => `> **[${t}]**${r}`)
    .replace(/==([^=]+)==/g, '**$1**');
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
      const section = dirBelow ? dirBelow.split(path.sep).join('/') : undefined;
      const fmDate = parseDateStr(data.Date || data.Da);
      const nameDate = parseDateStr(basename);
      const date =
        nameDate ||
        fmDate ||
        gitDate(VAULT, file.rel, true) ||
        (await fs.stat(file.full)).birthtime.toISOString().slice(0, 10);
      const updated = parseDateStr(data.updated_at) || gitDate(VAULT, file.rel, false) || date;
      const tags = [
        ...(Array.isArray(data.tags) ? data.tags.map((t) => String(t).replace(/^#/, '')) : []),
        CATEGORY_TAG[category],
      ].filter(Boolean);
      const uniqueTags = [...new Set(tags)];
      const body = convertBody(content).replace(/^\s+/, '');
      const fm = {
        title,
        slug,
        description: data.description || firstParagraph(body) || undefined,
        publishDate: date,
        updatedDate: updated,
        tags: uniqueTags,
        series: dirBelow ? [category, ...dirBelow.split(path.sep)] : [category],
      };

      const outFile = path.join(OUT, ...slug.split('/')) + '.md';
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, `---\n${toYaml(fm)}\n---\n\n${body}\n`, 'utf8');
      summary.published++;
    }
  }

  console.log(`published: ${summary.published}, skipped: ${summary.skipped}`);
  for (const e of summary.errors) console.warn(`warn: ${e}`);
}

// ---------- 自检 ----------
function selftest() {
  const assert = (cond, msg) => {
    if (!cond) throw new Error('selftest failed: ' + msg);
  };
  assert(slugify('Machine & Deep Learning') === 'machine-and-deep-learning', 'slugify &');
  assert(slugify('第二章 连续时间系统时域分析') === '第二章-连续时间系统时域分析', 'slugify CJK');
  assert(deriveTitle('CS 26-07-09 const-correctness.md', {}) === 'const-correctness', 'title strip');
  assert(deriveTitle('WD 26-08-03.md', {}) === 'WD 26-08-03', 'title keep fallback');
  assert(parseDateStr('26-08-09T19:00:32') === '2026-08-09T19:00:32', 'date time');
  assert(parseDateStr('26-07-09') === '2026-07-09', 'date');
  assert(parseDateStr('YY-08-09T19:00:32') === null, 'broken template date ignored');
  assert(deriveSlug('CPP', 'Summaries', 'const-correctness') === 'cpp/summaries/const-correctness', 'slug path');
  console.log('selftest ok');
}

if (process.argv.includes('--selftest')) selftest();
else main();
