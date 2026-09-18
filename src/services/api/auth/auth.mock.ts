/**
 * 백엔드 연동 전까지 UI 작업용 목 데이터. workspace.mock.ts와 함께 삭제한다.
 */
import { type AuthUser, type VerifyMagicLinkResponse } from "./auth.type";

export const MOCK_ACCESS_TOKEN = "mock-access-token";

export const mockAuthUser: AuthUser = {
  uid: 1,
  email: "dev_front@eatiq.io",
  // TODO(백엔드): AuthUserResponseDto.name이 스펙에 object로 선언돼 있다. string이 맞는지 확인 필요
  name: "김승진" as unknown as AuthUser["name"],
};

export const mockVerifyResponse: VerifyMagicLinkResponse = {
  is_new_user: false,
  email: mockAuthUser.email,
  access_token: MOCK_ACCESS_TOKEN,
  user: mockAuthUser,
  token: MOCK_ACCESS_TOKEN,
  message: "로그인에 성공했습니다.",
};
