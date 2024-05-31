import { useCallback, useEffect, useState } from 'react';
import {
  CallParticipantsList,
  CallingState,
  OwnCapability,
  PaginatedGridLayout,
  PermissionRequests,
  ReactionsButton,
  RecordCallConfirmationButton,
  RecordingInProgressNotification,
  ScreenShareButton,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import { Users, Copy, Share, Mail, Mic, Camera } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';
import QRCode from 'react-qr-code';
import PermissionRequestButton from './PermissionRequestButton';
import Image from 'next/image';
import Link from 'next/link';
import SettingsDialog from './SettingsDialog';
import OneToOneLayout from './OneToOneLayout';

// Helper function for playing notification sounds
const audioCache = new Map<string, () => Promise<void>>();

async function playSoundFromUrl(url: string) {
  let doPlay = audioCache.get(url);

  if (!doPlay) {
    const canPlayPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', () => reject(`Failed to load audio file at ${url}`), { once: true });
    });

    doPlay = async () => {
      try {
        const audio = await canPlayPromise;
        await audio.play();
      } catch (error) {
        console.error(error);
      }
    };

    audioCache.set(url, doPlay);
  }

  try {
    await doPlay();
  } catch (error) {
    console.error(`Error playing sound from ${url}`, error);
  }
}

// Custom hook for notification sounds
function useNotificationSounds() {
  const call = useCall();

  const isSelf = useCallback(
    (userId: string) => userId === call?.currentUserId,
    [call],
  );

  useEffect(() => {
    if (!call) {
      return;
    }

    const unlistenJoin = call.on('call.session_participant_joined', (event) => {
      if (!isSelf(event.participant.user.id)) {
        console.log('Participant joined, playing sound');
        playSoundFromUrl('/sounds/joined.mp3');
      }
    });

    const unlistenLeft = call.on('call.session_participant_left', (event) => {
      if (!isSelf(event.participant.user.id)) {
        console.log('Participant left, playing sound');
        playSoundFromUrl('/sounds/left.mp3');
      }
    });

    return () => {
      unlistenJoin();
      unlistenLeft();
    };
  }, [call, isSelf]);
}


type CallLayoutType = 'grid' | 'speaker-up' | 'speaker-down' | 'speaker-left' | 'speaker-right' | 'one-one';

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const meetingLink = window.location.href;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000); // Reset link copied state after 3 seconds
      })
      .catch((error) => console.error('Failed to copy link', error));
  };

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(meetingLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openEmail = () => {
    const emailSubject = encodeURIComponent('Join our meeting');
    const emailBody = encodeURIComponent(`Click the link to join the meeting: ${meetingLink}`);
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = emailUrl;
  };

  useNotificationSounds(); // Ensure the custom hook is used within the component

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white bg-slate-950">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/icons/logo.svg" width={32} height={32} alt="Ameet logo" className="max-sm:hidden" />
        </Link>
      </div>
      <div>
        <PermissionRequests />
      </div>
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showParticipants })}>
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {!isMobile && (
        <>
          <div className="fixed bottom-0 left-0 right-0 m-auto max-w-[60%] flex items-center justify-center gap-5 pb-4 bg-[#19232d]/50 backdrop-blur-md rounded-full p-2 shadow-lg">
            {!isMobile && <ScreenShareButton />}
            <RecordingInProgressNotification>
              <RecordCallConfirmationButton />
            </RecordingInProgressNotification>
            <ReactionsButton />
            <SpeakingWhileMutedNotification>
              <ToggleAudioPublishingButton />
            </SpeakingWhileMutedNotification>
            <ToggleVideoPublishingButton />
            <EndCallButton />

            <div className="flex items-center gap-4">
              {/* Permission request buttons */}
              <PermissionRequestButton capability={OwnCapability.SEND_AUDIO}>
                <Mic size={20} className="text-white" />
              </PermissionRequestButton>
              <PermissionRequestButton capability={OwnCapability.SEND_VIDEO}>
                <Camera size={20} className="text-white" />
              </PermissionRequestButton>
              <PermissionRequestButton capability={OwnCapability.SCREENSHARE}>
                <Share size={20} className="text-white" />
              </PermissionRequestButton>
            </div>

            <button
              onClick={() => setShowParticipants((prev) => !prev)}
              className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
            >
              <Users size={20} className="text-white" />
            </button>

            <SettingsDialog layout={layout} setLayout={setLayout} />

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <Share size={20} className="text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                  <DropdownMenuItem onClick={copyLinkToClipboard}>
                    <div className="flex items-center gap-2">
                      <Copy size={16} />
                      {linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                  <DropdownMenuItem className="flex items-center justify-between">
                    <div className="bg-white p-2 rounded justify-center">
                      <QRCode value={meetingLink} size={100} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                  <DropdownMenuItem onClick={openWhatsApp}>
                    <div className="flex items-center gap-2">
                      <img src="/icons/whatsapp.svg" alt="WhatsApp" className="h-4 w-4" />
                      Share on WhatsApp
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openEmail}>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      Share via Email
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </>
      )}

      {isMobile && (
        <>
          <div className="fixed bottom-2 left-5 right-5 flex items-center justify-center gap-5 bg-dark-2 backdrop-blur-md rounded-full p-2 shadow-lg">
            {!isMobile && <ScreenShareButton />}
            <RecordingInProgressNotification>
              <RecordCallConfirmationButton />
            </RecordingInProgressNotification>
            <SpeakingWhileMutedNotification>
              <ToggleAudioPublishingButton />
            </SpeakingWhileMutedNotification>
            <ToggleVideoPublishingButton />
            <EndCallButton />

            <div className="flex items-center gap-4">
              {/* Permission request buttons */}
              <PermissionRequestButton capability={OwnCapability.SEND_AUDIO}>
                <Mic size={20} className="text-white" />
              </PermissionRequestButton>
              <PermissionRequestButton capability={OwnCapability.SEND_VIDEO}>
                <Camera size={20} className="text-white" />
              </PermissionRequestButton>
              <PermissionRequestButton capability={OwnCapability.SCREENSHARE}>
                <Share size={20} className="text-white" />
              </PermissionRequestButton>
            </div>
          </div>
          <div className="fixed top-5 left-5 right-5 flex items-center justify-center gap-5 bg-dark-2 backdrop-blur-md rounded-full p-2 shadow-lg">
            <ReactionsButton />
            <SettingsDialog layout={layout} setLayout={setLayout} />

            <button
              onClick={() => setShowParticipants((prev) => !prev)}
              className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
            >
              <Users size={20} className="text-white" />
            </button>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <Share size={20} className="text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                  <DropdownMenuItem onClick={copyLinkToClipboard}>
                    <div className="flex items-center gap-2">
                      <Copy size={16} />
                      {linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                  <DropdownMenuItem className="flex items-center justify-between">
                    <div className="bg-white p-2 rounded justify-center">
                      <QRCode value={meetingLink} size={100} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                  <DropdownMenuItem onClick={openWhatsApp}>
                    <div className="flex items-center gap-2">
                      <img src="/icons/whatsapp.svg" alt="WhatsApp" className="h-4 w-4" />
                      Share on WhatsApp
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openEmail}>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      Share via Email
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
export default MeetingRoom;
