import { Skeleton } from '../ui/skeleton';

function AuthorDetailsSkeleton() {
  return (
    <section className="col-span-full space-y-4 md:col-span-4">
      {/* Basic info skeleton */}
      <div className="bg-card space-y-4 rounded-xl border p-5">
        <div className="flex">
          {/* Avatar skeleton */}
          <Skeleton className="size-24 rounded-full" />
        </div>
        {/* Name skeleton */}
        <Skeleton className="h-5 w-48 md:h-6" />
        {/* Username skeleton */}
        <Skeleton className="h-3.5 w-32 md:h-4" />
        {/* Bio skeleton */}
        <Skeleton className="h-3.5 w-full md:h-4" />

        {/* Follow button skeleton */}
        <Skeleton className="mt-2 h-10 w-full rounded-md" />
      </div>

      {/* More info card skeleton */}
      <div className="bg-card space-y-5 rounded-xl border p-5">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-full max-w-52" />

        {/* Info items */}
        <div className="space-y-5">
          {/* Followers/Following skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-full max-w-64" />
          </div>
          {/* Posts skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-full max-w-40" />
          </div>
          {/* Email skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-full max-w-56" />
          </div>
          {/* Phone skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-full max-w-48" />
          </div>
          {/* Joined date skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-3.5 w-full max-w-52" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthorDetailsSkeleton;
