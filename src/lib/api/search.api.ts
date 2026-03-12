import { searchResultsApiResponseSchema } from '@/types/search.type';

export async function fetchSearchResults(q: string) {
  try {
    const url = new URL(
      `/api/search?q=${encodeURIComponent(q)}`,
      process.env.NEXT_PUBLIC_BASE_URL,
    );

    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to fetch search results');

    const data: unknown = await res.json();

    const json = searchResultsApiResponseSchema.parse(data);

    if (!json.success) throw new Error(json.message || 'Invalid API response');

    if (!json.data) throw new Error('No data returned from server');

    return json.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
}
