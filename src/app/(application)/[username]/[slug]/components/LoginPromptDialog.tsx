'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollToHash } from '@/hooks/use-scroll-to-hash';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface AuthPromptDialogProps {
  trigger: ReactNode;
  /** Optional: specific hash like "#comments" */
  hash?: string;
}

export default function LoginPromptDialog({
  trigger,
  hash = '',
}: AuthPromptDialogProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(`${pathname}${hash}`);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  useScrollToHash('comments');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="text-center sm:max-w-md">
          <ContentBody redirectUrl={redirectUrl} isDesktop={true} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="w-full">
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-4">
          <ContentBody redirectUrl={redirectUrl} isDesktop={false} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ContentBody({
  redirectUrl,
  isDesktop,
}: {
  redirectUrl: string;
  isDesktop: boolean;
}) {
  // Use the appropriate component tags based on the device
  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitle;
  const Description = isDesktop ? DialogDescription : DrawerDescription;
  const Footer = isDesktop ? DialogFooter : DrawerFooter;
  const Close = isDesktop ? DialogClose : DrawerClose;

  return (
    <>
      <Header
        className={
          isDesktop
            ? 'flex flex-col items-center'
            : 'flex flex-col items-center space-y-1.5 pt-6 text-center'
        }
      >
        <Logo size={60} showText={false} /> {/* Slightly larger */}
        <Title className="text-xl">Log in to continue</Title>
        <Description className="text-center">
          Please sign in to your account or create a new one to continue with
          this action.
        </Description>
      </Header>

      <div className={cn('flex flex-col gap-3 px-4 py-4')}>
        <Close asChild>
          <Button className="w-full" asChild>
            <Link href={`/login?redirect=${redirectUrl}`}>Log in</Link>
          </Button>
        </Close>

        <Close asChild>
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </Close>
      </div>

      <Footer
        className={
          isDesktop
            ? 'border-t pt-4 sm:justify-center'
            : 'my-4 flex justify-center border-t pt-4'
        }
      >
        <p className="text-muted-foreground text-center text-xs">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Footer>
    </>
  );
}
