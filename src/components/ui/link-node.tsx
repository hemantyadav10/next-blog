'use client';

import type { TLinkElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { getLinkAttributes } from '@platejs/link';
import { PlateElement } from 'platejs/react';

import { cn } from '@/lib/utils';

export function LinkElement(props: PlateElementProps<TLinkElement>) {
  // const suggestionData = props.editor
  //   .getApi(SuggestionPlugin)
  //   .suggestion.suggestionData(props.element) as
  //   | TInlineSuggestionData
  //   | undefined;

  return (
    <PlateElement
      {...props}
      as="a"
      className={cn(
        'text-[#044c9f] underline underline-offset-2 dark:text-[#a4cefe]',
        // suggestionData?.type === 'remove' && 'bg-red-100 text-red-700',
        // suggestionData?.type === 'insert' && 'bg-emerald-100 text-emerald-700'
      )}
      attributes={{
        ...props.attributes,
        ...getLinkAttributes(props.editor, props.element),
        onMouseOver: (e) => {
          e.stopPropagation();
        },
      }}
    >
      {props.children}
    </PlateElement>
  );
}
