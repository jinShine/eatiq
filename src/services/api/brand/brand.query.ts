import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import { getWorkspaceDetail } from "../workspace/workspace.api";
import { mockWorkspaceDetail } from "../workspace/workspace.mock";
import { workspaceKeys } from "../workspace/workspace.query";
import { type WorkspaceDetailResponse } from "../workspace/workspace.type";
import {
  getBrandCompletion,
  updateBrandBasic,
  updateBrandCommission,
  updateBrandContact,
  updateBrandContract,
  updateBrandContractPolicy,
  updateBrandFacilityReq,
  updateBrandFeaturedImages,
  updateBrandFeaturedVideos,
  updateBrandIntro,
  updateBrandLocationStandard,
  updateBrandLogo,
  updateBrandMenu,
  updateBrandSignature,
  updateBrandSizeCriteria,
  updateBrandStatus,
} from "./brand.api";
import { mockBrandCompletion, mockBrandSettings } from "./brand.mock";
import {
  type BrandCompletion,
  type BrandCompletionResponse,
  type BrandCompletionScope,
  type BrandCompletionTask,
} from "./brand.type";

/** 화면 탭 → 완성도 API 범위. 탭 이름(policy·area)과 API 이름(contract·commercial)이 다르다 */
const COMPLETION_SCOPE_BY_TAB = {
  basic: "basic",
  visual: "visual",
  policy: "contract",
  area: "commercial",
} as const satisfies Record<string, BrandCompletionScope>;

export type BrandSettingsTab = keyof typeof COMPLETION_SCOPE_BY_TAB;

export const brandKeys = {
  all: ["brands"] as const,
  list: () => [...brandKeys.all, "list"] as const,
  settings: (workspaceId: string) => [...brandKeys.all, "settings", workspaceId] as const,
  /** 탭별 완성도의 상위 키 — 섹션을 저장하면 탭 구분 없이 한 번에 무효화한다 */
  completionAll: (workspaceId: string) => [...brandKeys.all, "completion", workspaceId] as const,
  completion: (workspaceId: string, scope: BrandCompletionScope) =>
    [...brandKeys.completionAll(workspaceId), scope] as const,
};

/************************************
 * 브랜드 정보 설정
 ************************************/

/**
 * 설정 화면용 조회.
 *
 * TODO(API): 새 백엔드는 `GET /api/workspace/brand/{brand_uid}`로 조회하는데,
 * 화면이 아는 값은 workspace_uid뿐이라 brand_uid를 얻는 경로가 필요하다.
 * 또 응답(BrandDetailResponseDto)이 설정 화면의 섹션 구조와 맞지 않는다.
 * 매핑이 확정되기 전까지는 목 데이터로만 동작한다.
 *
 * 회사 정보 설정 탭은 모두 실제 API(useBrandSection)로 옮겼다. 지금은 AI 상권분석 시작 모달의
 * 입력칸 미리 채우기(useAnalysisConditionForm)만 쓴다. TODO(API): 로드맵 5번 때 함께 옮기고 삭제
 */
export function useBrandSettings(workspaceId: string) {
  return useQuery({
    queryKey: brandKeys.settings(workspaceId),
    queryFn: () => mockResolve(mockBrandSettings),
    enabled: Boolean(workspaceId),
  });
}

type CompletionTaskDto = NonNullable<BrandCompletionResponse["next_task"]>;

const toCompletionTask = (task: CompletionTaskDto): BrandCompletionTask => ({
  title: task.title,
  description: task.description,
  isRequired: task.is_required,
  sectionKey: task.section_key,
  fieldKey: task.field_key,
});

const toCompletion = (response: BrandCompletionResponse): BrandCompletion => ({
  rate: response.completion_rate,
  totalFields: response.total_fields,
  completedFields: response.completed_fields,
  step: response.stage.step,
  stepMessage: response.stage.message,
  nextTask: response.next_task ? toCompletionTask(response.next_task) : null,
  remainingTasks: response.remaining_tasks.map(toCompletionTask),
});

/** 탭별 정보 완성 현황 (저니 패널) */
export function useBrandCompletion(workspaceId: string, tab: BrandSettingsTab) {
  const scope = COMPLETION_SCOPE_BY_TAB[tab];

  return useQuery({
    queryKey: brandKeys.completion(workspaceId, scope),
    queryFn: IS_MOCK ? () => mockResolve(mockBrandCompletion) : () => getBrandCompletion(workspaceId, scope),
    select: toCompletion,
    enabled: Boolean(workspaceId),
  });
}

/**
 * 여러 탭의 완성도를 한 번에 조회한다. 저니 패널이 "다음으로 채울 탭"을 고를 때 쓴다.
 *
 * 탭별 queryKey를 useBrandCompletion과 똑같이 써서 캐시를 나눠 쓴다 — 그 탭에 들어가면 다시 요청하지 않는다.
 * 필요할 때만(현재 탭을 다 채웠을 때) enabled로 켜서 평소에는 요청이 늘지 않게 한다.
 */
export function useBrandCompletions(workspaceId: string, tabs: readonly BrandSettingsTab[], enabled: boolean) {
  return useQueries({
    queries: tabs.map(tab => {
      const scope = COMPLETION_SCOPE_BY_TAB[tab];
      return {
        queryKey: brandKeys.completion(workspaceId, scope),
        queryFn: IS_MOCK ? () => mockResolve(mockBrandCompletion) : () => getBrandCompletion(workspaceId, scope),
        select: toCompletion,
        enabled: enabled && Boolean(workspaceId),
      };
    }),
  });
}

/** 워크스페이스 상세의 브랜드 섹션들(brand_basic … brand_facility_req) */
type WorkspaceDetailBrand = NonNullable<WorkspaceDetailResponse["brand"]>;
export type BrandSectionKey = Extract<keyof WorkspaceDetailBrand, `brand_${string}`>;

/**
 * 섹션의 현재 저장값.
 *
 * 워크스페이스 상세와 같은 queryKey를 쓴다. 설정 화면 헤더·사이드바가 이미 같은 요청을 하고 있어
 * 섹션이 몇 개든 요청은 한 번만 나간다.
 */
export function useBrandSection<K extends BrandSectionKey>(workspaceId: string, key: K) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockWorkspaceDetail) : () => getWorkspaceDetail(workspaceId),
    select: detail => detail.brand?.[key] ?? null,
    enabled: Boolean(workspaceId),
  });
}

/**
 * 섹션 저장 — 실제 API.
 *
 * 저장이 끝나면 두 가지를 다시 받는다. 섹션 값(워크스페이스 상세)은 다른 화면과 맞추려고,
 * 완성도는 저니 패널 비율을 갱신하려고. 폼 자체는 섹션 쪽 onSuccess에서 저장 응답으로 reset한다 —
 * RHF의 values는 이전 값과 달라졌을 때만 reset하므로, 저장 결과가 이전과 같으면(0187 → 187)
 * 다시 받아도 폼이 dirty로 남는다. 완성도는 탭 구분 없이 무효화한다 —
 * 한 섹션이 다른 탭 완성도에 들어가는지 화면은 모른다.
 */
function createBrandSectionMutation<TBody, TResponse>(save: (workspaceId: string, body: TBody) => Promise<TResponse>) {
  return (workspaceId: string) => {
    const invalidateQueries = useInvalidateQueries();

    return useMutation({
      // 저장 응답에는 서버가 저장한 섹션 값이 담겨 온다. 목 모드는 응답이 없어 undefined
      mutationFn: IS_MOCK
        ? (_body: TBody) => mockResolve<TResponse | undefined>(undefined)
        : (body: TBody): Promise<TResponse | undefined> => save(workspaceId, body),
      onSuccess: () => {
        invalidateQueries.single(workspaceKeys.detail(workspaceId));
        invalidateQueries.single(brandKeys.completionAll(workspaceId));
      },
    });
  };
}

export const useUpdateBrandBasic = createBrandSectionMutation(updateBrandBasic);
export const useUpdateBrandIntro = createBrandSectionMutation(updateBrandIntro);
export const useUpdateBrandStatus = createBrandSectionMutation(updateBrandStatus);
export const useUpdateBrandContact = createBrandSectionMutation(updateBrandContact);
export const useUpdateBrandContract = createBrandSectionMutation(updateBrandContract);
export const useUpdateBrandSignature = createBrandSectionMutation(updateBrandSignature);
export const useUpdateBrandContractPolicy = createBrandSectionMutation(updateBrandContractPolicy);
export const useUpdateBrandCommission = createBrandSectionMutation(updateBrandCommission);
export const useUpdateBrandLocationStandard = createBrandSectionMutation(updateBrandLocationStandard);
export const useUpdateBrandSizeCriteria = createBrandSectionMutation(updateBrandSizeCriteria);
export const useUpdateBrandFacilityReq = createBrandSectionMutation(updateBrandFacilityReq);
export const useUpdateBrandLogo = createBrandSectionMutation(updateBrandLogo);
export const useUpdateBrandFeaturedImages = createBrandSectionMutation(updateBrandFeaturedImages);
export const useUpdateBrandFeaturedVideos = createBrandSectionMutation(updateBrandFeaturedVideos);
export const useUpdateBrandMenu = createBrandSectionMutation(updateBrandMenu);
