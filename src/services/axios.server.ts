import "server-only";

import { cookies } from "next/headers";

import axios from "axios";

import { STORAGE_KEY } from "@constants/storage-key";

import { ENV_CLIENT } from "@configs/env/client";

const axiosServerInstance = axios.create({
  baseURL: ENV_CLIENT.API_URL,
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
