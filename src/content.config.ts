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
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(),
    section: z.string().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['published', 'archived', 'draft']).default('published'),
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
