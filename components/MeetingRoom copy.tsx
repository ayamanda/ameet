import { useState } from 'react';
import {
  CallParticipantsList,
  CallStatsButton,
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
} from '@stream-io/video-react-sdk';
import { Users, LayoutList, Copy, Share, Mail, Mic, Camera } from 'lucide-react';
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
import OneToOneLayout from './OneToOneLayout';



type CallLayoutType = 'grid'| 'speaker-up' | 'speaker-down' | 'speaker-left' | 'speaker-right' | 'one-one' ;

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
        return isOneOnOneCall ?(
          <OneToOneLayout/>):(
            <SpeakerLayout participantsBarPosition="top" />
          )
      
      default:
        return isOneOnOneCall ? (
          <OneToOneLayout/>
        ) : (
          <SpeakerLayout participantsBarPosition="top" />
        );
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-950 pt-4 text-white">
      <div className="absolute left-4 top-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt="Ameet logo"
            className="max-sm:hidden"
          />
        </Link>
      </div>
      <div >
        <PermissionRequests />
      </div>
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

      </div>



        {!isMobile && (
          <>
            <div className="bg-\[#19232d\]/50 fixed inset-x-0 bottom-0 m-auto flex max-w-[60%] items-center justify-center gap-5 rounded-full p-2 pb-4 shadow-lg backdrop-blur-md">
      
              {!isMobile &&(<ScreenShareButton />)}
              <RecordingInProgressNotification>
                <RecordCallConfirmationButton/>
              </RecordingInProgressNotification>
              <ReactionsButton/>
              <SpeakingWhileMutedNotification>
                <ToggleAudioPublishingButton />
              </SpeakingWhileMutedNotification>
              <ToggleVideoPublishingButton />
              <EndCallButton/>
              
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
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <LayoutList size={20} className="text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                  {['Grid', 'Speaker-Left', 'Speaker-Right', 'Speaker-Up','Speaker-Down'].map((item, index) => (
                    <div key={index}>
                      <DropdownMenuItem onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                        {item}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-dark-1" />
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <CallStatsButton />

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
                  <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white ">
                    <DropdownMenuItem onClick={copyLinkToClipboard} >
                      <div className="flex items-center gap-2">
                        <Copy size={16}  />
                        {linkCopied ? 'Link Copied!' : 'Copy Meeting Link'}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-dark-1" />
                    <DropdownMenuItem className="flex items-center justify-between">
                      <div className="justify-center rounded bg-white p-2">
                        <QRCode value={meetingLink} size={100} />
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-dark-1" />
                    <DropdownMenuItem onClick={openWhatsApp}>
                      <div className="flex items-center gap-2">
                        <img src="/icons/whatsapp.svg" alt="WhatsApp" className="size-4" />
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
          <div className="fixed inset-x-5 bottom-2 flex items-center justify-center gap-5 rounded-full bg-dark-2 p-2 shadow-lg backdrop-blur-md">

          {!isMobile && (<ScreenShareButton />)}
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
        <div className="fixed inset-x-5 top-5 flex items-center justify-center gap-5 rounded-full bg-dark-2 p-2 shadow-lg backdrop-blur-md">
            <ReactionsButton/>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <LayoutList size={20} className="text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                {['Grid', 'Speaker-Left', 'Speaker-Right', 'Speaker-Up', 'Speaker-Down'].map((item, index) => (
                  <div key={index}>
                    <DropdownMenuItem onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                      {item}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-dark-1" />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>


            <CallStatsButton />

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
                    <div className="justify-center rounded bg-white p-2">
                      <QRCode value={meetingLink} size={100} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dark-1" />
                  <DropdownMenuItem onClick={openWhatsApp}>
                    <div className="flex items-center gap-2">
                      <img src="/icons/whatsapp.svg" alt="WhatsApp" className="size-4" />
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

          </div></>
        )}
    </section>
  );
}

export default MeetingRoom;