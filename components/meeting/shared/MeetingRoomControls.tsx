import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ControlButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  variant?: 'default' | 'danger' | 'success';
  className?: string;
  isMobile?: boolean;
}

export const ControlButton = ({ 
  children, 
  onClick, 
  active = false, 
  variant = 'default', 
  className = '',
  isMobile = false 
}: ControlButtonProps) => {
  const baseClasses = "group relative flex items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95";
  const sizeClasses = isMobile ? "size-12" : "size-14";
  
  const variantClasses = {
    default: active 
      ? "border-blue-500/50 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25" 
      : "border-slate-700/50 bg-slate-900/60 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/60 hover:text-white",
    danger: "border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:border-red-500/70 shadow-lg shadow-red-500/25",
    success: "border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:border-green-500/70 shadow-lg shadow-green-500/25"
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, sizeClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
};

export const BackgroundEffects = () => (
  <>
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    <div className="absolute left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
    <div className="absolute bottom-0 right-1/4 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
    <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/5 blur-3xl delay-500" />
  </>
); 