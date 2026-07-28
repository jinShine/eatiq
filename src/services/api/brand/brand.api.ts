import axiosClientInstance from "@services/axios.client";
import { type ApiResponse } from "@services/types/common";

import { type CurrentBrandResponse, type PageResponseBrandSummary } from "./brand.type";

const BASE_PATH = "/api/brands";

const ENDPOINTS = {
  list: BASE_PATH,
  current: `${BASE_PATH}/current`,
};

export async function getBrands(): Promise<PageResponseBrandSummary> {
  const res = await axiosClientInstance.get<ApiResponse<PageResponseBrandSummary>>(ENDPOINTS.list);
  return res.data.data;
}

export async function getCurrentBrand(): Promise<CurrentBrandResponse> {
  const res = await axiosClientInstance.get<ApiResponse<CurrentBrandResponse>>(ENDPOINTS.current);
  return res.data.data;
}
