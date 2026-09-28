/**
 * 백엔드 연동 전까지 UI 작업용 목 데이터.
 * TODO(API): 실제 연동이 끝나면 mock.ts와 함께 삭제한다.
 */
import { type MyWorkspacesResponse } from "./workspace.type";

/** 목 워크스페이스 id — URL의 [workspaceId]로 쓰인다 */
export const MOCK_WORKSPACE_ID = "1";

export const mockMyWorkspaces: MyWorkspacesResponse = {
  message: "조회에 성공했습니다.",
  total_count: 2,
  workspaces: [
    {
      uid: 1,
      name: "몽탄",
      type: "brand",
      my_member_info: { uid: 11, grade: "owner", status: "active" },
    },
    {
      uid: 2,
      name: "금돼지식당",
      type: "brand",
      my_member_info: { uid: 12, grade: "member", status: "active" },
    },
  ],
};

export const mockWorkspaceDetail = {
  message: "조회에 성공했습니다.",
  workspace: { uid: 1, name: "몽탄", type: "brand" as const },
};
