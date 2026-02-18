import { Separator } from '@/components/ui/separator';
import { verifyAuth } from '@/lib/auth';
import { getReadingList } from '@/lib/reading-list';
import { notFound } from 'next/navigation';
import ReadingList from './ReadingList';

async function ReadingListPage() {
  const { isAuthenticated, user } = await verifyAuth();
  if (!isAuthenticated) return notFound();

  const response = await getReadingList({ userId: user.userId });

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <h1 className="text-2xl font-semibold md:text-3xl">Reading List</h1>
      <Separator />
      <ReadingList initialData={response} userId={user.userId} />
    </section>
  );
}

export default ReadingListPage;
