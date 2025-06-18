import { useState, useCallback, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

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

export function useNotificationSounds() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat-sound-enabled');
      return stored === null ? true : stored === 'true';
    }
    return true;
  });

  const [audio] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Audio('/sounds/joined.mp3');
    }
    return null;
  });

  const playMessageSound = useCallback(() => {
    if (audio && isSoundEnabled) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  }, [audio, isSoundEnabled]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem('chat-sound-enabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

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
        playSoundFromUrl('/sounds/left.mp3');
      }
    });

    return () => {
      unlistenJoin();
      unlistenLeft();
    };
  }, [call, isSelf]);

  return {
    isSoundEnabled,
    toggleSound,
    playMessageSound
  };
}
