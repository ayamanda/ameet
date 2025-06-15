'use client';

import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import MeetingTypeList from '@/components/MeetingTypeList';
import { Calendar, Clock, Users } from 'lucide-react';

const Home = () => {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const dateTime = new Date(now);

  const time = dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' })).format(dateTime);

  let greeting = '';
  let emoji = '';
  const hour = dateTime.getHours();
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    emoji = '🌅';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '☀️';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    emoji = '🌆';
  } else {
    greeting = 'Good night';
    emoji = '🌙';
  }

  const { user } = useUser();

  return (
    <section className="flex size-full flex-col gap-8 text-white">
      {/* Hero Section with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Grid background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-8 right-8 h-32 w-32 animate-pulse rounded-full bg-blue-500/5 blur-2xl" />
          <div className="absolute bottom-12 left-12 h-24 w-24 animate-pulse rounded-full bg-purple-500/5 blur-xl delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/3 blur-3xl delay-500" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:p-12">
          {/* Left section with greeting and user info */}
          <div className="flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <div className="inline-flex max-w-[300px] items-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 backdrop-blur-md">
                <span className="text-lg font-medium text-white/95">
                  {greeting} {emoji}
                </span>
              </div>
              
              <motion.h2 
                className="text-2xl font-bold text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Welcome back, {user?.firstName || 'User'}!
              </motion.h2>
            </motion.div>

            {/* Stats cards */}
            <motion.div 
              className="mt-6 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">Today's Meetings</span>
                </div>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">Total Participants</span>
                </div>
                <p className="text-2xl font-bold">0</p>
              </div>
            </motion.div>
          </div>

          {/* Right section with time and date */}
          <motion.div 
            className="flex flex-col items-end justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/60 px-4 py-3 backdrop-blur-md">
              <Clock className="h-5 w-5 text-white/70" />
              <span className="text-lg font-medium text-white/90">{time}</span>
            </div>
            
            <motion.div 
              className="text-right"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.1)",
                  "0 0 30px rgba(255,255,255,0.2)",
                  "0 0 20px rgba(255,255,255,0.1)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <h1 className="text-4xl font-black text-white drop-shadow-2xl sm:text-5xl lg:text-7xl">
                {time}
              </h1>
              <p className="mt-2 text-lg font-semibold text-slate-300 drop-shadow-lg sm:text-xl lg:text-2xl">
                {date}
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 opacity-60" />
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full"
      >
        <h2 className="mb-6 text-2xl font-bold text-white/90">Quick Actions</h2>
        <MeetingTypeList />
      </motion.div>
    </section>
  );
};

export default Home;