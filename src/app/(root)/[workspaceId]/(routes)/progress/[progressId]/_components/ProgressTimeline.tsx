import { Loader } from "lucide-react";

// TODO(다음 작업): 진행 기록 타임라인 카드(ProgressTimelineItem)를 붙인다.
export default function ProgressTimeline() {
  return (
    <div className="border-border flex flex-col items-center rounded-xl border border-dashed bg-white px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <Loader className="size-5" strokeWidth={1.5} />
      </div>
      <p className="text-text-secondary mt-5 text-sm font-semibold">진행중</p>
      <p className="text-text-tertiary mt-1.5 text-xs">진행 기록 타임라인은 준비 중이에요.</p>
    </div>
  );
}
