'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false); // New state to track if the call has ended

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  const meetingMetadata = {
    title: `Meeting ID: ${call.id} - Ameet Video Meeting`,
    description: `Join the video meeting with ID "${call.id}" hosted on Ameet.`,
    openGraph: {
      title: `Meeting ID: ${call.id} - Ameet Video Meeting`,
      description: `Join the video meeting with ID "${call.id}" hosted on Ameet.`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/logo.svg`,
          width: 800,
          height: 600,
          alt: 'Ameet Logo',
        },
      ],
    },
  };

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  // Check if the call has ended
  if (isCallEnded) {
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );
  }

  // Handle the call.ended event
  call.on('call.ended', () => {
    setIsCallEnded(true);
  });

  return (
    <main className="h-screen w-full">
      <NextSeo {...meetingMetadata} />
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;