// 헤더와 행이 같은 그리드를 공유해야 컬럼이 어긋나지 않는다 (피그마 961:12290 열 폭 156·142·122·200)
export const STORE_SEARCH_GRID_COLS = "grid-cols-[156px_142px_122px_minmax(200px,1fr)_auto]";

/** 카드가 줄어들어도 컬럼이 뭉개지지 않도록 최소 폭을 잡고 가로 스크롤로 넘긴다 */
export const STORE_SEARCH_MIN_WIDTH = "min-w-[780px]";

export const STORE_SEARCH_COLUMNS = [
  { key: "searchedAt", label: "탐색 일시" },
  { key: "location", label: "국가 및 도시" },
  { key: "area", label: "기준 평형" },
  { key: "rent", label: "기준 임대료" },
] as const;
