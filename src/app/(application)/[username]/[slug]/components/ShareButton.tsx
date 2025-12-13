'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Check, Copy, Share, Share2 } from 'lucide-react';
import { JSX, useRef, useState } from 'react';
import { toast } from 'sonner';

type SocialShareButton = {
  id: string;
  label: string;
  ariaLabel: string;
  bgColor: string;
  textColor: string;
  hoverColor?: string;
  activeColor?: string;
  onClick: () => void;
  icon: JSX.Element;
};

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  onShare?: (platform: string) => void;
}

export function ShareButton({ text, title, url, onShare }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button aria-label="Share" variant="ghost" size="icon">
                <Share2 />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Share</TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <ShareContent title={title} text={text} url={url} onShare={onShare} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button aria-label="Share" variant="ghost" size="icon">
              <Share2 />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Share</TooltipContent>
      </Tooltip>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader>
          <DrawerTitle className="text-left">Share</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <ShareContent title={title} text={text} url={url} onShare={onShare} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Share content component
interface ShareContentProps {
  title: string;
  text: string;
  url: string;
  onShare?: (platform: string) => void;
  showEmail?: boolean;
}

function ShareContent({ title, text, url, onShare }: ShareContentProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Check if native share is available
  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const shareData: ShareData = { title, text, url };

  const handleNativeShare = async () => {
    if (!canShare) return;

    try {
      // Check if data can be shared before attempting
      if (navigator.canShare && !navigator.canShare(shareData)) {
        toast.error('Specified data cannot be shared.');
        return;
      }

      await navigator.share(shareData);
      onShare?.('native');
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error);
        toast.error('Failed to share');
      }
    }
  };

  const shareToX = () => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    const shareUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onShare?.('x');
  };

  const shareToFacebook = () => {
    const encodedUrl = encodeURIComponent(url);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onShare?.('facebook');
  };

  const shareToLinkedIn = () => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onShare?.('linkedin');
  };

  const shareToWhatsApp = () => {
    const encodedText = encodeURIComponent(`${title} - ${url}`);
    const shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    onShare?.('whatsapp');
  };

  const socialShareButtons: SocialShareButton[] = [
    {
      id: 'x',
      label: 'X',
      ariaLabel: 'Share on X',
      bgColor: 'bg-black dark:bg-white',
      textColor: 'text-white dark:text-black',
      hoverColor: 'hover:bg-black/90 dark:hover:bg-white/90',

      activeColor: 'active:bg-black/80 dark:active:bg-white/80',
      onClick: shareToX,
      icon: (
        <svg
          className="size-5"
          role="img"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      label: 'Facebook',
      ariaLabel: 'Share on Facebook',
      bgColor: 'bg-[#1877F2]',
      textColor: 'text-white',
      hoverColor: 'hover:bg-[#1877F2]/90',
      activeColor: 'active:bg-[#1877F2]/80',
      onClick: shareToFacebook,
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      ariaLabel: 'Share on LinkedIn',
      bgColor: 'bg-[#0A66C2]',
      textColor: 'text-white',
      hoverColor: 'hover:bg-[#0A66C2]/90',
      activeColor: 'active:bg-[#0A66C2]/80',
      onClick: shareToLinkedIn,
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      ariaLabel: 'Share on WhatsApp',
      bgColor: 'bg-[#25D366]',
      textColor: 'text-white',
      hoverColor: 'hover:bg-[#25D366]/90',
      activeColor: 'active:bg-[#25D366]/80',
      onClick: shareToWhatsApp,
      icon: (
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
  ];

  const copyToClipboard = async () => {
    const input = inputRef.current;
    try {
      await navigator.clipboard.writeText(url);
      if (input) {
        input.focus();
        input.setSelectionRange(0, input.value.length, 'forward');
      }
      setCopied(true);
      toast.success('Link copied!');
      onShare?.('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy');
    }
  };
  return (
    <div className="grid gap-4">
      {/* Copy Link */}
      <div className="space-y-3">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            id="link"
            defaultValue={url}
            readOnly
            onClick={copyToClipboard}
            className="cursor-pointer"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copy"
              title="Copy"
              onClick={copyToClipboard}
            >
              {copied ? <Check /> : <Copy />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Native Share Button (Mobile) */}
      {canShare && (
        <Button size="lg" onClick={handleNativeShare}>
          <Share />
          Share via...
        </Button>
      )}

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-sm">Or share on</span>
        <Separator className="flex-1" />
      </div>

      {/* Social Share Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          {socialShareButtons.map((social) => (
            <Button
              key={social.id}
              onClick={social.onClick}
              size="icon-lg"
              aria-label={social.ariaLabel}
              title={social.label}
              className={cn(
                'shrink-0 rounded-full transition-colors',
                social.bgColor,
                social.textColor,
                social.hoverColor,
                social.activeColor,
              )}
            >
              {social.icon}
              <span className="sr-only">{social.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
