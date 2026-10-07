/**
 * 바이어 섹션 — 순서·문구는 피그마 「전체 IA → 회사 정보 설정 - 바이어」(961:10022).
 * id는 바이어 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다.
 */
const BUYER_SECTIONS = [
  { id: "buyer_basic", title: "회사 기본 정보", description: "이름, 설립 연도, 본사 연락처를 입력해주세요" },
  { id: "buyer_status", title: "현재 운영 현황" },
  { id: "buyer_contract_policy", title: "계약 정책 정보", description: "선호하는 계약 조건을 입력해주세요" },
  { id: "buyer_intro", title: "회사 소개", description: "회사의 소개와 강점을 알려주세요" },
  { id: "buyer_contact", title: "연락처", description: "담당자의 정보를 입력해주세요" },
] as const;

type BuyerSettingsProps = {
  workspaceId: string;
};

/**
 * 바이어 워크스페이스의 회사 정보 설정 — 탭 없는 한 페이지.
 * TODO: 섹션은 다음 단계에서 하나씩 API에 연결한다. 지금은 자리만 있다
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 섹션을 연결하면 쓴다
export default function BuyerSettings({ workspaceId }: BuyerSettingsProps) {
  return (
    <div className="space-y-6 px-6 py-6">
      {/* 저니 패널(정보 완성 현황) 자리 — 4단계에서 연결 */}
      {BUYER_SECTIONS.map(section => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <div className="border-border overflow-hidden rounded-2xl border">
            <div className="border-border border-b px-6 py-4">
              <h3 className="text-text-primary text-base font-bold tracking-tight">{section.title}</h3>
              {"description" in section && <p className="text-text-tertiary mt-0.5 text-sm">{section.description}</p>}
            </div>
            <p className="text-text-tertiary p-6 text-sm">준비 중이에요</p>
          </div>
        </section>
      ))}
    </div>
  );
}
