import * as React from 'react';

import type { SlateElementProps } from 'platejs/static';

import { type VariantProps, cva } from 'class-variance-authority';

const headingVariants = cva('relative mb-1 scroll-mt-22', {
  variants: {
    variant: {
      h2: 'mt-6 pb-px text-2xl font-semibold tracking-tight',
      h3: 'mt-5 pb-px text-xl font-semibold tracking-tight',
    },
  },
});

export function HeadingElementStatic({
  variant = 'h2',
  element,
  children,
}: SlateElementProps & VariantProps<typeof headingVariants>) {
  const Tag = variant as 'h2' | 'h3';

  return (
    <Tag id={element.id as string} className={headingVariants({ variant })}>
      {children}
    </Tag>
  );
}

export function H2ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h2" {...props} />;
}

export function H3ElementStatic(
  props: React.ComponentProps<typeof HeadingElementStatic>,
) {
  return <HeadingElementStatic variant="h3" {...props} />;
}
