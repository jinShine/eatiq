import { cn } from "@utils/shadcn";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 로딩 자리를 채우는 골격.
 *
 * shadcn 기본은 animate-pulse라 화면 전체가 같은 박자로 깜빡여 눈이 피로하다.
 * 왼쪽에서 오른쪽으로 훑는 빛으로 바꿔 "채워지는 중"으로 읽히게 했다.
 * motion-reduce에서는 빛만 멈추고 회색 면은 그대로 남는다.
 */
export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("bg-accent relative overflow-hidden rounded-md", className)} {...props}>
      <span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:hidden" />
    </div>
  );
}

type SkeletonTextProps = {
  /** 줄 수 */
  lines?: number;
  className?: string;
};

/** 문단 자리. 마지막 줄은 짧게 끊어 실제 텍스트처럼 보이게 한다 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn("h-3.5", index === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
}
