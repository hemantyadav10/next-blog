import * as z from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password is required'),
    newPassword: z
      .string()
      .min(1, 'New Password is required')
      .min(8, 'New Password must be at least 8 characters long')
      .max(64, 'New Password must be at most 64 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(
    ({ confirmPassword, newPassword }) => confirmPassword === newPassword,
    {
      path: ['confirmPassword'],
      error: 'Passwords donot match',
    },
  );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
