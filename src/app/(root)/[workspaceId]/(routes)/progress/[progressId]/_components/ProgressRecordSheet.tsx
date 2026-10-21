"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Sparkles, Trash2 } from "lucide-react";

import { Button, Input, Select, SelectItem, Sheet, Textarea } from "@components/ui";

import { type ProgressRecord } from "./progressDetailView";
import {
  EMPTY_ACTION,
  EMPTY_RECORD,
  type ProgressRecordFormValues,
  progressRecordSchema,
  toRecordFormValues,
} from "./progressRecordSchema";
import { ACTION_TYPE_META } from "./recordOptions";

const ACTION_TYPE_OPTIONS = (Object.keys(ACTION_TYPE_META) as (keyof typeof ACTION_TYPE_META)[]).map(code => ({
  value: code,
  label: ACTION_TYPE_META[code].label,
}));

type ProgressRecordSheetProps = {
  isOpen: boolean;
  /** 수정할 기록. null이면 새 기록을 추가한다 */
  record: ProgressRecord | null;
  isPending: boolean;
  /** 서버가 거절한 사유. 드로어를 닫지 않고 그대로 보여준다 */
  errorMessage?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProgressRecordFormValues) => void;
};

/**
 * 진행 기록 추가 · 수정 드로어 (피그마 693:2471).
 *
 * - 「AI 초안 생성」은 API가 없어 버튼만 둔다(비활성).
 * - 「관련 파일 업로드」는 파일 첨부 단계에서 붙인다(비활성).
 * - 다음 액션은 진행 기록 안에 배열로 저장된다(2026-10-20 구조 변경). 수정할 때도 고치기·지우기·추가가 되며,
 *   저장하면 폼의 배열로 통째로 바뀐다 — 각 행은 보이지 않는 번호(idx)와 완료 여부를 들고 있다가 그대로 보낸다.
 */
export default function ProgressRecordSheet({
  isOpen,
  record,
  isPending,
  errorMessage,
  onOpenChange,
  onSubmit,
}: ProgressRecordSheetProps) {
  // React Compiler 제외 — register 폼은 reset 뒤 입력칸이 갱신되지 않는다(BasicInfoSection 주석 참고)
  "use no memo";

  const isEdit = record !== null;

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgressRecordFormValues>({
    resolver: zodResolver(progressRecordSchema),
    defaultValues: EMPTY_RECORD,
  });

  // 다음 액션은 개수가 정해져 있지 않아 배열 필드로 관리한다
  const { fields, append, remove } = useFieldArray({ control, name: "next_actions" });

  // 열 때마다 새로 채운다 — 추가는 빈 폼, 수정은 그 기록의 값
  useEffect(() => {
    if (isOpen) {
      reset(record ? toRecordFormValues(record) : EMPTY_RECORD);
    }
  }, [isOpen, record, reset]);

  const submit = handleSubmit(onSubmit);

  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={open => !isPending && onOpenChange(open)}
      className="w-full sm:max-w-[560px]"
      header={<h2 className="text-text-primary text-lg font-bold">{isEdit ? "진행 기록 수정" : "진행 기록 추가"}</h2>}
      footer={
        <div className="flex w-full flex-col gap-2">
          {errorMessage && (
            <p role="alert" className="text-error text-sm whitespace-pre-line">
              {errorMessage}
            </p>
          )}
          <Button className="w-full" onClick={submit} isLoading={isPending}>
            진행 기록 저장
          </Button>
        </div>
      }
    >
      <form noValidate onSubmit={submit} className="flex flex-col gap-8 px-1 py-4">
        {/* AI 초안 생성 — 추가할 때만 */}
        {!isEdit && (
          <section className="flex flex-col gap-3">
            <h3 className="text-text-primary text-sm font-bold">AI 초안 생성</h3>
            <p className="text-text-tertiary text-xs leading-relaxed">
              메일 내용을 붙여넣거나 회의록·녹음 파일을 업로드하면 AI가 아래 항목을 자동으로 채워드려요.
            </p>
            {/* AI 초안 API가 없어 비활성 */}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled>
                <Sparkles className="size-3.5" />
                메일 내용 붙여넣기
              </Button>
              <Button type="button" variant="outline" size="sm" disabled>
                파일 업로드
              </Button>
            </div>
          </section>
        )}

        {/* 진행 기록 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-sm font-bold">진행 기록</h3>

          <Controller
            name="action_type"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Select
                  size="md"
                  label="진행 타입"
                  required
                  placeholder="선택해주세요"
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={Boolean(fieldState.error)}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {ACTION_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                {fieldState.error && <p className="text-error text-xs">{fieldState.error.message}</p>}
              </div>
            )}
          />

          <Input
            id="title"
            size="md"
            label="기록 제목"
            required
            placeholder="제목을 입력해주세요"
            error={Boolean(errors.title)}
            errorText={errors.title?.message}
            {...register("title")}
          />

          <Input
            id="action_date"
            size="md"
            type="date"
            label="진행 날짜"
            required
            error={Boolean(errors.action_date)}
            errorText={errors.action_date?.message}
            {...register("action_date")}
          />

          <Input
            id="partner_name"
            size="md"
            label="상대"
            placeholder="상대를 입력해주세요"
            error={Boolean(errors.partner_name)}
            errorText={errors.partner_name?.message}
            {...register("partner_name")}
          />

          <Textarea
            id="content"
            label="진행 내용"
            placeholder="진행 내용을 기록해주세요"
            rows={5}
            error={Boolean(errors.content)}
            errorText={errors.content?.message}
            {...register("content")}
          />
        </section>

        {/* 다음 액션 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-sm font-bold">다음 액션</h3>

          {fields.length === 0 && (
            <p className="text-text-tertiary text-xs">
              {isEdit ? "등록된 다음 액션이 없어요." : "등록할 다음 액션이 없다면 비워두어도 괜찮아요."}
            </p>
          )}

          {/* key는 반드시 field.id — index를 쓰면 삭제 시 입력값이 다른 행에 남는다 */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-1.5 text-xs font-semibold">
                  액션 {index + 1}
                  {/* 수정할 때 이미 끝낸 액션인지 알 수 있게 — 시안에는 없다 */}
                  {field.is_done === "Y" && (
                    <span className="rounded bg-[#ecfdf5] px-1.5 py-0.5 text-[11px] font-medium text-[#059669]">
                      완료
                    </span>
                  )}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="text-destructive hover:border-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-3" />
                  액션 삭제
                </Button>
              </div>

              <Input
                size="md"
                label="제목"
                placeholder="제목을 입력해주세요"
                error={Boolean(errors.next_actions?.[index]?.title)}
                errorText={errors.next_actions?.[index]?.title?.message}
                {...register(`next_actions.${index}.title`)}
              />

              <Input size="md" type="date" label="마감일" {...register(`next_actions.${index}.deadline`)} />

              <Input
                size="md"
                label="담당자"
                placeholder="담당자를 입력해주세요"
                error={Boolean(errors.next_actions?.[index]?.partner_name)}
                errorText={errors.next_actions?.[index]?.partner_name?.message}
                {...register(`next_actions.${index}.partner_name`)}
              />

              <Input
                size="md"
                label="메모"
                placeholder="메모를 입력해주세요"
                error={Boolean(errors.next_actions?.[index]?.memo)}
                errorText={errors.next_actions?.[index]?.memo?.message}
                {...register(`next_actions.${index}.memo`)}
              />
            </div>
          ))}

          <Button type="button" variant="ghost" size="sm" className="self-center" onClick={() => append(EMPTY_ACTION)}>
            <Plus className="size-3.5" />
            액션 추가
          </Button>
        </section>

        {/* 관련 파일 업로드 — 파일 첨부 단계에서 붙인다 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary text-sm font-bold">관련 파일 업로드</h3>
            <Button type="button" variant="outline" size="xs" disabled>
              파일 첨부
            </Button>
          </div>
          <p className="text-text-tertiary text-xs">파일은 최대 개당 10MB 이내, 3개까지 업로드 가능합니다.</p>
        </section>
      </form>
    </Sheet>
  );
}
