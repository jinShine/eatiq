import { useState } from "react";

import { Toast } from "@components/ui";

import { IS_MOCK, mockResolve } from "@services/api/mock";
import { uploadImage, uploadVideo } from "@services/api/upload/upload.api";

import { type MediaKind, validateMedia } from "../_components/media/mediaRules";

export type PendingUpload = {
  id: string;
  previewURL: string; // 업로드가 끝나기 전 미리보기(blob)
  progress: number;
};

/**
 * 파일 검사 → S3 업로드 → url 목록을 돌려준다. 저장(PUT)은 부르는 쪽이 한다.
 *
 * 올라가는 동안의 파일은 pending으로 노출해, 칸 옆에 미리보기와 진행률을 보여줄 수 있게 한다.
 * 형식·용량이 안 맞는 파일은 토스트로 알리고 건너뛴다. 실패한 파일도 알리고 나머지는 계속한다.
 */
export default function useMediaUpload(kind: MediaKind) {
  const [pending, setPending] = useState<PendingUpload[]>([]);

  const updateProgress = (id: string, progress: number) =>
    setPending(current => current.map(item => (item.id === id ? { ...item, progress } : item)));

  const uploadOne = async (file: File): Promise<string | null> => {
    const id = crypto.randomUUID();
    const previewURL = URL.createObjectURL(file);
    setPending(current => [...current, { id, previewURL, progress: 0 }]);

    try {
      if (IS_MOCK) {
        // 목 모드는 서버가 없어 미리보기 주소를 그대로 쓴다(새로고침하면 사라진다)
        await mockResolve(null);
        return previewURL;
      }
      const upload = kind === "image" ? uploadImage : uploadVideo;
      const { url } = await upload(file, progress => updateProgress(id, progress));
      URL.revokeObjectURL(previewURL);
      return url;
    } catch (error) {
      URL.revokeObjectURL(previewURL);
      Toast.error(`${file.name}: ${error instanceof Error ? error.message : "업로드하지 못했어요"}`);
      return null;
    } finally {
      setPending(current => current.filter(item => item.id !== id));
    }
  };

  const upload = async (files: File[]): Promise<string[]> => {
    const valid = files.filter(file => {
      const problem = validateMedia(file, kind);
      if (problem) {
        Toast.error(problem);
      }
      return !problem;
    });
    const urls = await Promise.all(valid.map(uploadOne));
    return urls.filter((url): url is string => url !== null);
  };

  return { pending, isUploading: pending.length > 0, upload };
}
