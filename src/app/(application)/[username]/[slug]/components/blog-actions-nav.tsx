'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import CommentButton from './blog-detail/CommentButton';
import LikeButton from './blog-detail/LikeButton';
import SaveButton from './blog-detail/SaveButton';
import { ShareButton } from './ShareButton';

type BlogActionProps = {
  isBookmarked: boolean;
  commentCount: number;
  title: string;
  text: string;
  isLiked: boolean;
  likesCount: number;
  blogId: string;
};

function BlogActionsDesktop({
  isBookmarked,
  commentCount,
  title,
  text,
  isLiked,
  likesCount,
  blogId,
}: BlogActionProps) {
  const pathname = usePathname();
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;

  return (
    <>
      <LikeButton isLiked={isLiked} likesCount={likesCount} />
      <CommentButton commentCount={commentCount} />
      <SaveButton isBookmarked={isBookmarked} blogId={blogId} />
      <ShareButton url={url} text={text} title={title} />
    </>
  );
}

function BlogActionsMobile({
  isBookmarked,
  commentCount,
  title,
  text,
  isLiked,
  likesCount,
  blogId,
}: BlogActionProps) {
  const pathname = usePathname();
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;

  return (
    <div
      className={cn(
        'bg-card border-border flex h-14 items-center justify-between border-t px-4 md:hidden',
        'fixed right-0 bottom-0 left-0 z-40',
      )}
    >
      <LikeButton isLiked={isLiked} likesCount={likesCount} />
      <CommentButton commentCount={commentCount} />
      <SaveButton isBookmarked={isBookmarked} blogId={blogId} />
      <ShareButton url={url} text={text} title={title} />
    </div>
  );
}

export { BlogActionsDesktop, BlogActionsMobile };
