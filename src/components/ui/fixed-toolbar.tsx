'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'custom_scrollbar border-y-border bg-background/80 supports-backdrop-blur:bg-background/80 sticky top-0 left-0 z-50 w-full justify-between overflow-x-auto border-y p-1 backdrop-blur-sm',
        props.className,
      )}
    />
  );
}
