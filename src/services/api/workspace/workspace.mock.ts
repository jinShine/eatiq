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
 * 초대 결과 — 보낸 이메일에 따라 응답을 만든다.
 *
 * 고정 응답을 돌려주면 목에서만 나는 증상(화면에 없는 이메일이 실패로 오는 것)에
 * 시간을 쓰게 된다. 이미 멤버인 주소만 실패로 처리해 실제 서버처럼 굴게 한다.
 */
export const buildMockInviteResult = (emails: string[]): InviteMembersResponse => {
  const existing = new Set(mockWorkspaceMembers.members.map(member => member.email.toLowerCase()));

  const failed = emails.filter(email => existing.has(email.trim().toLowerCase()));
  const invited = emails.filter(email => !existing.has(email.trim().toLowerCase()));

  return {
    message: "워크스페이스 멤버 초대가 처리되었습니다.",
    invited_count: invited.length,
    failed_count: failed.length,
    invited_members: invited.map((_, index) => ({
      uid: 100 + index,
      grade: "사용자" as const,
      status: "초대중" as const,
      last_connection_time: null,
    })),
    failed_items: failed.map(email => ({
      email,
      reason: "이미 해당 워크스페이스의 활성 멤버입니다.",
    })),
  };
};
