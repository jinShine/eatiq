/**
 * 업로드 파일 규칙. 서버 제한(이미지 10MB, 영상 100MB) 안에서 시안 안내 문구 기준으로 받는다.
 * - 이미지: 시안 "JPG, PNG 파일 (최대 10MB)". 서버는 webp·gif·svg도 받지만 안내와 맞춘다
 * - 영상: 시안은 "mp4 파일 (최대 10GB)"인데 서버 상한이 100MB라 100MB로 안내한다(디자인 확인 요청)
 */
export type MediaKind = "image" | "video";

type MediaRule = {
  accept: string; // <input accept>
  mimeTypes: readonly string[];
  maxBytes: number;
  /** 업로드 칸 안내 — 시안처럼 형식과 용량을 두 줄로 나눠 보여준다 */
  format: string;
  maxLabel: string;
};

const MB = 1024 * 1024;

export const MEDIA_RULES: Record<MediaKind, MediaRule> = {
  image: {
    accept: "image/jpeg,image/png",
    mimeTypes: ["image/jpeg", "image/png"],
    maxBytes: 10 * MB,
    format: "JPG, PNG 파일",
    maxLabel: "10MB",
  },
  video: { accept: "video/mp4", mimeTypes: ["video/mp4"], maxBytes: 100 * MB, format: "mp4 파일", maxLabel: "100MB" },
};

/** 올리기 전에 거른다. 문제가 있으면 안내 문구, 없으면 null */
export const validateMedia = (file: File, kind: MediaKind): string | null => {
  const rule = MEDIA_RULES[kind];
  if (!rule.mimeTypes.includes(file.type)) {
    return `${file.name}: ${rule.format}만 올릴 수 있어요`;
  }
  if (file.size > rule.maxBytes) {
    return `${file.name}: ${rule.maxLabel} 이하 파일만 올릴 수 있어요`;
  }
  return null;
};
