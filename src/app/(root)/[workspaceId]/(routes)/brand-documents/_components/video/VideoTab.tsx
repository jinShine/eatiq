"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { TriangleAlert } from "lucide-react";

import { Button, Toast } from "@components/ui";

import { useBrandVideo, useGenerateBrandVideoMutation } from "@services/api/brand/brand.query";

import { downloadFromUrl } from "@utils/functions/file";

import VideoPanel from "./VideoPanel";
import VideoPreview from "./VideoPreview";
import { buildVideoRequirements } from "./videoRequirements";

type VideoTabProps = {
  workspaceId: string;
};

/** 소개 영상 생성 탭 — 워크스페이스당 영상 하나, 다시 만들면 이전 영상을 서버가 지운다 */
export default function VideoTab({ workspaceId }: VideoTabProps) {
  const { data, isLoading, isLoadingError, error, refetch } = useBrandVideo(workspaceId);
  const { mutate: generate, isPending: isRequesting } = useGenerateBrandVideoMutation(workspaceId);

  const status = data?.video_info.status;
  // 요청을 보내는 동안 + 서버가 대기·렌더링 중인 동안. 상태가 서버에 있어 탭을 떠났다 와도 이어진다
  const isGenerating = isRequesting || status === "QUEUED" || status === "PROCESSING";
  const requirements = data ? buildVideoRequirements(workspaceId, data.media_counts) : null;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = () => {
    generate(undefined, {
      onSuccess: () => Toast.success("영상을 만들기 시작했어요. 몇 분 걸려요."),
      onError: error => Toast.error(error.message || "영상을 만들지 못했어요. 다시 시도해주세요."),
    });
  };

  // 영상은 다른 주소(저장소)에 있어 a[download]만으로는 새 탭에서 재생된다. 받아서 파일로 저장한다
  const handleDownload = async (videoUrl: string) => {
    const date = dayjs(data?.video_info.completed_time ?? undefined).format("YYYYMMDD");
    setIsDownloading(true);
    try {
      await downloadFromUrl(videoUrl, { fileName: `소개영상_${date}.mp4` });
    } catch {
      Toast.error("영상을 받지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 처음 조회부터 실패하면 자료 판정도 미리보기도 그릴 수 없다 — 빈 패널 대신 사유와 다시 시도를 보여준다.
  // 한 번이라도 받았으면(생성 중 주기 조회가 한 번 실패한 경우 등) 직전 값을 그대로 둔다.
  // 다시 시도를 누르면 받은 값이 없는 조회라 대기 상태로 돌아가 아래 로딩 화면이 보인다
  if (isLoadingError) {
    return (
      <div className="flex flex-1 flex-col items-center py-20 text-center">
        <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
          <TriangleAlert className="size-5" strokeWidth={1.5} />
        </div>
        <p className="text-text-primary mt-5 text-sm font-semibold">영상 정보를 불러오지 못했어요</p>
        <p className="text-text-tertiary mt-1.5 text-xs">{error.message || "잠시 후 다시 시도해주세요."}</p>
        <Button variant="outline" size="sm" className="mt-6" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    // 소개 문서·MOU·LOI와 같은 틀 — 왼쪽 패널 고정 폭(피그마 354px), 오른쪽 미리보기
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-border w-full shrink-0 border-b lg:w-[354px] lg:border-r lg:border-b-0">
        <VideoPanel
          requirements={requirements}
          hasVideo={status === "COMPLETED" || status === "FAILED"}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      </aside>
      <VideoPreview
        videoInfo={data?.video_info ?? null}
        isLoading={isLoading}
        isGenerating={isGenerating}
        isReady={requirements?.missingRequiredCount === 0}
        isDownloading={isDownloading}
        onDownload={handleDownload}
      />
    </div>
  );
}
