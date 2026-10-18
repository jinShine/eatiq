import dayjs from "dayjs";

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

/**
 * 서버 날짜는 「YYYY.MM.DD」 또는 「YYYY-MM-DD」로 온다(스펙).
 * 점 구분은 브라우저마다 Date 해석이 달라 ISO 형식으로 맞춘다.
 */
const toIsoDate = (value: string | null) => {
  if (!value) {
    return null;
  }
  const normalized = value.replaceAll(".", "-");
  return dayjs(normalized).isValid() ? normalized : null;
};

export const toProgressRow = (item: CrmListItem): ProgressRow => ({
  id: String(item.crm_uid),
  partnerName: item.company_name,
  // 수기 등록에서 국가·도시를 비우면 빈 문구가 올 수 있다
  location: item.location.trim(),
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
