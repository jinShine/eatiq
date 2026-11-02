import { type components } from "@services/openapi";

/** 로그인한 계정의 기본 정보. 이메일·이름은 수정할 수 없다(수정 API 없음) */
export type AccountMeResponse = components["schemas"]["GetAccountMeResponseDto"];

export type DeleteAccountResponse = components["schemas"]["DeleteAccountResponseDto"];

export type LogoutResponse = components["schemas"]["LogoutResponseDto"];
