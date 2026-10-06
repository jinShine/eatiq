"use client";

import { useState } from "react";

import { Toast } from "@components/ui";

import { withParticle } from "@utils/functions";

import useMediaUpload from "../../_hooks/useMediaUpload";
import MediaRemoveModal from "./MediaRemoveModal";
import MediaThumbnail from "./MediaThumbnail";
import MediaUploadTile from "./MediaUploadTile";
import { type MediaKind } from "./mediaRules";

type VisualAssetCardProps = {
  title: string;
  description: string;
  /** 완성도 필수 항목(피그마 "완성 필수 변수") */
  required?: boolean;
  /** 완성도 API field_key — 저니 패널이 업로드 칸으로 포커스한다 */
  name: string;
  kind: MediaKind;
  shape: "square" | "wide";
  /** 1이면 하나만(새로 올리면 교체), 그 이상이면 목록 */
  max: number;
  /** 저장된 파일 url */
  urls: string[];
  /** 바뀐 목록 전체를 저장한다(PUT 전체 치환). 실패하면 throw */
  onSave: (urls: string[]) => Promise<unknown>;
};

/**
 * 비주얼 카드 하나 — 브랜드 로고·대표 이미지·대표 영상 (피그마 186:2113 · 186:2133 · 186:2153).
 *
 * 시안에 저장 버튼이 없어서 올리거나 지우면 바로 저장한다.
 * 저장하는 동안에는 바뀐 목록을 먼저 보여주고(낙관적 표시), 실패하면 저장된 목록으로 되돌린다.
 */
export default function VisualAssetCard({
  title,
  description,
  required = false,
  name,
  kind,
  shape,
  max,
  urls,
  onSave,
}: VisualAssetCardProps) {
  const { pending, isUploading, upload } = useMediaUpload(kind);
  const [optimistic, setOptimistic] = useState<string[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const shown = optimistic ?? urls;
  const isBusy = isUploading || isSaving;

  const save = async (next: string[], successMessage: string) => {
    setOptimistic(next);
    setIsSaving(true);
    try {
      // 저장 훅이 서버 값을 다시 받아온 뒤에 끝난다. 그래서 낙관적 표시를 걷어도 옛 목록이 깜빡이지 않는다.
      // 서버 값이 바뀌었는지(urls)로 판단하면, 저장 결과가 이전과 같을 때(빈 목록 → 빈 목록) 표시가 남는다
      await onSave(next);
      Toast.success(successMessage);
    } catch (error) {
      Toast.error(error instanceof Error ? error.message : "저장하지 못했어요");
    } finally {
      setOptimistic(null);
      setIsSaving(false);
    }
  };

  const handleSelect = async (files: File[]) => {
    const room = max === 1 ? 1 : max - shown.length;
    if (room <= 0) {
      Toast.error(`${withParticle(title, "은", "는")} 최대 ${max}개까지 올릴 수 있어요`);
      return;
    }
    if (files.length > room) {
      Toast.error(`${withParticle(title, "은", "는")} 최대 ${max}개까지라 ${room}개만 올려요`);
    }
    const uploaded = await upload(files.slice(0, room));
    if (uploaded.length === 0) {
      return;
    }
    await save(
      max === 1 ? uploaded.slice(0, 1) : [...shown, ...uploaded],
      `${withParticle(title, "을", "를")} 저장했어요`,
    );
  };

  const handleRemove = async () => {
    if (!removeTarget) {
      return;
    }
    const target = removeTarget;
    setRemoveTarget(null);
    await save(
      shown.filter(url => url !== target),
      `${title}에서 파일을 지웠어요`,
    );
  };

  return (
    <div className="border-border overflow-hidden rounded-2xl border">
      {/* 헤더 — SettingsSection과 같은 모양 */}
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-text-primary text-base font-bold tracking-tight">
          {title}
          {required && (
            <span aria-hidden className="text-error ml-1">
              *
            </span>
          )}
        </h3>
        <p className="text-text-tertiary mt-0.5 text-sm">{description}</p>
      </div>

      {/* 본문 여백 — 피그마 CardBody: 위 20 · 좌우·아래 24 */}
      <div className="flex flex-wrap items-start gap-6 px-6 pt-5 pb-6">
        <MediaUploadTile
          kind={kind}
          name={name}
          multiple={max > 1}
          disabled={isBusy || (max > 1 && shown.length >= max)}
          onSelect={handleSelect}
        />
        {(shown.length > 0 || pending.length > 0) && (
          <ul className="flex flex-wrap gap-5" aria-label={`${title} 목록`}>
            {shown.map(url => (
              <li key={url}>
                <MediaThumbnail
                  kind={kind}
                  shape={shape}
                  src={url}
                  label={title}
                  onRemove={isBusy ? undefined : () => setRemoveTarget(url)}
                />
              </li>
            ))}
            {pending.map(item => (
              <li key={item.id}>
                <MediaThumbnail
                  kind={kind}
                  shape={shape}
                  src={item.previewURL}
                  label={`${title} 업로드 중`}
                  progress={item.progress}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <MediaRemoveModal
        label={removeTarget ? title : null}
        isPending={isSaving}
        onOpenChange={open => !open && setRemoveTarget(null)}
        onConfirm={handleRemove}
      />
    </div>
  );
}
