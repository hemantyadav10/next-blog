import { getCategoryLatestBlogs } from '@/app/actions/blogActions';
import { ErrorState } from '@/components/error-state';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FileText } from 'lucide-react';
import LatestBlogsList from './LatestBlogsList';

async function LatestBlogsSection({ categoryId }: { categoryId: string }) {
  const result = await getCategoryLatestBlogs({ categoryId });

  if (!result.success) {
    return (
      <ErrorState resource="category posts" error={new Error(result.error)} />
    );
  }

  const { docs: blogs } = result.data;

  if (blogs.length === 0) {
    return (
      <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No posts in this category yet</EmptyTitle>
          <EmptyDescription>
            This category doesn&apos;t have any posts. Check back soon or
            explore other categories.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <LatestBlogsList initialData={result} categoryId={categoryId} />;
}

export default LatestBlogsSection;
