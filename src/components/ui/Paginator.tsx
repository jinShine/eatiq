import { memo, useCallback, useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/shadcn/pagination";

import { PER_PAGE } from "@constants/common";

import { cn } from "@utils/shadcn";

type PaginatorProps = {
  page?: number;
  limit?: number;
  total?: number;
  showPages?: number; // 보여줄 페이지 수

  onPageChange: (page: number) => void;
} & {
  className?: string;
};

const Paginator = memo(function Paginator({
  className,
  page = 1,
  limit = PER_PAGE,
  total = 0,
  showPages = 5,
  onPageChange,
}: PaginatorProps) {
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // 페이지 범위 계산
  const getPageRange = useMemo(() => {
    const range = [];

    const currentGroup = Math.floor((page - 1) / showPages);
    const start = currentGroup * showPages + 1;
    const end = Math.min(start + showPages - 1, totalPages);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }, [page, showPages, totalPages]);

  const handlePageClick = useCallback(
    (pageNum: number) => {
      if (pageNum !== page) {
        onPageChange(pageNum);
      }
    },
    [page],
  );

  return (
    <Pagination className={cn("w-fit", className)}>
      <PaginationContent>
        {/* 첫 페이지로 이동 */}
        {/* <PaginationItem>
        <PaginationLink
          className={`${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          onClick={() => handlePageClick(1)}
        >
          <HiOutlineChevronDoubleLeft />
        </PaginationLink>
      </PaginationItem> */}
        <PaginationItem>
          <PaginationPrevious
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            onClick={() => handlePageClick(page - 1)}
          />
        </PaginationItem>

        {getPageRange.map(pageNum => (
          <PaginationItem key={pageNum}>
            <PaginationLink onClick={() => handlePageClick(pageNum)} isActive={pageNum === page}>
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            onClick={() => handlePageClick(page + 1)}
          />
        </PaginationItem>

        {/* 마지막 페이지로 이동 */}
        {/* <PaginationItem>
        <PaginationLink
          className={`${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          onClick={() => handlePageClick(totalPages)}
        >
          <HiOutlineChevronDoubleRight />
        </PaginationLink>
      </PaginationItem> */}
      </PaginationContent>
    </Pagination>
  );
});

export default Paginator;
