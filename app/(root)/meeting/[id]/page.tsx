'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useRouter } from 'next/navigation';
import { Loader, VideoOff, Clock, ArrowRight } from 'lucide-react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import Head from 'next/head';

// Enhanced Error State Component matching landing page design
const ErrorState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  primaryAction, 
  secondaryAction 
}: {
  icon: any;
  title: string;
  subtitle: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced background effects matching landing page */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
      <div className="bg-pink-500/3 absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl delay-500" />
      
      {/* Header matching landing page */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
              <Image
                src="/icons/logo.svg"
                width={24}
                height={24}
                alt="Ameet logo"
                className="sm:size-6"
              />
            </div>
            <span className="text-xl font-bold text-white sm:text-2xl">
              Ameet
            </span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-160px)] items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-2xl text-center">
          
          {/* Error Card */}
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md sm:p-12">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex size-20 items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10">
                <Icon className="size-10 text-red-400" />
              </div>
            </div>
            
            {/* Title and Subtitle */}
            <div className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                {title}
              </h1>
              <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-400">
                {subtitle}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="group relative w-full rounded-xl border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-blue-500/40 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-3">
                    {primaryAction.label}
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              )}
              
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-8 py-4 text-lg font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-slate-600/50 hover:bg-slate-800/70 hover:text-white active:scale-95"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          </div>
          
          {/* Bottom decoration */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="size-2 animate-pulse rounded-full bg-blue-400/60"></div>
              <div className="size-2 animate-pulse rounded-full bg-purple-400/60 delay-200"></div>
              <div className="delay-400 size-2 animate-pulse rounded-full bg-pink-400/60"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching landing page */}
      <footer className="relative z-10 border-t border-slate-800/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm text-slate-400">
            © 2024 Ameet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (call) {
      call.on('call.ended', () => {
        setIsCallEnded(true);
      });
    }
  }, [call]);

  // Loading state matching design theme
  if (!isLoaded || isCallLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
        
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-md">
              <Loader className="size-8 animate-spin text-blue-400" />
            </div>
            <p className="text-lg text-white/80">Loading meeting...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="size-2 animate-pulse rounded-full bg-blue-400/60"></div>
                <div className="size-2 animate-pulse rounded-full bg-purple-400/60 delay-200"></div>
                <div className="delay-400 size-2 animate-pulse rounded-full bg-pink-400/60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Call not found state
  if (!call) {
    return (
      <ErrorState
        icon={VideoOff}
        title="Meeting Not Found"
        subtitle="The meeting you're looking for doesn't exist or may have been deleted. Please check the meeting ID and try again."
        primaryAction={{
          label: "Go to Home",
          onClick: () => router.push('/')
        }}
        secondaryAction={{
          label: "Try Again",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

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
    "duration": "PT1H",
    "contentUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,
    "embedUrl": `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`,
  };

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  // Not allowed state
  if (notAllowed) {
    return (
      <ErrorState
        icon={VideoOff}
        title="Access Denied"
        subtitle="You don't have permission to join this meeting. Please contact the meeting organizer for access."
        primaryAction={{
          label: "Go to Home",
          onClick: () => router.push('/')
        }}
      />
    );
  }

  // Call ended state
  if (isCallEnded) {
    return (
      <ErrorState
        icon={Clock}
        title="Meeting Ended"
        subtitle="This meeting has been ended by the host. Thank you for participating!"
        primaryAction={{
          label: "Go to Home",
          onClick: () => router.push('/')
        }}
        secondaryAction={{
          label: "Join Another Meeting",
          onClick: () => router.push('/')
        }}
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