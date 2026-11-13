import RequirementRow from "./RequirementRow";
import { type RequirementRow as Row } from "./draftRequirements";

type RequirementGroupProps = {
  title: string;
  description: string;
  rows: Row[];
  isRequired: boolean;
};

/** 「필수 자료 / 선택 자료」 묶음 — MOU·LOI·소개 문서가 같이 쓴다 */
export default function RequirementGroup({ title, description, rows, isRequired }: RequirementGroupProps) {
  return (
    <section className="border-border flex flex-col gap-4 border-t pt-5">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-text-primary text-lg font-bold">{title}</h2>
        <p className="text-text-tertiary text-xs">{description}</p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {rows.map(row => (
          <RequirementRow key={row.key} row={row} isRequired={isRequired} />
        ))}
      </ul>
    </section>
  );
}
