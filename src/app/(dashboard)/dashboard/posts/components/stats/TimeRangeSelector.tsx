'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { format, isSameYear, subDays } from 'date-fns';

const ranges = [
  { label: 'Week', value: '7d' },
  { label: 'Month', value: '30d' },
  { label: 'Lifetime', value: 'all' },
] as const;

type Range = (typeof ranges)[number]['value'];

export function TimeRangeSelector({ publishedAt }: { publishedAt: Date }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentRange = (searchParams.get('range') as Range) ?? '7d';

  const handleRangeChange = (value: Range) => {
    const params = new URLSearchParams(searchParams);
    params.set('range', value);
    // params.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    replace(`${pathname}?${params.toString()}`);
  };

  const now = new Date();
  let startDate: Date;
  let label = '';

  if (currentRange === '7d') {
    startDate = subDays(now, 6);
    label = 'Last 7 days';
  } else if (currentRange === '30d') {
    startDate = subDays(now, 29);
    label = 'Last 30 days';
  } else {
    startDate = publishedAt;
    label = 'Since pubhished';
  }

  const formatRange = () => {
    if (currentRange === 'all') {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(now, 'MMM d, yyyy')}`;
    }

    if (isSameYear(startDate, now)) {
      return `${format(startDate, 'MMM d')} - ${format(now, 'MMM d, yyyy')}`;
    }

    return `${format(startDate, 'MMM d, yyyy')} - ${format(now, 'MMM d, yyyy')}`;
  };

  return (
    <div className="bg-background sticky top-16 z-10 -mt-2 flex flex-wrap items-center justify-between gap-2 border-b py-2">
      {/* LEFT: buttons */}
      <div className="flex">
        {ranges.map(({ label, value }) => {
          const isActive = currentRange === value;
          return (
            <Button
              key={value}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(isActive ? 'font-medium' : 'font-normal')}
              onClick={() => handleRangeChange(value)}
              size={'sm'}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* RIGHT: date info */}
      <div className="ml-auto pr-2 text-right text-sm">
        <div>{formatRange()}</div>
        <div className="text-muted-foreground text-xs">{label}</div>
      </div>
    </div>
  );
}
