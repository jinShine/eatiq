import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

import { IS_MOCK, mockResolve } from "../mock";
import { deleteAccount, getAccountMe, logout } from "./account.api";
import { mockAccountMe } from "./account.mock";

export const accountKeys = {
  all: ["account"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};

/** 내 계정 정보 */
export function useAccountMe() {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: IS_MOCK ? () => mockResolve(mockAccountMe) : getAccountMe,
  });
}

/** 토큰·캐시를 비우고 로그인 화면으로 보낸다. 로그아웃과 계정 탈퇴가 함께 쓴다 */
function useEndSession() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    tokenStorage.clear();
    queryClient.clear();
    router.replace(ROUTES.AUTH.SIGN_IN);
  };
}

export function useLogoutMutation() {
  const endSession = useEndSession();

  return useMutation({
    mutationFn: IS_MOCK ? () => mockResolve({ message: "로그아웃되었습니다." }) : logout,
    // 서버 요청이 실패해도 로컬은 비운다. "눌렀는데 그대로"가 가장 나쁘고,
    // 토큰이 서버에 남아도 클라이언트에 없으면 쓸 수 없다
    onSettled: endSession,
  });
}

/**
 * 계정 탈퇴.
 * 로그아웃과 달리 실패하면 세션을 그대로 둔다 — 거절(400)이면 계정이 살아 있어 계속 써야 한다.
 */
export function useDeleteAccountMutation() {
  const endSession = useEndSession();

  return useMutation({
    mutationFn: IS_MOCK
      ? () =>
          mockResolve({
            success: true,
            message: "계정이 성공적으로 탈퇴 처리되었습니다.",
            account_uid: mockAccountMe.account_uid,
            deleted_time: new Date().toISOString(),
          })
      : deleteAccount,
    onSuccess: endSession,
  });
}
