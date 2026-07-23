import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import ROUTES from "@constants/routes";

import { ENV_CLIENT } from "@configs/env/client";

import { refresh } from "./api/auth/auth.api";
import { tokenStorage } from "./token-storage";
import { type ApiErrorResponse } from "./types/common";

const axiosClientInstance = axios.create({
  baseURL: ENV_CLIENT.API_URL,
  headers: { "Content-Type": "application/json" },
});

// [요청] 액세스 토큰 자동 첨부
axiosClientInstance.interceptors.request.use(config => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── refresh 큐잉 상태 ──
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const subscribe = (cb: (token: string | null) => void) => pendingQueue.push(cb);
const publish = (token: string | null) => {
  pendingQueue.forEach(cb => cb(token));
  pendingQueue = [];
};

// _retry 커스텀 플래그용 타입
type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// [응답] 성공은 통과, 401(만료)이면 refresh 후 재시도
axiosClientInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;

    // 액세스 토큰 만료 + 아직 재시도 안 한 요청만
    if (status === 401 && errorCode === "AUTH_TOKEN_EXPIRED" && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 다른 요청이 refresh 중 → 큐에서 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribe(token => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClientInstance(originalRequest));
          });
        });
      }

      // 첫 401 → 실제 refresh 수행
      isRefreshing = true;
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw error;
        }

        const tokens = await refresh(refreshToken);
        if (!tokens.accessToken || !tokens.refreshToken) {
          throw error;
        }

        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        publish(tokens.accessToken); // 대기 중이던 요청들 재개

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosClientInstance(originalRequest);
      } catch (refreshError) {
        publish(null); // 대기 요청 모두 실패 처리
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.AUTH.SIGN_IN;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClientInstance;
