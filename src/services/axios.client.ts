import axios, { type AxiosError } from "axios";

import { STORAGE_KEY } from "@constants/storage-key";

import { ENV_CLIENT } from "@configs/env/client";

import { setAuthCookieAction } from "./actions/auth.action";

const axiosClientInstance = axios.create({
  baseURL: ENV_CLIENT.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClientInstance.interceptors.request.use(config => {
  const token = localStorage.getItem(STORAGE_KEY.LOCAL.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClientInstance.interceptors.response.use(
  async response => {
    /**
     * application/octet-stream 응답은 파일 다운로드이므로 그대로 반환합니다.
     */
    const contentType = String(response.headers["content-type"] || response.headers["Content-Type"] || "");
    if (contentType.includes("application/octet-stream")) {
      return response;
    }

    /**
     * 서버에서 받은 응답에서 토큰을 추출하여 저장합니다.
     * Token이 Expired시, 회원가입, 로그인 시 userAccessToken이 내려옵니다.
     */

    const { userAccessToken } = response.data?.meta || {};

    if (userAccessToken === null) {
      localStorage.removeItem(STORAGE_KEY.LOCAL.TOKEN);
    }

    if (userAccessToken) {
      localStorage.setItem(STORAGE_KEY.LOCAL.TOKEN, userAccessToken);
      await setAuthCookieAction(userAccessToken);
    }

    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (!response) {
      // return Promise.reject<FSErrorResponseType>(error.response?.data);
      return Promise.reject(error);
    }

    // const { data, status, config } = response;
    // const {
    //   error: { errorCode },
    // } = data as FSErrorResponseType;

    // switch (errorCode) {
    //   case "UNAUTHORIZED":
    //     Toast.error("로그인이 필요합니다.");

    //     setTimeout(() => {
    //       window.location.replace(ROUTES.AUTH.SIGN_IN);
    //     }, 1000);
    //     break;

    //   case "INTERNAL_ERROR":
    //     Toast.error("잠시 후 다시 시도해 주세요.");
    //     break;

    //   default:
    //     break;
    // }

    // return Promise.reject<FSErrorResponseType>(error.response?.data);
    return Promise.reject(error);
  },
);

export default axiosClientInstance;
