'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Link as LinkIcon, Video, Users, Shield } from 'lucide-react';
import Loader from '@/components/Loader';

export default function LandingPage() {
  const [meetingLink, setMeetingLink] = useState('');
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect after Clerk has loaded and user is confirmed signed in
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while Clerk is checking authentication
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Loader />
      </div>
    );
  }

  // Don't render the landing page if user is signed in (redirect is happening)
  if (isSignedIn) {
    return null;
  }
  
  const handleJoinMeeting = () => {
    if (meetingLink.trim()) {
      // Extract meeting ID from the link or use the full link
      const url = meetingLink.trim();
      // If it's a full URL, navigate to it, otherwise treat as meeting ID
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        // Assume it's a meeting ID and construct the meeting URL
        window.location.href = `/meeting/${url}`;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && meetingLink.trim()) {
      handleJoinMeeting();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
      <div className="bg-pink-500/3 absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl delay-500" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="inline-flex items-center gap-2 sm:gap-3">
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
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-600 active:scale-95 sm:px-6 sm:py-2"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-4xl text-center">
          
          {/* Hero Section */}
          <div className="mb-12 sm:mb-16">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Connect{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                instantly
              </span>
              <br />
              Meet{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                anywhere
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Join video meetings effortlessly. Paste your meeting link below or create your own room in seconds.
            </p>
          </div>

          {/* Join Meeting Card */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-center justify-center gap-3">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2">
                  <LinkIcon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Join a Meeting
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Paste meeting link or enter meeting ID"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-center text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-6 sm:py-4 sm:text-left"
                  />
                </div>
                
                <button
                  onClick={handleJoinMeeting}
                  disabled={!meetingLink.trim()}
                  className="group relative w-full rounded-xl border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-blue-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-3">
                    Join Meeting
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="group rounded-xl border border-slate-700/30 bg-slate-900/30 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/40">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
                <Video size={24} className="text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">HD Video Calls</h3>
              <p className="text-sm text-slate-400">Crystal clear video quality for professional meetings</p>
            </div>
            
            <div className="group rounded-xl border border-slate-700/30 bg-slate-900/30 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/40">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 transition-transform duration-300 group-hover:scale-110">
                <Users size={24} className="text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Multiple Users</h3>
              <p className="text-sm text-slate-400">Connect with teams of any size, anywhere in the world</p>
            </div>
            
            <div className="group rounded-xl border border-slate-700/30 bg-slate-900/30 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/40">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 transition-transform duration-300 group-hover:scale-110">
                <Shield size={24} className="text-pink-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Secure & Private</h3>
              <p className="text-sm text-slate-400">End-to-end encryption keeps your conversations safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
            <p className="text-sm text-slate-400">
              &copy; 2024 Ameet. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}