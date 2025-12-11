import BlogCard from '@/components/BlogCard';
import { ErrorState } from '@/components/error-state';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getCategoryPopularBlogs } from '@/lib/blog';
import { FileText } from 'lucide-react';

async function PopularBlogsSection({ categoryId }: { categoryId: string }) {
  let blogs;

  try {
    blogs = await getCategoryPopularBlogs({ categoryId });
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error('Unable to load blogs');
    return <ErrorState resource="popular stories" error={err} />;
  }

  if (blogs.length === 0) {
    return (
      <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No posts in this category yet</EmptyTitle>
          <EmptyDescription>
            This category doesn&apos;t have any posts. Check back soon or
            explore other categories.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Carousel opts={{ dragFree: true }} className="w-full">
      <CarouselContent>
        {blogs.map((blog) => {
          const {
            _id,
            title,
            description,
            readTime,
            authorId,
            slug,
            publishedAt,
            blurDataUrl,
            banner,
          } = blog;
          return (
            <CarouselItem
              key={_id.toString()}
              className="basis-auto not-first:pl-8"
            >
              <div className="w-3xs p-0.5 md:w-sm">
                <BlogCard
                  orientation="vertical"
                  title={title}
                  description={description}
                  readTime={readTime}
                  authorName={`${authorId.firstName} ${authorId.lastName}`}
                  authorUsername={authorId.username}
                  slug={slug}
                  publishedAt={publishedAt}
                  blurDataUrl={blurDataUrl}
                  banner={banner}
                  authorProfilePicture={authorId.profilePicture}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex justify-end gap-4 pt-6">
        <CarouselPrevious className="static translate-y-0" size={'icon-lg'} />
        <CarouselNext className="static translate-y-0" size={'icon-lg'} />
      </div>
    </Carousel>
  );
}

export default PopularBlogsSection;
