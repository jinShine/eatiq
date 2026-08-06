type InfoRow = {
  label: string;
  value: string;
};

type BuyerInfoCardProps = {
  rows: InfoRow[];
};

export default function BuyerInfoCard({ rows }: BuyerInfoCardProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-text-primary text-lg font-bold tracking-[-0.9px]">기본 정보</h3>

      <dl className="flex flex-col gap-3">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm tracking-[-0.7px]">
            <dt className="text-text-disabled shrink-0 font-medium">{row.label}</dt>
            {/* 담당자 메일처럼 긴 값이 패널 폭을 넘기지 않도록 잘라내고 전체 값은 title로 남긴다 */}
            <dd className="text-text-primary min-w-0 truncate text-right font-bold" title={row.value}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
