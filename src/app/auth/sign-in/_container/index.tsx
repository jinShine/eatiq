"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, Input } from "@components/ui";

import { useSignInMutation } from "@services/api/auth/auth.query";
import { tokenStorage } from "@services/token-storage";

import REG_EXPRESSION from "@utils/reg-expression";

const signInSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .regex(REG_EXPRESSION.PASSWORD, { message: "영문, 숫자 포함 8자 이상으로 입력해주세요." }),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInContainer() {
  const router = useRouter();

  const { mutate: signIn, isPending } = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (values: SignInForm) => {
    signIn(values, {
      onSuccess: data => {
        if (!data.accessToken || !data.refreshToken) {
          console.error("토근이 응답에 없습니다.");
          return;
        }

        tokenStorage.setTokens(data.accessToken, data.refreshToken);
        router.replace("/");
      },
      onError: error => {
        console.error("로그인 실패:", error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-6">
      <Input
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요"
        error={Boolean(errors.email)}
        errorText={errors.email?.message}
        {...register("email")}
      />
      <Input
        type="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        error={Boolean(errors.password)}
        errorText={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" isLoading={isPending}>
        로그인
      </Button>
    </form>
  );
}
