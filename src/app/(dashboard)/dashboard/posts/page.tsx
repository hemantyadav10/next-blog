import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getMyPosts } from '@/lib/blog';
import { SquarePenIcon } from 'lucide-react';
import Link from 'next/link';
import Pagination from './components/Pagination';
import SortingSelect from './components/SortingSelect';

async function MyPosts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string, 10) : 1;
  const limit = params.limit ? parseInt(params.limit as string, 10) : 10;
  const sortBy = params.sortBy ? (params.sortBy as string) : undefined;
  const sortOrder = params.sortOrder ? (params.sortOrder as string) : undefined;

  const { user, data } = await getMyPosts({
    page,
    limit,
    sortBy,
    sortOrder,
  });
  const {
    docs: posts,
    totalDocs: totalPosts,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = data;

  return (
    <div className="space-y-8">
      <h1 className="flex flex-wrap items-center justify-between gap-4 text-2xl font-semibold md:text-3xl">
        Posts <SortingSelect />
      </h1>
      {totalPosts === 0 ? (
        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SquarePenIcon />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any posts yet. Start writing your first
              post to share your thoughts with the world.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" asChild>
              <Link href={`/write`}>Create Post</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <section className="divide-border bg-card divide-y rounded-xl border">
            {posts.map((post) => (
              <div key={post._id.toString()}>
                <PostCard post={post} user={user} />
              </div>
            ))}
          </section>
          <Pagination
            totalPosts={totalPosts}
            totalPages={totalPages}
            page={page}
            limit={limit}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            nextPage={nextPage ?? page}
            prevPage={prevPage ?? page}
          />
        </>
      )}
    </div>
  );
}

export default MyPosts;
