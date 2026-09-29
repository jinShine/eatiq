// 프로젝트명.type@key
export const STORAGE_KEY = {
  LOCAL: {
    TOKEN: "eatiq@token",
    REFRESH_TOKEN: "eatiq@refresh-token",
    AUTH_USER: "eatiq@auth-user",
    /** 로그인 후 돌아갈 초대 링크 — 탭을 넘어야 해서 session이 아닌 local에 둔다 */
    INVITE_RETURN: "eatiq@invite-return",
  },
  SESSION: {
    PENDING_SIGNUP: "eatiq@pending-signup",
  },
  COOKIE: {},
};
