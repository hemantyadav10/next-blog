import { SearchHistoryApiResponseSchema } from '@/types/search-history.types';

export async function fetchSearchHistory() {
  try {
    const url = new URL(
      `/api/search-history`,
      process.env.NEXT_PUBLIC_BASE_URL,
    );

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch search history');

    const data: unknown = await res.json();

    const json = SearchHistoryApiResponseSchema.parse(data);

    if (!json.success) {
      throw new Error(json.message || 'Invalid API response');
    }

    if (!json.data) {
      throw new Error('No data returned from server');
    }

    return json.data;
  } catch (error) {
    console.error('Error fetching search history:', error);
    throw error;
  }
}
