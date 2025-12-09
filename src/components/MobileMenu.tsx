import { cn } from '@/lib/utils';
import type { NavItems } from '@/types/navigation.types';
import { motion, Variants } from 'motion/react';
import Link from 'next/link';

type MobileMenuProps = {
  navItems: NavItems[];
  closeMenu: () => void;
};

function MobileMenu({ navItems, closeMenu }: MobileMenuProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0,
        duration: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="bg-background/90 fixed inset-0 z-50 overflow-y-auto px-4 py-8 pt-24 backdrop-blur-sm"
    >
      <nav className="flex flex-col gap-4">
        {navItems.map(({ name, href }) => (
          <motion.div key={name} variants={item}>
            <Link
              href={href}
              className={cn('text-foreground block text-2xl font-medium')}
              onClick={() => closeMenu()}
            >
              {name}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}

export default MobileMenu;
