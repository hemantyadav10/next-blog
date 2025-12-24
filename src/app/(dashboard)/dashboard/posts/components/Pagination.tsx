'use client';

import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';
import NavigationButton from './NavigationButton';

type PaginationProps = {
  totalPosts: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  nextPage: number;
  prevPage: number;
};

function Pagination({
  totalPosts,
  page,
  limit,
  totalPages,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string, 10)
    : page;
  const currentLimit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit') as string, 10)
    : limit;
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', value);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pageInput = formData.get('currentPage') as string;
    const pageNumber = parseInt(pageInput, 10);

    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClick = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const start = (currentPage - 1) * currentLimit + 1;
  const end = Math.min(currentPage * currentLimit, totalPosts);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <div>
        Showing {start}-{end} of {totalPosts} posts
      </div>
      <div className="gap-y flex h-9 flex-wrap items-center gap-x-4">
        <div>
          <NavigationButton
            onClick={() => handleClick(1)}
            disabled={!hasPrevPage}
            title="First page"
            Icon={ChevronFirst}
          />

          <NavigationButton
            onClick={() => handleClick(prevPage)}
            disabled={!hasPrevPage}
            title="Previous page"
            Icon={ChevronLeft}
          />

          <NavigationButton
            onClick={() => handleClick(nextPage)}
            disabled={!hasNextPage}
            title="Next page"
            Icon={ChevronRight}
          />

          <NavigationButton
            onClick={() => handleClick(totalPages)}
            disabled={!hasNextPage}
            title="Last page"
            Icon={ChevronLast}
          />
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center gap-2">
          <span>Go to page</span>
          <form onSubmit={handlePageChange}>
            <Input
              name="currentPage"
              defaultValue={currentPage}
              type="number"
              className="h-9 w-full max-w-16"
              min={1}
              max={totalPages}
            />
            <button type="submit" hidden>
              Submit
            </button>
          </form>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <NativeSelect
            value={currentLimit}
            onChange={(e) => handleLimitChange(e.target.value)}
          >
            {[10, 25, 50, 100].map((value) => (
              <NativeSelectOption key={value} value={value}>
                {value}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
