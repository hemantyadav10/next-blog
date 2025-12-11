'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(headerHeight = 64) {
  const [headerOffset, setHeaderOffset] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isMobile = useRef(false);

  useEffect(() => {
    // Initialize
    lastScrollY.current = window.scrollY;
    isMobile.current = window.innerWidth < 768;

    const updateOffset = () => {
      const currentScrollY = window.scrollY;

      // Early return if at top of page
      if (currentScrollY <= 0) {
        setHeaderOffset(0);
        lastScrollY.current = 0;
        ticking.current = false;
        return;
      }

      const scrollDiff = currentScrollY - lastScrollY.current;

      // Only update if there's actual movement
      if (scrollDiff !== 0) {
        setHeaderOffset((prev) => {
          const newOffset = prev + scrollDiff;
          return Math.max(0, Math.min(newOffset, headerHeight));
        });
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!isMobile.current || ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(updateOffset);
    };

    const handleResize = () => {
      const wasMobile = isMobile.current;
      isMobile.current = window.innerWidth < 768;

      // Reset offset when switching to desktop
      if (wasMobile && !isMobile.current) {
        setHeaderOffset(0);
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [headerHeight]);

  // Set CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--header-offset',
      `${headerOffset}px`,
    );
  }, [headerOffset]);

  return headerOffset;
}
