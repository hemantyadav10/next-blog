// components/FeaturedBlogCard.tsx
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type FeaturedBlogCardProps = {
  href: string;
  banner: string;
  blurDataUrl?: string;
  title: string;
  description?: string;
  className?: string;
  descriptionClassName?: string;
};

export function FeaturedBlogCard({
  href,
  banner,
  blurDataUrl,
  title,
  description,
  className = '',
  descriptionClassName = '',
}: FeaturedBlogCardProps) {
  return (
    <Link href={href} className={`group relative overflow-hidden ${className}`}>
      <Image
        src={banner}
        alt={title}
        fill
        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        placeholder={blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 from-10% to-transparent to-80%" />

      <div className="absolute bottom-0 flex flex-col gap-2 p-4 md:p-6">
        <h3
          title={title}
          className="text-contrast line-clamp-3 text-lg font-medium md:text-xl"
        >
          <span className="from-contrast to-contrast bg-gradient-to-r bg-[length:0px_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
            {title}
          </span>
        </h3>
        {description && (
          <p
            title={description}
            className={cn('line-clamp-2 text-gray-100', descriptionClassName)}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
