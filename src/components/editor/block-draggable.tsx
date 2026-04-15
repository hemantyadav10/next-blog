'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { Editor } from '@tiptap/react';
import { GripVertical } from 'lucide-react';
import * as React from 'react';
import { Button } from '../ui/button';

const NESTED_CONFIG = { edgeDetection: { threshold: -16 } };

export function BlockDraggable({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <DragHandle editor={editor} nested={NESTED_CONFIG}>
      <DragHandleButton />
    </DragHandle>
  );
}

const DragHandleButton = React.memo(function DragHandleButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-drag-handle
          className="h-auto w-max cursor-grab rounded py-1 active:cursor-grabbing"
          variant={'ghost'}
          size={'icon-sm'}
        >
          <GripVertical />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Drag to move</TooltipContent>
    </Tooltip>
  );
});
