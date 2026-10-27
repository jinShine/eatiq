import z from "zod";

/** 워크스페이스 이름 상한 — 스펙에 없어 화면에서 막는다(사이드바·전환 목록에서 말줄임으로 보인다) */
export const WORKSPACE_NAME_MAX_LENGTH = 50;

/** 생성 모달과 설정의 이름 변경이 같은 규칙을 쓴다 */
export const workspaceNameField = z
  .string()
  .trim()
  .min(1, "워크스페이스 이름을 입력해주세요.")
  .max(WORKSPACE_NAME_MAX_LENGTH, `${WORKSPACE_NAME_MAX_LENGTH}자 이내로 입력해주세요.`);
