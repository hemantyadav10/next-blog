'use client';

import { toggleLike } from '@/app/actions/likeActions';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { HeartIcon } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import LoginPromptDialog from '../LoginPromptDialog';

type LikeState = {
  isLiked: boolean;
  likesCount: number;
};

function LikeButton({
  isLiked = false,
  likesCount = 0,
  isAuthenticated = false,
  blogId,
}: {
  isLiked: boolean;
  likesCount: number;
  isAuthenticated: boolean;
  blogId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [optimisticState, setOptimisticLike] = useOptimistic(
    { isLiked, likesCount },
    (current: LikeState, newIsLiked: boolean): LikeState => ({
      isLiked: newIsLiked,
      likesCount: current.likesCount + (newIsLiked ? 1 : -1),
    }),
  );

  const handleLike = () => {
    if (isPending) return; // Prevent multiple clicks while pending
    startTransition(async () => {
      setOptimisticLike(!optimisticState.isLiked);
      const response = await toggleLike({ blogId });
      if (response.success) {
        router.refresh();
      } else {
        toast.error(response.error);
      }
    });
  };

  if (!isAuthenticated)
    return (
      <LoginPromptDialog
        trigger={
          <Button
            aria-label="Login to like"
            variant="ghost"
            title="Login to like"
            className="text-xs font-normal md:flex md:h-auto md:flex-col"
          >
            <HeartIcon /> {likesCount}
          </Button>
        }
      />
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={optimisticState.isLiked ? 'Unlike' : 'Like'}
          variant="ghost"
          onClick={handleLike}
          className={cn(
            'text-xs font-normal md:flex md:h-auto md:flex-col',
            optimisticState.isLiked &&
              '[&_svg]:text-red-500 hover:[&_svg]:text-red-500',
          )}
        >
          <HeartIcon
            fill={
              optimisticState.isLiked ? 'var(--color-red-500)' : 'transparent'
            }
          />{' '}
          {optimisticState.likesCount}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {optimisticState.isLiked ? 'Unlike' : 'Like'}
      </TooltipContent>
    </Tooltip>
  );
}

export default LikeButton;
