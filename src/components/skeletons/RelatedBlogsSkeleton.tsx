import { Skeleton } from '../ui/skeleton';
import BlogCardSkeleton from './BlogCardSkeleton';

type RelatedBlogsSkeletonProps = {
  orientation?: 'vertical' | 'horizontal';
};

function RelatedBlogsSkeleton({
  orientation = 'vertical',
}: RelatedBlogsSkeletonProps) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-full max-w-40" />
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="w-3xs shrink-0 p-0.5 md:w-xs">
            <BlogCardSkeleton orientation={orientation} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedBlogsSkeleton;
