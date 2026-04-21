import AuthorDetailsSkeleton from '@/components/skeletons/AuthorDetailsSkeleton';
import { Suspense } from 'react';
import AuthorDetailsSection from './components/AuthorDetailsSection';

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}>) {
  return (
    <div className="py-8 md:py-12">
      <section className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 md:px-8">
        <section className="col-span-full space-y-4 md:col-span-4">
          <Suspense fallback={<AuthorDetailsSkeleton />}>
            <AuthorDetailsSection params={params} />
          </Suspense>
        </section>
        <section className="col-span-full shrink-0 pb-6 md:col-span-8">
          {children}
        </section>
      </section>
    </div>
  );
}
