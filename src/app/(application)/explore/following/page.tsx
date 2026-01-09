import AllBlogsSkeleton from '@/components/skeletons/AllBlogsSkeleton';
import { Suspense } from 'react';
import FollowingSection from '../components/FollowingSection';

async function Following({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense key={JSON.stringify(params)} fallback={<AllBlogsSkeleton />}>
      <FollowingSection searchParams={searchParams} />
    </Suspense>
  );
}

export default Following;
