import { type components, type operations } from "@services/openapi";

/************************************
 * 진행 관리(CRM) — 요청·응답 타입은 스펙에서 가져온다
 ************************************/

/** 목록 조회 파라미터 — 「전체」는 보내지 않는다 */
export type CrmListQuery = NonNullable<operations["GetCrmListController_execute"]["parameters"]["query"]>;
export type CrmListResponse = components["schemas"]["GetCrmListResponseDto"];
export type CrmListItem = components["schemas"]["CrmListItemDto"];
export type CrmFilterOptions = components["schemas"]["CrmFilterOptionsDto"];

/** 진행 단계 8개 — 값 집합은 스펙에서 파생한다 */
export type CrmStage = CrmListItem["current_stage"];

/** 관리 대상 추가 — 이름만 필수. 플랫폼 상대를 고르면 target_workspace_uid를 함께 보낸다 */
export type CreateCrmRequest = components["schemas"]["CreateCrmDto"];
export type CreateCrmResponse = components["schemas"]["CreateCrmResponseDto"];

export type DeleteCrmResponse = components["schemas"]["DeleteCrmResponseDto"];

/************************************
 * 상세 — 응답은 data로 한 번 감싸져 온다(목록과 다르다)
 ************************************/
export type CrmDetailResponse = components["schemas"]["GetCrmDetailResponseDto"];
export type CrmDetail = CrmDetailResponse["data"];
export type CrmActionRecord = components["schemas"]["CrmActionRecordDto"];
export type CrmNextActionSummary = components["schemas"]["NextActionSummaryDto"];
export type CrmActionFile = components["schemas"]["ActionFileDto"];

/** 진행 기록 유형 9개 — 단계 8개 + 「지정안됨」 */
export type CrmActionType = components["schemas"]["CreateCrmActionDto"]["action_type"];

export type UpdateCrmStageResponse = components["schemas"]["UpdateCrmStageResponseDto"];
export type UpdateCrmActionDoneResponse = components["schemas"]["UpdateCrmActionDoneResponseDto"];
export type DeleteCrmActionResponse = components["schemas"]["DeleteCrmActionResponseDto"];
