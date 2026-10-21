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

/** 진행 기록 유형 3개 — 미팅 · 통화 · 메일 (2026-10-20 단계와 분리) */
export type CrmActionType = components["schemas"]["CreateCrmActionDto"]["action_type"];

/** 진행 기록 안의 다음 액션 — 기록마다 배열로 저장되고 idx로 구분한다 */
export type CrmNextActionItem = components["schemas"]["NextActionItemDto"];
/** 수정할 때 보내는 다음 액션 — idx가 있으면 그 항목을 고치고, 없으면 새로 만든다. 보낸 배열로 통째로 바뀐다 */
export type UpdateCrmNextActionItem = components["schemas"]["UpdateNextActionItemDto"];

/** 진행 기록 등록 — 기록 1건 + 다음 액션 여러 건을 한 번에. 기록은 완료(Y), 다음 액션은 미완료(N)로 저장된다 */
export type CreateCrmActionRequest = components["schemas"]["CreateCrmActionDto"];
export type CreateCrmActionResponse = components["schemas"]["CreateCrmActionResponseDto"];

/** 진행 기록 수정 — 보낸 필드만 바뀐다(부분 수정) */
export type UpdateCrmActionRequest = components["schemas"]["UpdateCrmActionDto"];
export type UpdateCrmActionResponse = components["schemas"]["UpdateCrmActionResponseDto"];

export type UpdateCrmStageResponse = components["schemas"]["UpdateCrmStageResponseDto"];
export type UpdateCrmNextActionDoneResponse = components["schemas"]["UpdateCrmNextActionDoneResponseDto"];
export type DeleteCrmActionResponse = components["schemas"]["DeleteCrmActionResponseDto"];
