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

// [응답] 401이면 토큰을 비우고 로그인 화면으로 보낸다.
// 매직링크 방식이라 refresh 토큰으로 재발급하는 흐름이 없다.
//
// 단 인증 화면(/auth/*)은 예외다. 매직링크 검증이 실패했을 때도 401이 오는데,
// 여기서 리다이렉트를 걸면 화면이 직접 띄우려던 안내(만료·재발송)를 덮어버린다.
axiosClientInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError<{ message?: string | string[] }>) => {
    // 서버 문구를 error.message로 올린다. 그러지 않으면 화면에는 axios 기본 문구
    // ("Request failed with status code 400")가 뜬다. 검증 실패면 서버가 배열로 준다
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      // 새 에러로 감싸면 화면 쪽의 error.response·isAxiosError 판정이 깨진다. 원본의 문구만 바꾼다
      // eslint-disable-next-line no-param-reassign
      error.message = Array.isArray(serverMessage) ? serverMessage.join("\n") : serverMessage;
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
