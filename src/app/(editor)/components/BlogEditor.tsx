import BlogForm from '@/app/(editor)/write/components/BlogForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import connectDb from '@/lib/connectDb';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import Category from '@/models/categoryModel';
import { CategoryListItem } from '@/types/category.types';
import { AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';

async function getCategories(): Promise<CategoryListItem[]> {
  await connectDb();

  const categories = await Category.find()
    .select('name slug description blogsCount')
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

export default async function BlogEditor({
  blogData,
  slug,
}: {
  blogData?: CreateBlogInput & { _id: string };
  slug?: string;
}) {
  let categories;
  let error = null;

  try {
    categories = await getCategories();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Database error fetching categories:', err);
    error = errorMessage;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-4 md:p-8">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            We&apos;re having trouble loading the category list right now.
            Please refresh the page or come back a little later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="mx-auto max-w-xl p-4 md:p-8">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>Blog Creation Temporarily Unavailable</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Categories are currently being set up by your administrator.
              You&apos;ll be able to create posts once this is complete.
            </p>
            <div className="flex items-center gap-1">
              <span>Need help?</span>
              <Button size={'sm'} asChild variant={'link'}>
                <Link href="/contact">Contact support</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <BlogForm categories={categories} blogData={blogData} slug={slug} />;
}
