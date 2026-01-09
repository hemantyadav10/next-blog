'use client';

import { getAllUsers } from '@/app/actions/userActions';
import { ClientErrorState } from '@/components/ClientErrorState';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import UserCard from '@/components/UserCard';
import { ActionResponse } from '@/types/api.types';
import { UsersResponse } from '@/types/user.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';

type UserListProps = {
  initialData: ActionResponse<UsersResponse>;
  query?: string;
  sortBy?: string;
  sortOrder?: string;
};

function UserList({ initialData, query, sortBy, sortOrder }: UserListProps) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['users', query, sortBy, sortOrder],
    queryFn: async ({ pageParam }) => {
      const result = await getAllUsers({
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

  const allUsers =
    data?.pages.flatMap((page) => (page.success ? page.data.docs : [])) || [];

  return (
    <section className="space-y-4">
      {allUsers.map(
        ({ _id, firstName, lastName, profilePicture, username, bio }) => (
          <UserCard
            name={`${firstName} ${lastName}`}
            profilePicture={profilePicture}
            username={username}
            bio={bio}
            key={_id.toString()}
          />
        ),
      )}

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
          >
            <ChevronDown /> Load more
          </Button>
        </div>
      )}

      {isFetchingNextPage && <Loader center />}

      {!hasNextPage && !isError && allUsers.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs">
          You&apos;ve reached the end
        </p>
      )}
    </section>
  );
}

export default UserList;
