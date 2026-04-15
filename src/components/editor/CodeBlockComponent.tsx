'use client';

import {
  NodeViewContent,
  NodeViewWrapper,
  type ReactNodeViewProps,
} from '@tiptap/react';

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: ReactNodeViewProps) {
  const defaultLanguage =
    typeof node.attrs.language === 'string' ? node.attrs.language : null;

  const languages = extension.options?.lowlight?.listLanguages?.() ?? [];

  return (
    <NodeViewWrapper className="relative">
      <select
        contentEditable={false}
        value={defaultLanguage ?? ''}
        onChange={(event) =>
          updateAttributes({
            language: event.target.value || null,
          })
        }
        className="bg-popover text-foreground focus-visible:ring-ring/50 absolute top-0 right-2 z-10 rounded border px-2 py-1 text-xs outline-none focus-visible:ring-2"
      >
        <option value="">auto</option>
        <option disabled>—</option>

        {languages.map((lang: string) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <pre>
        <NodeViewContent className="mt-4" />
      </pre>
    </NodeViewWrapper>
  );
}
