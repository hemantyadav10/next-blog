'use client';

import Dropzone from '@/components/Dropzone';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BlogEditor from '@/components/editor/BlogEditor';
import CodeBlockComponent from '@/components/editor/CodeBlockComponent';
import { editorExtensions, lowlight } from '@/components/editor/extenstions';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from '@/hooks/use-debounce';
import { CreateBlogInput, createBlogSchema } from '@/lib/schema/blogSchema';
import { CategoryListItem } from '@/types/category.types';
import { zodResolver } from '@hookform/resolvers/zod';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Editor, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import BlogEditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';

function BlogForm({
  categories,
  blogData,
  slug,
  username,
}: {
  categories: CategoryListItem[];
  blogData?: CreateBlogInput & { _id: string };
  slug?: string;
  username: string;
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
      content: blogData?.content ?? {},
      title: blogData?.title ?? '',
      banner: blogData?.banner ?? undefined,
    },
  });

  const debouncedUpdate = useDebouncedCallback(
    ({ editor }: { editor: Editor }) => {
      methods.setValue('content', structuredClone(editor.getJSON()), {
        shouldTouch: true,
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    300,
  );

  const tipTapEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...editorExtensions,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content: methods.getValues('content'),
    onUpdate: debouncedUpdate,
    editorProps: {
      attributes: {
        class: 'p-6 md:py-8 md:px-12',
      },
    },
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <FormProvider {...methods}>
      <Controller
        name="content"
        control={methods.control}
        render={() => (
          <div>
            <BlogEditorHeader
              categories={categories}
              blogId={blogData?._id}
              slug={slug}
              editor={tipTapEditor}
              username={username}
            />
            <div className="mx-auto flex w-full max-w-7xl justify-center gap-6 px-4 pt-6 pb-16">
              <Field className="max-w-4xl min-w-0 flex-1">
                <Controller
                  name="title"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className="sr-only">
                        Title
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        rows={1}
                        className="placeholder:text-muted-foreground/50 min-h-16 w-full resize-none overflow-hidden rounded-none border-0 bg-transparent px-0 text-3xl leading-tight font-semibold shadow-none ring-0 outline-0 focus-visible:ring-0 md:text-5xl dark:bg-transparent"
                        placeholder="Write your post title"
                        onKeyDown={handleKeyDown}
                        onPaste={(e: ClipboardEvent<HTMLTextAreaElement>) => {
                          e.preventDefault();
                          const text = e.clipboardData
                            .getData('text')
                            .replace(/[\r\n]+/g, ' ')
                            .trim();
                          const target = e.currentTarget;
                          const start = target.selectionStart ?? 0;
                          const end = target.selectionEnd ?? 0;
                          const current = field.value ?? '';
                          const next =
                            current.slice(0, start) + text + current.slice(end);
                          field.onChange(next);
                          // Restore cursor position
                          requestAnimationFrame(() => {
                            target.selectionStart = start + text.length;
                            target.selectionEnd = start + text.length;
                          });
                        }}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                          const clean = e.target.value.replace(/[\r\n]+/g, ' ');
                          field.onChange(clean);
                          // Auto-resize
                          e.target.style.height = 'auto';
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        ref={(el) => {
                          field.ref(el);
                          // Set initial height on mount
                          if (el) {
                            el.style.height = 'auto';
                            el.style.height = `${el.scrollHeight}px`;
                          }
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Dropzone />

                <BlogEditor editor={tipTapEditor} />
              </Field>

              <div className="bg-background sticky top-[145px] hidden max-h-[calc(100vh-169px)] w-sm self-start overflow-y-auto py-6 xl:block">
                <EditorSidebar categories={categories} />
              </div>
            </div>
          </div>
        )}
      />
      <ScrollToTopButton scrollDistance={600} className="bottom-4" />
    </FormProvider>
  );
}

export default BlogForm;
