'use client';

import { getAuthorBlogs } from '@/app/actions/blogActions';
import BlogCard from '@/components/BlogCard';
import { ClientErrorState } from '@/components/ClientErrorState';
import Loader from '@/components/ui/Loader';
import { Separator } from '@/components/ui/separator';
import { ActionResponse } from '@/types/api.types';
import { AuthorBlogsResponse } from '@/types/blog.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type BlogListProps = {
  initialData: ActionResponse<AuthorBlogsResponse>;
  authorId: string;
};

function AllBlogsList({ initialData, authorId }: BlogListProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['blogs', 'author', { authorId }],
    queryFn: async ({ pageParam }) => {
      const result = await getAuthorBlogs({
        authorId,
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

  const allBlogs =
    data?.pages.flatMap((page) => (page.success ? page.data.docs : [])) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="space-y-4">
      {allBlogs.map((blog) => {
        const {
          _id,
          title,
          description,
          readTime,
          authorId,
          slug,
          publishedAt,
          blurDataUrl,
          banner,
        } = blog;
        return (
          <React.Fragment key={_id.toString()}>
            <BlogCard
              title={title}
              description={description}
              readTime={readTime}
              authorName={`${authorId.firstName} ${authorId.lastName}`}
              authorUsername={authorId.username}
              slug={slug}
              publishedAt={publishedAt}
              blurDataUrl={blurDataUrl}
              banner={banner}
              authorProfilePicture={authorId.profilePicture}
            />
            <Separator />
          </React.Fragment>
        );
      })}

      {isError && !isFetchingNextPage && (
        <ClientErrorState
          errorMessage={error.message}
          onRetry={fetchNextPage}
        />
      )}

      {hasNextPage && !isError && <div ref={ref} />}
      {isFetchingNextPage && <Loader center />}
      {!hasNextPage && !isError && allBlogs.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          You&apos;ve reached the end
        </p>
      )}
    </section>
  );
}

export default AllBlogsList;
