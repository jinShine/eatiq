import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { mockMutation, mockResolve } from "../mock";
import { mergeMockSettings, mockBrandSettings } from "./brand.mock";
import {
  type BrandAreaCriteriaView,
  type BrandBasicView,
  type BrandContactView,
  type BrandContractView,
  type BrandFeeView,
  type BrandIntroView,
  type BrandOperationView,
  type BrandPolicyView,
} from "./brand.view";

const JOURNEY_KEY_BY_TAB = {
  basic: "basicInfo",
  visual: "brandVisual",
  policy: "contractPolicy",
  area: "tradeAreaCriteria",
} as const;

export type BrandSettingsTab = keyof typeof JOURNEY_KEY_BY_TAB;

export const brandKeys = {
  all: ["brands"] as const,
  list: () => [...brandKeys.all, "list"] as const,
  settings: (workspaceId: string) => [...brandKeys.all, "settings", workspaceId] as const,
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

export function useBrandJourney(workspaceId: string, tab: BrandSettingsTab) {
  return useQuery({
    queryKey: brandKeys.settings(workspaceId),
    // TODO(API): 완성 현황은 백엔드 미개발 항목이다. 논의 후 연결한다.
    queryFn: () => mockResolve(mockBrandSettings),
    enabled: Boolean(workspaceId),
    select: settings => settings.journeys?.[JOURNEY_KEY_BY_TAB[tab]] ?? null,
  });
}

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

export const useUpdateBrandBasic = createSectionMutation<BrandBasicView>("brand");
export const useUpdateBrandIntro = createSectionMutation<BrandIntroView>("brandIntro");
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
