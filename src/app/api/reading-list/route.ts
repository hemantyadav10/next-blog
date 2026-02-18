import {
  errorResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { getReadingList } from '@/lib/reading-list';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get('limit')) || 10),
    );
    const cursor = searchParams.get('cursor');

    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) return errorResponse(401, 'Authentication required');
    const { userId } = user;

    const result = await getReadingList({ limit, cursor, userId });
    return successResponse('Reading list fetched successfully', result);
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return handleApiError(error);
  }
}
