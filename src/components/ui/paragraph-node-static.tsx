import type { SlateElementProps } from 'platejs/static';

import { SlateElement } from 'platejs/static';

import { cn } from '@/lib/utils';

export function ParagraphElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props} className={cn('m-0 px-0 py-1 leading-7')}>
      {props.children}
    </SlateElement>
  );
}
