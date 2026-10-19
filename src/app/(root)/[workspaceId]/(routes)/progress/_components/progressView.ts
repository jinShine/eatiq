import { type CrmFilterOptions, type CrmListItem } from "@services/api/crm/crm.type";

import { type StageCode } from "./progressOptions";

/************************************
 * 진행 관리 목록의 뷰모델 — API 응답(DTO)을 화면까지 흘려보내지 않는다
 ************************************/

export type ProgressRow = {
  /** CRM 레코드 uid — 상세 경로에 쓴다 */
  id: string;
  /** 상대 회사 이름(바이어 또는 브랜드) */
  partnerName: string;
  /** 「일본 · 도쿄」 — 서버가 문구째 준다 */
  location: string;
  contractType: string | null;
  stage: StageCode;
  /** YYYY-MM-DD · 없으면 null */
  lastContactedAt: string | null;
  nextAction: string | null;
  /** YYYY-MM-DD · 없으면 null */
  nextActionDueAt: string | null;
};

const DATE_ONLY = /^(\d{4})[.-](\d{2})[.-](\d{2})$/;

/**
 * 서버 날짜를 YYYY-MM-DD로 맞춘다.
 * 스펙은 「YYYY.MM.DD」 또는 「YYYY-MM-DD」지만, 진행 기록의 action_time은 실제로
 * 「Fri Oct 16 2026 00:00:00 GMT+0000 (…)」 같은 Date 문자열로 온다(백엔드 요청, 2026-10-19).
 * 그 값은 UTC 자정이라 UTC 기준 날짜를 꺼낸다 — 현지 시간으로 바꾸면 시차에 따라 하루가 밀린다.
 */
export const toIsoDate = (value: string | null) => {
  if (!value) {
    return null;
  }
  const dateOnly = DATE_ONLY.exec(value.trim());
  if (dateOnly) {
    return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
};

export const toProgressRow = (item: CrmListItem): ProgressRow => ({
  id: String(item.crm_uid),
  partnerName: item.company_name,
  // 국가·도시를 비워 등록하면 서버가 「-」를 준다 — 빈 값으로 받아 다른 빈 칸과 같은 「—」로 그린다
  location: item.location.trim() === "-" ? "" : item.location.trim(),
  contractType: item.contract_type,
  stage: item.current_stage,
  lastContactedAt: toIsoDate(item.recent_contact_date),
  nextAction: item.next_action_title,
  nextActionDueAt: toIsoDate(item.next_action_due_date),
});

export type ProgressFilterOptions = Record<
  "countries" | "categories" | "contractTypes",
  { value: string; label: string }[]
>;

/** 「전체」는 서버도 주지만 FilterChip이 앞에 붙이므로 뺀다(값 "" = 필터 없음) */
const toChipOptions = (values: string[]) =>
  values.filter(value => value !== "전체").map(value => ({ value, label: value }));

/** 필터 선택지 — 진행 관리는 서버가 응답에 함께 내려준다(탐색 화면과 다른 점) */
export const toFilterOptions = (options: CrmFilterOptions | undefined): ProgressFilterOptions => ({
  countries: toChipOptions(options?.countries ?? []),
  categories: toChipOptions(options?.categories ?? []),
  contractTypes: toChipOptions(options?.contract_types ?? []),
});
