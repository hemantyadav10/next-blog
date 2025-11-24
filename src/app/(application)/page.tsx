import FeaturedBlogs from '@/components/FeaturedBlogs';
import HeroSection from '@/components/HeroSection';
import RecentBlogs from '@/components/RecentBlogs';
import { FeaturedBlogsSkeleton } from '@/components/skeletons/FeaturedBlogsSkeleton';
import { RecentBlogsSkeleton } from '@/components/skeletons/RecentBlogsSkeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 py-12 md:space-y-16 md:px-8 md:py-16">
      <HeroSection />
      <Suspense fallback={<FeaturedBlogsSkeleton />}>
        <FeaturedBlogs />
      </Suspense>
      <div className="grid grid-cols-12 gap-x-6 gap-y-12 md:gap-y-16">
        <Suspense fallback={<RecentBlogsSkeleton />}>
          <RecentBlogs />
        </Suspense>
      </div>
    </div>
  );
}
