'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageCircleIcon } from 'lucide-react';

function CommentButton({ commentCount = 0 }: { commentCount: number }) {
  const handleClick = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="Comment"
          variant="ghost"
          onClick={handleClick}
          className="text-xs font-normal md:flex md:h-auto md:flex-col"
        >
          <MessageCircleIcon /> {commentCount}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Comment</TooltipContent>
    </Tooltip>
  );
}

export default CommentButton;
