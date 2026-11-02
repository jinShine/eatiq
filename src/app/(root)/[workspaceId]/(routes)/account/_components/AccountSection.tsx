import { type ReactNode } from "react";

type AccountSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** 내 정보 설정의 카드 한 장. 머리글과 본문 사이에 선이 들어간다 (피그마 실측) */
export default function AccountSection({ title, description, children }: AccountSectionProps) {
  return (
    <section className="border-border overflow-hidden rounded-2xl border bg-white">
      <header className="border-border flex min-h-20 flex-col justify-center gap-0.5 border-b px-6 py-4">
        <h2 className="text-text-primary text-lg font-bold tracking-tight">{title}</h2>
        {description && <p className="text-text-tertiary text-sm">{description}</p>}
      </header>
      {children}
    </section>
  );
}
