import { useState, useEffect, useCallback } from 'react';
import { CallingState, useCallStateHooks, useCall } from '@stream-io/video-react-sdk';

export type CallLayoutType = 'grid' | 'speaker-up' | 'speaker-down' | 'speaker-left' | 'speaker-right' | 'one-one';

// Helper function for playing notification sounds
const audioCache = new Map<string, () => Promise<void>>();

async function playSoundFromUrl(url: string) {
  let doPlay = audioCache.get(url);

  if (!doPlay) {
    const canPlayPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', () => reject(new Error(`Failed to load audio file at ${url}`)), { once: true });
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

export function useMeetingRoom() {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Set up meeting link and mobile detection
  useEffect(() => {
    setMeetingLink(window.location.href);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(meetingLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
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

  // Notification sounds hook
  const call = useCall();
  const isSelf = useCallback(
    (userId: string) => userId === call?.currentUserId,
    [call],
  );

  useEffect(() => {
    if (!call) return;

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

  return {
    layout,
    setLayout,
    showParticipants,
    setShowParticipants,
    linkCopied,
    meetingLink,
    isMobile,
    callingState,
    copyLinkToClipboard,
    openWhatsApp,
    openEmail
  };
} 