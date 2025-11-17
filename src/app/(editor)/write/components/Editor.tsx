'use client';

import { Editor, EditorContainer } from '@/components/editor';
import { EditorKit } from '@/components/editor-kit';
import { Field, FieldError } from '@/components/ui/field';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/fixed-toolbar-buttons';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { Controller, useFormContext } from 'react-hook-form';

export default function MyEditorPage() {
  const { control, getValues } = useFormContext<CreateBlogInput>();

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: getValues('content'),
  });

  // Create debounced function ONCE and reuse it
  const debouncedOnChange = debounce(
    (onChange: (value: Value) => void, value: Value) => {
      onChange(value);
    },
    200,
  );

  return (
    <Controller
      name="content"
      control={control}
      render={({ field: { onChange, ref, onBlur, disabled }, fieldState }) => (
        <Field>
          <FieldError errors={[fieldState.error]} className="px-4 md:px-8" />
          <Plate
            editor={editor}
            onValueChange={({ value }) => {
              debouncedOnChange(onChange, value);
            }}
          >
            <div className="flex min-h-[calc(100vh-64px)] flex-col">
              <FixedToolbar>
                <FixedToolbarButtons />
              </FixedToolbar>
              <EditorContainer
                ref={ref}
                tabIndex={-1}
                onFocus={() => editor.tf.focus()}
                className={cn(
                  'flex-1',
                  fieldState.invalid && 'border-destructive rounded-lg border',
                )}
              >
                <Editor
                  onBlur={onBlur}
                  disabled={disabled}
                  placeholder="Type your amazing content here..."
                  className={cn(fieldState.invalid && 'caret-destructive')}
                />
              </EditorContainer>
            </div>
          </Plate>
        </Field>
      )}
    />
  );
}
