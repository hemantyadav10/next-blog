'use client';

import { type Editor } from '@tiptap/react';
import { Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Field, FieldDescription } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
import { FormEvent } from 'react';

interface AddLinkProps {
  editor: Editor | null;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddLinkDialog({
  editor,
  linkUrl,
  setLinkUrl,
  open,
  setOpen,
}: AddLinkProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!editor) return null;

  const applyLink = () => {
    // Check if there's a selection or if we're editing an existing link
    const { from, to } = editor.state.selection;

    if (from === to && !editor.isActive('link')) {
      // No selection and not on a link - do nothing or show error
      alert('Please select text first to add a link');
      return;
    }

    // If editing existing link or has selection
    if (editor.isActive('link')) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }

    setOpen(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
    setLinkUrl('');
  };

  const triggerButton = (
    <Button
      variant={editor.isActive('link') ? 'secondary' : 'ghost'}
      size="icon"
      className={editor.isActive('link') ? 'text-primary' : ''}
    >
      <LinkIcon />
      <span className="sr-only">Link</span>
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Link</TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>
              Paste a URL to link the selected text.
            </DialogDescription>
          </DialogHeader>

          <LinkForm
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            applyLink={applyLink}
          />

          <DialogFooter>
            {editor.isActive('link') && (
              <Button type="button" variant="outline" onClick={removeLink}>
                Remove
              </Button>
            )}
            <Button form="link-form" type="submit">
              Apply Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Link</DrawerTitle>
          <DrawerDescription>
            Paste a URL to link the selected text.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-4">
          <LinkForm
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            applyLink={applyLink}
          />
        </div>
        <DrawerFooter className="pt-2">
          <Button form="link-form" type="submit" className="flex-1">
            Apply Link
          </Button>
          {editor.isActive('link') && (
            <Button type="button" variant="outline" onClick={removeLink}>
              Remove
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function LinkForm({
  linkUrl,
  setLinkUrl,
  applyLink,
}: {
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  applyLink: () => void;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyLink();
  };

  return (
    <form onSubmit={handleSubmit} id="link-form">
      <Field>
        <InputGroup>
          <InputGroupInput
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value.trim())}
            autoFocus
            required
          />
          <InputGroupAddon>
            <LinkIcon />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Tip: Highlight text in the editor before adding a link.
        </FieldDescription>
      </Field>
    </form>
  );
}
