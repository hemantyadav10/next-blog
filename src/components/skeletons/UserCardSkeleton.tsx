import { Skeleton } from '@/components/ui/skeleton';

function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-md p-4">
      {/* Avatar */}
      <Skeleton className="size-12 shrink-0 rounded-full" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Button */}
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );
}

export default UserCardSkeleton;
