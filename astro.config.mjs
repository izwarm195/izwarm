// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMathLatex from './src/lib/rehype-math-latex.mjs';
import remarkObsidianBreaks from './src/lib/remark-obsidian-breaks.mjs';

// 站点地址：静态构建时用于生成规范链接。
// 部署到其他域名时只需修改此处。
// 部署到子路径（如 GitHub Pages 的 /izwarm/）时设置环境变量 ASTRO_BASE。
export default defineConfig({
  site: 'https://www.izwarm.top',
  base: process.env.ASTRO_BASE ?? '',
  markdown: {
    remarkPlugins: [
      [
        remarkMath,
        {
          singleDollarTextMath: true,
        },
      ],
      // 必须在 remark-math 之后：先把 $$…$$ 变成 math 节点，再补换行，
      // 多行公式才不会被插进 <br>
      remarkObsidianBreaks,
    ],
    rehypePlugins: [
      rehypeMathLatex,
      [
        rehypeKatex,
        {
          // 只用视觉 HTML：KaTeX 的 MathML 副本在部分 Chromium 版本里会因
          // clip-path 失效而显示出来，造成“公式以不同字体重复一遍”。
          output: 'html',
          throwOnError: false,
          strict: 'warn',
          trust: false,
          errorColor: '#d98b8b',
          fleqn: false,
          leqno: false,
        },
      ],
    ],
  },
});
