import CategorySection from '@/components/CategorySection';
import CategoriesSkeleton from '@/components/skeletons/CategoriesSkeleton';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-12 md:space-y-12 md:px-8">
      <section
        className={cn(
          'bg-background/95 sticky-below-header sticky z-40 py-1 backdrop-blur-sm',
          'dark:bg-background/90 dark:backdrop-blur-lg',
        )}
      >
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategorySection />
        </Suspense>
      </section>
      {children}
    </div>
  );
}
