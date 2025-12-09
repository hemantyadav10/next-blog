'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PopulatedCategory } from '@/types/category.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type CategoriesProps = {
  categories: PopulatedCategory[];
};

function Categories({ categories }: CategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const pathname = usePathname();
  const selectedCategory = pathname.split('/')[2];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [categories]);

  // Scroll active category into view
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(
        '[data-active="true"]',
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedCategory]);

  const scroll = (direction: number) => {
    scrollRef.current?.scrollBy({ left: direction, behavior: 'smooth' });
  };

  return (
    <div className="relative -mx-4 flex items-center gap-2 md:mx-0">
      {showLeft && (
        <div className="from-background via-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 flex items-center bg-gradient-to-r to-transparent pr-8">
          <Button
            variant="ghost"
            size="icon-lg"
            className="pointer-events-auto rounded-full"
            onClick={() => scroll(-200)}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </Button>
        </div>
      )}

      <section
        ref={scrollRef}
        onScroll={checkScroll}
        className="scrollbar-hide flex items-center gap-2 overflow-x-auto p-1"
      >
        {categories.map((category) => (
          <Badge
            className="h-9 px-4 font-medium whitespace-nowrap md:text-sm"
            asChild
            variant={
              category.slug === selectedCategory ? 'default' : 'secondary'
            }
            key={category._id}
            data-active={category.slug === selectedCategory}
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Badge>
        ))}
      </section>

      {showRight && (
        <div className="from-background via-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 flex items-center bg-gradient-to-l to-transparent pl-8">
          <Button
            variant="ghost"
            size="icon-lg"
            className="pointer-events-auto rounded-full"
            onClick={() => scroll(200)}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Categories;
