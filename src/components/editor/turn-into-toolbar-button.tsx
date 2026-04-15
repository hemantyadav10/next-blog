'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import {
  CheckIcon,
  ChevronDown,
  FileCodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  TypeIcon,
} from 'lucide-react';
import * as React from 'react';

const turnIntoItems = [
  {
    icon: <TypeIcon />,
    label: 'Text',
    value: 'paragraph',
  },
  {
    icon: <Heading1Icon />,
    label: 'Heading 1',
    value: 'heading1',
  },
  {
    icon: <Heading2Icon />,
    label: 'Heading 2',
    value: 'heading2',
  },
  {
    icon: <Heading3Icon />,
    label: 'Heading 3',
    value: 'heading3',
  },
  {
    icon: <ListIcon />,
    label: 'Bulleted list',
    value: 'bulletList',
  },
  {
    icon: <ListOrderedIcon />,
    label: 'Numbered list',
    value: 'orderedList',
  },
  {
    icon: <FileCodeIcon />,
    label: 'Code',
    value: 'codeBlock',
  },
  {
    icon: <QuoteIcon />,
    label: 'Quote',
    value: 'blockquote',
  },
];

function getActiveBlockType(editor: Editor): string {
  if (editor.isActive('heading', { level: 2 })) return 'heading1';
  if (editor.isActive('heading', { level: 3 })) return 'heading2';
  if (editor.isActive('heading', { level: 4 })) return 'heading3';
  if (editor.isActive('bulletList')) return 'bulletList';
  if (editor.isActive('orderedList')) return 'orderedList';
  if (editor.isActive('codeBlock')) return 'codeBlock';
  if (editor.isActive('blockquote')) return 'blockquote';
  return 'paragraph';
}

function setBlockType(editor: Editor, value: string) {
  const chain = editor.chain().focus();
  switch (value) {
    case 'paragraph':
      chain.setParagraph().run();
      break;
    case 'heading1':
      chain.toggleHeading({ level: 2 }).run();
      break;
    case 'heading2':
      chain.toggleHeading({ level: 3 }).run();
      break;
    case 'heading3':
      chain.toggleHeading({ level: 4 }).run();
      break;
    case 'bulletList':
      chain.toggleBulletList().run();
      break;
    case 'orderedList':
      chain.toggleOrderedList().run();
      break;
    case 'codeBlock':
      chain.toggleCodeBlock().run();
      break;
    case 'blockquote':
      chain.toggleBlockquote().run();
      break;
  }
}

function TurnIntoToolbarButton({
  editor,
  onOpenChange,
}: {
  editor: Editor;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const activeValue = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? getActiveBlockType(e) : 'paragraph'),
  });

  const selectedItem = React.useMemo(
    () =>
      turnIntoItems.find((item) => item.value === activeValue) ??
      turnIntoItems[0],
    [activeValue],
  );

  if (!editor) return null;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onOpenChange?.(value);
      }}
      modal={false}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'min-w-[150px] justify-between rounded has-[>svg]:px-2',
                open && 'bg-secondary',
              )}
            >
              {selectedItem.label}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Turn into</TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="min-w-[200px]" align="start">
        <DropdownMenuRadioGroup
          value={activeValue ?? 'paragraph'}
          onValueChange={(value) => {
            setBlockType(editor, value);
            setOpen(false);
          }}
        >
          {turnIntoItems.map(({ icon, label, value }) => (
            <DropdownMenuRadioItem key={value} value={value} icon={CheckIcon}>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TurnIntoToolbarButton;
