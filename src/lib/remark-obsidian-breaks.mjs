/**
 * Obsidian 的换行行为 → 站点。
 *
 * Obsidian 默认关闭「严格换行」（vault 的 .obsidian/app.json 里没有 strictLineBreaks
 * 这一项，即默认值），所以在阅读视图里**正文中的单个换行就是换行**。
 * Astro 走标准 CommonMark，单个换行会被并进同一个段落 —— 于是像
 * 「数电习题每个小题一行、行间不留空行」这种笔记，在站点上会挤成一整段。
 *
 * 这里在 mdast 上把段落文本里的 \n 换成一个 break 节点（渲染为 <br>），与 Obsidian 一致。
 *
 * 只动 text 节点，因此：
 * - 代码块 / 行内代码是 code / inlineCode 节点，不受影响；
 * - 公式是 remark-math 生成的 math / inlineMath 节点（本插件注册在其后），也不受影响；
 * - frontmatter 不在 mdast 里。
 */

/** 把含换行的 text 节点拆成 text / break 交替的序列 */
function splitTextNode(value) {
  const out = [];
  value.split('\n').forEach((part, i) => {
    if (i > 0) out.push({ type: 'break' });
    if (part) out.push({ type: 'text', value: part });
  });
  return out;
}

export default function remarkObsidianBreaks() {
  return (tree) => {
    /** 不依赖 unist-util-visit：只需要遍历带 children 的节点，手写更直观 */
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      const out = [];
      for (const child of node.children) {
        if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('\n')) {
          out.push(...splitTextNode(child.value));
          continue;
        }
        walk(child);
        out.push(child);
      }
      node.children = out;
    };
    walk(tree);
  };
}
