

<!-- dsh-openwolf:start -->
# Code Map
Generated 2026-09-24T14:07:47.720Z · 171 files · 21924 lines · 0.37s

## ./
- `CHANGES.md` — 585 lines · 第一阶段目标是忠实迁移，以下是相对原源码的全部偏离及原因。
- `README.md` — 295 lines · 基于 Astro + TypeScript 重建的个人主页（第一阶段：首页一比一迁移）。
- `astro.config.mjs` — 40 lines · export default defineConfig({
- `package-lock.json` — 0 lines · [file too large]
- `package.json` — 28 lines · izwarm
- `tsconfig.json` — 5 lines · {

## docs
- `docs/content-frontmatter.md` — 132 lines · > 目标：Obsidian 私有库 → 同步脚本 → Astro 站点。本文定义“公开笔记”在网站侧使用的

## public
- `public/avatar.svg` — 5 lines · <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="izwarm">

## public/favicon
- `public/favicon/favicon.png` — 0 lines · [binary]

## public/media
- `public/media/Obsidian-Loop-Dark.mp4` — 0 lines · [file too large]
- `public/media/Web_dexpand.mp3` — 0 lines · [file too large]
- `public/media/Web_expand.mp3` — 0 lines · [file too large]
- `public/media/a.png` — 0 lines · [binary]
- `public/media/afdian-izwarm.jpg` — 0 lines · [file too large]
- `public/media/ambient-loop.mp3` — 0 lines · [file too large]
- `public/media/bilibili.svg` — 1 lines · <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
- `public/media/iz.png` — 0 lines · [binary]
- `public/media/logo.png` — 0 lines · [binary]
- `public/media/m.png` — 0 lines · [binary]
- `public/media/netease-cloud-music.svg` — 7 lines · <?xml version="1.0" encoding="utf-8"?>
- `public/media/profile.jpg` — 0 lines · [binary]
- `public/media/r.png` — 0 lines · [binary]
- `public/media/video-cover-dark.jpg` — 0 lines · [file too large]
- `public/media/w.png` — 0 lines · [binary]

## public/media/icons
- `public/media/icons/LICENSE-Zest.txt` — 22 lines · Zest Free License
- `public/media/icons/bullhorn.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.442 2.603A1 …
- `public/media/icons/chat-bubble.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.127 22.2c.58…
- `public/media/icons/circled-check.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12a9 9 0 1 1 …
- `public/media/icons/circled-info.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3a9 9 0 1 0 …
- `public/media/icons/circled-question.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3a9 9 0 1 0 …
- `public/media/icons/circled-x.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12a9 9 0 1 1 …
- `public/media/icons/copy.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.293 3.293A1 1…
- `public/media/icons/document.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.293 1.293A1 1…
- `public/media/icons/lightbulb.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.221 10.778c.0…
- `public/media/icons/note.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5a1 1 0 0 0-1…
- `public/media/icons/tag.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 5a1 1 0 0 1 1…
- `public/media/icons/triangle-exclaimation.svg` — 0 lines · <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.752 2.111c-.…

## scripts
- `scripts/sync-obsidian.mjs` — 795 lines · ROOTS, SKIP_DIRS, _posArg, VAULT, OUT, MANIFEST · const ROOTS = ['CPP', 'English', 'Machine & Deep Learning', 'Signals/Signals & Systems'];

## src
- `src/content.config.ts` — 43 lines · notes, projects, works, collections · Defines a zod schema in content.config.ts

## src/components/common
- `src/components/common/PanelRail.astro` — 46 lines · interface Props {

## src/components/home
- `src/components/home/Landing.astro` — 107 lines · interface Props {

## src/components/notes
- `src/components/notes/ArchiveList.astro` — 56 lines · interface Props {
- `src/components/notes/ArticleSidebar.astro` — 60 lines · interface Props {
- `src/components/notes/NotesCalendar.astro` — 75 lines · interface Props {
- `src/components/notes/NotesRail.astro` — 38 lines · interface Props {
- `src/components/notes/NotesShell.astro` — 36 lines · const NOTES_STATES = ['home', 'article', 'archive', 'tags'];
- `src/components/notes/NotesSidebar.astro` — 18 lines · interface Props {
- `src/components/notes/NotesStats.astro` — 26 lines · interface Props {
- `src/components/notes/ProfileCard.astro` — 50 lines · <section class="notes-profile" aria-label="个人简介">
- `src/components/notes/SeriesExplorer.astro` — 22 lines · interface Props {
- `src/components/notes/SeriesNode.astro` — 29 lines · interface Props {

## src/config
- `src/config/commit-activity.json` — 29 lines · {
- `src/config/created-dates.json` — 93 lines · {
- `src/config/media.ts` — 33 lines · base, MEDIA_BASE, media · Exports MEDIA_BASE, media
- `src/config/site.ts` — 9 lines · site · Exports site

## src/content/notes/cpp/examples
- `src/content/notes/cpp/examples/examples.md` — 18 lines · title: "Examples"
- `src/content/notes/cpp/examples/去旅行.md` — 71 lines · title: "去旅行"
- `src/content/notes/cpp/examples/合并两个有序数组.md` — 106 lines · title: "合并两个有序数组"
- `src/content/notes/cpp/examples/复古游戏的-背包消耗-算法.md` — 226 lines · title: "复古游戏的“背包消耗”算法"
- `src/content/notes/cpp/examples/完全平方数计数.md` — 54 lines · title: "完全平方数计数"
- `src/content/notes/cpp/examples/数字反转.md` — 52 lines · title: "数字反转"
- `src/content/notes/cpp/examples/星际探测器状态引擎.md` — 249 lines · title: "星际探测器状态引擎"
- `src/content/notes/cpp/examples/智能网关数据解析器.md` — 290 lines · title: "智能网关数据解析器"
- `src/content/notes/cpp/examples/求第-n-位数字.md` — 104 lines · title: "求第 n 位数字"
- `src/content/notes/cpp/examples/温度转换.md` — 94 lines · title: "温度转换"
- `src/content/notes/cpp/examples/禁止在int乘int时不开long-long.md` — 87 lines · title: "禁止在int乘int时不开long long"

## src/content/notes/cpp/summaries
- `src/content/notes/cpp/summaries/cast.md` — 304 lines · title: "cast"
- `src/content/notes/cpp/summaries/cmath-pow.md` — 138 lines · title: "cmath pow()"
- `src/content/notes/cpp/summaries/const-correctness.md` — 207 lines · title: "const-correctness"
- `src/content/notes/cpp/summaries/cstdlib.md` — 196 lines · title: "cstdlib"
- `src/content/notes/cpp/summaries/function-pointers-and-lambda.md` — 227 lines · title: "function pointers & lambda"
- `src/content/notes/cpp/summaries/libraries.md` — 120 lines · title: "Libraries"
- `src/content/notes/cpp/summaries/multiple-return.md` — 117 lines · title: "Multiple Return"
- `src/content/notes/cpp/summaries/static.md` — 207 lines · title: "static"
- `src/content/notes/cpp/summaries/summaries.md` — 19 lines · title: "Summaries"
- `src/content/notes/cpp/summaries/vector-optimizing.md` — 77 lines · title: "Vector Optimizing"

## src/content/notes/cpp/tips
- `src/content/notes/cpp/tips/lambda.md` — 244 lines · title: "Lambda"
- `src/content/notes/cpp/tips/objects-on-stackandheap.md` — 62 lines · title: "Objects on Stack&Heap"
- `src/content/notes/cpp/tips/tips.md` — 21 lines · title: "Tips"
- `src/content/notes/cpp/tips/位运算.md` — 27 lines · title: "位运算"
- `src/content/notes/cpp/tips/逗号表达式.md` — 46 lines · title: "逗号表达式"

## src/content/notes/english
- `src/content/notes/english/english.md` — 23 lines · title: "English"

## src/content/notes/english/words-daily
- `src/content/notes/english/words-daily/wd-26-08-03.md` — 33 lines · title: "WD 26-08-03"
- `src/content/notes/english/words-daily/wd-26-08-04.md` — 29 lines · title: "WD 26-08-04"
- `src/content/notes/english/words-daily/wd-26-08-05.md` — 37 lines · title: "WD 26-08-05"
- `src/content/notes/english/words-daily/wd-26-08-06.md` — 17 lines · title: "WD 26-08-06"
- `src/content/notes/english/words-daily/wd-26-08-07.md` — 41 lines · title: "WD 26-08-07"
- `src/content/notes/english/words-daily/wd-26-08-08.md` — 18 lines · title: "WD 26-08-08"
- `src/content/notes/english/words-daily/wd-26-08-09.md` — 35 lines · title: "WD 26-08-09"
- `src/content/notes/english/words-daily/wd-26-08-10.md` — 17 lines · title: "WD 26-08-10"
- `src/content/notes/english/words-daily/wd-26-08-11.md` — 21 lines · title: "WD 26-08-11"
- `src/content/notes/english/words-daily/wd-26-08-12.md` — 16 lines · title: "WD 26-08-12"
- `src/content/notes/english/words-daily/wd-26-08-13.md` — 19 lines · title: "WD 26-08-13"
- `src/content/notes/english/words-daily/wd-26-08-14.md` — 21 lines · title: "WD 26-08-14"
- `src/content/notes/english/words-daily/wd-26-08-24.md` — 28 lines · title: "WD 26-08-24"
- `src/content/notes/english/words-daily/wd-26-08-26.md` — 16 lines · title: "WD 26-08-26"
- `src/content/notes/english/words-daily/wd-26-08-31.md` — 16 lines · title: "WD 26-08-31"
- `src/content/notes/english/words-daily/wd-26-09-02.md` — 18 lines · title: "WD 26-09-02"

## src/content/notes/english/words-summary/数学英语词汇
- `src/content/notes/english/words-summary/数学英语词汇/stage-1-early-elementary.md` — 108 lines · title: "Stage 1 - Early Elementary"
- `src/content/notes/english/words-summary/数学英语词汇/stage-10-math-language.md` — 83 lines · title: "Stage 10 - Math Language"
- `src/content/notes/english/words-summary/数学英语词汇/stage-2-upper-elementary.md` — 120 lines · title: "Stage 2 - Upper Elementary"
- `src/content/notes/english/words-summary/数学英语词汇/stage-3-pre-algebra.md` — 100 lines · title: "Stage 3 - Pre-Algebra"
- `src/content/notes/english/words-summary/数学英语词汇/stage-4-algebra-i.md` — 95 lines · title: "Stage 4 - Algebra I"
- `src/content/notes/english/words-summary/数学英语词汇/stage-5-geometry.md` — 93 lines · title: "Stage 5 - Geometry"
- `src/content/notes/english/words-summary/数学英语词汇/stage-6-algebra-ii-and-precalculus.md` — 110 lines · title: "Stage 6 - Algebra II & Precalculus"
- `src/content/notes/english/words-summary/数学英语词汇/stage-7-calculus.md` — 114 lines · title: "Stage 7 - Calculus"
- `src/content/notes/english/words-summary/数学英语词汇/stage-8-linear-algebra.md` — 91 lines · title: "Stage 8 - Linear Algebra"
- `src/content/notes/english/words-summary/数学英语词汇/stage-9-probability-and-statistics.md` — 107 lines · title: "Stage 9 - Probability & Statistics"
- `src/content/notes/english/words-summary/数学英语词汇/数学英语词汇.md` — 22 lines · title: "数学英语词汇"

## src/content/notes/machine-and-deep-learning/nndl
- `src/content/notes/machine-and-deep-learning/nndl/nndl-26-09-03-logistic回归练习.md` — 305 lines · title: "NNDL 26-09-03 Logistic回归练习"
- `src/content/notes/machine-and-deep-learning/nndl/nndl-26-09-08-前馈神经网络练习-第一部分.md` — 343 lines · title: "NNDL 26-09-08 前馈神经网络练习（第一部分）"
- `src/content/notes/machine-and-deep-learning/nndl/nndl-26-09-08-前馈神经网络练习-第二部分.md` — 395 lines · title: "NNDL 26-09-08 前馈神经网络练习（第二部分）"
- `src/content/notes/machine-and-deep-learning/nndl/nndl-26-09-16-卷积神经网络练习.md` — 685 lines · title: "NNDL 26-09-16 卷积神经网络练习"

## src/content/notes/machine-and-deep-learning/python
- `src/content/notes/machine-and-deep-learning/python/machine-and-deep-learning.md` — 39 lines · title: "Machine & Deep Learning"
- `src/content/notes/machine-and-deep-learning/python/numpy-scipy-复数总结.md` — 270 lines · title: "Numpy, Scipy 复数总结"
- `src/content/notes/machine-and-deep-learning/python/numpy-函数汇总.md` — 332 lines · title: "Numpy 函数汇总"
- `src/content/notes/machine-and-deep-learning/python/numpy-对话总结-i.md` — 2952 lines · title: "Numpy 对话总结 I"
- `src/content/notes/machine-and-deep-learning/python/numpy-对话总结-ii.md` — 175 lines · title: "Numpy 对话总结 II"
- `src/content/notes/machine-and-deep-learning/python/numpy-综合案例.md` — 257 lines · title: "Numpy 综合案例"
- `src/content/notes/machine-and-deep-learning/python/pandas-函数汇总.md` — 167 lines · title: "Pandas 函数汇总"
- `src/content/notes/machine-and-deep-learning/python/pandas-对话总结.md` — 157 lines · title: "Pandas 对话总结"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-i.md` — 268 lines · title: "Python 杂记 I"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-ii.md` — 159 lines · title: "Python 杂记 II"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-iii.md` — 261 lines · title: "Python 杂记 III"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-iv.md` — 219 lines · title: "Python 杂记 IV"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-v.md` — 125 lines · title: "Python 杂记 V"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-vi.md` — 455 lines · title: "Python 杂记 VI"
- `src/content/notes/machine-and-deep-learning/python/python-杂记-vii.md` — 301 lines · title: "Python 杂记 VII"
- `src/content/notes/machine-and-deep-learning/python/tensor-and-numpy-函数对比.md` — 342 lines · title: "Tensor & Numpy 函数对比"

## src/content/notes/signals/signals-and-systems
- `src/content/notes/signals/signals-and-systems/信号与系统阅读随记.md` — 869 lines · title: "信号与系统阅读随记"

## src/content/notes/signals/signals-and-systems/ss-qna
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-01.md` — 34 lines · title: "SS-QNA-01"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-02.md` — 80 lines · title: "SS-QNA-02"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-03.md` — 38 lines · title: "SS-QNA-03"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-04.md` — 29 lines · title: "SS-QNA-04"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-05.md` — 31 lines · title: "SS-QNA-05"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-06.md` — 55 lines · title: "SS-QNA-06"
- `src/content/notes/signals/signals-and-systems/ss-qna/ss-qna-07.md` — 64 lines · title: "SS-QNA-07"

## src/content/notes/signals/signals-and-systems/text-book
- `src/content/notes/signals/signals-and-systems/text-book/signals-and-system-总目录.md` — 36 lines · title: "Signals & System 总目录"
- `src/content/notes/signals/signals-and-systems/text-book/第一章-信号与系统概论.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第七章-离散时间信号与系统变换域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第三章-连续时间信号实频域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第二章-连续时间系统时域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第五章-连续时间信号与系统复频域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第六章-离散时间信号与系统时域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/第四章-连续时间系统实频域分析.md` — 0 lines · [file too large]
- `src/content/notes/signals/signals-and-systems/text-book/附录.md` — 440 lines · title: "附录"

## src/layouts
- `src/layouts/BaseLayout.astro` — 28 lines · interface Props {

## src/lib
- `src/lib/notes.ts` — 308 lines · Note, TocItem, baseUrl, url, noteUrl, creationTime · Exports Note, TocItem, baseUrl, url, noteUrl +23 more
- `src/lib/rehype-math-latex.mjs` — 39 lines · rehypeMathLatex, classes, parent, target, holder, index · Exports rehypeMathLatex, default function

## src/pages
- `src/pages/index.astro` — 16 lines · const notes = await getPublishedNotes();

## src/pages/about
- `src/pages/about/index.astro` — 14 lines · <BaseLayout title="About · izwarm">

## src/pages/notes
- `src/pages/notes/[...slug].astro` — 50 lines · export async function getStaticPaths() {
- `src/pages/notes/archive.astro` — 19 lines · const notes = await getPublishedNotes();
- `src/pages/notes/index.astro` — 16 lines · const notes = await getPublishedNotes();
- `src/pages/notes/tags.astro` — 30 lines · const notes = await getPublishedNotes();

## src/pages/notes/tags
- `src/pages/notes/tags/[tag].astro` — 27 lines · export async function getStaticPaths() {

## src/pages/projects
- `src/pages/pr…
(rendered map truncated at 16384 bytes)
<!-- dsh-openwolf:end -->
