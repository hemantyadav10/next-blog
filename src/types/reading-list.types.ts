import * as z from 'zod';
import { apiResponseSchema } from './api.types';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

export const blogAuthorSchema = z.object({
  _id: objectIdSchema,
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().nullable().optional(),
});

export const blogListItemSchema = z.object({
  _id: objectIdSchema,
  banner: z.string(),
  blurDataUrl: z.string().optional(),
  description: z.string(),
  publishedAt: z.string().nullable().optional(),
  readTime: z.number(),
  slug: z.string(),
  title: z.string(),
  status: z.enum(['draft', 'published']),
  authorId: blogAuthorSchema,
});

export const readingListItemSchema = blogListItemSchema.extend({
  bookmarkId: objectIdSchema,
});

export const pageInfoSchema = z.object({
  totalCount: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
  nextCursor: z.string().nullable(),
});

export const getReadingListResultSchema = z.object({
  readingList: z.array(readingListItemSchema),
  pageInfo: pageInfoSchema,
});

export const ReadingListApiResponseSchema = apiResponseSchema(
  getReadingListResultSchema,
);

export type GetReadingListResult = z.infer<typeof getReadingListResultSchema>;
export type BlogAuthor = z.infer<typeof blogAuthorSchema>;
export type PageInfo = z.infer<typeof pageInfoSchema>;
export type ReadingListItem = z.infer<typeof readingListItemSchema>;
export type BlogListItem = z.infer<typeof blogListItemSchema>;
