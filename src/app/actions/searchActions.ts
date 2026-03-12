'use server';

import { verifyAuth } from '@/lib/auth';
import connectDb from '@/lib/connectDb';
import { SearchHistory } from '@/models';
import { ActionResponse } from '@/types/api.types';

export async function addToSearchHistory(
  query: string,
): Promise<ActionResponse<string[]>> {
  try {
    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const userId = user.userId;

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return { success: false, error: 'Query cannot be empty' };
    }

    await SearchHistory.findOneAndUpdate(
      { userId },
      { $pull: { queries: normalizedQuery } },
    );

    const newSearchHistory = await SearchHistory.findOneAndUpdate(
      { userId },
      {
        $push: {
          queries: { $each: [normalizedQuery], $position: 0, $slice: 5 },
        },
      },
      { upsert: true, new: true },
    );

    return {
      success: true,
      message: 'Query added to search history',
      data: newSearchHistory.queries,
    };
  } catch (error) {
    console.error('Error adding to search history:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}

export async function removeFromSearchHistory(
  query: string,
): Promise<ActionResponse<string[]>> {
  try {
    await connectDb();

    const { isAuthenticated, user } = await verifyAuth();
    if (!isAuthenticated) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const userId = user.userId;

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return { success: false, error: 'Query cannot be empty' };
    }

    const updatedHistory = await SearchHistory.findOneAndUpdate(
      { userId },
      { $pull: { queries: normalizedQuery } },
      { new: true },
    );

    if (!updatedHistory)
      return { success: false, error: 'Search history not found' };

    return {
      success: true,
      message: 'Query removed from search history',
      data: updatedHistory.queries,
    };
  } catch (error) {
    console.error('Error removing from search history:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again',
    };
  }
}
