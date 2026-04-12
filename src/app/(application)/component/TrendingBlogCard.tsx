import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { TrendingBlog } from '@/types/blog.types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export default function TrendingBlogCard({ blog }: { blog: TrendingBlog }) {
  return (
    <Link
      href={`/${blog.author.username}/${blog.slug}`}
      className="group flex items-start gap-4"
    >
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={blog.banner}
          alt={blog.title}
          fill
          placeholder={blog.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={blog.blurDataUrl ?? undefined}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Author */}
        <div className="flex items-center gap-1.5">
          <Avatar className="size-5">
            <AvatarImage
              src={blog.author.profilePicture ?? ''}
              alt={blog.author.firstName}
            />
            <AvatarFallback className="text-xs uppercase">
              {blog.author.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground truncate text-xs">
            {blog.author.firstName} {blog.author.lastName}
          </span>
        </div>

        {/* Title */}
        <p className="text-foreground group-hover:text-primary line-clamp-2 text-base font-medium transition-colors duration-300">
          <span className="from-primary to-primary bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
            {blog.title}
          </span>
        </p>

        {/* Stats */}
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
          <span>
            {blog.publishedAt &&
              formatDistanceToNow(new Date(blog.publishedAt), {
                addSuffix: true,
              })}
          </span>
          •<span>{blog.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
