import axios, { type AxiosError } from "axios";

import ROUTES from "@constants/routes";

import { ENV_CLIENT } from "@configs/env/client";

import { tokenStorage } from "./token-storage";

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

/** 사용자에게 보여줄 수 없는 오류 대신 쓰는 문구 */
const FALLBACK_MESSAGE = {
  network: "네트워크 연결을 확인해주세요.",
  server: "서버에 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
  unknown: "요청을 처리할 수 없어요. 잠시 후 다시 시도해주세요.",
} as const;

// NestJS가 경로를 못 찾을 때 주는 기본 문구("Cannot PUT /api/...") — 사용자용이 아니다
const ROUTE_NOT_FOUND = /^Cannot (GET|POST|PUT|PATCH|DELETE) /;

/**
 * 화면에 띄울 문구를 고른다.
 * 서버가 보낸 4xx 문구(검증 실패 등)는 사람이 읽을 문구라 그대로 쓰고,
 * 응답 없음·5xx·경로 없음·문구 없음은 기술 문구라 안내 문구로 바꾼다.
 */
const toUserMessage = (error: AxiosError<{ message?: string | string[] }>) => {
  if (!error.response) {
    return FALLBACK_MESSAGE.network;
  }
  if (error.response.status >= 500) {
    return FALLBACK_MESSAGE.server;
  }
  const serverMessage = error.response.data?.message;
  const text = Array.isArray(serverMessage) ? serverMessage.join("\n") : serverMessage;
  if (!text || ROUTE_NOT_FOUND.test(text)) {
    return FALLBACK_MESSAGE.unknown;
  }
  return text;
};

// [응답] 401이면 토큰을 비우고 로그인 화면으로 보낸다.
// 매직링크 방식이라 refresh 토큰으로 재발급하는 흐름이 없다.
//
// 단 인증 화면(/auth/*)은 예외다. 매직링크 검증이 실패했을 때도 401이 오는데,
// 여기서 리다이렉트를 걸면 화면이 직접 띄우려던 안내(만료·재발송)를 덮어버린다.
axiosClientInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError<{ message?: string | string[] }>) => {
    // 화면에 띄울 문구를 error.message로 올린다. 그대로 두면 axios 기본 문구
    // ("Request failed with status code 400")가 뜬다. 요청 취소는 화면에 띄우지 않으니 건드리지 않는다
    if (!axios.isCancel(error)) {
      const originalMessage = error.message;
      // 새 에러로 감싸면 화면 쪽의 error.response·isAxiosError 판정이 깨진다. 원본의 문구만 바꾼다
      // eslint-disable-next-line no-param-reassign
      error.message = toUserMessage(error);
      if (process.env.NODE_ENV !== "production" && error.message !== originalMessage) {
        // 바꾸기 전 기술 문구는 디버깅용으로 콘솔에 남긴다
        console.warn("[api]", error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, {
          original: originalMessage,
          server: error.response?.data?.message,
        });
      }
    }

    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith(ROUTES.AUTH.ROOT)) {
        window.location.href = ROUTES.AUTH.SIGN_IN;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClientInstance;
