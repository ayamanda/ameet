import { ParticipantView, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Move } from 'lucide-react';

const MemoizedParticipantView = React.memo(ParticipantView);

const OneToOneLayout: React.FC = () => {
  const { useRemoteParticipants, useLocalParticipant, useHasOngoingScreenShare } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();
  const isSomeoneScreenSharing = useHasOngoingScreenShare();

  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    setIsMobile(width < 768);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial value
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [handleResize]);

  const remoteParticipantViews = useMemo(() => {
    if (isSomeoneScreenSharing) return null;
    return remoteParticipants.map((participant) => (
      <div key={participant.sessionId} className={isMobile ? "h-1/2 w-full p-2" : "size-full"}>
        <MemoizedParticipantView participant={participant} />
      </div>
    ));
  }, [remoteParticipants, isMobile, isSomeoneScreenSharing]);

  const localParticipantView = useMemo(() => {
    if (!localParticipant) return null;

    if (isMobile) {
      return (
        <div className="h-1/2 w-full p-2">
          <MemoizedParticipantView participant={localParticipant} />
        </div>
      );
    }

    return (
      <Draggable bounds="parent" handle=".drag-handle" grid={[25, 25]}>
        <div className="absolute bottom-[100px] right-4 z-10 h-36 w-64 overflow-hidden rounded-lg shadow-lg transition-all duration-300">
          <div className="group relative size-full">
            <MemoizedParticipantView participant={localParticipant} />
            <div className="drag-handle absolute bottom-0 left-1/2 mb-2 flex h-12 w-44 -translate-x-1/2 cursor-move items-center justify-center rounded-lg bg-black text-sm text-white opacity-0 shadow-md transition-opacity duration-300 ease-in-out hover:shadow-xl group-hover:opacity-100">
              <Move size={16} className="mr-2" />
              <span>Drag to Move</span>
            </div>
          </div>
        </div>
      </Draggable>
    );
  }, [localParticipant, isMobile]);

  if (isSomeoneScreenSharing) {
    return <SpeakerLayout participantsBarPosition="bottom" />;
  }

  return (
    <div className="relative flex size-full flex-col items-center justify-center">
      {isMobile ? (
        <div className="flex h-[calc(100vh-130px)] w-full flex-col items-center justify-center">
          {remoteParticipantViews}
          {localParticipantView}
        </div>
      ) : (
        <div className="flex h-[calc(100vh-130px)] w-full flex-col items-center">
          {remoteParticipantViews}
          {localParticipantView}
        </div>
      )}
    </div>
  );
};

export default React.memo(OneToOneLayout);
