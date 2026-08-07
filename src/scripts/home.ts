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

landing?.addEventListener('click', function (e) {
  const target = e.target as HTMLElement;
  if (target.closest('.logo-letter') || target.closest('.sound-toggle')) return;
  if (expanded) {
    collapseAll();
  } else {
    expandLogo();
  }
});

['w', 'a', 'r', 'm'].forEach(function (key) {
  const el = document.getElementById('letter-' + key);
  if (!el) return;
  const targetMap: Record<string, string> = { w: 'notes', a: 'projects', r: 'works', m: 'about' };
  el.addEventListener('click', function (ev) {
    ev.stopPropagation();
    if (!expanded || isAnimating) return;
    collapseAndNavigate(targetMap[key]);
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
