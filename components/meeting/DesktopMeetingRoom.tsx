import { ControlButton, BackgroundEffects } from './shared/MeetingRoomControls';
import { CallLayoutType } from '@/hooks/useMeetingRoom';
import { Users, Copy, Share, Mail, Check, MessageSquare } from 'lucide-react';
import {
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  ReactionsButton,
  RecordingInProgressNotification,
  RecordCallConfirmationButton,
  PermissionRequests,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import Link from 'next/link';
import SettingsDialog from '../SettingsDialog';
import EndCallButton from '../EndCallButton';
import OneToOneLayout from '../OneToOneLayout';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ChatPanel } from './shared/ChatPanel';

interface DesktopMeetingRoomProps {
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

export const DesktopMeetingRoom = ({
  layout,
  setLayout,
  showParticipants,
  setShowParticipants,
  linkCopied,
  meetingLink,
  copyLinkToClipboard,
  openWhatsApp,
  openEmail
}: DesktopMeetingRoomProps) => {
  const [showControls, setShowControls] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleActivity = () => {
      setShowControls(true);
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    const hideControlsTimer = setInterval(() => {
      if (Date.now() - lastActivity > 3000) {
        setShowControls(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(hideControlsTimer);
    };
  }, [lastActivity]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <BackgroundEffects />
      
      {/* Header */}
      <div className={cn(
        "absolute left-6 top-6 z-20 transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10">
            <Image src="/icons/logo.svg" width={24} height={24} alt="Ameet logo" />
          </div>
          <span className="text-xl font-bold text-white">Ameet</span>
        </Link>
      </div>

      {/* Permission Requests */}
      <div className="relative z-10">
        <PermissionRequests />
      </div>

      {/* Main Video Area */}
      <div className="relative flex size-full items-center justify-center p-4">
        <div className="flex size-full items-center justify-center">
          <div className="relative flex size-full max-h-[85vh] max-w-[1400px] items-center justify-center">
            <CallLayout layout={layout} />
          </div>
        </div>
        
        {/* Side Panels Container */}
        <div className="flex h-[calc(100vh-86px)] ml-2 gap-2">
          {/* Participants Panel */}
          <div className={cn(
            'h-full transition-all duration-300 ease-in-out',
            showParticipants ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          )}>
            <div className="h-full rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-md">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          </div>

          {/* Chat Panel */}
          <div className={cn(
            'h-full transition-all duration-300 ease-in-out',
            showChat ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'
          )}>
            <div className="h-full rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-md">
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={cn(
        "fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition-all duration-300",
        showControls ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-md">
          {/* Core Controls */}
          <div className="flex items-center gap-3">
            <SpeakingWhileMutedNotification>
              <ToggleAudioPublishingButton />
            </SpeakingWhileMutedNotification>
            
            <ToggleVideoPublishingButton />
            
            <ScreenShareButton />
            
            <ReactionsButton />
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-slate-700/50" />

          {/* Secondary Controls */}
          <div className="flex items-center gap-3">
            <RecordingInProgressNotification>
              <RecordCallConfirmationButton />
            </RecordingInProgressNotification>

            <ControlButton
              onClick={() => setShowParticipants(!showParticipants)}
              active={showParticipants}
            >
              <Users size={20} />
            </ControlButton>

            <ControlButton
              onClick={() => setShowChat(!showChat)}
              active={showChat}
            >
              <MessageSquare size={20} />
            </ControlButton>

            <SettingsDialog layout={layout} setLayout={setLayout} />

            {/* Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ControlButton>
                    <Share size={20} />
                  </ControlButton>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 rounded-xl border border-slate-700/50 bg-slate-900/90 p-2 text-white backdrop-blur-md"
                align="center"
                side="top"
              >
                <DropdownMenuItem 
                  onClick={copyLinkToClipboard}
                  className="rounded-lg p-3 focus:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    {linkCopied ? (
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500/20">
                        <Check size={12} className="text-green-400" />
                      </div>
                    ) : (
                      <Copy size={16} className="text-slate-400" />
                    )}
                    <span>{linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2 border-slate-700/50" />
                
                <div className="p-3">
                  <div className="flex justify-center rounded-lg bg-white p-3">
                    <QRCode value={meetingLink} size={120} />
                  </div>
                </div>
                
                <DropdownMenuSeparator className="my-2 border-slate-700/50" />
                
                <DropdownMenuItem 
                  onClick={openWhatsApp}
                  className="rounded-lg p-3 focus:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <img src="/icons/whatsapp.svg" alt="WhatsApp" className="size-4" />
                    <span>Share on WhatsApp</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={openEmail}
                  className="rounded-lg p-3 focus:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span>Share via Email</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Separator */}
          <div className="h-8 w-px bg-slate-700/50" />

          {/* End Call */}
          <EndCallButton />
        </div>
      </div>
    </section>
  );
}; 