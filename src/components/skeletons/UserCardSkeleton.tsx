import { Skeleton } from '@/components/ui/skeleton';

function UserCardSkeleton() {
  return (
    <div className="border-border flex items-center gap-4 rounded-md border p-4">
      {/* Avatar */}
      <div className="flex flex-1 items-start gap-4">
        <Skeleton className="size-12 shrink-0 rounded-full" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      {/* Button */}
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );
}

export default UserCardSkeleton;
