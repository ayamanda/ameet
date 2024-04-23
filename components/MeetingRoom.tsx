import { useState } from 'react';
import {
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  RecordCallConfirmationButton,
  RecordingInProgressNotification,
  ScreenShareButton,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Users, LayoutList, Copy, Share, Mail } from 'lucide-react';
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
import { GetServerSideProps } from 'next';
import { DefaultSeoProps, NextSeo } from 'next-seo';

interface MeetingRoomProps extends DefaultSeoProps {
  meetingLink: string;
  logo: string;
}

type CallLayoutType = 'grid'| 'speaker-up' | 'speaker-down' | 'speaker-left' | 'speaker-right'  ;

const MeetingRoom = ({ meetingLink, logo, ...seoProps }: MeetingRoomProps) => {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

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
      default:
        return isOneOnOneCall ? (
          <SpeakerLayout participantsBarPosition="bottom" />
        ) : (
          <SpeakerLayout participantsBarPosition="top" />
        );
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <NextSeo {...seoProps} />
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

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-5 pb-4">
      
        {!isMobile &&(<ScreenShareButton />)}
        <RecordingInProgressNotification>
          <RecordCallConfirmationButton/>
        </RecordingInProgressNotification>
        <SpeakingWhileMutedNotification>
          <ToggleAudioPublishingButton />
        </SpeakingWhileMutedNotification>
        <ToggleVideoPublishingButton />
        <EndCallButton/>

        

        {!isMobile && (
          <>
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
          </>
        )}

        {isMobile && (
          <div className="fixed top-5 left-5 right-5 flex items-center justify-center gap-5 bg-\[#19232d\]/50 backdrop-blur-md rounded-lg p-2 shadow-lg">
            
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
                        <Mail size={16}  />
                        Share via Email
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps<MeetingRoomProps> = async ({ req }) => {
  const meetingLink = `${req.headers.host}${req.url}`;
  const logo = 'https://res.cloudinary.com/dql0zlcgp/image/upload/v1713865277/logo_Logo_wd3fo9.svg';

  const seoProps: DefaultSeoProps = {
    title: 'Join our meeting',
    description: 'Come join us for an important meeting!',
    canonical: meetingLink,
    openGraph: {
      url: meetingLink,
      title: 'Join our meeting',
      description: 'Come join us for an important meeting!',
      images: [
        {
          url: logo,
          width: 800,
          height: 600,
          alt: 'Ameet logo',
        },
      ],
      site_name: 'Ameet',
    },
  };

  return {
    props: {
      ...seoProps,
      meetingLink,
      logo,
    },
  };
};

export default MeetingRoom;