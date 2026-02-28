import BlogCard from '@/components/BlogCard';
import { ErrorState } from '@/components/error-state';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getRelatedBlogs } from '@/lib/blog';

async function RelatedBlogs({ blogId }: { blogId: string }) {
  let relatedBlogs;
  try {
    relatedBlogs = await getRelatedBlogs(blogId);
  } catch (error) {
    return (
      <ErrorState
        resource="blogs"
        error={
          error instanceof Error ? error : new Error('Failed to related blogs')
        }
      />
    );
  }

  if (relatedBlogs.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Related Blogs</h2>
      <Carousel opts={{ dragFree: true }} className="w-full">
        <CarouselContent>
          {relatedBlogs.map((blog) => {
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
                <div className="w-3xs p-0.5 md:w-xs">
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
    </section>
  );
}

export default RelatedBlogs;
