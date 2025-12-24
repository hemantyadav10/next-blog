'use client';

import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Sort } from '@/types/shared.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const sortItems: Sort[] = [
  {
    label: 'Recently Created',
    value: 'created_desc',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  {
    label: 'Recently Published',
    value: 'published_desc',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  },
  {
    label: 'Recently Updated',
    value: 'updated_desc',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  },
  {
    label: 'Oldest First',
    value: 'created_asc',
    sortBy: 'createdAt',
    sortOrder: 'asc',
  },
  {
    label: 'Most Views',
    value: 'views_desc',
    sortBy: 'views',
    sortOrder: 'desc',
  },
  {
    label: 'Most Likes',
    value: 'likes_desc',
    sortBy: 'likes',
    sortOrder: 'desc',
  },
  {
    label: 'Most Comments',
    value: 'comments_desc',
    sortBy: 'comments',
    sortOrder: 'desc',
  },
  {
    label: 'Alphabetical (A-Z)',
    value: 'title_asc',
    sortBy: 'title',
    sortOrder: 'asc',
  },
  {
    label: 'Alphabetical (Z-A)',
    value: 'title_desc',
    sortBy: 'title',
    sortOrder: 'desc',
  },
];

function useCurrentSort() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');
  const found = sortItems.find(
    (item) => item.sortBy === sortBy && item.sortOrder === sortOrder,
  );
  return found?.value || 'created_desc';
}

function SortingSelect() {
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
    <div>
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
    </div>
  );
}

export default SortingSelect;
