import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Title + metadata */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 rounded-md" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </div>

      {/* TimeRangeSelector */}
      <Skeleton className="h-9 w-64 rounded-md" />

      {/* StatsCards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      {/* ViewsChart */}
      <Skeleton className="h-[384px] w-full rounded-xl" />

      {/* LikesChart + CommentsChart */}
      <div className="flex flex-col gap-6 xl:flex-row">
        <Skeleton className="h-[384px] flex-1 rounded-xl" />
        <Skeleton className="h-[384px] flex-1 rounded-xl" />
      </div>
    </div>
  );
}
