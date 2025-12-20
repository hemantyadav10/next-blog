import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center gap-8 px-4 py-8 pb-22 md:px-8 md:py-12">
      {/* Blog Actions Desktop - Sticky Sidebar */}
      <div className="sticky top-28 hidden w-16 shrink-0 flex-col items-center space-y-6 self-start md:flex">
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-8 xl:max-w-full xl:flex-row">
        {/* Blog Content */}
        <div className="w-full flex-col gap-8 xl:max-w-2xl">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-6 py-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Title */}
            <div className="space-y-4 py-2">
              <Skeleton className="h-8 w-full md:h-12" />
              <Skeleton className="h-8 w-3/4 md:h-12" />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Banner */}
            <Skeleton className="aspect-3/2 w-full rounded-none" />

            {/* Content */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />

              <div className="py-2" />

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        <div className="block h-px xl:hidden" />

        {/* Author Sidebar */}
        <div className="flex-1 space-y-8">
          {/* Author Info */}
          <div className="space-y-4 sm:flex sm:items-start xl:flex-col">
            <div className="flex w-full items-start gap-4 sm:flex-1">
              <Skeleton className="size-14 shrink-0 rounded-full" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-full max-w-36" />
                <Skeleton className="h-4 w-full max-w-44" />
                <Skeleton className="h-4 w-full max-w-60" />
              </div>
            </div>

            <Skeleton className="h-9 w-full sm:w-28 xl:w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
