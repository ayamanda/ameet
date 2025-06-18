'use client';

import { ChatPanel } from './ChatPanel';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileChatDrawer({ isOpen, onClose, className }: MobileChatDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent 
        className={cn(
          "h-[90vh] max-h-[90vh] border-t-2 border-slate-600/50 bg-slate-900/98 backdrop-blur-xl",
          className
        )}
      >
        {/* Drawer Handle */}
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-slate-600/60" />
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between border-b border-slate-700/40 bg-slate-800/30 px-4 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2.5">
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white">Meeting Chat</h2>
              <p className="text-xs text-slate-400">Share messages with everyone</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Minimize/Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-700/50 p-2.5 text-slate-300 transition-colors hover:bg-slate-600/50 hover:text-white active:scale-95"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
        
        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          <ChatPanel 
            isMobile={true}
            onClose={onClose}
            className="h-full border-none bg-transparent"
          />
        </div>
        
        {/* Bottom Safe Area for iOS */}
        <div className="h-safe-area-inset-bottom bg-slate-900/50" />
      </DrawerContent>
    </Drawer>
  );
}