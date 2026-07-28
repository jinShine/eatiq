"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (tokenStorage.getAccessToken()) {
      setChecked(true);
    } else {
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
