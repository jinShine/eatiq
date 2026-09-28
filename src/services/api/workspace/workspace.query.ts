import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import {
  createWorkspace,
  deleteWorkspace,
  getMyWorkspaces,
  getWorkspaceDetail,
  updateWorkspaceName,
} from "./workspace.api";
import { mockMyWorkspaces, mockWorkspaceDetail } from "./workspace.mock";
import {
  type CreateWorkspaceRequest,
  type MyWorkspaceItem,
  type UpdateWorkspaceNameRequest,
  type Workspace,
} from "./workspace.type";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  my: () => [...workspaceKeys.all, "my"] as const,
  detail: (workspaceId: string) => [...workspaceKeys.all, "detail", workspaceId] as const,
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

export function useWorkspaceDetail(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockWorkspaceDetail) : () => getWorkspaceDetail(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useUpdateWorkspaceNameMutation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: IS_MOCK
      ? // 목에서는 본문을 쓰지 않지만 실제 함수와 시그니처가 같아야 mutate(body) 호출부가 동일하다
        (_body: UpdateWorkspaceNameRequest) => mockResolve({ message: "수정되었습니다." })
      : (body: UpdateWorkspaceNameRequest) => updateWorkspaceName(workspaceId, body),
    // 사이드바 스위처와 상세가 같은 이름을 보여주므로 둘 다 무효화한다
    onSuccess: () => {
      invalidateQueries.single(workspaceKeys.detail(workspaceId));
      invalidateQueries.single(workspaceKeys.my());
    },
  });
}

export function useDeleteWorkspaceMutation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: IS_MOCK ? () => mockResolve({ message: "삭제되었습니다." }) : () => deleteWorkspace(workspaceId),
    onSuccess: () => invalidateQueries.single(workspaceKeys.my()),
  });
}
