import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUpIcon } from 'lucide-react';

function TrendingBlogCardSkeleton() {
  return (
    <div className="flex items-start gap-4">
      {/* Thumbnail */}
      <Skeleton className="size-16 shrink-0 rounded-lg" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Author */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Stats */}
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function TrendingBlogsSkeleton() {
  return (
    <section className="col-span-full space-y-6 lg:col-span-4">
      <h2 className="flex items-center gap-1 text-2xl font-medium">
        <span>Most Popular</span>
        <TrendingUpIcon className="size-5" />
      </h2>

      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <TrendingBlogCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
