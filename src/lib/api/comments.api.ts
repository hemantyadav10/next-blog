import {
  CommentApiResponseSchema,
  CommentResponse,
} from '@/types/comment.types';

export type FetchRepliesParams = {
  blogId: string;
  cursor?: string;
  limit?: number;
  commentId: string;
};

export type FetchCommentsParams = Omit<FetchRepliesParams, 'commentId'>;

export async function fetchComments({
  blogId,
  cursor,
  limit = 10,
}: FetchCommentsParams): Promise<CommentResponse> {
  try {
    const url = new URL(
      `/api/blogs/${blogId}/comments`,
      process.env.NEXT_PUBLIC_BASE_URL,
    );

    url.searchParams.set('limit', limit.toString());
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch comments');

    const data: unknown = await res.json();

    const json = CommentApiResponseSchema.parse(data);

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch comments');
    }

    if (!json.data) {
      throw new Error('No data returned from server');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function fetchReplies({
  blogId,
  cursor,
  limit = 5,
  commentId,
}: FetchRepliesParams): Promise<CommentResponse> {
  try {
    const url = new URL(
      `/api/blogs/${blogId}/comments/${commentId}/replies`,
      process.env.NEXT_PUBLIC_BASE_URL,
    );

    url.searchParams.set('limit', limit.toString());
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch replies');

    const data: unknown = await res.json();

    const json = CommentApiResponseSchema.parse(data);

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch replies');
    }

    if (!json.data) {
      throw new Error('No data returned from server');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
}
