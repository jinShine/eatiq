import { STORAGE_KEY } from "@constants/storage-key";

/**
 * 로그인을 마친 뒤 돌아갈 초대 링크.
 *
 * sessionStorage를 쓸 수 없다. 초대 링크를 연 탭에서 로그인을 시작해도
 * 메일의 로그인 링크는 대개 새 탭에서 열려, 저장한 탭과 읽는 탭이 다르다.
 * (가입 중 상태를 다루는 pendingSignupStorage는 verify→register가 한 탭
 *  안에서 끝나므로 sessionStorage로 충분하다.)
 *
 * 대신 오래 남지 않게 만료를 둔다. 초대를 받다 그만둔 사람이 며칠 뒤
 * 그냥 로그인했는데 초대 화면으로 튀면 안 된다.
 */
const EXPIRES_MS = 60 * 60 * 1000;

type InviteReturn = {
  url: string;
  savedAt: number;
};

export const inviteReturnStorage = {
  set: (url: string) => {
    if (typeof window === "undefined") {
      return;
    }
    const value: InviteReturn = { url, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY.LOCAL.INVITE_RETURN, JSON.stringify(value));
  },

  /** 읽는 즉시 지운다. 남겨두면 다음 로그인에도 초대 화면으로 보내진다 */
  take: (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY.LOCAL.INVITE_RETURN);
    localStorage.removeItem(STORAGE_KEY.LOCAL.INVITE_RETURN);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as InviteReturn;
      const isExpired = Date.now() - parsed.savedAt > EXPIRES_MS;

      return isExpired || !parsed.url ? null : parsed.url;
    } catch {
      return null;
    }
  },
};
