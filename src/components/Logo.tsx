import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo.svg';
import { cn } from '@/lib/utils';

interface LogoProps {
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  href?: string;
  size?: number;
}

export function Logo({
  showText = true,
  className,
  imageClassName,
  textClassName,
  href = '/',
  size = 40,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn('flex w-max items-center text-xl font-semibold', className)}
    >
      <Image
        src={logo.src}
        alt="Logo"
        width={size}
        height={size}
        className={cn('dark:invert', imageClassName)}
      />
      {showText && (
        <span className={cn('hidden sm:block', textClassName)}>
          InfiniteInk
        </span>
      )}
    </Link>
  );
}
