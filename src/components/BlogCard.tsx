import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

type BlogCardProps = {
  categoryName: string;
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
};

export default function BlogCard({
  categoryName,
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
}: BlogCardProps) {
  return (
    <Link
      href={`/${authorUsername}/${slug}`}
      className="group grid grid-cols-12 gap-x-4 gap-y-3"
    >
      <div className="col-span-full aspect-3/2 overflow-hidden sm:col-span-5">
        {banner ? (
          <Image
            src={banner}
            alt={title}
            width={368}
            height={245}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            placeholder={blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={blurDataUrl || ''}
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
      </div>
      <div className="col-span-full space-y-3 sm:col-span-7">
        <Badge variant={'outline'} className="rounded">
          {categoryName}
        </Badge>
        <h3 className="line-clamp-2 text-lg font-medium sm:text-xl">
          <span className="from-foreground to-foreground bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
            {title}
          </span>
        </h3>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center gap-2 text-xs font-medium">
          <div>
            <Avatar className="size-6">
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
