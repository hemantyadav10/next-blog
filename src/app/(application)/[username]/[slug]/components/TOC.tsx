'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import type { TocItem } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { TableOfContents } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TOCProps {
  toc: TocItem[];
  collapsible?: boolean;
}

function TOC({ toc, collapsible = false }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string>('');

  useEffect(() => {
    if (!toc.length) return;

    const headings = toc
      .map((item) => document.querySelector(`[data-id="${item.id}"]`))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const visibleHeadings = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (!id) return;

          if (entry.isIntersecting) {
            visibleHeadings.set(id, entry);
          } else {
            visibleHeadings.delete(id);
          }
        });

        if (visibleHeadings.size === 0) return;

        const topMost = Array.from(visibleHeadings.values()).sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];

        setActiveId(topMost.target.getAttribute('data-id'));
      },
      {
        rootMargin: '-72px 0px -70% 0px',
        threshold: 0.1,
      },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length < 2) return null;

  const minLevel =
    toc.length > 0 ? Math.min(...toc.map((item) => item.level)) : 2;

  const list = (
    <ul className="text-sm">
      {toc.map((item) => {
        const isActive = activeId === item.id;

        // Calculate relative depth
        // If minLevel is 3, then a level 3 item gets 0 padding, level 4 gets pl-4, etc.
        const depth = item.level - minLevel;

        return (
          <li
            key={item.id}
            className={cn(
              'relative line-clamp-2 border-l transition-colors',
              depth === 1 && 'pl-4',
              depth === 2 && 'pl-8',
              depth >= 3 && 'pl-12',
              isActive
                ? 'border-primary text-primary bg-primary/5 font-medium'
                : 'hover:border-muted-foreground text-muted-foreground hover:text-foreground',
            )}
          >
            <a
              title={item.text}
              href={`#${item.id}`}
              className={cn('block rounded-r-sm px-4 py-1')}
              onClick={(e) => scrollToHeading(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (collapsible) {
    return (
      <Accordion
        type="single"
        collapsible
        className="bg-card rounded-lg border px-3"
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="toc" className="border-none">
          <AccordionTrigger className="py-3 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <TableOfContents className="size-4" />
              On this page
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">{list}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <>
      <Separator className="hidden xl:flex" />
      <nav aria-label="Table of contents">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TableOfContents className="size-4" />
          On this page
        </p>
        {list}
      </nav>
    </>
  );
}

export default TOC;
