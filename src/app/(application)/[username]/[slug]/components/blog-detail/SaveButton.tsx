'use client';

import { toggleBookmark } from '@/app/actions/bookmarkActions';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import LoginPromptDialog from '../LoginPromptDialog';

function SaveButton({
  isBookmarked = false,
  blogId,
  isAuthenticated = false,
}: {
  isBookmarked: boolean;
  blogId: string;
  isAuthenticated: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticSave, setOptimisticSave] = useOptimistic(isBookmarked);
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      setOptimisticSave((current) => !current);
      const response = await toggleBookmark({ blogId });
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
            aria-label="Login to save"
            variant="ghost"
            size="icon"
            title="Login to save"
            className="size-9"
          >
            <Bookmark />
          </Button>
        }
      />
    );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={
            optimisticSave ? 'Remove from reading list' : 'Save to reading list'
          }
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className={cn(
            'disabled:opacity-80',
            optimisticSave && '[&_svg]:text-primary hover:[&_svg]:text-primary',
          )}
          disabled={isPending}
        >
          <Bookmark fill={optimisticSave ? 'var(--primary)' : 'transparent'} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {optimisticSave ? 'Unsave' : 'Save'}
      </TooltipContent>
    </Tooltip>
  );
}

export default SaveButton;
