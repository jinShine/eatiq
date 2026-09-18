import { STORAGE_KEY } from "@constants/storage-key";

import { type AuthUser } from "./api/auth/auth.type";

/**
 * 매직링크 방식이라 refresh 토큰이 없다.
 * `/auth/me`도 없어서 로그인(verify) 응답의 사용자 정보를 함께 보관한다.
 */
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEY.LOCAL.TOKEN),

  setAccessToken: (accessToken: string) => {
    localStorage.setItem(STORAGE_KEY.LOCAL.TOKEN, accessToken);
  },

  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(STORAGE_KEY.LOCAL.AUTH_USER);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser: (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY.LOCAL.AUTH_USER, JSON.stringify(user));
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY.LOCAL.TOKEN);
    localStorage.removeItem(STORAGE_KEY.LOCAL.AUTH_USER);
  },
};
