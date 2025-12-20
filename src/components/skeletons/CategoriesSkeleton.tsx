import { Skeleton } from '../ui/skeleton';

function CategoriesSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 overflow-hidden p-1">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Skeleton className="h-9 w-40 shrink-0 rounded-full" key={idx} />
      ))}
    </div>
  );
}

export default CategoriesSkeleton;
