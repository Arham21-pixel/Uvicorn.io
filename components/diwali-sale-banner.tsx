"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function DiwaliSaleBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endDate = new Date("2025-10-25T23:59:59");
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white"
      >
        {/* Diya/Lamp Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-10 text-6xl">🪔</div>
          <div className="absolute top-1 right-20 text-5xl">✨</div>
          <div className="absolute bottom-2 left-1/4 text-4xl">🎇</div>
          <div className="absolute top-3 right-1/3 text-5xl">🪔</div>
          <div className="absolute bottom-1 right-10 text-6xl">✨</div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl"
              >
                🪔
              </motion.div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <span className="drop-shadow-lg">🎊 Diwali Mega Sale! 🎊</span>
                </h2>
                <p className="text-sm md:text-base font-medium drop-shadow">
                  October 20th - 25th | Up to 50% OFF on Electronics! 🎉
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium hidden md:block">Ends in:</span>
              <div className="flex gap-2">
                <TimeBox value={timeLeft.days} label="Days" />
                <TimeBox value={timeLeft.hours} label="Hrs" />
                <TimeBox value={timeLeft.minutes} label="Min" />
                <TimeBox value={timeLeft.seconds} label="Sec" />
              </div>
            </div>
          </div>
        </div>

        {/* Sparkle Animation */}
        <motion.div
          animate={{
            x: [-10, 10, -10],
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-2 left-1/2 text-2xl"
        >
          ✨
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[50px] text-center">
      <div className="text-xl md:text-2xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] md:text-xs font-medium">{label}</div>
    </div>
  );
}
