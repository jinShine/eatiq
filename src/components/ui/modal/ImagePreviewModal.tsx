"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { AnimatePresence, type PanInfo, motion, useAnimation } from "motion/react";

import { cn } from "@utils/shadcn";

// ============================================================
// Types
// ============================================================

export type ImagePreviewItem = {
  src: string;
  alt?: string;
};

type Props = {
  images: ImagePreviewItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
};

// ============================================================
// Constants
// ============================================================

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 500;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_DELAY = 300;
const CONTROL_BUTTON_CLASS =
  "size-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-40";

// ============================================================
// Utils
// ============================================================

function getDistance(touch1: React.Touch, touch2: React.Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ============================================================
// Sub Components
// ============================================================

type NavButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
};

function NavButton({ direction, onClick }: NavButtonProps) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(CONTROL_BUTTON_CLASS, "absolute top-1/2 -translate-y-1/2 z-10", isPrev ? "left-4" : "right-4")}
      aria-label={isPrev ? "이전 이미지" : "다음 이미지"}
    >
      {isPrev ? <ChevronLeftIcon className="size-6" /> : <ChevronRightIcon className="size-6" />}
    </button>
  );
}

type PaginationDotsProps = {
  total: number;
  current: number;
  onSelect: (index: number) => void;
};

function PaginationDots({ total, current, onSelect }: PaginationDotsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "size-2 rounded-full transition-all",
            index === current ? "bg-white w-4" : "bg-white/50 hover:bg-white/70",
          )}
          aria-label={`이미지 ${index + 1}로 이동`}
        />
      ))}
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

export default function ImagePreviewModal({ images, initialIndex = 0, isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [scale, setScale] = useState(1);

  const lastTapRef = useRef(0);
  const pinchRef = useRef<{ initialDistance: number | null; initialScale: number }>({
    initialDistance: null,
    initialScale: 1,
  });

  const controls = useAnimation();
  const isZoomed = scale > 1;
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentIndex];

  // Reset zoom state
  const resetZoom = useCallback(() => {
    setScale(1);
    controls.start({ x: 0, y: 0, scale: 1 });
  }, [controls]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex, resetZoom]);

  // Reset zoom on image change
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Navigation
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0 && !isZoomed) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, isZoomed]);

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1 && !isZoomed) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, images.length, isZoomed]);

  const handleSelectIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.5, MAX_SCALE);
    setScale(newScale);
    controls.start({ scale: newScale });
  }, [scale, controls]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.5, MIN_SCALE);
    setScale(newScale);
    if (newScale === 1) {
      resetZoom();
    } else {
      controls.start({ scale: newScale });
    }
  }, [scale, controls, resetZoom]);

  const handleDoubleTap = useCallback(() => {
    if (isZoomed) {
      resetZoom();
    } else {
      setScale(2);
      controls.start({ scale: 2 });
    }
  }, [isZoomed, resetZoom, controls]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      handleDoubleTap();
    }
    lastTapRef.current = now;
  }, [handleDoubleTap]);

  // Drag handler
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isZoomed) {
        return;
      }

      const { offset, velocity } = info;
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
        goToNext();
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
        goToPrevious();
      }
    },
    [goToNext, goToPrevious, isZoomed],
  );

  // Pinch-to-zoom handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchRef.current = {
          initialDistance: getDistance(e.touches[0], e.touches[1]),
          initialScale: scale,
        };
      }
    },
    [scale],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const { initialDistance, initialScale } = pinchRef.current;
      if (e.touches.length === 2 && initialDistance !== null) {
        e.preventDefault();
        const distance = getDistance(e.touches[0], e.touches[1]);
        const newScale = Math.min(Math.max(initialScale * (distance / initialDistance), MIN_SCALE), MAX_SCALE);
        setScale(newScale);
        controls.start({ scale: newScale });
      }
    },
    [controls],
  );

  const handleTouchEnd = useCallback(() => {
    pinchRef.current.initialDistance = null;
    if (scale <= 1) {
      resetZoom();
    }
  }, [scale, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          isZoomed ? resetZoom() : onClose();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose, isZoomed, resetZoom, handleZoomIn, handleZoomOut]);

  if (!currentImage) {
    return null;
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onPointerDownOutside={e => e.preventDefault()}
        >
          {/* Top controls */}
          <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4">
            {hasMultipleImages ? (
              <div className="px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={scale <= MIN_SCALE}
                className={CONTROL_BUTTON_CLASS}
                aria-label="축소"
              >
                <ZoomOutIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={scale >= MAX_SCALE}
                className={CONTROL_BUTTON_CLASS}
                aria-label="확대"
              >
                <ZoomInIcon className="size-5" />
              </button>
              <button type="button" onClick={onClose} className={CONTROL_BUTTON_CLASS} aria-label="닫기">
                <XIcon className="size-6" />
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          {hasMultipleImages && !isZoomed && (
            <>
              {currentIndex > 0 && <NavButton direction="prev" onClick={goToPrevious} />}
              {currentIndex < images.length - 1 && <NavButton direction="next" onClick={goToNext} />}
            </>
          )}

          {/* Image container */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center p-4"
              >
                <motion.img
                  src={currentImage.src}
                  alt={currentImage.alt ?? `이미지 ${currentIndex + 1}`}
                  className={cn(
                    "max-w-full max-h-full object-contain select-none touch-none",
                    isZoomed ? "cursor-move" : "cursor-zoom-in",
                  )}
                  draggable={false}
                  animate={controls}
                  drag={!pinchRef.current.initialDistance}
                  dragConstraints={
                    isZoomed
                      ? { left: -200 * scale, right: 200 * scale, top: -200 * scale, bottom: 200 * scale }
                      : { left: 0, right: 0, top: 0, bottom: 0 }
                  }
                  dragElastic={0}
                  dragMomentum={false}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
                  onDragEnd={handleDragEnd}
                  onClick={handleTap}
                  whileTap={{ cursor: "grabbing" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Zoom indicator */}
          {isZoomed && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs">
              {Math.round(scale * 100)}% · 더블탭으로 원래 크기
            </div>
          )}

          {/* Pagination dots */}
          {hasMultipleImages && !isZoomed && (
            <PaginationDots total={images.length} current={currentIndex} onSelect={handleSelectIndex} />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
