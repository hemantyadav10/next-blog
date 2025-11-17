'use client';

import { motion } from 'motion/react';
import { AuroraText } from './ui/aurora-text';
import { BlurFade } from './ui/blur-fade';
import { Button } from './ui/button';

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-4 py-20 md:px-8">
      <motion.div className="pointer-events-none absolute top-0 left-1/2 h-full max-h-[500px] w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 opacity-20 blur-[100px]" />
      <BlurFade inView direction="up" offset={8}>
        <h1 className="text-center text-4xl font-bold md:text-6xl">
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
        <p className="text-foreground/80 mx-auto max-w-lg text-center text-base leading-relaxed md:text-xl">
          Join Infinite Ink to explore ideas, share your creativity, and
          discover endless possibilities in storytelling and writing
        </p>
      </BlurFade>
      <BlurFade
        delay={0.5}
        direction="up"
        // blur={'0px'}
        className="flex justify-center"
        offset={8}
        inView
      >
        <Button size={'lg'} className="rounded-full">
          Explore Blogs
        </Button>
      </BlurFade>
    </div>
  );
}

export default HeroSection;
