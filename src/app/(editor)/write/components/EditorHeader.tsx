import { Logo } from '@/components/Logo';
import { CategoryListItem } from '@/types/category.types';
import BlogActions from './BlogActions';

export default function BlogEditorHeader({
  categories,
}: {
  categories: CategoryListItem[];
}) {
  return (
    <header className="bg-background border-border sticky top-0 z-50 flex w-full items-center backdrop-blur-sm">
      <div className="border-border mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between border-b px-4 md:px-8 xl:border-x">
        {/* Logo and Title */}
        <Logo textClassName="block" />

        {/* Actions */}
        <BlogActions categories={categories} />
      </div>
    </header>
  );
}
