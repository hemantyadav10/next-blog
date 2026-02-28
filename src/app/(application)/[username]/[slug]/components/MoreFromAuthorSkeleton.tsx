import { Skeleton } from '@/components/ui/skeleton';

export default function MoreFromAuthorSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-full max-w-52" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="flex items-start gap-2">
      {/* Thumbnail */}
      <Skeleton className="h-12 w-18 shrink-0 rounded-none" />

      {/* Title */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
