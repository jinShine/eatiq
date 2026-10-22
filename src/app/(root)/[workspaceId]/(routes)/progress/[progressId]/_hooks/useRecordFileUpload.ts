import { useRef, useState } from "react";

import { IS_MOCK, mockResolve } from "@services/api/mock";
import { uploadFile } from "@services/api/upload/upload.api";

import { getFileExtension } from "@utils/functions";

import { type ActionFileFormValues } from "../_components/progressRecordSchema";

/** 시안 안내 문구의 약속 — 서버는 50MB·개수 무제한이지만 화면이 더 좁게 막는다 */
export const MAX_RECORD_FILES = 3;
const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

/** 파일 선택창에 보일 형식 — 최종 차단(실행 파일 등)은 서버가 한다 */
const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "hwp",
  "hwpx",
  "txt",
  "csv",
  "zip",
  "7z",
  "png",
  "jpg",
  "jpeg",
];
export const RECORD_FILE_ACCEPT = ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(",");

/** 올라가는 중이거나 실패한 파일 — 다시 시도할 수 있게 원본을 들고 있는다 */
export type PendingRecordFile = {
  id: string;
  file: File;
  progress: number;
  error: string | null;
};

type UseRecordFileUploadOptions = {
  /** 업로드가 끝난 파일 — 폼의 file_list에 붙인다 */
  onUploaded: (file: ActionFileFormValues) => void;
};

/**
 * 진행 기록 첨부 — 고르는 즉시 S3에 올리고, 끝난 파일만 폼에 넘긴다. 저장(POST·PATCH)은 드로어가 한다.
 * 형식·용량·개수가 맞지 않는 파일은 올리지 않고 notice로 알린다.
 */
export default function useRecordFileUpload({ onUploaded }: UseRecordFileUploadOptions) {
  const [pending, setPending] = useState<PendingRecordFile[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // 드로어를 다시 열면 이전 회차의 업로드 결과가 새 폼에 붙지 않게 회차를 센다
  const roundRef = useRef(0);

  const patch = (id: string, next: Partial<PendingRecordFile>) =>
    setPending(current => current.map(item => (item.id === id ? { ...item, ...next } : item)));

  const run = async (id: string, file: File) => {
    const round = roundRef.current;
    patch(id, { progress: 0, error: null });
    try {
      const uploaded = IS_MOCK
        ? await mockResolve({ url: URL.createObjectURL(file), size: file.size, mimetype: file.type })
        : await uploadFile(file, progress => patch(id, { progress }));
      if (round !== roundRef.current) {
        return;
      }
      // 이름은 사용자가 고른 파일 그대로 쓴다
      onUploaded({ name: file.name, url: uploaded.url, size: uploaded.size, mimetype: uploaded.mimetype });
      setPending(current => current.filter(item => item.id !== id));
    } catch (error) {
      if (round === roundRef.current) {
        patch(id, { error: error instanceof Error ? error.message : "업로드하지 못했어요" });
      }
    }
  };

  /** 고른 파일들 — attachedCount는 이미 붙은 파일 수 */
  const select = (files: File[], attachedCount: number) => {
    const problems: string[] = [];
    let room = MAX_RECORD_FILES - attachedCount - pending.length;

    const accepted = files.filter(file => {
      if (!ALLOWED_EXTENSIONS.includes(getFileExtension(file.name))) {
        problems.push(`${file.name}: 올릴 수 없는 형식이에요`);
        return false;
      }
      if (file.size > MAX_FILE_BYTES) {
        problems.push(`${file.name}: ${MAX_FILE_MB}MB 이하 파일만 올릴 수 있어요`);
        return false;
      }
      if (room <= 0) {
        problems.push(`${file.name}: 파일은 ${MAX_RECORD_FILES}개까지 첨부할 수 있어요`);
        return false;
      }
      room -= 1;
      return true;
    });

    setNotice(problems.length > 0 ? problems.join("\n") : null);

    const added = accepted.map(file => ({ id: crypto.randomUUID(), file, progress: 0, error: null }));
    setPending(current => [...current, ...added]);
    added.forEach(item => run(item.id, item.file));
  };

  const retry = (id: string) => {
    const item = pending.find(candidate => candidate.id === id);
    if (item) {
      run(item.id, item.file);
    }
  };

  const dismiss = (id: string) => {
    setPending(current => current.filter(item => item.id !== id));
    setNotice(null);
  };

  /** 붙은 파일을 뺐을 때 — 「3개까지」 같은 이전 안내가 더는 맞지 않는다 */
  const clearNotice = () => setNotice(null);

  /** 드로어를 새로 열 때 — 진행 중이던 업로드 결과는 버린다 */
  const reset = () => {
    roundRef.current += 1;
    setPending([]);
    setNotice(null);
  };

  return {
    pending,
    notice,
    isUploading: pending.some(item => item.error === null),
    select,
    retry,
    dismiss,
    clearNotice,
    reset,
  };
}
