'use client';

import { createBlog, updateBlog } from '@/app/actions/blogActions';
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
import { useMediaQuery } from '@/hooks/use-media-query';
import { CreateBlogInput } from '@/lib/schema/blogSchema';
import { cn } from '@/lib/utils';
import { CategoryListItem } from '@/types/category.types';
import { PanelRight, Save, Send } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import EditorSidebar from './EditorSidebar';

interface BlogActionsProps {
  categories: CategoryListItem[];
  blogId?: string;
  slug?: string;
}

function BlogActions({ categories, blogId, slug }: BlogActionsProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width : 1024px)');

  return (
    <div className="flex items-center gap-3">
      {blogId && slug && (
        <Button
          className="hidden sm:flex"
          onClick={() => router.back()}
          variant="outline"
        >
          Cancel
        </Button>
      )}
      {isDesktop && <BlogActionButton blogId={blogId} slug={slug} />}

      <ModeToggle allOptions={false} />

      {!isDesktop && (
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="toggle sidebar"
                variant={'ghost'}
                size={'icon'}
              >
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
                  <BlogActionButton blogId={blogId} slug={slug} />

                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}

export default BlogActions;

function BlogActionButton({
  className,
  blogId,
  slug,
}: {
  className?: string;
  blogId?: string;
  slug?: string;
}) {
  const path = usePathname();
  const username = path.split('/')[1];
  const {
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { isDirty },
  } = useFormContext<CreateBlogInput>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEditing = Boolean(blogId);

  async function handleSubmitAction(blogData: CreateBlogInput) {
    const isPublishing = blogData.status === 'published';

    startTransition(async () => {
      const promise =
        isEditing && blogId
          ? updateBlog(blogId, blogData)
          : createBlog(blogData);

      toast.promise(promise, {
        loading: isEditing
          ? isPublishing
            ? 'Updating and publishing...'
            : 'Saving changes...'
          : isPublishing
            ? 'Publishing your blog… Hang tight!'
            : 'Saving your draft… Just a moment',
        success: (result) => {
          if (result.success) {
            return isEditing
              ? 'Blog updated successfully!'
              : isPublishing
                ? 'Your blog is now live!'
                : 'Your draft has been saved successfully';
          }
          throw new Error(result.error);
        },
        error: (err) =>
          err.message ||
          (isEditing
            ? 'Failed to update blog. Please try again.'
            : isPublishing
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
        // Redirect logic
        if (isEditing) {
          if (isPublishing && username && slug) {
            router.push(`/${username}/${slug}`);
          } else {
            router.push('/dashboard/posts');
          }
        } else {
          if (isPublishing && result.data.slug && username) {
            router.push(`/${username}/${result.data.slug}`);
          } else {
            router.push('/dashboard/posts');
          }
        }
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
      disabled={isPending || !isDirty}
    >
      {isPending ? (
        <>
          <Spinner />
          {status === 'draft' ? 'Saving...' : 'Publishing...'}
        </>
      ) : (
        <>
          {status === 'draft' ? <Save /> : <Send />}
          {status === 'draft'
            ? isEditing
              ? 'Update Draft'
              : 'Save Draft'
            : isEditing
              ? 'Update Post'
              : 'Publish'}
        </>
      )}
    </Button>
  );
}
