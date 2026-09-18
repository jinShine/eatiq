import axiosClientInstance from "@services/axios.client";

import {
  type LogoutResponse,
  type RegisterRequest,
  type RegisterResponse,
  type SendMagicLinkRequest,
  type SendMagicLinkResponse,
  type VerifyMagicLinkRequest,
  type VerifyMagicLinkResponse,
} from "./auth.type";

const BASE_PATH = "/api/auth";

const ENDPOINTS = {
  magicLink: `${BASE_PATH}/magic-link`,
  verify: `${BASE_PATH}/verify`,
  register: `${BASE_PATH}/register`,
  logout: `${BASE_PATH}/logout`,
};

// 새 백엔드는 공통 래퍼(ApiResponse) 없이 DTO를 그대로 내려준다

/** 이메일로 로그인 링크를 보낸다 */
export async function sendMagicLink(body: SendMagicLinkRequest): Promise<SendMagicLinkResponse> {
  const res = await axiosClientInstance.post<SendMagicLinkResponse>(ENDPOINTS.magicLink, body);
  return res.data;
}

/** 메일로 받은 토큰을 검증하고 access_token을 받는다 */
export async function verifyMagicLink(body: VerifyMagicLinkRequest): Promise<VerifyMagicLinkResponse> {
  const res = await axiosClientInstance.post<VerifyMagicLinkResponse>(ENDPOINTS.verify, body);
  return res.data;
}

export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  const res = await axiosClientInstance.post<RegisterResponse>(ENDPOINTS.register, body);
  return res.data;
}

export async function logout(): Promise<LogoutResponse> {
  const res = await axiosClientInstance.post<LogoutResponse>(ENDPOINTS.logout);
  return res.data;
}
