import * as z from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(5000, 'Comment cannot exceed 5000 characters'),
});

export const createCommentSchema = commentSchema.extend({
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(5000, 'Comment cannot exceed 5000 characters'),
  blogId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid blog ID'),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent comment ID')
    .optional()
    .nullable(),
});

export const updateCommentSchema = commentSchema.extend({
  commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid blog ID'),
});

export type CommentInput = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
