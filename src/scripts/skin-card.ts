/**
 * About 页的皮肤展示卡：把 64×64 的皮肤贴图渲染成一个跟着指针转动的 3D 人物。
 *
 * 三个决定：
 *
 * 1. skinview3d 走动态 import。它连着 three.js 一起约 170KB（gzip），只有 About 页
 *    需要，其它页面不该为它付这笔下载；Vite 会把它拆成独立 chunk，只有这张卡真的
 *    出现在 DOM 里时才去拉。
 * 2. 初始化挂在 'izwarm:panel-swap' 上（和系列树、归档筛选同一套）。About 与其它
 *    面板页共用 SPA 换页：fetch 目标页 → 原位替换 [data-notes-region] 的子节点，
 *    页面内的 <script> 不会重跑，所以每次换页都得重新查一次卡片。
 * 3. 离开 About 时销毁 viewer。WebGL 上下文数量有上限，来回切几次不回收，浏览器
 *    会丢掉最早的那个，表现就是「切回来一片空白」。
 *
 * 动画只取站立这一种（skinview3d 的 IdleAnimation，手臂微摆 + 呼吸感），不加行走 /
 * 奔跑 —— 这张卡是装饰，人物站着不动、随指针侧身就够了。
 */
import { media } from '../config/media';

/** 静息姿态：略侧身，正面和侧面各露一半 */
const REST_YAW = -0.4;
const REST_PITCH = 0.05;
/** 指针走到跟随半径边缘时，相对静息姿态再多转多少（弧度） */
const YAW_SWING = 0.85;
const PITCH_SWING = 0.2;
/** 跟随半径（px）：比卡片本身宽一点，指针在卡片里移动就能走完大半个行程 */
const FOLLOW_RADIUS = 260;

interface SkinCardHandle {
  card: HTMLElement;
  destroy(): void;
}

let handle: SkinCardHandle | null = null;
/** 正在等 chunk 的那张卡：防止重复调用把同一个节点启动两次 */
let booting: HTMLElement | null = null;

export function initSkinCard(): void {
  const card = document.querySelector<HTMLElement>('[data-skin-card]');
  // 换页后旧卡片已经不在文档里：先回收，再决定要不要建新的
  if (handle && (handle.card !== card || !document.contains(handle.card))) {
    handle.destroy();
    handle = null;
  }
  if (!card || handle || booting) return;
  booting = card;
  void boot(card);
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

async function boot(card: HTMLElement): Promise<void> {
  const stage = card.querySelector<HTMLElement>('[data-skin-stage]');
  const canvas = card.querySelector<HTMLCanvasElement>('[data-skin-canvas]');
  const fallback = card.querySelector<HTMLImageElement>('[data-skin-fallback]');
  if (!stage || !canvas) {
    booting = null;
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 只有真能悬停的设备才谈「跟着指针转」；触屏只播站立动画（见下）
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let viewer: import('skinview3d').SkinViewer | null = null;
  const cleanups: Array<() => void> = [];
  const teardown = (): void => {
    cleanups.splice(0).forEach((fn) => fn());
    viewer?.dispose();
    viewer = null;
  };

  try {
    const { SkinViewer, PlayerAnimation, IdleAnimation } = await import('skinview3d');
    // 等 chunk 的这段时间里可能已经换页了：节点不在文档里就别再建 WebGL 上下文
    if (!document.contains(card)) return;

    /**
     * 指针驱动的姿态。
     *
     * 转动写在 playerWrapper 上而不是相机上：skinview3d 用它把人物摆到世界中心，
     * 转它等于转「这个人」，光跟着模型走 —— 和物品栏里转动的方块是同一种观感。
     * 转相机的话光相对模型是静止的，看起来像在绕着看一张照片。
     */
    class PointerPose extends PlayerAnimation {
      private readonly idle = new IdleAnimation();
      private yaw = REST_YAW;
      private pitch = REST_PITCH;
      targetYaw = REST_YAW;
      targetPitch = REST_PITCH;

      constructor(private readonly wrapper: { rotation: { x: number; y: number } }) {
        super();
      }

      protected animate(player: import('skinview3d').PlayerObject, delta: number): void {
        this.idle.update(player, delta);
        // 指数平滑：同样的手感在 60Hz / 120Hz 上一致，掉帧也不会忽然跳一下
        const k = 1 - Math.exp(-delta * 7);
        this.yaw += (this.targetYaw - this.yaw) * k;
        this.pitch += (this.targetPitch - this.pitch) * k;
        this.wrapper.rotation.y = this.yaw;
        this.wrapper.rotation.x = this.pitch;
      }
    }

    viewer = new SkinViewer({
      canvas,
      width: stage.clientWidth || 1,
      height: stage.clientHeight || 1,
      // 3x 屏按原样渲染等于 9 倍像素，限到 2 倍肉眼没差别、显存省一半
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      fov: 40,
      zoom: 0.86,
      // 转动由指针驱动，不要 OrbitControls 那套拖拽 / 滚轮缩放
      enableControls: false,
    });

    if (reduceMotion) {
      // 减少动态效果：定格在一个好看的侧身角度，不自转也不跟随
      viewer.playerWrapper.rotation.y = REST_YAW;
      viewer.playerWrapper.rotation.x = REST_PITCH;
    } else if (canHover) {
      const pose = new PointerPose(viewer.playerWrapper);
      viewer.animation = pose;
      const onMove = (event: PointerEvent): void => {
        const rect = stage.getBoundingClientRect();
        const nx = clamp((event.clientX - (rect.left + rect.width / 2)) / FOLLOW_RADIUS, -1, 1);
        const ny = clamp((event.clientY - (rect.top + rect.height / 2)) / FOLLOW_RADIUS, -1, 1);
        pose.targetYaw = REST_YAW + nx * YAW_SWING;
        pose.targetPitch = REST_PITCH + ny * PITCH_SWING;
      };
      const rest = (): void => {
        pose.targetYaw = REST_YAW;
        pose.targetPitch = REST_PITCH;
      };
      // 指针移出浏览器窗口 / 窗口失焦时回到静息角度，不让它歪在半路上
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('blur', rest);
      document.documentElement.addEventListener('pointerleave', rest);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('blur', rest);
        document.documentElement.removeEventListener('pointerleave', rest);
      });
    } else {
      // 触屏没有 hover：只播站立动画，不转 —— 用户要的就是「站着的那个人」
      viewer.animation = new IdleAnimation();
    }

    // 画布尺寸跟着卡片走（宽度是 1/3 栏宽，随窗口变）
    const resize = (): void => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width === 0 || height === 0) return;
      viewer?.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    cleanups.push(() => resizeObserver.disconnect());

    // 卡片滚出视口（或 About 面板收起）就停掉渲染循环，别让看不见的画布吃 GPU
    const visibility = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (viewer && !viewer.disposed) viewer.renderPaused = !visible;
    });
    visibility.observe(stage);
    cleanups.push(() => visibility.disconnect());

    // 贴图到位才淡入：皮肤是 16×16 像素的画，NearestFilter 采样，不缩图
    await viewer.loadSkin(media.skin, { model: 'auto-detect' });
    if (!document.contains(card)) {
      teardown();
      return;
    }
    card.classList.add('is-ready');
    handle = { card, destroy: teardown };
  } catch (error) {
    // 拉不到 chunk / 没有 WebGL / 贴图加载失败：退回贴图本身，卡片不至于空着
    console.warn('[skin-card] 3D 预览启动失败，已退回静态贴图', error);
    teardown();
    card.classList.add('is-static');
    if (fallback) fallback.hidden = false;
  } finally {
    booting = null;
  }
}
