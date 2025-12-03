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
