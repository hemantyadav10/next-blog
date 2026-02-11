'use client';

import { Logo } from '@/components/Logo';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/fixed-toolbar-buttons';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { CategoryListItem } from '@/types/category.types';
import { useFormContext } from 'react-hook-form';
import BlogActions from './BlogActions';

interface BlogEditorHeaderProps {
  categories: CategoryListItem[];
  blogId?: string;
  slug?: string;
}

export default function BlogEditorHeader({
  categories,
  blogId,
  slug,
}: BlogEditorHeaderProps) {
  const { watch } = useFormContext<CreateBlogInput>();
  const title = watch('title') || (!blogId && 'New Blog');

  return (
    <header className="bg-card sticky top-0 z-50 flex w-full flex-col items-center border-b pb-4 shadow-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-6">
          <Logo textClassName="block" showText={false} className="shrink-0" />
          <p
            className="line-clamp-1 max-w-md text-sm"
            title={title || undefined}
          >
            {title}
          </p>
        </div>

        {/* Actions */}
        <BlogActions categories={categories} blogId={blogId} slug={slug} />
      </div>
      <div className="w-full px-4">
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      </div>
    </header>
  );
}
