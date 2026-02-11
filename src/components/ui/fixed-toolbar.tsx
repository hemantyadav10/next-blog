'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'custom_scrollbar bg-accent/50 w-full justify-between overflow-x-auto rounded-md p-1',
        props.className,
      )}
    />
  );
}
