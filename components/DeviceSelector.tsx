'use client';

import { useState } from 'react';
import { useCallStateHooks, useDeviceList } from "@stream-io/video-react-sdk";
import { 
  Camera, 
  Mic, 
  Volume2, 
  ChevronDown, 
  CheckCircle 
} from 'lucide-react';

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
  const { deviceList } = useDeviceList(devices, selectedDeviceId);
  const selectedDevice = deviceList.find(device => device.isSelected);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
            {icon}
          </div>
          <div className="text-left">
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className="text-sm font-medium truncate max-w-48">
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
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl z-50 max-h-48 overflow-y-auto">
          {deviceList.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => {
                if (device.deviceId !== "default") {
                  onSelect(device.deviceId);
                }
                onToggle();
              }}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                device.isSelected
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'hover:bg-slate-800/50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">
                  {device.label}
                </span>
                {device.isSelected && (
                  <CheckCircle size={16} className="text-blue-400 flex-shrink-0 ml-2" />
                )}
              </div>
            </button>
          ))}
          {deviceList.length === 0 && (
            <div className="p-3 text-center text-slate-500 text-sm">
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