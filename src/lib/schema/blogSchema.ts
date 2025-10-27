import * as z from 'zod';

export const createBlogSchema = z.object({
  banner: z.url('Invalid URL format').optional(),
  status: z.enum(['published', 'draft']).default('draft'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters'),
  content: z.string().min(1, 'Content is required'),
  tags: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid tag ObjectId'))
    .min(1, 'At least one tag is required')
    .max(5, 'A maximum of 5 tags are allowed')
    .default([]),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ObjectId'),
  isCommentsEnabled: z.boolean().optional().default(true),
});
