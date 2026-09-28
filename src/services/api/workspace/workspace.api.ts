import axiosClientInstance from "@services/axios.client";

import {
  type CreateWorkspaceRequest,
  type CreateWorkspaceResponse,
  type DeleteWorkspaceResponse,
  type InviteMembersRequest,
  type InviteMembersResponse,
  type MyWorkspacesResponse,
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
  detail: (workspaceId: string) => `${BASE_PATH}/${workspaceId}`,
  name: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/name`,
  members: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/members`,
  memberInvite: (workspaceId: string) => `${BASE_PATH}/${workspaceId}/member/invite`,
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
