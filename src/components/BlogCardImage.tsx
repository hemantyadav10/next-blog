'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

type ImageProps = {
  title: string;
  blurDataUrl: string | null | undefined;
  banner: string | null | undefined;
};

function BlogCardImage({ banner, blurDataUrl, title }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="col-span-4 aspect-3/2 overflow-hidden">
      <motion.div
        initial={{ filter: 'blur(6px)' }}
        animate={{ filter: isLoaded ? 'blur(0px)' : 'blur(6px)' }}
        transition={{ duration: 0.3 }}
        className={cn('overflow-hidden')}
      >
        {banner ? (
          <Image
            src={banner}
            alt={title}
            width={368}
            height={245}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            placeholder={blurDataUrl ? 'blur' : 'empty'}
            blurDataURL={blurDataUrl || ''}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
      </motion.div>
    </div>
  );
}

export default BlogCardImage;
