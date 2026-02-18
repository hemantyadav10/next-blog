'use client';

import { logoutUser } from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthResult } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { NavItems } from '@/types/navigation.types';
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  SearchIcon,
  Settings,
  SquarePen,
  User,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Logo } from './Logo';
import MobileMenu from './MobileMenu';
import { ModeToggle } from './ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const navItems: NavItems[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Explore',
    href: '/explore',
  },
  {
    name: 'Write',
    href: '/write',
  },
];

function Header({ user }: { user: AuthResult }) {
  const { isAuthenticated, user: userDetails } = user;
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const [toggleMenu, setToggleMenu] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (toggleMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [toggleMenu]);

  // Logs out user
  function handleLogout() {
    startTransition(async () => {
      const { error, success } = await logoutUser();
      if (success) {
        router.refresh();
      } else if (error) {
        toast.error(error);
      }
    });
  }

  const handleCloseMenu = () => {
    setToggleMenu(false);
  };

  return (
    <>
      <AnimatePresence>
        {toggleMenu && (
          <MobileMenu closeMenu={handleCloseMenu} navItems={navItems} />
        )}
      </AnimatePresence>

      <header
        className={cn(
          'bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur-sm md:transform-none',
          'dark:bg-card/90 dark:backdrop-blur-lg',
        )}
      >
        {/* Left: App Name */}
        <div className="mx-auto flex h-16 items-center justify-between px-4">
          <nav className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setToggleMenu(!toggleMenu)}
                size="icon-sm"
                className="flex sm:hidden"
              >
                <div className="relative flex h-8 w-4 items-center justify-center">
                  <div className="relative size-4">
                    <span
                      className={cn(
                        'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                        toggleMenu ? 'top-[0.4rem] -rotate-45' : 'top-1',
                      )}
                    />
                    <span
                      className={cn(
                        'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                        toggleMenu ? 'top-[0.4rem] rotate-45' : 'top-2.5',
                      )}
                    />
                  </div>
                  <span className="sr-only">Toggle Menu</span>
                </div>
              </Button>
              <Logo />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {/* Center: Navigation Links */}
              {navItems.map(({ name, href }) => {
                const isActive =
                  pathname === href ||
                  (pathname.startsWith(href) && href !== '/');

                return (
                  <Link
                    href={href}
                    key={name}
                    className={cn(
                      'relative items-center px-2 py-3',
                      isActive
                        ? 'text-primary font-medium'
                        : 'text-foreground hover:text-primary transition-colors',
                    )}
                  >
                    {name}
                    {isActive && (
                      <motion.div
                        style={{ originY: '0px' }}
                        layoutId="underline"
                        className="bg-primary absolute inset-x-0 -bottom-2 h-0.5"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right: Theme Toggle + Auth */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <InputGroup className="hidden h-9 rounded-full inset-shadow-sm lg:flex lg:min-w-sm">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align={'inline-end'}>
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>

            {/* Theme toggle */}
            <ModeToggle allOptions={false} />

            {/* Auth buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                              alt={userDetails.firstName}
                            />
                            <AvatarFallback>
                              {userDetails.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`${userDetails.firstName} ${userDetails.lastName}`}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuLabel className="p-0">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-9 rounded-full">
                        <AvatarImage
                          src={userDetails.profilePicture ?? undefined}
                          alt={userDetails.firstName}
                        />
                        <AvatarFallback className="rounded-lg">
                          {userDetails.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm">
                        <span className="truncate">{`${userDetails.firstName} ${userDetails.lastName}`}</span>
                        <span className="truncate text-xs font-normal">
                          {userDetails.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href={`/author/${userDetails.username}`}>
                        <User />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={'/write'}>
                        <SquarePen />
                        Write
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={'/dashboard'}>
                        <LayoutDashboard />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={'/reading-list'}>
                        <Bookmark />
                        Reading List
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={'/dashboard/settings'}>
                        <Settings />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
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
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
