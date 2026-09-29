import axiosClientInstance from "@services/axios.client";

import {
  type CreateWorkspaceRequest,
  type CreateWorkspaceResponse,
  type DeleteWorkspaceResponse,
  type InviteMembersRequest,
  type InviteMembersResponse,
  type InvitedWorkspacesResponse,
  type MyWorkspacesResponse,
  type RemoveRejectedMemberResponse,
  type RespondInviteRequest,
  type RespondInviteResponse,
  type UpdateMemberGradeRequest,
  type UpdateMemberGradeResponse,
  type UpdateMemberStatusRequest,
  type UpdateMemberStatusResponse,
  type UpdateWorkspaceNameRequest,
  type UpdateWorkspaceNameResponse,
  type WorkspaceDetailResponse,
  type WorkspaceMembersResponse,
} from "./workspace.type";

const BASE_PATH = "/api/workspace";

const ENDPOINTS = {
  create: BASE_PATH,
  my: `${BASE_PATH}/my`,
  invited: `${BASE_PATH}/my/invited`,
  inviteRespond: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/invite/respond`,
  detail: (workspaceId: string) => `${BASE_PATH}/${workspaceId}`,
  name: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/name`,
  members: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/members`,
  memberInvite: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/member/invite`,
  memberGrade: (workspaceId: string, memberId: string) => `${BASE_PATH}/${workspaceId}/member/${memberId}/grade`,
  memberStatus: (workspaceId: string, memberId: string) => `${BASE_PATH}/${workspaceId}/member/${memberId}/status`,
  memberRemove: (workspaceId: string, memberId: string) => `${BASE_PATH}/${workspaceId}/member/${memberId}/remove`,
};

/** 내가 속한 워크스페이스 목록 */
export async function getMyWorkspaces(): Promise<MyWorkspacesResponse> {
  const res = await axiosClientInstance.get<MyWorkspacesResponse>(ENDPOINTS.my);
  return res.data;
}

export async function createWorkspace(body: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
  const res = await axiosClientInstance.post<CreateWorkspaceResponse>(ENDPOINTS.create, body);
  return res.data;
}

export async function getWorkspaceDetail(workspaceId: string): Promise<WorkspaceDetailResponse> {
  const res = await axiosClientInstance.get<WorkspaceDetailResponse>(ENDPOINTS.detail(workspaceId));
  return res.data;
}

export async function updateWorkspaceName(
  workspaceId: string,
  body: UpdateWorkspaceNameRequest,
): Promise<UpdateWorkspaceNameResponse> {
  const res = await axiosClientInstance.patch<UpdateWorkspaceNameResponse>(ENDPOINTS.name(workspaceId), body);
  return res.data;
}

export async function deleteWorkspace(workspaceId: string): Promise<DeleteWorkspaceResponse> {
  const res = await axiosClientInstance.delete<DeleteWorkspaceResponse>(ENDPOINTS.detail(workspaceId));
  return res.data;
}

/** 워크스페이스 멤버 목록 */
export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMembersResponse> {
  const res = await axiosClientInstance.get<WorkspaceMembersResponse>(ENDPOINTS.members(workspaceId));
  return res.data;
}

/** 여러 명 일괄 초대 — 일부만 실패할 수 있어 응답에 성공·실패가 나뉘어 온다 */
export async function inviteMembers(workspaceId: string, body: InviteMembersRequest): Promise<InviteMembersResponse> {
  const res = await axiosClientInstance.post<InviteMembersResponse>(ENDPOINTS.memberInvite(workspaceId), body);
  return res.data;
}

/** 내가 초대받은 워크스페이스 목록 */
export async function getInvitedWorkspaces(): Promise<InvitedWorkspacesResponse> {
  const res = await axiosClientInstance.get<InvitedWorkspacesResponse>(ENDPOINTS.invited);
  return res.data;
}

export async function respondWorkspaceInvite(
  workspaceId: string,
  body: RespondInviteRequest,
): Promise<RespondInviteResponse> {
  const res = await axiosClientInstance.post<RespondInviteResponse>(ENDPOINTS.inviteRespond(workspaceId), body);
  return res.data;
}

/** 멤버 등급 변경 */
export async function updateMemberGrade(
  workspaceId: string,
  memberId: string,
  body: UpdateMemberGradeRequest,
): Promise<UpdateMemberGradeResponse> {
  const res = await axiosClientInstance.patch<UpdateMemberGradeResponse>(
    ENDPOINTS.memberGrade(workspaceId, memberId),
    body,
  );
  return res.data;
}

/** 멤버 상태 변경 — 초대 취소 / 강제 탈퇴 */
export async function updateMemberStatus(
  workspaceId: string,
  memberId: string,
  body: UpdateMemberStatusRequest,
): Promise<UpdateMemberStatusResponse> {
  const res = await axiosClientInstance.patch<UpdateMemberStatusResponse>(
    ENDPOINTS.memberStatus(workspaceId, memberId),
    body,
  );
  return res.data;
}

/** 초대거절 멤버를 목록에서 제거 */
export async function removeRejectedMember(
  workspaceId: string,
  memberId: string,
): Promise<RemoveRejectedMemberResponse> {
  const res = await axiosClientInstance.delete<RemoveRejectedMemberResponse>(
    ENDPOINTS.memberRemove(workspaceId, memberId),
  );
  return res.data;
}
