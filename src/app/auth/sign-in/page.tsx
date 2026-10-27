import { use } from "react";

import SignInContainer from "./_container";

type Props = {
  /** 초대 링크에서 넘어올 때 이메일이 실려온다 — /auth/sign-in?email=... */
  /** expired=1 — 로그인이 만료돼 튕겨 나온 경우(axios 401 처리) */
  searchParams: Promise<{ email?: string; expired?: string }>;
};

export default function SignInPage({ searchParams }: Props) {
  const { email, expired } = use(searchParams);

  return <SignInContainer defaultEmail={email ?? ""} isExpired={expired === "1"} />;
}
