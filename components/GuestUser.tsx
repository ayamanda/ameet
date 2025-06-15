'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2, User, ArrowRight, Shield } from 'lucide-react';

const GuestUser = ({ onJoin }: { onJoin: (username: string) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = () => {
    if (inputValue.trim().length === 0) return;
    setIsLoading(true);
    setTimeout(() => {
      onJoin(inputValue);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim().length > 0 && !isLoading) {
      handleJoin();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-0 size-72 animate-pulse rounded-full bg-blue-500/5 blur-3xl sm:size-96" />
      <div className="absolute bottom-0 right-1/4 size-72 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000 sm:size-96" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10">
              <Image
                src="/icons/logo.svg"
                width={20}
                height={20}
                alt="Ameet logo"
                className="sm:size-6"
              />
            </div>
            <span className="text-lg font-bold text-white sm:text-2xl">
              Ameet
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          
          {/* Card Container */}
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            
            {/* Guest Icon */}
            <div className="mb-6 flex justify-center">
              <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl sm:size-20">
                <div className="flex size-full items-center justify-center rounded-full bg-slate-900">
                  <User size={24} className="text-white sm:size-8" />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6 text-center">
              <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                Join as{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Guest
                </span>
              </h1>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                Enter your name to join the meeting. For the full experience, consider logging in.
              </p>
            </div>

            {/* Input Section */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-6 sm:py-4"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <User size={16} className="text-slate-400" />
                </div>
              </div>

              {/* Join Button */}
              <Button
                className="group relative w-full rounded-xl border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-blue-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:py-4"
                onClick={handleJoin}
                disabled={isLoading || inputValue.trim().length === 0}
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Meeting
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900/60 px-4 text-slate-400">or</span>
              </div>
            </div>

            {/* Login Button */}
            <Button
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-6 py-3 text-base font-medium text-slate-300 transition-all duration-300 hover:scale-[1.02] hover:border-slate-600/50 hover:bg-slate-700/60 hover:text-white active:scale-95"
              onClick={() => router.push('/login')}
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <Shield size={16} />
                Login for Full Access
              </span>
            </Button>

            {/* Guest Limitations Info */}
            <div className="mt-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-3 backdrop-blur-sm">
              <p className="text-center text-xs leading-relaxed text-slate-400">
                Guest users have limited features. Login to unlock recording, screen sharing, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestUser;