'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-all duration-300">
              <Image
                src="/icons/logo.svg"
                width={20}
                height={20}
                alt="Ameet logo"
                className="sm:w-6 sm:h-6"
              />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-white">
              Ameet
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          
          {/* Card Container */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-2xl">
            
            {/* Guest Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <User size={24} className="text-white sm:w-8 sm:h-8" />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Join as{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Guest
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Enter your name to join the meeting. For the full experience, consider logging in.
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <User size={16} className="text-slate-400" />
                </div>
              </div>

              {/* Join Button */}
              <Button
                className="group relative w-full px-6 py-3 sm:py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
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
                <span className="px-4 bg-slate-900/60 text-slate-400">or</span>
              </div>
            </div>

            {/* Login Button */}
            <Button
              className="w-full px-6 py-3 text-base font-medium rounded-xl bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              onClick={() => router.push('/login')}
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                <Shield size={16} />
                Login for Full Access
              </span>
            </Button>

            {/* Guest Limitations Info */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
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