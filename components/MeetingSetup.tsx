'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
import { ParticipantsPreview } from './Participants';

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  useEffect(() => {
    if (!isCameraOn) {
      call.camera.disable();
    }
    if (!isMicOn) {
      call.microphone.disable();
    }
  }, [call.camera, call.microphone, isCameraOn, isMicOn]);

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
        participant={{
          image: connectedUser.image,
          name: connectedUser.name,
        } as StreamVideoParticipant}
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
            <p className="text-[26px] font-extrabold text-white max-sm:hidden">Ameet</p>
          </Link>
        </div>
        <h1 className="text-center text-2xl font-bold">Setup</h1>
        <VideoPreview className="text-white max-h-[300px] rounded-lg shadow-lg" DisabledVideoPreview={DisabledVideoPreview} />
        <div className="flex items-center gap-8 rounded-lg bg-gray-800 p-4">
          <AudioVolumeIndicator />
          <div className="flex h-16 items-center justify-center gap-3">
            <button
              onClick={toggleCamera}
              className={`flex items-center justify-center rounded-full p-2 text-white transition-colors ${
                isCameraOn
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center justify-center rounded-full p-2 text-white transition-colors ${
                isMicOn
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <DeviceSettings />
          </div>
          <ParticipantsPreview />
        </div>
        <Button
          className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 shadow-lg"
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