'use client';

import type { PlateElementProps } from 'platejs/react';

import { type VariantProps, cva } from 'class-variance-authority';
import { PlateElement } from 'platejs/react';

const headingVariants = cva('relative mb-1', {
  variants: {
    variant: {
      h2: 'mt-6 pb-px text-2xl font-semibold tracking-tight',
      h3: 'mt-5 pb-px text-xl font-semibold tracking-tight',
    },
  },
});

export function HeadingElement({
  variant = 'h2',
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <PlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {props.children}
    </PlateElement>
  );
}

export function H2Element(props: PlateElementProps) {
  return <HeadingElement variant="h2" {...props} />;
}

export function H3Element(props: PlateElementProps) {
  return <HeadingElement variant="h3" {...props} />;
}
