import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockMutation, mockResolve } from "../mock";
import {
  getBrandSettings,
  getBrands,
  updateBrandAreaCriteria,
  updateBrandBasic,
  updateBrandContact,
  updateBrandContract,
  updateBrandFee,
  updateBrandIntro,
  updateBrandOperation,
  updateBrandPolicy,
} from "./brand.api";
import { mergeMockSettings, mockBrandSettings, mockBrandsPage } from "./brand.mock";
import {
  type UpdateAreaCriteriaRequest,
  type UpdateBasicRequest,
  type UpdateContactRequest,
  type UpdateContractRequest,
  type UpdateFeeRequest,
  type UpdateIntroRequest,
  type UpdateOperationRequest,
  type UpdatePolicyRequest,
} from "./brand.type";

const JOURNEY_KEY_BY_TAB = {
  basic: "basicInfo",
  visual: "brandVisual",
  policy: "contractPolicy",
  area: "tradeAreaCriteria",
} as const;

export type BrandSettingsTab = keyof typeof JOURNEY_KEY_BY_TAB;

export type Workspace = {
  id: string;
  name: string;
};

// brand(API) → workspace(뷰모델) 매핑. id/nameKo만 가진 형태면 모두 수용
const toWorkspace = (b: { id?: string; nameKo?: string }): Workspace => ({
  id: b.id ?? "",
  name: b.nameKo ?? "",
});

export const brandKeys = {
  all: ["brands"] as const,
  list: () => [...brandKeys.all, "list"] as const,
  current: () => [...brandKeys.all, "current"] as const,

  settings: (workspaceId: string) => [...brandKeys.all, "settings", workspaceId] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: brandKeys.list(),
    queryFn: IS_MOCK ? () => mockResolve(mockBrandsPage) : getBrands,
    select: page => (page.content ?? []).map(toWorkspace),
  });
}

/************************************
 * 브랜드 정보 설정
 ************************************/
export function useBrandSettings(workspaceId: string) {
  return useQuery({
    queryKey: brandKeys.settings(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockBrandSettings) : () => getBrandSettings(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useUpdateBrandBasic(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateBasicRequest) => updateBrandBasic(workspaceId, body),
      body => mergeMockSettings("brand", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

export function useBrandJourney(workspaceId: string, tab: BrandSettingsTab) {
  return useQuery({
    queryKey: brandKeys.settings(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockBrandSettings) : () => getBrandSettings(workspaceId),
    enabled: Boolean(workspaceId),
    select: settings => settings.journeys?.[JOURNEY_KEY_BY_TAB[tab]] ?? null,
  });
}

export function useUpdateBrandIntro(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateIntroRequest) => updateBrandIntro(workspaceId, body),
      body => mergeMockSettings("brandIntro", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

export function useUpdateBrandOperation(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateOperationRequest) => updateBrandOperation(workspaceId, body),
      body => mergeMockSettings("brandOperation", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

export function useUpdateBrandContact(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateContactRequest) => updateBrandContact(workspaceId, body),
      body => mergeMockSettings("brandContact", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

/************************************
 * 계약 및 정책
 ************************************/

export function useUpdateBrandContract(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateContractRequest) => updateBrandContract(workspaceId, body),
      body => mergeMockSettings("brandContract", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

export function useUpdateBrandPolicy(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdatePolicyRequest) => updateBrandPolicy(workspaceId, body),
      body => mergeMockSettings("brandPolicy", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

export function useUpdateBrandFee(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateFeeRequest) => updateBrandFee(workspaceId, body),
      body => mergeMockSettings("brandFee", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}

/************************************
 * 상권분석 기준
 ************************************/

export function useUpdateBrandAreaCriteria(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: mockMutation(
      (body: UpdateAreaCriteriaRequest) => updateBrandAreaCriteria(workspaceId, body),
      body => mergeMockSettings("brandAreaCriteria", body),
    ),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}
