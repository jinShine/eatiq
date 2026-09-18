import { Suspense, use } from "react";

import { SpinLoader } from "@components/ui";

import { type SearchParamsType } from "@constants/common";

import AuthVerifyContainer from "./_container";

type Props = {
  searchParams: SearchParamsType;
};

// searchParams를 use로 읽으면 이 경계 안쪽이 대기 상태가 되므로 fallback이 필요하다
function VerifyContent({ searchParams }: Props) {
  const { token, email } = use(searchParams) as { token?: string; email?: string };

  return <AuthVerifyContainer token={token} email={email} />;
}

export default function AuthVerifyPage({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-3 p-10">
          <SpinLoader />
          <p className="text-text-tertiary text-xs">링크를 확인하는 중이에요</p>
        </div>
      }
    >
      <VerifyContent searchParams={searchParams} />
    </Suspense>
  );
}
