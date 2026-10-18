import axiosClientInstance from "@services/axios.client";

import {
  type CreateCrmRequest,
  type CreateCrmResponse,
  type CrmListQuery,
  type CrmListResponse,
  type DeleteCrmResponse,
} from "./crm.type";

const BASE_PATH = "/api/crm";

const ENDPOINTS = {
  create: BASE_PATH,
  list: `${BASE_PATH}/list`,
  detail: (crmId: string) => `${BASE_PATH}/${crmId}`,
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

/** 관리 대상 삭제 — 딸린 진행 기록까지 함께 지워진다(논리 삭제) */
export async function deleteCrm(crmId: string): Promise<DeleteCrmResponse> {
  const res = await axiosClientInstance.delete<DeleteCrmResponse>(ENDPOINTS.detail(crmId));
  return res.data;
}
