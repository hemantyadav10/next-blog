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

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
