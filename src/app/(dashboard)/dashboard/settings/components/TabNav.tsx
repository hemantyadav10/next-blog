'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function TabNav() {
  const path = usePathname();
  const profileSettingsRoute = '/dashboard/settings';
  const accountSettingsRoute = '/dashboard/settings/account';

  const activeTab =
    path === profileSettingsRoute ? profileSettingsRoute : accountSettingsRoute;

  return (
    <Tabs value={activeTab}>
      <TabsList>
        <TabsTrigger value={profileSettingsRoute} asChild>
          <Link href={'/dashboard/settings'}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger value={accountSettingsRoute} asChild>
          <Link href={'/dashboard/settings/account'}>Account</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default TabNav;
