'use client';

import EditorToolbar from '@/components/editor/EditorToolbar';
import { Logo } from '@/components/Logo';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { CategoryListItem } from '@/types/category.types';
import { Editor } from '@tiptap/react';
import { useFormContext } from 'react-hook-form';
import BlogActions from './BlogActions';

interface BlogEditorHeaderProps {
  categories: CategoryListItem[];
  blogId?: string;
  slug?: string;
  editor: Editor | null;
  username: string;
}

export default function BlogEditorHeader({
  categories,
  blogId,
  slug,
  editor,
  username,
}: BlogEditorHeaderProps) {
  const { watch } = useFormContext<CreateBlogInput>();
  const title = watch('title') || (!blogId && 'New Blog');

  return (
    <header className="bg-card sticky top-0 z-50 flex w-full flex-col items-center border-b pb-4 shadow-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4">
        {/* Logo and Title */}
        <div className="flex min-w-0 items-center gap-6">
          <Logo textClassName="block" showText={false} className="shrink-0" />
          <p
            className="line-clamp-1 max-w-60 text-sm"
            title={title || undefined}
          >
            {title}
          </p>
        </div>

        {/* Actions */}
        <BlogActions
          categories={categories}
          blogId={blogId}
          slug={slug}
          username={username}
        />
      </div>
      <div className="w-full space-y-2 px-4">
        <EditorToolbar editor={editor} />
      </div>
    </header>
  );
}
