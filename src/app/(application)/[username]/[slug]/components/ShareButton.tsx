'use client';

import { FacebookIcon } from '@/assets/icons/FacebookIcon';
import { LinkedinIcon } from '@/assets/icons/LinkedinIcon';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';
import { WhatsAppIcon } from '@/assets/icons/WhatsAppIcon';
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
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-left">Share</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">
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
      icon: <TwitterIcon />,
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
      icon: <FacebookIcon />,
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
      icon: <LinkedinIcon />,
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
      icon: <WhatsAppIcon />,
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
