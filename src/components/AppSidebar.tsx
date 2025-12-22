'use client';

import {
  BarChart3Icon,
  BookmarkIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LucideIcon,
  MessageCircleIcon,
  Settings,
  UsersIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';

type SidebarGroupKey = 'main' | 'engagement' | 'growth' | 'account';

type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  group: SidebarGroupKey;
};

const items: SidebarItem[] = [
  // Main
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
    group: 'main',
  },
  {
    title: 'My Posts',
    url: '/dashboard/posts',
    icon: FileTextIcon,
    group: 'main',
  },

  // Engagement
  {
    title: 'Comments',
    url: '/dashboard/comments',
    icon: MessageCircleIcon,
    group: 'engagement',
  },
  {
    title: 'Bookmarks',
    url: '/dashboard/bookmarks',
    icon: BookmarkIcon,
    group: 'engagement',
  },

  // Growth
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3Icon,
    group: 'growth',
  },
  {
    title: 'Followers',
    url: '/dashboard/followers',
    icon: UsersIcon,
    group: 'growth',
  },

  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    group: 'account',
  },
  {
    title: 'Get help',
    url: '/dashboard/help',
    icon: HelpCircleIcon,
    group: 'account',
  },
];

const CONTENT_GROUP_ORDER: SidebarGroupKey[] = ['main', 'engagement', 'growth'];

const FOOTER_GROUP: SidebarGroupKey = 'account';

const GROUP_LABEL: Record<SidebarGroupKey, string> = {
  main: '',
  engagement: 'Engagement',
  growth: 'Growth',
  account: '',
};

function SidebarGroupRenderer({ group }: { group: SidebarGroupKey }) {
  const pathname = usePathname();
  const groupItems = items.filter((item) => item.group === group);
  if (!groupItems.length) return null;

  return (
    <SidebarGroup>
      {GROUP_LABEL[group] && (
        <SidebarGroupLabel>{GROUP_LABEL[group]}</SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {groupItems.map((item) => {
            const isRootDashboard = item.url === '/dashboard';

            const isActive = isRootDashboard
              ? pathname === item.url
              : pathname === item.url || pathname.startsWith(item.url + '/');

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar className="py-2">
      <SidebarContent className="md:mt-16">
        {CONTENT_GROUP_ORDER.map((group) => (
          <SidebarGroupRenderer key={group} group={group} />
        ))}
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarGroupRenderer group={FOOTER_GROUP} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
