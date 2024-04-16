'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { PhoneOff } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

const endCall = async () => {
  await call.endCall();
  setTimeout(() => {
    /*window.location.reload();*/
    router.push('/');
  }, 1000);
};

  return (
    <Button onClick={endCall} className="cursor-pointer rounded-2xl px-4 py-2 hover:bg-red-400 bg-red-500">
     <PhoneOff/>
    </Button>
  );
};

export default EndCallButton;
