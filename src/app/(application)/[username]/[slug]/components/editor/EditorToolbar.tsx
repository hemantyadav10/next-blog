import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Code,
  Heading,
  Italic,
  List,
  Minus,
  MoreHorizontal,
  Quote,
  SquareCode,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { useState } from 'react';
import AddLinkDialog from './AddLinkDialog';
import MarkdownHelp from './MarkdownHelp';

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: () => boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) return null;

  // Primary actions (always visible)
  const primaryActions: ToolbarAction[] = [
    {
      id: 'bold',
      label: 'Bold',
      icon: <Bold />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      id: 'italic',
      label: 'Italic',
      icon: <Italic />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      id: 'heading',
      label: 'Heading',
      icon: <Heading />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      id: 'codeBlock',
      label: 'Code Block',
      icon: <SquareCode />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
  ];

  const secondaryActions: ToolbarAction[] = [
    {
      id: 'underline',
      label: 'Underline',
      icon: <UnderlineIcon />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      id: 'strikethrough',
      label: 'Strikethrough',
      icon: <Strikethrough />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      id: 'code',
      label: 'Inline Code',
      icon: <Code />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
    {
      id: 'blockquote',
      label: 'Quote',
      icon: <Quote />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      id: 'bulletList',
      label: 'Bullet List',
      icon: <List />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      id: 'divider',
      label: 'Divider',
      icon: <Minus />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-1">
      {/* Primary actions */}
      {primaryActions.map(renderActionButton)}
      {/* Link Dialog */}
      <AddLinkDialog
        editor={editor}
        open={linkPopoverOpen}
        setOpen={setLinkPopoverOpen}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
      />
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
                <span className="sr-only">More options</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More options</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-auto p-1" align="end">
          <div className="grid grid-cols-3 gap-1">
            {secondaryActions.map(renderActionButton)}
          </div>
        </PopoverContent>
      </Popover>
      <MarkdownHelp />
    </div>
  );
};

const renderActionButton = (action: ToolbarAction) => {
  const active = action.isActive();
  return (
    <Tooltip key={action.id} delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          size="icon"
          className={`${active ? 'text-primary' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            action.onClick();
          }}
        >
          {action.icon}
          <span className="sr-only">{action.label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{action.label}</TooltipContent>
    </Tooltip>
  );
};

export default MenuBar;
