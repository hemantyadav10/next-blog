import { Skeleton } from '../ui/skeleton';
import BlogCardSkeleton from './BlogCardSkeleton';

type PopularBlogsSkeletonProps = {
  orientation?: 'vertical' | 'horizontal';
};

function PopularBlogsSkeleton({
  orientation = 'vertical',
}: PopularBlogsSkeletonProps) {
  return (
    <div className="space-y-8">
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="w-3xs shrink-0 p-0.5 md:w-sm">
            <BlogCardSkeleton orientation={orientation} />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="size-8 rounded-full" />
      </div>
    </div>
  );
}

export default PopularBlogsSkeleton;
