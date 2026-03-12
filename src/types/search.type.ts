import { z } from 'zod';
import { apiResponseSchema } from './api.types';

export const searchResultSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string().datetime(),
  blurDataUrl: z.string(),
  banner: z.string(),
  authorId: z.object({
    _id: z.string(),
    username: z.string(),
  }),
});

export const searchResultsSchema = z.array(searchResultSchema);
export const searchResultsApiResponseSchema =
  apiResponseSchema(searchResultsSchema);

export type SearchResult = z.infer<typeof searchResultSchema>;
