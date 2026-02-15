import {
  errorResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import connectDb from '@/lib/connectDb';
import { Comment } from '@/models';
import type { CommentDocument } from '@/models/commentModel';
import { UserType } from '@/models/userModel';
import { ApiResponse } from '@/types/api.types';
import { FilterQuery, isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// /api/blogs/[id]/comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDb();
    const { id: blogId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get('limit')) || 10),
    );
    const cursor = searchParams.get('cursor');

    if (!isValidObjectId(blogId)) {
      return errorResponse(400, 'Invalid blog ID');
    }

    // Fetch top-level comments, including deleted ones only if they still have replies
    const query: FilterQuery<CommentDocument> = {
      blogId,
      depth: 0,
      $or: [
        { isDeleted: false },
        { isDeleted: true, visibleDescendantCount: { $gt: 0 } },
      ],
    };

    if (cursor) {
      if (!isValidObjectId(cursor)) {
        return errorResponse(400, 'Invalid cursor');
      }
      query._id = { $lt: cursor };
    }

    const comments = await Comment.find(query)
      .populate<{
        userId: Pick<
          UserType,
          'username' | 'firstName' | 'lastName' | 'profilePicture' | '_id'
        >;
      }>('userId', 'username firstName lastName profilePicture _id')
      .select(
        'content userId isPinned isEdited editedAt likesCount replyCount parentId rootCommentId path createdAt updatedAt isDeleted deletedAt depth _id visibleDescendantCount',
      )
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = comments.length > limit;
    const blogComments = hasNextPage ? comments.slice(0, -1) : comments;

    const nextCursor =
      hasNextPage && blogComments.length > 0
        ? blogComments[blogComments.length - 1]._id.toString()
        : null;

    return successResponse('Comments fetched successfully', {
      comments: blogComments,
      pageInfo: {
        totalCount: await Comment.countDocuments(query),
        limit,
        cursor,
        hasNextPage,
        nextCursor,
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return handleApiError(error);
  }
}
