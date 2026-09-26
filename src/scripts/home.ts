/**
 * 首页脚本：由原 home.js（IIFE）忠实迁移至 TypeScript。
 *
 * 说明：
 * - 保持原有 DOM 查询、GSAP 时间线、缓动、延迟、坐标与状态判断不变；
 * - 仅增加元素空值检查与 TypeScript 类型标注（大纲第六节要求）；
 * - GSAP 由 CDN 全局脚本改为 npm 包导入（版本同为 3.12.5）。
 */
import { gsap } from 'gsap';
import { currentPageKey, loadPageIntoPanel, PAGE_TARGETS } from './panel-nav';

declare global {
  interface Window {
    izwarmSetTheme?: (theme: 'dark' | 'light') => void;
    /** 右栏宽度基准（调试用）：W 图显示宽度，所有字母右栏统一使用 */
    __izRailRefW?: number;
    __izSizes?: {
      izW: number;
      izH: number;
      gap: number;
      sizes: Record<string, { w: number; h: number }>;
      positions: Record<string, { x: number; y: number; label: string }>;
    };
  }
}

type SeamlessAudio = HTMLAudioElement & { _queued?: boolean };
type PositionMap = Record<string, { x: number; y: number; label: string }>;
type PanelState = { wx: number; wy: number; l: number; t: number; r: number; b: number };

const RAIL_GAP = 20; // 与 CSS --rail-gap 一致：W 距底板右/上边缘的间距
const PANEL_RING = 10; // 初始小底板比 W 大出的一圈
const siteBase = import.meta.env.BASE_URL.replace(/\/$/, ''); // 子路径部署（ASTRO_BASE）时前缀

/** 窄屏断点，与 home.css / notes.css 的 @media (max-width: 900px) 保持一致 */
const MOBILE_MAX = 900;

/**
 * 手机布局：右栏不是一条竖直窄栏，而是底部工具栏。
 * 三段式「竖直条 → 右移铺开」的转场没有落点，字母也无处驻留（会压在正文上），
 * 因此窄屏走 openPanelMobile 的简化路径；桌面端逻辑完全不变。
 */
function isMobileLayout(): boolean {
  return window.innerWidth <= MOBILE_MAX;
}

function setRailVars(wW: number, wH: number): void {
  const shell = document.querySelector<HTMLElement>('.notes-shell');
  if (shell) {
    shell.style.setProperty('--w-size', wW + 'px');
    shell.style.setProperty('--w-size-h', wH + 'px');
  }
}

// 底板动画期间的轻量方向模糊（只加类与 CSS 变量，不在每帧计算 blur）
function setPanelMotion(axis: 'horizontal' | 'vertical' | null, direction: 1 | -1 = 1): void {
  if (!notesPanel) return;
  notesPanel.classList.toggle('is-panel-moving', axis !== null);
  notesPanel.classList.toggle('is-horizontal', axis === 'horizontal');
  notesPanel.classList.toggle('is-vertical', axis === 'vertical');
  notesPanel.style.setProperty('--motion-shadow-x', axis === 'horizontal' ? `${direction * 18}px` : '0px');
  notesPanel.style.setProperty('--motion-shadow-y', axis === 'vertical' ? `${direction * 18}px` : '0px');
  notesPanel.style.setProperty('--content-drift-x', axis === 'horizontal' ? `${direction * -5}px` : '0px');
  notesPanel.style.setProperty('--content-drift-y', axis === 'vertical' ? `${direction * -5}px` : '0px');
}

const LETTER_KEYS = ['w', 'a', 'r', 'm'] as const;

// 右栏统一宽度基准：W 与 M 同宽（最宽，显示宽约 82px），A / R 较窄。
// 右栏宽度、锚点中心与菜单链接宽度都用该基准，保证四个字母的右栏视觉一致，
// 窄字母不再整体偏右。图片未加载完成时 rect 宽为 0，取不到时用兜底值；
// window load 后图片就绪，会按真实宽度重新定位（见底部 load 监听）
let railRefW = 66;
function getRailRefW(): number {
  const wRef = document.getElementById('letter-w');
  const w = wRef?.getBoundingClientRect().width;
  if (w && w > 0) railRefW = w;
  return railRefW;
}

// 显式锁定字母的中心锚定（xPercent / yPercent = -50）。
// GSAP 从 CSS translate(-50%,-50%) 推断 xPercent 时依赖元素 offsetWidth：
// 若字母图片尚未加载（offsetWidth=0），matrix 的 x 为 0，会被错误推断为 0 并缓存，
// 字母从此失去“以视口中心为锚点”的定位（A/R 图较小加载较晚，先于 M/W 出问题）。
// 显式设置让锚定与图片加载时机无关；yPercent 因 CSS max-height 固定高而幸存。
LETTER_KEYS.forEach(function (k) {
  const el = document.getElementById('letter-' + k);
  if (el) gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
});
{
  const izEl = document.getElementById('letter-iz');
  if (izEl) gsap.set(izEl, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
}

const bgVideo = document.getElementById('bgVideo') as HTMLVideoElement | null;
const sfxExpand = document.getElementById('sfxExpand') as HTMLAudioElement | null;
const sfxCollapse = document.getElementById('sfxCollapse') as HTMLAudioElement | null;

// ===== 视频播放可靠性 =====
function startVideo(v: HTMLVideoElement): void {
  if (v.dataset.started) return;
  v.dataset.started = '1';
  v.classList.add('loaded');
  v.play().catch(function () {});
}

if (bgVideo) {
  if (bgVideo.readyState >= 2) {
    startVideo(bgVideo);
  }
  bgVideo.addEventListener('loadeddata', function () {
    startVideo(bgVideo);
  });
  bgVideo.addEventListener('canplay', function () {
    startVideo(bgVideo);
  });
  bgVideo.addEventListener('pause', function () {
    if (!bgVideo.ended && document.visibilityState === 'visible') {
      bgVideo.play().catch(function () {});
    }
  });

  setTimeout(function () {
    if (bgVideo.paused && bgVideo.readyState >= 1) {
      startVideo(bgVideo);
    }
  }, 1500);

  document.addEventListener(
    'click',
    function vidOnce() {
      if (bgVideo.paused) bgVideo.play().catch(function () {});
    },
    { once: true }
  );
}

// ===== 主逻辑 =====
const landing = document.getElementById('landing') as HTMLElement | null;
const soundToggle = document.getElementById('soundToggle') as HTMLElement | null;
const iconOnEl = document.getElementById('soundIconOn') as HTMLElement | null;
const iconOffEl = document.getElementById('soundIconOff') as HTMLElement | null;
const bgmA = document.getElementById('bgmA') as HTMLAudioElement | null;
const bgmB = document.getElementById('bgmB') as HTMLAudioElement | null;
const notesPanel = document.getElementById('notesPanel') as HTMLElement | null;

// ===== 加载动画：复用首页真实 logo/小字，进度线绕 logo 一圈，音视频就绪后淡出 =====
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingProgress = document.getElementById('loadingProgress') as SVGPathElement | null;
const loadingFrameSvg = document.getElementById('loadingFrameSvg') as SVGSVGElement | null;
const introText = document.getElementById('introText') as HTMLElement | null;
const introOriginalHtml = introText?.innerHTML ?? '';
// 窄屏把这段开场仪式缩短：背景视频 5.8MB，蜂窝网络下等 canplay 太久，
// 而 <video poster> 已经保证首屏不空白，所以元数据就绪即放行。
const LOADING_MOBILE = isMobileLayout();
const LOADING_MIN_MS = LOADING_MOBILE ? 700 : 1200; // 最短展示时间，避免一闪而过
const LOADING_MAX_MS = LOADING_MOBILE ? 3000 : 20000; // 兜底上限
const loadingStartedAt = performance.now();
let loadingShown = 0;
let loadingFinished = false;

// 进度框几何：绕中央 logo 一大圈，底边穿过小字垂直中心（1:1 viewBox，像素坐标）
let frameGeom: { left: number; top: number; right: number; bottom: number; r: number } | null = null;

function framePathD(textLeft: number, textRight: number): string {
  const g = frameGeom;
  if (!g) return '';
  // viewBox 为框的局部坐标（0,0 → 宽,高），所有坐标需减去框左上角
  const m = 8; // 首尾端距小字左右端的一小段距离
  const R = g.right - g.left;
  const B = g.bottom - g.top;
  const sx = Math.max(8, textLeft - g.left - m);
  const ex = Math.min(R - 8, textRight - g.left + m);
  const r = g.r;
  return [
    `M ${sx} ${B}`,
    `L 0 ${B}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `L ${R - r} 0`,
    `A ${r} ${r} 0 0 1 ${R} ${r}`,
    `L ${R} ${B - r}`,
    `A ${r} ${r} 0 0 1 ${R - r} ${B}`,
    `L ${ex} ${B}`,
  ].join(' ');
}

function buildFrameGeom(): void {
  const logo = document.getElementById('logoFull');
  if (!logo || !introText || !loadingFrameSvg || !loadingProgress) return;
  const lr = logo.getBoundingClientRect();
  const tr = introText.getBoundingClientRect();
  const centerX = lr.left + lr.width / 2;
  const frameW = Math.min(Math.max(lr.width + 190, tr.width + 120), window.innerWidth - 60);
  const left = centerX - frameW / 2;
  const top = lr.top - 68;
  const right = centerX + frameW / 2;
  const bottom = tr.top + tr.height / 2;
  frameGeom = { left, top, right, bottom, r: 18 };
  loadingFrameSvg.setAttribute('viewBox', `0 0 ${right - left} ${bottom - top}`);
  loadingFrameSvg.style.width = right - left + 'px';
  loadingFrameSvg.style.height = bottom - top + 'px';
  loadingFrameSvg.style.left = left + 'px';
  loadingFrameSvg.style.top = top + 'px';
  loadingProgress.setAttribute('d', framePathD(tr.left, tr.right));
}

function setLoadingProgress(p: number): void {
  if (loadingProgress) loadingProgress.style.strokeDashoffset = String(1000 * (1 - p));
  const pct = Math.round(p * 100) + '%';
  if (introText && introText.textContent !== pct) {
    introText.textContent = pct;
    const tr = introText.getBoundingClientRect();
    if (loadingProgress && frameGeom) loadingProgress.setAttribute('d', framePathD(tr.left, tr.right));
  }
}

// 加载目标：视频能起播（canplay）即视为就绪。
// 不再等待整段视频缓冲完（原按 buffered 比例可能拖到 6MB 全量下载），
// 也不等 BGM（自动播放策略下首屏本来就播不了音乐，preload=none 之后不会提前下载）。
function loadingTarget(): number {
  if (!bgVideo) return 1;
  if (bgVideo.error) return 1;
  if (LOADING_MOBILE) {
    if (bgVideo.readyState >= 2) return 1;
    return bgVideo.readyState >= 1 ? 0.85 : 0.45;
  }
  if (bgVideo.readyState >= 3) return 1;
  if (bgVideo.readyState >= 2) return 0.85;
  if (bgVideo.readyState >= 1) return 0.6;
  return 0.4;
}

function finishLoading(): void {
  if (loadingFinished || !loadingOverlay) return;
  loadingFinished = true;
  setLoadingProgress(1);
  landing?.classList.remove('is-loading');
  // 小字淡出，恢复原文
  if (introText) {
    introText.classList.add('loading-swap');
    window.setTimeout(() => {
      if (!introText) return;
      introText.innerHTML = introOriginalHtml;
      introText.classList.remove('loading-swap');
    }, 320);
  }
  loadingOverlay.classList.add('done');
}

function tickLoading(): void {
  if (loadingFinished || !loadingOverlay) return;
  const target = Math.max(loadingShown, loadingTarget());
  loadingShown += (target - loadingShown) * 0.14;
  if (Math.abs(target - loadingShown) < 0.003) loadingShown = target;
  setLoadingProgress(loadingShown);
  const minElapsed = performance.now() - loadingStartedAt >= LOADING_MIN_MS;
  if (target >= 1 && minElapsed) {
    finishLoading();
    return;
  }
  requestAnimationFrame(tickLoading);
}

if (loadingOverlay && introText) {
  landing?.classList.add('is-loading');
  buildFrameGeom();
  // 小字先淡出原文，再渐入为百分比
  introText.classList.add('loading-swap');
  window.setTimeout(() => {
    if (!introText) return;
    introText.textContent = '0%';
    introText.classList.remove('loading-swap');
    buildFrameGeom(); // 底边重新对齐到百分比文字的中心
    requestAnimationFrame(tickLoading);
  }, 320);
  bgVideo?.addEventListener('error', finishLoading);
  // 兜底：异常情况下最多等 LOADING_MAX_MS，避免一直卡在加载页
  window.setTimeout(finishLoading, LOADING_MAX_MS);
}

let expanded = false;
let isAnimating = false;
let panelOpen = false; // 底板是否已铺开（含动画完成 or 直接访问）
/** 底板是在窄屏布局下打开的：用于跨断点（横竖屏 / 窗口拉宽）判断是否需要重载 */
let openedOnMobile = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 当前面板字母（w/a/r/m）：直接访问由 URL 推断，slide 转场后由目标页决定
let currentKey: 'w' | 'a' | 'r' | 'm' = currentPageKey();

// 直接访问面板路由：底板初始已打开，屏蔽背景点击，避免触发主页动画
if (notesPanel?.classList.contains('active')) {
  panelOpen = true;
  openedOnMobile = isMobileLayout();
  panelOpenInit(currentKey);
}

// ===== 工具函数 =====
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getViewMetrics(): { vw: number; vh: number; cx: number; cy: number; margin: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // 手机端底板是「贴左/右/上留一道窄边 + 底边齐屏」（见 home.css 窄屏区块），
  // 对应的 margin 就是那一道窄边：10px。
  return { vw, vh, cx: vw / 2, cy: vh / 2, margin: isMobileLayout() ? 10 : clamp(vw * 0.025, 20, 44) };
}

function navigateTo(target: string): void {
  window.location.href = siteBase + '/' + target + '/';
}

function collapseLetters(dur: number): void {
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      opacity: 0,
      duration: dur,
      ease: 'power3.inOut',
      filter: reduceMotion ? 'none' : 'blur(4px)',
    });
  });
  gsap.to('#letter-iz', { opacity: 0, duration: dur * 0.7, ease: 'power2.in' });
}

function applyPanel(wEl: HTMLElement, notesPanel: HTMLElement, p: PanelState): void {
  gsap.set(wEl, { x: p.wx, y: p.wy });
  notesPanel.style.left = p.l + 'px';
  notesPanel.style.top = p.t + 'px';
  notesPanel.style.width = Math.max(0, p.r - p.l) + 'px';
  notesPanel.style.height = Math.max(0, p.b - p.t) + 'px';
}


// 计算四个字母的展开位（与 expandLogo 同一套公式；返回 null 表示元素缺失）
function computeLetterPositions(): {
  positions: PositionMap;
  sizes: Record<string, { w: number; h: number }>;
  izW: number;
  izH: number;
  gap: number;
} | null {
  const izEl = document.getElementById('letter-iz') as HTMLElement | null;
  if (!izEl) return null;
  const izRect = izEl.getBoundingClientRect();
  const izW = izRect.width;
  const izH = izRect.height;
  const gap = 6;

  const sizes: Record<string, { w: number; h: number }> = {};
  for (let i = 0; i < LETTER_KEYS.length; i++) {
    const el = document.getElementById('letter-' + LETTER_KEYS[i]);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    sizes[LETTER_KEYS[i]] = { w: r.width, h: r.height };
  }

  const positions: PositionMap = {
    w: { x: -(izW / 2 + sizes.w.w / 2 + gap + 3), y: -(izH / 2 + sizes.w.h / 2 + gap), label: 'label-w' },
    // A / R 在 x 上还原“左上角锚定”的既有中心：原站（字母图片加载晚，GSAP 把
    // xPercent 错误推断为 0，左上角锚定）下字母实际中心 = 公式 x + 宽/2。
    // 显式锁定中心锚定后，A 补回半宽（x = izW/2 + a.w + gap - 30）；
    // R 的 x 为负，补回半宽后 r.w 恰好消去（x = -(izW/2 + gap + 24)）。
    // W / M 的 xPercent 原就正确，公式不变。
    a: { x: izW / 2 + sizes.a.w + gap - 30, y: -(izH / 2 + sizes.a.h / 2 + gap), label: 'label-a' },
    r: { x: -(izW / 2 + gap + 24), y: izH / 2 + sizes.r.h / 2 + gap, label: 'label-r' },
    m: { x: izW / 2 + sizes.m.w / 2 + gap, y: izH / 2 + sizes.m.h / 2 + gap, label: 'label-m' },
  };
  return { positions, sizes, izW, izH, gap };
}

// ===== 字母光效：展开反色闪、悬停发光、按下变主题青 =====
const LETTER_FX: Record<string, { flash: number; glow: number; pressed: boolean }> = {
  w: { flash: 1, glow: 0, pressed: false },
  a: { flash: 1, glow: 0, pressed: false },
  r: { flash: 1, glow: 0, pressed: false },
  m: { flash: 1, glow: 0, pressed: false },
};

// 悬停发光仅在字母处于可交互位（主页 expanded / Notes 底板打开）且无动画时生效
function letterFxCanGlow(): boolean {
  return !isAnimating && (expanded || panelOpen);
}

// 由 flash / glow / pressed 三个状态合成当前 filter：反色相位决定发光颜色
function refreshLetterFx(key: string): void {
  const el = document.getElementById('letter-' + key) as HTMLElement | null;
  if (!el) return;
  const s = LETTER_FX[key];
  if (s.pressed) {
    el.style.filter = 'url(#izwarm-teal)';
    return;
  }
  const inv = 1 - s.flash;
  const bright = s.flash; // 闪光起点 brightness(0)=纯黑，随 flash 进度逐渐变亮回原色
  const glowColor = s.flash < 0.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.5)';
  const label = document.getElementById('label-' + key) as HTMLElement | null;
  if (label) label.style.setProperty('--glow-color', glowColor);
  const glowPx = s.glow * 10;
  el.style.filter =
    glowPx > 0.3
      ? `invert(${inv.toFixed(3)}) brightness(${bright.toFixed(3)}) drop-shadow(0 0 ${glowPx.toFixed(1)}px ${glowColor})`
      : `invert(${inv.toFixed(3)}) brightness(${bright.toFixed(3)})`;
}

/** 展开完成后的反色闪：瞬间反色（变黑），约 1.5s 逐渐变亮回原色 */
function flashLetterFx(key: string): void {
  if (reduceMotion) return;
  const s = LETTER_FX[key];
  gsap.killTweensOf(s, 'flash');
  s.flash = 0;
  refreshLetterFx(key);
  gsap.to(s, {
    flash: 1,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => refreshLetterFx(key),
  });
}

function setLetterGlow(key: string, on: boolean): void {
  const s = LETTER_FX[key];
  gsap.killTweensOf(s, 'glow');
  gsap.to(s, {
    glow: on ? 1 : 0,
    duration: 0.22,
    ease: 'power1.out',
    onUpdate: () => refreshLetterFx(key),
  });
}

function setLetterPressed(key: string, pressed: boolean): void {
  const s = LETTER_FX[key];
  s.pressed = pressed;
  refreshLetterFx(key);
}

// 直接访问面板路由：把当前字母定位到右栏（与滑动转场终点一致），保留为交互锚点
function panelOpenInit(key: 'w' | 'a' | 'r' | 'm'): void {
  if (!notesPanel) return;
  notesPanel.classList.add('is-settled');
  const el = document.getElementById('letter-' + key) as HTMLElement | null;
  if (!el) return;
  const { vw, margin } = getViewMetrics();
  const r = el.getBoundingClientRect();
  const wH = r.height;
  setRailVars(getRailRefW(), wH);
  // 窄屏：右栏是底部工具栏，字母没有驻留位（留在屏幕中间会压住正文）。
  // 返回首页由工具栏里的 .rail-home 字母按钮承担，这里让字母保持隐藏。
  if (isMobileLayout()) return;
  // 字母在右栏内水平 + 垂直居中（右栏宽度统一），右边缘距底板右缘 rail-gap
  gsap.set(el, {
    x: vw / 2 - margin - RAIL_GAP - getRailRefW() / 2,
    y: 0,
    opacity: 1,
  });
  el.style.pointerEvents = 'auto';
}

function expandLogo(opts: { silent?: boolean } = {}): void {
  if (expanded || isAnimating) return;
  // 展开音效：重置进度 + 播放（程序化展开——如「返回首页」带 ?letters=1 落地——静音）
  if (sfxExpand && !opts.silent) {
    sfxExpand.currentTime = 0;
    sfxExpand.play().catch(function () {});
  }
  isAnimating = true;
  expanded = true;
  landing?.classList.add('expanded');

  const dur = reduceMotion ? 0.4 : 1.1;
  const ease = reduceMotion ? 'power1.out' : 'power4.out';

  gsap.to('#logoFull', { opacity: 0, duration: 0.4, ease: 'power2.out' });
  gsap.fromTo(
    '#letter-iz',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
  );

  setTimeout(function () {
    const data = computeLetterPositions();
    if (!data) return;
    const { positions, sizes, izW, izH, gap } = data;

    window.__izSizes = { izW, izH, gap, sizes, positions };

    const totalKeys = LETTER_KEYS.length;
    let completed = 0;

    LETTER_KEYS.forEach(function (key, i) {
      const el = document.getElementById('letter-' + key);
      if (!el) {
        completed++;
        return;
      }
      const p = positions[key];
      gsap.fromTo(
        el,
        { x: 0, y: 0, opacity: 0, filter: 'none' },
        {
          x: p.x,
          y: p.y,
          opacity: 1,
          filter: 'none',
          duration: dur,
          delay: i * 0.05,
          ease,
          onComplete: function () {
            flashLetterFx(key);
            const label = document.getElementById(p.label);
            if (label) {
              label.classList.add('show');
              positionLabel(el, label, key);
            }
            completed++;
            if (completed >= totalKeys) isAnimating = false;
          },
        }
      );
    });
  }, 350);
}

function collapseAll(): void {
  if (!expanded || isAnimating) return;
  // 收回音效
  if (sfxCollapse) {
    sfxCollapse.currentTime = 0;
    sfxCollapse.play().catch(function () {});
  }
  isAnimating = true;
  expanded = false;
  landing?.classList.remove('expanded');
  const dur = reduceMotion ? 0.3 : 0.6;

  collapseLetters(dur);

  LETTER_KEYS.forEach(function (key) {
    const label = document.getElementById('label-' + key);
    if (label) label.classList.remove('show');
  });
  gsap.to('#logoFull', {
    opacity: 1,
    duration: dur,
    delay: dur * 0.3,
    ease: 'power2.out',
    onComplete: function () {
      isAnimating = false;
    },
  });
}

function positionLabel(letterEl: HTMLElement | null, labelEl: HTMLElement | null, key: string): void {
  if (!labelEl || !letterEl) return;
  const r = letterEl.getBoundingClientRect();
  // 窄屏：原来的固定偏移（左移 50~90px / 右移 50~80px）会把标签推出屏幕，
  // 改成在字母正上/正下方居中，并把中心夹在屏内，字号交给 .corner-label。
  if (isMobileLayout()) {
    const vw = window.innerWidth;
    const above = key === 'w' || key === 'a'; // W/A 在上排，R/M 在下排
    const cx = clamp(r.left + r.width / 2, 38, vw - 38);
    labelEl.style.cssText =
      `left:${cx}px;top:${above ? r.top - 6 : r.bottom + 6}px;` +
      `transform:translate(-50%,${above ? '-100%' : '0'});text-align:center`;
    return;
  }
  switch (key) {
    case 'w':
      labelEl.style.cssText = `left:${r.left - 50}px;top:${r.top}px;transform:translate(0%,-100%);text-align:left`;
      break;
    case 'a':
      labelEl.style.cssText = `left:${r.right + 80}px;top:${r.top}px;transform:translate(-100%,-100%);text-align:right`;
      break;
    case 'r':
      labelEl.style.cssText = `left:${r.left - 90}px;top:${r.bottom}px;transform:translate(0%,0%);text-align:left`;
      break;
    case 'm':
      labelEl.style.cssText = `left:${r.right + 50}px;top:${r.bottom}px;transform:translate(-100%,0%);text-align:right`;
      break;
  }
}

/**
 * 窄屏打开底板：右栏在手机上是底部工具栏，「竖直条 → 右移铺开」那套转场没有落点，
 * 字母也没有可驻留的位置（留在屏幕中部会压在正文上）。所以这里改成
 * 「字母与小字淡出 + 底板整屏淡入」，几何完全交给 CSS（见 home.css 窄屏区块），
 * 返回首页交给工具栏里的 .rail-home 字母按钮。桌面端三段式动画不受影响。
 */
function openPanelMobile(key: 'w' | 'a' | 'r' | 'm'): void {
  if (!notesPanel) {
    navigateTo(PAGE_TARGETS[key]);
    return;
  }
  isAnimating = true;
  panelOpen = true;
  openedOnMobile = true;
  currentKey = key;
  // 手机端点击字母不播音效（用户明确要求）：底板淡入本身就是反馈，声音在触屏上只觉得吵
  landing?.classList.add('expanded'); // 底板打开态：大 Logo 与中心小字退场
  // autoAlpha：同时置 visibility:hidden，字母不再拦截触摸
  gsap.to('#logoStage', { autoAlpha: 0, duration: 0.24, ease: 'power1.out' });
  gsap.to('#introText', { autoAlpha: 0, duration: 0.18, ease: 'power1.out' });

  // 动画开始即拉取目标页（与桌面端一致：换页在底板淡入期间完成）
  const pageLoad = loadPageIntoPanel(PAGE_TARGETS[key], false);
  notesPanel.classList.add('active', 'is-settled');
  isAnimating = false;

  void pageLoad.then(function () {
    history.pushState({ page: key }, '', siteBase + PAGE_TARGETS[key]);
  });
}

// 字母 → 面板：三段式滑动（竖直移动 → 水平右移）+ 磨砂底板延展。
// W/A 起点在 iz 上方（先下坠到中央），R/M 起点在 iz 下方（先上移到中央）——
// 同一套坐标公式自动对称；水平段所有字母一致，终点在右栏内水平 + 垂直居中。
function slideLetterToPanel(key: 'w' | 'a' | 'r' | 'm'): void {
  if (isAnimating || panelOpen) return;
  const el = document.getElementById('letter-' + key) as HTMLElement | null;
  if (!el || !notesPanel) {
    navigateTo(PAGE_TARGETS[key]);
    return;
  }
  // 窄屏：右栏是底部工具栏，三段式滑动没有落点，字母也无处驻留（见 openPanelMobile）
  if (isMobileLayout()) {
    openPanelMobile(key);
    return;
  }
  isAnimating = true;
  panelOpen = true; // 进入底板打开流程（含动画中），期间忽略背景点击

  if (reduceMotion) {
    navigateTo(PAGE_TARGETS[key]);
    return;
  }

  const { vw, vh, cx, cy, margin } = getViewMetrics();

  // 其余字母、标签、iz 淡出
  LETTER_KEYS.forEach(function (k) {
    if (k === key) return;
    const other = document.getElementById('letter-' + k);
    if (other) {
      other.style.pointerEvents = 'none'; // 隐藏后不可点击，避免误触跳转
      gsap.to(other, { opacity: 0, duration: 0.35, ease: 'power2.in', filter: 'blur(4px)' });
    }
  });
  LETTER_KEYS.forEach(function (k) {
    const label = document.getElementById('label-' + k);
    if (label) label.classList.remove('show');
  });
  gsap.to('#letter-iz', { opacity: 0, duration: 0.35, ease: 'power2.in' });

  const startWx = Number(gsap.getProperty(el, 'x'));
  const startWy = Number(gsap.getProperty(el, 'y'));
  const r = el.getBoundingClientRect();
  const wH = r.height;
  setRailVars(getRailRefW(), wH);

  // 动画开始即发起目标页拉取（所有字母统一）。动画第一段（is-rail-seed）
  // 左/中栏不可见，替换在第二段淡入前完成，视觉无缝；动画结束再同步 URL。
  // 注意：W 也必须拉取——从其他页面回主页只 pushState('/') 不重载首页，
  // 底板内 shell 可能残留上一页面（如 About）的内容，不能依赖首页预渲染的 Notes
  const pageLoad = loadPageIntoPanel(PAGE_TARGETS[key], false);

  const railWidth = getRailRefW() + RAIL_GAP * 2;
  // 终点：字母在右栏内水平 + 垂直居中（右栏宽度统一），右边缘距底板右缘 rail-gap
  const endWx = vw / 2 - margin - RAIL_GAP - getRailRefW() / 2;
  const endWy = 0;

  // 起点：右栏宽度竖条，以字母的展开位为中心（字母原地不动，竖条只显示右栏）
  const p: PanelState = {
    wx: startWx,
    wy: startWy,
    l: cx + startWx - railWidth / 2,
    t: cy + startWy - wH / 2 - PANEL_RING,
    r: cx + startWx + railWidth / 2,
    b: cy + startWy + wH / 2 + PANEL_RING,
  };

  applyPanel(el, notesPanel, p);
  notesPanel.classList.add('active', 'is-rail-seed');

  const tl = gsap.timeline({
    onUpdate: function () {
      applyPanel(el, notesPanel, p);
    },
  });

  // 垂直方向：W/A 下坠（阴影向下），R/M 上移（阴影向上）
  const vDir: 1 | -1 = key === 'r' || key === 'm' ? -1 : 1;

  // 第一段：字母竖直移到中央，右栏竖条上下铺满（仍只显示右栏）
  tl.call(() => setPanelMotion('vertical', vDir));
  tl.to(p, { wy: endWy, t: margin, b: vh - margin, duration: 0.5, ease: 'power2.inOut' });
  // 第二段：右栏与字母一起右移，左/中栏顺势展开
  tl.call(() => {
    notesPanel.classList.remove('is-rail-seed');
    notesPanel.classList.add('is-opening-left');
    setPanelMotion('horizontal', 1);
  });
  tl.to(p, { wx: endWx, l: margin, r: vw - margin, duration: 0.72, ease: 'power3.inOut' });
  tl.call(() => {
    notesPanel.classList.remove('is-opening-left');
    setPanelMotion(null);
    notesPanel.classList.add('is-settled'); // 动画结束，悬停菜单才生效
    isAnimating = false;
    currentKey = key;
    // 内容已由动画开始时发起的拉取原位替换，动画结束再同步 URL
    void pageLoad.then(function () {
      history.pushState({ page: key }, '', siteBase + PAGE_TARGETS[key]);
    });
  });
}

// 字母 → 首页：原路返回动画（水平左移 → 竖直移回展开位），其余字母波浪展开，恢复主页展开态
function slideLetterToHome(key: 'w' | 'a' | 'r' | 'm'): void {
  if (isAnimating || !panelOpen) return;
  const el = document.getElementById('letter-' + key) as HTMLElement | null;
  if (!el || !notesPanel) return;
  const data = computeLetterPositions();
  if (!data) {
    window.location.href = siteBase + '/';
    return;
  }
  const pos = data.positions;
  const startWx = pos[key].x;
  const startWy = pos[key].y;
  isAnimating = true;

  if (reduceMotion) {
    restoreHomeExpanded(pos);
    return;
  }

  const { vw, vh, cx, cy, margin } = getViewMetrics();
  const r = el.getBoundingClientRect();
  const wH = r.height;
  setRailVars(getRailRefW(), wH);

  const railWidth = getRailRefW() + RAIL_GAP * 2;
  const panelRight = vw - margin;
  // 起点：字母在右栏内水平 + 垂直居中（右栏宽度统一）
  const endWx = vw / 2 - margin - RAIL_GAP - getRailRefW() / 2;
  const endWy = 0;

  const notesShell = notesPanel.querySelector<HTMLElement>('.notes-shell');
  notesShell?.classList.add('is-preparing-collapse');
  notesPanel.classList.remove('is-settled'); // 收起动画期间不再响应悬停菜单

  // 收起前关闭右栏悬停菜单，避免残留在收缩动画里
  notesPanel.querySelector<HTMLElement>('.notes-rail')?.classList.remove('menu-open');
  notesPanel.style.pointerEvents = 'none';

  const p: PanelState = {
    wx: endWx,
    wy: endWy,
    l: margin,
    t: margin,
    r: panelRight,
    b: vh - margin,
  };

  applyPanel(el, notesPanel, p);

  history.pushState(null, '', siteBase + '/');

  const tl = gsap.timeline({
    delay: notesShell?.querySelector('.article') ? 0.15 : 0.08,
    onUpdate: function () {
      applyPanel(el, notesPanel, p);
    },
  });

  // 先隐藏左栏/中栏，再收缩底板
  tl.call(() => {
    notesShell?.classList.remove('is-preparing-collapse');
    notesShell?.classList.add('is-collapsing');
    setPanelMotion('horizontal', -1);
  });
  // 第一段（正向第二段的反向）：字母水平左移回展开位横坐标，右栏竖条带着字母一起左移，
  // 底板收缩到以字母展开位为中心的竖条
  tl.to(p, {
    wx: startWx,
    l: cx + startWx - railWidth / 2,
    r: cx + startWx + railWidth / 2,
    duration: 0.72,
    ease: 'power3.inOut',
  });
  // iz 提前淡入
  tl.add(function () {
    gsap.to('#letter-iz', { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, '-=0.2');
  // 第二段（正向第一段的反向）：竖条竖直移回，字母回到展开位纵坐标
  // W/A 回程向上收（阴影向上），R/M 回程向下落（阴影向下）
  const vDir: 1 | -1 = key === 'r' || key === 'm' ? 1 : -1;
  tl.call(() => setPanelMotion('vertical', vDir));
  tl.to(p, {
    wy: startWy,
    t: cy + startWy - wH / 2 - PANEL_RING,
    b: cy + startWy + wH / 2 + PANEL_RING,
    duration: 0.6,
    ease: 'power2.inOut',
  });

  // 与第二段同步：其余字母展开并停留
  const wave = gsap.timeline({
    delay: 0.68,
    onStart: function () {
      if (sfxExpand) {
        sfxExpand.currentTime = 0;
        sfxExpand.play().catch(function () {});
      }
    },
  });
  const others = LETTER_KEYS.filter((k) => k !== key);
  others.forEach(function (k, i) {
    const other = document.getElementById('letter-' + k);
    if (!other) return;
    const q = pos[k];
    wave.fromTo(
      other,
      { x: 0, y: 0, opacity: 0, filter: 'blur(4px)' },
      {
        x: q.x,
        y: q.y,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.45,
        ease: 'power3.out',
        onComplete: () => flashLetterFx(k),
      },
      i * 0.05
    );
  });

  tl.to({}, { duration: 0.15 });

  tl.call(function () {
    wave.kill();
    setPanelMotion(null);
    restoreHomeExpanded(pos);
  });
}

// 恢复到主页「展开」状态：字母在展开位、标签显示、大 Logo 隐藏、expanded 状态同步
function restoreHomeExpanded(pos: PositionMap): void {
  landing?.classList.add('expanded');
  landing?.classList.remove('panel-open');
  notesPanel?.querySelector<HTMLElement>('.notes-shell')?.classList.remove('is-collapsing', 'is-preparing-collapse');
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (!el) return;
    el.style.pointerEvents = '';
    gsap.set(el, { x: pos[key].x, y: pos[key].y, opacity: 1, filter: 'blur(0px)' });
  });
  gsap.set('#letter-iz', { opacity: 1 });
  gsap.set('#logoFull', { opacity: 0 });
  LETTER_KEYS.forEach(function (key) {
    const letter = document.getElementById('letter-' + key);
    const label = document.getElementById('label-' + key);
    if (letter && label) {
      label.classList.add('show');
      positionLabel(letter, label, key);
    }
  });
  expanded = true;
  panelOpen = false;
  if (notesPanel) {
    notesPanel.classList.remove('is-settled');
    notesPanel.classList.remove('active');
    notesPanel.style.left = '0px';
    notesPanel.style.top = '0px';
    notesPanel.style.width = '0px';
    notesPanel.style.height = '0px';
    notesPanel.style.pointerEvents = '';
  }
  isAnimating = false;
}

/**
 * 窄屏底部工具栏的「返回首页」字母：就地收起底板，回到主页「字母已展开」态。
 * 不做整页跳转 —— 那会重新拉一遍几 MB 的背景视频，且首页还要再点一下背景才看见字母。
 * 返回 false 表示当前不满足就地返回（量不到字母尺寸等），调用方放行默认跳转。
 */
function returnHomeFromPanel(): boolean {
  if (!notesPanel || !panelOpen) return false;
  const data = computeLetterPositions();
  // 字母图尚未就绪时 rect 为 0，就地摆位会算歪 —— 交给整页跳转兜底
  if (!data || data.izW <= 0 || data.izH <= 0) return false;
  const pos = data.positions;

  panelOpen = false;
  isAnimating = true;
  history.pushState(null, '', siteBase + '/');

  // 字母先摆到展开位并把舞台压到隐藏，再整体淡入：全程看不到"未展开"的一帧
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) gsap.set(el, { x: pos[key].x, y: pos[key].y, opacity: 1, filter: 'blur(0px)' });
  });
  gsap.set('#letter-iz', { opacity: 1 });
  gsap.set('#logoFull', { opacity: 0 });
  gsap.set('#logoStage', { autoAlpha: 0 });
  notesPanel.style.pointerEvents = 'none';

  gsap.to('#logoStage', {
    autoAlpha: 1,
    duration: 0.3,
    ease: 'power1.out',
    onComplete: function () {
      restoreHomeExpanded(pos);
    },
  });
  return true;
}

landing?.addEventListener('click', function (e) {
  const target = e.target as HTMLElement;
  if (target.closest('.logo-letter') || target.closest('.sound-toggle')) return;
  if (panelOpen) return; // 底板打开时不响应背景点击
  if (expanded) {
    collapseAll();
  } else {
    expandLogo();
  }
});

LETTER_KEYS.forEach(function (key) {
  const el = document.getElementById('letter-' + key);
  if (!el) return;
  el.addEventListener('click', function (ev) {
    ev.stopPropagation();
    // 底板打开时，点击当前页面字母返回首页展开态
    if (panelOpen) {
      if (key === currentKey) slideLetterToHome(key);
      return;
    }
    if (!expanded || isAnimating) return;
    slideLetterToPanel(key);
  });
  // 悬停：字母 + 标签轻微发光；按下：瞬时变主题青，松开恢复
  // （触摸没有"悬停"这回事，触摸指针不接触发发光，避免点完一直亮着）
  el.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'touch') return;
    if (letterFxCanGlow()) setLetterGlow(key, true);
  });
  el.addEventListener('pointerleave', function () {
    setLetterGlow(key, false);
    setLetterPressed(key, false);
  });
  el.addEventListener('pointerdown', function () {
    setLetterPressed(key, true);
  });
  el.addEventListener('pointerup', function () {
    setLetterPressed(key, false);
  });
  el.addEventListener('pointercancel', function () {
    setLetterPressed(key, false);
  });
});

// 窄屏底部工具栏的「返回首页」字母：拦下默认跳转，就地回主页展开态（见 returnHomeFromPanel）。
// 桌面端这个元素是 display:none，走不到这里；就地返回失败时放行 href 上的 ?letters=1 兜底。
document.addEventListener('click', function (e) {
  const link = (e.target as HTMLElement | null)?.closest?.('.rail-home') as HTMLAnchorElement | null;
  if (!link) return;
  if (!isMobileLayout() || !panelOpen) return;
  if (!returnHomeFromPanel()) return;
  e.preventDefault();
});

// 指针在其他位置松开时兜底恢复
window.addEventListener('pointerup', function () {
  LETTER_KEYS.forEach(function (key) {
    setLetterPressed(key, false);
  });
});

// ===== BGM：双声道无缝交替循环（原逻辑不变） =====
if (bgmA && bgmB && soundToggle) {
  let activeBgm: SeamlessAudio = bgmA;
  let standbyBgm: SeamlessAudio = bgmB;
  // 默认静音：首屏不自动播放，也不在首次交互时抢播；只有点右上角喇叭才开始播。
  // 配合 audio 的 preload="none"，默认状态下 BGM 一个字节都不会下载。
  let soundOn = false;
  const crossfadeSec = 5.0;

  function setupSeamless(bgm: SeamlessAudio): void {
    bgm.addEventListener('timeupdate', function () {
      if (bgm.duration && bgm.currentTime >= bgm.duration - crossfadeSec && !bgm._queued) {
        bgm._queued = true;
        standbyBgm.currentTime = 0;
        standbyBgm.volume = 0;
        standbyBgm.play().catch(function () {});
        const steps = 20;
        const stepMs = (crossfadeSec * 1000) / steps;
        const aStart = activeBgm.volume;
        let s = 0;
        const iv = window.setInterval(function () {
          s++;
          activeBgm.volume = Math.max(0, aStart * (1 - s / steps));
          standbyBgm.volume = Math.min(0.75, 0.75 * (s / steps));
          if (s >= steps) {
            clearInterval(iv);
            activeBgm.pause();
            activeBgm._queued = false;
            const tmp = activeBgm;
            activeBgm = standbyBgm;
            standbyBgm = tmp;
          }
        }, stepMs);
      }
    });
  }

  setupSeamless(bgmA);
  setupSeamless(bgmB);

  function tryPlayBgm(): void {
    if (!soundOn) return;
    if (activeBgm.paused) {
      activeBgm.volume = 0.75;
      activeBgm.play().catch(function () {});
    }
  }

  /** 图标跟随状态：默认关闭，故首屏即为"静音"图标 */
  function renderSoundIcon(): void {
    if (iconOnEl) iconOnEl.style.display = soundOn ? 'block' : 'none';
    if (iconOffEl) iconOffEl.style.display = soundOn ? 'none' : 'block';
  }

  renderSoundIcon();

  soundToggle.addEventListener('click', function (ev) {
    ev.stopPropagation();
    soundOn = !soundOn;
    renderSoundIcon();
    if (soundOn) {
      tryPlayBgm();
    } else {
      activeBgm.pause();
      standbyBgm.pause();
    }
  });
}

// 主题调试钩子：只切 CSS 变量（站点默认固定深色；浅色只换配色，不再切换背景视频）
window.izwarmSetTheme = function (theme: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', theme);
};

window.addEventListener('resize', function () {
  if (panelOpen) {
    // 跨断点（横竖屏、桌面窗口拉窄/拉宽）：底板几何与字母去留完全不同，
    // 按当前 URL 整页重载，让服务端渲染出对应的那一套（URL 已由 pushState 同步）
    if (isMobileLayout() !== openedOnMobile) {
      location.reload();
      return;
    }
    // 窄屏底板由 CSS 铺满（左右上留一道窄边、底边齐屏），不写内联几何，
    // 地址栏收放与横竖屏切换就都由 CSS 自动跟随
    if (isMobileLayout()) return;
    // 底板打开时：重算当前字母在右栏内的居中位，并让底板重新铺满
    const { vw, vh, margin } = getViewMetrics();
    if (notesPanel) {
      notesPanel.style.left = margin + 'px';
      notesPanel.style.top = margin + 'px';
      notesPanel.style.width = vw - margin * 2 + 'px';
      notesPanel.style.height = vh - margin * 2 + 'px';
    }
    const el = document.getElementById('letter-' + currentKey) as HTMLElement | null;
    if (el) {
      const r = el.getBoundingClientRect();
      setRailVars(getRailRefW(), r.height);
      gsap.set(el, { x: vw / 2 - margin - RAIL_GAP - getRailRefW() / 2, y: 0 });
    }
    return;
  }
  if (!expanded || !window.__izSizes) return;
  const positions = window.__izSizes.positions;
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) gsap.set(el, { x: positions[key].x, y: positions[key].y });
    positionLabel(el, document.getElementById(positions[key].label), key);
  });
});

// 图片加载完成后重测右栏基准（W 图就绪前 rect 宽为 0，只能先用兜底值）；
// 若面板已打开（直接访问面板路由），按真实宽度重新定位锚点字母
window.addEventListener('load', function () {
  window.__izRailRefW = getRailRefW();
  if (!panelOpen || !notesPanel || isAnimating) return;
  if (isMobileLayout()) return; // 窄屏没有驻留字母，右栏基准也用不上
  const el = document.getElementById('letter-' + currentKey) as HTMLElement | null;
  if (!el) return;
  const r = el.getBoundingClientRect();
  setRailVars(getRailRefW(), r.height);
  const { vw, margin } = getViewMetrics();
  gsap.set(el, { x: vw / 2 - margin - RAIL_GAP - getRailRefW() / 2, y: 0 });
});

// 从底栏「返回首页」字母进来（?letters=1，就地返回失败时的整页兜底）：
// 主页直接落到字母展开态，不必再点一下背景才看见 w/a/r/m。
function expandFromLettersFlag(): void {
  if (!new URLSearchParams(location.search).has('letters')) return;
  // 抹掉标记，刷新/回退时不再自动展开（点背景仍可再展开）
  history.replaceState(null, '', siteBase + '/');
  expandLogo({ silent: true });
}

// 放在 load 而非 DOMContentLoaded：字母图未就绪时 rect 尺寸不对，展开位会算歪。
// 但脚本若晚于 load 执行（缓存命中等）就再也等不到 load，所以按 readyState 补一次。
if (document.readyState === 'complete') {
  expandFromLettersFlag();
} else {
  window.addEventListener('load', expandFromLettersFlag);
}
