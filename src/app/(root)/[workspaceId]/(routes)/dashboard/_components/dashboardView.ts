import dayjs from "dayjs";

import { type BrandDashboardResponse } from "@services/api/brand/brand.type";
import { type BuyerDashboardResponse } from "@services/api/buyer/buyer.type";

import { type StageCode } from "../../progress/_components/progressOptions";

/************************************
 * 대시보드 뷰모델 — 브랜드·바이어 응답을 같은 모양으로 맞춘다(구성은 같고 필드 이름만 조금 다르다)
 ************************************/

export type RecommendedTaskView = {
  key: string;
  /** 항목이 속한 탭(브랜드) 또는 섹션(바이어) 이름 */
  groupLabel: string;
  title: string;
  /** 회사 정보 설정의 해당 칸으로 — 「#섹션/필드」를 회사 정보 설정이 읽는다(useJumpToHash) */
  href: string;
};

export type DashboardNextActionView = {
  id: string;
  crmId: string;
  companyName: string;
  /** 「오늘」 「D-3」 「D+2」 — 마감일이 없으면 null */
  dDayLabel: string | null;
  /** 남은 일수(지난 경우 음수) — 배지 색을 정한다 */
  dDayCount: number | null;
  title: string;
  description: string | null;
};

export type StageCountView = { stage: StageCode; count: number };

export type ActivityView = {
  id: string;
  title: string;
  message: string;
  /** 「오늘 14:23」 — 서버가 문구째 준다 */
  time: string;
  /** 진행 관리 건이면 그 상세로 이동한다 */
  crmId: string | null;
  /** 가리키는 진행 건이 지워졌는지 — 지워졌으면 이동하지 않는다 */
  isDeleted: boolean;
};

export type DashboardView = {
  rate: number;
  totalFields: number;
  completedFields: number;
  step: string;
  stepMessage: string;
  recommendedTasks: RecommendedTaskView[];
  nextActions: DashboardNextActionView[];
  stageCounts: StageCountView[];
  totalCount: number;
  activities: ActivityView[];
};

/** 대시보드 탭 키 → 회사 정보 설정 탭 키 (이름이 다르다) */
const BRAND_TAB_PARAM = { basic: "basic", visual: "visual", contract: "policy", commercial: "area" } as const;

/** 바이어 섹션 이름 — 회사 정보 설정 화면의 섹션 제목과 같다 */
const BUYER_SECTION_LABEL: Record<BuyerDashboardResponse["recommended_tasks"][number]["section_key"], string> = {
  buyer_basic: "회사 기본 정보",
  buyer_contract_policy: "계약 정책 정보",
  buyer_status: "현재 운영 현황",
  buyer_intro: "회사 소개",
  buyer_contact: "연락처",
};

const toStageCounts = (summary: BrandDashboardResponse["crm_stages"]): StageCountView[] => [
  { stage: "리드", count: summary.lead_count },
  { stage: "검토", count: summary.review_count },
  { stage: "접촉", count: summary.contact_count },
  { stage: "미팅", count: summary.meeting_count },
  { stage: "법무검토", count: summary.legal_review_count },
  { stage: "협상", count: summary.negotiation_count },
  { stage: "계약완료", count: summary.contract_completed_count },
  { stage: "보류", count: summary.on_hold_count },
];

/** 마감일까지 남은 일수(오늘 0, 지나면 음수) — 서버가 주지 않아(2026-10-22 응답에서 빠짐) 오늘 날짜로 계산한다 */
const toDDayCount = (deadline: string | null) =>
  deadline ? dayjs(deadline).startOf("day").diff(dayjs().startOf("day"), "day") : null;

/** 시안 표기: 「오늘」 · 「D-3」(남음) · 「D+2」(지남) */
const toDDayLabel = (count: number | null) => {
  if (count === null) {
    return null;
  }
  if (count === 0) {
    return "오늘";
  }
  return count > 0 ? `D-${count}` : `D+${-count}`;
};

const toActivity = (activity: BrandDashboardResponse["recent_activities"][number]): ActivityView => {
  // payload 스펙 타입이 비어 있어(Record<string, never>) 모양을 확인하고 꺼낸다
  const crmUid = (activity.payload as { crm_uid?: unknown } | null)?.crm_uid;
  return {
    id: String(activity.uid),
    title: activity.title,
    message: activity.message,
    time: activity.time,
    crmId: typeof crmUid === "number" ? String(crmUid) : null,
    isDeleted: activity.is_deleted,
  };
};

/** 다음 액션 — 브랜드·바이어 응답 구조가 같아졌다(2026-10-22) */
const toNextAction = (action: BrandDashboardResponse["next_actions"][number]): DashboardNextActionView => {
  const dDayCount = toDDayCount(action.deadline);
  return {
    // 진행 기록 안의 몇 번째 액션인지로 구분한다
    id: `${action.action_uid}-${action.idx}`,
    crmId: String(action.crm_uid),
    companyName: action.company_name,
    dDayLabel: toDDayLabel(dDayCount),
    dDayCount,
    title: action.title,
    description: action.memo,
  };
};

export const toBrandDashboardView = (workspaceId: string, response: BrandDashboardResponse): DashboardView => ({
  rate: response.completion_rate,
  totalFields: response.total_fields,
  completedFields: response.completed_fields,
  step: response.stage.step,
  stepMessage: response.stage.message,
  recommendedTasks: response.recommended_tasks.map(task => ({
    key: `${task.section_key}.${task.field_key}`,
    groupLabel: task.tab_title,
    title: task.title,
    href: `/${workspaceId}/company-settings?tab=${BRAND_TAB_PARAM[task.tab_key]}#${task.section_key}/${task.field_key}`,
  })),
  nextActions: response.next_actions.map(toNextAction),
  stageCounts: toStageCounts(response.crm_stages),
  totalCount: response.crm_stages.total_count,
  activities: response.recent_activities.map(toActivity),
});

export const toBuyerDashboardView = (workspaceId: string, response: BuyerDashboardResponse): DashboardView => ({
  rate: response.completion_rate,
  totalFields: response.total_fields,
  completedFields: response.completed_fields,
  step: response.stage.step,
  stepMessage: response.stage.message,
  recommendedTasks: response.recommended_tasks.map(task => ({
    key: `${task.section_key}.${task.field_key}`,
    groupLabel: BUYER_SECTION_LABEL[task.section_key],
    title: task.title,
    href: `/${workspaceId}/company-settings#${task.section_key}/${task.field_key}`,
  })),
  nextActions: response.next_actions.map(toNextAction),
  stageCounts: toStageCounts(response.crm_stages),
  totalCount: response.crm_stages.total_count,
  activities: response.recent_activities.map(toActivity),
});
