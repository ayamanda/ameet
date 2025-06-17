import React from 'react';
import {
  CallingState,
} from '@stream-io/video-react-sdk';

import Loader from './Loader';
import { useMeetingRoom } from '@/hooks/useMeetingRoom';
import { DesktopMeetingRoom } from './meeting/DesktopMeetingRoom';
import { MobileMeetingRoom } from './meeting/MobileMeetingRoom';


const MeetingRoom = () => {
  const {
    layout,
    setLayout,
    showParticipants,
    setShowParticipants,
    linkCopied,
    meetingLink,
    isMobile,
    callingState,
    copyLinkToClipboard,
    openWhatsApp,
    openEmail
  } = useMeetingRoom();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const sharedProps = {
    layout,
    setLayout,
    showParticipants,
    setShowParticipants,
    linkCopied,
    meetingLink,
    copyLinkToClipboard,
    openWhatsApp,
    openEmail
  };

  return isMobile ? (
    <MobileMeetingRoom {...sharedProps} />
  ) : (
    <DesktopMeetingRoom {...sharedProps} />
  );
};

export default MeetingRoom;