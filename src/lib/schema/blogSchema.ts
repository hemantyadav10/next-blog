import { JSONContent } from '@tiptap/react';
import * as z from 'zod';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_CONTENT_LENGTH = 100_000;

const getTiptapText = (node: JSONContent): string => {
  if (node.text) return node.text;
  if (!node.content) return '';
  return node.content.map(getTiptapText).join(' ');
};

const fileSchema = z
  .instanceof(File, { message: 'Banner image is required' })
  .refine((file) => file.size > 0, 'Banner image is required')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  )
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    'Only JPEG, PNG, and WebP images are allowed',
  );

const urlSchema = z.url('Invalid image URL');

export const createBlogSchema = z.object({
  banner: z.union([fileSchema, urlSchema], {
    error: 'Banner image is required',
  }),

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
    .max(160, 'Meta description must be at most 160 characters')
    .optional(),

  content: z
    .custom<JSONContent>()
    .refine((val) => val?.content && getTiptapText(val).trim().length > 0, {
      message: 'Content is required and cannot be empty',
    })
    .refine((val) => getTiptapText(val).length <= MAX_CONTENT_LENGTH, {
      message: `Content is too long (max ${MAX_CONTENT_LENGTH.toLocaleString()} characters)`,
    }),

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
