import { getAuthorBlogs } from '@/app/actions/blogActions';
import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getUserDetails } from '@/lib/user';
import { FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AllBlogsList from './components/AllBlogsList';

async function page({ params }: { params: Promise<{ username: string }> }) {
  const username = (await params).username;
  const user = await getUserDetails(username);
  if (!user) return notFound();

  const result = await getAuthorBlogs({ authorId: user._id.toString() });
  if (!result.success) {
    return (
      <ErrorState resource="author posts" error={new Error(result.error)} />
    );
  }

  const { docs: blogs } = result.data;

  if (blogs.length === 0) {
    return (
      <section className="space-y-4">
        {/* Navigation tabs */}
        <NavigationTab username={user.username} />
        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>
              This author hasn&apos;t published any blog posts yet. Check back
              soon to see their latest content.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    );
  }
  return (
    <section className="space-y-4">
      {/* Navigation tabs */}
      <NavigationTab username={user.username} />
      <AllBlogsList initialData={result} authorId={user._id.toString()} />
    </section>
  );
}

export default page;

function NavigationTab({ username }: { username: string }) {
  return (
    <div className="border-border bg-background flex border-b">
      <div className="relative">
        <Button variant={'ghost'} asChild>
          <Link href={`/author/${username}`}>All Posts</Link>
        </Button>
        <div className="bg-primary absolute bottom-0 h-0.5 w-full" />
      </div>
    </div>
  );
}
