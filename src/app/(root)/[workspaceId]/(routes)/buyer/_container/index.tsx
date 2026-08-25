"use client";

import { useMemo, useState } from "react";

import { Users } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import { ALL_VALUE } from "../../progress/_components/progressOptions";
import BuyerDetailSheet from "../_components/BuyerDetailSheet";
import BuyerFilterBar, { type BuyerFilters, EMPTY_BUYER_FILTERS } from "../_components/BuyerFilterBar";
import BuyerList from "../_components/BuyerList";
import { type BuyerRow } from "../_components/buyerMock";
import { useBuyerDetail } from "../_hooks/useBuyerDetail";
import { useBuyerList } from "../_hooks/useBuyerList";

/** 한 번에 보여줄 개수 — 시안 기준 4개, "더 보기"를 누르면 이만큼씩 늘어난다 */
const PAGE_SIZE = 4;

// TODO(API): 목록 API가 준비되면 서버 필터·페이지네이션으로 옮긴다. 지금은 목업을 클라이언트에서 거른다.
const filterBuyers = (buyers: BuyerRow[], filters: BuyerFilters) =>
  buyers.filter(buyer => {
    if (filters.country !== ALL_VALUE && buyer.countryCode !== filters.country) {
      return false;
    }
    if (filters.category !== ALL_VALUE && buyer.category !== filters.category) {
      return false;
    }
    if (filters.contractType !== ALL_VALUE && buyer.contractType !== filters.contractType) {
      return false;
    }
    return true;
  });

type BuyerContainerProps = {
  workspaceId: string;
};

export default function BuyerContainer({ workspaceId }: BuyerContainerProps) {
  const [filters, setFilters] = useState<BuyerFilters>(EMPTY_BUYER_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const buyers = useBuyerList(workspaceId);
  const filtered = useMemo(() => filterBuyers(buyers, filters), [buyers, filters]);
  const visible = filtered.slice(0, visibleCount);
  const hasNoResult = filtered.length === 0;

  // 필터가 바뀌면 다시 처음부터 보여준다
  const handleChangeFilters = (next: BuyerFilters) => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  const handleReset = () => handleChangeFilters(EMPTY_BUYER_FILTERS);

  // 드로어는 선택된 id만 들고 있고, 상세 데이터는 훅이 조회한다
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const selectedBuyer = buyers.find(buyer => buyer.id === selectedBuyerId) ?? null;
  const detail = useBuyerDetail(selectedBuyerId);

  // TODO(API): 바이어 대표 이메일이 응답에 포함되면 mailto로 연결한다
  const handleSendMail = () => {
    Toast.success("메일 보내기는 바이어 연락처 API 연결 후 동작합니다.");
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title="바이어 탐색" description="해외 진출을 함께할 파트너를 찾아보세요" />}
      content={
        <BaseContentLayout>
          <BuyerFilterBar filters={filters} onChange={handleChangeFilters} onReset={handleReset} />

          {hasNoResult ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="border-border flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
                <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
                  <Users className="size-5" strokeWidth={1.5} />
                </div>
                <p className="text-text-primary mt-5 text-sm font-semibold">조건에 맞는 바이어가 없어요</p>
                <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed">
                  필터를 조정하면 더 많은 파트너를 확인할 수 있어요.
                </p>
              </div>
            </div>
          ) : (
            <BuyerList
              buyers={visible}
              hasMore={visibleCount < filtered.length}
              onLoadMore={() => setVisibleCount(count => count + PAGE_SIZE)}
              onOpenDetail={setSelectedBuyerId}
            />
          )}

          <BuyerDetailSheet
            buyer={selectedBuyer}
            detail={detail}
            isOpen={selectedBuyerId !== null}
            onOpenChange={open => !open && setSelectedBuyerId(null)}
            onSendMail={handleSendMail}
          />
        </BaseContentLayout>
      }
    />
  );
}
