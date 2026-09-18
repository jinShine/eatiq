import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { tokenStorage } from "@services/token-storage";

import { IS_MOCK, mockResolve } from "../mock";
import { sendMagicLink, verifyMagicLink } from "./auth.api";
import { mockAuthUser, mockVerifyResponse } from "./auth.mock";
import { type AuthUser } from "./auth.type";

export const authKeys = {
  all: ["auth"] as const,
};

/** 이메일로 로그인 링크 발송 */
export function useSendMagicLinkMutation() {
  return useMutation({
    mutationFn: IS_MOCK
      ? () => mockResolve({ message: "로그인 링크를 보냈어요.", email: mockVerifyResponse.email })
      : sendMagicLink,
  });
}

/** 메일로 받은 토큰 검증 → access_token 수령 */
export function useVerifyMagicLinkMutation() {
  return useMutation({
    mutationFn: IS_MOCK ? () => mockResolve(mockVerifyResponse) : verifyMagicLink,
  });
}

/**
 * 로그인한 사용자.
 *
 * `/auth/me`가 없어져 verify 응답을 저장해 두고 읽는다.
 * localStorage는 서버에서 못 읽으므로 마운트 후에 채운다.
 */
export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // 목 모드에서는 로그인을 거치지 않으므로 저장된 사용자가 없다
    setUser(IS_MOCK ? mockAuthUser : tokenStorage.getUser());
  }, []);

  return user;
}
