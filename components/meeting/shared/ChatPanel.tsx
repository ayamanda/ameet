'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Channel, MessageInput, MessageList, Window, useChatContext } from 'stream-chat-react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import type { Channel as StreamChannel, Event } from 'stream-chat';
import { X, MessageSquare, Users, AlertCircle, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ChatPanelProps {
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
}

export function ChatPanel({ onClose, isMobile = false, className }: ChatPanelProps) {
  const call = useCall();
  const { client: chatClient } = useChatContext();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [channel, setChannel] = useState<StreamChannel>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const initializationAttempted = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const messageSound = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    messageSound.current = new Audio('/sounds/joined.mp3');
    return () => {
      if (messageSound.current) {
        messageSound.current = null;
      }
    };
  }, []);

  // Handle new message notifications
  useEffect(() => {
    if (!channel) return;

    const handleNewMessage = (event: Event) => {
      // Only play sound if the message is from someone else
      if (event.user?.id !== chatClient?.user?.id) {
        messageSound.current?.play().catch(console.error);
      }
    };

    channel.on('message.new', handleNewMessage);

    return () => {
      channel.off('message.new', handleNewMessage);
    };
  }, [channel, chatClient?.user?.id]);

  // Handle typing indicators
  useEffect(() => {
    if (!channel) return;

    const handleTypingStart = (event: Event) => {
      if (event.user?.id === chatClient?.user?.id) return;
      
      setTypingUsers(prev => {
        const userName = event.user?.name || event.user?.id || 'Someone';
        if (!prev.includes(userName)) {
          return [...prev, userName];
        }
        return prev;
      });
    };

    const handleTypingStop = (event: Event) => {
      if (event.user?.id === chatClient?.user?.id) return;

      setTypingUsers(prev => {
        const userName = event.user?.name || event.user?.id || 'Someone';
        return prev.filter(name => name !== userName);
      });
    };

    channel.on('typing.start', handleTypingStart);
    channel.on('typing.stop', handleTypingStop);

    return () => {
      channel.off('typing.start', handleTypingStart);
      channel.off('typing.stop', handleTypingStop);
    };
  }, [channel, chatClient?.user?.id]);

  // Handle unread messages
  useEffect(() => {
    if (!channel) return;

    const handleMessageNew = () => {
      if (document.hidden) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setUnreadCount(0);
        channel.markRead().catch(console.error);
      }
    };

    channel.on('message.new', handleMessageNew);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      channel.off('message.new', handleMessageNew);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [channel]);

  // Initialize channel function
  const initChannel = useCallback(async () => {
    if (!call || !chatClient || initializationAttempted.current) {
      return;
    }

    initializationAttempted.current = true;
    setIsLoading(true);
    
    try {
      // Get the current user's ID
      const currentUserId = chatClient.userID;
      if (!currentUserId) {
        throw new Error('User not connected to chat');
      }

      // Create a list of unique member IDs
      const memberIds = Array.from(new Set([
        currentUserId,
        ...(participants?.map(p => p.userId).filter(Boolean) || [])
      ]));

      if (memberIds.length === 0) {
        throw new Error('No participants available');
      }

      // Create or get a channel for the current call
      const channelId = `meeting-${call.id}`;
      const newChannel = chatClient.channel('livestream', channelId, {
        name: `Meeting Chat`,
        members: memberIds,
        created_by_id: currentUserId,
      });

      // Watch the channel to receive updates
      await newChannel.watch({
        state: true,
        presence: true,
        watch: true,
      });
      
      // Set up cleanup function
      cleanupRef.current = () => {
        newChannel.stopWatching().catch(console.error);
      };

      setChannel(newChannel);
      setError(null);
      setIsLoading(false);

    } catch (err) {
      console.error('Failed to initialize chat channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      setIsLoading(false);
    }
  }, [call, chatClient, participants]);

  // Retry mechanism with exponential backoff
  const retryInitialization = useCallback(async () => {
    setIsRetrying(true);
    setError(null);
    setIsLoading(true);
    
    // Reset initialization flag
    initializationAttempted.current = false;
    
    try {
      await initChannel();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  }, [initChannel]);

  // Initialize channel on mount
  useEffect(() => {
    initChannel();
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [initChannel]);

  // Reset initialization and reconnect when participants change
  useEffect(() => {
    if (participants && participants.length > 0) {
      initializationAttempted.current = false;
      initChannel();
    }
  }, [participants, initChannel]);

  // Handle reconnection
  useEffect(() => {
    if (!chatClient || !channel) return;

    const handleConnectionChange = ({ online = false }) => {
      if (online) {
        // When we come back online, re-watch the channel
        channel.watch({
          state: true,
          presence: true,
          watch: true,
        }).catch(console.error);
      }
    };

    chatClient.on('connection.changed', handleConnectionChange);

    return () => {
      chatClient.off('connection.changed', handleConnectionChange);
    };
  }, [chatClient, channel]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)}>
        {isMobile && (
          <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-white" />
              <h2 className="text-lg font-semibold text-white">Chat</h2>
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            {onClose && (
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                <X size={20} className="text-white" />
              </button>
            )}
          </div>
        )}
        
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="animate-spin">
              <MessageSquare size={24} className="text-blue-400" />
            </div>
            <p className="text-white">
              {isRetrying ? 'Retrying...' : 'Initializing chat...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)}>
        {isMobile && (
          <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-white" />
              <h2 className="text-lg font-semibold text-white">Chat</h2>
            </div>
            {onClose && (
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                <X size={20} className="text-white" />
              </button>
            )}
          </div>
        )}
        
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="max-w-sm text-center">
            <AlertCircle size={48} className="mx-auto mb-3 text-red-400" />
            <h3 className="mb-2 text-lg font-medium text-white">Chat Unavailable</h3>
            <p className="mb-4 text-sm text-slate-300">{error}</p>
            <button
              onClick={retryInitialization}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No channel state
  if (!channel) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)}>
        {isMobile && (
          <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-white" />
              <h2 className="text-lg font-semibold text-white">Chat</h2>
            </div>
            {onClose && (
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
                <X size={20} className="text-white" />
              </button>
            )}
          </div>
        )}
        
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Users size={48} className="mx-auto mb-3 text-slate-400" />
            <p className="text-slate-300">Waiting for participants...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state with chat
  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden", className)}>
      {isMobile && (
        <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-white" />
            <h2 className="text-lg font-semibold text-white">Chat</h2>
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
              <X size={20} className="text-white" />
            </button>
          )}
        </div>
      )}
      
      <Channel channel={channel}>
        <Window>
          <div className="str-chat__container">
            <div className="str-chat__main-panel">
              <MessageList 
                disableDateSeparator={false}
                hideDeletedMessages={true}
                messageActions={['delete', 'edit', 'reply']}
              />
              {typingUsers.length > 0 && (
                <div className="px-4 py-2 text-sm text-slate-400">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
              <MessageInput 
                focus={!isMobile}
                additionalTextareaProps={{
                  placeholder: "Type a message...",
                  rows: 1,
                  maxLength: 1000,
                }}
              />
            </div>
          </div>
        </Window>
      </Channel>
    </div>
  );
}