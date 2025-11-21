'use client';

import { type PlateElementProps, PlateElement } from 'platejs/react';

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      className="border-border my-1 border-l-4 py-2 pl-6 italic"
      {...props}
    />
  );
}
