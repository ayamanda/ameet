import { DefaultChannelData } from 'stream-chat-react';

declare module 'stream-chat' {
  interface CustomChannelData extends DefaultChannelData {
    name?: string;
    image?: string;
  }
} 