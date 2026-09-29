import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import {
  createWorkspace,
  deleteWorkspace,
  getInvitedWorkspaces,
  getMyWorkspaces,
  getWorkspaceDetail,
  getWorkspaceMembers,
  inviteMembers,
  respondWorkspaceInvite,
  updateWorkspaceName,
} from "./workspace.api";
import { buildMockInviteResult, mockMyWorkspaces, mockWorkspaceDetail, mockWorkspaceMembers } from "./workspace.mock";
import {
  type CreateWorkspaceRequest,
  type InviteMembersRequest,
  type MyWorkspaceItem,
  type RespondInviteRequest,
  type UpdateWorkspaceNameRequest,
  type Workspace,
  type WorkspaceMember,
  type WorkspaceMemberItem,
} from "./workspace.type";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  my: () => [...workspaceKeys.all, "my"] as const,
  detail: (workspaceId: string) => [...workspaceKeys.all, "detail", workspaceId] as const,
  members: (workspaceId: string) => [...workspaceKeys.all, "members", workspaceId] as const,
  invited: () => [...workspaceKeys.all, "invited"] as const,
};

/** API DTO → 앱 뷰모델. uid는 number라 라우팅에 쓰려면 문자열로 바꾼다 */
const toWorkspace = (item: MyWorkspaceItem): Workspace => ({
  id: String(item.uid),
  name: item.name,
  myMember: {
    id: String(item.my_member_info.uid),
    grade: item.my_member_info.grade,
    status: item.my_member_info.status,
  },
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

/** DTO → 뷰모델. snake_case와 number id를 화면 쪽 모양으로 바꾼다 */
const toWorkspaceMember = (item: WorkspaceMemberItem): WorkspaceMember => ({
  id: String(item.uid),
  name: item.name,
  email: item.email,
  grade: item.grade,
  status: item.status,
  lastConnectedAt: item.last_connection_time,
});

/**
 * 워크스페이스 멤버 목록.
 *
 * 변환은 select에서 한다. queryFn 안에서 map을 돌리면 캐시에 가공된 것이 남아
 * total_count 같은 원본 정보가 필요해질 때 다시 요청해야 한다.
 */
export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockWorkspaceMembers) : () => getWorkspaceMembers(workspaceId),
    select: response => response.members.map(toWorkspaceMember),
    enabled: Boolean(workspaceId),
  });
}

/**
 * 멤버 초대.
 *
 * 부분 실패여도 mutation은 성공이다(HTTP 201). 성공한 사람은 이미 서버에
 * 들어갔으므로 목록을 갱신하고, 실패 여부는 호출부가 failed_items로 판단한다.
 */
export function useInviteMembersMutation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: IS_MOCK
      ? (body: InviteMembersRequest) => mockResolve(buildMockInviteResult(body.emails))
      : (body: InviteMembersRequest) => inviteMembers(workspaceId, body),
    onSuccess: () => invalidateQueries.single(workspaceKeys.members(workspaceId)),
  });
}

export function useInvitedWorkspaces(enabled = true) {
  return useQuery({
    queryKey: workspaceKeys.invited(),
    queryFn: getInvitedWorkspaces,
    enabled,
  });
}

export function useRespondInviteMutation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (body: RespondInviteRequest) => respondWorkspaceInvite(workspaceId, body),
    // 수락하면 내 워크스페이스가 늘고, 어느 쪽이든 초대 목록에서는 빠진다
    onSuccess: () => {
      invalidateQueries.single(workspaceKeys.my());
      invalidateQueries.single(workspaceKeys.invited());
    },
  });
}
