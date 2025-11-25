import { Value } from 'platejs';
import { Node } from 'slate';
import * as z from 'zod';

// File type whitelist
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const createBlogSchema = z.object({
  banner: z
    .instanceof(File, { message: 'Banner image is required' })
    .refine((file) => file.size > 0, 'Banner image is required')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed',
    ),

  status: z.enum(['published', 'draft']),

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

  metaDescription: z
    .string()
    .trim()
    .max(160, 'Meta Description must be at most 160 characters')
    .optional(),

  content: z.custom<Value>(
    (val) => {
      if (!Array.isArray(val) || val.length === 0) return false;

      if (val.length > 1000) return false;

      const textContent = val.map((n) => Node.string(n)).join('');
      if (textContent.trim().length === 0) return false;

      if (textContent.length > 100000) return false;

      return true;
    },
    { message: 'Content is required and must be valid' },
  ),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Tag cannot be empty')
        .max(30, 'Tag must be at most 30 characters')
        .regex(
          /^[a-z0-9-]+$/,
          'Tags can only contain lowercase letters, numbers, and hyphens',
        ),
    )
    .min(1, 'At least one tag is required')
    .max(5, 'A maximum of 5 tags are allowed')
    .transform((tags) => [
      ...new Set(tags.map((tag) => tag.trim().toLowerCase())),
    ]),

  categoryId: z
    .string()
    .min(1, 'Category is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ObjectId'),

  isCommentsEnabled: z.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
