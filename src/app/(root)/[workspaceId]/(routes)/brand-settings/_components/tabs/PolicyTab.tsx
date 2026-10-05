import CompletionStatusCard from "../completion/CompletionStatusCard";
import ContractSection from "../sections/ContractSection";
import FeeSection from "../sections/FeeSection";
import PolicySection from "../sections/PolicySection";
import SignatorySection from "../sections/SignatorySection";

type PolicyTabProps = {
  workspaceId: string;
};

export default function PolicyTab({ workspaceId }: PolicyTabProps) {
  return (
    <div>
      <CompletionStatusCard workspaceId={workspaceId} tab="policy" tabLabel="계약 및 정책" />
      <div className="space-y-6 px-6 py-6">
        {/* id = 완성도 API의 section_key. 저니 패널의 「입력」이 이 id로 섹션을 찾아 이동한다 */}
        <div id="contract_manager" className="scroll-mt-24">
          <ContractSection workspaceId={workspaceId} />
        </div>
        <div id="signature_manager" className="scroll-mt-24">
          <SignatorySection workspaceId={workspaceId} />
        </div>
        {/* 진출 희망 조건(target_conditions)과 계약 정책(policy_conditions)은 한 섹션에 있다 */}
        <div id="policy_conditions" className="scroll-mt-24">
          <div id="target_conditions" className="scroll-mt-24">
            <PolicySection workspaceId={workspaceId} />
          </div>
        </div>
        {/* 수수료는 완성도 계산에 없다(백엔드 확인 중) — 섹션 id만 둔다 */}
        <div id="brand_commission" className="scroll-mt-24">
          <FeeSection workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
