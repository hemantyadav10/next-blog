import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { Editor, EditorContent } from '@tiptap/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError } from '../ui/field';
import { Skeleton } from '../ui/skeleton';
import { BlockDraggable } from './block-draggable';
import { FloatingToolbar } from './floating-toolbar';

function BlogEditor({ editor }: { editor: Editor | null }) {
  const { control } = useFormContext<CreateBlogInput>();

  return (
    <Controller
      name="content"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

          <div
            aria-invalid={fieldState.invalid}
            className={cn(
              'border-input bg-background group w-full rounded border shadow-lg transition-[color,box-shadow] outline-none',
              'focus-within:ring-ring/50 focus-within:border-ring focus-within:ring-2',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            )}
          >
            {editor ? (
              <>
                <FloatingToolbar editor={editor} />
                <BlockDraggable editor={editor} />
                <EditorContent editor={editor} id={field.name} />
              </>
            ) : (
              <div className="min-h-screen space-y-4 p-12">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            )}
          </div>
        </Field>
      )}
    />
  );
}

export default BlogEditor;
