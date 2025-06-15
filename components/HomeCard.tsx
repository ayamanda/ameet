'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <motion.section
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative flex w-full min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 px-6 py-8 transition-all duration-300 cursor-pointer',
        'bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-950/95 backdrop-blur-xl',
        'hover:border-white/20 hover:shadow-lg hover:shadow-white/5',
        className
      )}
      onClick={handleClick}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Animated glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-4 -top-4 size-32 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -bottom-8 -left-8 size-48 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
      </div>
      
      <div className="relative z-10">
        <motion.div 
          className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:from-white/15 group-hover:to-white/10"
          whileHover={{ rotate: 5 }}
        >
          <Image 
            src={img} 
            alt={title} 
            width={28} 
            height={28} 
            className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110" 
          />
        </motion.div>
        
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-white/90 transition-colors duration-200 group-hover:text-white">
            {title}
          </h1>
          <p className="text-base font-medium leading-relaxed text-white/70 transition-colors duration-200 group-hover:text-white/90">
            {description}
          </p>
        </div>
      </div>
      
      {/* Bottom accent line with gradient */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
    </motion.section>
  );
};

export default HomeCard;