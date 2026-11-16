import { Button, Skeleton } from "@components/ui";

import { type BrandVideoInfo } from "@services/api/brand/brand.type";

/** 피그마 세로 카드 560 × 776 */
const CARD_MAX_WIDTH = 560;
const CARD_ASPECT_RATIO = 560 / 776;

type VideoPreviewProps = {
  /** 영상 조회 전에는 null */
  videoInfo: BrandVideoInfo | null;
  isLoading: boolean;
  isGenerating: boolean;
  /** 필수 자료가 모두 있어 바로 만들 수 있다 — 빈 화면 안내가 달라진다 */
  isReady: boolean;
  isDownloading: boolean;
  onDownload: (videoUrl: string) => void;
};

/** 소개 영상 오른쪽 — 미리보기와 영상 다운로드 (피그마 2262:10097) */
export default function VideoPreview({
  videoInfo,
  isLoading,
  isGenerating,
  isReady,
  isDownloading,
  onDownload,
}: VideoPreviewProps) {
  const videoUrl = videoInfo?.status === "COMPLETED" ? videoInfo.video_url : null;

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="border-border flex h-14 items-center justify-between gap-3 border-b px-5">
        <h2 className="text-text-primary text-lg font-bold">미리보기</h2>
        <Button
          size="sm"
          disabled={!videoUrl || isGenerating}
          isLoading={isDownloading}
          onClick={() => videoUrl && onDownload(videoUrl)}
        >
          영상 다운로드
        </Button>
      </div>

      <div className="flex flex-1 justify-center px-5 py-10">
        <div className="w-full" style={{ maxWidth: CARD_MAX_WIDTH }}>
          {isLoading || isGenerating ? (
            <GeneratingCard isGenerating={isGenerating} />
          ) : videoUrl ? (
            // 다시 만들면 이전 영상은 서버가 지운다. key로 주소가 바뀔 때 플레이어를 새로 띄운다
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              // 영상은 9:16(720×1280)이라 카드 폭에 맞추면 양옆이 검게 빈다. 카드 높이 안에서 제 비율로 가운데 둔다
              className="border-border mx-auto block h-auto max-h-[776px] w-auto max-w-full rounded-sm border bg-black shadow-sm"
            />
          ) : (
            <EmptyCard>
              {videoInfo?.status === "FAILED" ? (
                <>
                  <p className="text-text-primary font-semibold">영상을 만들지 못했어요.</p>
                  <p className="text-text-tertiary">왼쪽의 다시 생성하기로 다시 시도해 주세요.</p>
                </>
              ) : videoInfo?.status === "COMPLETED" ? (
                <p className="text-text-primary">영상 주소를 받지 못했어요. 다시 생성해 주세요.</p>
              ) : (
                <p className="text-text-primary">
                  {isReady ? "생성하기를 누르면 여기에 영상이 보여요" : "필수 자료를 채우면 영상을 만들 수 있어요"}
                </p>
              )}
            </EmptyCard>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-border flex w-full flex-col items-center justify-center gap-1 rounded-sm border bg-white p-6 text-center text-sm break-keep shadow-sm"
      style={{ aspectRatio: CARD_ASPECT_RATIO }}
    >
      {children}
    </div>
  );
}

/** 조회 중·만드는 중 — 카드 자리를 그대로 두고 채운다 */
function GeneratingCard({ isGenerating }: { isGenerating: boolean }) {
  return (
    <div
      className="border-border relative w-full overflow-hidden rounded-sm border bg-white shadow-sm"
      style={{ aspectRatio: CARD_ASPECT_RATIO }}
      aria-busy
      aria-label={isGenerating ? "영상을 만드는 중" : "영상을 불러오는 중"}
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      {isGenerating && (
        <p className="text-text-secondary absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm break-keep">
          영상을 만들고 있어요. 몇 분 걸려요.
        </p>
      )}
    </div>
  );
}
