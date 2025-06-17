import React from 'react';
import { OwnCapability, useRequestPermission } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PermissionRequestButtonProps {
  capability: OwnCapability;
  children: React.ReactNode;
  className?: string;
}

const PermissionRequestButton: React.FC<PermissionRequestButtonProps> = ({
  capability,
  children,
  className,
}) => {
  const {
    requestPermission,
    hasPermission,
    canRequestPermission,
    isAwaitingPermission,
  } = useRequestPermission(capability);

  if (hasPermission || !canRequestPermission) return null;

  return (
    <button
      disabled={isAwaitingPermission}
      onClick={() => requestPermission()}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-xl border border-slate-700/40 bg-slate-900/60 px-4 py-2 text-sm font-medium text-white transition-all duration-300",
        "hover:border-slate-600/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-slate-700/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:hover:border-slate-700/40 disabled:hover:bg-slate-900/60 disabled:hover:shadow-none",
        className
      )}
    >
      {isAwaitingPermission && (
        <Loader2 className="size-4 animate-spin text-white" />
      )}
      {children}
    </button>
  );
};

export default PermissionRequestButton;