import { ErrorState } from '@/components/error-state';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { fetchTrendingBlogs } from '@/lib/blog';
import type { TrendingBlog } from '@/types/blog.types';
import { TrendingUpIcon } from 'lucide-react';
import TrendingBlogCard from './TrendingBlogCard';

async function TrendingBlogs() {
  let trendingBlogs: TrendingBlog[] = [];
  let error: Error | null = null;

  try {
    trendingBlogs = await fetchTrendingBlogs();
  } catch (e) {
    error = e as Error;
  }

  return (
    <section className="col-span-full space-y-6 lg:col-span-4">
      <h2 className="flex items-center gap-1 text-2xl font-medium">
        <span>Most Popular</span>
        <TrendingUpIcon className="size-5" />
      </h2>

      {error ? (
        <ErrorState
          resource="trending blogs"
          error={error}
          variant={'default'}
        />
      ) : trendingBlogs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TrendingUpIcon />
            </EmptyMedia>
            <EmptyTitle>Nothing trending yet</EmptyTitle>
            <EmptyDescription>
              Check back soon — popular posts will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-6">
          {trendingBlogs.map((blog) => (
            <TrendingBlogCard key={blog._id.toString()} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TrendingBlogs;
