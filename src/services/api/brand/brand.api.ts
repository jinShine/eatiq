import axiosClientInstance from "@services/axios.client";
import { type ApiResponse } from "@services/types/common";

import {
  type AreaCriteriaSaveResponse,
  type BasicSaveResponse,
  type BrandSettings,
  type ContactSaveResponse,
  type ContractSaveResponse,
  type CurrentBrandResponse,
  type FeeSaveResponse,
  type IntroSaveResponse,
  type OperationSaveResponse,
  type PageResponseBrandSummary,
  type PolicySaveResponse,
  type UpdateAreaCriteriaRequest,
  type UpdateBasicRequest,
  type UpdateContactRequest,
  type UpdateContractRequest,
  type UpdateFeeRequest,
  type UpdateIntroRequest,
  type UpdateOperationRequest,
  type UpdatePolicyRequest,
} from "./brand.type";

const BASE_PATH = "/api/brands";
const buildPath = (brandId: string) => `${BASE_PATH}/${brandId}`;

const ENDPOINTS = {
  list: BASE_PATH,
  current: `${BASE_PATH}/current`,
  settings: (brandId: string) => `${buildPath(brandId)}/settings`,
  basic: (brandId: string) => `${buildPath(brandId)}/basic`,
  intro: (brandId: string) => `${buildPath(brandId)}/intro`,
  operation: (brandId: string) => `${buildPath(brandId)}/operation`,
  contact: (brandId: string) => `${buildPath(brandId)}/contact`,
  contract: (brandId: string) => `${buildPath(brandId)}/contract`,
  policy: (brandId: string) => `${buildPath(brandId)}/policy`,
  fee: (brandId: string) => `${buildPath(brandId)}/fee`,
  areaCriteria: (brandId: string) => `${buildPath(brandId)}/area-criteria`,
};

export async function getBrands(): Promise<PageResponseBrandSummary> {
  const res = await axiosClientInstance.get<ApiResponse<PageResponseBrandSummary>>(ENDPOINTS.list);
  return res.data.data;
}

export async function getCurrentBrand(): Promise<CurrentBrandResponse> {
  const res = await axiosClientInstance.get<ApiResponse<CurrentBrandResponse>>(ENDPOINTS.current);
  return res.data.data;
}

/************************************
 * 브랜드 정보 설정
 ************************************/

export async function getBrandSettings(brandId: string): Promise<BrandSettings> {
  const res = await axiosClientInstance.get<ApiResponse<BrandSettings>>(ENDPOINTS.settings(brandId));
  return res.data.data;
}

export async function updateBrandBasic(brandId: string, body: UpdateBasicRequest): Promise<BasicSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<BasicSaveResponse>>(ENDPOINTS.basic(brandId), body);
  return res.data.data;
}

export async function updateBrandIntro(brandId: string, body: UpdateIntroRequest): Promise<IntroSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<IntroSaveResponse>>(ENDPOINTS.intro(brandId), body);
  return res.data.data;
}

export async function updateBrandOperation(
  brandId: string,
  body: UpdateOperationRequest,
): Promise<OperationSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<OperationSaveResponse>>(ENDPOINTS.operation(brandId), body);
  return res.data.data;
}

export async function updateBrandContact(brandId: string, body: UpdateContactRequest): Promise<ContactSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<ContactSaveResponse>>(ENDPOINTS.contact(brandId), body);
  return res.data.data;
}

/************************************
 * 계약 및 정책
 ************************************/

export async function updateBrandContract(brandId: string, body: UpdateContractRequest): Promise<ContractSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<ContractSaveResponse>>(ENDPOINTS.contract(brandId), body);
  return res.data.data;
}

export async function updateBrandPolicy(brandId: string, body: UpdatePolicyRequest): Promise<PolicySaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<PolicySaveResponse>>(ENDPOINTS.policy(brandId), body);
  return res.data.data;
}

export async function updateBrandFee(brandId: string, body: UpdateFeeRequest): Promise<FeeSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<FeeSaveResponse>>(ENDPOINTS.fee(brandId), body);
  return res.data.data;
}

/************************************
 * 상권분석 기준
 ************************************/

export async function updateBrandAreaCriteria(
  brandId: string,
  body: UpdateAreaCriteriaRequest,
): Promise<AreaCriteriaSaveResponse> {
  const res = await axiosClientInstance.patch<ApiResponse<AreaCriteriaSaveResponse>>(
    ENDPOINTS.areaCriteria(brandId),
    body,
  );
  return res.data.data;
}
