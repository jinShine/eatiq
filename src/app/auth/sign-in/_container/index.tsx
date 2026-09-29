"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import z from "zod";

import { Button, Input, Toast } from "@components/ui";

import { useSendMagicLinkMutation } from "@services/api/auth/auth.query";

const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

type EmailForm = z.infer<typeof emailSchema>;

/**
 * 매직링크 로그인 — 이메일을 받아 1회용 링크를 발송한다.
 *
 * 흐름
 *   1. 이메일 입력 → POST /api/auth/magic-link
 *   2. 발송 성공 → "메일을 확인해주세요" 안내로 전환
 *   3. 실제 인증은 메일 링크가 여는 /auth/verify 에서 끝난다
 */
type SignInContainerProps = {
  /** 초대 링크로 들어온 경우 그 이메일을 채워둔다. 다른 주소로 가입하면 초대를 수락할 수 없다 */
  defaultEmail?: string;
};

export default function SignInContainer({ defaultEmail = "" }: SignInContainerProps) {
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail },
  });

  const { mutate: sendMagicLink, isPending } = useSendMagicLinkMutation();

  const onSubmit = (values: EmailForm) => {
    sendMagicLink(values, {
      onSuccess: () => setSentEmail(values.email),
      onError: () => Toast.error("메일 발송에 실패했어요. 잠시 후 다시 시도해주세요."),
    });
  };

  // 발송 후에는 입력 없이 안내만 보여준다. 인증은 메일의 링크에서 이어진다
  if (sentEmail) {
    return (
      <div className="flex flex-col items-center gap-5 p-6 text-center">
        <div className="bg-primary-50 text-primary flex size-12 items-center justify-center rounded-2xl">
          <MailCheck className="size-6" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">메일을 확인해주세요</h1>
          <p className="text-text-tertiary text-xs leading-relaxed">
            <span className="text-text-primary font-semibold">{sentEmail}</span> 로 로그인 링크를 보냈어요.
            <br />
            메일 속 링크를 누르면 로그인됩니다.
          </p>
          <p className="text-text-disabled text-[11px]">링크는 24시간 동안 유효해요.</p>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setSentEmail(null)}>
          다른 이메일로 로그인
        </Button>
      </div>
    );
  }

  return (
    // noValidate가 없으면 브라우저 기본 검증이 제출을 가로채 zod 검증이 돌지 않는다
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">로그인</h1>
        <p className="text-text-tertiary text-xs leading-relaxed">
          이메일을 입력하면 로그인 링크를 보내드려요.
          <br />
          비밀번호는 필요하지 않습니다.
        </p>
      </div>

      <Input
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요"
        autoComplete="email"
        error={Boolean(errors.email)}
        errorText={errors.email?.message}
        {...register("email")}
      />

      <Button type="submit" isLoading={isPending}>
        로그인 링크 받기
      </Button>
    </form>
  );
}
