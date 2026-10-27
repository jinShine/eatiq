// 프로젝트명.type@key
export const STORAGE_KEY = {
  LOCAL: {
    TOKEN: "eatiq@token",
    REFRESH_TOKEN: "eatiq@refresh-token",
    AUTH_USER: "eatiq@auth-user",
    /** 로그인 후 돌아갈 주소(초대 링크·튕겨 나온 화면) — 탭을 넘어야 해서 session이 아닌 local에 둔다 */
    LOGIN_RETURN: "eatiq@login-return",
  },
  SESSION: {
    PENDING_SIGNUP: "eatiq@pending-signup",
  },
  COOKIE: {},
};
