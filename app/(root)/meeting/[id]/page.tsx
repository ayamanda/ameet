'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import Head from 'next/head';

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  useEffect(() => {
    if (call) {
      call.on('call.ended', () => {
        setIsCallEnded(true);
      });
    }
  }, [call]);

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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,
      site_name: 'Ameet',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/icons/opengraph.png`,
          width: 1200,
          height: 630,
          alt: 'Ameet Logo',
        },
      ],
    },
    twitter: {
      handle: '@ameet',
      site: '@ameet',
      cardType: 'summary_large_image',
    },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `Meeting ID: ${call.id} - Ameet Video Meeting`,
    "description": `Join the video meeting with ID "${call.id}" hosted on Ameet.`,
    "thumbnailUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/icons/opengraph.png`,
    "duration": "PT1H", // Adjust as necessary
    "contentUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,
    "embedUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,

  };

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  if (isCallEnded) {
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );
  }

  return (
    <main className="h-screen w-full">
      <NextSeo {...meetingMetadata} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
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
