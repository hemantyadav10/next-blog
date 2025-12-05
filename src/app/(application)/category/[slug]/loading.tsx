import PopularBlogsSkeleton from '@/components/skeletons/PopularBlogsSkeleton';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
      <Separator />
      <PopularBlogsSkeleton />
    </div>
  );
}

export default loading;
