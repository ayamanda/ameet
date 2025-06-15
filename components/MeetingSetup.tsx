'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
  useConnectedUser,
} from '@stream-io/video-react-sdk';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';
import { ParticipantsPreview } from './Participants';

interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}

const MeetingSetup: React.FC<MeetingSetupProps> = ({ setIsSetupComplete }) => {
  const { 
    useCallEndedAt, 
    useCallStartsAt,
    useParticipants 
  } = useCallStateHooks();
  
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const participants = useParticipants();
  const connectedUser = useConnectedUser();
  
  const call = useCall();
  
  // Local state for camera and microphone
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  // Local state for UI and permissions
  const [isJoining, setIsJoining] = useState(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: 'unknown' as 'granted' | 'denied' | 'unknown' | 'checking',
    microphone: 'unknown' as 'granted' | 'denied' | 'unknown' | 'checking'
  });


  // Time calculations
  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  // Check device permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check camera permission
        setDevicePermissions(prev => ({ ...prev, camera: 'checking' }));
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as any });
        setDevicePermissions(prev => ({ 
          ...prev, 
          camera: cameraPermission.state as 'granted' | 'denied' 
        }));

        // Check microphone permission
        setDevicePermissions(prev => ({ ...prev, microphone: 'checking' }));
        const micPermission = await navigator.permissions.query({ name: 'microphone' as any });
        setDevicePermissions(prev => ({ 
          ...prev, 
          microphone: micPermission.state as 'granted' | 'denied' 
        }));
      } catch (error) {
        console.warn('Permission check failed:', error);
        // Fallback to unknown state
        setDevicePermissions({ camera: 'unknown', microphone: 'unknown' });
      }
    };

    checkPermissions();
  }, []);

  // Enhanced camera toggle with permission handling
  const toggleCamera = useCallback(async () => {
    try {
      if (isCameraEnabled) {
        await call.camera.disable();
        setIsCameraEnabled(false);
      } else {
        await call.camera.enable();
        setIsCameraEnabled(true);
        setDevicePermissions(prev => ({ ...prev, camera: 'granted' }));
      }
    } catch (error) {
      console.error('Camera toggle failed:', error);
      setDevicePermissions(prev => ({ ...prev, camera: 'denied' }));
    }
  }, [call.camera, isCameraEnabled]);

  // Enhanced microphone toggle with permission handling
  const toggleMicrophone = useCallback(async () => {
    try {
      if (isMicEnabled) {
        await call.microphone.disable();
        setIsMicEnabled(false);
      } else {
        await call.microphone.enable();
        setIsMicEnabled(true);
        setDevicePermissions(prev => ({ ...prev, microphone: 'granted' }));
      }
    } catch (error) {
      console.error('Microphone toggle failed:', error);
      setDevicePermissions(prev => ({ ...prev, microphone: 'denied' }));
    }
  }, [call.microphone, isMicEnabled]);

  // Enhanced join meeting function
  const handleJoinMeeting = useCallback(async () => {
    if (isJoining) return;
    
    setIsJoining(true);
    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      setIsJoining(false);
    }
  }, [call, setIsSetupComplete, isJoining]);

  // Enhanced video placeholder component
  const EnhancedVideoPlaceholder = () => {
    if (!connectedUser) return null;

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="relative z-0 flex size-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        
        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-6">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="size-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
              <div className="flex size-full items-center justify-center rounded-full bg-slate-900">
                {connectedUser.image ? (
                  <img 
                    src={connectedUser.image} 
                    alt={connectedUser.name || 'User'} 
                    className="size-28 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {getInitials(connectedUser.name || 'User')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Camera status indicator */}
            <div className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800">
              <CameraOff size={16} className="text-red-400" />
            </div>
          </div>
          
          {/* User info */}
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold text-white">
              {connectedUser.name || 'You'}
            </h3>
            <div className="flex items-center justify-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 backdrop-blur-sm">
              <div className="size-2 rounded-full bg-red-400" />
              <span className="text-sm font-medium text-slate-300">Camera is off</span>
            </div>
          </div>
          
          {/* Permission hint */}
          {devicePermissions.camera === 'denied' && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              <AlertCircle size={16} />
              <span>Camera access denied. Please enable in browser settings.</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Early returns for different call states
  if (callTimeNotArrived) {
    return (
      <Alert
        title={`Your meeting hasn't started yet. Scheduled for ${new Date(callStartsAt!).toLocaleString()}`}
        iconUrl="/icons/calendar.svg"
      />
    );
  }

  if (callHasEnded) {
    return (
      <Alert
        title="The meeting has ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute left-1/4 top-0 size-72 animate-pulse rounded-full bg-blue-500/5 blur-3xl sm:size-96" />
      <div className="absolute bottom-0 right-1/4 size-72 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000 sm:size-96" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2 sm:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10">
              <Image
                src="/icons/logo.svg"
                width={20}
                height={20}
                alt="Ameet logo"
                className="sm:size-6"
              />
            </div>
            <span className="text-lg font-bold text-white sm:text-2xl">
              Ameet
            </span>
          </Link>
          
          {/* Connection status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-2 py-1 backdrop-blur-sm sm:px-3 sm:py-1">
              <div className="size-1.5 animate-pulse rounded-full bg-green-400 sm:size-2" />
              <span className="hidden text-xs text-slate-300 sm:inline">Connected</span>
            </div>
            
            {/* Participants count on mobile */}
            <div className="flex items-center gap-1 rounded-full border border-slate-700/50 bg-slate-800/50 px-2 py-1 backdrop-blur-sm sm:hidden">
              <Users size={12} className="text-slate-400" />
              <span className="text-xs text-slate-300">{participants?.length || 0}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          
          {/* Title Section */}
          <div className="py-6 text-center sm:py-8">
            <h1 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-4xl lg:text-5xl">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                connect
              </span>?
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-lg">
              Set up your camera and microphone before joining the meeting
            </p>
            
            {/* Meeting info - desktop */}
            <div className="mt-4 hidden items-center justify-center gap-4 text-sm text-slate-400 sm:flex">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{participants?.length || 0} participant{participants?.length !== 1 ? 's' : ''} waiting</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-3 w-1 rounded-full bg-green-400 ${i > 3 ? 'opacity-30' : ''}`} />
                ))}
              </div>
              <span>Excellent connection</span>
            </div>
          </div>

          <div className="mb-6 flex flex-1 items-center justify-center px-4 sm:px-6">
            <VideoPreview 
              className="max-h-[300px] w-full max-w-2xl overflow-hidden rounded-2xl text-white" 
              DisabledVideoPreview={EnhancedVideoPlaceholder}
            />
          </div>

          {/* Controls Section */}
          <div className="pb-6 sm:pb-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              
              {/* Main Media Controls */}
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-md sm:gap-4 sm:p-6">
                <button
                  onClick={toggleCamera}
                  disabled={devicePermissions.camera === 'checking'}
                  className={`relative rounded-xl p-3 transition-all duration-300 hover:scale-105 active:scale-95 sm:p-4${
                    isCameraEnabled
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-slate-700 text-slate-300 shadow-lg shadow-black/25 hover:bg-slate-600'
                  } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                  title={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {devicePermissions.camera === 'checking' ? (
                    <Loader2 size={18} className="animate-spin sm:size-5" />
                  ) : isCameraEnabled ? (
                    <Camera size={18} className="sm:size-5" />
                  ) : (
                    <CameraOff size={18} className="sm:size-5" />
                  )}
                </button>
                
                <button
                  onClick={toggleMicrophone}
                  disabled={devicePermissions.microphone === 'checking'}
                  className={`relative rounded-xl p-3 transition-all duration-300 hover:scale-105 active:scale-95 sm:p-4${
                    isMicEnabled
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-green-700'
                      : 'bg-slate-700 text-slate-300 shadow-lg shadow-black/25 hover:bg-slate-600'
                  } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                  title={isMicEnabled ? 'Turn off microphone' : 'Turn on microphone'}
                >
                  {devicePermissions.microphone === 'checking' ? (
                    <Loader2 size={18} className="animate-spin sm:size-5" />
                  ) : isMicEnabled ? (
                    <Mic size={18} className="sm:size-5" />
                  ) : (
                    <MicOff size={18} className="sm:size-5" />
                  )}
                </button>
                
                <div className="rounded-xl bg-slate-700 p-3 transition-colors duration-300 hover:bg-slate-600 sm:p-4">
                  <DeviceSettings />
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                {/* Participants info */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-700/30 bg-slate-900/40 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {participants?.length || 0} waiting
                  </span>
                  <ParticipantsPreview />
                </div>

                {/* Device status - mobile */}
                <div className="flex items-center gap-3 sm:hidden">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full transition-colors duration-300 ${
                      isCameraEnabled ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-slate-400">Camera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full transition-colors duration-300 ${
                      isMicEnabled ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-slate-400">Mic</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <Button
                className="group relative w-full max-w-xs rounded-2xl border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-blue-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:px-12 sm:py-6 sm:text-lg"
                onClick={handleJoinMeeting}
                disabled={isJoining}
              >
                <span className="flex items-center justify-center gap-3">
                  {isJoining ? (
                    <>
                      <Loader2 size={18} className="animate-spin sm:size-5" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Meeting
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 sm:size-5" />
                    </>
                  )}
                </span>
              </Button>
              
              {/* Device Status Summary - Desktop */}
              <div className="mx-auto hidden max-w-md grid-cols-2 gap-4 sm:grid">
                <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-700/30 bg-slate-900/30 p-3 backdrop-blur-sm">
                  <div className={`size-3 rounded-full transition-colors duration-300 ${
                    isCameraEnabled ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  }`} />
                  <span className="text-sm text-slate-300">
                    Camera {isCameraEnabled ? 'ready' : 'disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-3 rounded-xl border border-slate-700/30 bg-slate-900/30 p-3 backdrop-blur-sm">
                  <div className={`size-3 rounded-full transition-colors duration-300 ${
                    isMicEnabled ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  }`} />
                  <span className="text-sm text-slate-300">
                    Microphone {isMicEnabled ? 'ready' : 'disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingSetup;