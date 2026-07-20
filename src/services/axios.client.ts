import axios, { type AxiosError } from "axios";

import { STORAGE_KEY } from "@constants/storage-key";

import { ENV_CLIENT } from "@configs/env/client";

import { type ApiErrorResponse } from "./types/common";

const axiosClientInstance = axios.create({
  baseURL: ENV_CLIENT.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // JWT를 Authorization 헤더로 보내므로 쿠키 전송(withCredentials) 불필요
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
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    return Promise.reject(error);
  },
);

export default axiosClientInstance;
