import UserCardListSkeleton from '@/components/skeletons/UserListSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-x-6 gap-y-2 py-1">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-18" />
      </div>
      <Skeleton className="h-6 w-full max-w-32" />
      <UserCardListSkeleton />
    </div>
  );
}

export default loading;
