import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import Link from 'next/link';
import BlogCardImage from './BlogCardImage';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type BlogCardProps = {
  categoryName?: string;
  title: string;
  description: string;
  readTime: number;
  slug: string;
  authorName: string;
  authorUsername: string;
  authorProfilePicture?: string | null | undefined;
  publishedAt: NativeDate | null | undefined;
  blurDataUrl: string | null | undefined;
  banner: string | null | undefined;
  orientation?: 'vertical' | 'horizontal';
};

export default function BlogCard({
  title,
  description,
  readTime,
  slug,
  authorName,
  authorUsername,
  authorProfilePicture,
  publishedAt,
  banner,
  blurDataUrl,
  orientation = 'horizontal',
}: BlogCardProps) {
  return (
    <Link
      href={`/${authorUsername}/${slug}`}
      className={cn(
        'group grid grid-cols-12 gap-y-3',
        orientation === 'vertical'
          ? 'grid-cols-1 gap-x-4 sm:gap-x-0'
          : 'gap-x-4',
      )}
    >
      <BlogCardImage
        banner={banner}
        blurDataUrl={blurDataUrl}
        title={title}
        orientation={orientation}
      />
      <div
        className={cn(
          'space-y-2 sm:space-y-3',
          orientation === 'vertical' ? 'col-span-full' : 'col-span-8',
        )}
      >
        <div className="space-y-1 sm:space-y-2">
          <h3 className="line-clamp-3 font-medium sm:line-clamp-2 sm:text-xl">
            <span className="from-foreground to-foreground bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
              {title}
            </span>
          </h3>
          <p className="text-muted-foreground line-clamp-1 text-sm sm:line-clamp-2 sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div>
            <Avatar className="size-5">
              <AvatarImage src={authorProfilePicture ?? ''} alt={authorName} />
              <AvatarFallback className="uppercase">
                {authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <p>{authorName}</p>
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          {publishedAt && (
            <p>{formatDate(new Date(publishedAt), 'MMM d, yyyy')}</p>
          )}
          <p>{readTime} min read</p>
        </div>
      </div>
    </Link>
  );
}
