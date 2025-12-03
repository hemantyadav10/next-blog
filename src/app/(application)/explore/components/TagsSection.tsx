import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SearchIcon } from 'lucide-react';

import { getAllTags } from '@/app/actions/tagActions';
import TagList from './TagList';

async function TagsSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q as string;
  const sortBy = (await searchParams).sortBy as string;
  const sortOrder = (await searchParams).sortOrder as string;
  const result = await getAllTags({ query, sortBy, sortOrder });

  if (!result.success) {
    throw new Error(result.error);
  }

  const { docs: tags } = result.data;

  if (tags.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchIcon />
          </EmptyMedia>
          <EmptyTitle>No Tags Found</EmptyTitle>
          <EmptyDescription>
            {query
              ? `No results found for "${query}". Try adjusting your search terms.`
              : 'No tags available at the moment. Check back later for new tags.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <TagList
      data={result}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
}

export default TagsSection;
