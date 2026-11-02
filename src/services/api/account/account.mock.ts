/**
 * 백엔드 연동 전까지 UI 작업용 목 데이터. auth.mock.ts와 함께 삭제한다.
 */
import { type AccountMeResponse } from "./account.type";

export const mockAccountMe: AccountMeResponse = {
  account_uid: 1,
  email: "dev_front@eatiq.io",
  name: "김승진",
  created_time: "2026-09-18T15:29:10.000Z",
};
