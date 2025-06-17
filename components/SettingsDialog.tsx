import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CallStats } from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';

// Define the type for the layout options
type CallLayoutType = 'grid' | 'speaker-up' | 'speaker-down' | 'speaker-left' | 'speaker-right' | 'one-one';

// Define the type for the component props
interface SettingsDialogProps {
  layout: CallLayoutType;
  setLayout: (layout: CallLayoutType) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ layout, setLayout }) => {
  const [, setActiveTab] = useState('layout');
  const [showCallStats, setShowCallStats] = useState(false);

  // Array of layout options with labels and values
  const layouts = [
    { label: 'Default', value: 'speaker-left' },
    { label: 'Grid', value: 'grid' },
    { label: 'Speaker-Up', value: 'speaker-up' },
    { label: 'Speaker-Down', value: 'speaker-down' },
    { label: 'Speaker-Left', value: 'speaker-left' },
    { label: 'Speaker-Right', value: 'speaker-right' },
    { label: 'One-One', value: 'one-one' },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowCallStats(value === 'call-stats');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center rounded-xl border border-slate-700/40 bg-slate-900/60 p-3 transition-all duration-300 hover:border-slate-600/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-slate-700/25">
          <Settings size={20} className="text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border border-slate-700/40 bg-slate-900/90 p-6 text-white shadow-xl backdrop-blur-xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Settings</DialogTitle>
          <DialogDescription className="mt-2 text-base text-slate-300">
            Customize your meeting experience
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="layout" onValueChange={handleTabChange} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-800/50 p-1">
            <TabsTrigger 
              value="layout" 
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300",
                "data-[state=active]:bg-white data-[state=active]:text-slate-900",
                "data-[state=inactive]:text-slate-300 hover:data-[state=inactive]:bg-slate-700/50"
              )}
            >
              Layout
            </TabsTrigger>
            <TabsTrigger 
              value="call-stats"
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300",
                "data-[state=active]:bg-white data-[state=active]:text-slate-900",
                "data-[state=inactive]:text-slate-300 hover:data-[state=inactive]:bg-slate-700/50"
              )}
            >
              Call Stats
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="mt-6 h-[400px] rounded-xl border border-slate-700/40 bg-slate-800/50 p-6">
            <TabsContent value="layout">
              <h2 className="mb-6 text-lg font-semibold text-white">Select Layout</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {layouts.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLayout(option.value as CallLayoutType)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-xl border p-4 text-sm font-medium transition-all duration-300",
                      layout === option.value
                        ? "border-blue-500/50 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25"
                        : "border-slate-700/40 bg-slate-800/50 text-slate-300 hover:border-slate-600/40 hover:bg-slate-700/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="call-stats" className="text-white">
              {showCallStats && <CallStats />}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
