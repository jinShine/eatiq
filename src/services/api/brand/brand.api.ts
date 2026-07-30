import axiosClientInstance from "@services/axios.client";
import { type ApiResponse } from "@services/types/common";

import {
  type BasicSaveResponse,
  type BrandSettings,
  type ContactSaveResponse,
  type CurrentBrandResponse,
  type IntroSaveResponse,
  type OperationSaveResponse,
  type PageResponseBrandSummary,
  type UpdateBasicRequest,
  type UpdateContactRequest,
  type UpdateIntroRequest,
  type UpdateOperationRequest,
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
