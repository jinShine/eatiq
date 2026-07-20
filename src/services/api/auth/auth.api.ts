import axiosClientInstance from "@services/axios.client";
import { type ApiResponse } from "@services/types/common";

import { type SignInRequest, type SignInResponse } from "./auth.type";

const BASE_PATH = "/api/auth";

const ENDPOINTS = {
  signin: `${BASE_PATH}/login`,
  signup: `${BASE_PATH}/signup`,
  me: `${BASE_PATH}/me`,
  refresh: `${BASE_PATH}/refresh`,
  logout: `${BASE_PATH}/logout`,
};

export async function signIn(body: SignInRequest): Promise<SignInResponse> {
  const res = await axiosClientInstance.post<ApiResponse<SignInResponse>>(ENDPOINTS.signin, body);
  return res.data.data;
}
