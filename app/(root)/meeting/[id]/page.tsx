'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useRouter } from 'next/navigation';
import { Loader, VideoOff, Clock, Home, RefreshCw, ArrowRight } from 'lucide-react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced background effects matching landing page */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Header matching landing page */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Image
                src="/icons/logo.svg"
                width={24}
                height={24}
                alt="Ameet logo"
                className="sm:w-6 sm:h-6"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              Ameet
            </span>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-160px)] px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto text-center">
          
          {/* Error Card */}
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 border border-red-500/20">
                <Icon className="w-10 h-10 text-red-400" />
              </div>
            </div>
            
            {/* Title and Subtitle */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                {subtitle}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="group relative w-full px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                >
                  <span className="flex items-center justify-center gap-3">
                    {primaryAction.label}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              )}
              
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="w-full px-8 py-4 text-lg font-medium rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          </div>
          
          {/* Bottom decoration */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer matching landing page */}
      <footer className="relative z-10 py-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-400 text-sm">
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
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 mb-6">
              <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <p className="text-white/80 text-lg">Loading meeting...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-pulse delay-400"></div>
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