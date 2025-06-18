'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo, StreamTheme, User } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { useUser } from '@clerk/nextjs';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import GuestUser from '@/components/GuestUser';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

type StreamUserType = {
  id: string;
  name: string;
  image?: string;
  type: 'authenticated' | 'guest';
};

const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [chatClient, setChatClient] = useState<StreamChat>();
  const [chatError, setChatError] = useState<Error>();
  const { user, isLoaded } = useUser();
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    if (!API_KEY) {
      setChatError(new Error('Stream API key is missing'));
      return;
    }

    let userObj: StreamUserType | undefined;
    let _chatClient: StreamChat | undefined;
    let _videoClient: StreamVideoClient | undefined;

    if (isLoaded && user) {
      // User is logged in with Clerk
      const userName = user.username || user.firstName || user.lastName || user.id;
      userObj = {
        id: user.id,
        name: userName,
        image: user.imageUrl || undefined,
        type: 'authenticated',
      };
    } else if (tempUsername) {
      // User is not logged in with Clerk but has provided a temporary username
      const guestId = `guest-${tempUsername.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      userObj = {
        id: guestId,
        name: tempUsername,
        type: 'guest',
      };
    }

    const initClients = async () => {
      if (!userObj) return;

      try {
        // Get token for authenticated users or temporary users
        const token = await tokenProvider(userObj.type === 'guest' ? userObj.id : undefined);

        // Initialize chat client
        _chatClient = StreamChat.getInstance(API_KEY);
        
        // Disconnect any existing user before connecting a new one
        if (_chatClient.userID) {
          await _chatClient.disconnectUser();
        }
        
        await _chatClient.connectUser(
          {
            id: userObj.id,
            name: userObj.name,
            image: userObj.image,
          },
          token
        );

        // Wait for the connection to be established
        await new Promise((resolve) => {
          const checkConnection = () => {
            if (_chatClient?.userID) {
              resolve(true);
            } else {
              setTimeout(checkConnection, 100);
            }
          };
          checkConnection();
        });
        
        setChatClient(_chatClient);

        // Initialize video client
        _videoClient = new StreamVideoClient({
          apiKey: API_KEY,
          user: userObj,
          token,
        });

        setVideoClient(_videoClient);
        setChatError(undefined);
      } catch (error) {
        console.error('Failed to initialize Stream clients:', error);
        setChatError(error instanceof Error ? error : new Error('Failed to initialize Stream clients'));
        
        // Cleanup on error
        if (_videoClient) {
          _videoClient.disconnectUser();
        }
        if (_chatClient) {
          _chatClient.disconnectUser();
        }

        setVideoClient(undefined);
        setChatClient(undefined);
      }
    };

    initClients();

    // Cleanup function
    return () => {
      const cleanup = async () => {
        try {
          if (_videoClient) {
            await _videoClient.disconnectUser();
          }
          if (_chatClient?.userID) {
            await _chatClient.disconnectUser();
          }
        } catch (error) {
          console.error('Error during cleanup:', error);
        } finally {
          setVideoClient(undefined);
          setChatClient(undefined);
        }
      };
      cleanup();
    };
  }, [user, isLoaded, tempUsername]);

  if (chatError) {
    return <div>Error: {chatError.message}</div>;
  }

  if (!videoClient || !chatClient) {
    if (isLoaded && !user) {
      return <GuestUser onJoin={(username) => setTempUsername(username)} />;
    }
    return <Loader />;
  }

  return (
    <StreamTheme>
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <StreamVideo client={videoClient}>
          {children}
        </StreamVideo>
      </Chat>
    </StreamTheme>
  );
};

export default StreamProvider; 