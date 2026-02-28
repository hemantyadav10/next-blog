'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { HeartIcon } from 'lucide-react';

function LikeButton({
  isLiked = false,
  likesCount = 0,
}: {
  isLiked: boolean;
  likesCount: number;
}) {
  const handleLike = () => {
    // TODO: implement optimistic UI + API call to like/unlike and handle errors
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="Like"
          variant="ghost"
          onClick={handleLike}
          className={cn(
            'text-xs font-normal md:flex md:h-auto md:flex-col',
            isLiked && '[&_svg]:text-primary hover:[&_svg]:text-primary',
          )}
        >
          <HeartIcon fill={isLiked ? 'var(--primary)' : 'transparent'} />{' '}
          {likesCount}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Like</TooltipContent>
    </Tooltip>
  );
}

export default LikeButton;
