'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useScrollToHash } from '@/hooks/use-scroll-to-hash';
import { cn } from '@/lib/utils';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Ref, useImperativeHandle, useState } from 'react';
import MenuBar from './EditorToolbar';

export interface RichTextCommentEditorRef {
  focus: () => void;
  getContent: () => string;
  clearContent: () => void;
}

export interface RichTextCommentEditorProps {
  firstName?: string;
  profilePicture?: string;
  ref?: Ref<RichTextCommentEditorRef>;
  showMenu?: boolean;
  showCancelButton?: boolean;
  placeholder?: string;
  showLoader?: boolean;
  blogId?: string;
  parentCommentId?: string;
  content?: string;
  onCancel?: () => void;
  onSubmit?: () => Promise<void> | void;
  isLoading?: boolean;
  submitLabel?: string;
}

const RichTextCommentEditor = ({
  firstName,
  profilePicture,
  onCancel,
  ref,
  showMenu = false,
  showCancelButton = true,
  placeholder = 'Leave a comment...',
  showLoader = true,
  content,
  onSubmit,
  isLoading,
  submitLabel,
}: RichTextCommentEditorProps) => {
  const [show, setShow] = useState(showMenu);
  const [, setUpdateTick] = useState(0);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollToHash('comments');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-link underline cursor-pointer',
        },
      }),
      Placeholder.configure({ placeholder: placeholder }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert focus:outline-none min-h-16 max-h-[50vh] custom_scrollbar overflow-y-auto w-full px-3 max-w-none py-2 text-sm break-words [&_a]:break-all',
      },
    },
    onUpdate: () => {
      setUpdateTick((tick) => tick + 1);
      if (error) setError(null);
    },
    onSelectionUpdate: () => setUpdateTick((tick) => tick + 1),
    onFocus: () => setShow(true),
    onCreate: () => setIsEditorReady(true),
    content: content || '',
  });

  const isEmpty = Boolean(
    !editor || editor.isEmpty || editor.getText().trim() === '',
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editor?.chain().focus('end', { scrollIntoView: false });
        setShow(true);
      },
      getContent: () => editor?.getHTML() || '',
      clearContent: () => {
        editor?.commands.clearContent();
      },
    }),
    [editor],
  );

  const handleSubmit = () => {
    if (isEmpty) {
      setError('Comment cannot be empty.');
      return;
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-start gap-2">
      {firstName && (
        <Avatar className="hidden size-8 md:block">
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      {showLoader && (!editor || !isEditorReady) ? (
        <Skeleton className="h-[65.5px] w-full" />
      ) : (
        <Field>
          <div
            key="editor"
            aria-invalid={!!error}
            className={cn(
              'border-input dark:bg-input/30 hover:border-ring/70 min-w-0 flex-1 overflow-hidden rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none',
              'selection:bg-primary selection:text-primary-foreground',
              'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[2px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            )}
          >
            {show && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
            {show && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <div className="flex flex-1 flex-wrap-reverse justify-end gap-2">
                  {showCancelButton && (
                    <Button
                      disabled={isLoading}
                      variant={'secondary'}
                      size="sm"
                      onClick={() => {
                        if (onCancel) {
                          onCancel();
                          return;
                        }
                        editor?.commands.clearContent();
                        setShow(false);
                      }}
                      className="disabled:cursor-not-allowed"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isEmpty || isLoading}
                    className="disabled:cursor-not-allowed"
                  >
                    {isLoading && <Spinner />} {submitLabel || 'Comment'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </Field>
      )}
    </div>
  );
};

export default RichTextCommentEditor;
