import { FileClock } from "lucide-react";

type ComingSoonTabProps = {
  label: string;
};

/** 아직 만들지 않은 탭 — 빈 화면 대신 무엇이 들어올지 알려준다. 모양은 진행 관리 빈 화면과 같다 */
export default function ComingSoonTab({ label }: ComingSoonTabProps) {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <FileClock className="size-5" strokeWidth={1.5} />
      </div>

      <p className="text-text-primary mt-5 text-sm font-semibold">{label}은 준비 중이에요</p>
      <p className="text-text-tertiary mt-1.5 max-w-[36ch] text-xs leading-relaxed break-keep">
        곧 회사 정보로 자료를 만들 수 있어요.
      </p>
    </div>
  );
}
