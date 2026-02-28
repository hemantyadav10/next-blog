import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

function BlogCard({
  title,
  banner,
  blurDataUrl,
  date,
  viewCount,
  slug,
  username,
}: {
  title: string;
  viewCount: number;
  date: string;
  banner: string;
  blurDataUrl: string;
  username: string;
  slug: string;
}) {
  return (
    <Link
      href={`/${username}/${slug}`}
      className="group flex items-start gap-2 text-sm"
    >
      <Image
        src={banner}
        alt={title}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        height={48}
        width={72}
        className="shrink-0"
      />
      <div className="flex-1 space-y-1">
        <h3 className="group-hover:text-link line-clamp-2 transition-colors duration-300">
          <span className="from-link to-link bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
            {title}
          </span>
        </h3>
        <p className="text-muted-foreground text-xs">
          {formatDate(new Date(date), 'MMMM d, yyyy')} &middot; {viewCount}{' '}
          views
        </p>
      </div>
    </Link>
  );
}

export default BlogCard;
