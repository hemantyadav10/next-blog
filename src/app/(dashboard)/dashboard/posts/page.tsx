import PostCard from '@/components/PostCard';
import { getMyPosts } from '@/lib/blog';
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
      <section className="divide-border bg-card divide-y rounded-xl border shadow-md">
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
    </div>
  );
}

export default MyPosts;
