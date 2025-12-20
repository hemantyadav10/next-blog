import AllBlogsSkeleton from '@/components/skeletons/AllBlogsSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className="col-span-full space-y-4 md:col-span-8">
      <div className="bg-background border-border flex h-9 items-center border-b">
        <Skeleton className="h-5 w-20" />
      </div>
      <AllBlogsSkeleton count={3} />
    </div>
  );
}

export default loading;
