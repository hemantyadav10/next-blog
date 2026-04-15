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
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  CheckIcon,
  ChevronDown,
} from 'lucide-react';
import * as React from 'react';

const alignItems = [
  {
    icon: <AlignLeftIcon />,
    label: 'Align Left',
    value: 'left',
  },
  {
    icon: <AlignCenterIcon />,
    label: 'Align Center',
    value: 'center',
  },
  {
    icon: <AlignRightIcon />,
    label: 'Align Right',
    value: 'right',
  },
  {
    icon: <AlignJustifyIcon />,
    label: 'Justify',
    value: 'justify',
  },
];

const alignIconMap: Record<string, React.ReactNode> = {
  left: <AlignLeftIcon />,
  center: <AlignCenterIcon />,
  right: <AlignRightIcon />,
  justify: <AlignJustifyIcon />,
};

function getActiveAlignment(editor: Editor): string {
  if (editor.isActive({ textAlign: 'center' })) return 'center';
  if (editor.isActive({ textAlign: 'right' })) return 'right';
  if (editor.isActive({ textAlign: 'justify' })) return 'justify';
  return 'left';
}

function AlignToolbarButton({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = React.useState(false);

  const activeValue = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? getActiveAlignment(e) : 'left'),
  });

  if (!editor) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'text-foreground hover:bg-secondary gap-1 rounded has-[>svg]:px-2 [&_svg]:text-inherit',
                open && 'bg-secondary',
              )}
            >
              {alignIconMap[activeValue ?? 'left']}
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Align</TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="min-w-0" align="start">
        <DropdownMenuRadioGroup
          value={activeValue ?? 'left'}
          onValueChange={(value) => {
            editor.chain().focus().setTextAlign(value).run();
            setOpen(false);
          }}
        >
          {alignItems.map(({ icon, value }) => (
            <DropdownMenuRadioItem key={value} value={value} icon={CheckIcon}>
              {icon}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AlignToolbarButton;
