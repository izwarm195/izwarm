/**
 * 正文图片预览：点一下放大并居中，滚轮带惯性缩放，按住可拖动平移。
 *
 * 标记写死在 BaseLayout（<body> 直下）而不是就地生成：底板里有 backdrop-filter /
 * transform 的祖先，只有挂在 body 直下、用 position:fixed 才能盖住整个视口
 * （收款卡弹层踩过同一个坑）。
 *
 * 交互全部走 document 委托：SPA 换页会把正文整片替换，绑在图片上的监听下一次就没了。
 *
 * 缩放的"动量"用一个离散弹簧做：滚轮只改目标值 target，每帧把 scale 往 target 拉
 * 并保留速度 —— 松手后还会顺着惯性滑一小段再停下，而不是硬生生停在滚轮松开的那一档。
 */

/** 缩放上下限：0.25 倍（看全貌）到 8 倍（看细节） */
const MIN_SCALE = 0.25;
const MAX_SCALE = 8;
/** 弹簧参数：阻尼略小于临界值，收尾利落但留一点点过冲，手感才不"死" */
const STIFFNESS = 0.18;
const DAMPING = 0.76;
/** 淡入淡出时长，与 global.css 里 .img-viewer 的 transition 对齐 */
const FADE_MS = 220;
/** 小于这个尺寸的图不接管：callout 徽标、复制图标这类都是十几像素的小图 */
const MIN_SIDE = 60;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let viewer: HTMLElement | null = null;
let img: HTMLImageElement | null = null;
let readout: HTMLElement | null = null;
let closeBtn: HTMLButtonElement | null = null;

/** 当前比例 / 目标比例 / 弹簧速度 */
let scale = 1;
let target = 1;
let velocity = 0;
/** 平移量（px），作用在已缩放的盒子上 */
let offsetX = 0;
let offsetY = 0;
let frameId = 0;
let hideTimer = 0;
/** 打开预览前的焦点，关闭时还回去 */
let returnFocus: HTMLElement | null = null;

/** 拖动状态 */
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragBaseX = 0;
let dragBaseY = 0;

function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

function paint(): void {
  if (!img) return;
  img.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  if (readout) readout.textContent = `${Math.round(scale * 100)}%`;
}

/**
 * 把平移量收进"图至少还看得见"的范围：
 * 没放大到超出视口时只留 40px 余量（拖一下有手感，但不会把图甩丢），
 * 放大后允许一直拖到图片边缘贴住视口边。
 */
function clampOffset(): void {
  if (!img) return;
  const maxX = Math.max(0, (img.offsetWidth * scale - window.innerWidth) / 2) + 40;
  const maxY = Math.max(0, (img.offsetHeight * scale - window.innerHeight) / 2) + 40;
  offsetX = clamp(offsetX, -maxX, maxX);
  offsetY = clamp(offsetY, -maxY, maxY);
}

/** 弹簧的一帧：先按差值加速，再按阻尼衰减，差值够小就吸附到目标并停下 */
function step(): void {
  frameId = 0;
  if (reduceMotion) {
    scale = target;
    velocity = 0;
  } else {
    velocity = (velocity + (target - scale) * STIFFNESS) * DAMPING;
    scale += velocity;
    if (Math.abs(target - scale) < 0.0008 && Math.abs(velocity) < 0.0008) {
      scale = target;
      velocity = 0;
    }
  }
  clampOffset();
  paint();
  if (scale !== target) frameId = requestAnimationFrame(step);
}

function kick(): void {
  if (!frameId) frameId = requestAnimationFrame(step);
}

function open(source: HTMLImageElement): void {
  if (!viewer || !img) return;
  window.clearTimeout(hideTimer);
  returnFocus = document.activeElement as HTMLElement | null;
  img.src = source.currentSrc || source.src;
  img.alt = source.alt;
  // 从略小一点弹到 1：入场本身就是一次弹簧运动，不用额外的 CSS transition
  scale = reduceMotion ? 1 : 0.9;
  target = 1;
  velocity = 0;
  offsetX = 0;
  offsetY = 0;
  clampOffset();
  paint();
  viewer.hidden = false;
  requestAnimationFrame(() => viewer?.classList.add('is-open'));
  closeBtn?.focus({ preventScroll: true });
  kick();
}

function close(): void {
  if (!viewer || viewer.hidden) return;
  viewer.classList.remove('is-open');
  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(
    () => {
      if (viewer) viewer.hidden = true;
      // 预览关掉后没必要再让浏览器占着这张大图的解码结果
      img?.removeAttribute('src');
    },
    reduceMotion ? 0 : FADE_MS
  );
  returnFocus?.focus({ preventScroll: true });
  returnFocus = null;
}

function reset(): void {
  target = 1;
  offsetX = 0;
  offsetY = 0;
  kick();
}

function onWheel(e: WheelEvent): void {
  // 必须拦掉默认行为，否则滚轮会去滚底下的正文
  e.preventDefault();
  // deltaMode：0 像素 / 1 行 / 2 页。先统一成像素，触控板才不会"一格到底"
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
  const delta = e.deltaY * unit;
  // 指数映射：每一格滚轮放大的比例相同，观感比线性加减稳；ctrlKey 是触控板捏合
  const factor = Math.exp(-delta * (e.ctrlKey ? 0.008 : 0.0016));
  target = clamp(target * factor, MIN_SCALE, MAX_SCALE);
  kick();
}

function onPointerDown(e: PointerEvent): void {
  if (!img) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragBaseX = offsetX;
  dragBaseY = offsetY;
  img.setPointerCapture(e.pointerId);
  img.classList.add('is-dragging');
  e.preventDefault();
}

function onPointerMove(e: PointerEvent): void {
  if (!dragging) return;
  offsetX = dragBaseX + (e.clientX - dragStartX);
  offsetY = dragBaseY + (e.clientY - dragStartY);
  clampOffset();
  paint();
}

function endDrag(e: PointerEvent): void {
  if (!dragging) return;
  dragging = false;
  img?.classList.remove('is-dragging');
  if (img?.hasPointerCapture(e.pointerId)) img.releasePointerCapture(e.pointerId);
}

export function initImageViewer(): void {
  if (viewer) return;
  viewer = document.getElementById('imgViewer');
  if (!viewer) return;
  img = viewer.querySelector<HTMLImageElement>('.img-viewer-img');
  readout = viewer.querySelector<HTMLElement>('[data-viewer-scale]');
  closeBtn = viewer.querySelector<HTMLButtonElement>('[data-viewer-close]');
  if (!img) return;

  // 打开：正文里的大图。链接 / 按钮里的图标、几十像素的徽标一律不接管
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement | null)?.closest?.('img');
    if (!el) return;
    if (!el.closest('.article-body') || el.closest('a, button')) return;
    if (el.width < MIN_SIDE || el.height < MIN_SIDE) return;
    e.preventDefault();
    open(el);
  });

  viewer.addEventListener('wheel', onWheel, { passive: false });

  viewer.addEventListener('click', (e) => {
    const el = e.target as HTMLElement | null;
    if (el?.closest('[data-viewer-close]')) {
      close();
      return;
    }
    if (el?.closest('[data-viewer-reset]')) {
      reset();
      return;
    }
    // 点空白处（含遮罩）关闭；点图本身不关，那是拖动和看图的区域
    if (el === viewer) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewer && !viewer.hidden) close();
  });

  // SPA 换页：正在预览的那张图已经不在页面上了，直接收掉
  document.addEventListener('izwarm:panel-swap', close);

  img.addEventListener('pointerdown', onPointerDown);
  img.addEventListener('pointermove', onPointerMove);
  img.addEventListener('pointerup', endDrag);
  img.addEventListener('pointercancel', endDrag);
  img.addEventListener('dblclick', reset);
}
