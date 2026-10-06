/**
 * 媒体资源统一配置。
 *
 * 当前从本地 public/media/ 目录加载媒体（Astro 会把 public/ 下的文件
 * 原样输出到站点根路径，页面通过 /media/... 访问）。
 *
 * 以后要切换媒体源（原 WordPress 地址、对象存储或独立 CDN）时，
 * 只需修改本文件，页面与脚本无需改动。
 */

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const MEDIA_BASE = base + '/media';

/** public/media/icons 下的图标（Zest Interface Icons，MIT，见同目录 LICENSE-Zest.txt）。
 *  图标本身是纯黑描边，页面上靠 CSS filter: invert() 变浅色。
 *  external-link.svg 是自绘的（Zest 这一版没有外链图标），同样纯黑描边，供友链卡「访问」按钮用。 */
export const icon = (name: string): string => `${MEDIA_BASE}/icons/${name}.svg`;

export const media = {
  avatar: base + '/avatar.svg',
  profile: `${MEDIA_BASE}/profile.jpg`,
  bilibiliIcon: `${MEDIA_BASE}/bilibili.svg`,
  neteaseIcon: `${MEDIA_BASE}/netease-cloud-music.svg`,
  logo: `${MEDIA_BASE}/logo.png`,
  logoIz: `${MEDIA_BASE}/iz.png`,
  logoW: `${MEDIA_BASE}/w.png`,
  logoA: `${MEDIA_BASE}/a.png`,
  logoR: `${MEDIA_BASE}/r.png`,
  logoM: `${MEDIA_BASE}/m.png`,
  // 仅保留深色背景视频：浅色视频从未被使用（站点固定 data-theme="dark"），
  // 删除后首屏不再可能为无用的第二个 5.8MB 视频发起加载
  darkVideo: `${MEDIA_BASE}/Obsidian-Loop-Dark.mp4`,
  darkPoster: `${MEDIA_BASE}/video-cover-dark.jpg`,
  ambientAudio: `${MEDIA_BASE}/ambient-loop.mp3`,
  expandAudio: `${MEDIA_BASE}/Web_expand.mp3`,
  collapseAudio: `${MEDIA_BASE}/Web_dexpand.mp3`,
  // 爱发电收款卡：由 afdian-izwarm.jpg 裁掉外围紫框后导出（只保留圆角矩形卡片，
  // 四角透明）。原图保留在同一目录作为改图来源。
  afdianCard: `${MEDIA_BASE}/afdian-card.png`,
} as const;
