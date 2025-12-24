import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Posts</h1>
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>
      <PostsListSkeleton />
    </section>
  );
}

export default loading;

// Full section skeleton
export function PostsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="divide-border bg-card divide-y rounded-xl border shadow-md">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4 p-4">
          {/* Title and Description */}
          <div className="mt-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Footer metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </section>
  );
}
