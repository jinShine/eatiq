import axiosClientInstance from "@services/axios.client";

import { type CreateWorkspaceRequest, type CreateWorkspaceResponse, type MyWorkspacesResponse } from "./workspace.type";

const BASE_PATH = "/api/workspace";

const ENDPOINTS = {
  create: BASE_PATH,
  my: `${BASE_PATH}/my`,
  invited: `${BASE_PATH}/my/invited`,
  detail: (workspaceId: string) => `${BASE_PATH}/${workspaceId}`,
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
