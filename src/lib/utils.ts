import { clientConfig } from '@/config/clientConfig';
import { clsx, type ClassValue } from 'clsx';
import crypto from 'node:crypto';
import { twMerge } from 'tailwind-merge';

const BASE_URL = clientConfig.baseUrl;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMongoError(
  error: unknown,
): error is { code: number; keyPattern: Record<string, number> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'keyPattern' in error
  );
}

export function sleep(time: number = 3000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const tiptapSanitizeConfig = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'code',
    'pre',
    'blockquote',
    'a',
    'hr',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    code: ['class'],
    pre: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedClasses: {
    a: ['text-link', 'underline', 'cursor-pointer'],
    code: ['language-*'], // Allows language-javascript, language-python, etc.
    pre: [],
  },
};

export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const getSafeRedirect = (raw: string | null): string => {
  if (!raw) return '/';

  try {
    const decoded = decodeURIComponent(raw);

    const url = new URL(decoded, BASE_URL);
    const base = new URL(BASE_URL);

    if (url.origin !== base.origin) return '/';

    return decoded;
  } catch {
    return '/';
  }
};

export const validateUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(normalized);

    if (['https:', 'http'].includes(parsed.protocol)) return null;

    return 'Only HTTP/HTTPS URLs are allowed';
  } catch (error) {
    console.error(error);

    return 'Please enter a valid URL';
  }
};
