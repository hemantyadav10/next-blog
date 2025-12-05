import BlogCardSkeleton from './BlogCardSkeleton';

type AllBlogsSkeletonProps = {
  count?: number;
  orientation?: 'horizontal' | 'vertical';
};

function AllBlogsSkeleton({
  count = 4,
  orientation = 'horizontal',
}: AllBlogsSkeletonProps) {
  return (
    <section className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} orientation={orientation} />
      ))}
    </section>
  );
}

export default AllBlogsSkeleton;
