import { nanoid } from 'nanoid';
import { Value } from 'platejs';
import { Node } from 'slate';
import slugify from 'slugify';

// Generates a unique URL-friendly slug from title with random suffix
export function generateUniqueSlug(title: string): string {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const id = nanoid(8);

  return `${baseSlug}-${id}`;
}

export function generateSimpleSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function calculateReadTime(blocks: Value): number {
  const plainText = blocks
    .map((n) => Node.string(n))
    .join('\n')
    .trim();

  // Count words using regex
  const wordCount = plainText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const wordsPerMinute = 225;
  const minutes = wordCount / wordsPerMinute;

  // Always at least 1 min
  return Math.max(1, Math.ceil(minutes));
}

// Generates a meta description from content
export function generateMetaDescription(content: string, maxLength = 160) {
  // Strip HTML tags if needed
  const text = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;

  // Cut at the last full word before maxLength
  return text.slice(0, maxLength).replace(/\s+\S*$/, '');
}
