import { useQuery } from "@tanstack/react-query";

import { IS_MOCK, mockResolve } from "../mock";
import { getMyWorkspaces } from "./workspace.api";
import { mockMyWorkspaces } from "./workspace.mock";
import { type MyWorkspaceItem, type Workspace } from "./workspace.type";

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
