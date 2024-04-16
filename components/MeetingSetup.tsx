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
            variant="ghost"
            onClick={() => setIsCameraEnabled(!isCameraEnabled)}
          >
            {isCameraEnabled ? (
              <Camera className="text-green-500 h-5 w-5" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <CameraOff className="text-white h-4 w-4" />
              </div>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}
          >
            {isMicrophoneEnabled ? (
              <Mic className="text-green-500 h-5 w-5" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <MicOff className="text-white h-4 w-4" />
              </div>
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