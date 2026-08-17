"use client";

import { Controller } from "react-hook-form";

import { Plus, Sparkles, Trash2 } from "lucide-react";

import { Button, Input, Select, SelectItem, Sheet, Textarea } from "@components/ui";

import { useProgressRecordForm } from "../_hooks/useProgressRecordForm";
import { EMPTY_ACTION } from "./progressRecordSchema";
import { RECORD_TYPE_META, type RecordType } from "./recordOptions";

const RECORD_TYPE_OPTIONS = (Object.keys(RECORD_TYPE_META) as RecordType[]).map(code => ({
  value: code,
  label: RECORD_TYPE_META[code].label,
}));

type AddProgressRecordSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddProgressRecordSheet({ isOpen, onOpenChange }: AddProgressRecordSheetProps) {
  const { form, actions, submit, close } = useProgressRecordForm({ onClose: () => onOpenChange(false) });

  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const { fields, append, remove } = actions;

  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={open => (open ? onOpenChange(true) : close())}
      className="w-full sm:max-w-[560px]"
      header={<h2 className="text-text-primary text-lg font-bold">진행 기록 추가</h2>}
      footer={
        <Button className="w-full" onClick={submit} disabled={isSubmitting}>
          진행 기록 저장
        </Button>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-8 px-1 py-4">
        {/* AI 초안 생성 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-text-primary text-sm font-bold">AI 초안 생성</h3>
          <p className="text-text-tertiary text-xs leading-relaxed">
            메일 내용을 붙여넣거나 회의록·녹음 파일을 업로드하면 AI가 아래 양식을 자동으로 채워드려요.
          </p>
          {/* TODO(API): AI 초안 생성 API 연결 */}
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

        {/* 진행 기록 */}
        <section className="flex flex-col gap-4">
          <h3 className="text-text-primary text-sm font-bold">진행 기록</h3>

          <Controller
            name="recordType"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Select
                  size="md"
                  label="진행 타입"
                  placeholder="선택해주세요"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {RECORD_TYPE_OPTIONS.map(option => (
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
            size="md"
            label="기록 제목"
            placeholder="제목을 입력해주세요"
            error={Boolean(errors.title)}
            errorText={errors.title?.message}
            {...register("title")}
          />

          <Input
            size="md"
            type="date"
            label="진행 날짜"
            error={Boolean(errors.occurredAt)}
            errorText={errors.occurredAt?.message}
            {...register("occurredAt")}
          />

          <Input size="md" label="상대" placeholder="상대를 입력해주세요" {...register("counterpart")} />

          <Textarea
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
            <p className="text-text-tertiary text-xs">등록할 다음 액션이 없다면 비워두어도 괜찮아요.</p>
          )}

          {/* key는 반드시 field.id — index를 쓰면 삭제 시 입력값이 다른 행에 남는다 */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-xs font-semibold">액션 {index + 1}</span>
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
                error={Boolean(errors.nextActions?.[index]?.title)}
                errorText={errors.nextActions?.[index]?.title?.message}
                {...register(`nextActions.${index}.title`)}
              />

              <Input
                size="md"
                type="date"
                label="마감일"
                error={Boolean(errors.nextActions?.[index]?.dueDate)}
                errorText={errors.nextActions?.[index]?.dueDate?.message}
                {...register(`nextActions.${index}.dueDate`)}
              />

              <Input
                size="md"
                label="담당자"
                placeholder="담당자를 입력해주세요"
                {...register(`nextActions.${index}.assignee`)}
              />

              <Input
                size="md"
                label="메모"
                placeholder="메모를 입력해주세요"
                {...register(`nextActions.${index}.memo`)}
              />
            </div>
          ))}

          <Button type="button" variant="ghost" size="sm" className="self-center" onClick={() => append(EMPTY_ACTION)}>
            <Plus className="size-3.5" />
            액션 추가
          </Button>
        </section>

        {/* 관련 파일 업로드 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary text-sm font-bold">관련 파일 업로드</h3>
            {/* TODO(API): 파일 저장소 연결 후 활성화 */}
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
