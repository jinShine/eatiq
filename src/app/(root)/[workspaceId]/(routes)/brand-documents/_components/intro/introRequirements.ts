import { type WorkspaceDetailResponse } from "@services/api/workspace/workspace.type";

import { type DraftRequirements, type RequirementRow } from "../draft/draftRequirements";

/**
 * 소개 문서 「필수 자료 / 선택 자료」 행 (피그마 2262:9927, 쪽 구성 2262:11131).
 *
 * 판정은 회사 정보 설정의 저장값으로 화면이 한다. 서버도 생성 전에 같은 기준으로 다시 본다.
 * 시안과 다른 곳 —
 * - 본사 상호: 저장할 칸이 없어 뺐다(MOU·LOI와 같음)
 * - 매출은 기획 변경(2026-11-18)으로 월평균 대신 연평균이다
 *
 * 가맹점 연평균 매출 · 가맹점 수는 시안대로 「3개 연도 이상」 — 회사 정보 설정 › 기본 정보 › 연도별 실적(yearly_sales) 기준
 */

/** 차트를 그리려면 연도가 이만큼은 있어야 한다(시안) */
const MIN_YEARS = 3;

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

// 스펙과 다른 모양(예: 127의 target_country 배열)이 와도 화면이 죽지 않게 문자열만 값으로 본다.
// 회사 정보 설정도 문자열이 아니면 빈 값으로 보여주므로 판정이 같아진다.
const hasText = (value: unknown) => typeof value === "string" && value.trim() !== "";

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

  // 0은 「입력 안 됨」으로 본다 — 서버가 빈 값을 0으로 보내는 해가 있다
  const yearly = status?.yearly_sales ?? [];
  const salesYears = yearly.filter(item => (item.avg_annual_sales ?? 0) > 0).length;
  const franchiseYears = yearly.filter(item => (item.franchise_count ?? 0) > 0).length;

  // 대표 메뉴는 이름 · 가격 · 사진이 다 있어야 메뉴 쪽에 실린다(쪽 구성 5)
  const hasCompleteMenu = (menu ?? []).some(
    item => hasText(item.name_ko) && (item.price ?? 0) > 0 && (item.image_list?.length ?? 0) > 0,
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
        key: "avg_annual_sales",
        label: `가맹점 연평균 매출 (${MIN_YEARS}개 연도 이상)`,
        usedIn: "매출 차트",
        fillHref: settingsHref("basic", "brand_yearly"),
      },
      salesYears >= MIN_YEARS,
      `기본 정보 › 연도별 실적에 ${MIN_YEARS}개 연도 이상 넣어 주세요 · 지금 ${salesYears}개 연도`,
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
        key: "franchise_count",
        label: `가맹점 수 (${MIN_YEARS}개 연도 이상)`,
        usedIn: "가맹 현황 차트",
        fillHref: settingsHref("basic", "brand_yearly"),
      },
      franchiseYears >= MIN_YEARS,
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
