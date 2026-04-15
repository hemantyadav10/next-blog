import { JSONContent } from '@tiptap/react';

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

const TOC_LEVELS = new Set([2, 3, 4]);

export function extractToc(content: JSONContent): TocItem[] {
  const headings =
    content.content?.filter(
      (node) =>
        node.type === 'heading' &&
        TOC_LEVELS.has(node.attrs?.level) &&
        node.attrs?.id,
    ) ?? [];

  return headings
    .map((node) => ({
      id: node.attrs!.id as string,
      text:
        node.content?.map((n) => n.text ?? n.attrs?.label ?? '').join('') ?? '',
      level: node.attrs!.level as 2 | 3 | 4,
    }))
    .filter((item) => item.text.length > 0);
}
