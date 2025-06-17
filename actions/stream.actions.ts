'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async (guestId?: string) => {
  let userId;

  const user = await currentUser();

  if (user) {
    // User is logged in with Clerk
    userId = user.id;
  } else if (guestId) {
    // Use provided guest ID
    userId = guestId;
  } else {
    // Generate random guest ID
    userId = `guest-${Math.random().toString(36).substring(2, 8)}`;
  }

  if (!STREAM_API_KEY) throw new Error('Stream API key is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(userId, expirationTime, issuedAt);

  return token;
};

export const generateGuestToken = async (guestName: string) => {
  const guestId = `guest-${guestName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  return tokenProvider(guestId);
};