import { type StageCode } from "../../_components/progressOptions";
import { type RecordType } from "./recordOptions";

// TODO(API): 상세 조회 API가 준비되면 이 파일을 삭제하고 useQuery로 교체한다.

export type NextActionSummary = {
  id: string;
  dueDate: string;
  title: string;
  isDone: boolean;
};

/** 타임라인 카드 하나에 딸린 다음 액션 */
export type RecordNextAction = {
  title: string;
  dueDate: string;
  assignee: string;
  isDone: boolean;
};

/** 진행 기록 1건 */
export type ProgressRecord = {
  id: string;
  type: RecordType;
  occurredAt: string;
  content: string;
  nextAction: RecordNextAction | null; // 다음 액션이 없는 기록도 있다
};

export type ProgressDetail = {
  id: string;
  buyerName: string;
  countryCode: string;
  city: string;
  contractType: string;
  stage: StageCode;
  /** 단계를 마지막으로 자동 분류한 시각 */
  classifiedAt: string;
  /** 그렇게 분류한 근거 */
  classifiedReason: string;
  contactName: string;
  contactEmail: string;
  nextActions: NextActionSummary[];
  records: ProgressRecord[];
};

export const PROGRESS_DETAIL_MOCK: ProgressDetail = {
  id: "pg-01",
  buyerName: "Antenna Retail",
  countryCode: "JP",
  city: "도쿄",
  contractType: "master_franchise",
  stage: "meeting",
  classifiedAt: "2026-07-02 14:10",
  classifiedReason: "미팅 기록 존재",
  contactName: "Yuki Tanaka",
  contactEmail: "yuki.tanaka@antennaretail.jp",
  nextActions: [
    { id: "na-01", dueDate: "2026-07-14", title: "소개서 발송 후속 확인", isDone: false },
    { id: "na-02", dueDate: "2026-07-10", title: "매장 방문 일정 조율", isDone: false },
    { id: "na-03", dueDate: "2026-07-02", title: "로열티 조건 자료 요청", isDone: false },
    { id: "na-04", dueDate: "2026-07-20", title: "계약서 초안 검토 요청", isDone: false },
    { id: "na-05", dueDate: "2026-06-28", title: "1차 미팅 일정 확정", isDone: true },
    { id: "na-06", dueDate: "2026-06-24", title: "브랜드 소개 자료 발송", isDone: true },
    { id: "na-07", dueDate: "2026-06-20", title: "담당자 연락처 확보", isDone: true },
  ],
  records: [
    {
      id: "rc-01",
      type: "meeting",
      occurredAt: "2026-07-02",
      content:
        "Antenna Retail의 Yuki Tanaka님과 도쿄 신주쿠 지점을 방문해 미팅을 진행했습니다. 매장 컨디션 확인 및 로열티 조건 초안을 논의했습니다.",
      nextAction: {
        title: "로열티 조건 자료 요청",
        dueDate: "2026-07-02",
        assignee: "Yuki Tanaka",
        isDone: false,
      },
    },
    {
      id: "rc-02",
      type: "call",
      occurredAt: "2026-06-28",
      content: "Antenna Retail 본사 담당자와 전화 통화. 다음 매장 방문 일정과 시식 미팅 일자를 조율했습니다.",
      nextAction: {
        title: "매장 방문 일정 조율",
        dueDate: "2026-07-10",
        assignee: "Yuki Tanaka",
        isDone: false,
      },
    },
    {
      id: "rc-03",
      type: "email_out",
      occurredAt: "2026-06-20",
      content: "Antenna Retail의 Yuki Tanaka님에게 브랜드 소개 자료와 계약 조건 초안 문서를 메일로 발송했습니다.",
      nextAction: {
        title: "1차 미팅 일정 확정",
        dueDate: "2026-06-28",
        assignee: "Yuki Tanaka",
        isDone: true,
      },
    },
    {
      id: "rc-04",
      type: "email_in",
      occurredAt: "2026-06-14",
      content:
        "Antenna Retail 측에서 브랜드 자료 요청 메일을 보내왔습니다. 도쿄권 3개 지점 출점을 검토 중이라고 합니다.",
      nextAction: null,
    },
  ],
};
