'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  return (
    <>
      {filters.map(({ name, path }, idx) => (
        <Button
          key={`${path}-${idx}`}
          variant={pathname === path ? 'default' : 'ghost'}
          size={'lg'}
          className={cn(
            'justify-start',
            pathname === path ? 'font-medium' : 'font-normal',
          )}
          asChild
        >
          <Link href={path}>{name}</Link>
        </Button>
      ))}
    </>
  );
}

export default FilterSection;
