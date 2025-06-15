'use client';

import React from 'react';
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { 
  Camera, 
  Mic, 
  Volume2, 
  ChevronDown, 
  CheckCircle 
} from 'lucide-react';

// Device type is now inferred from the devices prop

type DeviceSelectorProps = {
  devices: MediaDeviceInfo[];
  selectedDeviceId?: string;
  onSelect: (deviceId: string) => void;
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

export const DeviceSelector = ({
  devices,
  selectedDeviceId,
  onSelect,
  label,
  icon,
  isOpen,
  onToggle,
}: DeviceSelectorProps) => {
  const deviceList = devices.map(device => ({
    deviceId: device.deviceId,
    label: device.label || 'Unknown Device',
    isSelected: device.deviceId === selectedDeviceId
  }));
  
  const selectedDevice = deviceList.find(device => device.isSelected) || deviceList[0];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 text-slate-300 transition-all duration-200 hover:bg-slate-700/50"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400 transition-colors group-hover:text-slate-300">
            {icon}
          </div>
          <div className="text-left">
            <div className="mb-1 text-xs text-slate-500">{label}</div>
            <div className="max-w-48 truncate text-sm font-medium">
              {selectedDevice?.label || 'Default'}
            </div>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-700/50 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-md">
          {deviceList.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => {
                if (device.deviceId !== "default") {
                  onSelect(device.deviceId);
                }
                onToggle();
              }}
              className={`w-full rounded-lg p-3 text-left transition-all duration-200 ${
                device.isSelected
                  ? 'border border-blue-500/30 bg-blue-500/20 text-blue-300'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium">
                  {device.label}
                </span>
                {device.isSelected && (
                  <CheckCircle size={16} className="ml-2 shrink-0 text-blue-400" />
                )}
              </div>
            </button>
          ))}
          {deviceList.length === 0 && (
            <div className="p-3 text-center text-sm text-slate-500">
              No devices available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AudioInputDeviceSelector = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, devices, selectedDevice } = useMicrophoneState();

  return (
    <DeviceSelector
      devices={devices || []}
      selectedDeviceId={selectedDevice}
      onSelect={(deviceId) => microphone.select(deviceId)}
      label="Microphone"
      icon={<Mic size={16} />}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export const VideoInputDeviceSelector = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { useCameraState } = useCallStateHooks();
  const { camera, devices, selectedDevice } = useCameraState();

  return (
    <DeviceSelector
      devices={devices || []}
      selectedDeviceId={selectedDevice}
      onSelect={(deviceId) => camera.select(deviceId)}
      label="Camera"
      icon={<Camera size={16} />}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};

export const AudioOutputDeviceSelector = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { useSpeakerState } = useCallStateHooks();
  const { speaker, devices, selectedDevice, isDeviceSelectionSupported } = useSpeakerState();

  if (!isDeviceSelectionSupported) return null;

  return (
    <DeviceSelector
      devices={devices || []}
      selectedDeviceId={selectedDevice}
      onSelect={(deviceId) => speaker.select(deviceId)}
      label="Speaker"
      icon={<Volume2 size={16} />}
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};