'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="relative min-h-screen w-full bg-gray-900 px-4 sm:px-0">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-5 py-12 text-white sm:py-20">
        <div className="absolute top-4 left-4 sm:left-0">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Ameet logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white max-sm:hidden">Ameet</p>
          </Link>
        </div>
        <h1 className="text-center text-2xl font-bold sm:text-3xl">Enter your name</h1>
        <p className="max-w-md text-center text-gray-400">
          For the best experience, we recommend logging in. As a guest, you will have limited access.
        </p>
        <div className="flex w-full items-center gap-2 rounded-lg bg-gray-800 p-4 sm:px-6">
          <input
            type="text"
            placeholder="Enter your name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-6"
          />
          <Button
            className={`rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 sm:px-6 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleJoin}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Join'}
          </Button>
        </div>
        <Button
          className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 shadow-lg"
          onClick={() => router.push('/login')}
        >
          Login for Full Access
        </Button>
      </div>
    </div>
  );
};

export default GuestUser;