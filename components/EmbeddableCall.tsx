import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle } from 'lucide-react';

interface EmbeddableCallProps {
  hostName: string;
  apiKey: string;
  buttonText?: string;
  buttonClassName?: string;
  onCallStarted?: (meetingUrl: string, token: string) => void;
  onError?: (error: string) => void;
}

const EmbeddableCall: React.FC<EmbeddableCallProps> = ({
  hostName,
  apiKey,
  buttonText = 'Start Video Call',
  buttonClassName = '',
  onCallStarted,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCall = async () => {
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }

    const trimmedName = guestName.trim();
    if (!trimmedName) {
      const errorMsg = 'Please enter your name';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (trimmedName.length > 50) {
      const errorMsg = 'Name must be less than 50 characters';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          hostName,
          guestName: trimmedName
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Failed to parse server response. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting');
      }

      if (onCallStarted) {
        onCallStarted(data.meetingUrl, data.token);
      } else {
        // Store token in sessionStorage before opening the window
        sessionStorage.setItem('stream_call_token', data.token);
        window.open(data.meetingUrl, '_blank');
      }
    } catch (error) {
      console.error('Error starting call:', error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : 'Failed to start call. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleStartCall();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}
      
      {showNameInput ? (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            className="w-full"
            maxLength={50}
            disabled={isLoading}
            autoFocus
          />
          <Button
            onClick={handleStartCall}
            disabled={isLoading}
            className={buttonClassName}
          >
            {isLoading ? 'Starting...' : 'Join Call'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleStartCall}
          disabled={isLoading}
          className={buttonClassName}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmbeddableCall; 