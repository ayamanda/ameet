import { NextResponse } from 'next/server';
import { StreamClient } from '@stream-io/node-sdk';
import { headers } from 'next/headers';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

function isRateLimited(identifier: string): boolean {
  if (IS_DEVELOPMENT) return false;
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
  const current = requestCounts.get(identifier);
  if (!current) {
    requestCounts.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (now - current.timestamp > windowMs) {
    requestCounts.set(identifier, { count: 1, timestamp: now });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  current.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Handle CORS
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (origin) {
      if (!IS_DEVELOPMENT && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
          status: 403,
          statusText: 'Forbidden',
        });
      }
    }

    // Check rate limiting
    const headersList = headers();
    const apiKey = headersList.get('x-api-key') || 'anonymous';
    if (isRateLimited(apiKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate Stream configuration
    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      return NextResponse.json(
        { error: 'Stream API configuration missing' },
        { status: 500 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { hostName, guestName } = body;

    if (!hostName?.trim() || !guestName?.trim()) {
      return NextResponse.json(
        { error: 'Host name and guest name are required' },
        { status: 400 }
      );
    }

    if (hostName.length > 50 || guestName.length > 50) {
      return NextResponse.json(
        { error: 'Names must be less than 50 characters' },
        { status: 400 }
      );
    }

    // Create a unique meeting ID
    const meetingId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Initialize Stream client
    const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

    // Generate user IDs and tokens
    const hostId = `host-${hostName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const guestId = `guest-${guestName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Create or update users in Stream
    await streamClient.upsertUsers({
      users: {
        [hostId]: {
          id: hostId,
          name: hostName.trim(),
          role: 'user',
          custom: {
            type: 'host'
          }
        },
        [guestId]: {
          id: guestId,
          name: guestName.trim(),
          role: 'user',
          custom: {
            type: 'guest'
          }
        }
      }
    });
    
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    
    // Create tokens for both host and guest
    const hostToken = streamClient.createToken(hostId, expirationTime, issuedAt);
    const guestToken = streamClient.createToken(guestId, expirationTime, issuedAt);

    // Create a call using the Stream client
    const callType = 'default';
    const call = await streamClient.video.call(callType, meetingId);
    
    await call.getOrCreate({
      data: {
        created_by_id: hostId,
        members: [
          { user_id: hostId },
          { user_id: guestId }
        ],
                  custom: { 
            hostName: hostName.trim(),
            guestName: guestName.trim(),
            type: 'one-to-one',
            createdAt: new Date().toISOString(),
            isFromApi: true
        }
      }
    });

    // Generate meeting URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || 'http://localhost:3000';
    const meetingUrl = `${baseUrl}/meeting/${meetingId}`;

    // Return response with CORS headers if needed
    const response = NextResponse.json({
      meetingId,
      meetingUrl,
      hostToken,
      guestToken,
      hostId,
      guestId,
      hostName: hostName.trim(),
      guestName: guestName.trim()
    });

    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'POST');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    }

    return response;
  } catch (error) {
    console.error('Error creating meeting:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }
      if (error.message.includes('permission')) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        );
      }
      // Return the actual error message for better debugging
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create meeting. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  
  if (origin) {
    const response = new NextResponse(null, {
      status: 204,
    });
    
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }
  
  return new NextResponse(null, { status: 204 });
} 