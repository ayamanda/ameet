import { useEffect, useState } from 'react';
import { createSoundDetector, useCallStateHooks, Icon } from '@stream-io/video-react-sdk';

export const AudioVolumeIndicator = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { isEnabled, mediaStream } = useMicrophoneState();
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (!isEnabled || !mediaStream) return;

    const disposeSoundDetector = createSoundDetector(
      mediaStream,
      ({ audioLevel: al }) => setAudioLevel(al),
      { detectionFrequencyInMs: 80, destroyStreamOnStop: false },
    );

    return () => {
      disposeSoundDetector().catch(console.error);
    };
  }, [isEnabled, mediaStream]);

  if (!isEnabled) return null;

  return (
    <div className="flex items-center gap-1">
      <Icon icon="mic"  />
      <div
        className="h-2 w-12 rounded-full bg-gray-300"
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="h-full bg-blue-500"
          style={{
            width: `${audioLevel}%`,
            transition: 'width 0.2s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};