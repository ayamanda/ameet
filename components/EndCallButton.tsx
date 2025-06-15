'use client';

import { CancelCallButton, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { PhoneOff, ArrowRightFromLine } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const EndCallButton = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const call = useCall();
  const router = useRouter();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.'
    );

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const endCall = async () => {
    await call.endCall();
    router.push('/');

  };
  const leaveCall = async () => {
    await call.leave();
    router.push('/');
  };

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner || isPersonalRoom) return <CancelCallButton onLeave={() => router.push(`/`)} />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-red-500 px-4 py-2 transition-colors  duration-300 hover:bg-red-400">
        <PhoneOff size={20} className="text-white " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
        <DropdownMenuItem onClick={leaveCall} className="flex items-center justify-between transition-colors duration-300 hover:bg-white hover:text-red-500">
          <div className="flex items-center gap-2 ">
            <ArrowRightFromLine  size={20}/> leave call
            
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-dark-1" />
        <DropdownMenuItem onClick={endCall} className="flex items-center justify-between transition-colors duration-300 hover:bg-white hover:text-red-500">
          <div className="cursor-pointer rounded-2xl bg-red-500 px-4 py-2">
            End Call for All
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EndCallButton;