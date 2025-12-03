import { Skeleton } from '@/components/ui/skeleton';
import BlogCardSkeleton from './BlogCardSkeleton';

export function RecentBlogsSkeleton() {
  return (
    <section className="col-span-12 space-y-6 lg:col-span-9">
      {/* Header */}
      <h2 className="text-2xl font-medium">Latest Posts</h2>

      <div className="space-y-8">
        {/* Render 4 blog card skeletons */}
        {Array.from({ length: 4 }).map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>

      {/* View all button */}
      <div className="text-center">
        <Skeleton className="mx-auto h-10 w-full max-w-[200px] rounded-full" />
      </div>
    </section>
  );
}
