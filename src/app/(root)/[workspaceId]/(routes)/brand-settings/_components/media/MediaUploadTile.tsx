"use client";

import { useRef } from "react";

import { ClapperboardIcon, CloudUploadIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

import { MEDIA_RULES, type MediaKind } from "./mediaRules";

type MediaUploadTileProps = {
  kind: MediaKind;
  multiple?: boolean;
  disabled?: boolean;
  onSelect: (files: File[]) => void;
};

/**
 * 업로드 칸 (피그마 186:2120) — 128×128, 아이콘 + "이미지/영상 업로드" + 형식·용량 안내.
 * 칸 전체가 버튼이라 키보드로도 연다. 고른 파일은 그대로 넘기고, 검사·업로드는 쓰는 쪽(useMediaUpload)이 한다.
 */
export default function MediaUploadTile({ kind, multiple = false, disabled = false, onSelect }: MediaUploadTileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rule = MEDIA_RULES[kind];
  const Icon = kind === "image" ? CloudUploadIcon : ClapperboardIcon;
  const title = kind === "image" ? "이미지 업로드" : "영상 업로드";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "border-border bg-background flex size-32 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-2 text-center transition-colors",
        "hover:bg-secondary-background focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <Icon aria-hidden className="text-text-primary size-6" strokeWidth={1.75} />
      <span className="text-text-primary text-lg font-bold tracking-[-0.9px] whitespace-nowrap">{title}</span>
      <span className="text-text-tertiary text-sm leading-[21px] font-medium tracking-[-0.7px]">
        {rule.format}
        <br />
        (최대 {rule.maxLabel})
      </span>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={rule.accept}
        multiple={multiple}
        onChange={event => {
          const input = event.currentTarget;
          const files = Array.from(input.files ?? []);
          // 같은 파일을 다시 고를 수 있게 비운다(같은 값이면 change가 안 일어난다)
          input.value = "";
          if (files.length > 0) {
            onSelect(files);
          }
        }}
      />
    </button>
  );
}
