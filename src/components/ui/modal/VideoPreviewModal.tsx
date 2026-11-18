"use client";

import { useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

type Props = {
  /** 영상 주소 목록 — 같은 칸의 영상끼리 넘겨 본다 */
  videos: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
};

/** ImagePreviewModal과 같은 검은 배경·조작 버튼 모양을 쓴다 */
const CONTROL_BUTTON_CLASS =
  "size-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors";

/**
 * 영상 크게 보기 — 화면 가득 검은 배경 위에서 재생한다.
 * 사진 크게 보기(ImagePreviewModal)의 영상판이다. 확대·쓸어 넘기기는 영상 조작과 겹쳐서 두지 않는다.
 * Esc·닫기 버튼으로 닫고, 여러 개면 좌우 버튼·방향키로 넘긴다
 */
export default function VideoPreviewModal({ videos, initialIndex = 0, isOpen, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  // 열 때마다 누른 영상부터 보여준다 — 열림이 바뀌는 렌더에서 맞춘다(이펙트 없이)
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  if (isOpen && openedAt !== initialIndex) {
    setOpenedAt(initialIndex);
    setIndex(initialIndex);
  }
  if (!isOpen && openedAt !== null) {
    setOpenedAt(null);
  }

  const src = videos[index];
  const hasMultiple = videos.length > 1;
  const goTo = (next: number) => setIndex(Math.min(Math.max(next, 0), videos.length - 1));

  if (!src) {
    return null;
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/90" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onKeyDown={event => {
            // 재생 중인 영상의 방향키(앞뒤로 감기)와 겹치지 않게, 영상에 포커스가 없을 때만 넘긴다
            if (event.target instanceof HTMLVideoElement) {
              return;
            }
            if (event.key === "ArrowLeft") {
              goTo(index - 1);
            } else if (event.key === "ArrowRight") {
              goTo(index + 1);
            }
          }}
        >
          <DialogPrimitive.Title className="sr-only">영상 크게 보기</DialogPrimitive.Title>

          <div className="absolute top-4 right-0 left-0 z-10 flex items-center justify-between px-4">
            {hasMultiple ? (
              <div className="rounded-full bg-black/50 px-3 py-1.5 text-sm text-white">
                {index + 1} / {videos.length}
              </div>
            ) : (
              <div />
            )}
            <DialogPrimitive.Close className={CONTROL_BUTTON_CLASS} aria-label="닫기">
              <XIcon className="size-6" />
            </DialogPrimitive.Close>
          </div>

          {hasMultiple && index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className={`${CONTROL_BUTTON_CLASS} absolute top-1/2 left-4 z-10 -translate-y-1/2`}
              aria-label="이전 영상"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
          )}
          {hasMultiple && index < videos.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className={`${CONTROL_BUTTON_CLASS} absolute top-1/2 right-4 z-10 -translate-y-1/2`}
              aria-label="다음 영상"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          )}

          {/* key — 넘길 때 이전 영상의 재생 위치·상태를 이어받지 않게 새로 띄운다 */}
          <video
            key={src}
            src={src}
            controls
            autoPlay
            playsInline
            className="max-h-[calc(100%-8rem)] max-w-[calc(100%-8rem)] rounded-lg bg-black"
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
