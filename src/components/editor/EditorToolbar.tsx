import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  MinusIcon,
  Redo2Icon,
  SquareCodeIcon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import AlignToolbarButton from './align-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
} from './list-toolbar-button';
import ModeToolbarButton from './mode-toolbar-button';
import ToolbarButton, { ToolbarGroup } from './toolbar-button';
import TurnIntoToolbarButton from './turn-into-toolbar-button';

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return (
      <Skeleton className="bg-accent/40 flex min-h-10 w-full items-center rounded-md p-1" />
    );
  }

  const isEditable = editor.isEditable;

  return (
    <div className="bg-accent/40 flex w-full items-center overflow-x-auto rounded-md p-1">
      {isEditable && (
        <>
          <ToolbarGroup>
            <ToolbarButton
              icon={Undo2Icon}
              tooltip="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().undo().run()}
            />
            <ToolbarButton
              icon={Redo2Icon}
              tooltip="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().redo().run()}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <TurnIntoToolbarButton editor={editor} />
          </ToolbarGroup>
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
              icon={SquareCodeIcon}
              tooltip="Code block (⌘+⇧+C)"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              disabled={!editor.can().chain().toggleCodeBlock().run()}
            />
            <ToolbarButton
              icon={HighlighterIcon}
              tooltip="Highlight"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              disabled={!editor.can().chain().toggleHighlight().run()}
            />
            <ToolbarButton
              icon={MinusIcon}
              tooltip="Divider"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              isActive={editor.isActive('horizontalRule')}
              disabled={!editor.can().chain().setHorizontalRule().run()}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <AlignToolbarButton editor={editor} />
            <NumberedListToolbarButton editor={editor} />
            <BulletedListToolbarButton editor={editor} />
          </ToolbarGroup>
        </>
      )}

      <div className="flex-1" />
      <ToolbarGroup>
        <ModeToolbarButton editor={editor} />
      </ToolbarGroup>
    </div>
  );
}

export default EditorToolbar;
