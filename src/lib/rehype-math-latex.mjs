/**
 * rehype-katex 之前运行：把行间公式包一层 <span class="math-block" data-latex="...">。
 * rehype-katex 会整体替换内层的 math 元素，但外层壳保留原始 LaTeX 源码，
 * 前端复制按钮据此复制公式源码。
 */
import { SKIP, visitParents } from 'unist-util-visit-parents';
import { toText } from 'hast-util-to-text';

export default function rehypeMathLatex() {
  return (tree) => {
    visitParents(tree, 'element', (node, parents) => {
      const classes = Array.isArray(node.properties?.className) ? node.properties.className : [];
      if (!classes.includes('math-display')) return;
      // 块级公式由 remark-math 生成为 <pre><code class="language-math math-display">，
      // 需要包住整个 <pre>：rehype-katex 会整体替换 pre；若只包 code，pre 会残留，
      // 导致公式外多一圈代码块样式和重复的复制按钮。
      const parent = parents[parents.length - 1];
      let target = node;
      if (node.tagName === 'code' && classes.includes('language-math') && parent?.type === 'element' && parent.tagName === 'pre') {
        target = parent;
      }
      const holder = parents[parents.length - 2];
      // 根层级的块公式直接挂在 root 下，holder 允许为 root
      if (!holder || !Array.isArray(holder.children)) return;
      const index = holder.children.indexOf(target);
      if (index < 0) return;
      holder.children[index] = {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['math-block'],
          dataLatex: toText(node, { whitespace: 'pre' }),
        },
        children: [target],
      };
      return SKIP;
    });
  };
}
