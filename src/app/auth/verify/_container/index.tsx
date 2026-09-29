"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { CircleAlert, MailCheck } from "lucide-react";
import z from "zod";

import { Button, Input, SpinLoader, Toast } from "@components/ui";

import { useRegisterMutation, useSendMagicLinkMutation, useVerifyMagicLink } from "@services/api/auth/auth.query";
import { type AuthUser } from "@services/api/auth/auth.type";
import { inviteReturnStorage } from "@services/api/auth/invite-return-storage";
import { type PendingSignup, pendingSignupStorage } from "@services/api/auth/signup-storage";
import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

const nameSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
});

type NameForm = z.infer<typeof nameSchema>;

type Props = {
  token?: string;
  email?: string;
};

/** 백엔드가 한국어 사유를 내려주므로 그대로 쓴다 ("이미 사용된 인증 링크입니다." 등) */
const toErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "링크를 확인할 수 없어요.";
  }
  return "링크를 확인할 수 없어요.";
};

/**
 * 메일의 매직링크가 도착하는 곳.
 *
 * 마운트되면 토큰을 검증하고 가입 여부에 따라 갈라진다.
 *   기존 회원 → access_token을 바로 받아 로그인 완료
 *   신규 회원 → 가입용 token만 받으므로 이름을 입력받아 가입을 마친다
 *
 * 검증을 useQuery로 두는 이유: 1회용 토큰이라 중복 호출이 곧 실패다.
 * queryKey가 같으면 React Query가 요청을 합쳐주므로 StrictMode의 이중 마운트도 흡수된다.
 */
export default function AuthVerifyContainer({ token, email }: Props) {
  const router = useRouter();

  /**
   * 가입 진행 상태.
   *   undefined — sessionStorage를 아직 확인하지 않음 (verify를 섣불리 부르면 안 된다)
   *   null      — 확인했고 없음 → verify 진행
   *   객체       — 가입 중이던 상태 → verify 건너뛰고 이름 입력부터
   */
  const [pending, setPending] = useState<PendingSignup | null | undefined>(undefined);

  // sessionStorage는 서버에서 못 읽으므로 마운트 후에 확인한다
  useEffect(() => {
    setPending(email ? pendingSignupStorage.get(email) : null);
  }, [email]);

  const hasParams = Boolean(token && email);

  const {
    data,
    isError,
    error,
    isFetching: isVerifying,
  } = useVerifyMagicLink(email ?? "", token ?? "", pending === null);

  const { mutate: registerUser, isPending: isRegistering } = useRegisterMutation();
  const { mutate: resendMagicLink, isPending: isResending } = useSendMagicLinkMutation();

  const [isResent, setIsResent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
  });

  /** 가입에 쓸 토큰 — 새로고침으로 복구한 값이 있으면 그것을 우선한다 */
  const signupToken = pending?.token ?? data?.token;
  const isNewUser = Boolean(pending) || data?.is_new_user === true;

  /** 로그인 마무리 — 기존 회원 검증과 신규 가입의 끝이 같다 */
  function completeLogin(accessToken: string, user?: AuthUser) {
    tokenStorage.setAccessToken(accessToken);

    if (user) {
      tokenStorage.setUser(user);
    }

    pendingSignupStorage.clear();

    // 초대 링크로 들어왔다면 그리로 돌려보낸다. 루트로 보내면 초대가 영영 수락되지 않는다
    const returnTo = inviteReturnStorage.take();
    router.replace(returnTo ?? "/");
  }

  // 검증 결과 처리. 화면을 떠나거나 스토리지를 건드리는 동작이라 렌더가 아닌 이펙트에서 한다
  useEffect(() => {
    if (!data) {
      return;
    }

    // 신규 회원이면 가입용 토큰을 보관해 새로고침에 대비한다
    if (data.is_new_user) {
      if (email && data.token) {
        const next = { email, token: data.token };
        pendingSignupStorage.set(next);
        setPending(next);
      }
      return;
    }

    if (data.access_token) {
      completeLogin(data.access_token, data.user);
    }
    // completeLogin은 router만 참조하므로 data 변화에만 반응하면 된다
  }, [data, email]);

  const handleRegister = (values: NameForm) => {
    if (!email || !signupToken) {
      return;
    }

    registerUser(
      { email, name: values.name, token: signupToken },
      {
        onSuccess: response => completeLogin(response.access_token, response.user),
        onError: () => Toast.error("가입에 실패했어요. 다시 시도해주세요."),
      },
    );
  };

  const handleResend = () => {
    if (!email) {
      router.replace(ROUTES.AUTH.SIGN_IN);
      return;
    }

    resendMagicLink(
      { email },
      {
        onSuccess: () => setIsResent(true),
        onError: () => Toast.error("메일 발송에 실패했어요. 잠시 후 다시 시도해주세요."),
      },
    );
  };

  // 링크에 값이 빠졌거나 검증이 거부된 경우
  if (!hasParams || isError) {
    if (isResent) {
      return (
        <div className="flex flex-col items-center gap-5 p-6 text-center">
          <div className="bg-primary-50 text-primary flex size-12 items-center justify-center rounded-2xl">
            <MailCheck className="size-6" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">새 링크를 보냈어요</h1>
            <p className="text-text-tertiary text-xs leading-relaxed">
              <span className="text-text-primary font-semibold">{email}</span> 메일함을 확인해주세요.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-5 p-6 text-center">
        <div className="bg-destructive-background text-destructive flex size-12 items-center justify-center rounded-2xl">
          <CircleAlert className="size-6" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">
            {hasParams ? toErrorMessage(error) : "링크가 올바르지 않아요"}
          </h1>
          <p className="text-text-tertiary text-xs leading-relaxed">
            {email ? (
              <>
                <span className="text-text-primary font-medium">{email}</span> 로<br />새 로그인 링크를 보내드릴게요.
              </>
            ) : (
              "로그인 링크를 다시 받아주세요."
            )}
          </p>
        </div>

        <Button size="sm" isLoading={isResending} onClick={handleResend}>
          {email ? "새 링크 받기" : "로그인하러 가기"}
        </Button>
      </div>
    );
  }

  if (isNewUser) {
    return (
      <form noValidate onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">처음 오셨네요</h1>
          <p className="text-text-tertiary text-xs leading-relaxed">
            <span className="text-text-primary font-semibold">{email}</span> 로 가입을 마칠게요.
          </p>
        </div>

        <Input
          label="이름"
          placeholder="이름을 입력해주세요"
          autoComplete="name"
          error={Boolean(errors.name)}
          errorText={errors.name?.message}
          {...register("name")}
        />

        <Button type="submit" isLoading={isRegistering}>
          가입 완료
        </Button>
      </form>
    );
  }

  // 검증 중이거나, 검증이 끝나 홈으로 이동하는 중
  return (
    <div className="flex flex-col items-center gap-3 p-10">
      <SpinLoader />
      <p className="text-text-tertiary text-xs">
        {isVerifying ? "로그인 링크를 확인하고 있어요" : "로그인하고 있어요"}
      </p>
    </div>
  );
}
