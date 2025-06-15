'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
  useConnectedUser,
  StreamVideoParticipant,
} from '@stream-io/video-react-sdk';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Volume2,
  VolumeX,
  Wifi
} from 'lucide-react';

import Alert from './Alert';
import { Button } from './ui/button';
import { AudioVolumeIndicator } from './AudioVolumeIndicator';
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
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

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
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setDevicePermissions(prev => ({ 
          ...prev, 
          camera: cameraPermission.state as 'granted' | 'denied' 
        }));

        // Check microphone permission
        setDevicePermissions(prev => ({ ...prev, microphone: 'checking' }));
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
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
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 z-0">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        
        {/* Main content */}
        <div className="relative flex flex-col items-center justify-center gap-6 z-10">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                {connectedUser.image ? (
                  <img 
                    src={connectedUser.image} 
                    alt={connectedUser.name || 'User'} 
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {getInitials(connectedUser.name || 'User')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Camera status indicator */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <CameraOff size={16} className="text-red-400" />
            </div>
          </div>
          
          {/* User info */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              {connectedUser.name || 'You'}
            </h3>
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-300 text-sm font-medium">Camera is off</span>
            </div>
          </div>
          
          {/* Permission hint */}
          {devicePermissions.camera === 'denied' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 group">
            <div className="p-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-all duration-300">
              <Image
                src="/icons/logo.svg"
                width={20}
                height={20}
                alt="Ameet logo"
                className="sm:w-6 sm:h-6"
              />
            </div>
            <span className="text-lg sm:text-2xl font-bold text-white">
              Ameet
            </span>
          </Link>
          
          {/* Connection status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-300 hidden sm:inline">Connected</span>
            </div>
            
            {/* Participants count on mobile */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 sm:hidden">
              <Users size={12} className="text-slate-400" />
              <span className="text-xs text-slate-300">{participants?.length || 0}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          
          {/* Title Section */}
          <div className="text-center py-6 sm:py-8">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                connect
              </span>?
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Set up your camera and microphone before joining the meeting
            </p>
            
            {/* Meeting info - desktop */}
            <div className="hidden sm:flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{participants?.length || 0} participant{participants?.length !== 1 ? 's' : ''} waiting</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-1 h-3 rounded-full bg-green-400 ${i > 3 ? 'opacity-30' : ''}`} />
                ))}
              </div>
              <span>Excellent connection</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 mb-6">
            <VideoPreview 
              className="text-white max-h-[300px] w-full max-w-2xl rounded-2xl overflow-hidden" 
              DisabledVideoPreview={EnhancedVideoPlaceholder}
            />
          </div>

          {/* Controls Section */}
          <div className="pb-6 sm:pb-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              
              {/* Main Media Controls */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-2xl">
                <button
                  onClick={toggleCamera}
                  disabled={devicePermissions.camera === 'checking'}
                  className={`relative p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isCameraEnabled
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-lg shadow-black/25'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  title={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {devicePermissions.camera === 'checking' ? (
                    <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
                  ) : isCameraEnabled ? (
                    <Camera size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <CameraOff size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                
                <button
                  onClick={toggleMicrophone}
                  disabled={devicePermissions.microphone === 'checking'}
                  className={`relative p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isMicEnabled
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-lg shadow-black/25'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  title={isMicEnabled ? 'Turn off microphone' : 'Turn on microphone'}
                >
                  {devicePermissions.microphone === 'checking' ? (
                    <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
                  ) : isMicEnabled ? (
                    <Mic size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <MicOff size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
                
                <div className="p-3 sm:p-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors duration-300">
                  <DeviceSettings />
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                {/* Participants info */}
                <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-700/30">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-slate-300 text-sm font-medium">
                    {participants?.length || 0} waiting
                  </span>
                  <ParticipantsPreview />
                </div>

                {/* Device status - mobile */}
                <div className="flex items-center gap-3 sm:hidden">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isCameraEnabled ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-slate-400">Camera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isMicEnabled ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-slate-400">Mic</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <Button
                className="group relative px-8 py-4 sm:px-12 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full max-w-xs"
                onClick={handleJoinMeeting}
                disabled={isJoining}
              >
                <span className="flex items-center justify-center gap-3">
                  {isJoining ? (
                    <>
                      <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Meeting
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 sm:w-5 sm:h-5" />
                    </>
                  )}
                </span>
              </Button>
              
              {/* Device Status Summary - Desktop */}
              <div className="hidden sm:grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/30">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    isCameraEnabled ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  }`} />
                  <span className="text-sm text-slate-300">
                    Camera {isCameraEnabled ? 'ready' : 'disabled'}
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/30">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
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