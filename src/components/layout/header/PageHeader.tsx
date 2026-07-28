import AiAskButton from "./AiAskButton";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-4 border-b px-6 py-3">
      {/* 좌: 제목 위 / 부제 아래 (세로 스택 — 좁은 화면에서 우측 액션과 충돌 방지) */}
      <div className="flex min-w-0 flex-col">
        <h1 className="text-text-primary text-lg font-bold tracking-tight">{title}</h1>
        {description && <p className="text-text-tertiary truncate text-xs">{description}</p>}
      </div>

      {/* 우: AI 도우미 (기본 내장 — 페이지마다 주입하지 않음. 추후 모달 트리거) */}
      <AiAskButton />
    </header>
  );
}
