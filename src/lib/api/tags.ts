import { TagsApiResponse, TagsApiResponseSchema } from '@/types/tags.type';

export async function getTags(query: string = '') {
  try {
    const res = await fetch(`/api/tags?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      let errorMessage = `Failed to fetch tags: ${res.status} ${res.statusText}`;
      try {
        const errorData: TagsApiResponse = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    const rawJson = await res.json();

    // Zod validation
    const json = TagsApiResponseSchema.parse(rawJson);

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch tags');
    }

    return json.data?.tags ?? [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}
