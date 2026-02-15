import { useEffect } from 'react';

interface UseScrollToHashOptions {
  behavior?: ScrollBehavior;
}

/**
 * Hook that scrolls to an element when the URL hash matches the element ID
 * @param elementId - The ID of the element to scroll to (without #)
 * @param options - Optional scroll behavior configuration
 *
 * @example
 * useScrollToHash('comments'); // Scrolls to #comments with instant behavior
 * useScrollToHash('comments', { behavior: 'smooth' }); // Smooth scroll
 */
export function useScrollToHash(
  elementId: string,
  options?: UseScrollToHashOptions,
) {
  useEffect(() => {
    if (window.location.hash === `#${elementId}`) {
      requestAnimationFrame(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: options?.behavior ?? 'instant' });
        }
      });
    }
  }, [elementId, options?.behavior]);
}
