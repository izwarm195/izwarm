/**
 * 图片尺寸：Obsidian 的 `|宽度` 写法 → 站点的行内样式。
 *
 * 站点的正文图片几乎都来自 Obsidian 导出（公式 SVG、代码截图、loss 曲线），
 * 原图动辄 1200px 宽，只写 `max-width: 100%` 的话每张图都会铺满整栏 ——
 * 现在 notes.css 默认把图片压到正文栏的 66%（`--article-img-width`）。
 * 单张要不一样，最自然的入口就是 Obsidian 自己的尺寸语法（阅读视图里同样生效）：
 *
 *     ![说明|360](url)      → width: 360px
 *     ![说明|360x240](url)  → width: 360px + aspect-ratio（等比缩放，不变形）
 *     ![说明|60%](url)      → width: 60%（相对正文栏宽）
 *     ![](url)              → 不加行内样式，走 notes.css 的默认 66%
 *
 * 解析出来的尺寸写进 style，而不是 width/height 属性：属性里的百分比在部分浏览器
 * 会被当成像素，style 没有这个问题；行内 width 的优先级也高于样式表里那条默认 66%。
 * 再补一条 `max-width: 100%`，保证 `|1200` 这种写超宽的也不会顶出正文栏。
 *
 * alt 里的尺寸后缀会被剥掉，只留真正的说明文字（空则保持 alt=""，当作装饰图）。
 */

/** `说明|360`、`说明|360x240`、`说明|60%`、`说明|360px` 都认 */
const SIZE_RE = /^(.*?)\|(\d+(?:\.\d+)?)(?:x(\d+(?:\.\d+)?))?(%|px)?$/s;

function splitAlt(alt) {
  if (typeof alt !== 'string' || !alt.includes('|')) return null;
  const match = SIZE_RE.exec(alt);
  if (!match) return null;
  const [, caption, w, h, unit] = match;
  // `|0` 这种没意义的宽度不当尺寸处理，原样留给 alt
  if (!(Number(w) > 0)) return null;
  return {
    alt: caption,
    width: `${w}${unit === '%' ? '%' : 'px'}`,
    // `|360x240` 只用来定宽高比，不写死 height：手机上被 max-width 压窄时，
    // 写死 height 会把图拉变形，aspect-ratio 则等比缩
    ratio: h ? `${Number(w)} / ${Number(h)}` : null,
  };
}

export default function rehypeImageSize() {
  return (tree) => {
    /** 手写遍历（与 remark-obsidian-breaks 保持一致，不额外引 unist-util-visit） */
    const walk = (node) => {
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child);
      }
      if (node.type !== 'element' || node.tagName !== 'img') return;

      const parsed = splitAlt(node.properties?.alt);
      if (!parsed) return;

      const decls = [`width: ${parsed.width}`];
      if (parsed.ratio) decls.push(`aspect-ratio: ${parsed.ratio}`);
      // 行内 max-width 只为压掉样式表里的默认上限，图片本身仍不越出正文栏
      decls.push('max-width: 100%');

      node.properties = node.properties ?? {};
      node.properties.style = decls.join('; ');
      node.properties.alt = parsed.alt;
    };
    walk(tree);
  };
}
