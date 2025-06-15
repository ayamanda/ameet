'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex size-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg"
          >
            <Menu className="size-5 text-white/70 transition-colors duration-300 hover:text-white" />
          </motion.button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 border-none p-0">
          {/* Enhanced background blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl" />
          
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative border-b border-white/10 p-6"
          >
            <Link href="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative size-9 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg">
                  <Image
                    src="/icons/logo.svg"
                    width={36}
                    height={36}
                    alt="Ameet logo"
                    className="size-full drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-blue-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </motion.div>
              <motion.p 
                className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-2xl font-black text-transparent transition-all duration-300 group-hover:from-blue-100 group-hover:via-white group-hover:to-blue-100"
                whileHover={{ letterSpacing: "0.05em" }}
              >
                Ameet
              </motion.p>
            </Link>
          </motion.div>

          <div className="relative flex h-[calc(100vh-100px)] flex-col justify-between overflow-y-auto pb-6">
            <SheetClose asChild>
              <motion.section 
                className="flex flex-col gap-2 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || 
                    (item.route !== '/dashboard' && pathname.startsWith(`${item.route}/`));

                  return (
                    <SheetClose asChild key={item.route}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={item.route}
                          className={cn(
                            'group flex items-center gap-4 rounded-xl p-3 transition-all duration-300',
                            {
                              'bg-blue-500/10 shadow-lg': isActive,
                              'hover:bg-white/5': !isActive,
                            }
                          )}
                        >
                          <div className={cn(
                            'relative flex size-10 items-center justify-center rounded-xl border transition-all duration-300',
                            {
                              'border-white/20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm': isActive,
                              'border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 backdrop-blur-sm group-hover:border-white/20': !isActive,
                            }
                          )}>
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              width={20}
                              height={20}
                              className={cn(
                                'transition-all duration-300',
                                {
                                  'opacity-100': isActive,
                                  'opacity-70 group-hover:opacity-100': !isActive,
                                }
                              )}
                            />
                            {/* Glow effect */}
                            <div className={cn(
                              'absolute inset-0 rounded-xl transition-opacity duration-300',
                              {
                                'bg-blue-500/20 blur-md opacity-100': isActive,
                                'bg-white/10 blur-md opacity-0 group-hover:opacity-100': !isActive,
                              }
                            )} />
                          </div>
                          
                          <p className={cn(
                            'text-sm font-medium transition-all duration-300',
                            {
                              'text-white': isActive,
                              'text-white/70 group-hover:text-white': !isActive,
                            }
                          )}>
                            {item.label}
                          </p>
                        </Link>
                      </motion.div>
                    </SheetClose>
                  );
                })}
              </motion.section>
            </SheetClose>

            {/* Version info */}
            <div className="px-6">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 p-4 backdrop-blur-sm">
                <p className="text-xs text-white/50">Version 1.0.0</p>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
