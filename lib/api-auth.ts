import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
const API_KEYS = process.env.EXTERNAL_API_KEYS?.split(',') || [];

export function validateApiRequest() {
  const headersList = headers();
  const origin = headersList.get('origin');
  const apiKey = headersList.get('x-api-key');

  // Check API key
  if (!apiKey || !API_KEYS.includes(apiKey)) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or missing API key' }),
      { status: 401 }
    );
  }

  // Check origin if it exists (browser requests)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized origin' }),
      { status: 403 }
    );
  }

  return null;
}

export function generateApiKey(): string {
  return `ameet_${Date.now()}_${Math.random().toString(36).substring(2)}`;
} 