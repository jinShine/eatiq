"use client";

import { useState } from "react";

import { PlayIcon, XIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

import { type MediaKind } from "./mediaRules";

type MediaThumbnailProps = {
  kind: MediaKind;
  src: string;
  /** square 128×128(로고·메뉴 사진) / wide 228×128(대표 이미지·대표 영상) — 피그마 186:2128 · 186:2148 */
  shape?: "square" | "wide";
  /** 화면 낭독기용 이름 — "브랜드 로고" 등 */
  label: string;
  /** 업로드 중이면 진행률(0~100). 없으면 업로드가 끝난 항목 */
  progress?: number;
  onRemove?: () => void;
  /** 누르면 크게 보기를 연다(닫을 때 포커스를 돌려줄 버튼을 넘긴다). 업로드 중에는 열지 않는다 */
  onPreview?: (trigger: HTMLElement) => void;
};

const formatDuration = (seconds: number) => {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * 업로드한 파일 미리보기. X로 지운다.
 * 영상은 첫 프레임을 보여주고 가운데 재생 표시와 왼쪽 아래 재생 시간을 얹는다(피그마 186:2169).
 * 썸네일을 누르면 크게 보기(사진 확대 · 영상 재생)를 연다 — 시안에는 없고 앱의 사진 크게 보기 모양을 따른다.
 * X는 썸네일 버튼 위에 따로 얹어 누르는 곳이 겹치지 않는다
 */
export default function MediaThumbnail({
  kind,
  src,
  shape = "square",
  label,
  progress,
  onRemove,
  onPreview,
}: MediaThumbnailProps) {
  const [duration, setDuration] = useState<number | null>(null);
  const isUploading = progress !== undefined;

  return (
    <figure
      className={cn(
        "bg-secondary-background relative h-32 shrink-0 overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
        shape === "square" ? "w-32" : "w-[228px]",
      )}
    >
      {kind === "image" ? (
        // 업로드 URL(CloudFront)과 미리보기 blob이 섞여 next/image 최적화 대상이 아니다

        <img src={src} alt={label} className="size-full object-cover" />
      ) : (
        <>
          {/* #t=0.1 — 일부 브라우저는 0초 프레임을 검게 그려서 살짝 뒤 프레임을 보여준다 */}
          <video
            src={`${src}#t=0.1`}
            preload="metadata"
            muted
            playsInline
            aria-label={label}
            className="size-full object-cover"
            onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <PlayIcon className="size-4 fill-current" />
          </span>
          {duration !== null && Number.isFinite(duration) && (
            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 text-xs leading-[18px] text-white">
              {formatDuration(duration)}
            </span>
          )}
        </>
      )}

      {onPreview && !isUploading && (
        <button
          type="button"
          onClick={event => onPreview(event.currentTarget)}
          aria-label={`${label} 크게 보기`}
          // 위에 얹은 재생 표시·시간보다 위, X보다 아래. 마우스를 올리면 살짝 어두워져 누를 수 있음을 알린다
          className="focus-visible:ring-primary absolute inset-0 cursor-pointer rounded-xl transition-colors hover:bg-black/15 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        />
      )}

      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white">
          <span className="text-sm font-semibold" aria-live="polite">
            업로드 중 {progress}%
          </span>
          <span className="h-1 w-3/4 overflow-hidden rounded-full bg-white/30">
            <span className="block h-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
          </span>
        </div>
      )}

      {onRemove && !isUploading && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 삭제`}
          // 시안의 X는 16px지만 누르기 쉽게 24px 영역을 둔다
          className="focus-visible:ring-primary absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-white/80 text-black hover:bg-white focus-visible:ring-2 focus-visible:outline-none"
        >
          <XIcon className="size-4" strokeWidth={2.25} />
        </button>
      )}
    </figure>
  );
}
