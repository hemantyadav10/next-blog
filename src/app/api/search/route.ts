import { handleApiError, successResponse } from '@/lib/api-helpers';
import connectDb from '@/lib/connectDb';
import { Blog } from '@/models';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const q = searchParams.get('q');

    await connectDb();

    if (!q) return successResponse('No search query provided', []);

    const results = await Blog.find(
      { status: 'published', $text: { $search: q } },
      { score: { $meta: 'textScore' } },
    )
      .sort({ score: { $meta: 'textScore' } })
      .select('title slug banner authorId blurDataUrl publishedAt')
      .populate('authorId', 'username')
      .limit(5)
      .lean();

    return successResponse('Search results fetched successfully', results);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return handleApiError(error);
  }
}
