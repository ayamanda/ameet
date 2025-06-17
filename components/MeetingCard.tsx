"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-dark-1 p-6 transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-black/50 xl:max-w-[568px]"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <article className="relative z-10 flex flex-col gap-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-fit rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
        >
          <Image src={icon} alt="meeting icon" width={28} height={28} />
        </motion.div>
        
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-white transition-colors group-hover:text-white/95">
              {title}
            </h1>
            <p className="text-base font-medium text-white/70 transition-colors group-hover:text-white/80">
              {date}
            </p>
          </div>
        </div>
      </article>
      
      <article className="relative z-10 mt-4 flex items-center justify-between">
        {/* Avatar section with improved styling */}
        <div className="relative flex max-sm:hidden">
          <div className="flex items-center">
            {avatarImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn("relative", { "ml-[-12px]": index > 0 })}
              >
                <Image
                  src={img}
                  alt="attendee"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-dark-1 shadow-lg transition-transform duration-200 hover:scale-110"
                />
              </motion.div>
            ))}
            <motion.div 
              className="flex-center ml-[-12px] size-11 rounded-full border-2 border-dark-1 bg-gradient-to-br from-dark-3 to-dark-4 text-sm font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              +5
            </motion.div>
          </div>
        </div>
        
        {/* Action buttons */}
        {!isPreviousMeeting && (
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleClick} 
                className="rounded-xl border border-green-500/20 bg-green-1 px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:bg-green-1/90 hover:shadow-green-500/25"
              >
                {buttonIcon1 && (
                  <Image src={buttonIcon1} alt="feature" width={20} height={20} />
                )}
                {buttonIcon1 && <span className="mx-2" />}
                {buttonText}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast({
                    title: "Link Copied",
                    description: "Meeting link has been copied to clipboard",
                  });
                }}
                className="rounded-xl border border-white/10 bg-dark-4 px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:border-white/20 hover:bg-dark-3"
              >
                <Image
                  src="/icons/copy.svg"
                  alt="copy"
                  width={20}
                  height={20}
                />
                <span className="mx-2" />
                Copy Link
              </Button>
            </motion.div>
          </motion.div>
        )}
      </article>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.section>
  );
};

export default MeetingCard;