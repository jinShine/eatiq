import { type CrmActionRecord, type CrmDetail, type CrmNextActionSummary } from "@services/api/crm/crm.type";

import { type StageCode } from "../../_components/progressOptions";
import { toIsoDate } from "../../_components/progressView";

/************************************
 * 진행 관리 상세의 뷰모델 — API 응답(DTO)을 화면까지 흘려보내지 않는다
 ************************************/

export type NextActionSummary = {
  id: string;
  title: string;
  /** YYYY-MM-DD · 없으면 null */
  dueDate: string | null;
  isDone: boolean;
  /** 「최신 순서대로」 정렬 기준 */
  createdAt: string;
};

export type RecordFile = {
  name: string;
  url: string;
};

/** 진행 기록 1건 */
export type ProgressRecord = {
  id: string;
  /** 진행 유형 — 서버 값 그대로(단계 8개 + 「지정안됨」) */
  type: string;
  title: string;
  /** YYYY-MM-DD · 없으면 null */
  occurredAt: string | null;
  /** 상대 / 미팅 대상자 */
  partnerName: string | null;
  content: string | null;
  files: RecordFile[];
};

export type ProgressDetailView = {
  id: string;
  partnerName: string;
  country: string | null;
  city: string | null;
  contractType: string | null;
  contactName: string | null;
  contactEmail: string | null;
  stage: StageCode;
  nextActions: NextActionSummary[];
  records: ProgressRecord[];
};

const STAGE_VALUES: StageCode[] = ["리드", "검토", "접촉", "미팅", "법무검토", "협상", "계약완료", "보류"];

/** 상세의 current_stage는 스펙상 문자열이다 — 8개 밖의 값이면 기본 단계(리드)로 본다 */
const toStage = (value: string): StageCode => STAGE_VALUES.find(stage => stage === value) ?? "리드";

const toNextActionSummary = (action: CrmNextActionSummary): NextActionSummary => ({
  id: String(action.uid),
  title: action.title,
  dueDate: toIsoDate(action.action_time),
  isDone: action.is_done === "Y",
  createdAt: action.created_time,
});

/** 첨부 파일 — 스펙 타입이 비어 있어(Record<string, never>) 모양을 확인하고 꺼낸다 */
const toRecordFiles = (fileList: CrmActionRecord["file_list"]): RecordFile[] =>
  (fileList ?? []).flatMap(file => {
    const { name, url } = file as { name?: unknown; url?: unknown };
    return typeof name === "string" && typeof url === "string" ? [{ name, url }] : [];
  });

const toProgressRecord = (record: CrmActionRecord): ProgressRecord => ({
  id: String(record.uid),
  type: record.action_type,
  title: record.title,
  occurredAt: toIsoDate(record.action_time),
  partnerName: record.partner_name,
  content: record.content,
  files: toRecordFiles(record.file_list),
});

export const toProgressDetailView = (detail: CrmDetail): ProgressDetailView => ({
  id: String(detail.crm.uid),
  partnerName: detail.crm.company_name,
  country: detail.crm.country,
  city: detail.crm.city,
  contractType: detail.crm.contract_type,
  contactName: detail.crm.contact_name,
  contactEmail: detail.crm.contact_email,
  stage: toStage(detail.current_stage),
  // 시안 설계 노트: 「최신 순서대로」 — 마지막에 등록한 액션이 위로
  // 한 번에 등록한 액션은 생성 시각이 같아 uid로 한 번 더 가른다(나중에 만든 것이 큰 uid)
  nextActions: detail.next_actions
    .map(toNextActionSummary)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(b.id) - Number(a.id)),
  records: detail.actions.map(toProgressRecord),
});
