import { type SlateElementProps, SlateElement } from 'platejs/static';

export function BlockquoteElementStatic(props: SlateElementProps) {
  return (
    <SlateElement
      as="blockquote"
      className="border-border my-1 border-l-4 py-2 pl-6 italic"
      {...props}
    />
  );
}
