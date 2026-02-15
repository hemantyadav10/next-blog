import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
