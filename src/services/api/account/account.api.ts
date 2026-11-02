import axiosClientInstance from "@services/axios.client";

import { type AccountMeResponse, type DeleteAccountResponse, type LogoutResponse } from "./account.type";

const BASE_PATH = "/api/account";

const ENDPOINTS = {
  me: `${BASE_PATH}/me`,
  delete: BASE_PATH,
  logout: `${BASE_PATH}/logout`,
};

/** 내 계정 정보 */
export async function getAccountMe(): Promise<AccountMeResponse> {
  const res = await axiosClientInstance.get<AccountMeResponse>(ENDPOINTS.me);
  return res.data;
}

/**
 * 계정 탈퇴.
 * 관리자로 있는 워크스페이스에 다른 멤버가 남아 있으면 400으로 거절된다.
 * 혼자 있는 워크스페이스는 함께 삭제된다.
 */
export async function deleteAccount(): Promise<DeleteAccountResponse> {
  const res = await axiosClientInstance.delete<DeleteAccountResponse>(ENDPOINTS.delete);
  return res.data;
}

export async function logout(): Promise<LogoutResponse> {
  const res = await axiosClientInstance.post<LogoutResponse>(ENDPOINTS.logout);
  return res.data;
}
