'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.section 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky left-0 top-0 flex h-screen flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 pt-24 backdrop-blur-xl max-sm:hidden transition-all duration-300",
        isCollapsed ? "w-[88px] px-3" : "w-[280px] px-4"
      )}
    >
      {/* Enhanced background blur effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Main navigation */}
      <div className="relative flex flex-1 flex-col gap-2 pb-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || 
            (item.route !== '/dashboard' && pathname.startsWith(`${item.route}/`));
          
          return (
            <motion.div
              key={item.label}
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
                
                {!isCollapsed && (
                  <p className={cn(
                    'text-sm font-medium transition-all duration-300',
                    {
                      'text-white': isActive,
                      'text-white/70 group-hover:text-white': !isActive,
                    }
                  )}>
                    {item.label}
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-6 flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 p-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="size-5 text-white/70 transition-colors duration-300 hover:text-white" />
          ) : (
            <ChevronLeft className="size-5 text-white/70 transition-colors duration-300 hover:text-white" />
          )}
        </button>
      </div>

      {/* Right accent line */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
    </motion.section>
  );
};

export default Sidebar;