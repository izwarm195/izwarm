/**
 * 首页脚本：由原 home.js（IIFE）忠实迁移至 TypeScript。
 *
 * 说明：
 * - 保持原有 DOM 查询、GSAP 时间线、缓动、延迟、坐标与状态判断不变；
 * - 仅增加元素空值检查与 TypeScript 类型标注（大纲第六节要求）；
 * - GSAP 由 CDN 全局脚本改为 npm 包导入（版本同为 3.12.5）。
 */
import { gsap } from 'gsap';

declare global {
  interface Window {
    izwarmSetTheme?: (theme: 'dark' | 'light') => void;
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
const OTHER_KEYS = ['a', 'r', 'm'] as const;

const bgVideo = document.getElementById('bgVideo') as HTMLVideoElement | null;
const bgVideoLight = document.getElementById('bgVideoLight') as HTMLVideoElement | null;
const sfxExpand = document.getElementById('sfxExpand') as HTMLAudioElement | null;
const sfxCollapse = document.getElementById('sfxCollapse') as HTMLAudioElement | null;

// ===== 视频播放可靠性（原逻辑不变） =====
function startVideo(v: HTMLVideoElement): void {
  if (v.dataset.started) return;
  v.dataset.started = '1';
  v.classList.add('loaded');
  v.play().catch(function () {});
}

if (bgVideo && bgVideoLight) {
  [bgVideo, bgVideoLight].forEach(function (v) {
    if (v.readyState >= 2) {
      startVideo(v);
    }
    v.addEventListener('loadeddata', function () {
      startVideo(v);
    });
    v.addEventListener('canplay', function () {
      startVideo(v);
    });
    v.addEventListener('pause', function () {
      if (!v.ended && document.visibilityState === 'visible') {
        v.play().catch(function () {});
      }
    });
  });

  setTimeout(function () {
    [bgVideo, bgVideoLight].forEach(function (v) {
      if (v.paused && v.readyState >= 1) {
        startVideo(v);
      }
    });
  }, 1500);

  document.addEventListener(
    'click',
    function vidOnce() {
      if (bgVideo.paused) bgVideo.play().catch(function () {});
      if (bgVideoLight.paused) bgVideoLight.play().catch(function () {});
    },
    { once: true }
  );
}

// ===== 主逻辑 =====
const landing = document.getElementById('landing') as HTMLElement | null;
const soundToggle = document.getElementById('soundToggle') as HTMLElement | null;
const mask = document.getElementById('transitionMask') as HTMLElement | null;
const iconOnEl = document.getElementById('soundIconOn') as HTMLElement | null;
const iconOffEl = document.getElementById('soundIconOff') as HTMLElement | null;
const bgmA = document.getElementById('bgmA') as HTMLAudioElement | null;
const bgmB = document.getElementById('bgmB') as HTMLAudioElement | null;
const notesPanel = document.getElementById('notesPanel') as HTMLElement | null;

let expanded = false;
let isAnimating = false;
let panelOpen = false; // Notes 底板是否已铺开（含动画完成 or 直接访问）
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 直接访问 Notes 路由：底板初始已打开，屏蔽背景点击，避免触发主页动画
if (notesPanel?.classList.contains('active')) {
  panelOpen = true;
  panelOpenInit();
}

// ===== 工具函数 =====
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getViewMetrics(): { vw: number; vh: number; cx: number; cy: number; margin: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return { vw, vh, cx: vw / 2, cy: vh / 2, margin: clamp(vw * 0.025, 20, 44) };
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
    a: { x: izW / 2 + sizes.a.w / 2 + gap - 30, y: -(izH / 2 + sizes.a.h / 2 + gap), label: 'label-a' },
    r: { x: -(izW / 2 + sizes.r.w / 2 + gap + 24), y: izH / 2 + sizes.r.h / 2 + gap, label: 'label-r' },
    m: { x: izW / 2 + sizes.m.w / 2 + gap, y: izH / 2 + sizes.m.h / 2 + gap, label: 'label-m' },
  };
  return { positions, sizes, izW, izH, gap };
}

// 直接访问 Notes 路由：把字母 W 定位到右下角（与滑动转场终点一致），保留为交互锚点
function panelOpenInit(): void {
  if (!notesPanel) return;
  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (!wEl) return;
  const { vw, margin } = getViewMetrics();
  const wRect = wEl.getBoundingClientRect();
  const wW = wRect.width;
  const wH = wRect.height;
  setRailVars(wW, wH);
  // W 在右栏内水平 + 垂直居中，右边缘距底板右缘 rail-gap
  gsap.set(wEl, {
    x: vw / 2 - margin - RAIL_GAP - wW / 2,
    y: 0,
    opacity: 1,
  });
  wEl.style.pointerEvents = 'auto';
}

function expandLogo(): void {
  if (expanded || isAnimating) return;
  // 展开音效：重置进度 + 播放
  if (sfxExpand) {
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
        { x: 0, y: 0, opacity: 0, filter: reduceMotion ? 'none' : 'blur(6px)' },
        {
          x: p.x,
          y: p.y,
          opacity: 1,
          filter: 'blur(0px)',
          duration: dur,
          delay: i * 0.05,
          ease,
          onComplete: function () {
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

function collapseAndNavigate(target: string): void {
  if (isAnimating || !mask) return;
  isAnimating = true;
  const dur = reduceMotion ? 0.3 : 0.6;

  collapseLetters(dur);

  gsap.to(mask, {
    opacity: 1,
    duration: 0.15,
    delay: dur * 0.5,
    onComplete: function () {
      const core = mask.querySelector('.core') as HTMLElement | null;
      if (!core) {
        navigateTo(target);
        return;
      }
      core.style.transform = 'scale(1)';
      gsap.to(core, {
        scale: 400,
        duration: reduceMotion ? 0.3 : 0.7,
        ease: 'power4.in',
        onComplete: function () {
          navigateTo(target);
        },
      });
    },
  });
}

// W → Notes：三段式滑动（竖直下坠 → 水平右移 → 竖直下移）+ 磨砂底板延展
function slideWToNotes(): void {
  if (isAnimating || panelOpen) return;
  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (!wEl || !notesPanel) {
    navigateTo('notes');
    return;
  }
  isAnimating = true;
  panelOpen = true; // 进入底板打开流程（含动画中），期间忽略背景点击

  if (reduceMotion) {
    navigateTo('notes');
    return;
  }

  const { vw, vh, cx, cy, margin } = getViewMetrics();

  // 其余字母、标签、iz 淡出
  OTHER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) {
      el.style.pointerEvents = 'none'; // 隐藏后不可点击，避免误触跳转
      gsap.to(el, { opacity: 0, duration: 0.35, ease: 'power2.in', filter: 'blur(4px)' });
    }
  });
  LETTER_KEYS.forEach(function (key) {
    const label = document.getElementById('label-' + key);
    if (label) label.classList.remove('show');
  });
  gsap.to('#letter-iz', { opacity: 0, duration: 0.35, ease: 'power2.in' });

  const startWx = Number(gsap.getProperty(wEl, 'x'));
  const startWy = Number(gsap.getProperty(wEl, 'y'));
  const wRect = wEl.getBoundingClientRect();
  const wW = wRect.width;
  const wH = wRect.height;
  setRailVars(wW, wH);

  const railWidth = wW + RAIL_GAP * 2;
  // 终点：W 在右栏内水平 + 垂直居中，右边缘距底板右缘 rail-gap
  const endWx = vw / 2 - margin - RAIL_GAP - wW / 2;
  const endWy = 0;

  // 起点：右栏宽度竖条，以 W 的展开位为中心（W 原地不动，竖条只显示右栏）
  const p: PanelState = {
    wx: startWx,
    wy: startWy,
    l: cx + startWx - railWidth / 2,
    t: cy + startWy - wH / 2 - PANEL_RING,
    r: cx + startWx + railWidth / 2,
    b: cy + startWy + wH / 2 + PANEL_RING,
  };

  applyPanel(wEl, notesPanel, p);
  notesPanel.classList.add('active', 'is-rail-seed');

  const tl = gsap.timeline({
    onUpdate: function () {
      applyPanel(wEl, notesPanel, p);
    },
  });

  // 第一段：W 竖直下移到中央，右栏竖条上下铺满（仍只显示右栏）
  tl.call(() => setPanelMotion('vertical', 1));
  tl.to(p, { wy: endWy, t: margin, b: vh - margin, duration: 0.5, ease: 'power2.inOut' });
  // 第二段：右栏与 W 一起右移，左/中栏顺势展开
  tl.call(() => {
    notesPanel.classList.remove('is-rail-seed');
    notesPanel.classList.add('is-opening-left');
    setPanelMotion('horizontal', 1);
  });
  tl.to(p, { wx: endWx, l: margin, r: vw - margin, duration: 0.72, ease: 'power3.inOut' });
  tl.call(() => {
    notesPanel.classList.remove('is-opening-left');
    setPanelMotion(null);
    history.pushState({ page: 'notes' }, '', siteBase + '/notes/');
    isAnimating = false;
  });
}

// W → 首页：原路返回动画（水平左移 → 竖直上移回展开位），字母波浪展开，恢复主页展开态
function slideWToHome(): void {
  if (isAnimating || !panelOpen) return;
  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (!wEl || !notesPanel) return;
  const data = computeLetterPositions();
  if (!data) {
    window.location.href = siteBase + '/';
    return;
  }
  const pos = data.positions;
  const startWx = pos.w.x;
  const startWy = pos.w.y;
  isAnimating = true;

  if (reduceMotion) {
    restoreHomeExpanded(pos);
    return;
  }

  const { vw, vh, cx, cy, margin } = getViewMetrics();
  const wRect = wEl.getBoundingClientRect();
  const wW = wRect.width;
  const wH = wRect.height;
  setRailVars(wW, wH);

  const railWidth = wW + RAIL_GAP * 2;
  const panelRight = vw - margin;
  // 起点：W 在右栏内水平 + 垂直居中
  const endWx = vw / 2 - margin - RAIL_GAP - wW / 2;
  const endWy = 0;

  const notesShell = notesPanel.querySelector<HTMLElement>('.notes-shell');
  notesShell?.classList.add('is-preparing-collapse');

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

  applyPanel(wEl, notesPanel, p);

  history.pushState(null, '', siteBase + '/');

  const tl = gsap.timeline({
    delay: notesShell?.querySelector('.article') ? 0.15 : 0.08,
    onUpdate: function () {
      applyPanel(wEl, notesPanel, p);
    },
  });

  // 先隐藏左栏/中栏，再收缩底板
  tl.call(() => {
    notesShell?.classList.remove('is-preparing-collapse');
    notesShell?.classList.add('is-collapsing');
    setPanelMotion('horizontal', 1);
  });
  // 第一段：左边缘向右收缩到只剩右栏
  tl.to(p, { l: panelRight - railWidth, duration: 0.5, ease: 'power3.inOut' });
  // iz 提前淡入
  tl.add(function () {
    gsap.to('#letter-iz', { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, '-=0.15');
  // 第二段：右栏竖条收回 W（W 回展开位）
  tl.call(() => setPanelMotion('vertical', -1));
  tl.to(p, {
    wx: startWx,
    wy: startWy,
    t: cy + startWy - wH / 2 - PANEL_RING,
    b: cy + startWy + wH / 2 + PANEL_RING,
    duration: 0.6,
    ease: 'power2.inOut',
  });

  // 与 W 第二段同步：a/r/m 展开并停留
  const wave = gsap.timeline({
    delay: 0.5,
    onStart: function () {
      if (sfxExpand) {
        sfxExpand.currentTime = 0;
        sfxExpand.play().catch(function () {});
      }
    },
  });
  OTHER_KEYS.forEach(function (key, i) {
    const el = document.getElementById('letter-' + key);
    if (!el) return;
    const q = pos[key];
    wave.fromTo(
      el,
      { x: 0, y: 0, opacity: 0, filter: 'blur(4px)' },
      { x: q.x, y: q.y, opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' },
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
    notesPanel.classList.remove('active');
    notesPanel.style.left = '0px';
    notesPanel.style.top = '0px';
    notesPanel.style.width = '0px';
    notesPanel.style.height = '0px';
    notesPanel.style.pointerEvents = '';
  }
  isAnimating = false;
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

const targetMap: Record<string, string> = { a: 'projects', r: 'works', m: 'about' };

LETTER_KEYS.forEach(function (key) {
  const el = document.getElementById('letter-' + key);
  if (!el) return;
  el.addEventListener('click', function (ev) {
    ev.stopPropagation();
    // 底板打开时，点击原 W 返回首页
    if (key === 'w' && panelOpen) {
      slideWToHome();
      return;
    }
    if (!expanded || isAnimating) return;
    if (key === 'w') {
      slideWToNotes();
    } else {
      collapseAndNavigate(targetMap[key]);
    }
  });
});

// ===== BGM：双声道无缝交替循环（原逻辑不变） =====
if (bgmA && bgmB && soundToggle) {
  let activeBgm: SeamlessAudio = bgmA;
  let standbyBgm: SeamlessAudio = bgmB;
  let soundOn = true;
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

  // 立即尝试（依赖浏览器 MEI，已互动过的用户有效）
  tryPlayBgm();

  // 多重交互兜底（新访客第一次操作即播放）
  ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(function (evtName) {
    document.addEventListener(
      evtName,
      function audioOnce() {
        tryPlayBgm();
      },
      { once: true }
    );
  });

  soundToggle.addEventListener('click', function (ev) {
    ev.stopPropagation();
    soundOn = !soundOn;
    if (iconOnEl) iconOnEl.style.display = soundOn ? 'block' : 'none';
    if (iconOffEl) iconOffEl.style.display = soundOn ? 'none' : 'block';
    if (soundOn) {
      tryPlayBgm();
    } else {
      activeBgm.pause();
      standbyBgm.pause();
    }
  });
}

window.izwarmSetTheme = function (theme: 'dark' | 'light') {
  document.body.setAttribute('data-theme', theme);
  if (bgVideo) bgVideo.style.display = theme === 'dark' ? 'block' : 'none';
  if (bgVideoLight) bgVideoLight.style.display = theme === 'light' ? 'block' : 'none';
};

window.addEventListener('resize', function () {
  if (panelOpen) {
    // 底板打开时：重算 W 在右栏内的居中位，并让底板重新铺满
    const { vw, vh, margin } = getViewMetrics();
    if (notesPanel) {
      notesPanel.style.left = margin + 'px';
      notesPanel.style.top = margin + 'px';
      notesPanel.style.width = vw - margin * 2 + 'px';
      notesPanel.style.height = vh - margin * 2 + 'px';
    }
    const wEl = document.getElementById('letter-w') as HTMLElement | null;
    if (wEl) {
      const wRect = wEl.getBoundingClientRect();
      setRailVars(wRect.width, wRect.height);
      gsap.set(wEl, { x: vw / 2 - margin - RAIL_GAP - wRect.width / 2, y: 0 });
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
