"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@components/ui";

import { type PropertyCandidate } from "./analysisResultMock";

type PropertyCardProps = {
  property: PropertyCandidate;
  onOpenDetail: (propertyId: string) => void;
};

export default function PropertyCard({ property, onOpenDetail }: PropertyCardProps) {
  return (
    <article className="border-border flex flex-col overflow-hidden rounded-xl border bg-white">
      {/* 매물 사진 자리 — 사진이 없으면 시안처럼 배경색 + 이모지 */}
      <div
        className="relative flex h-[200px] items-center justify-center"
        style={{ backgroundColor: property.thumbnail.background }}
      >
        <span className="text-[26px]" aria-hidden>
          {property.thumbnail.emoji}
        </span>

        {property.badge && (
          <span className="bg-primary absolute top-3.5 right-3.5 flex items-center gap-1 rounded-lg px-1 py-0.5 text-[11px] font-medium tracking-[-0.55px] text-white">
            <Sparkles className="size-3" />
            {property.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-text-primary text-lg font-bold tracking-[-0.9px]">{property.name}</h3>

        <p className="text-text-primary text-sm font-bold tracking-[-0.7px]">{property.reason}</p>

        <div className="text-text-tertiary flex flex-col gap-1 text-sm font-medium tracking-[-0.7px]">
          <p>{property.cost}</p>
          <p>{property.spec}</p>
          <p>{property.address}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => onOpenDetail(property.id)}
          className="text-text-primary mt-auto h-8 w-full text-[13px] font-medium"
        >
          상세 보기
        </Button>
      </div>
    </article>
  );
}
