"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardStackItem } from "@/components/ui/card-stack";

export function SpeakerDesktopFilmstrip({ items }: { items: CardStackItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  // For 3D Tilt (always applied to active card)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Auto-advance logic
  useEffect(() => {
    if (isHovered || !isInView) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [items.length, isHovered, isInView]);

  return (
    <div ref={ref} className="w-full flex flex-col items-center py-4 overflow-hidden">
      <div 
        className="w-full mx-auto flex items-center justify-center relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="flex items-center gap-4 lg:gap-6 px-4 h-[520px] w-full justify-center"
        >
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            const dist = Math.abs(idx - activeIdx);
            
            // Hide elements that are too far away to keep it clean
            if (dist > 5) return null;

            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  if (isActive && item.href) {
                    router.push(item.href);
                  } else {
                    setActiveIdx(idx);
                  }
                }}
                onMouseMove={isActive ? handleMouseMove : undefined}
                onMouseLeave={isActive ? handleMouseLeave : undefined}
                className="relative rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl shrink-0"
                style={{
                  rotateX: isActive ? rotateX : 0,
                  rotateY: isActive ? rotateY : 0,
                  transformStyle: "preserve-3d"
                }}
                animate={{
                  width: isActive ? 420 : 140,
                  height: isActive ? 520 : 400,
                  opacity: 1,
                  filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.35)",
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover absolute inset-0"
                    style={{ objectPosition: item.objectPosition || "center 15%" }}
                  />
                )}
                <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none" />
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="absolute bottom-0 inset-x-0 p-8 pt-16 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent flex flex-col justify-end"
                    >
                      <h3 className="text-white text-4xl font-medium tracking-tight mb-2 leading-tight">{item.title}</h3>
                      <p className="!text-white opacity-90 leading-relaxed text-sm line-clamp-3">{item.description}</p>
                      {item.href && (
                        <div className="mt-6 inline-flex self-start items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white border border-white/30 rounded-full px-5 py-2.5 hover:bg-white hover:text-black transition-all duration-300">
                          View Profile <ArrowUpRight className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export function SpeakerMobileFilmstrip({ items }: { items: CardStackItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }
    if (isRightSwipe) {
      setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  // Auto-advance logic
  useEffect(() => {
    if (isHovered || !isInView) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [items.length, isHovered, isInView]);

  return (
    <div ref={ref} className="w-full flex flex-col items-center py-4 overflow-hidden">
      <div 
        className="w-full mx-auto flex items-center justify-center relative touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="flex items-center gap-2 px-2 h-[360px] w-full justify-center"
        >
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            const dist = Math.abs(idx - activeIdx);
            
            // Hide elements that are too far away to keep it clean
            if (dist > 2) return null;

            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  if (isActive && item.href) {
                    router.push(item.href);
                  } else {
                    setActiveIdx(idx);
                  }
                }}
                className="relative rounded-[1.5rem] overflow-hidden cursor-pointer shadow-xl shrink-0"
                animate={{
                  width: isActive ? 280 : 40,
                  height: isActive ? 360 : 280,
                  opacity: 1,
                  filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.4)",
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover absolute inset-0"
                    style={{ objectPosition: item.objectPosition || "center 15%" }}
                  />
                )}
                <div className="absolute inset-0 border border-white/10 rounded-[1.5rem] pointer-events-none" />
                
                <AnimatePresence>
                  {isActive && (
                    <>
                      {/* Top Right Arrow */}
                      {item.href && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md bg-white/10 text-white shadow-lg"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </motion.div>
                      )}

                      {/* Bottom Text */}
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent flex flex-col justify-end"
                      >
                        <h3 className="text-white text-2xl font-medium tracking-tight mb-1 leading-tight">{item.title}</h3>
                        <p className="!text-white opacity-90 leading-relaxed text-xs line-clamp-3">{item.description}</p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
