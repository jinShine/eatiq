"use client";

import { useRef } from "react";

import { FileText, RotateCw, X } from "lucide-react";

import { Button } from "@components/ui";

import { formatFileSize } from "@utils/functions";
import { cn } from "@utils/shadcn";

import { MAX_RECORD_FILES, type PendingRecordFile, RECORD_FILE_ACCEPT } from "../_hooks/useRecordFileUpload";
import { type ActionFileFormValues } from "./progressRecordSchema";

/** 파일 한 줄 — 아이콘 · 이름 · 오른쪽 상태 */
function FileRow({
  name,
  detail,
  isError,
  children,
}: {
  name: string;
  detail: React.ReactNode;
  isError?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "border-border flex items-center gap-2.5 rounded-lg border px-3 py-2",
        isError && "border-error/40 bg-error/5",
      )}
    >
      <FileText className="text-text-tertiary size-4 shrink-0" aria-hidden />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-text-primary truncate text-sm font-medium tracking-[-0.7px]">{name}</span>
        <span className={cn("text-xs", isError ? "text-error" : "text-text-tertiary")}>{detail}</span>
      </span>
      {children}
    </li>
  );
}

const iconButtonClass =
  "text-text-tertiary hover:bg-secondary-background hover:text-text-primary focus-visible:ring-ring flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none";

type RecordFileFieldProps = {
  files: ActionFileFormValues[];
  pending: PendingRecordFile[];
  notice: string | null;
  onSelect: (files: File[]) => void;
  onRemove: (url: string) => void;
  onRetry: (id: string) => void;
  onDismiss: (id: string) => void;
};

/**
 * 「관련 파일 업로드」 (피그마 693:2570).
 * 첨부한 파일 목록은 시안에 없어 안내 문구 아래에 한 줄씩 둔다 — 올라가는 중엔 진행률, 실패하면 사유와 다시 시도.
 */
export default function RecordFileField({
  files,
  pending,
  notice,
  onSelect,
  onRemove,
  onRetry,
  onDismiss,
}: RecordFileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFull = files.length + pending.length >= MAX_RECORD_FILES;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary text-sm font-bold">관련 파일 업로드</h3>
        <Button type="button" variant="outline" size="xs" disabled={isFull} onClick={() => inputRef.current?.click()}>
          파일 첨부
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={RECORD_FILE_ACCEPT}
          className="hidden"
          onChange={event => {
            onSelect(Array.from(event.target.files ?? []));
            // 같은 파일을 지웠다가 다시 고를 수 있게 비운다
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        />
      </div>
      <p className="text-text-tertiary text-xs">
        파일은 최대 개당 10MB 이내, {MAX_RECORD_FILES}개까지 업로드 가능합니다.
      </p>

      {notice && (
        <p role="alert" className="text-error text-xs whitespace-pre-line">
          {notice}
        </p>
      )}

      {(files.length > 0 || pending.length > 0) && (
        <ul className="flex flex-col gap-2">
          {files.map(file => (
            <FileRow
              key={file.url}
              name={file.name}
              detail={file.size !== undefined ? formatFileSize(file.size, 1) : "첨부됨"}
            >
              <button
                type="button"
                onClick={() => onRemove(file.url)}
                aria-label={`${file.name} 첨부 취소`}
                className={iconButtonClass}
              >
                <X className="size-4" />
              </button>
            </FileRow>
          ))}

          {pending.map(item =>
            item.error ? (
              <FileRow key={item.id} name={item.file.name} detail={item.error} isError>
                <button
                  type="button"
                  onClick={() => onRetry(item.id)}
                  aria-label={`${item.file.name} 다시 올리기`}
                  className={iconButtonClass}
                >
                  <RotateCw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDismiss(item.id)}
                  aria-label={`${item.file.name} 빼기`}
                  className={iconButtonClass}
                >
                  <X className="size-4" />
                </button>
              </FileRow>
            ) : (
              <FileRow
                key={item.id}
                name={item.file.name}
                detail={
                  <span className="flex items-center gap-2">
                    <span
                      role="progressbar"
                      aria-label={`${item.file.name} 업로드`}
                      aria-valuenow={item.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="bg-secondary-background h-1 w-24 overflow-hidden rounded-full"
                    >
                      <span
                        className="bg-primary block h-full rounded-full transition-[width]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </span>
                    <span className="tabular-nums">{item.progress}%</span>
                  </span>
                }
              />
            ),
          )}
        </ul>
      )}
    </section>
  );
}
