import { type StageCode } from "./progressOptions";

export type ProgressRow = {
  id: string;
  buyerName: string;
  /** ISO 2자리 국가 코드 · 표시명은 옵션에서 조회한다 */
  countryCode: string;
  city: string;
  /** contract_type 코드값 */
  contractType: string;
  /** 업종 · 테이블에는 없고 필터에만 쓰인다 */
  category: string;
  stage: StageCode;
  /** ISO 날짜 · 없으면 null */
  lastContactedAt: string | null;
  nextAction: string | null;
  nextActionDueAt: string | null;
};

// 헤더와 행이 같은 그리드를 공유해야 컬럼이 어긋나지 않는다.
// 피그마는 헤더를 flex+gap, 행을 absolute 좌표로 그려 4px 어긋나 있어 grid로 통일했다.
export const PROGRESS_GRID_COLS = "grid-cols-[180px_160px_140px_110px_110px_146px_1fr_32px]";

/** 카드가 줄어들어도 컬럼이 뭉개지지 않도록 최소 폭을 잡고 가로 스크롤로 넘긴다 */
export const PROGRESS_MIN_WIDTH = "min-w-[1076px]";

export const PROGRESS_COLUMNS = [
  { key: "buyerName", label: "바이어 이름" },
  { key: "location", label: "국가 및 도시" },
  { key: "contractType", label: "계약 방식" },
  { key: "stage", label: "현재 단계" },
  { key: "lastContactedAt", label: "최근 접점일" },
  { key: "nextAction", label: "다음 액션" },
  { key: "nextActionDueAt", label: "액션 기한일" },
] as const;
