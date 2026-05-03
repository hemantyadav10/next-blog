import { z } from 'zod';

export const googleTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().int().positive(),
  id_token: z.string(),
  scope: z.string(),
  token_type: z.literal('Bearer'),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().int().positive().optional(),
});

export const googleIdTokenPayloadSchema = z.object({
  iss: z.union([
    z.literal('https://accounts.google.com'),
    z.literal('accounts.google.com'),
  ]),
  sub: z.string().min(1).max(255),
  azp: z.string().min(1).optional(),
  aud: z.string().min(1),
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
  nonce: z.string().min(1).optional(),
  auth_time: z.number().int().positive().optional(),
  at_hash: z.string().min(1).optional(),
  email: z.email().optional(),
  email_verified: z.boolean().optional(),
  name: z.string().min(1).optional(),
  picture: z.url().optional(),
  given_name: z.string().min(1).optional(),
  family_name: z.string().min(1).optional(),
  hd: z.string().min(1).optional(),
});

export type GoogleIdTokenPayload = z.infer<typeof googleIdTokenPayloadSchema>;
export type GoogleTokenResponse = z.infer<typeof googleTokenResponseSchema>;
