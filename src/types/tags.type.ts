import * as z from 'zod';
import { apiResponseSchema } from './api.types';

export const TagSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  blogsCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
});

export const PaginationMetaSchema = z.object({
  totalTags: z.number(),
  limit: z.number(),
  page: z.number(),
  totalPages: z.number(),
  pagingCounter: z.number(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
  prevPage: z.number().nullable(),
  nextPage: z.number().nullable(),
});

export const TagsDataSchema = z
  .object({
    tags: z.array(TagSchema),
  })
  .extend(PaginationMetaSchema.shape);

export type Tag = z.infer<typeof TagSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type TagsData = z.infer<typeof TagsDataSchema>;
export const TagsApiResponseSchema = apiResponseSchema(TagsDataSchema);
export type TagsApiResponse = z.infer<typeof TagsApiResponseSchema>;

export type TagPreview = {
  _id: string;
  name: string;
  slug: string;
};

export type TagsListResponse = {
  docs: TagPreview[];
  hasNextPage: boolean;
  nextPage: number | null;
};
