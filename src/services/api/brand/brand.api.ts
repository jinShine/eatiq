import axiosClientInstance from "@services/axios.client";

import {
  type BrandCompletionResponse,
  type BrandCompletionScope,
  type BrandDetail,
  type BrandListResponse,
  type UpdateBrandBasicRequest,
  type UpdateBrandBasicResponse,
  type UpdateBrandCommissionRequest,
  type UpdateBrandCommissionResponse,
  type UpdateBrandContactRequest,
  type UpdateBrandContactResponse,
  type UpdateBrandContractPolicyRequest,
  type UpdateBrandContractPolicyResponse,
  type UpdateBrandContractRequest,
  type UpdateBrandContractResponse,
  type UpdateBrandFacilityReqRequest,
  type UpdateBrandFacilityReqResponse,
  type UpdateBrandIntroRequest,
  type UpdateBrandIntroResponse,
  type UpdateBrandLocationStandardRequest,
  type UpdateBrandLocationStandardResponse,
  type UpdateBrandSizeCriteriaRequest,
  type UpdateBrandSizeCriteriaResponse,
  type UpdateBrandStatusRequest,
  type UpdateBrandStatusResponse,
} from "./brand.type";

const BASE_PATH = "/api/workspace";

/** 브랜드 설정은 워크스페이스 하위 리소스다 */
const buildBrandPath = (workspaceId: string) => `${BASE_PATH}/${workspaceId}/brand`;

const ENDPOINTS = {
  list: `${BASE_PATH}/brand/list`,
  autocomplete: `${BASE_PATH}/brand/autocomplete`,
  detail: (brandId: string) => `${BASE_PATH}/brand/${brandId}`,

  basic: (workspaceId: string) => `${buildBrandPath(workspaceId)}/basic`,
  intro: (workspaceId: string) => `${buildBrandPath(workspaceId)}/intro`,
  status: (workspaceId: string) => `${buildBrandPath(workspaceId)}/status`,
  contact: (workspaceId: string) => `${buildBrandPath(workspaceId)}/contact`,
  contract: (workspaceId: string) => `${buildBrandPath(workspaceId)}/contract`,
  contractPolicy: (workspaceId: string) => `${buildBrandPath(workspaceId)}/contract-policy`,
  commission: (workspaceId: string) => `${buildBrandPath(workspaceId)}/commission`,
  locationStandard: (workspaceId: string) => `${buildBrandPath(workspaceId)}/location-standard`,
  sizeCriteria: (workspaceId: string) => `${buildBrandPath(workspaceId)}/size-criteria`,
  facilityReq: (workspaceId: string) => `${buildBrandPath(workspaceId)}/facility-req`,
  completion: (workspaceId: string, scope: BrandCompletionScope) =>
    `${buildBrandPath(workspaceId)}/completion/${scope}`,
};

/************************************
 * 조회
 ************************************/
export async function getBrandList(): Promise<BrandListResponse> {
  const res = await axiosClientInstance.get<BrandListResponse>(ENDPOINTS.list);
  return res.data;
}

export async function getBrandDetail(brandId: string): Promise<BrandDetail> {
  const res = await axiosClientInstance.get<BrandDetail>(ENDPOINTS.detail(brandId));
  return res.data;
}

/************************************
 * 섹션별 저장 — 이전 PATCH 전체 치환에서 섹션 PUT으로 바뀌었다
 ************************************/
export async function updateBrandBasic(workspaceId: string, body: UpdateBrandBasicRequest) {
  const res = await axiosClientInstance.put<UpdateBrandBasicResponse>(ENDPOINTS.basic(workspaceId), body);
  return res.data;
}

export async function updateBrandIntro(workspaceId: string, body: UpdateBrandIntroRequest) {
  const res = await axiosClientInstance.put<UpdateBrandIntroResponse>(ENDPOINTS.intro(workspaceId), body);
  return res.data;
}

export async function updateBrandStatus(workspaceId: string, body: UpdateBrandStatusRequest) {
  const res = await axiosClientInstance.put<UpdateBrandStatusResponse>(ENDPOINTS.status(workspaceId), body);
  return res.data;
}

export async function updateBrandContact(workspaceId: string, body: UpdateBrandContactRequest) {
  const res = await axiosClientInstance.put<UpdateBrandContactResponse>(ENDPOINTS.contact(workspaceId), body);
  return res.data;
}

export async function updateBrandContract(workspaceId: string, body: UpdateBrandContractRequest) {
  const res = await axiosClientInstance.put<UpdateBrandContractResponse>(ENDPOINTS.contract(workspaceId), body);
  return res.data;
}

export async function updateBrandContractPolicy(workspaceId: string, body: UpdateBrandContractPolicyRequest) {
  const res = await axiosClientInstance.put<UpdateBrandContractPolicyResponse>(
    ENDPOINTS.contractPolicy(workspaceId),
    body,
  );
  return res.data;
}

export async function updateBrandCommission(workspaceId: string, body: UpdateBrandCommissionRequest) {
  const res = await axiosClientInstance.put<UpdateBrandCommissionResponse>(ENDPOINTS.commission(workspaceId), body);
  return res.data;
}

export async function updateBrandLocationStandard(workspaceId: string, body: UpdateBrandLocationStandardRequest) {
  const res = await axiosClientInstance.put<UpdateBrandLocationStandardResponse>(
    ENDPOINTS.locationStandard(workspaceId),
    body,
  );
  return res.data;
}

export async function updateBrandSizeCriteria(workspaceId: string, body: UpdateBrandSizeCriteriaRequest) {
  const res = await axiosClientInstance.put<UpdateBrandSizeCriteriaResponse>(ENDPOINTS.sizeCriteria(workspaceId), body);
  return res.data;
}

export async function updateBrandFacilityReq(workspaceId: string, body: UpdateBrandFacilityReqRequest) {
  const res = await axiosClientInstance.put<UpdateBrandFacilityReqResponse>(ENDPOINTS.facilityReq(workspaceId), body);
  return res.data;
}

/************************************
 * 정보 완성 현황
 ************************************/
export async function getBrandCompletion(
  workspaceId: string,
  scope: BrandCompletionScope,
): Promise<BrandCompletionResponse> {
  const res = await axiosClientInstance.get<BrandCompletionResponse>(ENDPOINTS.completion(workspaceId, scope));
  return res.data;
}
