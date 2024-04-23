import React from 'react';
import { OwnCapability, useRequestPermission } from '@stream-io/video-react-sdk';

interface PermissionRequestButtonProps {
  capability: OwnCapability;
  children: React.ReactNode;
}

const PermissionRequestButton: React.FC<PermissionRequestButtonProps> = ({
  capability,
  children,
}) => {
  const {
    requestPermission,
    hasPermission,
    canRequestPermission,
    isAwaitingPermission,
  } = useRequestPermission(capability);

  if (hasPermission || !canRequestPermission) return null;

  return (
    <button
      disabled={isAwaitingPermission}
      onClick={() => requestPermission()}
      className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};

export default PermissionRequestButton;