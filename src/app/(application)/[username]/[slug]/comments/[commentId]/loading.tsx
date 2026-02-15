import CommentSkeleton from '@/components/skeletons/CommentSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

function loading() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 md:px-8 md:py-12">
      <Skeleton className="h-16 w-full rounded-xl" />
      <CommentSkeleton />
    </section>
  );
}

export default loading;
