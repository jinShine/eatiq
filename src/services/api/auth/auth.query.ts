import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

import { IS_MOCK, mockResolve } from "../mock";
import { logout, register, sendMagicLink, verifyMagicLink } from "./auth.api";
import { MOCK_ACCESS_TOKEN, mockAuthUser, mockVerifyResponse } from "./auth.mock";
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

/**
 * 메일로 받은 토큰 검증 → access_token 수령
 *
 * 토큰이 1회용이라 호출 자체를 막아야 하는 경우가 있다(가입 진행 중 새로고침 등).
 * 그럴 때 `enabled`를 false로 넘겨 호출을 건너뛴다.
 */
export function useVerifyMagicLink(email: string, token: string, enabled = true) {
  return useQuery({
    queryKey: [...authKeys.all, "verify", email, token],
    queryFn: IS_MOCK ? () => mockResolve(mockVerifyResponse) : () => verifyMagicLink({ email, token }),
    enabled: enabled && Boolean(email && token),
    retry: false,
    staleTime: Infinity,
  });
}

/**
 * 신규 회원 가입 완료.
 *
 * verify 응답의 `is_new_user`가 true면 access_token 대신 가입용 `token`만 온다.
 * 그 토큰과 사용자가 입력한 이름을 함께 보내야 가입이 끝나고 access_token이 발급된다.
 *
 * 사용자가 버튼을 눌러 일으키는 행위라 verify(useQuery)와 달리 mutation으로 둔다.
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: IS_MOCK
      ? () =>
          mockResolve({
            message: "회원가입이 완료되었습니다.",
            access_token: MOCK_ACCESS_TOKEN,
            user: mockAuthUser,
          })
      : register,
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

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: IS_MOCK ? () => mockResolve({ message: "로그아웃되었습니다." }) : logout,
    // 서버 요청이 실패해도 로컬은 비운다. "눌렀는데 그대로"가 가장 나쁘고,
    // 토큰이 서버에 남아도 클라이언트에 없으면 쓸 수 없다
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
      router.replace(ROUTES.AUTH.SIGN_IN);
    },
  });
}
