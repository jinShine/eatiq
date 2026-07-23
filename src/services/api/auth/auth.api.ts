import axios from "axios";

import axiosClientInstance from "@services/axios.client";
import { type ApiResponse } from "@services/types/common";

import { ENV_CLIENT } from "@configs/env/client";

import { type AuthResponse, type SignInRequest, type TokenResponse } from "./auth.type";

const BASE_PATH = "/api/auth";

const ENDPOINTS = {
  signin: `${BASE_PATH}/login`,
  signup: `${BASE_PATH}/signup`,
  me: `${BASE_PATH}/me`,
  refresh: `${BASE_PATH}/refresh`,
  logout: `${BASE_PATH}/logout`,
};

export async function signIn(body: SignInRequest): Promise<AuthResponse> {
  const res = await axiosClientInstance.post<ApiResponse<AuthResponse>>(ENDPOINTS.signin, body);
  return res.data.data;
}

export async function refresh(refreshToken: string): Promise<TokenResponse> {
  const res = await axios.post<ApiResponse<TokenResponse>>(
    `${ENV_CLIENT.API_URL}${ENDPOINTS.refresh}`,
    { refreshToken }, //
  );
  return res.data.data;
}
