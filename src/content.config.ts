/**
 * 内容集合配置。
 * notes 的 schema 与 docs/content-frontmatter.md 的公开 Frontmatter 规范一致，
 * 由同步脚本从 Obsidian 白名单目录生成。
 */
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    /** 创建时间（含时刻，用于同一天排序；缺省回退 publishDate） */
    createdAt: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** 多级系列路径，如 ["English", "Words Summary", "数学英语词汇"] */
    series: z.array(z.string()).default([]),
    /** 同系列内排序（可选的稳定排序权重） */
    order: z.number().optional(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
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
