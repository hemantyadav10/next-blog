import {
  type GetReadingListResult,
  ReadingListApiResponseSchema,
} from '@/types/reading-list.types';

type ReadingListParams = {
  limit?: number;
  cursor?: string | null;
};

export async function fetchReadingList({
  cursor,
  limit,
}: ReadingListParams = {}): Promise<GetReadingListResult> {
  try {
    const url = new URL(`/api/reading-list`, process.env.NEXT_PUBLIC_BASE_URL);

    if (limit) url.searchParams.set('limit', limit.toString());
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch reading list');

    const data: unknown = await res.json();

    const json = ReadingListApiResponseSchema.parse(data);

    if (!json.success) {
      throw new Error(json.message || 'Invalid API response');
    }

    if (!json.data) {
      throw new Error('No data returned from server');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching reading list:', error);
    throw error;
  }
}
