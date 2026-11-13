import { type WorkspaceDetailResponse } from "@services/api/workspace/workspace.type";

import { type DraftRequirements, type RequirementRow } from "../draft/draftRequirements";

/**
 * 소개 문서 「필수 자료 / 선택 자료」 행 (피그마 2262:9927, 쪽 구성 2262:11131).
 *
 * 판정은 회사 정보 설정의 저장값으로 화면이 한다. 서버도 생성 전에 같은 기준으로 다시 본다.
 * 시안과 다른 곳 —
 * - 본사 상호: 저장할 칸이 없어 뺐다(MOU·LOI와 같음)
 * - 가맹점 월평균 매출 · 가맹점 수: 시안은 「3개 연도 이상」인데 연도별 값이 없어 지금 값이 있는지만 본다
 */

type BrandSections = NonNullable<WorkspaceDetailResponse["brand"]>;

type Sources = {
  workspaceId: string;
  visual: BrandSections["brand_visual"] | undefined;
  menu: BrandSections["brand_menu"] | undefined;
  status: BrandSections["brand_status"] | undefined;
  contractPolicy: BrandSections["brand_contract_policy"] | undefined;
  intro: BrandSections["brand_intro"] | undefined;
  store: BrandSections["brand_store"] | undefined;
};

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

export function buildIntroRequirements({
  workspaceId,
  visual,
  menu,
  status,
  contractPolicy,
  intro,
  store,
}: Sources): DraftRequirements {
  const settingsHref = (tab: string, sectionId: string, field?: string) =>
    `/${workspaceId}/company-settings?tab=${tab}#${sectionId}${field ? `/${field}` : ""}`;

  /** 값이 있으면 보유, 없으면 채우러 갈 곳과 안내 */
  const row = (
    base: Pick<RequirementRow, "key" | "label" | "usedIn" | "fillHref">,
    isHave: boolean,
    missingMessage?: string,
  ): RequirementRow => ({
    ...base,
    status: isHave ? "have" : "missing",
    message: isHave ? undefined : missingMessage,
  });

  // 대표 메뉴는 이름 · 가격 · 사진이 다 있어야 메뉴 쪽에 실린다(쪽 구성 5)
  const hasCompleteMenu = (menu ?? []).some(
    item => hasText(item.name_ko) && item.price > 0 && item.image_list.length > 0,
  );

  const required = [
    row(
      { key: "logo", label: "로고", usedIn: "표지", fillHref: settingsHref("visual", "visual_identity", "logo_image") },
      hasText(visual?.logo_image),
      "브랜드 비주얼에서 로고를 올려 주세요",
    ),
    row(
      {
        key: "featured_image",
        label: "대표 이미지",
        usedIn: "표지 · 브랜드 개요",
        fillHref: settingsHref("visual", "visual_identity", "featured_image_list"),
      },
      (visual?.featured_image_list?.length ?? 0) > 0,
      "브랜드 비주얼에서 대표 이미지를 올려 주세요",
    ),
    row(
      { key: "menu", label: "대표 메뉴 1개", usedIn: "메뉴 소개", fillHref: settingsHref("visual", "visual_menu") },
      hasCompleteMenu,
      "이름 · 가격 · 사진이 다 있는 메뉴가 1개 필요해요",
    ),
    row(
      {
        key: "avg_monthly_sales",
        label: "가맹점 월평균 매출",
        usedIn: "매출 차트",
        fillHref: settingsHref("basic", "brand_status", "avg_monthly_sales"),
      },
      (status?.avg_monthly_sales ?? 0) > 0,
      "기본 정보에서 가맹점 월평균 매출을 넣어 주세요",
    ),
    row(
      {
        key: "partnership",
        label: "희망 파트너십",
        usedIn: "파트너십 조건",
        fillHref: settingsHref("policy", "target_conditions", "preferred_contract_type"),
      },
      // 13쪽은 진출 목표 국가와 선호 계약 방식이 둘 다 있어야 실린다
      hasText(contractPolicy?.target_country) && hasText(contractPolicy?.preferred_contract_type),
      "진출 목표 국가와 선호 계약 방식을 골라 주세요",
    ),
  ];

  const optional: RequirementRow[] = [
    row(
      {
        key: "brand_story",
        label: "브랜드 소개 · 차별점",
        usedIn: "브랜드 이야기",
        fillHref: settingsHref("basic", "brand_intro", "short_intro"),
      },
      hasText(intro?.short_intro) && hasText(intro?.detail_intro),
    ),
    row(
      {
        key: "store_images",
        label: "매장 사진",
        usedIn: "매장 소개",
        fillHref: settingsHref("visual", "visual_store", "image_list"),
      },
      (store?.image_list.length ?? 0) > 0,
    ),
    row(
      {
        key: "domestic_store_cnt",
        label: "가맹점 수",
        usedIn: "가맹 현황 차트",
        fillHref: settingsHref("basic", "brand_status", "domestic_store_total_cnt"),
      },
      (status?.domestic_store_total_cnt ?? 0) > 0,
    ),
    row(
      {
        key: "overseas_store_cnt",
        label: "해외 매장 수",
        usedIn: "해외 진출",
        fillHref: settingsHref("basic", "brand_status", "overseas_store_total_cnt"),
      },
      // 0개도 값이다 — 해외 매장이 없으면 「해외 파트너를 위한 정보」 쪽으로 바뀌어 실린다
      status != null,
    ),
    {
      key: "history",
      label: "연혁",
      usedIn: "타임라인",
      status: "auto",
      message: "공식 홈페이지에서 모아요 · 5건 미만이면 빠져요",
    },
  ];

  return { required, optional, missingRequiredCount: required.filter(r => r.status === "missing").length };
}
