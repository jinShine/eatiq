"use client";

import { CheckIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@utils/shadcn";

import { JOURNEY_STAGES } from "./journeyStages";

type JourneyStepperProps = {
  currentIndex: number; // resolveStageIndex 결과
};

export default function JourneyStepper({ currentIndex }: JourneyStepperProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ol className="flex items-center gap-2">
      {JOURNEY_STAGES.map((stage, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === JOURNEY_STAGES.length - 1;

        return (
          <li key={stage.label} className="flex flex-1 items-center gap-2">
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.12, type: "spring", stiffness: 320, damping: 20 }}
              className="flex shrink-0 items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full transition-colors",
                  isDone ? "bg-primary text-primary-foreground" : "bg-secondary-background text-text-disabled",
                )}
              >
                {isDone ? (
                  <CheckIcon className="size-3" strokeWidth={3} />
                ) : (
                  <span className="text-[10px]">{index + 1}</span>
                )}
              </span>
              <span className={cn("text-xs font-semibold", isDone ? "text-text-primary" : "text-text-disabled")}>
                {stage.label}
              </span>
            </motion.div>

            {/* 연결선 — 다음 단계까지 채워지는 애니메이션 */}
            {!isLast && (
              <div className="bg-secondary-background relative h-0.5 flex-1 overflow-hidden rounded-full">
                <motion.div
                  initial={shouldReduceMotion ? false : { scaleX: 0 }}
                  animate={{ scaleX: index < currentIndex ? 1 : 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.2 + index * 0.12, duration: 0.5, ease: "easeOut" }}
                  className="bg-primary absolute inset-0 origin-left"
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
