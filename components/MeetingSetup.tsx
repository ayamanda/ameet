'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DefaultVideoPlaceholder,
  DeviceSettings,
  StreamVideoParticipant,
  VideoPreview,
  useCall,
  useCallStateHooks,
  useConnectedUser,
} from '@stream-io/video-react-sdk';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';
import { AudioVolumeIndicator } from './AudioVolumeIndicator';
import { BackgroundFilters } from './BackgroundFilter';

const MeetingSetup = ({ setIsSetupComplete }: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.'
    );
  }

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  useEffect(() => {
    call.camera.disable();
    call.microphone.disable();
  }, [call.camera, call.microphone]);

  const toggleCamera = () => {
    if (isCameraOn) {
      call.camera.disable();
      setIsCameraOn(false);
    } else {
      call.camera.enable();
      setIsCameraOn(true);
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      call.microphone.disable();
      setIsMicOn(false);
    } else {
      call.microphone.enable();
      setIsMicOn(true);
    }
  };

  const DisabledVideoPreview = () => {
  const connectedUser = useConnectedUser();
  if (!connectedUser) return null;

    return (
      <DefaultVideoPlaceholder
        participant={
          {
            image: connectedUser.image,
            name: connectedUser.name,
          } as StreamVideoParticipant
        }
      />
    );
  };

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="relative h-screen w-full">
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 text-white">
        <div className="absolute top-4 left-4">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Ameet logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white max-sm:hidden">
              Ameet
            </p>
          </Link>
        </div>
        <h1 className="text-center text-2xl font-bold">Setup</h1>
        <VideoPreview className='text-white max-h-[300px]' 
          DisabledVideoPreview={DisabledVideoPreview}/>
        <AudioVolumeIndicator/>
        <div className="flex h-16 items-center justify-center gap-3">
          <button
            onClick={toggleCamera}
            className={`p-2 rounded-md ${isCameraOn ? 'bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] text-white' : 'bg-red-500 px-4 py-2 hover:bg-red-400 text-white'}`}
          >
            {isCameraOn ? <Camera /> : <CameraOff />}
          </button>
          <button
            onClick={toggleMic}
            className={`p-2 rounded-md ${isMicOn ? 'bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] text-white' : 'bg-red-500 px-4 py-2 hover:bg-red-400 text-white'}`}
          >
            {isMicOn ? <Mic /> : <MicOff />}
          </button>
          <DeviceSettings />
          <BackgroundFilters />
        </div>

        <Button
          className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-500 shadow-md"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          Join meeting
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup;