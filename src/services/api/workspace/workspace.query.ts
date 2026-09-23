import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import { createWorkspace, getMyWorkspaces } from "./workspace.api";
import { mockMyWorkspaces } from "./workspace.mock";
import { type CreateWorkspaceRequest, type MyWorkspaceItem, type Workspace } from "./workspace.type";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  my: () => [...workspaceKeys.all, "my"] as const,
};

/** API DTO → 앱 뷰모델. uid는 number라 라우팅에 쓰려면 문자열로 바꾼다 */
const toWorkspace = (item: MyWorkspaceItem): Workspace => ({
  id: String(item.uid),
  name: item.name,
});

export function useMyWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.my(),
    queryFn: IS_MOCK ? () => mockResolve(mockMyWorkspaces) : getMyWorkspaces,
    select: response => (response.workspaces ?? []).map(toWorkspace),
  });
}

/**
 * 워크스페이스 생성.
 */
export function useCreateWorkspaceMutation() {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: IS_MOCK
      ? (body: CreateWorkspaceRequest) =>
          mockResolve({
            message: "워크스페이스가 생성되었습니다.",
            workspace: { uid: 1, name: body.name, type: body.type },
          })
      : createWorkspace,
    onSuccess: () => invalidateQueries.single(workspaceKeys.my()),
  });
}
