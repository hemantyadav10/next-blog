import { Bookmark } from '@/models';
import type { BookMarkDocument } from '@/models/bookmarkModel';
import {
  type BlogListItem,
  type GetReadingListResult,
} from '@/types/reading-list.types';
import { FilterQuery, isValidObjectId } from 'mongoose';
import connectDb from './connectDb';
export type ReadingListParams = {
  limit?: number;
  cursor?: string | null;
  userId: string;
};

export async function getReadingList({
  limit = 10,
  cursor,
  userId,
}: ReadingListParams): Promise<GetReadingListResult> {
  await connectDb();

  const baseQuery: FilterQuery<BookMarkDocument> = { userId };
  const paginatedQuery: FilterQuery<BookMarkDocument> = { ...baseQuery };

  if (cursor) {
    if (!isValidObjectId(cursor)) throw new Error('Invalid cursor');
    paginatedQuery._id = { $lt: cursor };
  }

  const [bookmarks, totalCount] = await Promise.all([
    Bookmark.find(paginatedQuery)
      .populate<{ blogId: BlogListItem }>({
        path: 'blogId',
        select:
          '_id banner blurDataUrl description publishedAt readTime slug title status',
        populate: {
          path: 'authorId',
          select: 'username firstName lastName profilePicture _id',
        },
      })
      .select('_id blogId')
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean(),
    Bookmark.countDocuments(baseQuery),
  ]);

  const hasNextPage = bookmarks.length > limit;
  const readingListItems = (
    hasNextPage ? bookmarks.slice(0, -1) : bookmarks
  ).map((b) => ({ bookmarkId: b._id, ...b.blogId }));

  const nextCursor =
    hasNextPage && readingListItems.length > 0
      ? readingListItems[readingListItems.length - 1].bookmarkId.toString()
      : null;
  return {
    readingList: JSON.parse(JSON.stringify(readingListItems)),
    pageInfo: {
      hasNextPage,
      limit,
      nextCursor,
      totalCount,
    },
  };
}
