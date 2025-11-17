import { AlignKit } from '@/components/plugins/align-kit';
import { AutoformatKit } from '@/components/plugins/autoformat-kit';
import { BasicBlocksKit } from '@/components/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/components/plugins/basic-marks-kit';
import { BlockMenuKit } from '@/components/plugins/block-menu-kit';
import { BlockPlaceholderKit } from '@/components/plugins/block-placeholder-kit';
import { BlockSelectionKit } from '@/components/plugins/block-selection-kit';
import { CodeBlockKit } from '@/components/plugins/code-block-kit';
import { DndKit } from '@/components/plugins/dnd-kit';
import { ExitBreakKit } from '@/components/plugins/exit-break-kit';
import { FloatingToolbarKit } from '@/components/plugins/floating-toolbar-kit';
import { FontKit } from '@/components/plugins/font-kit';
import { IndentKit } from '@/components/plugins/indent-kit';
import { LineHeightKit } from '@/components/plugins/line-height-kit';
import { LinkKit } from '@/components/plugins/link-kit';
import { ListKit } from '@/components/plugins/list-kit';
import { MathKit } from '@/components/plugins/math-kit';
import { MediaKit } from '@/components/plugins/media-kit';
import { SlashKit } from '@/components/plugins/slash-kit';
import { TrailingBlockPlugin, Value } from 'platejs';
import { TPlateEditor, useEditorRef } from 'platejs/react';

export const EditorKit = [
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...MediaKit,
  ...FontKit,
  ...MathKit,
  ...LinkKit,
  ...BasicMarksKit,
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,
  ...IndentKit,
  ...SlashKit,
  ...AutoformatKit,
  ...DndKit,
  ...BlockMenuKit,
  ...BlockSelectionKit,
  ...BlockPlaceholderKit,
  ...FloatingToolbarKit,
  TrailingBlockPlugin,
  ...ExitBreakKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
