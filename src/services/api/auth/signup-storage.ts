import { STORAGE_KEY } from "@constants/storage-key";

/**
 * 가입 진행 중 상태.
 *
 * 매직링크 토큰은 1회용이라 verify를 호출하는 순간 소모된다.
 * 신규 회원은 verify 뒤에 이름을 입력해야 가입이 끝나는데,
 * 그 사이에 새로고침하면 verify를 다시 부를 수 없어 가입을 이어갈 수 없다.
 *
 * verify가 register용 토큰을 따로 내주므로, 그 값을 들고 있다가
 * 새로고침 시 verify를 건너뛰고 바로 가입을 마치게 한다.
 *
 * sessionStorage를 쓰는 이유는 탭을 닫으면 사라져야 하기 때문이다.
 * 중단된 가입 상태가 영구히 남을 이유가 없고, 공용 PC에서도 안전하다.
 */
export type PendingSignup = {
  email: string;
  /** register에 넘길 토큰 — 메일 링크의 토큰과 다른 값이다 */
  token: string;
};

export const pendingSignupStorage = {
  /** 저장된 이메일과 요청한 이메일이 다르면 무시한다 (다른 계정의 잔재) */
  get: (email: string): PendingSignup | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY.SESSION.PENDING_SIGNUP);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as PendingSignup;
      return parsed.email === email && parsed.token ? parsed : null;
    } catch {
      return null;
    }
  },

  set: (pending: PendingSignup) => {
    sessionStorage.setItem(STORAGE_KEY.SESSION.PENDING_SIGNUP, JSON.stringify(pending));
  },

  clear: () => {
    sessionStorage.removeItem(STORAGE_KEY.SESSION.PENDING_SIGNUP);
  },
};
