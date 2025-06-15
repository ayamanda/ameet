'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { dark } from '@clerk/themes';
import { useState } from 'react';

import MobileNav from './MobileNav';
import UserProfileDialog from './UserProfileDialog';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed z-50 w-full border-b border-white/10 px-6 py-4 max-sm:bg-slate-950/95"
    >
      {/* Enhanced background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl max-sm:hidden" />
      
      <div className="relative z-10 flex items-center justify-between">
        {/* Logo section with animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="max-sm:hidden"
        >
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative"
            >
              <div className="relative size-9 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900/80 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20 group-hover:shadow-lg">
                <Image
                  src="/icons/logo.svg"
                  width={36}
                  height={36}
                  alt="Ameet logo"
                  className="size-full drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-blue-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.div>
            
            <motion.p 
              className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-2xl font-black text-transparent transition-all duration-300 group-hover:from-blue-100 group-hover:via-white group-hover:to-blue-100"
              whileHover={{ letterSpacing: "0.05em" }}
            >
              Ameet
            </motion.p>
          </Link>
        </motion.div>
        
        {/* Right section with user controls */}
        <motion.div 
          className="relative z-10 flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <SignedIn>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <UserButton 
                afterSignOutUrl="/sign-in"
                showName={true}
                appearance={{
                  baseTheme: dark,
                  elements: {
                    avatarBox: "size-10 rounded-xl ring-2 ring-white/10 hover:ring-blue-500/50 transition-all duration-300",
                    userButtonBox: "flex items-center gap-2",
                    userButtonOuterIdentifier: "text-sm text-white/70 hidden sm:block",
                    userButtonPopoverCard: "bg-slate-900 border border-white/10 shadow-2xl rounded-xl",
                    userButtonPopoverFooter: "border-t border-white/10",
                    userButtonPopoverActions: "border-t border-white/10",
                    userPreviewMainIdentifier: "text-white",
                    userPreviewSecondaryIdentifier: "text-white/70",
                    userButtonPopoverActionButton__manageAccount: "text-blue-500 hover:text-blue-400",
                    userButtonPopoverActionButton: "text-white hover:bg-white/10"
                  },
                  variables: {
                    colorPrimary: "#3b82f6",
                    colorText: "white",
                    colorTextSecondary: "rgba(255, 255, 255, 0.7)",
                    colorBackground: "rgb(15, 23, 42)"
                  }
                }}
              />
              {/* Subtle glow effect for user button */}
              <div className="absolute inset-0 rounded-xl bg-blue-500/10 opacity-0 blur-lg transition-opacity duration-300 hover:opacity-100" />
            </motion.div>

            {/* Custom manage account button */}
            <motion.button
              onClick={() => setIsProfileOpen(true)}
              className="text-sm text-white/70 hover:text-white transition-colors duration-200"
            >
              Manage Account
            </motion.button>
          </SignedIn>

          <MobileNav />
        </motion.div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* User Profile Dialog */}
      <UserProfileDialog 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;