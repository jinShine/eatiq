"use server";

import { cookies } from "next/headers";

import { STORAGE_KEY } from "@constants/storage-key";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7일
  path: "/",
};

/**
 * 인증 토큰을 httpOnly 쿠키에 설정하거나 삭제하는 Server Action
 *
 * - accessToken이 있으면 → 쿠키에 저장
 * - accessToken이 null이면 → 쿠키 삭제 (로그아웃)
 *
 * Server Action은 Next.js가 CSRF 보호를 자동으로 처리합니다.
 */
export async function setAuthCookieAction(accessToken: string | null) {
  const cookieStore = await cookies();

  if (!accessToken) {
    cookieStore.delete(STORAGE_KEY.LOCAL.TOKEN);
    return;
  }

  cookieStore.set(STORAGE_KEY.LOCAL.TOKEN, accessToken, COOKIE_OPTIONS);
}
