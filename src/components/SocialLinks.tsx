import Link from 'next/link';
import { Button } from './ui/button';

type SocialLinks = {
  name: string;
  url: string;
  Icon: React.ElementType;
};

export function SocialLinks({ name, url, Icon }: SocialLinks) {
  return (
    <Button
      variant={'secondary'}
      size={'icon-sm'}
      className="text-muted-foreground hover:text-foreground rounded-full transition-colors"
      aria-label={name}
      asChild
    >
      <Link href={url}>
        <Icon className="size-4" />
      </Link>
    </Button>
  );
}
