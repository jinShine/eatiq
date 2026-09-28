/**
 * 백엔드 연동 전까지 UI 작업용 목 데이터.
 * TODO(API): 실제 연동이 끝나면 mock.ts와 함께 삭제한다.
 */
import {
  type InviteMembersResponse,
  type MyWorkspacesResponse,
  type WorkspaceDetailResponse,
  type WorkspaceMembersResponse,
} from "./workspace.type";

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
      created_time: "2026-06-01T09:00:00.000Z",
      my_member_info: { uid: 11, grade: "관리자", status: "활성", last_connection_time: "2026-06-24T10:00:00.000Z" },
    },
    {
      uid: 2,
      name: "금돼지식당",
      type: "brand",
      created_time: "2026-06-10T09:00:00.000Z",
      my_member_info: { uid: 12, grade: "사용자", status: "활성", last_connection_time: null },
    },
  ],
};

/** 응답은 평탄하다 — uid·name·type이 최상위에 온다 */
export const mockWorkspaceDetail: WorkspaceDetailResponse = {
  uid: 1,
  name: "몽탄",
  type: "brand",
  my_member_info: {
    uid: 11,
    grade: "관리자",
    status: "활성",
    last_connection_time: "2026-06-24T10:00:00.000Z",
  },
  brand: null,
  buyer: null,
};

/**
 * 멤버 목록 — 상태 4종을 모두 담는다.
 *
 * 가입 전인 멤버(초대중·초대거절)는 name과 last_connection_time이 null이다.
 * 목에서 이름을 채워두면 화면은 멀쩡한데 실제로는 빈칸이 뜨는 일이 생긴다.
 */
export const mockWorkspaceMembers: WorkspaceMembersResponse = {
  message: "워크스페이스 멤버 목록을 성공적으로 조회했습니다.",
  total_count: 4,
  members: [
    {
      uid: 11,
      workspace_uid: 1,
      account_uid: 1,
      name: "김지환",
      email: "jihwan.kim@eatiq.io",
      grade: "관리자",
      status: "활성",
      last_connection_time: "2026-06-24T10:00:00.000Z",
      created_time: "2026-06-01T09:00:00.000Z",
    },
    {
      uid: 12,
      workspace_uid: 1,
      account_uid: 2,
      name: "김승진",
      email: "seungjin.kim@plugfood.io",
      grade: "사용자",
      status: "활성",
      last_connection_time: "2026-06-24T10:00:00.000Z",
      created_time: "2026-06-02T09:00:00.000Z",
    },
    {
      uid: 13,
      workspace_uid: 1,
      account_uid: null,
      name: null,
      email: "hyunhun@plugfood.io",
      grade: "사용자",
      status: "초대중",
      last_connection_time: null,
      created_time: "2026-06-20T09:00:00.000Z",
    },
    {
      uid: 14,
      workspace_uid: 1,
      account_uid: null,
      name: null,
      email: "seonghyun.kim@gmail.com",
      grade: "사용자",
      status: "초대거절",
      last_connection_time: null,
      created_time: "2026-06-18T09:00:00.000Z",
    },
  ],
};

/**
 * 초대 결과 — 부분 성공을 담는다.
 *
 * 전부 성공하는 목만 두면 실패 UI(칸별 사유 표시)를 검증할 수 없다.
 */
export const mockInviteResult: InviteMembersResponse = {
  message: "워크스페이스 멤버 초대가 처리되었습니다.",
  invited_count: 1,
  failed_count: 1,
  invited_members: [{ uid: 15, grade: "사용자", status: "초대중", last_connection_time: null }],
  failed_items: [{ email: "jihwan.kim@eatiq.io", reason: "이미 해당 워크스페이스의 활성 멤버입니다." }],
};
