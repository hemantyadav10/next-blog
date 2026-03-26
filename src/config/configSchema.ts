// config/configSchema.ts
import { z } from 'zod';

export const configSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1).startsWith('mongodb'),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  // App
  NEXT_PUBLIC_BASE_URL: z.url(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // Email (Resend)
  RESEND_API_KEY: z.string().min(1),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

export type Config = z.infer<typeof configSchema>;
