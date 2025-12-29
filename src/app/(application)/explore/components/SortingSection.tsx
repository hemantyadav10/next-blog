'use client';

import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sort } from '@/types/shared.types';
import { ArrowUpDown } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

const sortItems: Sort[] = [
  {
    label: 'Most Popular',
    value: 'popular',
    sortBy: 'popularity',
    sortOrder: 'desc',
  },
  {
    label: 'Newest',
    value: 'newest',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  },
  { label: 'Oldest', value: 'oldest', sortBy: 'publishedAt', sortOrder: 'asc' },
];

function useCurrentSort() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');
  const found = sortItems.find(
    (item) => item.sortBy === sortBy && item.sortOrder === sortOrder,
  );
  return found?.value || 'newest';
}

function SortingSection() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const currentSort = useCurrentSort();

  const handleValueChange = (value: string) => {
    const selected = sortItems.find((item) => item.value === value);
    if (!selected) return;

    const params = new URLSearchParams(searchParams);
    params.set('sortBy', selected.sortBy);
    params.set('sortOrder', selected.sortOrder);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-2 text-sm font-medium">
        <ArrowUpDown className="h-4 w-4" />
        <span>Sort by:</span>
      </span>
      {isDesktop ? (
        <Select value={currentSort} onValueChange={handleValueChange}>
          <SelectTrigger aria-label="Sort blogs" className="min-w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <NativeSelect
          aria-label="Sort blogs"
          value={currentSort}
          onChange={(e) => handleValueChange(e.target.value)}
          className="min-w-32"
        >
          {sortItems.map(({ label, value }) => (
            <NativeSelectOption key={value} value={value}>
              {label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )}
    </div>
  );
}

export default SortingSection;
