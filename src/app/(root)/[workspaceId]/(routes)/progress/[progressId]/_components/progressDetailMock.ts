import { type StageCode } from "../../_components/progressOptions";

// TODO(API): 상세 조회 API가 준비되면 이 파일을 삭제하고 useQuery로 교체한다.

export type NextActionSummary = {
  id: string;
  dueDate: string;
  title: string;
  isDone: boolean;
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
};
