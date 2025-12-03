import { Fragment } from 'react';
import { Skeleton } from '../ui/skeleton';

function AllTagsSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Fragment key={idx}>
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-16 shrink-0 rounded-full" />
        </Fragment>
      ))}
    </div>
  );
}

export default AllTagsSkeleton;
