import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { verifyAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { BarChart2, Calendar, Clock, Edit3Icon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CommentsChart from '../../components/stats/CommentsChart';
import LikesChart from '../../components/stats/LikesChart';
import { StatsCards } from '../../components/stats/stats-card';
import { TimeRangeSelector } from '../../components/stats/TimeRangeSelector';
import ViewsChart from '../../components/stats/ViewsChart';
import { getBlogStatsTotals } from './data';

type BlogStatsProps = {
  params: Promise<{ blogId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function BlogStats({ params, searchParams }: BlogStatsProps) {
  const { blogId } = await params;
  const { isAuthenticated, user } = await verifyAuth();
  const s = await searchParams;
  const range = Array.isArray(s.range) ? s.range[0] : s.range || '7d';

  // TODO: replace hardcoded IST with dynamic timezone — read from user profile/settings or detect via `Intl.DateTimeFormat().resolvedOptions().timeZone` on the client and pass as a searchParam or cookie
  // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!isAuthenticated) return notFound();

  const blogExists = await getBlogStatsTotals({
    blogId,
    days: range === '7d' ? 7 : range === 'all' ? 9999 : 30,
    userId: user.userId,
  });

  if (!blogExists.blog || !blogExists.stats) return notFound();

  const { blog } = blogExists;
  const { views, likes, comments } = blogExists.stats;

  return (
    <div className="">
      <section className="mx-auto max-w-7xl space-y-6">
        {/* -- blog title & meta */}
        <div className="space-y-3">
          <h1 className="text-primary text-2xl font-semibold md:text-3xl">
            <Link href={`/${blog.authorId.username}/${blog.slug}`}>
              {blog.title}
            </Link>
          </h1>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Badge
              className={cn(
                'capitalize',
                blog.status === 'published' && 'text-success bg-success/10',
                blog.status === 'draft' &&
                  'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
              )}
            >
              {blog.status === 'published' && (
                <span className="h-1 w-1 animate-pulse rounded-full bg-green-700 dark:bg-green-300" />
              )}{' '}
              {blog.status}
            </Badge>
            {blog.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(new Date(blog.publishedAt), 'MMM d, yyyy')}
              </span>
            )}
            {blog.isEdited && blog.editedAt && (
              <span className="flex items-center gap-1">
                <Edit3Icon className="size-3.5" />
                Edited {formatDate(new Date(blog.editedAt), 'MMM d, yyyy')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {blog.readTime} min read
            </span>
          </div>
        </div>

        {blog.status === 'published' && blog.publishedAt ? (
          <>
            {/* range selector + stat cards */}
            <TimeRangeSelector publishedAt={new Date(blog.publishedAt)} />
            <StatsCards
              views={views}
              likesCount={likes}
              commentsCount={comments}
              prevComments={blogExists.stats.prevComments}
              prevLikes={blogExists.stats.prevLikes}
              prevViews={blogExists.stats.prevViews}
              range={range}
            />

            {/* charts */}
            <div className="space-y-6">
              <Suspense fallback={<ChartsSkeleton />} key={JSON.stringify(s)}>
                <ViewsChart
                  blogId={blog._id.toString()}
                  range={range}
                  publishedAt={blog.publishedAt}
                />
              </Suspense>
              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="flex-1">
                  <Suspense fallback={<ChartsSkeleton />}>
                    <LikesChart
                      blogId={blog._id.toString()}
                      range={range}
                      publishedAt={blog.publishedAt}
                    />
                  </Suspense>
                </div>
                <div className="flex-1">
                  <Suspense fallback={<ChartsSkeleton />}>
                    <CommentsChart
                      blogId={blog._id.toString()}
                      range={range}
                      publishedAt={blog.publishedAt}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* -- empty state for drafts */
          <Empty className="rounded-xl border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BarChart2 />
              </EmptyMedia>
              <EmptyTitle>Publish to unlock analytics</EmptyTitle>
              <EmptyDescription className="max-w-sm text-pretty">
                Analytics are only available for published posts. Publish this
                draft to start tracking views, likes, and comments.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild variant={'outline'}>
                <Link href={`/${blog.authorId.username}/${blog.slug}/edit`}>
                  Publish blog
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}

export default BlogStats;

function ChartsSkeleton() {
  return (
    <>
      <Skeleton className="h-[384.4px] w-full rounded-xl" />
    </>
  );
}
