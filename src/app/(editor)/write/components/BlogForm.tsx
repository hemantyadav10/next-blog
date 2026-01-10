'use client';

import Dropzone from '@/components/Dropzone';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CreateBlogInput, createBlogSchema } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { CategoryListItem } from '@/types/category.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import EditorComponent from './Editor';
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

  return (
    <FormProvider {...methods}>
      <div>
        <BlogEditorHeader
          categories={categories}
          blogId={blogData?._id}
          slug={slug}
        />
        <div className="border-x-border mx-auto grid h-[calc(100vh-64px)] max-w-[80rem] grid-cols-12 xl:border-x">
          <div className="custom_scrollbar col-span-12 h-full min-h-0 overflow-y-auto lg:col-span-8">
            {/* Title Input */}
            <Controller
              name="title"
              control={methods.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className={cn(
                    'gap-0 rounded-lg',
                    fieldState.invalid && 'border-destructive border',
                  )}
                >
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="placeholder:text-muted-foreground/50 h-16 rounded-none border-0 bg-transparent px-4 text-xl font-semibold shadow-none ring-0 outline-0 focus-visible:border-0 focus-visible:ring-0 md:px-8 md:text-3xl dark:bg-transparent"
                    placeholder="Start with a great title..."
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className="mb-2 px-4 md:px-8"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            {/* Upload Cover */}
            <div className="border-border border-t p-4 md:p-8">
              <Dropzone />
            </div>

            {/* Editor */}
            <EditorComponent />
          </div>

          {/* Blog Settings */}
          <div className="custom_scrollbar col-span-4 hidden h-full min-h-0 overflow-y-auto border-l lg:block">
            <EditorSidebar categories={categories} />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default BlogForm;
