import { Blog } from '@/models';
import type { BlogListItem } from '@/types/blog.types';
import { AggregatePaginateResult, PipelineStage, SortValues } from 'mongoose';
import { nanoid } from 'nanoid';
import { Value } from 'platejs';
import { Node } from 'slate';
import slugify from 'slugify';
import connectDb from './connectDb';

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

// Fetches all blogs wiith searching, filtering and sorting functionality
export const getAllBlogs = async ({
  query,
  sortBy,
  sortOrder,
  limit = 12,
  page = 1,
}: {
  query?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
}): Promise<AggregatePaginateResult<BlogListItem>> => {
  await connectDb();

  let sortOption: Record<string, SortValues | { $meta: string }> = {};

  if (sortBy && sortOrder) {
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'popularity') {
      // TODO: Implement popularity sorting based on engagement metrics (views/likes/comments)
      sortOption = { title: 1 };
    } else if (sortBy === 'publishedAt') {
      sortOption = { publishedAt: order };
    } else {
      sortOption = { publishedAt: -1 };
    }
  } else if (query) {
    sortOption = { score: { $meta: 'textScore' } };
  } else {
    sortOption = { publishedAt: -1 };
  }

  const pipeline: PipelineStage[] = [];

  if (query && typeof query === 'string') {
    pipeline.push({
      $match: {
        $text: { $search: query },
      },
    });
  }

  pipeline.push(
    { $match: { status: 'published' } },
    {
      $lookup: {
        from: 'users',
        foreignField: '_id',
        localField: 'authorId',
        as: 'authorId',
        pipeline: [
          {
            $project: {
              username: 1,
              firstName: 1,
              lastName: 1,
              profilePicture: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        authorId: { $first: '$authorId' },
      },
    },
    {
      $project: {
        authorId: 1,
        banner: 1,
        blurDataUrl: 1,
        description: 1,
        publishedAt: 1,
        readTime: 1,
        slug: 1,
        title: 1,
      },
    },
  );

  const aggregate = Blog.aggregate<BlogListItem>(pipeline);

  const result = await Blog.aggregatePaginate(aggregate, {
    sort: sortOption,
    limit,
    page,
  });

  return result;
};
