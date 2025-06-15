import CallList from "@/components/CallList";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="flex flex-col gap-4">
        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Previous Calls
        </h1>
        <p className="text-sm text-slate-400 sm:text-base">
          View and manage your past meeting sessions
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <CallList type="ended" />
      </div>
    </section>
  );
};

export default PreviousPage;
