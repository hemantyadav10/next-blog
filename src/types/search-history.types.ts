import * as z from 'zod';
import { apiResponseSchema } from './api.types';

export const searchHistoryItemSchema = z
  .array(z.string())
  .max(5, 'queries cannot exceed 5 items');

export const SearchHistoryApiResponseSchema = apiResponseSchema(
  searchHistoryItemSchema,
);
