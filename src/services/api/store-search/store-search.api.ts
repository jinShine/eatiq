import axiosClientInstance from "@services/axios.client";

import {
  type ExecuteStoreSearchRequest,
  type ExecuteStoreSearchResponse,
  type StoreSearchDetailResponse,
  type StoreSearchListQuery,
  type StoreSearchListResponse,
} from "./store-search.type";

const BASE_PATH = "/api/store-search";

const ENDPOINTS = {
  execute: BASE_PATH,
  list: `${BASE_PATH}/list`,
  detail: (searchId: string) => `${BASE_PATH}/detail/${searchId}`,
};

/** 탐색 실행 — 미리 모아 둔 매물에서 바로 골라 응답한다(진행 중 상태 없이 「분석완료」로 온다) */
export async function executeStoreSearch(body: ExecuteStoreSearchRequest): Promise<ExecuteStoreSearchResponse> {
  const res = await axiosClientInstance.post<ExecuteStoreSearchResponse>(ENDPOINTS.execute, body);
  return res.data;
}

/** 목록 — 필터 값이 없으면 보내지 않는다(서버는 없거나 "전체"면 전체 조회) */
export async function getStoreSearchList(query: StoreSearchListQuery): Promise<StoreSearchListResponse> {
  const res = await axiosClientInstance.get<StoreSearchListResponse>(ENDPOINTS.list, { params: query });
  return res.data;
}

/** 상세 — 탐색 조건과 매물 목록(최대 10건)을 한 번에 받는다 */
export async function getStoreSearchDetail(searchId: string): Promise<StoreSearchDetailResponse> {
  const res = await axiosClientInstance.get<StoreSearchDetailResponse>(ENDPOINTS.detail(searchId));
  return res.data;
}
