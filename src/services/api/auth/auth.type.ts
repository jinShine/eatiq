import { type components } from "@services/openapi";

/**
 * 인증은 매직링크 방식이다.
 * 이메일로 링크를 보내고(magic-link), 받은 토큰을 검증하면(verify) access_token이 나온다.
 * 비밀번호 로그인·/auth/me·/auth/refresh는 없다.
 */
export type SendMagicLinkRequest = components["schemas"]["SendMagicLinkDto"];
export type SendMagicLinkResponse = components["schemas"]["SendMagicLinkResponseDto"];

export type VerifyMagicLinkRequest = components["schemas"]["VerifyMagicLinkDto"];
export type VerifyMagicLinkResponse = components["schemas"]["VerifyMagicLinkResponseDto"];

export type RegisterRequest = components["schemas"]["RegisterDto"];
export type RegisterResponse = components["schemas"]["RegisterResponseDto"];

export type LogoutResponse = components["schemas"]["LogoutResponseDto"];

/** 로그인한 사용자 */
export type AuthUser = components["schemas"]["AuthUserResponseDto"];
