import { STORAGE_KEY } from "@constants/storage-key";

/**
 * 로그인을 마친 뒤 돌아갈 주소 — 초대 링크, 또는 로그인이 필요해 튕겨 나온 화면.
 *
 * sessionStorage를 쓸 수 없다. 로그인을 시작한 탭과 달리
 * 메일의 로그인 링크는 대개 새 탭에서 열려, 저장한 탭과 읽는 탭이 다르다.
 * (가입 중 상태를 다루는 pendingSignupStorage는 verify→register가 한 탭
 *  안에서 끝나므로 sessionStorage로 충분하다.)
 *
 * 대신 오래 남지 않게 만료를 둔다. 로그인을 하다 그만둔 사람이 며칠 뒤
 * 그냥 로그인했는데 예전 화면으로 튀면 안 된다.
 */
const EXPIRES_MS = 60 * 60 * 1000;

type LoginReturn = {
  url: string;
  savedAt: number;
};

export const loginReturnStorage = {
  set: (url: string) => {
    if (typeof window === "undefined") {
      return;
    }
    const value: LoginReturn = { url, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY.LOCAL.LOGIN_RETURN, JSON.stringify(value));
  },

  /** 지금 보던 화면을 남긴다 — 첫 화면(/)은 어차피 워크스페이스로 보내므로 남기지 않는다 */
  saveCurrent: () => {
    if (typeof window === "undefined" || window.location.pathname === "/") {
      return;
    }
    loginReturnStorage.set(window.location.pathname + window.location.search);
  },

  /** 읽는 즉시 지운다. 남겨두면 다음 로그인에도 그 화면으로 보내진다 */
  take: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY.LOCAL.LOGIN_RETURN);
    localStorage.removeItem(STORAGE_KEY.LOCAL.LOGIN_RETURN);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as LoginReturn;
      const isExpired = Date.now() - parsed.savedAt > EXPIRES_MS;

      return isExpired || !parsed.url ? null : parsed.url;
    } catch {
      return null;
    }
  },
};
