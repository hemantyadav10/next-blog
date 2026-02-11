'use client';

import Dropzone from '@/components/Dropzone';
import { Editor, EditorContainer } from '@/components/editor';
import { EditorKit } from '@/components/editor-kit';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CreateBlogInput, createBlogSchema } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { CategoryListItem } from '@/types/category.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';
import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import BlogEditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';

function BlogForm({
  categories,
  blogData,
  slug,
}: {
  categories: CategoryListItem[];
  blogData?: CreateBlogInput & { _id: string };
  slug?: string;
}) {
  const methods = useForm({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      description: blogData?.description ?? '',
      metaDescription: blogData?.metaDescription ?? '',
      categoryId: blogData?.categoryId ?? '',
      tags: blogData?.tags ?? [],
      status: blogData?.status ?? 'draft',
      isCommentsEnabled: blogData?.isCommentsEnabled ?? false,
      content: blogData?.content ?? [],
      title: blogData?.title ?? '',
      banner: blogData?.banner ?? undefined,
    },
  });

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: methods.getValues('content'),
  });

  const debouncedOnChange = debounce(
    (onChange: (value: Value) => void, value: Value) => {
      onChange(value);
    },
    200,
  );

  return (
    <FormProvider {...methods}>
      <Controller
        name="content"
        control={methods.control}
        render={({
          field: { onChange, ref, onBlur, disabled },
          fieldState,
        }) => (
          <Plate
            editor={editor}
            onValueChange={({ value }) => {
              debouncedOnChange(onChange, value);
            }}
          >
            <div>
              <BlogEditorHeader
                categories={categories}
                blogId={blogData?._id}
                slug={slug}
              />
              <div className="mx-auto flex w-full max-w-7xl justify-center gap-6 px-4 pt-6 pb-16">
                <Field className="max-w-3xl space-y-4">
                  <Controller
                    name="title"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className={cn('gap-0')}
                      >
                        <FieldLabel htmlFor={field.name} className="sr-only">
                          Title
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className="placeholder:text-muted-foreground/50 h-16 rounded-none border-0 border-b bg-transparent px-0 text-xl font-semibold shadow-none ring-0 outline-0 focus-visible:ring-0 md:text-3xl dark:bg-transparent"
                          placeholder="Title"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            className="mt-2"
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  <Dropzone />

                  <div className="dark:bg-input/30 bg-background border-input flex h-full flex-col border shadow-lg">
                    <EditorContainer
                      ref={ref}
                      tabIndex={-1}
                      onFocus={() => editor.tf.focus()}
                      className={cn(
                        'min-h-screen',
                        fieldState.invalid && 'border-destructive border',
                      )}
                    >
                      <Editor
                        onBlur={onBlur}
                        disabled={disabled}
                        placeholder="Type your amazing content here..."
                        className={cn(
                          fieldState.invalid && 'caret-destructive',
                        )}
                      />
                    </EditorContainer>
                  </div>
                </Field>

                <div className="custom_scrollbar bg-popover hidden w-sm self-start overflow-y-auto rounded-xl py-6 lg:block">
                  <EditorSidebar categories={categories} />
                </div>
              </div>
            </div>
          </Plate>
        )}
      />
    </FormProvider>
  );
}

export default BlogForm;
