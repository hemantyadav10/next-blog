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
import {
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
import { ModeToggle } from './ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type NavItems = {
  name: string;
  href: string;
  active?: boolean;
};

function Header({ user }: { user: AuthResult }) {
  const { isAuthenticated, user: userDetails } = user;
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const [toggleMenu, setToggleMenu] = useState(false);

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
      const { error, success } = await logoutUser();
      if (success) {
        router.refresh();
      } else if (error) {
        toast.error(error);
      }
    });
  }

  return (
    <>
      <AnimatePresence>
        {toggleMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, animationDuration: 1 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            className="bg-background/90 fixed inset-0 z-40 overflow-y-auto px-4 py-8 pt-24 backdrop-blur-sm"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map(({ name, href }) => (
                <Link
                  href={href}
                  key={name}
                  className={cn('text-primary text-2xl font-medium')}
                  onClick={() => setToggleMenu(false)}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <header
        className={cn(
          'bg-background/90 fixed top-0 right-0 left-0 z-50 backdrop-blur-lg',
        )}
      >
        {/* Left: App Name */}
        <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-4 md:px-8">
          <nav className="flex items-center gap-8 text-sm">
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

            <div className="flex items-center gap-6">
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
                      'text-muted-foreground hover:text-primary hidden sm:flex',
                      isActive ? 'text-primary font-semibold' : '',
                    )}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right: Theme Toggle + Auth */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <InputGroup className="hidden h-9 rounded-full lg:flex lg:min-w-sm">
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
                              alt={userDetails.fullName}
                            />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{userDetails.fullName}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuLabel className="p-0">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-9 rounded-full">
                        <AvatarImage
                          src={userDetails.profilePicture ?? undefined}
                          alt={userDetails.fullName}
                        />
                        <AvatarFallback className="rounded-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm">
                        <span className="truncate">{userDetails.fullName}</span>
                        <span className="truncate text-xs font-normal">
                          {userDetails.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href={'/profile'}>
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
                      <Link href={'/settings'}>
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
