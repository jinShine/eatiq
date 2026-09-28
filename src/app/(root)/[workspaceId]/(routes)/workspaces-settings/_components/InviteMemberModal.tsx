"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import z from "zod";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

/** 피그마 규정 — 한 번에 최대 5명 */
export const MAX_INVITE_COUNT = 5;

const inviteSchema = z.object({
  emails: z
    .array(
      z.object({
        value: z.string().trim().min(1, "이메일을 입력해주세요.").email("이메일 형식이 올바르지 않습니다."),
      }),
    )
    .superRefine((emails, ctx) => {
      // 같은 모달 안 중복 — 서버에 보내기 전에 잡을 수 있는 건 여기서 잡는다
      const seen = new Map<string, number>();

      emails.forEach((email, index) => {
        const key = email.value.trim().toLowerCase();
        if (!key) {
          return;
        }
        if (seen.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "value"],
            message: "이미 입력된 이메일 주소입니다.",
          });
          return;
        }
        seen.set(key, index);
      });
    }),
});

export type InviteMemberForm = z.infer<typeof inviteSchema>;

type InviteMemberModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /**
   * 초대 실행. 일부만 실패할 수 있어 모달을 닫는 시점은 호출부가 정한다.
   *
   * setEmailError는 해당 이메일이 적힌 칸을 찾아 사유를 붙이고, 찾았는지를 돌려준다.
   * false면 화면에 그 이메일이 없다는 뜻이라 호출부가 다른 방법으로 알려야 한다.
   */
  onSubmit: (emails: string[], helpers: { setEmailError: (email: string, message: string) => boolean }) => void;
};

const normalize = (email: string) => email.trim().toLowerCase();

export default function InviteMemberModal({ isOpen, onOpenChange, isPending, onSubmit }: InviteMemberModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { emails: [{ value: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "emails" });

  /**
   * 서버가 돌려준 실패 사유. 이메일 값을 키로 둔다.
   *
   * RHF의 setError는 쓸 수 없다. handleSubmit이 끝나면 RHF가 에러를 비우는데
   * 서버 응답은 그 뒤에 오므로 넣자마자 사라진다.
   * 값을 키로 두면 사용자가 그 칸을 고치는 순간 에러가 저절로 맞지 않게 되어
   * 따로 지울 필요도 없다 — 서버 판정은 그 값에 대한 것이지 그 칸에 대한 게 아니다.
   */
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  // reactCompiler 때문에 watch()는 리렌더를 일으키지 않는다. useWatch를 쓴다
  const watchedEmails = useWatch({ control, name: "emails" });

  // 닫을 때마다 비운다. 다시 열었을 때 지난 입력이나 에러가 남아 있으면 안 된다
  useEffect(() => {
    if (!isOpen) {
      reset({ emails: [{ value: "" }] });
      setServerErrors({});
    }
  }, [isOpen, reset]);

  const setEmailError = (email: string, message: string) => {
    const key = normalize(email);
    const isOnScreen = getValues("emails").some(field => normalize(field.value) === key);

    if (isOnScreen) {
      setServerErrors(prev => ({ ...prev, [key]: message }));
    }
    return isOnScreen;
  };

  const canAddMore = fields.length < MAX_INVITE_COUNT;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[560px]">
      <ModalHeader>사용자 초대하기</ModalHeader>

      <form
        noValidate
        onSubmit={handleSubmit(values => {
          // 새로 보내는 순간 지난 판정은 무효다
          setServerErrors({});
          onSubmit(
            values.emails.map(e => e.value),
            { setEmailError },
          );
        })}
      >
        <ModalBody className="gap-3">
          {fields.map((field, index) => {
            // 형식·중복은 폼이, "이미 초대됨"은 서버가 판정한다. 둘을 한 자리에 보여준다
            const serverError = serverErrors[normalize(watchedEmails?.[index]?.value ?? "")];
            const message = errors.emails?.[index]?.value?.message ?? serverError;

            return (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  autoFocus={index === 0}
                  autoComplete="off"
                  placeholder="초대할 분의 이메일을 입력해주세요"
                  className="flex-1"
                  error={Boolean(message)}
                  errorText={message}
                  {...register(`emails.${index}.value`)}
                />

                {/* 한 칸만 남으면 지울 수 없다 — 빈 모달이 되면 제출할 것이 없다 */}
                <button
                  type="button"
                  aria-label={`${index + 1}번째 이메일 삭제`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="text-text-disabled hover:text-destructive focus-visible:ring-ring mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </ModalBody>

        <ModalFooter className="border-border border-t pt-4 sm:justify-between sm:space-x-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canAddMore}
              onClick={() => append({ value: "" })}
              className="text-text-secondary hover:text-text-primary focus-visible:ring-ring flex items-center gap-1 rounded text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Plus className="size-3" />
              보낼 사람 추가하기
            </button>

            {!canAddMore && (
              <span className="text-destructive text-sm font-bold">
                한 번에 최대 {MAX_INVITE_COUNT}명까지 가능합니다
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" isLoading={isPending}>
              초대하기
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
