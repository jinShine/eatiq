import { memo, useCallback, useMemo } from "react";

import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/shadcn/pagination";

import { cn } from "@utils/shadcn";

import { HStack } from "./Container";
import { ScrollArea } from "./ScrollArea";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuItem } from "./dropdown";
import { Text } from "./typography";

type PaginatorProps = {
  page?: number;
  limit?: number;
  total?: number;
  showPages?: number; // 보여줄 페이지 수

  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
} & {
  className?: string;
};

const PaginatorV2 = memo(function Paginator({
  className,
  page = 1,
  limit = 30,
  total = 0,
  onPageChange,
  onLimitChange,
}: PaginatorProps) {
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // 현재 표시되는 항목의 시작과 끝 번호 계산
  const currentRange = useMemo(() => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return { start, end };
  }, [page, limit, total]);

  const handlePageClick = useCallback(
    (pageNum: number) => {
      if (pageNum !== page && pageNum > 0 && pageNum <= totalPages) {
        onPageChange?.(pageNum);
      }
    },
    [page, totalPages, onPageChange],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      if (onLimitChange) {
        onLimitChange(newLimit);
        const newPage = Math.floor(((page - 1) * limit + 1) / newLimit) + 1;
        onPageChange?.(newPage);
      }
    },
    [limit, page, onLimitChange, onPageChange],
  );

  return (
    <HStack className="w-fit items-center gap-5">
      <DropdownMenu
        trigger={
          <Button variant={"outline"} size={"sm"}>
            {limit}
            <ChevronDown />
          </Button>
        }
        className="min-w-[80px]"
      >
        <ScrollArea className="max-h-[200px]">
          {[30, 50, 100].map(limit => (
            <DropdownMenuItem
              key={limit}
              onClick={() => {
                handleLimitChange(limit);
              }}
            >
              <Text>{limit}</Text>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenu>

      <Text>{`${total}개 중 ${currentRange.start}-${currentRange.end}`}</Text>

      <Pagination className={cn("w-fit", className)}>
        <PaginationContent>
          {/* 첫 페이지로 이동 */}
          <PaginationItem>
            <PaginationLink
              className={`${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => handlePageClick(1)}
            >
              <ChevronsLeft />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => handlePageClick(page - 1)}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
              onClick={() => handlePageClick(page + 1)}
            />
          </PaginationItem>

          {/* 마지막 페이지로 이동 */}
          <PaginationItem>
            <PaginationLink
              className={`${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => handlePageClick(totalPages)}
            >
              <ChevronsRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </HStack>
  );
});

export default PaginatorV2;
