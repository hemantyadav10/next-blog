'use server';

import connectDb from '@/lib/connectDb';
import { Follow } from '@/models';
import { FollowDocument } from '@/models/followModel';
import { ActionResponse } from '@/types/api.types';
import {
  AuthorFollowerResponse,
  AuthorFollowingResponse,
} from '@/types/follower.types';
import { FilterQuery, isValidObjectId } from 'mongoose';

export const getAllFollowers = async ({
  limit = 12,
  page = 1,
  authorId,
}: {
  limit?: number;
  page?: number;
  authorId: string;
}): Promise<ActionResponse<AuthorFollowerResponse>> => {
  try {
    await connectDb();

    if (!isValidObjectId(authorId)) {
      return {
        success: false,
        error: 'Invalid author Id',
      };
    }

    const filter: FilterQuery<FollowDocument> = { followingId: authorId };

    const skip = (page - 1) * limit;

    let totalDocs: number | undefined;
    let followers;
    const baseQuery = () => {
      return Follow.find(filter)
        .populate(
          'followerId',
          'username firstName lastName profilePicture bio',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit + 1)
        .lean();
    };

    if (page === 1) {
      const [totalDocsResponse, followersResponse] = await Promise.all([
        Follow.countDocuments(filter),
        baseQuery(),
      ]);
      followers = followersResponse;
      totalDocs = totalDocsResponse;
    } else {
      followers = await baseQuery();
    }

    const hasNextPage = followers.length > limit;
    if (hasNextPage) followers.pop();
    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(followers)),
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        ...(totalDocs !== undefined && { totalDocs }),
      },
    };
  } catch (error) {
    console.error('Error fetching followers:', error);

    return {
      success: false,
      error: 'Failed to load followers. Please try again.',
    };
  }
};

export const getAllFollowings = async ({
  limit = 12,
  page = 1,
  authorId,
}: {
  limit?: number;
  page?: number;
  authorId: string;
}): Promise<ActionResponse<AuthorFollowingResponse>> => {
  try {
    await connectDb();

    if (!isValidObjectId(authorId)) {
      return {
        success: false,
        error: 'Invalid author Id',
      };
    }

    const filter: FilterQuery<FollowDocument> = { followerId: authorId };

    const skip = (page - 1) * limit;

    let totalDocs: number | undefined;
    let followings;
    const baseQuery = () => {
      return Follow.find(filter)
        .populate(
          'followingId',
          'username firstName lastName profilePicture bio',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit + 1)
        .lean();
    };

    if (page === 1) {
      const [totalDocsResponse, followingsResponse] = await Promise.all([
        Follow.countDocuments(filter),
        baseQuery(),
      ]);
      followings = followingsResponse;
      totalDocs = totalDocsResponse;
    } else {
      followings = await baseQuery();
    }

    const hasNextPage = followings.length > limit;
    if (hasNextPage) followings.pop();
    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(followings)),
        hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        ...(totalDocs !== undefined && { totalDocs }),
      },
    };
  } catch (error) {
    console.error('Error fetching followings:', error);

    return {
      success: false,
      error: 'Failed to load followings. Please try again.',
    };
  }
};
