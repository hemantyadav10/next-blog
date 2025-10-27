import { nanoid } from 'nanoid';
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

// Calculates estimated read time based on average reading speed (≈200 words per minute)
export function calculateReadTime(content: string): number {
  // Strip HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/).length;

  // Estimate base reading time
  const wordsPerMinute = 225;
  let minutes = words / wordsPerMinute;

  // Estimate image impact
  const imageCount = (content.match(/<img[^>]*>/g) || []).length;
  const imageTime = imageCount * 12; // 12 sec per image
  minutes += imageTime / 60;

  return Math.ceil(minutes);
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
