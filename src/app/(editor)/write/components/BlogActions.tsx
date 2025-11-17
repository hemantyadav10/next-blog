'use client';

import { createBlog } from '@/app/actions/blogActions';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { CategoryListItem } from '@/types/category.types';
import { PanelRight, Save, Send } from 'lucide-react';
import { useTransition } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import EditorSidebar from './EditorSidebar';

function BlogActions({ categories }: { categories: CategoryListItem[] }) {
  return (
    <div className="flex items-center gap-3">
      <BlogActionButton className="hidden lg:flex" />

      <ModeToggle allOptions={false} />

      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="toggle sidebar" variant={'ghost'} size={'icon'}>
              <PanelRight />
            </Button>
          </SheetTrigger>
          <SheetContent
            aria-describedby={undefined}
            className="w-full max-w-xs gap-0 rounded-l-xl sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle>Post Settings</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="custom_scrollbar h-full overflow-y-auto">
              <EditorSidebar categories={categories} />
            </div>
            <Separator />
            <SheetFooter>
              <div className="flex justify-end gap-2">
                <BlogActionButton />

                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default BlogActions;

function BlogActionButton({ className }: { className?: string }) {
  const { handleSubmit, watch, setError, reset } =
    useFormContext<CreateBlogInput>();
  const [isPending, startTransition] = useTransition();

  async function handleSubmitAction(blogData: CreateBlogInput) {
    const isPublishing = blogData.status === 'published';
    startTransition(async () => {
      const promise = createBlog(blogData);

      toast.promise(promise, {
        loading: isPublishing
          ? 'Publishing your blog… Hang tight!'
          : 'Saving your draft… Just a moment',
        success: (result) => {
          if (result.success) {
            return isPublishing
              ? 'Your blog is now live!'
              : 'Your draft has been saved successfully';
          }
          throw new Error(result.message);
        },
        error: (err) =>
          err.message ||
          (isPublishing
            ? 'Failed to publish your blog. Please try again.'
            : 'Could not save your draft. Please try again.'),
      });

      const result = await promise;

      if (!result.success) {
        const errors = result.errors;
        if (errors) {
          (Object.keys(errors) as (keyof CreateBlogInput)[]).forEach((key) => {
            const value = errors[key];
            if (value?.[0]) {
              setError(key, { message: value[0] });
            }
          });
        }
      } else {
        reset();
      }
    });
  }

  const status = watch('status');

  return (
    <Button
      size="sm"
      onClick={handleSubmit(handleSubmitAction)}
      className={cn(className)}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Spinner />
          {status === 'draft' ? 'Saving...' : 'Publishing...'}
        </>
      ) : (
        <>
          {status === 'draft' ? <Save /> : <Send />}
          {status === 'draft' ? 'Save Draft' : 'Publish'}
        </>
      )}
    </Button>
  );
}
