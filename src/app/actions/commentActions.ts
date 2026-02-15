'use server';

import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import {
  CreateCommentInput,
  createCommentSchema,
  UpdateCommentInput,
  updateCommentSchema,
} from '@/lib/schema/commentSchema';
import { tiptapSanitizeConfig } from '@/lib/utils';
import { Blog, Comment } from '@/models';
import { ActionResponse } from '@/types/api.types';
import { CommentItem } from '@/types/comment.types';
import { isValidObjectId } from 'mongoose';
import { refresh } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import * as z from 'zod';

type PostCommentResponse = Omit<CommentItem, 'userId'>;

async function postComment(
  formData: CreateCommentInput,
): Promise<ActionResponse<PostCommentResponse>> {
  try {
    await connectDb();

    // Verify user authentication before proceeding
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();
    if (!isAuthenticated) {
      return { success: false, error: authenticationError };
    }

    // Validate comment input using Zod schema
    const {
      success,
      data: commentData,
      error,
    } = createCommentSchema.safeParse(formData);
    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        error: 'Validation failed',
        errors: errorDetails,
      };
    }

    // Sanitize comment html content
    const cleanCommentContent = sanitizeHtml(
      commentData.content,
      tiptapSanitizeConfig,
    );

    // Verify if blog exits and comments are enabled
    const blogExists = await Blog.findOne({
      _id: commentData.blogId,
      status: 'published',
    }).select('isCommentsEnabled');
    if (!blogExists) {
      return {
        success: false,
        error: 'Blog not found or unavailable',
      };
    }
    if (!blogExists.isCommentsEnabled) {
      return {
        success: false,
        error: 'Comments are currently turned off for this post.',
      };
    }

    // Verify parent comment exists if parentId is provided
    if (commentData.parentId) {
      const parentExists = await Comment.exists({
        _id: commentData.parentId,
        blogId: commentData.blogId,
      });
      if (!parentExists) {
        return {
          success: false,
          error: 'Invalid parent comment',
        };
      }
    }

    // Create commment
    const comment = await Comment.create({
      blogId: commentData.blogId,
      content: cleanCommentContent,
      parentId: commentData.parentId || null,
      userId: user.userId,
    });

    refresh();

    return {
      success: true,
      message: 'Comment posted successfully',
      data: {
        _id: comment._id.toString(),
        content: comment.content,
        isPinned: comment.isPinned,
        isEdited: comment.isEdited,
        isDeleted: comment.isDeleted,
        likesCount: comment.likesCount,
        replyCount: comment.replyCount,
        depth: comment.depth,
        parentId: comment.parentId?.toString() ?? null,
        rootCommentId: comment.rootCommentId.toString(),
        path: comment.path,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        visibleDescendantCount: comment.visibleDescendantCount,
      },
    };
  } catch (error) {
    console.error('Error posting comment:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

async function deleteComment(
  formData: FormData,
): Promise<ActionResponse<object>> {
  try {
    const commentId = formData.get('id');

    if (typeof commentId !== 'string' || !isValidObjectId(commentId)) {
      return { success: false, error: 'Invalid object id' };
    }

    const comment = await Comment.findById(commentId).select(
      'replyCount isDeleted parentId blogId path visibleDescendantCount',
    );

    if (!comment || comment.isDeleted) {
      return {
        success: false,
        error: 'Comment doesnot exists or has been deleted',
      };
    }

    // Hard delete: no replies, remove completely
    if (comment.visibleDescendantCount === 0) {
      await Comment.findByIdAndDelete(commentId);
    }
    // Soft delete: has replies, mark as deleted
    else {
      await Comment.findByIdAndUpdate(commentId, {
        $set: {
          content: 'Comment deleted',
          userId: null,
          likesCount: 0,
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    const decrementPromises: Promise<unknown>[] = [
      Blog.findByIdAndUpdate(comment.blogId, {
        $inc: { commentsCount: -1 },
      }),
    ];

    if (comment.parentId) {
      const ancestorIds = comment.path.split('/').slice(0, -1);

      decrementPromises.push(
        Comment.updateMany(
          { _id: { $in: ancestorIds } },
          { $inc: { visibleDescendantCount: -1 } },
        ),
      );

      decrementPromises.push(
        Comment.findByIdAndUpdate(comment.parentId, {
          $inc: { replyCount: -1 },
        }),
      );
    }

    await Promise.all(decrementPromises);

    refresh();

    return {
      success: true,
      message: 'Comment deleted successfully',
      data: {},
    };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

async function updateComment(
  formData: UpdateCommentInput,
): Promise<ActionResponse<{ commentId: string }>> {
  try {
    await connectDb();

    // Verify authentication
    const {
      error: authenticationError,
      isAuthenticated,
      user,
    } = await verifyAuth();

    if (!isAuthenticated) {
      return { success: false, error: authenticationError };
    }

    // Validate input
    const { success, data, error } = updateCommentSchema.safeParse(formData);

    if (!success) {
      const errorDetails = z.flattenError(error).fieldErrors;
      return {
        success: false,
        error: 'Validation failed',
        errors: errorDetails,
      };
    }

    // Sanitize content
    const cleanContent = sanitizeHtml(data.content, tiptapSanitizeConfig);

    // Ensure comment exists and belongs to user
    const comment = await Comment.findOne({
      _id: data.commentId,
      userId: user.userId,
      isDeleted: false,
    }).select('_id isDeleted');

    if (!comment || comment.isDeleted) {
      return {
        success: false,
        error: 'Comment not found or you are not allowed to edit it',
      };
    }

    // Update comment
    await Comment.findByIdAndUpdate(comment._id, {
      $set: {
        content: cleanContent,
        isEdited: true,
        editedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Comment updated successfully',
      data: { commentId: comment._id.toString() },
    };
  } catch (error) {
    console.error('Error updating comment:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

export { deleteComment, postComment, updateComment };
