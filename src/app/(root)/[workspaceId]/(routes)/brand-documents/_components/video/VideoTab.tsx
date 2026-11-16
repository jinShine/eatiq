"use client";

import { useState } from "react";

import dayjs from "dayjs";

import { Toast } from "@components/ui";

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
  const { data, isLoading } = useBrandVideo(workspaceId);
  const { mutate: generate, isPending: isRequesting } = useGenerateBrandVideoMutation(workspaceId);

  const status = data?.video_info.status;
  // 요청을 보내는 동안 + 서버가 대기·렌더링 중인 동안. 상태가 서버에 있어 탭을 떠났다 와도 이어진다
  const isGenerating = isRequesting || status === "QUEUED" || status === "PROCESSING";
  const requirements = data ? buildVideoRequirements(workspaceId, data.media_counts) : null;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = () => {
    generate(undefined, {
      onSuccess: () => Toast.success("영상을 만들기 시작했어요. 1~3분 걸려요."),
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
        isReady={Boolean(requirements?.hasEnoughImages) && requirements?.missingRequiredCount === 0}
        isDownloading={isDownloading}
        onDownload={handleDownload}
      />
    </div>
  );
}
