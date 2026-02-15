import {
  errorResponse,
  handleApiError,
  successResponse,
} from '@/lib/api-helpers';
import connectDb from '@/lib/connectDb';
import { Comment } from '@/models';
import type { CommentDocument } from '@/models/commentModel';
import { ApiResponse } from '@/types/api.types';
import { FilterQuery, isValidObjectId } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// /api/blogs/[id]/comments/[commentId]/replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDb();
    const { id: blogId, commentId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.max(
      1,
      Math.min(100, Number(searchParams.get('limit')) || 5),
    );
    const cursor = searchParams.get('cursor');

    if (!isValidObjectId(blogId)) {
      return errorResponse(400, 'Invalid blog ID');
    }

    if (!isValidObjectId(commentId)) {
      return errorResponse(400, 'Invalid comment ID');
    }

    const parentComment = await Comment.findOne({ _id: commentId, blogId })
      .select('depth')
      .lean();

    if (!parentComment) return errorResponse(404, 'Parent comment not found');

    const query: FilterQuery<CommentDocument> = {
      blogId,
      parentId: commentId,
      depth: parentComment.depth + 1,
      $or: [
        { isDeleted: false },
        { isDeleted: true, visibleDescendantCount: { $gt: 0 } },
      ],
    };

    let paginatedQuery: FilterQuery<CommentDocument> = query;

    if (cursor) {
      if (!isValidObjectId(cursor)) {
        return errorResponse(400, 'Invalid cursor');
      }
      paginatedQuery = { ...query, _id: { $lt: cursor } };
    }

    const [comments, totalCount] = await Promise.all([
      Comment.find(paginatedQuery)
        .populate('userId', 'username firstName lastName profilePicture')
        .select(
          'content userId isPinned isEdited editedAt likesCount replyCount parentId rootCommentId path createdAt updatedAt isDeleted deletedAt depth visibleDescendantCount',
        )
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean(),
      Comment.countDocuments(query),
    ]);

    const hasNextPage = comments.length > limit;
    const blogComments = hasNextPage ? comments.slice(0, -1) : comments;

    const nextCursor =
      hasNextPage && blogComments.length > 0
        ? blogComments[blogComments.length - 1]._id.toString()
        : null;

    return successResponse('Replies fetched successfully', {
      comments: blogComments,
      pageInfo: {
        totalCount,
        limit,
        cursor,
        hasNextPage,
        nextCursor,
      },
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return handleApiError(error);
  }
}
