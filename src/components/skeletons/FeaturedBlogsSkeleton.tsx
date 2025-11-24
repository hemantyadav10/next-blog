import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedBlogsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <h2 className="text-2xl font-medium">Featured Posts</h2>
      <div className="grid grid-cols-12 flex-wrap gap-4">
        {/* First blog - large */}
        <div className="col-span-12 aspect-[3/2] md:col-span-6">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Second blog */}
        <div className="col-span-12 aspect-3/2 sm:col-span-6 sm:aspect-[2/3] md:col-span-3 md:aspect-auto">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Third blog */}
        <div className="col-span-12 aspect-3/2 sm:col-span-6 sm:aspect-[2/3] md:col-span-3 md:aspect-auto">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      </div>
    </section>
  );
}
