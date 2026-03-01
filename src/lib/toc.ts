import { Value } from 'platejs';
import { Node } from 'slate';

// lib/toc.ts
export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractToc(content: Value): TocItem[] {
  const headingTypes = new Set(['h2', 'h3']);

  return content
    .filter((node) => headingTypes.has(node.type as string) && node.id)
    .map((node) => ({
      id: node.id as string,
      text: Node.string(node).trim(),
      level: (node.type === 'h2' ? 2 : 3) as 2 | 3,
    }))
    .filter((item) => item.text.length > 0);
}
