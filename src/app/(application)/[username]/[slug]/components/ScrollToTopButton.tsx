'use client';

import { cn } from '@/lib/utils';
import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
      className={cn(
        'bg-secondary fixed z-40 flex items-center justify-center rounded-full border shadow-md transition-all',
        'size-8 md:size-9',
        'right-4 bottom-18 md:right-5 md:bottom-5',
        'hover:shadow-lg active:scale-90',
        visible
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-50 opacity-0',
      )}
    >
      <ChevronUpIcon className="size-4" />
    </button>
  );
}
