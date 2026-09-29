import { type components } from "@services/openapi";

/**
 * 워크스페이스가 1급 리소스가 됐다.
 * 이전에는 브랜드 하나를 워크스페이스로 부르던 구조였지만,
 * 이제 워크스페이스 안에 브랜드와 바이어가 들어간다.
 */
export type MyWorkspacesResponse = components["schemas"]["GetMyWorkspacesResponseDto"];
export type MyWorkspaceItem = components["schemas"]["MyWorkspaceItemDto"];

export type CreateWorkspaceRequest = components["schemas"]["CreateWorkspaceDto"];
export type CreateWorkspaceResponse = components["schemas"]["CreateWorkspaceResponseDto"];

/** 앱 안에서 쓰는 워크스페이스 뷰모델 — API DTO를 화면까지 흘려보내지 않는다 */
export type Workspace = {
  id: string;
  name: string;
  /**
   * 이 워크스페이스에서의 내 멤버 정보.
   *
   * 권한 판단을 멤버 목록에서 이메일로 대조해 추론하지 않는다.
   * 서버가 "너는 관리자다"라고 명시적으로 주는 값을 그대로 쓴다.
   */
  myMember: {
    id: string;
    grade: WorkspaceMemberGrade;
    status: WorkspaceMemberStatus;
  };
};

/**
 * 워크스페이스 상세 — 응답이 평탄하다. uid·name·type이 최상위에 온다.
 * 손으로 쓰면서 workspace로 한 겹 감쌌다가 런타임 에러를 냈다. 스펙에서 가져온다.
 */
export type WorkspaceDetailResponse = components["schemas"]["WorkspaceDetailResponseDto"];

export type UpdateWorkspaceNameRequest = components["schemas"]["UpdateWorkspaceNameDto"];
export type UpdateWorkspaceNameResponse = components["schemas"]["UpdateWorkspaceNameResponseDto"];
export type DeleteWorkspaceResponse = components["schemas"]["DeleteWorkspaceResponseDto"];

/** 멤버 초대 — 여러 명을 한 번에 보내고 성공·실패가 나뉘어 온다 */
export type InviteMembersRequest = components["schemas"]["InviteWorkspaceMemberDto"];
export type InviteMembersResponse = components["schemas"]["InviteWorkspaceMemberResponseDto"];

/** 워크스페이스 멤버 목록 */
export type WorkspaceMembersResponse = components["schemas"]["GetWorkspaceMemberListResponseDto"];
export type WorkspaceMemberItem = components["schemas"]["WorkspaceMemberItemDto"];

/**
 * 멤버 권한·상태는 스펙에서 뽑아 쓴다.
 * 손으로 다시 적으면 백엔드가 값을 추가했을 때 두 곳이 어긋난다.
 */
export type WorkspaceMemberGrade = WorkspaceMemberItem["grade"];
export type WorkspaceMemberStatus = WorkspaceMemberItem["status"];

/**
 * 화면에서 쓰는 멤버 뷰모델.
 *
 * uid는 number라 key·경로에 쓰려면 문자열이 낫고, snake_case는 화면까지
 * 흘려보내지 않는다. 값 집합 자체는 서버와 같아야 하므로 스펙을 따른다.
 */
export type WorkspaceMember = {
  id: string;
  name: string | null;
  email: string;
  grade: WorkspaceMemberGrade;
  status: WorkspaceMemberStatus;
  lastConnectedAt: string | null;
};

/** 초대받은 워크스페이스 목록 */
export type InvitedWorkspacesResponse = components["schemas"]["GetMyInvitedWorkspacesResponseDto"];
export type InvitedWorkspaceItem = components["schemas"]["InvitedWorkspaceItemDto"];

/** 화면에서 쓰는 받은 초대 뷰모델 */
export type InvitedWorkspace = {
  id: string;
  name: string;
  type: InvitedWorkspaceItem["type"];
  /** 초대받은 시각 — 워크스페이스 생성 시각(created_time)과 다르다 */
  invitedAt: string | null;
};

/** 초대 수락·거절 */
export type RespondInviteRequest = components["schemas"]["RespondWorkspaceInviteDto"];
export type RespondInviteResponse = components["schemas"]["RespondWorkspaceInviteResponseDto"];

/** 멤버 등급 변경 — "관리자" | "사용자" */
export type UpdateMemberGradeRequest = components["schemas"]["UpdateWorkspaceMemberGradeDto"];
export type UpdateMemberGradeResponse = components["schemas"]["UpdateWorkspaceMemberGradeResponseDto"];

/** 멤버 상태 변경 — "초대취소"(초대중만) | "강제탈퇴"(활성만). 조회 status와 값 집합이 다르다 */
export type UpdateMemberStatusRequest = components["schemas"]["UpdateWorkspaceMemberStatusDto"];
export type UpdateMemberStatusResponse = components["schemas"]["UpdateWorkspaceMemberStatusResponseDto"];

/** 초대거절 멤버를 목록에서 제거 (소프트 삭제) */
export type RemoveRejectedMemberResponse = components["schemas"]["RemoveWorkspaceRejectedMemberResponseDto"];
