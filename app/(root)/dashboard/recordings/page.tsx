import CallList from '@/components/CallList';

const RecordingsPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Recordings
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Access and manage your recorded meeting sessions
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 shadow-xl">
        <CallList type="recordings" />
      </div>
    </section>
  );
};

export default RecordingsPage;
