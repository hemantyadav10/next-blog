'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import ToolbarButton from './toolbar-button';

export function BulletedListToolbarButton({
  editor,
}: {
  editor: Editor | null;
}) {
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('bulletList') ?? false,
  });

  if (!editor) return null;

  return (
    <ToolbarButton
      icon={List}
      tooltip="Bulleted list"
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      isActive={!!isActive}
      disabled={!editor.can().chain().toggleBulletList().run()}
    />
  );
}

export function NumberedListToolbarButton({
  editor,
}: {
  editor: Editor | null;
}) {
  const isActive = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isActive('orderedList') ?? false,
  });

  if (!editor) return null;

  return (
    <ToolbarButton
      icon={ListOrdered}
      tooltip="Numbered list"
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      isActive={!!isActive}
      disabled={!editor.can().chain().toggleOrderedList().run()}
    />
  );
}
