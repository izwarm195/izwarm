// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 站点地址：静态构建时用于生成规范链接。
// 部署到其他域名时只需修改此处。
export default defineConfig({
  site: 'https://www.izwarm.top',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
