import { Skeleton } from '@/components/ui/skeleton';

export function RecentBlogsSkeleton() {
  return (
    <section className="col-span-12 space-y-6 lg:col-span-9">
      {/* Header */}
      <h2 className="text-2xl font-medium">Latest Posts</h2>

      <div className="space-y-8">
        {/* Render 4 blog card skeletons */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-x-4 gap-y-3">
            {/* Image skeleton */}
            <div className="col-span-12 sm:col-span-5">
              <Skeleton className="aspect-[3/2] w-full rounded-none" />
            </div>

            {/* Content skeleton */}
            <div className="col-span-12 space-y-4 sm:col-span-7">
              {/* Badge */}
              <Skeleton className="h-5 w-20 rounded" />

              {/* Title - 2 lines */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 sm:h-6" />
                {/* <Skeleton className="h-5 w-3/4 sm:h-6" /> */}
              </div>

              {/* Description - 2 lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="text-center">
        <Skeleton className="mx-auto h-10 w-full max-w-[200px] rounded-full" />
      </div>
    </section>
  );
}
