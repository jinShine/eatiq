import { redirect } from "next/navigation";

import ROUTES from "@constants/routes";

/** 가입은 매직링크(/auth/verify)에서 이름을 받아 끝난다 — 따로 가입 화면이 없어 로그인으로 보낸다 */
export default function SignUpPage() {
  redirect(ROUTES.AUTH.SIGN_IN);
}
