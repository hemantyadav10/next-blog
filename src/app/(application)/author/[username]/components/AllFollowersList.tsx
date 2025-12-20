'use client';

import { getAllFollowers } from '@/app/actions/followerActions';
import { ClientErrorState } from '@/components/ClientErrorState';
import Loader from '@/components/ui/Loader';
import UserCard from '@/components/UserCard';
import { ActionResponse } from '@/types/api.types';
import { AuthorFollowerResponse } from '@/types/follower.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type FollowersListProps = {
  initialData: ActionResponse<AuthorFollowerResponse>;
  authorId: string;
};

function AllFollowersList({ initialData, authorId }: FollowersListProps) {
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
    queryKey: ['followers', 'author', { authorId }],
    queryFn: async ({ pageParam }) => {
      const result = await getAllFollowers({
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

  const allFollowers =
    data?.pages.flatMap((page) => (page.success ? page.data.docs : [])) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="space-y-4">
      {allFollowers.map((follower) => {
        const { _id, followerId } = follower;
        return (
          <React.Fragment key={_id.toString()}>
            <UserCard
              name={followerId.firstName + ' ' + followerId.lastName}
              profilePicture={followerId.profilePicture}
              username={followerId.username}
              bio={followerId.bio}
            />
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
      {!hasNextPage && !isError && allFollowers.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          You&apos;ve reached the end
        </p>
      )}
    </section>
  );
}

export default AllFollowersList;
