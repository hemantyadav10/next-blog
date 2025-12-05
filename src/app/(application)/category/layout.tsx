import CategorySection from '@/components/CategorySection';
import CategoriesSkeleton from '@/components/skeletons/CategoriesSkeleton';
import { Suspense } from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-12 md:space-y-12 md:px-8">
      <section className="bg-background/90 sticky top-16 z-40 py-2 backdrop-blur-sm">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategorySection />
        </Suspense>
      </section>
      {children}
    </div>
  );
}
