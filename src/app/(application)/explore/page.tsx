import AllBlogsSkeleton from '@/components/skeletons/AllBlogsSkeleton';
import { Suspense } from 'react';
import BlogsSection from './components/BlogsSection';

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense key={JSON.stringify(params)} fallback={<AllBlogsSkeleton />}>
      <BlogsSection searchParams={searchParams} />
    </Suspense>
  );
}

export default page;
