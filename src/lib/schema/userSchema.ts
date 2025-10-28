import * as z from 'zod';

export const socialLinksSchema = z
  .object({
    website: z.url('Website must be a valid URL').or(z.literal('')),
    twitter: z.url('Twitter must be a valid URL').or(z.literal('')),
    github: z.url('GitHub must be a valid URL').or(z.literal('')),
    linkedin: z.url('LinkedIn must be a valid URL').or(z.literal('')),
  })
  .partial()
  .optional();

export const registerSchema = z.object({
  email: z.email('Invalid email address').trim(),

  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters long'),

  username: z
    .string('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Username can only contain letters, numbers, underscores, dots, and hyphens',
    ),

  firstName: z
    .string('First name is required')
    .min(1, 'First name cannot be empty'),

  lastName: z
    .string('Last name is required')
    .min(1, 'Last name cannot be empty'),

  timezone: z.string().min(1, 'Timezone cannot be empty').optional(),

  language: z.string().min(1, 'Language cannot be empty').optional(),

  role: z.enum(['user', 'admin'] as const, 'Invalid role value').optional(),

  phoneNumber: z
    .string()
    .regex(/^[0-9+\-() ]+$/, { error: 'Invalid phone number format' })
    .optional(),

  profilePicture: z.url('Profile picture must be a valid URL').optional(),

  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),

  socialLinks: socialLinksSchema,

  isEmailVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),

  emailVerificationToken: z.string().optional(),
  emailVerificationExpires: z.union([z.date(), z.iso.datetime()]).optional(),

  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.union([z.date(), z.iso.datetime()]).optional(),

  loginAttempts: z.number().int().nonnegative().optional(),
  lastLoginAt: z.union([z.date(), z.iso.datetime()]).optional(),
  lastLoginIp: z.union([z.ipv4(), z.ipv6()]).optional(),
  lockUntil: z.union([z.date(), z.iso.datetime()]).optional(),
  refreshToken: z.string().optional(),

  createdAt: z.union([z.date(), z.iso.datetime()]).optional(),
  updatedAt: z.union([z.date(), z.iso.datetime()]).optional(),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address').trim(),
  password: z.string().min(1, 'Password is required'),
});

export type IUser = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
