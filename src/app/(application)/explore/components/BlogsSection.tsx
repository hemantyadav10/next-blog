import { getAllBlogs } from '@/app/actions/blogActions';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { SearchIcon } from 'lucide-react';
import BlogsList from './BlogsList';

async function BlogsSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q as string;
  const sortBy = (await searchParams).sortBy as string;
  const sortOrder = (await searchParams).sortOrder as string;
  const result = await getAllBlogs({ query, sortBy, sortOrder });

  if (!result.success) {
    throw new Error(result.error);
  }

  const { totalDocs: totalBlogs } = result.data;

  if (totalBlogs === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchIcon />
          </EmptyMedia>
          <EmptyTitle>No Posts Found</EmptyTitle>
          <EmptyDescription>
            {query
              ? `No results found for "${query}". Try adjusting your search terms.`
              : 'No posts available at the moment. Check back later for new content.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <BlogsList
      initialData={result}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      queryKey={['blogs', query, sortBy, sortOrder]}
      fetchFn={getAllBlogs}
    />
  );
}

export default BlogsSection;
