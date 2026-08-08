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
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const izEl = document.getElementById('letter-iz') as HTMLElement | null;
    if (!izEl) return;
    const izRect = izEl.getBoundingClientRect();
    const izW = izRect.width;
    const izH = izRect.height;
    const gap = 6;

    const sizes: Record<string, { w: number; h: number }> = {};
    let measuringComplete = true;
    ['w', 'a', 'r', 'm'].forEach(function (key) {
      const el = document.getElementById('letter-' + key);
      if (!el) {
        measuringComplete = false;
        return;
      }
      const r = el.getBoundingClientRect();
      sizes[key] = { w: r.width, h: r.height };
    });
    if (!measuringComplete) return;

    const positions: PositionMap = {
      w: { x: -(izW / 2 + sizes.w.w / 2 + gap + 3), y: -(izH / 2 + sizes.w.h / 2 + gap), label: 'label-w' },
      a: { x: izW / 2 + sizes.a.w / 2 + gap - 30, y: -(izH / 2 + sizes.a.h / 2 + gap), label: 'label-a' },
      r: { x: -(izW / 2 + sizes.r.w / 2 + gap + 24), y: izH / 2 + sizes.r.h / 2 + gap, label: 'label-r' },
      m: { x: izW / 2 + sizes.m.w / 2 + gap, y: izH / 2 + sizes.m.h / 2 + gap, label: 'label-m' },
    };

    window.__izSizes = { izW, izH, gap, sizes, positions };

    const totalKeys = Object.keys(positions).length;
    let completed = 0;

    Object.keys(positions).forEach(function (key, i) {
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

  ['w', 'a', 'r', 'm'].forEach(function (key) {
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
  ['label-w', 'label-a', 'label-r', 'label-m'].forEach(function (id) {
    const l = document.getElementById(id);
    if (l) l.classList.remove('show');
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
      labelEl.style.cssText = 'left:' + (r.left - 50) + 'px;top:' + r.top + 'px;transform:translate(0%,-100%);text-align:left';
      break;
    case 'a':
      labelEl.style.cssText = 'left:' + (r.right + 80) + 'px;top:' + r.top + 'px;transform:translate(-100%,-100%);text-align:right';
      break;
    case 'r':
      labelEl.style.cssText = 'left:' + (r.left - 90) + 'px;top:' + r.bottom + 'px;transform:translate(0%,0%);text-align:left';
      break;
    case 'm':
      labelEl.style.cssText = 'left:' + (r.right + 50) + 'px;top:' + r.bottom + 'px;transform:translate(-100%,0%);text-align:right';
      break;
  }
}

function collapseAndNavigate(target: string): void {
  if (isAnimating || !mask) return;
  isAnimating = true;
  const dur = reduceMotion ? 0.3 : 0.6;

  ['w', 'a', 'r', 'm'].forEach(function (key) {
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
  gsap.to(mask, {
    opacity: 1,
    duration: 0.15,
    delay: dur * 0.5,
    onComplete: function () {
      const core = mask.querySelector('.core') as HTMLElement | null;
      if (!core) {
        window.location.href = '/' + target + '/';
        return;
      }
      core.style.transform = 'scale(1)';
      gsap.to(core, {
        scale: 400,
        duration: reduceMotion ? 0.3 : 0.7,
        ease: 'power4.in',
        onComplete: function () {
          window.location.href = '/' + target + '/';
        },
      });
    },
  });
}

// W → Notes：两段式滑动 + 磨砂底板延展 + 无缝内嵌转场（无硬跳转）
function slideWToNotes(): void {
  if (isAnimating) return;
  const wEl = document.getElementById('letter-w') as HTMLElement | null;
  if (!wEl || !notesPanel) {
    window.location.href = '/notes/';
    return;
  }
  isAnimating = true;
  expanded = false; // 标记退出展开态，防止 resize 干扰

  if (reduceMotion) {
    window.location.href = '/notes/';
    return;
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;
  const margin = clamp(vw * 0.05, 40, 80); // 底板距页面边缘 5% 但范围 40~80px

  // 其余字母、标签、iz 淡出
  ['a', 'r', 'm'].forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) gsap.to(el, { opacity: 0, duration: 0.35, ease: 'power2.in', filter: 'blur(4px)' });
  });
  ['label-w', 'label-a', 'label-r', 'label-m'].forEach(function (id) {
    const l = document.getElementById(id);
    if (l) l.classList.remove('show');
  });
  gsap.to('#letter-iz', { opacity: 0, duration: 0.35, ease: 'power2.in' });

  // W 当前展开态位移（在 logo 展开后 W 的 gsap x/y 值）
  const startWx = Number(gsap.getProperty(wEl, 'x'));
  const startWy = Number(gsap.getProperty(wEl, 'y'));
  const wRect = wEl.getBoundingClientRect();
  const pad = 16; // 底板比 W 稍宽

  // 底板左右各留 margin + W 最终 x = 屏幕右侧 margin 处
  // 即底板右边缘 = vw - margin，对应 W 中心 = vw - margin → wx = (vw - margin) - cx
  const W_END_X = vw - margin - cx;
  // 竖直：第一段下坠到 cy 以下，第二段继续滑到底部 margin 处
  const W_MID_Y = cy * 0.45;
  const W_END_Y = vh - margin - cy;

  const p = {
    wx: startWx,
    wy: startWy,
    l: cx + startWx - wRect.width / 2 - pad,
    t: cy + startWy - wRect.height / 2 - pad,
  };

  function apply(): void {
    gsap.set(wEl, { x: p.wx, y: p.wy });
    const r = cx + p.wx;
    const b = cy + p.wy;
    notesPanel!.style.left = p.l + 'px';
    notesPanel!.style.top = p.t + 'px';
    notesPanel!.style.width = Math.max(0, r - p.l) + 'px';
    notesPanel!.style.height = Math.max(0, b - p.t) + 'px';
  }
  apply();
  notesPanel.classList.add('active');

  // 静默改 URL，无页面跳转
  history.pushState({ page: 'notes' }, '', '/notes/');

  const tl = gsap.timeline({ onUpdate: apply });

  // 第一段：竖直下坠 + 底板竖直延展（只改 wy，保持垂直；较慢、匀滑）
  tl.to(p, { wy: W_MID_Y, t: margin, duration: 0.65, ease: 'power2.inOut' });
  // 第二段：快速滑向右下角 + 底板水平铺满（inOut：停下时速度衰减）
  tl.to(p, { wx: W_END_X, wy: W_END_Y, l: margin, duration: 0.45, ease: 'power3.inOut' });
  // 底板完全铺开后浮现内容，停在此处
  tl.add(function () {
    notesPanel!.classList.add('content-in');
    notesPanel!.style.pointerEvents = 'auto';
    isAnimating = false;
  });
}

// 工具：clamp
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}



landing?.addEventListener('click', function (e) {
  const target = e.target as HTMLElement;
  if (target.closest('.logo-letter') || target.closest('.sound-toggle')) return;
  // Notes 底板打开时（内嵌转场或直接访问 /notes/），不响应主页动画
  if (notesPanel?.classList.contains('active')) return;
  if (expanded) {
    collapseAll();
  } else {
    expandLogo();
  }
});

['w', 'a', 'r', 'm'].forEach(function (key) {
  const el = document.getElementById('letter-' + key);
  if (!el) return;
  const targetMap: Record<string, string> = { a: 'projects', r: 'works', m: 'about' };
  el.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (!expanded || isAnimating) return;
    if (key === 'w') {
      slideWToNotes(); // W 走新的两段式底板转场
    } else {
      collapseAndNavigate(targetMap[key]);
    }
  });
});

// ===== BGM：双声道无缝交替循环（原逻辑不变） =====
if (bgmA && bgmB && soundToggle) {
  let activeBgm: SeamlessAudio = bgmA as SeamlessAudio;
  let standbyBgm: SeamlessAudio = bgmB as SeamlessAudio;
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

  setupSeamless(bgmA as SeamlessAudio);
  setupSeamless(bgmB as SeamlessAudio);

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
    if (soundOn) {
      tryPlayBgm();
      if (iconOnEl) iconOnEl.style.display = 'block';
      if (iconOffEl) iconOffEl.style.display = 'none';
    } else {
      activeBgm.pause();
      standbyBgm.pause();
      if (iconOnEl) iconOnEl.style.display = 'none';
      if (iconOffEl) iconOffEl.style.display = 'block';
    }
  });
}

window.izwarmSetTheme = function (theme: 'dark' | 'light') {
  document.body.setAttribute('data-theme', theme);
  if (bgVideo) bgVideo.style.display = theme === 'dark' ? 'block' : 'none';
  if (bgVideoLight) bgVideoLight.style.display = theme === 'light' ? 'block' : 'none';
};

window.addEventListener('resize', function () {
  if (!expanded || !window.__izSizes) return;
  const s = window.__izSizes;
  const izW = s.izW;
  const izH = s.izH;
  const gap = s.gap;
  const sizes = s.sizes;
  const positions: PositionMap = {
    w: { x: -(izW / 2 + sizes.w.w / 2 + gap + 3), y: -(izH / 2 + sizes.w.h / 2 + gap), label: 'label-w' },
    a: { x: izW / 2 + sizes.a.w / 2 + gap - 30, y: -(izH / 2 + sizes.a.h / 2 + gap), label: 'label-a' },
    r: { x: -(izW / 2 + sizes.r.w / 2 + gap + 24), y: izH / 2 + sizes.r.h / 2 + gap, label: 'label-r' },
    m: { x: izW / 2 + sizes.m.w / 2 + gap, y: izH / 2 + sizes.m.h / 2 + gap, label: 'label-m' },
  };
  Object.keys(positions).forEach(function (key) {
    const el = document.getElementById('letter-' + key);
    if (el) gsap.set(el, { x: positions[key].x, y: positions[key].y });
    positionLabel(el, document.getElementById(positions[key].label), key);
  });
});

// 底板内返回首页
notesPanel?.addEventListener('click', function (e) {
  const target = e.target as HTMLElement;
  const backBtn = target.closest('[data-nav="home"]');
  if (!backBtn) return;
  e.preventDefault();
  e.stopPropagation();
  // 反转：收起底板、W 回到原位
  notesPanel.classList.remove('content-in');
  const wEl = document.getElementById('letter-w');
  if (wEl) {
    gsap.to(wEl, {
      x: 0, y: 0, duration: 0.5, ease: 'power3.inOut',
      onComplete: function () {
        notesPanel.classList.remove('active');
        notesPanel.style.left = '0px';
        notesPanel.style.top = '0px';
        notesPanel.style.width = '0px';
        notesPanel.style.height = '0px';
        history.pushState(null, '', '/');
        expandLogo(); // 回到展开态
      },
    });
  }
});
