'use server';

import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { Blog, Like } from '@/models';
import { ActionResponse } from '@/types/api.types';
import { isValidObjectId } from 'mongoose';

type ToggleLikeProps = {
  blogId: string;
};

async function toggleLike({
  blogId,
}: ToggleLikeProps): Promise<ActionResponse<{ liked: boolean }>> {
  try {
    if (!isValidObjectId(blogId))
      return {
        success: false,
        error: 'Invalid Blog Id',
      };

    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'You must be logged in to like a post.',
      };
    }

    const userId = user.userId;

    const existing = await Like.findOneAndDelete({ userId, blogId });

    if (existing) {
      await Blog.findByIdAndUpdate(blogId, { $inc: { likesCount: -1 } });
      return {
        success: true,
        message: 'Unliked successfully.',
        data: { liked: false },
      };
    } else {
      await Like.create({ userId, blogId });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likesCount: 1 } });

      return {
        success: true,
        message: 'Post Liked successfully.',
        data: { liked: true },
      };
    }
  } catch (error) {
    console.error('Error liking post:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

export { toggleLike };
