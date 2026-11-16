import { type BrandMediaCounts } from "@services/api/brand/brand.type";

import { type DraftRequirements, type RequirementRow } from "../draft/draftRequirements";

/**
 * 소개 영상 「필수 자료 / 선택 자료」 행 (피그마 2262:10097).
 *
 * 판정은 영상 조회 API의 재료 개수(media_counts)로 한다.
 * 매장·조리 사진은 brand_visual 쪽만 세는데, 회사 정보 설정에 올리는 칸이 아직 없어 「입력」 링크를 걸지 않는다
 * (대표 매장 사진은 영상에 쓰이지 않는다 — 121에서 대표 매장 1장, 영상 매장 개수 0으로 확인)
 */

/** 서버가 영상에 쓰는 사진 — 매장 2 · 메뉴 1 · 조리 2 · 로고 1 중 4장 이상이어야 만든다(미만이면 400) */
const MIN_VIDEO_IMAGES = 4;

export type VideoRequirements = DraftRequirements & {
  /** 서버가 실제로 쓰는 사진 수 — 메뉴 개수는 모든 메뉴의 합이라 그대로 더하면 부풀려진다 */
  usableImageCount: number;
  hasEnoughImages: boolean;
};

/** 매장 사진·영상은 외관 1 + 내부 1, 두 개가 있어야 매장 장면이 된다 */
const STORE_REQUIRED = 2;

export function buildVideoRequirements(workspaceId: string, counts: BrandMediaCounts): VideoRequirements {
  const visualHref = (sectionId: string, field?: string) =>
    `/${workspaceId}/company-settings?tab=visual#${sectionId}${field ? `/${field}` : ""}`;

  const storeCount = counts.store_image_count + counts.store_video_count;
  const cookingCount = counts.cooking_image_count + counts.cooking_video_count;

  const storeMessage =
    storeCount === 0
      ? `${STORE_REQUIRED}개 올려 주세요 (외관 1 + 내부 1 권장)`
      : `${storeCount}개 있어요 · ${STORE_REQUIRED - storeCount}개 더 올려 주세요 (외관 1 + 내부 1 권장)`;

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
      ...(storeCount >= STORE_REQUIRED ? { status: "have" } : { status: "missing", message: storeMessage }),
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
      status: cookingCount > 0 ? "have" : "missing",
      // 피그마는 보유·미보유와 관계없이 이 안내를 둔다
      message: "불 · 김 · 손 동작이 보이면 움직이는 장면이 돼요",
    },
  ];

  const usableImageCount =
    Math.min(counts.store_image_count, 2) +
    Math.min(counts.menu_image_count, 1) +
    Math.min(counts.cooking_image_count, 2) +
    Math.min(counts.logo_image_count, 1);

  return {
    required,
    optional,
    missingRequiredCount: required.filter(row => row.status === "missing").length,
    usableImageCount,
    hasEnoughImages: usableImageCount >= MIN_VIDEO_IMAGES,
  };
}

export { MIN_VIDEO_IMAGES };
