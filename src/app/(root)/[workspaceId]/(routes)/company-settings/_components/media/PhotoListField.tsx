"use client";

import { Toast } from "@components/ui";

import { withParticle } from "@utils/functions";

import useMediaUpload from "../../_hooks/useMediaUpload";
import MediaThumbnail from "./MediaThumbnail";
import MediaUploadTile from "./MediaUploadTile";

type PhotoListFieldProps = {
  /** 칸 이름 — "메뉴 사진", "매장 사진" */
  label: string;
  /** 업로드 칸의 name — 완성도 API field_key. 저니 패널이 이 칸으로 포커스한다 */
  name?: string;
  /** 들어간 사진 url */
  urls: string[];
  max: number;
  /** 업로드가 끝난 url을 붙인다. 업로드 중 탭을 옮겨도 원래 메뉴에 붙도록 부르는 쪽이 메뉴 위치를 쥐고 있다 */
  onAdd: (urls: string[]) => void;
  onRemove: (url: string) => void;
};

/**
 * 폼 안의 사진 목록 — 메뉴 사진(피그마 769:3895) · 매장 사진(186:2209). 업로드 칸 + 128px 썸네일.
 *
 * 비주얼 카드와 달리 바로 저장하지 않는다. 다른 입력칸과 함께 저장 버튼으로 한 번에 보낸다.
 * 그래서 지울 때 확인 모달 없이 폼 값에서만 뺀다(저장 전이라 서버에는 그대로 있다).
 */
export default function PhotoListField({ label, name, urls, max, onAdd, onRemove }: PhotoListFieldProps) {
  const { pending, upload } = useMediaUpload("image");
  const room = max - urls.length - pending.length;

  const handleSelect = async (files: File[]) => {
    if (files.length > room) {
      Toast.error(`${withParticle(label, "은", "는")} 최대 ${max}장까지라 ${Math.max(room, 0)}장만 올려요`);
    }
    const uploaded = await upload(files.slice(0, Math.max(room, 0)));
    if (uploaded.length > 0) {
      onAdd(uploaded);
    }
  };

  return (
    <div>
      <p className="text-text-primary mb-1.5 text-xs font-medium">{label}</p>
      <div className="flex flex-wrap items-start gap-6">
        <MediaUploadTile kind="image" name={name} multiple disabled={room <= 0} onSelect={handleSelect} />
        {(urls.length > 0 || pending.length > 0) && (
          <ul className="flex flex-wrap gap-5" aria-label={`${label} 목록`}>
            {urls.map(url => (
              <li key={url}>
                <MediaThumbnail kind="image" src={url} label={label} onRemove={() => onRemove(url)} />
              </li>
            ))}
            {pending.map(item => (
              <li key={item.id}>
                <MediaThumbnail
                  kind="image"
                  src={item.previewURL}
                  label={`${label} 업로드 중`}
                  progress={item.progress}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
