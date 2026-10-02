import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockMutation, mockResolve } from "../mock";
import { getWorkspaceDetail } from "../workspace/workspace.api";
import { mockWorkspaceDetail } from "../workspace/workspace.mock";
import { workspaceKeys } from "../workspace/workspace.query";
import { getBrandCompletion, updateBrandBasic, updateBrandIntro } from "./brand.api";
import { mergeMockSettings, mockBrandCompletion, mockBrandSettings } from "./brand.mock";
import {
  type BrandBasicData,
  type BrandCompletion,
  type BrandCompletionResponse,
  type BrandCompletionScope,
  type BrandCompletionTask,
  type BrandIntroData,
} from "./brand.type";
import {
  type BrandAreaCriteriaView,
  type BrandContactView,
  type BrandContractView,
  type BrandFeeView,
  type BrandOperationView,
  type BrandPolicyView,
} from "./brand.view";

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
 * 읽기 응답의 섹션 → 저장값 타입(*DataDto) 짝.
 *
 * 읽기 응답(WorkspaceDetailBrandDto)의 13개 섹션이 Record<string, never>로 선언돼 있다.
 * 저장 응답의 *DataDto와 같은 모양이라 여기서만 단언한다.
 * TODO(백엔드): 섹션 타입 선언 요청함 — 반영되면 이 맵과 아래 단언을 지운다.
 */
type BrandSectionMap = {
  brand_basic: BrandBasicData;
  brand_intro: BrandIntroData;
};

export type BrandSectionKey = keyof BrandSectionMap;

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
    select: detail => (detail.brand?.[key] ?? null) as BrandSectionMap[K] | null,
    enabled: Boolean(workspaceId),
  });
}

/**
 * 섹션 저장 — 실제 API.
 *
 * 저장이 끝나면 두 가지를 다시 받는다. 섹션 값(워크스페이스 상세)은 폼이 서버 정규화 결과로
 * 다시 맞춰지게 하려고, 완성도는 저니 패널 비율을 갱신하려고. 완성도는 탭 구분 없이 무효화한다 —
 * 한 섹션이 다른 탭 완성도에 들어가는지 화면은 모른다.
 */
function createBrandSectionMutation<TBody>(save: (workspaceId: string, body: TBody) => Promise<unknown>) {
  return (workspaceId: string) => {
    const invalidateQueries = useInvalidateQueries();

    return useMutation({
      mutationFn: IS_MOCK ? (_body: TBody) => mockResolve({}) : (body: TBody) => save(workspaceId, body),
      onSuccess: () => {
        invalidateQueries.single(workspaceKeys.detail(workspaceId));
        invalidateQueries.single(brandKeys.completionAll(workspaceId));
      },
    });
  };
}

export const useUpdateBrandBasic = createBrandSectionMutation(updateBrandBasic);
export const useUpdateBrandIntro = createBrandSectionMutation(updateBrandIntro);

/**
 * 섹션 저장 훅 공통 팩토리.
 *
 * 화면은 아직 기존 뷰 타입으로 값을 만든다. 새 백엔드는 필드명(snake_case)과
 * 섹션 구분이 달라서 그대로 보낼 수 없다.
 *
 * TODO(API): 뷰 → DTO 매퍼를 붙여 brand.api.ts의 update* 함수에 연결한다.
 * 그 전까지는 목 모드에서만 동작하고, 실제 호출은 명시적으로 막는다.
 */
function createSectionMutation<TView>(section: Parameters<typeof mergeMockSettings>[0]) {
  return (workspaceId: string) => {
    const invalidateQueries = useInvalidateQueries();

    return useMutation({
      mutationFn: mockMutation<TView, unknown>(
        async () => {
          throw new Error(`${section} 저장이 아직 새 API에 연결되지 않았습니다.`);
        },
        body => mergeMockSettings(section, body as object),
      ),
      onSuccess: () => {
        invalidateQueries.single(brandKeys.settings(workspaceId));
      },
    });
  };
}

export const useUpdateBrandOperation = createSectionMutation<BrandOperationView>("brandOperation");
export const useUpdateBrandContact = createSectionMutation<BrandContactView>("brandContact");

/************************************
 * 계약 및 정책
 ************************************/
export const useUpdateBrandContract = createSectionMutation<BrandContractView>("brandContract");
export const useUpdateBrandPolicy = createSectionMutation<BrandPolicyView>("brandPolicy");
export const useUpdateBrandFee = createSectionMutation<BrandFeeView>("brandFee");

/************************************
 * 상권분석 기준
 *
 * 이전 area-criteria 하나가 입지·면적·설비 셋으로 나뉘었다.
 * 화면은 아직 하나로 다루므로 입지 기준에만 연결해 둔다.
 ************************************/
export const useUpdateBrandAreaCriteria = createSectionMutation<BrandAreaCriteriaView>("brandAreaCriteria");
export const useUpdateBrandSizeCriteria = createSectionMutation<BrandAreaCriteriaView>("brandAreaCriteria");
export const useUpdateBrandFacilityReq = createSectionMutation<BrandAreaCriteriaView>("brandAreaCriteria");
