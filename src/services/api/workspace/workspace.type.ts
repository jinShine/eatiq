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
};
