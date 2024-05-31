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
      {/* Trigger button to open the settings dialog */}
      <DialogTrigger asChild>
        <button className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] transition-colors">
          <Settings size={20} className="text-white" />
        </button>
      </DialogTrigger>
      {/* Dialog content */}
      <DialogContent className="sm:w-full shadow-lg rounded-lg border bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Settings</DialogTitle>
          <DialogDescription className="text-slate-400 mb-4">
            Customize your meeting experience.
          </DialogDescription>
        </DialogHeader>
        {/* Tabs container */}
        <Tabs defaultValue="layout" onValueChange={handleTabChange}>
          {/* Tabs at the top */}
          <TabsList className="flex justify-center mb-4 bg-slate-800 rounded-t-lg">
            <TabsTrigger value="layout" className="w-full py-2 rounded-tl-lg">
              Layout
            </TabsTrigger>
            <TabsTrigger value="call-stats" className="w-full py-2 rounded-tr-lg">
              Call Stats
            </TabsTrigger>
          </TabsList>
          {/* Content area */}
          <ScrollArea className="h-[500px] sm:h-[400px] p-4 bg-slate-800 rounded-b-lg">
            <TabsContent value="layout">
              <h2 className="text-white mb-4">Select Layout</h2>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-4">
                {layouts.map((option) => (
                  <button
                    key={option.value}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors text-sm sm:text-xs ${
                      layout === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                    }`}
                    onClick={() => setLayout(option.value as CallLayoutType)}
                  >
                    <span>{option.label}</span>
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
