import AllTagsSkeleton from '@/components/skeletons/AllTagsSkeleton';
import { Suspense } from 'react';
import TagsSection from '../components/TagsSection';

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense key={JSON.stringify(params)} fallback={<AllTagsSkeleton />}>
      <TagsSection searchParams={searchParams} />
    </Suspense>
  );
}

export default page;
