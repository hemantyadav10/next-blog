import { GithubIcon } from '@/assets/icons/GithubIcon';
import { LinkedinIcon } from '@/assets/icons/LinkedinIcon';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Mail, Rss } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

const footerLinks = {
  Explore: [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'Reading List', href: '/reading-list' },
  ],
  Create: [
    { name: 'Write a Post', href: '/write' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Settings', href: '/dashboard/settings' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  {
    icon: GithubIcon,
    href: 'https://github.com/hemantyadav10/next-blog',
    label: 'GitHub',
  },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:yad.heman@gmail.com', label: 'Email' },
  { icon: Rss, href: '/rss.xml', label: 'RSS Feed' },
];

function Footer() {
  return (
    <footer className={cn('bg-muted/50 dark:bg-card border-border border-t')}>
      <div className="mx-auto max-w-7xl px-4 py-12 pb-18 md:px-8 md:pb-12">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo textClassName="block" />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              A place to read, write, and share ideas with the world. Join our
              community of curious minds.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ name, href }) => {
                  return (
                    <li key={name}>
                      <Link
                        href={href}
                        className={cn(
                          'text-sm transition-colors',
                          'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} · Built by{' '}
            <Link
              href="https://github.com/hemantyadav10"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground font-medium transition-colors"
            >
              Hemant Yadav
            </Link>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/rss.xml"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
            >
              <Rss className="h-3 w-3" />
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
