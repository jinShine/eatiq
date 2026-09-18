"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, Input, Toast } from "@components/ui";

import { useSendMagicLinkMutation, useVerifyMagicLinkMutation } from "@services/api/auth/auth.query";
import { tokenStorage } from "@services/token-storage";

// 비밀번호 로그인이 없어졌다. 이메일로 링크를 받고, 메일에 담긴 토큰으로 인증한다.
const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

const tokenSchema = z.object({
  token: z.string().min(1, "메일로 받은 인증 코드를 입력해주세요."),
});

type EmailForm = z.infer<typeof emailSchema>;
type TokenForm = z.infer<typeof tokenSchema>;

export default function SignInContainer() {
  const router = useRouter();

  /** 메일을 보낸 뒤에는 코드 입력 단계로 넘어간다 */
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const { mutate: sendMagicLink, isPending: isSending } = useSendMagicLinkMutation();
  const { mutate: verifyMagicLink, isPending: isVerifying } = useVerifyMagicLinkMutation();

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const tokenForm = useForm<TokenForm>({ resolver: zodResolver(tokenSchema) });

  const handleSendLink = (values: EmailForm) => {
    sendMagicLink(values, {
      onSuccess: () => {
        setSentEmail(values.email);
        Toast.success("로그인 링크를 메일로 보냈어요.");
      },
      onError: () => Toast.error("메일 발송에 실패했어요. 다시 시도해주세요."),
    });
  };

  const handleVerify = (values: TokenForm) => {
    if (!sentEmail) {
      return;
    }

    verifyMagicLink(
      { email: sentEmail, token: values.token },
      {
        onSuccess: data => {
          if (!data.access_token) {
            Toast.error("인증 응답에 토큰이 없어요.");
            return;
          }

          tokenStorage.setAccessToken(data.access_token);
          if (data.user) {
            tokenStorage.setUser(data.user);
          }
          router.replace("/");
        },
        onError: () => Toast.error("인증에 실패했어요. 코드를 다시 확인해주세요."),
      },
    );
  };

  if (sentEmail) {
    return (
      <form onSubmit={tokenForm.handleSubmit(handleVerify)} className="flex flex-col gap-4 p-6">
        <p className="text-text-tertiary text-sm">
          <span className="text-text-primary font-semibold">{sentEmail}</span> 로 로그인 링크를 보냈어요.
          <br />
          메일에 담긴 인증 코드를 입력해주세요.
        </p>

        <Input
          label="인증 코드"
          placeholder="메일로 받은 코드를 입력해주세요"
          error={Boolean(tokenForm.formState.errors.token)}
          errorText={tokenForm.formState.errors.token?.message}
          {...tokenForm.register("token")}
        />

        <Button type="submit" isLoading={isVerifying}>
          로그인
        </Button>

        <Button type="button" variant="ghost" onClick={() => setSentEmail(null)}>
          다른 이메일로 로그인
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={emailForm.handleSubmit(handleSendLink)} className="flex flex-col gap-4 p-6">
      <Input
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요"
        error={Boolean(emailForm.formState.errors.email)}
        errorText={emailForm.formState.errors.email?.message}
        {...emailForm.register("email")}
      />

      <Button type="submit" isLoading={isSending}>
        로그인 링크 받기
      </Button>
    </form>
  );
}
