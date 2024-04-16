'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Camera, CameraOff, MicOff, Mic } from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
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
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);

  useEffect(() => {
    if (isCameraEnabled) {
      call.camera.enable();
    } else {
      call.camera.disable();
    }
  }, [isCameraEnabled, call.camera]);

  useEffect(() => {
    if (isMicrophoneEnabled) {
      call.microphone.enable();
    } else {
      call.microphone.disable();
    }
  }, [isMicrophoneEnabled, call.microphone]);

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
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
        <h1 className="text-center text-2xl font-bold">Setup</h1>
        <VideoPreview />
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={isCameraEnabled ? 'ghost' : 'danger'}
            onClick={() => setIsCameraEnabled(!isCameraEnabled)}
            className={`${
              isCameraEnabled ? 'bg-transparent' : 'bg-red-500'
            } rounded-full p-2`}
          >
            {isCameraEnabled ? (
              <Camera className="text-green-500 h-6 w-6" />
            ) : (
              <CameraOff className="text-white h-6 w-6" />
            )}
          </Button>
          <Button
            variant={isMicrophoneEnabled ? 'ghost' : 'danger'}
            onClick={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}
            className={`${
              isMicrophoneEnabled ? 'bg-transparent' : 'bg-red-500'
            } rounded-full p-2`}
          >
            {isMicrophoneEnabled ? (
              <Mic className="text-green-500 h-6 w-6" />
            ) : (
              <MicOff className="text-white h-6 w-6" />
            )}
          </Button>
          <DeviceSettings />
        </div>
        <Button
          className="rounded-md bg-green-500 px-4 py-2.5"
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