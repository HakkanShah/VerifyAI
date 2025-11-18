
'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ShieldCheck, type LucideIcon } from 'lucide-react';
import { MatrixRainingLetters } from '../matrix-background';
import { useUser } from '@/firebase';

interface NavLink {
  href: string;
  icon: LucideIcon;
  label: string;
  auth: boolean;
}

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: NavLink[];
}

export function MobileNav({ isOpen, setIsOpen, navLinks }: MobileNavProps) {
  const { user, isUserLoading } = useUser();

  const visibleLinks = navLinks.filter(link => {
    if (!link.auth) return true;
    if (!isUserLoading && user) return true;
    return false;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full bg-black/80"
            onClick={e => e.stopPropagation()}
          >
            <MatrixRainingLetters />
            <div className="relative z-10 flex h-full flex-col p-6">
              <div className="flex items-center justify-between pb-8">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
                  <span className="text-xl font-bold text-primary">VerifyAI</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-1 flex-col justify-center">
                <ul className="space-y-4">
                  {visibleLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex w-full items-center justify-center gap-4 rounded-md border border-primary/20 bg-primary/50 p-4 text-center text-lg font-semibold text-primary-foreground transition-all hover:border-primary/50 hover:bg-primary/60 hover:shadow-[0_0_20px_theme(colors.primary)]"
                      >
                        <link.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {!user && !isUserLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-auto flex flex-col gap-3 pt-8">
                  <Button asChild size="lg" variant="default" onClick={() => setIsOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" onClick={() => setIsOpen(false)}>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
