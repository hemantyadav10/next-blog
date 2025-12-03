import { Skeleton } from '../ui/skeleton';

function BlogCardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-3">
      {/* Image skeleton */}
      <div className="col-span-4">
        <Skeleton className="aspect-[3/2] w-full rounded-none" />
      </div>

      {/* Content skeleton */}
      <div className="col-span-8 space-y-4">
        {/* Title - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 sm:h-6" />
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
  );
}

export default BlogCardSkeleton;
