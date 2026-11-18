"use client";

import { useRef, useState } from "react";

import { ImagePreviewModal, VideoPreviewModal } from "@components/ui";

import { type MediaKind } from "./mediaRules";

type MediaPreviewProps = {
  kind: MediaKind;
  /** 같은 칸의 파일 주소 — 이 안에서 넘겨 본다 */
  urls: string[];
  /** 누른 파일 위치. null이면 닫혀 있다 */
  index: number | null;
  /** 칸 이름 — 사진 대체 글자에 쓴다 */
  label: string;
  onClose: () => void;
};

/**
 * 크게 보기 열림 상태 — 몇 번째를 열었는지와, 닫을 때 포커스를 돌려줄 썸네일 버튼.
 * 썸네일은 Dialog 트리거가 아니라서 닫히면 포커스가 body로 빠진다. 키보드로 보던 위치를 잃지 않게 직접 돌려준다
 */
export function useMediaPreview() {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (nextIndex: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIndex(nextIndex);
  };

  const close = () => {
    setIndex(null);
    // 닫히는 Dialog가 포커스를 정리한 다음에 돌려준다
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return { index, open, close };
}

/** 썸네일을 누르면 여는 크게 보기 — 사진은 확대·넘기기, 영상은 재생 */
export default function MediaPreview({ kind, urls, index, label, onClose }: MediaPreviewProps) {
  if (kind === "video") {
    return <VideoPreviewModal videos={urls} initialIndex={index ?? 0} isOpen={index !== null} onClose={onClose} />;
  }

  return (
    <ImagePreviewModal
      images={urls.map((src, i) => ({ src, alt: urls.length > 1 ? `${label} ${i + 1}` : label }))}
      initialIndex={index ?? 0}
      isOpen={index !== null}
      onClose={onClose}
    />
  );
}
