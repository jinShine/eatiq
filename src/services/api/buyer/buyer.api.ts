import axiosClientInstance from "@services/axios.client";

import {
  type BuyerCompletionResponse,
  type BuyerDetailResponse,
  type BuyerListQuery,
  type BuyerListResponse,
  type UpdateBuyerBasicRequest,
  type UpdateBuyerBasicResponse,
  type UpdateBuyerContactRequest,
  type UpdateBuyerContactResponse,
  type UpdateBuyerContractPolicyRequest,
  type UpdateBuyerContractPolicyResponse,
  type UpdateBuyerIntroRequest,
  type UpdateBuyerIntroResponse,
  type UpdateBuyerStatusBody,
  type UpdateBuyerStatusResponse,
} from "./buyer.type";

const BASE_PATH = "/api/workspace";

/** 바이어 설정은 워크스페이스 하위 리소스다 */
const buildBuyerPath = (workspaceId: string) => `${BASE_PATH}/${workspaceId}/buyer`;

const ENDPOINTS = {
  list: `${BASE_PATH}/buyer/list`,
  detail: (buyerId: string) => `${BASE_PATH}/buyer/${buyerId}`,
  basic: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/basic`,
  status: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/status`,
  intro: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/intro`,
  contractPolicy: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/contract-policy`,
  contact: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/contact`,
  completion: (workspaceId: string) => `${buildBuyerPath(workspaceId)}/completion`,
};

/************************************
 * 바이어 탐색
 ************************************/
/** 목록 — 필터 값이 없으면 보내지 않는다(서버는 없거나 "전체"면 전체 조회) */
export async function getBuyerList(query: BuyerListQuery): Promise<BuyerListResponse> {
  const res = await axiosClientInstance.get<BuyerListResponse>(ENDPOINTS.list, { params: query });
  return res.data;
}

/** 상세 — 탐색 목록의 uid(바이어 식별자). 워크스페이스 id가 아니다 */
export async function getBuyerDetail(buyerId: string): Promise<BuyerDetailResponse> {
  const res = await axiosClientInstance.get<BuyerDetailResponse>(ENDPOINTS.detail(buyerId));
  return res.data;
}

/************************************
 * 회사 정보 설정 — 섹션 저장 (PUT, 전체 치환)
 ************************************/
export async function updateBuyerBasic(workspaceId: string, body: UpdateBuyerBasicRequest) {
  const res = await axiosClientInstance.put<UpdateBuyerBasicResponse>(ENDPOINTS.basic(workspaceId), body);
  return res.data;
}

/** 운영 현황 — 두 선택 항목은 비울 때 null을 보낸다 → UpdateBuyerStatusBody 주석 참고 */
export async function updateBuyerStatus(workspaceId: string, body: UpdateBuyerStatusBody) {
  const res = await axiosClientInstance.put<UpdateBuyerStatusResponse>(ENDPOINTS.status(workspaceId), body);
  return res.data;
}

export async function updateBuyerIntro(workspaceId: string, body: UpdateBuyerIntroRequest) {
  const res = await axiosClientInstance.put<UpdateBuyerIntroResponse>(ENDPOINTS.intro(workspaceId), body);
  return res.data;
}

export async function updateBuyerContractPolicy(workspaceId: string, body: UpdateBuyerContractPolicyRequest) {
  const res = await axiosClientInstance.put<UpdateBuyerContractPolicyResponse>(
    ENDPOINTS.contractPolicy(workspaceId),
    body,
  );
  return res.data;
}

export async function updateBuyerContact(workspaceId: string, body: UpdateBuyerContactRequest) {
  const res = await axiosClientInstance.put<UpdateBuyerContactResponse>(ENDPOINTS.contact(workspaceId), body);
  return res.data;
}

/************************************
 * 정보 완성 현황
 ************************************/
export async function getBuyerCompletion(workspaceId: string): Promise<BuyerCompletionResponse> {
  const res = await axiosClientInstance.get<BuyerCompletionResponse>(ENDPOINTS.completion(workspaceId));
  return res.data;
}
