import "server-only";

import { cookies } from "next/headers";

import axios from "axios";

import { STORAGE_KEY } from "@constants/storage-key";

import { ENV_CLIENT } from "@configs/env/client";

const axiosServerInstance = axios.create({
  // 서버에서는 상대 경로(/backend 프록시)를 쓸 수 없어 백엔드 주소로 바로 부른다 → next.config rewrites 참고
  baseURL: process.env.BACKEND_ORIGIN ?? ENV_CLIENT.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosServerInstance.interceptors.request.use(async config => {
  const cookieStore = await cookies();
  const token = cookieStore.get(STORAGE_KEY.LOCAL.TOKEN)?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosServerInstance;
