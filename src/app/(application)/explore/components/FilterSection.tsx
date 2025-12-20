'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type Filter = {
  path: string;
  name: string;
  Icon?: LucideIcon;
};

const filters: Filter[] = [
  { path: '/explore', name: 'Posts' },
  { path: '/explore/following', name: 'Following' },
  { path: '/explore/users', name: 'People' },
  { path: '/explore/tags', name: 'Tags' },
] as const;

function FilterSection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  return (
    <>
      {filters.map(({ name, path, Icon }, idx) => (
        <Button
          key={`${path}-${idx}`}
          variant={pathname === path ? 'secondary' : 'ghost'}
          className={cn(
            'justify-start md:h-10',
            pathname === path ? 'font-medium' : 'font-normal',
          )}
          asChild
        >
          <Link href={`${path}?${queryString}`}>
            {Icon && <Icon />}
            {name}
          </Link>
        </Button>
      ))}
    </>
  );
}

export default FilterSection;
