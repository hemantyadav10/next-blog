'use client';

import { toggleBookmark } from '@/app/actions/bookmarkActions';
import { ClientErrorState } from '@/components/ClientErrorState';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import Loader from '@/components/ui/Loader';
import { fetchReadingList } from '@/lib/api/reading-list.api';
import { GetReadingListResult } from '@/types/reading-list.types';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Bookmark, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

function ReadingList({
  initialData,
  userId,
}: {
  userId: string;
  initialData: GetReadingListResult;
}) {
  const queryClient = useQueryClient();
  const queryKey = ['reading-list', userId];

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const result = await fetchReadingList({ cursor: pageParam });
      return result;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.pageInfo.nextCursor;
    },
    initialData: {
      pageParams: [null],
      pages: [initialData],
    },
  });

  const { mutate: removeFromReadingList } = useMutation({
    mutationFn: ({ blogId }: { blogId: string; bookmarkId: string }) =>
      toggleBookmark({ blogId }),
    onMutate: async ({ bookmarkId }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<GetReadingListResult>>(queryKey);

      queryClient.setQueryData<InfiniteData<GetReadingListResult>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              readingList: page.readingList.filter(
                (item) => item.bookmarkId !== bookmarkId,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onSuccess: (response, _vars, context) => {
      if (!response.success) {
        // roll back the optimistic update
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }
        toast.error(response.error);
        return;
      }
      toast.success(response.message);
    },
    onError: (_error, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error('Failed to remove from reading list. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const readingList = data.pages.flatMap((page) => page.readingList);

  if (readingList.length === 0) {
    return (
      <Empty className="bg-muted/30 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bookmark />
          </EmptyMedia>
          <EmptyTitle>Your Reading List is empty</EmptyTitle>
          <EmptyDescription>
            Click the bookmark icon when viewing a post to add it to your
            reading list.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" asChild>
            <Link href="/explore">Explore Posts</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <section className="space-y-6">
      <ItemGroup className="-mx-2 gap-2">
        {readingList.map((blog) => (
          <Item
            key={blog.bookmarkId}
            role="listitem"
            className="group hover:bg-muted/50 p-2"
          >
            <ItemMedia>
              <Link href={`/${blog.authorId.username}/${blog.slug}`}>
                <Image
                  src={blog.banner}
                  alt={blog.title}
                  width={60}
                  height={40}
                  className="object-cover"
                  blurDataURL={blog.blurDataUrl}
                  placeholder="blur"
                />
              </Link>
            </ItemMedia>
            <ItemContent>
              <Link
                href={`/${blog.authorId.username}/${blog.slug}`}
                className="hover:text-link hover:underline"
              >
                <ItemTitle className="line-clamp-2 md:text-lg">
                  {blog.title}
                </ItemTitle>
              </Link>
              <ItemDescription className="text-xs">
                <Link href={`/author/${blog.authorId.username}`}>
                  {`${blog.authorId.firstName} ${blog.authorId.lastName}`}{' '}
                  •{' '}
                </Link>
                {blog.publishedAt &&
                  formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')}{' '}
                • {`${blog.readTime} min read`}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="hidden md:flex">
              <Button
                aria-label="Remove from Reading List"
                title="Remove from Reading List"
                size="icon-sm"
                variant="ghost"
                className="focus-visible:pointer-events-auto focus-visible:opacity-100 md:pointer-events-none md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
                onClick={() =>
                  removeFromReadingList({
                    blogId: blog._id,
                    bookmarkId: blog.bookmarkId,
                  })
                }
              >
                <X />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      {/* Error state */}
      {isError && !isFetchingNextPage && (
        <ClientErrorState
          errorMessage={error.message}
          onRetry={fetchNextPage}
        />
      )}

      {/* Loading state */}
      {isFetchingNextPage && <Loader center />}

      {hasNextPage && !isError && !isFetchingNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            className="rounded-full"
            variant={'outline'}
          >
            Load more
          </Button>
        </div>
      )}

      {!hasNextPage && !isError && readingList.length > 0 && (
        <p className="text-muted-foreground text-center text-xs">
          You&apos;ve reached the end
        </p>
      )}
    </section>
  );
}

export default ReadingList;
