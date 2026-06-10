"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardStackItem } from "@/components/ui/card-stack";

export function SpeakerDesktopFilmstrip({ items }: { items: CardStackItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  return (
    <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 py-8 sm:py-10 px-2 sm:px-4 min-h-[480px] sm:min-h-[600px]">
      {items.map((item, idx) => {
        const isActive = idx === activeIdx;
        const dist = Math.abs(idx - activeIdx);
        
        // Hide elements that are too far away to keep it clean
        if (dist > 3) return null;
        const mobileHiddenClass = dist > 1 ? "hidden sm:block" : "";

        return (
          <motion.div
            key={item.id}
            onClick={() => isActive ? (item.href && router.push(item.href)) : setActiveIdx(idx)}
            className={`relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl shrink-0 ${mobileHiddenClass}`}
            animate={{
              width: isActive ? "min(420px, 75vw)" : "min(140px, 10vw)",
              height: isActive ? "min(600px, 70vh)" : "min(480px, 60vh)",
              opacity: 1,
              filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.35)",
            }}
            transition={{ type: "spring", stiffness: 280, damping: 30, mass: 1.2 }}
          >
            <img
              src={item.imageSrc}
              alt={item.title}
              className="w-full h-full object-cover absolute inset-0"
              style={{ objectPosition: item.objectPosition || "center 15%" }}
            />
            {/* Subtle inner border */}
            <div className="absolute inset-0 border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none" />
            
            {/* Content Reveal */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="absolute bottom-0 inset-x-0 p-8 pt-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent flex flex-col justify-end"
                >
                  <h3 className="text-white text-2xl sm:text-4xl font-medium tracking-tight mb-1 sm:mb-2 leading-tight">{item.title}</h3>
                  <p className="!text-white opacity-90 leading-relaxed text-xs sm:text-sm line-clamp-3 sm:line-clamp-3">{item.description}</p>
                  {item.href && (
                    <div className="mt-4 sm:mt-6 inline-flex self-start items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white border border-white/30 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-white hover:text-black transition-all duration-300">
                      View Profile <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
