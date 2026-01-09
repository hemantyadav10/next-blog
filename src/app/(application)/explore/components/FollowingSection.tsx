import { getFollowingPosts } from '@/app/actions/blogActions';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { Button } from '@/components/ui/button';
import { verifyAuth } from '@/lib/auth';
import { LockIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import BlogsList from './BlogsList';

async function FollowingSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { isAuthenticated, user } = await verifyAuth();

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockIcon />
          </EmptyMedia>
          <EmptyTitle>Sign In Required</EmptyTitle>
          <EmptyDescription>
            Sign in to see posts from authors you follow and personalize your
            feed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={`/login?redirect=/explore/following`}>Sign In</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const query = (await searchParams).q as string;
  const sortBy = (await searchParams).sortBy as string;
  const sortOrder = (await searchParams).sortOrder as string;
  const result = await getFollowingPosts({ query, sortBy, sortOrder });

  if (!result.success) {
    throw new Error(result.error);
  }

  const { totalDocs: totalBlogs } = result.data;

  // If no blogs found, show empty state
  if (totalBlogs === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchIcon />
          </EmptyMedia>
          <EmptyTitle>
            {query ? 'No Posts Found' : 'No posts from people you follow  '}
          </EmptyTitle>
          <EmptyDescription>
            {query
              ? `No results found for "${query}" among authors you follow. Try adjusting your search terms.`
              : "You haven't followed any authors yet, or the authors you follow haven't published any posts. Start following writers to see their content here."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={`/explore/users`}>Follow Authors</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <BlogsList
      initialData={result}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
      queryKey={['blogs', 'following', query, sortBy, sortOrder, user.userId]}
      fetchFn={getFollowingPosts}
    />
  );
}

export default FollowingSection;
