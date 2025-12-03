'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Sort = {
  value: string;
  label: string;
  sortBy: string;
  sortOrder: string;
};

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

function SortingSection() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const currentSort = (() => {
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const found = sortItems.find(
      (item) => item.sortBy === sortBy && item.sortOrder === sortOrder,
    );
    return found?.value || 'newest';
  })();

  const handleValueChange = (value: string) => {
    const selected = sortItems.find((item) => item.value === value);
    if (!selected) return;

    const params = new URLSearchParams(searchParams);
    params.set('sortBy', selected.sortBy);
    params.set('sortOrder', selected.sortOrder);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleValueChange}>
      <SelectTrigger>
        <ArrowUpDown /> Sort by: <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-40" align="start">
        {sortItems.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SortingSection;
