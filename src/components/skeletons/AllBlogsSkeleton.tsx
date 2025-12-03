import BlogCardSkeleton from './BlogCardSkeleton';

function AllBlogsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </section>
  );
}

export default AllBlogsSkeleton;
