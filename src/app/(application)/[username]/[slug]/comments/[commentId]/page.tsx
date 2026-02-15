import { verifyAuth } from '@/lib/auth';
import { fetchCommentData } from '@/lib/comments';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentItem from '../../components/comments/CommentCard';

type Props = {
  params: Promise<{ slug: string; username: string; commentId: string }>;
};

async function page({ params }: Props) {
  const { commentId, slug, username } = await params;
  const { isAuthenticated, user } = await verifyAuth();
  const commentData = await fetchCommentData(commentId, slug);

  if (!commentData) return notFound();

  const isParentDeleted = commentData.parentId?.isDeleted;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 md:px-8 md:py-12">
      <div className="bg-card rounded-xl border p-4">
        <h1 className="text-muted-foreground text-lg md:text-2xl">
          Discussion on:{' '}
          <Link
            href={`/${username}/${slug}`}
            className="text-link font-semibold hover:underline"
          >
            {commentData.blogId.title}
          </Link>{' '}
        </h1>
      </div>
      {commentData.parentId && (
        <div
          className={cn(
            'bg-card rounded-xl border p-4 md:text-lg',
            isParentDeleted ? 'flex gap-[1ch]' : '',
          )}
        >
          <p className="text-muted-foreground">Replies for:</p>
          <Link
            href={`/${username}/${slug}/comments/${commentData.parentId._id.toString()}`}
            className="text-link group hover:underline"
          >
            {isParentDeleted ? (
              <span>{`[deleted]`}</span>
            ) : (
              <div
                className={cn(
                  'prose prose-sm dark:prose-invert tiptap text-link line-clamp-2 w-full max-w-none font-medium break-words group-hover:underline [&_a]:break-all',
                )}
                dangerouslySetInnerHTML={{
                  __html: commentData.parentId.content,
                }}
              />
            )}
          </Link>
        </div>
      )}
      <div className={cn(commentData.parentId && 'ml-[16.5px]')}>
        <CommentItem
          comment={JSON.parse(JSON.stringify(commentData))}
          isAuthenticated={isAuthenticated}
          user={
            user
              ? {
                  _id: user.userId,
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  profilePicture: user.profilePicture ?? '',
                }
              : undefined
          }
          blogId={commentData.blogId._id.toString()}
          isCommentsEnabled={commentData.blogId.isCommentsEnabled}
          slug={slug}
          authorUsername={username}
          viewReplies
        />
      </div>
    </section>
  );
}

export default page;
