import UserCardListSkeleton from '@/components/skeletons/UserListSkeleton';
import { Suspense } from 'react';
import UsersSection from '../components/UsersSection';

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <Suspense key={JSON.stringify(params)} fallback={<UserCardListSkeleton />}>
      <UsersSection searchParams={searchParams} />
    </Suspense>
  );
}

export default page;
