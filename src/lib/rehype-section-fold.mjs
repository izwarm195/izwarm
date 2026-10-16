/**
 * rehype：把正文按标题层级切成可折叠的分节单元。
 *
 * 输出结构（h1–h6 都是折叠单元，层级按 depth 嵌套，跳级挂到最近的更高级标题下）：
 *
 *   <div class="art-sec">
 *     <h2 id="…"><button class="art-sec-toggle" aria-expanded="true"></button>标题</h2>
 *     <div class="art-sec-body"><div class="art-sec-inner">…本节内容…</div></div>
 *   </div>
 *
 * 三条设计约束，改这里之前先看清楚：
 *
 * 1. **标题留在折叠体外面**。收起时标题只变灰、不消失，所以它不能进被裁剪的那一层；
 *    同时标题自己的上下外边距要和折叠前后一样跟相邻元素折叠 —— 包一层 div 会挡住
 *    外边距穿透，所以内容那两层（.art-sec-body / .art-sec-inner）必须留出标题这一级。
 *
 * 2. **没有 JS 时就是一篇普通文章**。插件只输出结构，不写 display:none、不带 is-collapsed；
 *    收起状态全部由前端脚本加 class 产生，禁用 JS 时正文照样全文可见。
 *
 * 3. **不在正文里加任何文字**。大纲（scripts/panel-nav.ts 的 initTocMath）会把标题节点克隆
 *    进目录，按钮里的字会跟着漏进目录标题；所以按钮图标走 CSS ::before，只有 aria-label。
 *
 * 第一个标题之前的引言不折叠，原样留在 root 下。
 */

/** h1–h6 的层级数字；不是标题返回 0 */
function headingDepth(node) {
  if (node?.type !== 'element') return 0;
  const match = /^h([1-6])$/.exec(node.tagName);
  return match ? Number(match[1]) : 0;
}

/** 标题右侧的展开 / 收起按钮（无文本，图标见 notes.css 的 ::before） */
function toggleButton() {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      type: 'button',
      className: ['art-sec-toggle'],
      ariaExpanded: 'true',
      ariaLabel: '收起本节',
      title: '收起 / 展开本节',
    },
    children: [],
  };
}

export default function rehypeSectionFold() {
  return (tree) => {
    const children = Array.isArray(tree.children) ? tree.children : [];
    if (!children.some((child) => headingDepth(child) > 0)) return;

    const root = { type: 'root', children: [] };
    /** 已打开的分节栈：{ depth, content }，content 是本节的子节点数组 */
    const stack = [];

    const append = (node) => {
      const top = stack[stack.length - 1];
      (top ? top.content : root.children).push(node);
    };

    for (const child of children) {
      const depth = headingDepth(child);
      if (depth === 0) {
        append(child);
        continue;
      }
      // 与 lib/toc.ts 的建树规则一致：同级或更高级的标题先关掉，不凭空造层级
      while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop();

      const content = [];
      const section = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['art-sec'] },
        children: [
          { ...child, children: [toggleButton(), ...(child.children ?? [])] },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['art-sec-body'] },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: { className: ['art-sec-inner'] },
                children: content,
              },
            ],
          },
        ],
      };
      append(section);
      stack.push({ depth, content });
    }

    tree.children = root.children;
  };
}
