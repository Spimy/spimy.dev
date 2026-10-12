import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z
      .string()
      .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD'),
    context: z.string().optional(),
    summary: z.string(),
    role: z.string().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).min(1),
    links: z
      .array(
        z.object({
          label: z.enum([
            'Live',
            'Demo',
            'Code',
            'Video',
            'Design',
            'Write-up',
            'npm',
            'SpigotMC',
          ]),
          url: z.url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects };
