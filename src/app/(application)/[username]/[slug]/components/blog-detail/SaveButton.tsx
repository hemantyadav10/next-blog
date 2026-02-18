'use client';

import { toggleBookmark } from '@/app/actions/bookmarkActions';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { useQueryClient } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
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
  const queryClient = useQueryClient();

  const handleSave = () => {
    startTransition(async () => {
      setOptimisticSave((current) => !current);
      const response = await toggleBookmark({ blogId });
      if (response.success) {
        if (response.data.saved) {
          toast.success('Saved to Reading List', {
            action: (
              <Button
                asChild
                variant={'outline'}
                className="ml-auto h-6 w-max rounded px-2 text-xs"
              >
                <Link href={'/reading-list'}>View List</Link>
              </Button>
            ),
          });
        } else {
          toast.success('Removed from Reading List');
        }
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ['reading-list'] });
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
