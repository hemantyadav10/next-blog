import {
  errorResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { SearchHistory } from '@/models';

export async function GET() {
  try {
    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) return errorResponse(401, 'Authentication required');
    const { userId } = user;

    const searchHistory = await SearchHistory.findOne(
      { userId },
      { queries: 1, _id: 0 },
    ).lean();

    return successResponse(
      'Search history fetched successfully',
      searchHistory?.queries ?? [],
    );
  } catch (error) {
    console.error('Error fetching search history:', error);
    return handleApiError(error);
  }
}
