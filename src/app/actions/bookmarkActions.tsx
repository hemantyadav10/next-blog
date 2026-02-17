'use server';

import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { Bookmark } from '@/models';
import { ActionResponse } from '@/types/api.types';
import { isValidObjectId } from 'mongoose';

type ToggleBookmarkParams = {
  blogId: string;
};

async function toggleBookmark({
  blogId,
}: ToggleBookmarkParams): Promise<ActionResponse<{ saved: boolean }>> {
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
        error: 'You must be logged in to save a post.',
      };
    }

    const userId = user.userId;

    const existing = await Bookmark.findOneAndDelete({ userId, blogId });

    if (existing) {
      return {
        success: true,
        message: 'Post removed from saved.',
        data: { saved: false },
      };
    } else {
      await Bookmark.create({ userId, blogId });
      return {
        success: true,
        message: 'Post saved successfully.',
        data: { saved: true },
      };
    }
  } catch (error) {
    console.error('Error saving post:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

export { toggleBookmark };
