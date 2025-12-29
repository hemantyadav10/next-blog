'use client';

import { Button } from '@/components/ui/button';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Profile', href: '/dashboard/settings' },
  { label: 'Account', href: '/dashboard/settings/account' },
];

function TabNav() {
  const path = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <div>
      {isDesktop ? (
        <div className="flex flex-col">
          {navItems.map((item) => {
            const isActive = path === item.href;
            return (
              <Button
                key={item.href}
                size={'lg'}
                variant={isActive ? 'secondary' : 'ghost'}
                asChild
                className={cn(
                  'justify-start',
                  isActive ? 'font-medium' : 'font-normal',
                )}
              >
                <Link href={item.href} className="">
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
      ) : (
        <NativeSelect
          aria-label=""
          value={path}
          onChange={handleSelectChange}
          className="font-medium"
        >
          {navItems.map(({ label, href }) => {
            return (
              <NativeSelectOption key={label} value={href}>
                {label}
              </NativeSelectOption>
            );
          })}
        </NativeSelect>
      )}
    </div>
  );
}

export default TabNav;
