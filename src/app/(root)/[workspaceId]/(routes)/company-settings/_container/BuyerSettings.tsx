import BuyerBasicSection from "../_components/buyer/sections/BuyerBasicSection";
import BuyerContactSection from "../_components/buyer/sections/BuyerContactSection";
import BuyerContractPolicySection from "../_components/buyer/sections/BuyerContractPolicySection";
import BuyerIntroSection from "../_components/buyer/sections/BuyerIntroSection";
import BuyerStatusSection from "../_components/buyer/sections/BuyerStatusSection";
import BuyerCompletionCard from "../_components/completion/BuyerCompletionCard";

type SectionProps = { workspaceId: string };

/**
 * 바이어 섹션 — 순서는 피그마 「전체 IA → 회사 정보 설정 - 바이어」(961:10022).
 * id는 바이어 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다.
 */
const BUYER_SECTIONS: { id: string; Section: React.ComponentType<SectionProps> }[] = [
  { id: "buyer_basic", Section: BuyerBasicSection },
  { id: "buyer_status", Section: BuyerStatusSection },
  { id: "buyer_contract_policy", Section: BuyerContractPolicySection },
  { id: "buyer_intro", Section: BuyerIntroSection },
  { id: "buyer_contact", Section: BuyerContactSection },
];

type BuyerSettingsProps = {
  workspaceId: string;
};

/** 바이어 워크스페이스의 회사 정보 설정 — 탭 없는 한 페이지 */
export default function BuyerSettings({ workspaceId }: BuyerSettingsProps) {
  // 브랜드 탭 화면과 같은 배치 — 저니 패널은 폭 전체, 섹션은 아래에 여백을 두고 쌓는다
  return (
    <div>
      <BuyerCompletionCard workspaceId={workspaceId} />
      <div className="space-y-6 px-6 py-6">
        {BUYER_SECTIONS.map(({ id, Section }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <Section workspaceId={workspaceId} />
          </section>
        ))}
      </div>
    </div>
  );
}
