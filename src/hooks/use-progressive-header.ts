'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(headerHeight = 64) {
  const [headerOffset, setHeaderOffset] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isMobile = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    isMobile.current = window.innerWidth < 768;

    const updateOffset = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setHeaderOffset(0);
        lastScrollY.current = 0;
        ticking.current = false;
        return;
      }

      const scrollDiff = currentScrollY - lastScrollY.current;

      if (scrollDiff !== 0) {
        setIsSnapping(false);
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = null;
        }
        setHeaderOffset((prev) => {
          const newOffset = prev + scrollDiff;
          return Math.max(0, Math.min(newOffset, headerHeight));
        });
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const snapHeader = () => {
      setIsSnapping(true);
      setHeaderOffset((prev) => {
        return prev > headerHeight / 2 ? headerHeight : 0;
      });
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      snapTimeoutRef.current = setTimeout(() => setIsSnapping(false), 200);
    };

    const handleScroll = () => {
      if (!isMobile.current || ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(updateOffset);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(snapHeader, 100);
    };

    const handleResize = () => {
      const wasMobile = isMobile.current;
      isMobile.current = window.innerWidth < 768;

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
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [headerHeight]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--header-offset',
      `${headerOffset}px`,
    );
  }, [headerOffset]);

  return { headerOffset, isSnapping };
}
