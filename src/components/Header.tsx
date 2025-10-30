'use client';

import { logoutUser } from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthResult } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ModeToggle } from './ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { Spinner } from './ui/spinner';

type NavItems = {
  name: string;
  href: string;
  active?: boolean;
};

function Header({ user }: { user: AuthResult }) {
  const [hidden, setHidden] = useState(false);
  const { isAuthenticated, user: userDetails } = user;
  const [isPending, startTransition] = useTransition();
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const navItems: NavItems[] = [
    {
      name: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      name: 'Explore',
      href: '/explore',
      active: pathname === '/explore',
    },
    {
      name: 'Write',
      href: '/write',
      active: pathname === '/write',
    },
  ];

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else if (previous !== undefined && latest < previous) {
      setHidden(false);
    }
  });

  const getUserInitials = () => {
    if (!userDetails) return 'U';
    const names = userDetails.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userDetails.fullName.substring(0, 2).toUpperCase();
  };

  // Logs out user
  function handleLogout() {
    startTransition(async () => {
      const { error } = await logoutUser();

      if (error) toast.error(error);
    });
  }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'bg-background/70 fixed top-0 right-0 left-0 z-50 backdrop-blur-md',
      )}
    >
      {/* Left: App Name */}
      <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-4 md:px-8">
        <nav className="flex items-center gap-12 text-sm">
          <Link href="/" className="text-xl font-bold">
            InfiniteInk
          </Link>

          <div className="flex items-center gap-6">
            {/* Center: Navigation Links */}
            {navItems.map(({ name, href, active }) => (
              <Link
                href={href}
                key={name}
                className={cn(
                  'text-muted-foreground hover:text-primary hidden sm:flex',
                  active ? 'text-primary font-semibold' : '',
                )}
              >
                {name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right: Theme Toggle + Auth */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <InputGroup className="hidden h-9 lg:flex">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align={'inline-end'}>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>

          {/* Auth buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner />
                  ) : (
                    <Avatar className="size-9">
                      <AvatarImage
                        src={userDetails.profilePicture || undefined}
                        alt={userDetails.fullName}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}

          {/* Theme toggle */}
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
