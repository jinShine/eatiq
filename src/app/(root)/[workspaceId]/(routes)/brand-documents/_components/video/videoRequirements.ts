import { type BrandMediaCounts } from "@services/api/brand/brand.type";

import { type DraftRequirements, type RequirementRow } from "../draft/draftRequirements";

/**
 * 소개 영상 「필수 자료 / 선택 자료」 행 (피그마 2262:10097).
 *
 * 판정은 영상 조회 API의 재료 개수(media_counts)로 한다.
 * 서버 조건(11-16 스펙)은 대표 메뉴 사진 1장 · 매장/인테리어 사진 2장 · 로고 1장이고, 못 채우면 생성 요청이 400으로 거절된다.
 * 영상은 사진만 이어 붙여 만든다(매장 1·2번째 → 메뉴 → 조리 1·2번째 → 로고). 올려 둔 영상은 쓰이지 않아 세지 않는다.
 *
 * 매장·조리 사진은 brand_visual 쪽만 세는데, 회사 정보 설정에 올리는 칸이 아직 없어 「입력」 링크를 걸지 않는다
 * (대표 매장 사진은 영상에 쓰이지 않는다 — 121에서 대표 매장 1장, 영상 매장 개수 0으로 확인)
 */

/** 매장 사진은 외관 1 + 내부 1, 두 장이 있어야 매장 장면이 된다 */
const STORE_PHOTO_REQUIRED = 2;

export function buildVideoRequirements(workspaceId: string, counts: BrandMediaCounts): DraftRequirements {
  const visualHref = (sectionId: string, field?: string) =>
    `/${workspaceId}/company-settings?tab=visual#${sectionId}${field ? `/${field}` : ""}`;

  const storePhotoCount = counts.store_image_count;

  // 피그마 문구는 「N개」지만 사진만 세므로 「장」으로 적는다
  const storeMessage =
    storePhotoCount === 0
      ? `사진 ${STORE_PHOTO_REQUIRED}장을 올려 주세요 (외관 1 + 내부 1 권장)`
      : `${storePhotoCount}장 있어요 · ${STORE_PHOTO_REQUIRED - storePhotoCount}장 더 올려 주세요 (외관 1 + 내부 1 권장)`;

  const required: RequirementRow[] = [
    {
      key: "menu_image",
      label: "대표 메뉴 사진",
      usedIn: "메뉴 장면",
      ...(counts.menu_image_count > 0
        ? { status: "have" }
        : {
            status: "missing",
            fillHref: visualHref("visual_menu"),
            message: "대표 메뉴에 사진을 1장 올려 주세요",
          }),
    },
    {
      key: "store_media",
      label: "매장 · 인테리어 사진 · 영상",
      usedIn: "매장 장면",
      // 올리는 칸이 없어 링크 없이 「준비 중」으로 둔다
      ...(storePhotoCount >= STORE_PHOTO_REQUIRED ? { status: "have" } : { status: "missing", message: storeMessage }),
    },
    {
      key: "logo_image",
      label: "브랜드 로고",
      usedIn: "마지막 장면",
      ...(counts.logo_image_count > 0
        ? { status: "have" }
        : {
            status: "missing",
            fillHref: visualHref("visual_identity", "logo_image"),
            message: "브랜드 비주얼에서 로고를 올려 주세요",
          }),
    },
  ];

  const optional: RequirementRow[] = [
    {
      key: "cooking_media",
      label: "조리 사진 · 영상",
      usedIn: "조리 장면",
      status: counts.cooking_image_count > 0 ? "have" : "missing",
      // 피그마는 보유·미보유와 관계없이 이 안내를 둔다
      message: "불 · 김 · 손 동작이 보이면 움직이는 장면이 돼요",
    },
  ];

  return {
    required,
    optional,
    missingRequiredCount: required.filter(row => row.status === "missing").length,
  };
}
