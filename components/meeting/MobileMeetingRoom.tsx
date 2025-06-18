import { BackgroundEffects } from './shared/MeetingRoomControls';
import { CallLayoutType } from '@/hooks/useMeetingRoom';
import { Users, Copy, Mail, Check, X, Menu, Maximize2, Minimize2, FlipHorizontal, MessageSquare } from 'lucide-react';
import {
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ReactionsButton,
  PermissionRequests,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import Image from 'next/image';
import Link from 'next/link';
import SettingsDialog from '../SettingsDialog';
import EndCallButton from '../EndCallButton';
import OneToOneLayout from '../OneToOneLayout';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '../ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';
import { useEffect, useState } from 'react';
import { toast } from '../ui/use-toast';
import { ChatPanel } from './shared/ChatPanel';

interface MobileMeetingRoomProps {
  layout: CallLayoutType;
  setLayout: (layout: CallLayoutType) => void;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  linkCopied: boolean;
  meetingLink: string;
  copyLinkToClipboard: () => void;
  openWhatsApp: () => void;
  openEmail: () => void;
}

const CallLayout = ({ layout }: { layout: CallLayoutType }) => {
  const { useRemoteParticipants } = useCallStateHooks();
  const otherParticipants = useRemoteParticipants();
  const isOneOnOneCall = otherParticipants.length === 1;

  switch (layout) {
    case 'grid':
      return <PaginatedGridLayout />;
    case 'speaker-right':
      return <SpeakerLayout participantsBarPosition="left" />;
    case 'speaker-up':
      return <SpeakerLayout participantsBarPosition="bottom" />;
    case 'speaker-down':
      return <SpeakerLayout participantsBarPosition="top" />;
    case 'one-one':
      return isOneOnOneCall ? <OneToOneLayout /> : <SpeakerLayout participantsBarPosition="top" />;
    default:
      return isOneOnOneCall ? <OneToOneLayout /> : <SpeakerLayout participantsBarPosition="top" />;
  }
};

export const MobileMeetingRoom = ({
  layout,
  setLayout,
  showParticipants,
  setShowParticipants,
  linkCopied,
  meetingLink,
  copyLinkToClipboard,
  openWhatsApp,
  openEmail
}: MobileMeetingRoomProps) => {
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { useCameraState } = useCallStateHooks();
  const { camera, devices } = useCameraState();
  const [isFlippingCamera, setIsFlippingCamera] = useState(false);
  const hasMultipleCameras = devices && devices.length > 1;

  // Handle activity detection and control visibility
  useEffect(() => {
    const handleActivity = () => {
      setShowControls(true);
      setLastActivity(Date.now());
    };

    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('touchmove', handleActivity);

    const hideControlsTimer = setInterval(() => {
      if (Date.now() - lastActivity > 3000) {
        setShowControls(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      clearInterval(hideControlsTimer);
    };
  }, [lastActivity]);

  // Handle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Handle camera flip
  const handleCameraFlip = async () => {
    if (!hasMultipleCameras) return;
    
    setIsFlippingCamera(true);
    
    try {
      // Find the next camera in the list
      const currentDeviceId = camera.state.selectedDevice;
      const currentIndex = devices.findIndex(d => d.deviceId === currentDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      const nextDevice = devices[nextIndex];

      await camera.select(nextDevice.deviceId);
    } catch (error) {
      console.error('Error flipping camera:', error);
      // Show toast notification
      toast({
        title: "Failed to flip camera",
        description: "Please try again or check camera permissions",
        variant: "destructive",
      });
    } finally {
      setIsFlippingCamera(false);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <BackgroundEffects />
      
      {/* Top Header Bar */}
      <div className={cn(
        "absolute left-4 right-4 top-4 z-20 flex items-center justify-between transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10">
            <Image src="/icons/logo.svg" width={20} height={20} alt="Ameet logo" />
          </div>
          <span className="text-lg font-bold text-white">Ameet</span>
        </Link>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            {isFullscreen ? (
              <Minimize2 size={20} className="text-white" />
            ) : (
              <Maximize2 size={20} className="text-white" />
            )}
          </button>

          {hasMultipleCameras && (
            <button
              onClick={handleCameraFlip}
              disabled={isFlippingCamera}
              className={cn(
                "rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300",
                isFlippingCamera ? "opacity-50" : "hover:bg-white/10"
              )}
            >
              <FlipHorizontal size={20} className={cn(
                "text-white",
                isFlippingCamera && "animate-spin"
              )} />
            </button>
          )}

          <button
            onClick={() => setShowMenuDrawer(true)}
            className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Permission Requests */}
      <div className="relative z-10">
        <PermissionRequests />
      </div>

      {/* Main Video Area */}
      <div className="relative flex size-full items-center justify-center">
        <CallLayout layout={layout} />
      </div>

      {/* Bottom Controls */}
      <div className={cn(
        "fixed bottom-4 left-4 right-4 z-30 transition-all duration-300",
        showControls ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}>
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-md">
          <SpeakingWhileMutedNotification>
            <ToggleAudioPublishingButton />
          </SpeakingWhileMutedNotification>
          
          <ToggleVideoPublishingButton />
          
          <ReactionsButton />

          <button
            onClick={() => setShowParticipants(true)}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg transition-colors",
              showParticipants ? "bg-white/20" : "hover:bg-white/10"
            )}
          >
            <Users size={20} className="text-white" />
          </button>

          <button
            onClick={() => setShowChat(true)}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg transition-colors",
              showChat ? "bg-white/20" : "hover:bg-white/10"
            )}
          >
            <MessageSquare size={20} className="text-white" />
          </button>

          <EndCallButton />
        </div>
      </div>

      {/* Participants Sheet */}
      <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
        <SheetContent side="right" className="w-full border-l border-slate-700/40 bg-slate-900/95 p-0 backdrop-blur-xl">
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </SheetContent>
      </Sheet>

      {/* Chat Sheet */}
      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent side="right" className="w-full border-l border-slate-700/40 bg-slate-900/95 p-0 backdrop-blur-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
              <h2 className="text-lg font-semibold text-white">Chat</h2>
              <button
                onClick={() => setShowChat(false)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatPanel />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Menu Drawer */}
      <Drawer open={showMenuDrawer} onOpenChange={setShowMenuDrawer}>
        <DrawerContent className="border-t border-slate-700/40 bg-slate-900/95 backdrop-blur-lg">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="border-b border-slate-700/40 py-3">
              <DrawerTitle className="text-base font-medium text-white">Meeting Controls</DrawerTitle>
            </DrawerHeader>

            <div className="p-3">
              {/* Main Controls Section */}
              <div className="grid grid-cols-3 gap-3">
                {/* Participants Button */}
                <button
                  onClick={() => {
                    setShowParticipants(!showParticipants);
                    setShowMenuDrawer(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200",
                    showParticipants
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : "border-slate-700/40 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <Users size={18} />
                  <span className="text-xs">Participants</span>
                </button>

                {/* Reactions Button */}
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700/40 bg-slate-800/50 p-3">
                  <ReactionsButton />
                  <span className="text-xs text-slate-300">Reactions</span>
                </div>

                {/* Settings Button */}
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-700/40 bg-slate-800/50 p-3">
                  <SettingsDialog layout={layout} setLayout={setLayout} />
                  <span className="text-xs text-slate-300">Settings</span>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700/40 bg-slate-800/50 p-3">
                  {/* Copy Link Button */}
                  <button
                    onClick={copyLinkToClipboard}
                    className="flex flex-1 items-center gap-2 rounded-lg bg-slate-700/30 p-2 text-left transition-colors hover:bg-slate-700/50"
                  >
                    {linkCopied ? (
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500/20">
                        <Check size={12} className="text-green-400" />
                      </div>
                    ) : (
                      <Copy size={16} className="text-slate-400" />
                    )}
                    <span className="text-sm text-white">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  
                  {/* WhatsApp Share */}
                  <button
                    onClick={openWhatsApp}
                    className="flex size-9 items-center justify-center rounded-lg bg-slate-700/30 transition-colors hover:bg-slate-700/50"
                  >
                    <img src="/icons/whatsapp.svg" alt="WhatsApp" className="size-4" />
                  </button>
                  
                  {/* Email Share */}
                  <button
                    onClick={openEmail}
                    className="flex size-9 items-center justify-center rounded-lg bg-slate-700/30 transition-colors hover:bg-slate-700/50"
                  >
                    <Mail size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
};