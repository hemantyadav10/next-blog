'use client';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { LinkToolbarButton } from './link-toolbar-button';
import ToolbarButton, { ToolbarGroup } from './toolbar-button';

export function FloatingToolbar({ editor }: { editor: Editor }) {
  return (
    <BubbleMenu
      editor={editor}
      className="bg-popover border-border scrollbar-hide z-50 flex max-w-[80vw] items-center overflow-x-auto rounded-md border p-1 whitespace-nowrap shadow-lg print:hidden"
    >
      <ToolbarGroup>
        <ToolbarButton
          icon={BoldIcon}
          tooltip="Bold (⌘+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={!editor.can().chain().toggleBold().run()}
        />
        <ToolbarButton
          icon={ItalicIcon}
          tooltip="Italic (⌘+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={!editor.can().chain().toggleItalic().run()}
        />
        <ToolbarButton
          icon={UnderlineIcon}
          tooltip="Underline (⌘+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={!editor.can().chain().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={StrikethroughIcon}
          tooltip="Strikethrough (⌘+⇧+M)"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          disabled={!editor.can().chain().toggleStrike().run()}
        />
        <ToolbarButton
          icon={Code2Icon}
          tooltip="Code (⌘+E)"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          disabled={!editor.can().chain().toggleCode().run()}
        />
        <LinkToolbarButton editor={editor} />
        <ToolbarButton
          icon={HighlighterIcon}
          tooltip="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          disabled={!editor.can().chain().toggleHighlight().run()}
        />
      </ToolbarGroup>
    </BubbleMenu>
  );
}
