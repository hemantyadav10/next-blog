'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, validateUrl } from '@/lib/utils';
import { TextSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import { ExternalLink, LinkIcon, Text, Trash2Icon } from 'lucide-react';
import * as React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import ToolbarButton from './toolbar-button';

export function LinkToolbarButton({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [urlError, setUrlError] = React.useState<string | null>(null);

  const isLinkActive = editor.isActive('link');
  const linkUrl = (editor.getAttributes('link').href as string) ?? '';

  const normalizeUrl = React.useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }, []);

  const getSelectedText = React.useCallback(() => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  }, [editor]);

  React.useEffect(() => {
    if (!isOpen) {
      setUrlError(null);
      return;
    }

    const selectedText = getSelectedText();

    if (isLinkActive) {
      setUrl(linkUrl);
      setText(selectedText);
    } else {
      setUrl('');
      setText(selectedText);
    }
  }, [isOpen, isLinkActive, linkUrl, getSelectedText]);

  const applyLink = () => {
    const error = validateUrl(url);
    if (error) {
      setUrlError(error);
      return;
    }

    const href = normalizeUrl(url);
    const displayText = text.trim() || href;

    if (!href) return;

    const { from, to, empty } = editor.state.selection;
    const linkMark = editor.schema.marks.link.create({
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    });

    if (isLinkActive) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .command(({ tr, state }) => {
          const { from: linkFrom, to: linkTo } = state.selection;
          tr.insertText(displayText, linkFrom, linkTo);
          tr.addMark(linkFrom, linkFrom + displayText.length, linkMark);
          tr.setSelection(
            TextSelection.create(
              tr.doc,
              linkFrom,
              linkFrom + displayText.length,
            ),
          );
          return true;
        })
        .run();
    } else if (!empty) {
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.insertText(displayText, from, to);
          tr.addMark(from, from + displayText.length, linkMark);
          tr.setSelection(
            TextSelection.create(tr.doc, from, from + displayText.length),
          );
          return true;
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .command(({ tr, state }) => {
          const pos = state.selection.from;
          tr.insertText(displayText, pos);
          tr.addMark(pos, pos + displayText.length, linkMark);
          tr.setSelection(
            TextSelection.create(tr.doc, pos, pos + displayText.length),
          );
          return true;
        })
        .run();
    }

    setIsOpen(false);
    setUrl('');
    setText('');
    setUrlError(null);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsOpen(false);
    setUrl('');
    setText('');
    setUrlError(null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          icon={LinkIcon}
          tooltip="Link"
          isActive={editor.isActive('link')}
          className={cn(isLinkActive && 'text-primary', isOpen && 'bg-muted')}
        />
      </PopoverTrigger>

      <PopoverContent className="rounded-lg p-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <InputGroup className={cn('h-8')}>
              <InputGroupInput
                aria-invalid={!!urlError}
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError(validateUrl(e.target.value));
                }}
                onBlur={() => setUrlError(validateUrl(url))}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    applyLink();
                  }
                }}
              />
              <InputGroupAddon>
                <LinkIcon className={cn(urlError && 'text-destructive')} />
              </InputGroupAddon>
            </InputGroup>
            {urlError && <p className="text-destructive text-xs">{urlError}</p>}
          </div>

          <InputGroup className="h-8">
            <InputGroupInput
              placeholder="Text to display"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  applyLink();
                }
              }}
            />
            <InputGroupAddon>
              <Text />
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center justify-end gap-1">
            {isLinkActive && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={removeLink}
                title="Remove link"
                aria-label="Remove link"
              >
                <Trash2Icon />
              </Button>
            )}

            <Button
              variant="ghost"
              asChild
              size="icon-sm"
              disabled={!url.trim() || !!urlError}
              title="Open link in new tab"
              aria-label="Open link in new tab"
            >
              <a
                href={normalizeUrl(url) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!url.trim()) e.preventDefault();
                }}
              >
                <ExternalLink />
              </a>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={applyLink}
              disabled={!url.trim() || !!urlError}
            >
              {isLinkActive ? 'Update' : 'Apply Link'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
