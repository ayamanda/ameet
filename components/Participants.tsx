import { Avatar, useCallStateHooks } from '@stream-io/video-react-sdk';

export const ParticipantsPreview = () => {
  const { useCallSession } = useCallStateHooks();
  const session = useCallSession();

  if (!session || (session.participants && session.participants.length === 0)) return null;

  return (
    <div className="rounded-lg bg-gray-700 p-4">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">People in the call</h3>
      <div className="flex flex-wrap gap-2">
        {session.participants?.map((participant) => (
          <div key={participant.user.id} className="relative">
            <Avatar
              name={participant.user.name}
              imageSrc={participant.user.image}
              className="h-10 w-10 rounded-full border-2 border-gray-600"
            />
            {participant.user.name && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform bg-gray-600 px-2 py-1 rounded-md text-xs text-white">
                {participant.user.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};