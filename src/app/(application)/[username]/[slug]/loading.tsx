import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-screen-md flex-col gap-10 px-4 py-8 md:px-8">
      <Skeleton className="h-12 w-[80%]" />
      <div className="flex w-1/2 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-6 w-[94%]" />
        <Skeleton className="h-6 w-[96%]" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[98%]" />
        <Skeleton className="h-6 w-[85%]" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-[94%]" />
        <Skeleton className="h-6 w-[96%]" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-[98%]" />
        <Skeleton className="h-6 w-[85%]" />
      </div>
    </div>
  );
}

export default Loading;
