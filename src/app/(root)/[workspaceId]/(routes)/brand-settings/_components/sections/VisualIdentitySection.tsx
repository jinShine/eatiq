"use client";

import {
  useBrandSection,
  useUpdateBrandFeaturedImages,
  useUpdateBrandFeaturedVideos,
  useUpdateBrandLogo,
} from "@services/api/brand/brand.query";

import VisualAssetCard from "../media/VisualAssetCard";

/**
 * 이미지 자산 — 브랜드 로고·대표 이미지·대표 영상 (피그마 769:3837의 186:2111).
 * 완성도 API의 visual_identity 묶음이다. 로고·대표 이미지가 완성도 필수.
 *
 * 대표 이미지·영상은 API가 여러 개를 받지만 서버에 개수 제한이 없어 임시로 10개까지 둔다(백엔드 확인 중).
 */
const MAX_FEATURED = 10;

type VisualIdentitySectionProps = {
  workspaceId: string;
};

export default function VisualIdentitySection({ workspaceId }: VisualIdentitySectionProps) {
  const { data: visual } = useBrandSection(workspaceId, "brand_visual");
  const { mutateAsync: saveLogo } = useUpdateBrandLogo(workspaceId);
  const { mutateAsync: saveImages } = useUpdateBrandFeaturedImages(workspaceId);
  const { mutateAsync: saveVideos } = useUpdateBrandFeaturedVideos(workspaceId);

  return (
    <div className="space-y-3">
      <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">이미지 자산</h2>

      <VisualAssetCard
        title="브랜드 로고"
        description="다른 회사에서 우리 브랜드를 찾을 때 표시됩니다."
        required
        name="logo_image"
        kind="image"
        shape="square"
        max={1}
        urls={visual?.logo_image ? [visual.logo_image] : []}
        // 지우면 빈 목록 → null로 보낸다(서버: null이면 로고 제거)
        onSave={urls => saveLogo({ logo_image: urls[0] ?? null })}
      />
      <VisualAssetCard
        title="브랜드 대표 이미지"
        description="우리 회사를 대표하는 커버 이미지를 등록해주세요. 회사 소개 자료를 만들 때 핵심 자료로 들어갑니다."
        required
        name="featured_image_list"
        kind="image"
        shape="wide"
        max={MAX_FEATURED}
        urls={visual?.featured_image_list ?? []}
        onSave={urls => saveImages({ featured_image_list: urls })}
      />
      <VisualAssetCard
        title="브랜드 대표 영상"
        description="우리 회사를 대표하는 영상을 등록해주세요. 회사 소개 자료를 만들 때 핵심 자료로 들어갑니다."
        name="featured_video_list"
        kind="video"
        shape="wide"
        max={MAX_FEATURED}
        urls={visual?.featured_video_list ?? []}
        onSave={urls => saveVideos({ featured_video_list: urls })}
      />
    </div>
  );
}
