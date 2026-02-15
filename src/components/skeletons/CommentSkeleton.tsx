import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const CommentSkeleton = () => {
  return (
    <div className={cn('flex gap-2')}>
      {/* Avatar */}
      <Skeleton className="size-6 shrink-0 rounded-full md:size-8" />

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-3">
        {/* Header */}
        <div className="flex h-6 items-center gap-2 md:h-8">
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
