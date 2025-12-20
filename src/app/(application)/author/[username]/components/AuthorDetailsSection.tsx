import { GithubIcon } from '@/assets/icons/GithubIcon';
import { LinkedinIcon } from '@/assets/icons/LinkedinIcon';
import { TwitterIcon } from '@/assets/icons/TwitterIcon';
import { SocialLinks } from '@/components/SocialLinks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserDetails } from '@/lib/user';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import {
  Calendar,
  CopyIcon,
  EllipsisIcon,
  FileTextIcon,
  FlagIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function AuthorDetailsSection({ username }: { username: string }) {
  const user = await getUserDetails(username);

  if (!user) return notFound();

  return (
    <>
      {/* Basic info */}
      <div className="bg-card space-y-2 rounded-xl border p-5">
        <div className="flex">
          <Avatar className="size-24">
            <AvatarImage
              src={user.profilePicture || undefined}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="text-3xl">
              {user.firstName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="more options"
                title="More options"
                variant="ghost"
                size={'icon'}
                className="ml-auto"
              >
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <CopyIcon />
                Copy link to profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FlagIcon />
                Report Abuse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h1 className="text-xl font-semibold md:text-2xl">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          @{user.username}
        </p>
        <p
          className={cn(
            'text-sm md:text-base',
            user.bio ? '' : 'text-muted-foreground italic',
          )}
        >
          {user.bio || 'This user has no bio.'}
        </p>
        <Button size={'lg'} variant={'raised'} className="mt-2 w-full">
          Follow
        </Button>
      </div>
      {/* more info */}
      <Accordion
        type="single"
        collapsible
        className="bg-card border-border w-full rounded-xl border"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-5">
            More info about @{user.username}
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-muted-foreground space-y-4 px-5 pb-1 text-sm">
              <p className="flex flex-wrap items-center gap-2">
                <UsersIcon className="size-4 shrink-0" />
                {/* TODO: Replace hardcoded followers count with value from API */}
                <Link
                  href={`/author/${username}/followers`}
                  className="hover:text-primary hover:underline"
                >
                  4.5K followers
                </Link>{' '}
                and{' '}
                {/* TODO: Replace hardcoded followings count with value from API */}
                <Link
                  href={`/author/${username}/followings`}
                  className="hover:text-primary hover:underline"
                >
                  4.5K followings
                </Link>
              </p>
              {/* TODO: Replace hardcoded count with publishedPostsCount from API */}
              <p className="flex items-center gap-2">
                <FileTextIcon className="size-4 shrink-0" />
                20 post published
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="size-4 shrink-0" />
                {user.email}
              </p>
              <p
                className={cn(
                  'flex items-center gap-2',
                  user.phoneNumber ? '' : 'italic',
                )}
              >
                <PhoneIcon className="size-4 shrink-0" />
                {user.phoneNumber || 'No phone number provided'}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                {`Joined on ${formatDate(new Date(user.createdAt), 'MMMM dd, yyyy')}`}
              </p>

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex gap-4">
                  {user.socialLinks?.website && (
                    <SocialLinks
                      name="Website"
                      url={user.socialLinks.website}
                      Icon={GlobeIcon}
                    />
                  )}
                  {user.socialLinks?.twitter && (
                    <SocialLinks
                      name="Twitter"
                      url={user.socialLinks.twitter}
                      Icon={TwitterIcon}
                    />
                  )}
                  {user.socialLinks?.linkedin && (
                    <SocialLinks
                      name="LinkedIn"
                      url={user.socialLinks.linkedin}
                      Icon={LinkedinIcon}
                    />
                  )}
                  {user.socialLinks?.github && (
                    <SocialLinks
                      name="GitHub"
                      url={user.socialLinks.github}
                      Icon={GithubIcon}
                    />
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default AuthorDetailsSection;
