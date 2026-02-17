import { Bookmark } from '@/models';
import { isValidObjectId } from 'mongoose';
import { verifyAuth } from './auth';
import connectDb from './connectDb';

const isBlogBookmarked = async (blogId: string): Promise<boolean> => {
  try {
    if (!isValidObjectId(blogId)) throw new Error('Invalid blog id');

    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) return false;

    const isBookmarked = await Bookmark.exists({ blogId, userId: user.userId });

    return Boolean(isBookmarked);
  } catch (error) {
    console.error('isBlogBookmarked failed:', error);
    return false;
  }
};

export { isBlogBookmarked };
