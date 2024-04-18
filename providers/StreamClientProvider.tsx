'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

useEffect(() => {
  if (!API_KEY) throw new Error('Stream API key is missing');

  let userObj;

  if (isLoaded && user) {
    // User is logged in with Clerk
    userObj = {
      id: user.id,
      name: user?.username || user?.id,
      image: user?.imageUrl || undefined, // Use undefined instead of null
    };
  } else {
    // User is not logged in with Clerk
    const tempUsername = `guest-${Math.random().toString(36).substring(2, 8)}`;
    userObj = {
      id: tempUsername,
      name: tempUsername,
      image: undefined, // Use undefined instead of null
    };
  }

  const client = new StreamVideoClient({
    apiKey: API_KEY,
    user: userObj,
    tokenProvider,
  });

  setVideoClient(client);
}, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
