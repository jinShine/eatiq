import { Button } from "@components/ui";

import RequirementGroup from "../draft/RequirementGroup";
import { MIN_VIDEO_IMAGES, type VideoRequirements } from "./videoRequirements";

type VideoPanelProps = {
  /** 재료 개수를 받기 전에는 null */
  requirements: VideoRequirements | null;
  /** 이미 만든(또는 실패한) 영상이 있다 — 버튼을 「다시 생성하기」로 */
  hasVideo: boolean;
  /** 생성 요청 중이거나 서버가 대기·렌더링 중 */
  isGenerating: boolean;
  onGenerate: () => void;
};

/**
 * 소개 영상 왼쪽 패널 (피그마 2262:10204) — 필수 → 선택 → 생성하기 → 안내.
 * 필수가 비었거나 서버가 쓸 사진이 4장 미만이면 생성하기를 막는다
 */
export default function VideoPanel({ requirements, hasVideo, isGenerating, onGenerate }: VideoPanelProps) {
  const missingCount = requirements?.missingRequiredCount ?? 0;
  const canGenerate = Boolean(requirements?.hasEnoughImages) && missingCount === 0 && !isGenerating;

  const guide = isGenerating
    ? "영상을 만들고 있어요.\n몇 분 걸려요. 이 화면을 떠나도 계속 만들어요."
    : !requirements
      ? ""
      : missingCount > 0
        ? `필수 자료 ${missingCount}개가 비어 있어요.\n채우면 영상을 만들 수 있어요.`
        : !requirements.hasEnoughImages
          ? `영상에 쓸 사진이 ${requirements.usableImageCount}장이에요.\n${MIN_VIDEO_IMAGES}장 이상이어야 만들 수 있어요.`
          : "필수 자료가 모두 채워졌어요.\n조리 사진 · 영상이 있으면 움직임이 더 커져요.";

  // 막혀 있으면 빨강(피그마), 진행·준비 완료는 기본 글자색
  const isBlocked = !isGenerating && Boolean(requirements) && !canGenerate;

  return (
    // 필수 묶음은 맨 위라 구분선 없이 시작한다
    <div className="flex flex-col gap-5 p-6 [&>section:first-child]:border-t-0 [&>section:first-child]:pt-0">
      {requirements && (
        <>
          <RequirementGroup
            title="필수 자료"
            description="모두 있어야 영상을 만들 수 있어요"
            rows={requirements.required}
            isRequired
          />
          <RequirementGroup
            title="선택 자료"
            description="없어도 만들 수 있어요 · 있으면 영상 움직임이 크게 올라가요"
            rows={requirements.optional}
            isRequired={false}
          />
        </>
      )}

      <section className="border-border flex flex-col gap-3 border-t pt-5">
        <Button className="w-full" disabled={!canGenerate} isLoading={isGenerating} onClick={onGenerate}>
          {hasVideo ? "다시 생성하기" : "생성하기"}
        </Button>
        {guide && (
          <p
            className={
              isBlocked
                ? "text-destructive text-sm whitespace-pre-line break-keep"
                : "text-text-secondary text-sm whitespace-pre-line break-keep"
            }
          >
            {guide}
          </p>
        )}
      </section>
    </div>
  );
}
