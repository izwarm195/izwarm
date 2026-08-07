/**
 * 内容集合配置：为后续 Notes / Projects / Works 页面预留的
 * 最小集合定义（当前目录为空，仅消除 Astro 自动生成集合的弃用警告）。
 */
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
  }),
});

const works = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = { notes, projects, works };
