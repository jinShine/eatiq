"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { loginReturnStorage } from "@services/api/auth/login-return-storage";
import { IS_MOCK } from "@services/api/mock";
import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 목 모드에서는 백엔드가 없어 토큰을 받을 수 없으므로 가드를 통과시킨다
    if (IS_MOCK || tokenStorage.getAccessToken()) {
      setChecked(true);
    } else {
      // 로그인하고 나면 보려던 화면으로 돌아오게 남긴다
      loginReturnStorage.saveCurrent();
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
