import * as z from 'zod';

export const apiResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: schema.optional(),
  });

export const apiErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string()).optional()).optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type ActionResponse<T, V extends string = string> =
  | { success: true; data: T; message?: string }
  | {
      success: false;
      error: string;
      errors?: Partial<Record<V, string[]>>;
    };

export type PaginatedResponse<T> = {
  docs: T;
  hasNextPage: boolean;
  nextPage: number | null;
  totalDocs?: number;
};
