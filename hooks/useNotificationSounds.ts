import { useEffect, useCallback } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

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
function playSoundFromUrl(arg0: string) {
    throw new Error('Function not implemented.');
}

