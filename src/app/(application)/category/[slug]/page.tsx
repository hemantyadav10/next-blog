import AllBlogsSkeleton from '@/components/skeletons/AllBlogsSkeleton';
import PopularBlogsSkeleton from '@/components/skeletons/PopularBlogsSkeleton';
import { Separator } from '@/components/ui/separator';
import connectDb from '@/lib/connectDb';
import { Category } from '@/models';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LatestBlogsSection from './components/LatestBlogsSection';
import PopularBlogsSection from './components/PopularBlogsSection';

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDb();
  const category = await Category.findOne({ slug });

  if (!category) return notFound();

  return (
    <>
      <section className="w-full space-y-4">
        <h1 className="text-3xl font-semibold md:text-4xl">{category.name}</h1>
        <p className="text-foreground max-w-2xl">{category.description}</p>
      </section>
      <Separator />
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Popular Stories</h2>
        <Suspense fallback={<PopularBlogsSkeleton />}>
          <PopularBlogsSection categoryId={category._id.toString()} />
        </Suspense>
      </section>
      <Separator />
      <section className="grid grid-cols-12 gap-4">
        <section className="col-span-full flex md:col-span-3 md:flex-col">
          <h2 className="text-xl font-semibold">Latest Stories</h2>
        </section>
        <section className="col-span-full space-y-4 md:col-span-9">
          <Suspense fallback={<AllBlogsSkeleton />}>
            <LatestBlogsSection categoryId={category._id.toString()} />
          </Suspense>
        </section>
      </section>
    </>
  );
}

export default page;
