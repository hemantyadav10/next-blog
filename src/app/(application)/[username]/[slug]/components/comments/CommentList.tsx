'use client';

import { ClientErrorState } from '@/components/ClientErrorState';
import CommentSkeleton from '@/components/skeletons/CommentSkeleton';
import { Button } from '@/components/ui/button';
import { fetchComments, fetchReplies } from '@/lib/api/comments.api';
import { cn } from '@/lib/utils';
import { CommentResponse } from '@/types/comment.types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, PlusCircleIcon } from 'lucide-react';
import CommentCard from './CommentCard';
import type { User } from './CommentEditor';

interface CommentListProps {
  blogId: string;
  isAuthenticated: boolean;
  intialData?: CommentResponse;
  isCommentsEnabled: boolean;
  depth?: number;
  slug: string;
  authorUsername: string;
  user: User | undefined;
  commentId?: string;
}

function CommentList({
  blogId,
  isAuthenticated,
  user,
  intialData,
  isCommentsEnabled,
  depth = 0,
  slug,
  authorUsername,
  commentId,
}: CommentListProps) {
  const queryKey = commentId
    ? ['replies', blogId, commentId]
    : ['comments', blogId];

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (commentId) {
        return await fetchReplies({ blogId, cursor: pageParam, commentId });
      } else {
        return await fetchComments({ blogId, cursor: pageParam });
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor,
    initialData: intialData
      ? {
          pageParams: [undefined],
          pages: [intialData],
        }
      : undefined,
  });

  if (isLoading) return <CommentListSkeleton />;

  const allComments = data.pages.flatMap((page) => page.comments);

  return (
    <div className="space-y-3">
      {allComments.map((comment) => (
        <div key={comment._id}>
          <CommentCard
            comment={comment}
            isAuthenticated={isAuthenticated}
            user={user}
            blogId={blogId}
            isCommentsEnabled={isCommentsEnabled}
            depth={depth}
            slug={slug}
            authorUsername={authorUsername}
          />
        </div>
      ))}

      {/* Error state */}
      {isError && !isFetchingNextPage && (
        <ClientErrorState
          errorMessage={error.message}
          onRetry={fetchNextPage}
        />
      )}

      {/* Loading state */}
      {isFetchingNextPage && <CommentListSkeleton />}

      {/* Load more button */}
      {hasNextPage && !isError && !isFetchingNextPage && (
        <div
          className={cn('flex', commentId ? 'justify-start' : 'justify-center')}
        >
          <Button
            size={'sm'}
            variant={'outline'}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs"
          >
            {commentId ? <PlusCircleIcon /> : <ChevronDown />}{' '}
            {commentId ? 'Load more replies' : 'View more comments'}
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!hasNextPage &&
        !isError &&
        allComments.length === 0 &&
        isCommentsEnabled && (
          <p className="text-muted-foreground text-center text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}
    </div>
  );
}

export default CommentList;

function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CommentSkeleton key={idx} />
      ))}
    </section>
  );
}
