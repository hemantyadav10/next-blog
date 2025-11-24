'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { AuroraText } from './ui/aurora-text';
import { BlurFade } from './ui/blur-fade';
import { Button } from './ui/button';

function HeroSection() {
  return (
    <section className="flex flex-col justify-center space-y-6">
      <motion.div className="pointer-events-none absolute top-0 left-1/2 h-full max-h-[500px] w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 opacity-20 blur-[100px]" />
      <BlurFade inView direction="up" offset={8}>
        <h1 className="max-w-lg text-4xl font-semibold md:text-6xl">
          <AuroraText>Infinite</AuroraText>
          <span className="from-primary to-primary/70 text-primary bg-clip-text dark:bg-gradient-to-b dark:text-transparent">
            Ink:{' '}
          </span>
          <span className="from-primary to-primary/70 text-primary bg-clip-text dark:bg-gradient-to-b dark:text-transparent">
            Where{' '}
          </span>
          <span className="from-primary to-primary/70 text-primary bg-clip-text dark:bg-gradient-to-b dark:text-transparent">
            Ideas{' '}
          </span>
          <span className="from-primary to-primary/70 text-primary bg-clip-text dark:bg-gradient-to-b dark:text-transparent">
            Flow
          </span>
        </h1>
      </BlurFade>
      <BlurFade delay={0.25} direction="up" offset={8} inView>
        <p className="text-foreground/80 max-w-lg text-base leading-relaxed md:text-xl">
          Join Infinite Ink to explore ideas, share your creativity, and
          discover endless possibilities in storytelling and writing
        </p>
      </BlurFade>
      <BlurFade delay={0.5} direction="up" offset={8} inView>
        <Button size={'lg'} className="rounded-full" asChild>
          <Link href={'/explore'}>Explore Blogs</Link>
        </Button>
      </BlurFade>
    </section>
  );
}

export default HeroSection;
