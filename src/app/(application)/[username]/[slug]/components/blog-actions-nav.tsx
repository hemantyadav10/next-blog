'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Ellipsis,
  Heart,
  LucideIcon,
  MessageCircleIcon,
  Share2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ShareButton } from './ShareButton';

type BlogActionItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  ariaLabel: string;
  count?: number;
  variant?: 'ghost' | 'default' | 'outline';
  size?: 'default' | 'icon' | 'icon-lg';
  onClick?: () => void;
};

type BlogActionProps = {
  title: string;
  text: string;
  commentsCount: number;
};

function BlogActionsDesktop({ text, title, commentsCount }: BlogActionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;

  // TODO: refractor to follow DRY principle

  const blogActions: BlogActionItem[] = [
    {
      id: 'like',
      icon: Heart,
      label: 'Like',
      ariaLabel: 'Like',
      count: 32,
      variant: 'ghost',
    },
    {
      id: 'comment',
      icon: MessageCircleIcon,
      label: 'Comment',
      ariaLabel: 'Comment',
      count: commentsCount,
      variant: 'ghost',
      onClick: () => {
        router.push('#comments');
      },
    },
    {
      id: 'save',
      icon: Bookmark,
      label: 'Save',
      ariaLabel: 'Save',
      variant: 'ghost',
      size: 'icon',
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      ariaLabel: 'Share',
      variant: 'ghost',
      size: 'icon',
    },
    {
      id: 'more',
      icon: Ellipsis,
      label: 'More',
      ariaLabel: 'More options',
      variant: 'ghost',
      size: 'icon',
    },
  ];

  return (
    <>
      {blogActions.map((action) => {
        const Icon = action.icon;
        const hasCount = action.count !== undefined;
        if (action.id === 'share') {
          return (
            <ShareButton key={action.id} url={url} text={text} title={title} />
          );
        }
        return (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                aria-label={action.ariaLabel}
                variant={action.variant}
                size={action.size}
                className={cn(
                  hasCount ? 'flex h-auto flex-col font-normal' : '',
                )}
                onClick={action.onClick}
              >
                <Icon /> {hasCount && action.count}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{action.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
}

function BlogActionsMobile({ text, title, commentsCount }: BlogActionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const blogActions: BlogActionItem[] = [
    {
      id: 'like',
      icon: Heart,
      label: 'Like',
      ariaLabel: 'Like',
      count: 32,
      variant: 'ghost',
    },
    {
      id: 'comment',
      icon: MessageCircleIcon,
      label: 'Comment',
      ariaLabel: 'Comment',
      count: commentsCount,
      variant: 'ghost',
      onClick: () => {
        router.push('#comments');
      },
    },
    {
      id: 'save',
      icon: Bookmark,
      label: 'Save',
      ariaLabel: 'Save',
      variant: 'ghost',
      size: 'icon',
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      ariaLabel: 'Share',
      variant: 'ghost',
      size: 'icon',
    },
    {
      id: 'more',
      icon: Ellipsis,
      label: 'More',
      ariaLabel: 'More options',
      variant: 'ghost',
      size: 'icon',
    },
  ];
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;

  return (
    <div
      className={cn(
        'bg-card border-border flex h-14 items-center justify-between border-t px-4 md:hidden',
        'fixed right-0 bottom-0 left-0 z-40',
      )}
    >
      {blogActions.map((action) => {
        const Icon = action.icon;
        const hasCount = action.count !== undefined;

        if (action.id === 'share') {
          return (
            <ShareButton key={action.id} url={url} text={text} title={title} />
          );
        }
        return (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                key={action.id}
                aria-label={action.ariaLabel}
                variant={action.variant}
                onClick={action.onClick}
                size={action.size}
                className="font-normal"
              >
                <Icon /> {hasCount && action.count}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{action.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export { BlogActionsDesktop, BlogActionsMobile };
