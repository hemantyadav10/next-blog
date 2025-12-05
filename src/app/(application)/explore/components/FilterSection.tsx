'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type Path = '/explore' | '/explore/users' | '/explore/tags';

type Filter = {
  path: Path;
  name: string;
};

const filters: Filter[] = [
  { path: '/explore', name: 'Posts' },
  { path: '/explore/users', name: 'People' },
  { path: '/explore/tags', name: 'Tags' },
] as const;

function FilterSection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  return (
    <>
      {filters.map(({ name, path }, idx) => (
        <Button
          key={`${path}-${idx}`}
          variant={pathname === path ? 'default' : 'ghost'}
          className={cn(
            'justify-start md:h-10',
            pathname === path ? 'font-medium' : 'font-normal',
          )}
          asChild
        >
          <Link href={`${path}?${queryString}`}>{name}</Link>
        </Button>
      ))}
    </>
  );
}

export default FilterSection;
