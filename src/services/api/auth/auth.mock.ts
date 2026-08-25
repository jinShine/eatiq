/**
 * 백엔드 서버 부재 중 UI 작업용 목 데이터. `brand.mock.ts`와 함께 삭제한다.
 */
import { MOCK_WORKSPACE_ID } from "../brand/brand.mock";
import { type AuthResponse, type MeResponse } from "./auth.type";

export const MOCK_ACCESS_TOKEN = "mock-access-token";

export const mockMe: MeResponse = {
  user: {
    id: "mock-user-1",
    email: "dev_front@eatiq.io",
    name: "김승진",
    userType: "brand",
    emailVerified: true,
    lastBrandId: MOCK_WORKSPACE_ID,
  },
};

export const mockAuthResponse: AuthResponse = {
  accessToken: MOCK_ACCESS_TOKEN,
  refreshToken: "mock-refresh-token",
  expiresIn: 3600,
  user: mockMe.user,
};
