import { STAGE_META, type StageCode } from "../../_components/progressOptions";

// TODO(API): 상세 API가 나오면 서버 코드값에 맞춰 키를 교체한다.

/** 진행 기록 유형 */
export type RecordType = "meeting" | "call" | "email_out" | "email_in" | "visit";

type RecordTypeMeta = {
  label: string;
  /** 타임라인 카드 앞의 상태 점 색 */
  dotClassName: string;
};

export const RECORD_TYPE_META: Record<RecordType, RecordTypeMeta> = {
  meeting: { label: "미팅", dotClassName: "bg-[#0066cc]" },
  call: { label: "통화", dotClassName: "bg-[#059669]" },
  email_out: { label: "메일 발신", dotClassName: "bg-[#d97700]" },
  email_in: { label: "메일 수신", dotClassName: "bg-[#b45309]" },
  visit: { label: "방문", dotClassName: "bg-[#6b7280]" },
};

/** 현재 단계 Select 옵션 — 목록과 같은 코드값을 쓴다 */
export const STAGE_SELECT_OPTIONS = (Object.keys(STAGE_META) as StageCode[]).map(code => ({
  value: code,
  label: STAGE_META[code].label,
}));
