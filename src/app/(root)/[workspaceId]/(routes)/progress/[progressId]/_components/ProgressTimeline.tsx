"use client";

import { FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import ProgressTimelineItem from "./ProgressTimelineItem";
import { type ProgressRecord } from "./progressDetailMock";

type ProgressTimelineProps = {
  records: ProgressRecord[];
  onToggleAction: (recordId: string, isDone: boolean) => void;
};

export default function ProgressTimeline({ records, onToggleAction }: ProgressTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  if (records.length === 0) {
    return (
      <div className="border-border flex flex-col items-center rounded-xl border border-dashed bg-white px-6 py-20 text-center">
        <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
          <FileText className="size-5" strokeWidth={1.5} />
        </div>
        <p className="text-text-secondary mt-5 text-sm font-semibold">아직 진행 기록이 없어요</p>
        <p className="text-text-tertiary mt-1.5 text-xs">
          미팅·통화·메일 내용을 기록해두면 다음에 할 일을 놓치지 않아요.
        </p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {records.map((record, index) => (
        <motion.li
          key={record.id}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: shouldReduceMotion ? 0 : index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProgressTimelineItem record={record} onToggleAction={onToggleAction} />
        </motion.li>
      ))}
    </ol>
  );
}
