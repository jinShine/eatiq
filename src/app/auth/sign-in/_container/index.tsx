"use client";

import React, { useState } from "react";

import { z } from "zod";

import { Button, Input } from "@components/ui";

import { useSignInMutation } from "@services/api/auth/auth.query";

import REG_EXPRESSION from "@utils/reg-expression";

z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .regex(REG_EXPRESSION.PASSWORD, { message: "영문, 숫자 포함 8자 이상으로 입력해주세요." }),
});

export default function SignInContainer() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate: signIn, isPending, error } = useSignInMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // signIn(
    //   { email, password }
    // )
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-6">
      <Input type="email" value={email} placeholder="이메일" onChange={e => setEmail(e.target.value)} />
      <Input type="password" value={password} placeholder="비밀번호" onChange={e => setPassword(e.target.value)} />

      <Button type="submit" isLoading={isPending}>
        로그인
      </Button>
    </form>
  );
}
