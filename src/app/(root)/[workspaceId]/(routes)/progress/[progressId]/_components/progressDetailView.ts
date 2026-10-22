import { type CrmActionRecord, type CrmDetail, type CrmNextActionItem } from "@services/api/crm/crm.type";

import { type StageCode } from "../../_components/progressOptions";
import { toIsoDate } from "../../_components/progressView";

/************************************
 * 진행 관리 상세의 뷰모델 — API 응답(DTO)을 화면까지 흘려보내지 않는다
 ************************************/

/** 진행 기록 안의 다음 액션 1건 */
export type RecordNextAction = {
  /** 기록 안에서의 고유 번호 — 수정·완료·삭제할 때 쓴다(한 번 정해지면 바뀌지 않는다) */
  idx: number;
  title: string;
  /** 마감일 YYYY-MM-DD · 없으면 null */
  dueDate: string | null;
  /** 담당자 */
  assignee: string | null;
  memo: string | null;
  isDone: boolean;
};

/** 왼쪽 「다음 액션 요약」의 한 줄 — 어느 기록의 몇 번 액션인지 함께 든다 */
export type NextActionSummary = RecordNextAction & {
  /** 화면 key — 「기록 uid-idx」 */
  id: string;
  /** 진행 기록 uid */
  actionId: string;
};

/** 진행 기록 첨부 파일 — 수정할 때 그대로 되돌려 보내야 해서(목록 통째 대체) 크기·형식도 들고 있는다 */
export type RecordFile = {
  name: string;
  url: string;
  /** 바이트 · 없으면 null */
  size: number | null;
  mimetype: string | null;
};

/** 진행 기록 1건 */
export type ProgressRecord = {
  id: string;
  /** 진행 유형 — 서버 값 그대로(미팅 · 통화 · 메일) */
  type: string;
  title: string;
  /** YYYY-MM-DD · 없으면 null */
  occurredAt: string | null;
  /** 상대 / 미팅 대상자 */
  partnerName: string | null;
  content: string | null;
  files: RecordFile[];
  /** 이 기록과 함께 등록한 다음 액션 */
  nextActions: RecordNextAction[];
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

const toRecordNextAction = (item: CrmNextActionItem): RecordNextAction => ({
  idx: item.idx,
  title: item.title,
  // 값이 없는 칸은 응답에서 키째 빠진다 — 없으면 null로 받는다
  dueDate: toIsoDate(item.deadline ?? null),
  assignee: item.partner_name ?? null,
  memo: item.memo ?? null,
  isDone: item.is_done === "Y",
});

const toRecordFiles = (fileList: CrmActionRecord["file_list"]): RecordFile[] =>
  (fileList ?? []).map(file => ({
    name: file.name,
    url: file.url,
    size: file.size ?? null,
    mimetype: file.mimetype ?? null,
  }));

const toProgressRecord = (record: CrmActionRecord): ProgressRecord => ({
  id: String(record.uid),
  type: record.action_type,
  title: record.title,
  occurredAt: toIsoDate(record.action_date),
  partnerName: record.partner_name,
  content: record.content,
  files: toRecordFiles(record.file_list),
  nextActions: (record.next_actions ?? []).map(toRecordNextAction),
});

/**
 * 다음 액션 요약 — 기록 안의 다음 액션을 모아 만든다.
 * 서버도 요약(next_actions, 미완료만)을 주지만, 방금 완료한 액션을 1초 동안 완료 모양으로 남기려면
 * 완료 여부가 함께 있어야 해서 기록에서 직접 모은다(완료 토글은 기록 쪽 캐시를 낙관적으로 바꾼다).
 * 순서: 최근 기록이 먼저(서버가 최신순으로 준다), 같은 기록 안에서는 나중에 추가한 액션(큰 idx)이 먼저
 */
const toNextActionSummaries = (records: ProgressRecord[]): NextActionSummary[] =>
  records.flatMap(record =>
    [...record.nextActions]
      .sort((a, b) => b.idx - a.idx)
      .map(item => ({ ...item, id: `${record.id}-${item.idx}`, actionId: record.id })),
  );

export const toProgressDetailView = (detail: CrmDetail): ProgressDetailView => {
  const records = detail.actions.map(toProgressRecord);
  return {
    id: String(detail.crm.uid),
    partnerName: detail.crm.company_name,
    country: detail.crm.country,
    city: detail.crm.city,
    contractType: detail.crm.contract_type,
    contactName: detail.crm.contact_name,
    contactEmail: detail.crm.contact_email,
    stage: toStage(detail.current_stage),
    nextActions: toNextActionSummaries(records),
    records,
  };
};
