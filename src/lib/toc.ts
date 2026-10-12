/**
 * 文章大纲：把 Astro 给出的扁平标题列表折成嵌套结构（大纲里次级标题可展开/收缩）。
 *
 * 这里只做结构，不碰标题文本：headings[].text 是渲染后拍平的纯文本
 * （`$\varphi$` 会变成 φ、`` `x` `` 会留下反引号），构建期拿不回公式源，
 * 所以标签内容由前端从正文标题节点克隆（见 scripts/panel-nav.ts 的 initTocMath）。
 */
import type { TocItem } from './notes';

export interface TocNode extends TocItem {
  children: TocNode[];
}

/**
 * 扁平标题（正文顺序、depth 不保证连续）→ 树。
 * depth 跳级（`#` 后面直接跟 `###`）时挂到最近的更高级标题下，不凭空造层级。
 */
export function buildTocTree(items: TocItem[]): TocNode[] {
  const roots: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const item of items) {
    const node: TocNode = { ...item, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) stack.pop();
    const parent = stack[stack.length - 1];
    (parent ? parent.children : roots).push(node);
    stack.push(node);
  }
  return roots;
}
