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
import { CheckIcon, ChevronDownIcon, EyeIcon, PenIcon } from 'lucide-react';

const modes = {
  editing: { icon: <PenIcon className="size-4" />, label: 'Editing' },
  viewing: { icon: <EyeIcon className="size-4" />, label: 'Viewing' },
};

function ModeToolbarButton({ editor }: { editor: Editor | null }) {
  const isEditable = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.isEditable ?? true,
  });

  if (!editor) return null;

  const value = isEditable ? 'editing' : 'viewing';
  const current = modes[value];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={cn('rounded')}>
              {current.icon}
              <span>{current.label}</span>
              <ChevronDownIcon className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Editing mode</TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="min-w-[180px]" align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            if (newValue === 'viewing') {
              editor.setEditable(false);
            } else {
              editor.setEditable(true);
            }
            // force re-render
            editor.view.dispatch(editor.view.state.tr);
          }}
        >
          {Object.entries(modes).map(([key, { icon, label }]) => (
            <DropdownMenuRadioItem key={key} value={key} icon={CheckIcon}>
              {icon}
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ModeToolbarButton;
