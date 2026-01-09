'use client';

import { getAllTags } from '@/app/actions/tagActions';
import { ClientErrorState } from '@/components/ClientErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { ActionResponse } from '@/types/api.types';
import { TagsListResponse } from '@/types/tags.type';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

type TagListProps = {
  data: ActionResponse<TagsListResponse>;
  query?: string;
  sortBy?: string;
  sortOrder?: string;
};

function TagList({
  data: initialData,
  query,
  sortBy,
  sortOrder,
}: TagListProps) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['tags', query, sortBy, sortOrder],
    queryFn: async ({ pageParam }) => {
      const result = await getAllTags({
        query,
        sortBy,
        sortOrder,
        page: pageParam,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.success ? lastPage.data.nextPage : undefined;
    },
    initialData: {
      pageParams: [1],
      pages: [initialData],
    },
  });

  const allTags =
    data?.pages.flatMap((page) => (page.success ? page.data.docs : [])) || [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {allTags.map((tag) => (
          <Badge
            className="h-9 px-4 text-sm font-normal whitespace-nowrap"
            asChild
            variant="secondary"
            key={tag._id.toString()}
          >
            <Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
          </Badge>
        ))}
      </div>

      {isError && !isFetchingNextPage && (
        <ClientErrorState
          errorMessage={error.message}
          onRetry={fetchNextPage}
        />
      )}

      {hasNextPage && !isError && !isFetchingNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            className="rounded-full"
            variant={'outline'}
            size={'sm'}
          >
            <ChevronDown /> Load more
          </Button>
        </div>
      )}

      {isFetchingNextPage && <Loader center />}

      {!hasNextPage && !isError && allTags.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          You&apos;ve reached the end
        </p>
      )}
    </section>
  );
}

export default TagList;
