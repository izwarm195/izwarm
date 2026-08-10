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
type PanelState = { wx: number; wy: number; l: number; t: number };

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
  window.location.href = '/' + target + '/';
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

function applyPanel(
  wEl: HTMLElement,
  notesPanel: HTMLElement,
  cx: number,
  cy: number,
  p: PanelState,
  wW: number,
  wH: number,
  pad: number
): void {
  gsap.set(wEl, { x: p.wx, y: p.wy });
  // 底板右下边缘 = W 右下边缘 + pad（保持 W 被 pad 均匀包裹）
  const r = cx + p.wx + wW / 2 + pad;
  const b = cy + p.wy + wH / 2 + pad;
  notesPanel.style.left = p.l + 'px';
  notesPanel.style.top = p.t + 'px';
  notesPanel.style.width = Math.max(0, r - p.l) + 'px';
  notesPanel.style.height = Math.max(0, b - p.t) + 'px';
}


// 直接访问 /notes/：初始化底板和 W 的静态位置
function panelOpenInit(): void {
  
   // 隐藏大 Logo，防止刷新时短暂可见
  const logoFull = document.getElementById('logoFull');
  if (logoFull) gsap.set(logoFull, { opacity: 0 });
 
  if (!notesPanel) return;
  panelOpen = true;
  const { vw, vh, margin } = getViewMetrics();

  notesPanel.style.left = margin + 'px';
  notesPanel.style.top = margin + 'px';
  notesPanel.style.width = (vw - margin * 2) + 'px';
  notesPanel.style.height = (vh - margin * 2) + 'px';

  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (wEl) {
    const wRect = wEl.getBoundingClientRect();
    const pad = 16;
    // 底板右下缘 = vw/vh - margin，W 右下缘 = 底板右下缘 - pad
    const W_END_X = vw / 2 - margin - pad - wRect.width / 2;
    const W_END_Y = vh / 2 - margin - pad - wRect.height / 2;
    gsap.set(wEl, { x: W_END_X, y: W_END_Y, opacity: 1 });
    wEl.style.pointerEvents = 'auto';
  }

}

// 页面加载时检测
if (notesPanel?.classList.contains('static-open')) {
  panelOpenInit();
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
    const pad = 16;

  // 终点：底板右下缘 = vw - margin / vh - margin，等价于 W 右下缘 = vw - margin - pad
  //   即 W 中心 x = vw - margin - pad - wW/2 → wx = vw/2 - margin - pad - wW/2
  const W_END_X = vw / 2 - margin - pad - wW / 2;
  const W_END_Y = vh / 2 - margin - pad - wH / 2;

  const p: PanelState = {
    wx: startWx,
    wy: startWy,
    l: cx + startWx - wW / 2 - pad,
    t: cy + startWy - wH / 2 - pad,
  };

  applyPanel(wEl, notesPanel, cx, cy, p, wW, wH, pad);
  notesPanel.classList.add('active');

  history.pushState({ page: 'notes' }, '', '/notes/');

  const tl = gsap.timeline({
    onUpdate: function () {
      applyPanel(wEl, notesPanel, cx, cy, p, wW, wH, pad);
    },
  });


   // 第一段：竖直下坠到底部（wx、l 不变，只改 wy 和 t）
  tl.to(p, { wy: W_END_Y, t: margin, duration: 0.5, ease: 'power2.inOut' });
  // 第二段：水平右移到右下角（wy 不变，只改 wx 和 l）
  tl.to(p, { wx: W_END_X, l: margin, duration: 0.7, ease: 'power3.inOut' });
  // 底板铺满后浮现内容
  tl.add(function () {
    notesPanel!.classList.add('content-in');
    notesPanel!.style.pointerEvents = 'auto';
    wEl!.style.pointerEvents = 'auto'; // W 可点击返回
    isAnimating = false;
  });
}

// W → Home：原路返回（两段：水平左移 → 竖直上移回 W 展开位）。
// 在 W 第二段开始时，a/r/m 展开并停留在展开位；结束恢复主页展开态。
function slideWToHome(): void {
  if (isAnimating || !panelOpen) return;
  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (!wEl || !notesPanel) return;
  const data = computeLetterPositions();
  if (!data) {
    window.location.href = '/';
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
  // 与前进一致：W 的右下边缘贴合底板右下边缘
  const pad = 16;
  const W_END_X = vw / 2 - margin - pad - wW / 2;
  const W_END_Y = vh / 2 - margin - pad - wH / 2;
  const l0 = cx + startWx - wW / 2 - pad;
  const t0 = cy + startWy - wH / 2 - pad;


  // 隐藏面板内容
  notesPanel.classList.remove('content-in');
  notesPanel.style.pointerEvents = 'none';

  const p: PanelState = {
    wx: W_END_X,
    wy: W_END_Y,
    l: margin,
    t: margin,
  };

  applyPanel(wEl, notesPanel, cx, cy, p, wW, wH, pad);

  // 原地返回：URL 改回首页；刷新时浏览器会按 / 重新请求，加载真正的首页
  history.pushState(null, '', '/');

  const tl = gsap.timeline({
    onUpdate: function () {
      applyPanel(wEl, notesPanel, cx, cy, p, wW, wH,pad);
    },
  });

  tl.to(p, { wx: startWx, l: l0, duration: 0.5, ease: 'power3.inOut' });
  // iz 提前淡入：紧接第一段结束前一点点开始（比之前 restoreHomeExpanded 里的瞬时 set 早很多）
  tl.add(function () {
    gsap.to('#letter-iz', { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, '-=0.15');
  tl.to(p, { wy: startWy, t: t0, duration: 0.7, ease: 'power2.inOut' });


  // 与 W 第二段同步（稍晚一点）：a/r/m 展开并停留在展开位
  const wave = gsap.timeline({
    delay: 0.5, // 与新的第一段时长同步：W 开始第二段的瞬间，arm 开始 expand
    onStart: function () {
      // arm expand 同时播放 expand 音效
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

  // 给 a/r/m 展开留出收尾时间
  tl.to({}, { duration: 0.15 });

  // 收尾：恢复主页展开态；若是 /notes/ 独立页则真正跳回首页
  tl.add(function () {
    wave.kill();
    restoreHomeExpanded(pos);
  });
}

// 恢复到主页「展开」状态：字母在展开位、标签显示、大 Logo 隐藏、expanded 状态同步
function restoreHomeExpanded(pos: PositionMap): void {
  landing?.classList.add('expanded');
  landing?.classList.remove('panel-open');
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (!el) return;
    el.style.pointerEvents = ''; // 恢复点击（由 .landing.expanded 规则控制）
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
  expanded = true; // 与视觉一致：再点击会正常触发 collapseAll（含收起音效）
  panelOpen = false;
  if (notesPanel) {
    notesPanel.classList.remove('active', 'content-in');
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
    // Notes 底板已打开时，点 W 返回 home（原路逆行）
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
  if (panelOpen || !expanded || !window.__izSizes) return;
  const positions = window.__izSizes.positions;
  LETTER_KEYS.forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) gsap.set(el, { x: positions[key].x, y: positions[key].y });
    positionLabel(el, document.getElementById(positions[key].label), key);
  });
});
