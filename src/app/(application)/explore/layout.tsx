import CategorySection from '@/components/CategorySection';
import CategoriesSkeleton from '@/components/skeletons/CategoriesSkeleton';
import { Suspense } from 'react';
import FilterSection from './components/FilterSection';
import SearchResultsHeader from './components/SearchResultsHeader';
import SearchSection from './components/SearchSection';
import SortingSection from './components/SortingSection';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 md:px-8 md:py-12">
      <section className="w-full space-y-6">
        <h1 className="text-center text-4xl font-semibold">Discover Stories</h1>
        <p className="text-foreground mx-auto max-w-2xl text-center">
          Browse through our collection of stories and insights from writers
          around the world. Find your next great read.
        </p>
      </section>

      <section>
        <Suspense>
          <SearchSection />
        </Suspense>
      </section>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategorySection />
      </Suspense>

      <Suspense>
        <SearchResultsHeader />
      </Suspense>

      <section className="grid grid-cols-12 gap-4">
        <section className="bg-background sticky top-16 z-40 col-span-full flex self-start overflow-x-auto md:col-span-3 md:flex-col">
          <Suspense>
            <FilterSection />
          </Suspense>
        </section>

        <section className="col-span-full space-y-4 md:col-span-9">
          <Suspense>
            <SortingSection />
          </Suspense>
          {/* Search results section */}
          {children}
        </section>
      </section>
    </div>
  );
}
