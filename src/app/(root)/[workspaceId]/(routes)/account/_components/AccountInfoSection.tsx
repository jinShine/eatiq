import { Skeleton } from "@components/ui";

import AccountSection from "./AccountSection";

type AccountInfoSectionProps = {
  email?: string;
  name?: string | null;
  isLoading: boolean;
};

/**
 * 이메일·이름 읽기 전용 표시.
 * 수정 API가 없어 입력칸이 아니라 텍스트로 둔다. 입력칸 모양이면 눌러보게 된다
 */
export default function AccountInfoSection({ email, name, isLoading }: AccountInfoSectionProps) {
  const rows = [
    { label: "이메일", value: email },
    // 가입 시 이름은 필수지만 스펙상 null일 수 있다
    { label: "이름", value: name ?? "-" },
  ];

  return (
    <AccountSection title="상세 정보" description="이메일, 이름은 수정할 수 없습니다">
      <dl className="flex flex-col gap-3 p-6">
        {rows.map(row => (
          <div key={row.label} className="flex min-h-10 items-center text-sm">
            <dt className="text-text-primary w-20 shrink-0 sm:w-[121px] font-bold">{row.label}</dt>
            <dd className="text-text-tertiary min-w-0 truncate">
              {isLoading ? <Skeleton className="h-4 w-40" /> : row.value}
            </dd>
          </div>
        ))}
      </dl>
    </AccountSection>
  );
}
