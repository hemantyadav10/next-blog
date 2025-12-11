'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useScrollProgress } from '@/hooks/use-progressive-header';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Ellipsis,
  Heart,
  LucideIcon,
  MessageCircleIcon,
  Share2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
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
    count: 32,
    variant: 'ghost',
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

type BlogActionProps = {
  title: string;
  text: string;
};

function BlogActionsDesktop({ text, title }: BlogActionProps) {
  const pathname = usePathname();
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;

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

function BlogActionsMobile({ text, title }: BlogActionProps) {
  const pathname = usePathname();
  const url = new URL(pathname, process.env.NEXT_PUBLIC_BASE_URL).href;
  const offset = useScrollProgress(56);
  return (
    <div
      className={cn(
        'bg-background border-border fixed right-0 bottom-0 left-0 z-40 flex h-14 items-center justify-between border-t px-4 md:hidden',
      )}
      style={{
        transform: `translateY(${offset}px)`,
        boxShadow: '0 -1px 5px 0 rgba(0, 0, 0, 0.1)',
      }}
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
