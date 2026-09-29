import { use } from "react";

import SignInContainer from "./_container";

type Props = {
  /** 초대 링크에서 넘어올 때 이메일이 실려온다 — /auth/sign-in?email=... */
  searchParams: Promise<{ email?: string }>;
};

export default function SignInPage({ searchParams }: Props) {
  const { email } = use(searchParams);

  return <SignInContainer defaultEmail={email ?? ""} />;
}
