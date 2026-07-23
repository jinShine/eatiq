import { STORAGE_KEY } from "@constants/storage-key";

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEY.LOCAL.TOKEN),
  getRefreshToken: () => localStorage.getItem(STORAGE_KEY.LOCAL.REFRESH_TOKEN),

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEY.LOCAL.TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEY.LOCAL.REFRESH_TOKEN, refreshToken);
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY.LOCAL.TOKEN);
    localStorage.removeItem(STORAGE_KEY.LOCAL.REFRESH_TOKEN);
  },
};
