import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Ameet',
  description: 'A video calling app',
    icons: {
    icon: "/icons/logo.svg",
  },
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
      </div>

      {/* Content */}
      <div className="relative">
        <Navbar />

        <div className="flex">
          <Sidebar />
          
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-24 max-md:pb-14 sm:px-8">
            <div className="w-full">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
