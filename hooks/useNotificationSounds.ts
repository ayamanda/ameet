import { useEffect, useCallback } from 'react';
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
}
