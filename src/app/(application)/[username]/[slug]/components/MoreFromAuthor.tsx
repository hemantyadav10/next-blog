import { ErrorState } from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { getMoreBlogsFromAuthor } from '@/lib/blog';
import Link from 'next/link';
import BlogCard from './BlogCard';

interface MoreFromAuthorProps {
  authorName: string;
  authorId: string;
  blogId: string;
  authorUsername: string;
}

async function MoreFromAuthor({
  authorName,
  authorId,
  blogId,
  authorUsername,
}: MoreFromAuthorProps) {
  let blogs;
  try {
    blogs = await getMoreBlogsFromAuthor({
      authorId,
      excludePostId: blogId,
    });
  } catch (error) {
    return (
      <ErrorState
        resource="blogs"
        error={
          error instanceof Error
            ? error
            : new Error('Failed to load more blogs from author')
        }
      />
    );
  }

  if (blogs.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">More from {authorName}</h2>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id.toString()}
            title={blog.title}
            viewCount={blog.views}
            date={
              blog.publishedAt?.toISOString() || blog.createdAt.toISOString()
            }
            banner={blog.banner}
            blurDataUrl={blog.blurDataUrl}
            slug={blog.slug}
            username={authorUsername}
          />
        ))}
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href={`/author/${authorUsername}`}>View All</Link>
      </Button>
    </div>
  );
}

export default MoreFromAuthor;
