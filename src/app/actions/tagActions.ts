'use server';

import connectDb from '@/lib/connectDb';
import { Tag } from '@/models';
import { TagDocument } from '@/models/tagModel';
import { ActionResponse } from '@/types/api.types';
import { TagsListResponse } from '@/types/tags.type';
import { FilterQuery, SortValues } from 'mongoose';

export const getAllTags = async ({
  query,
  sortBy,
  sortOrder,
  limit = 20,
  page = 1,
}: {
  query?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
}): Promise<ActionResponse<TagsListResponse>> => {
  try {
    await connectDb();
    const filter: FilterQuery<TagDocument> = {};

    if (query && typeof query === 'string') {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: `^${escapedQuery}`, $options: 'i' };
    }

    let sortOption: Record<string, SortValues> = {};

    if (sortBy && sortOrder) {
      const order = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'popularity') {
        // TODO: Implement popularity sorting
        sortOption = { name: 1 };
      } else if (sortBy === 'publishedAt') {
        sortOption = { createdAt: order };
      } else {
        sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const totalDocs = await Tag.countDocuments(filter);

    const tags = await Tag.find(filter)
      .select('name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(tags)),
        hasNextPage: skip + limit < totalDocs,
        nextPage: skip + limit < totalDocs ? page + 1 : null,
      },
    };
  } catch (error) {
    console.error('Error fetching tags:', error);

    return {
      success: false,
      error: 'Failed to fetch tags. Please try again.',
    };
  }
};
