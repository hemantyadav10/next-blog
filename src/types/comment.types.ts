import * as z from 'zod';
import { apiResponseSchema } from './api.types';

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().nullable().optional(),
});

export const CommentItemSchema = z.object({
  _id: z.string(),
  content: z.string(),
  isPinned: z.boolean(),
  isEdited: z.boolean(),
  isDeleted: z.boolean(),
  likesCount: z.number(),
  replyCount: z.number(),
  depth: z.number(),
  parentId: z.string().nullable(),
  rootCommentId: z.string(),
  path: z.string(),
  userId: UserSchema.nullable(),
  editedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  visibleDescendantCount: z.number().default(0),
});

export const PageInfoSchema = z.object({
  totalCount: z.number(),
  limit: z.number(),
  cursor: z.string().nullable(),
  hasNextPage: z.boolean(),
  nextCursor: z.string().nullable(),
});

export const CommentResponseSchema = z.object({
  comments: z.array(CommentItemSchema),
  pageInfo: PageInfoSchema,
});

export const CommentApiResponseSchema = apiResponseSchema(
  CommentResponseSchema,
);
export type CommentItem = z.infer<typeof CommentItemSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
