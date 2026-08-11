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

export const media = {
  avatar: base + '/avatar.svg',
  profile: `${MEDIA_BASE}/profile.png`,
  bilibiliIcon: `${MEDIA_BASE}/bilibili.svg`,
  neteaseIcon: `${MEDIA_BASE}/netease-cloud-music.svg`,
  logo: `${MEDIA_BASE}/logo.png`,
  logoIz: `${MEDIA_BASE}/iz.png`,
  logoW: `${MEDIA_BASE}/w.png`,
  logoA: `${MEDIA_BASE}/a.png`,
  logoR: `${MEDIA_BASE}/r.png`,
  logoM: `${MEDIA_BASE}/m.png`,
  darkVideo: `${MEDIA_BASE}/Obsidian-Loop-Dark.mp4`,
  lightVideo: `${MEDIA_BASE}/Obsidian-Loop-Light.mp4`,
  darkPoster: `${MEDIA_BASE}/video-cover-dark.png`,
  lightPoster: `${MEDIA_BASE}/video-cover-light.png`,
  ambientAudio: `${MEDIA_BASE}/ambient-loop.mp3`,
  expandAudio: `${MEDIA_BASE}/Web_expand.mp3`,
  collapseAudio: `${MEDIA_BASE}/Web_dexpand.mp3`,
} as const;
