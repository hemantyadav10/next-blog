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
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const visibleHeadings = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.set(entry.target.id, entry);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        });

        if (visibleHeadings.size === 0) return;

        const topMost = Array.from(visibleHeadings.values()).sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];

        setActiveId(topMost.target.id);
      },
      {
        rootMargin: '-72px 0px -70% 0px',
        threshold: 0.1,
      },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 2) return null;

  const list = (
    <ul className="text-sm">
      {toc.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li
            key={item.id}
            className={cn('relative', item.level === 3 && 'ml-4')}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                'block rounded-r-sm px-2 py-1 transition-colors',
                isActive
                  ? 'text-foreground border-primary bg-primary/10 border-l-2 font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => collapsible && setAccordionValue('')}
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
