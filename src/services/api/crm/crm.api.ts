import axiosClientInstance from "@services/axios.client";

import {
  type CreateCrmRequest,
  type CreateCrmResponse,
  type CrmDetailResponse,
  type CrmListQuery,
  type CrmListResponse,
  type CrmStage,
  type DeleteCrmActionResponse,
  type DeleteCrmResponse,
  type UpdateCrmActionDoneResponse,
  type UpdateCrmStageResponse,
} from "./crm.type";

const BASE_PATH = "/api/crm";

const ENDPOINTS = {
  create: BASE_PATH,
  list: `${BASE_PATH}/list`,
  detail: (crmId: string) => `${BASE_PATH}/${crmId}`,
  stage: (crmId: string) => `${BASE_PATH}/${crmId}/stage`,
  action: (actionId: string) => `${BASE_PATH}/action/${actionId}`,
  actionDone: (actionId: string) => `${BASE_PATH}/action/${actionId}/done`,
};

/** 목록 — 필터 값이 없으면 보내지 않는다(서버는 없거나 "전체"면 전체 조회) */
export async function getCrmList(query: CrmListQuery): Promise<CrmListResponse> {
  const res = await axiosClientInstance.get<CrmListResponse>(ENDPOINTS.list, { params: query });
  return res.data;
}

/** 관리 대상 추가 — 대상 유형(바이어/브랜드)은 서버가 내 워크스페이스 유형의 반대로 정한다 */
export async function createCrm(body: CreateCrmRequest): Promise<CreateCrmResponse> {
  const res = await axiosClientInstance.post<CreateCrmResponse>(ENDPOINTS.create, body);
  return res.data;
}

/** 상세 — 기본 정보·현재 단계·다음 액션·진행 기록을 한 번에 받는다 */
export async function getCrmDetail(crmId: string): Promise<CrmDetailResponse> {
  const res = await axiosClientInstance.get<CrmDetailResponse>(ENDPOINTS.detail(crmId));
  return res.data;
}

/** 현재 단계 변경 — 어느 단계에서 어느 단계로든 옮길 수 있다 */
export async function updateCrmStage(crmId: string, stage: CrmStage): Promise<UpdateCrmStageResponse> {
  const res = await axiosClientInstance.patch<UpdateCrmStageResponse>(ENDPOINTS.stage(crmId), {
    current_stage: stage,
  });
  return res.data;
}

/** 다음 액션 완료 여부 — 토글이 아니라 값을 명시해 보낸다(두 번 눌려도 결과가 같게) */
export async function updateCrmActionDone(actionId: string, isDone: boolean): Promise<UpdateCrmActionDoneResponse> {
  const res = await axiosClientInstance.patch<UpdateCrmActionDoneResponse>(ENDPOINTS.actionDone(actionId), {
    is_done: isDone ? "Y" : "N",
  });
  return res.data;
}

/** 진행 기록·다음 액션 삭제(논리 삭제) */
export async function deleteCrmAction(actionId: string): Promise<DeleteCrmActionResponse> {
  const res = await axiosClientInstance.delete<DeleteCrmActionResponse>(ENDPOINTS.action(actionId));
  return res.data;
}

/** 관리 대상 삭제 — 딸린 진행 기록까지 함께 지워진다(논리 삭제) */
export async function deleteCrm(crmId: string): Promise<DeleteCrmResponse> {
  const res = await axiosClientInstance.delete<DeleteCrmResponse>(ENDPOINTS.detail(crmId));
  return res.data;
}
