import { Skeleton } from '../ui/skeleton';
import CommentSkeleton from './CommentSkeleton';

function CommentSectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="space-y-8">
      <Skeleton className="h-7 w-44" />
      <div className="flex items-start gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <Skeleton className="h-16 flex-1" />
      </div>
      <section className="space-y-6">
        {Array.from({ length: count }).map((_, idx) => (
          <CommentSkeleton key={idx} />
        ))}
      </section>
    </section>
  );
}

export default CommentSectionSkeleton;
