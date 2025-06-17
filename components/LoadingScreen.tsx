import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  userName?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ userName }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-0 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-center">
          <div className="flex items-center gap-2 sm:gap-3">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-160px)] items-center justify-center px-4 sm:px-6">
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md sm:p-12">
            {/* Loading Animation */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex size-20 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                <Loader2 className="size-10 animate-spin text-blue-400" />
              </div>
            </div>
            
            {/* Message */}
            <div className="mb-8">
              <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Please wait a moment
              </h1>
              <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-400">
                {userName ? (
                  <>
                    We&apos;re connecting your call with <span className="font-semibold text-white">{userName}</span> through our secured private servers.
                  </>
                ) : (
                  "We&apos;re connecting your call through our secured private servers."
                )}
              </p>
            </div>
            
            {/* Loading Dots */}
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <div className="size-2 animate-pulse rounded-full bg-blue-400/60"></div>
                <div className="size-2 animate-pulse rounded-full bg-purple-400/60 delay-200"></div>
                <div className="delay-400 size-2 animate-pulse rounded-full bg-pink-400/60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default LoadingScreen; 