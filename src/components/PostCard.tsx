import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { MyBlogs } from '@/types/blog.types';
import { formatDate, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type User = {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  profilePicture: string | null | undefined;
  username: string;
};

type Blog = MyBlogs;

type PostCardProps = {
  post: Blog;
  user: User;
};

function PostCard({ post, user }: PostCardProps) {
  return (
    <Item className="hover:bg-accent/50">
      <ItemContent>
        <Link
          href={
            post.status === 'published' ? `/${user.username}/${post.slug}` : '#'
          }
          title={post.title}
          className="group space-y-1"
        >
          <ItemTitle className="text-link text-base group-hover:underline">
            {post.title}
          </ItemTitle>
          <ItemDescription>{post.description}</ItemDescription>
        </Link>
      </ItemContent>
      <ItemActions className="flex-wrap">
        <DeleteButton postTitle={post.title} />
        <Button
          title="More options"
          aria-label="More options"
          size={'sm'}
          variant={'ghost'}
          className="font-normal"
          asChild
        >
          <Link href={`/${user.username}/${post.slug}/edit`}>Edit</Link>
        </Button>
        <Button
          title="More options"
          aria-label="More options"
          size={'sm'}
          variant={'ghost'}
          className="font-normal"
        >
          Stats
        </Button>
      </ItemActions>
      <ItemFooter className="text-xs">
        <div className="flex flex-wrap items-center gap-y-2">
          <div className="after:bg-muted-foreground/60 flex items-center gap-1 after:mx-2 after:inline-block after:h-1 after:w-1 after:rounded-full last:after:hidden">
            <Badge
              variant={'outline'}
              className={cn(
                'rounded capitalize',
                post.status === 'published'
                  ? 'border-green-700 text-green-700 dark:border-green-400 dark:text-green-400'
                  : 'border-yellow-700 text-yellow-700 dark:border-yellow-500 dark:text-yellow-500',
              )}
            >
              {post.status}
            </Badge>
          </div>
          <div
            className="after:bg-muted-foreground/60 flex items-center gap-1 after:mx-2 after:inline-block after:h-1 after:w-1 after:rounded-full last:after:hidden"
            title={`Created at ${formatDate(post.createdAt, 'PPpp')}`}
          >
            <span className="text-muted-foreground">Created </span>{' '}
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </div>
          {post.status === 'published' && post.publishedAt && (
            <div
              className="after:bg-muted-foreground/60 flex items-center gap-1 after:mx-2 after:inline-block after:h-1 after:w-1 after:rounded-full last:after:hidden"
              title={`Published at ${formatDate(post.publishedAt, 'PPpp')}`}
            >
              <span className="text-muted-foreground">Published </span>{' '}
              {formatDistanceToNow(post.publishedAt, {
                addSuffix: true,
              })}
            </div>
          )}
          {post.isEdited && post.editedAt && (
            <div
              className="after:bg-muted-foreground/60 flex items-center gap-1 after:mx-2 after:inline-block after:h-1 after:w-1 after:rounded-full last:after:hidden"
              title={`Last updated at ${formatDate(post.editedAt, 'PPpp')}`}
            >
              <span className="text-muted-foreground">Updated </span>{' '}
              {formatDistanceToNow(post.editedAt, { addSuffix: true })}
            </div>
          )}
        </div>
      </ItemFooter>
    </Item>
  );
}

export default PostCard;

function DeleteButton({ postTitle }: { postTitle: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          title={`Delete blog post "${postTitle}"`}
          aria-label={`Delete blog post "${postTitle}"`}
          size={'sm'}
          variant={'ghost'}
          className="text-destructive hover:text-destructive font-normal"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{postTitle}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blog
            post <strong>&quot;{postTitle}&quot;</strong> and remove it from
            your readers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* TODO: implement delete functionality */}
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
