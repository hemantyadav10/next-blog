import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <h1 className="text-2xl font-semibold md:text-3xl">Reading List</h1>
      <Separator />
      <div className="space-y-6 pt-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {/* Image */}
            <Skeleton className="h-10 w-15 shrink-0 rounded-none" />

            {/* Content */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default loading;
