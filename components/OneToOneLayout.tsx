import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react';

const OneToOneLayout: React.FC = () => {
  const { useRemoteParticipants, useLocalParticipant } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobile){
    return(
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {remoteParticipants.map((participant) => (
          <div key={participant.sessionId} className="h-1/2 w-full pt-[25%] p-2">
            <ParticipantView participant={participant} />
          </div>
        ))}
        {localParticipant && (
          <div className="h-1/2 w-full p-2">
            <ParticipantView participant={localParticipant} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className={`h-[calc(100vh-130px)] w-full ${isMobile ? 'flex flex-col items-center' : ''}`}>
        {remoteParticipants.map((participant) => (
          <div key={participant.sessionId} className={`${isMobile ? 'h-full w-full' : 'h-full w-full'}`}>
            <ParticipantView participant={participant} />
          </div>
        ))}
      </div>
      {!isMobile && localParticipant && (
        <div className="absolute top-4 right-4 z-5 w-64 overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: '16/9' }}>
          <ParticipantView participant={localParticipant} />
        </div>
      )}
    </div>
  );
};

export default OneToOneLayout;
