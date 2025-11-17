import * as z from 'zod';

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .lowercase()
    .min(1, 'Name is required')
    .max(50, 'Name must be at most 50 characters'),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
