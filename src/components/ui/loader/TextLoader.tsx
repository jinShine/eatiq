"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@utils/shadcn";

type LoadingProps = {
  messages: string[];
  interval?: number;
  dotCount?: number;
  className?: string;
};

export default function TextLoader({ messages, interval = 2000, dotCount = 3, className }: LoadingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, interval);
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= dotCount ? "" : `${prev}.`));
    }, 500);
    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, [messages.length, interval, dotCount]);

  return <LoadingText text={messages[currentIndex]} dots={dots} className={className} />;
}

/**
 * Helpers
 */

type LoadingTextProps = {
  text: string;
  dots: string;
  className?: string;
};

function LoadingText({ text, dots, className }: LoadingTextProps) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn("text-lg font-medium w-full", className)}
        >
          {text}
          {dots}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
