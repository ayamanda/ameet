import { 
  Avatar, 
  useCallStateHooks,
  StreamVideoParticipant
} from '@stream-io/video-react-sdk';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/useIsMobile';
import { X } from 'lucide-react';

interface ParticipantsProps {
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
}

export const ParticipantsPreview = ({ showParticipants, setShowParticipants }: ParticipantsProps) => {
  const { useCallSession, useParticipants } = useCallStateHooks();
  const session = useCallSession();
  const participants = useParticipants();
  const { isMobile } = useIsMobile();

  if (!session || !participants.length) return null;

  // Sort participants: dominant speaker first, then speaking participants, then others
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isDominantSpeaker && !b.isDominantSpeaker) return -1;
    if (!a.isDominantSpeaker && b.isDominantSpeaker) return 1;
    if (a.isSpeaking && !b.isSpeaking) return -1;
    if (!a.isSpeaking && b.isSpeaking) return 1;
    return 0;
  });

  const ParticipantsList = () => (
    <div className="flex flex-col gap-4">
      {sortedParticipants.map((participant: StreamVideoParticipant) => (
        <div key={participant.sessionId} className="group relative">
          <div className="flex items-center gap-4 rounded-xl border border-slate-700/40 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="relative">
              <Avatar
                name={participant.name || participant.sessionId}
                imageSrc={participant.image}
                className={cn(
                  "size-12 rounded-xl border-2 transition-all duration-300",
                  participant.isDominantSpeaker 
                    ? "border-blue-500/50 shadow-lg shadow-blue-500/25" 
                    : "border-slate-700/50 shadow-lg shadow-slate-700/25"
                )}
              />
              <div 
                className={cn(
                  "absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-slate-900",
                  participant.isDominantSpeaker ? "bg-blue-500" : "bg-slate-500"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {participant.name || participant.sessionId}
              </span>
              <div className="flex items-center gap-2">
                {participant.isSpeaking && (
                  <span className="text-xs text-blue-400">Speaking</span>
                )}
                {participant.isDominantSpeaker && (
                  <span className="text-xs text-blue-400">Dominant Speaker</span>
                )}
                {participant.isLocalParticipant && (
                  <span className="text-xs text-green-400">You</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
        <SheetContent side="right" className="w-full border-l border-slate-700/40 bg-slate-900/95 p-6 backdrop-blur-lg sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold text-white">
                Participants ({participants.length})
              </SheetTitle>
              <button
                onClick={() => setShowParticipants(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </SheetHeader>
          <div className="mt-6">
            <ParticipantsList />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="h-full rounded-xl border border-slate-700/40 bg-slate-900/60 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-white">
        Participants ({participants.length})
      </h3>
      <ParticipantsList />
    </div>
  );
};