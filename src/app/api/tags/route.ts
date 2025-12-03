import {
  errorResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import { verifyAuth } from '@/lib/auth';
import { generateSimpleSlug } from '@/lib/blog';
import connectDb from '@/lib/connectDb';
import { createTagSchema } from '@/lib/schema/tagSchema';
import { isMongoError } from '@/lib/utils';
import Tag from '@/models/tagModel';
import { ApiResponse } from '@/types/api.types';
import { TagsData } from '@/types/tags.type';
import { PipelineStage } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

export async function generateUniqueSlugForTags(name: string): Promise<string> {
  const baseSlug = generateSimpleSlug(name);
  let slug = baseSlug;
  let suffix = 1;

  while (await Tag.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<TagsData>>> {
  try {
    await connectDb();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const pipeline: PipelineStage[] = [];

    if (query) {
      pipeline.push({
        $match: { name: { $regex: `^${query}`, $options: 'i' } },
      });
    }

    const aggregate = Tag.aggregate(pipeline);

    const tags = await Tag.aggregatePaginate(aggregate, {
      limit: limit,
      page: page,
      sort: { blogsCount: -1, name: 1 },
    });

    return successResponse('Tags fetched succesfully', {
      tags: tags.docs,
      totalTags: tags.totalDocs,
      limit: tags.limit,
      page: tags.page ?? page,
      totalPages: tags.totalPages,
      pagingCounter: tags.pagingCounter,
      hasPrevPage: tags.hasPrevPage,
      hasNextPage: tags.hasNextPage,
      prevPage: tags.prevPage ?? null,
      nextPage: tags.nextPage ?? null,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDb();
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) return errorResponse(401, authenticationError);

    const body = await request.json();

    const { success, data, error } = createTagSchema.safeParse(body);
    if (!success) {
      return errorResponse(
        400,
        'validation error',
        z.flattenError(error).fieldErrors,
      );
    }

    const slug = await generateUniqueSlugForTags(data.name);

    const tag = await Tag.create({
      ...data,
      createdBy: user.userId,
      slug,
    });

    return successResponse('Tag created successfully', tag, 201);
  } catch (error) {
    console.error('Error while creating tag:', error);

    if (isMongoError(error) && error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return errorResponse(
        409,
        field === 'name'
          ? 'A tag with this name already exists'
          : 'An unexpected error occurred. Please try again.',
      );
    }

    return handleApiError(error);
  }
}
