'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Link as LinkIcon, Video, Users, Shield, Zap } from 'lucide-react';

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
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 sm:gap-3">
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
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 sm:px-6 sm:py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          
          {/* Hero Section */}
          <div className="mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
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
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Join video meetings effortlessly. Paste your meeting link below or create your own room in seconds.
            </p>
          </div>

          {/* Join Meeting Card */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <LinkIcon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
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
                    className="w-full px-4 py-4 sm:px-6 sm:py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-center sm:text-left"
                  />
                </div>
                
                <button
                  onClick={handleJoinMeeting}
                  disabled={!meetingLink.trim()}
                  className="group relative w-full px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-3">
                    Join Meeting
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 text-center group hover:bg-slate-900/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Video size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">HD Video Calls</h3>
              <p className="text-slate-400 text-sm">Crystal clear video quality for professional meetings</p>
            </div>
            
            <div className="p-6 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 text-center group hover:bg-slate-900/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Users</h3>
              <p className="text-slate-400 text-sm">Connect with teams of any size, anywhere in the world</p>
            </div>
            
            <div className="p-6 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 text-center group hover:bg-slate-900/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield size={24} className="text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-400 text-sm">End-to-end encryption keeps your conversations safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Ameet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}