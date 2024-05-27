import { ParticipantView, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { Move } from 'lucide-react';

const OneToOneLayout: React.FC = () => {
  const { useRemoteParticipants, useLocalParticipant, useHasOngoingScreenShare } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();
  const isSomeoneScreenSharing = useHasOngoingScreenShare();

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Conditionally render SpeakerLayout if someone is screen sharing
  if (isSomeoneScreenSharing) {
    return <SpeakerLayout participantsBarPosition="bottom" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {isMobile ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-130px)] w-full">
          {remoteParticipants.map((participant) => (
            <div key={participant.sessionId} className="h-1/2 w-full p-2">
              <ParticipantView participant={participant} />
            </div>
          ))}
          {localParticipant && (
            <div className="h-1/2 w-full p-2">
              <ParticipantView participant={localParticipant} />
            </div>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-130px)] w-full flex flex-col items-center">
          {remoteParticipants.map((participant) => (
            <div key={participant.sessionId} className="h-full w-full">
              <ParticipantView participant={participant} />
            </div>
          ))}
          {localParticipant && (
            <Draggable bounds="parent" handle=".drag-handle" grid={[25, 25]}>
              <div className="absolute bottom-[100px] right-4 z-10 w-64 h-36 overflow-hidden rounded-lg shadow-lg transition-all duration-300">
                <div className="relative h-full w-full group">
                  <ParticipantView participant={localParticipant} />
                  <div className="drag-handle absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 flex items-center justify-center w-44 h-12 bg-black text-white text-sm rounded-lg cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out shadow-md hover:shadow-xl">
                    <Move size={16} className="mr-2" />
                    <span>Drag to Move</span>
                  </div>
                </div>
              </div>
            </Draggable>
          )}
        </div>
      )}
    </div>
  );
};

export default OneToOneLayout;
