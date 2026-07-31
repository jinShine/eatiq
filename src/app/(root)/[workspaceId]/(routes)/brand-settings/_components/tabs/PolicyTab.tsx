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
        <ContractSection workspaceId={workspaceId} />
        <SignatorySection workspaceId={workspaceId} />
        <PolicySection workspaceId={workspaceId} />
        <FeeSection workspaceId={workspaceId} />
      </div>
    </div>
  );
}
