import { type components, type operations } from "@services/openapi";

/************************************
 * 상가 매물 탐색 — 요청·응답 타입은 스펙에서 가져온다
 ************************************/

/** 탐색 실행 — 국가·도시만 필수. 상세 조건(선호 상권·중요도)은 서버가 쓰지 않는다 */
export type ExecuteStoreSearchRequest = components["schemas"]["ExecuteStoreSearchDto"];
export type ExecuteStoreSearchResponse = components["schemas"]["ExecuteStoreSearchResponseDto"];

/** 목록 조회 파라미터 — 「전체」는 보내지 않는다 */
export type StoreSearchListQuery = NonNullable<
  operations["GetStoreSearchListController_getList"]["parameters"]["query"]
>;
export type StoreSearchListResponse = components["schemas"]["GetStoreSearchListResponseDto"];
export type StoreSearchListItem = components["schemas"]["StoreSearchListItemDto"];

/** 상세 — 탐색 조건 + 매물 목록. 응답은 data로 한 번 감싸져 온다(목록과 다르다) */
export type StoreSearchDetailResponse = components["schemas"]["GetStoreSearchDetailResponseDto"];
export type StoreSearchDetail = StoreSearchDetailResponse["data"];
export type StoreSearchCondition = components["schemas"]["StoreSearchConditionDto"];
export type StoreListing = components["schemas"]["StoreSearchDetailItemDto"];

/** 허용 층수 4개 — 값 집합은 스펙에서 파생한다 */
export type StoreSearchFloor = NonNullable<ExecuteStoreSearchRequest["target_floor"]>;
export type StoreSearchAreaUnit = ExecuteStoreSearchRequest["area_unit"];
