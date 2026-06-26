import { type ReactNode } from "react";

import { cn } from "@utils/shadcn";

interface NotiBadgeProps {
  children: ReactNode;
  count?: number;
  className?: string;
  isInvisible?: boolean;
  isDot?: boolean;
}

export default function NotiBadge({ children, count, className, isInvisible = false, isDot = false }: NotiBadgeProps) {
  if (isInvisible) {
    return <div className={cn("relative inline-flex", className)}>{children}</div>;
  }

  const getBadgeStyles = () => {
    if (isDot) {
      return {
        container: "absolute -top-1.5 -right-1.5 h-3 w-3",
        content: "",
      };
    }

    if (count && count > 0) {
      const countStr = count > 99 ? "99+" : count.toString();
      const charCount = countStr.length;

      if (charCount === 1) {
        return {
          container: "absolute -top-1.5 -right-1.5 h-4 w-4",
          content: "",
        };
      } else if (charCount === 2) {
        return {
          container: "absolute -top-1.5 -right-1.5 h-4 min-w-5",
          content: "",
        };
      } else {
        // 3글자 이상 (99+)
        return {
          container: "absolute -top-1.5 -right-2.5 h-4 min-w-6",
          content: "",
        };
      }
    }

    return {
      container: "absolute -top-1.5 -right-1.5 h-3 w-3",
      content: "",
    };
  };

  const badgeStyles = getBadgeStyles();

  return (
    <div className={cn("relative inline-flex", className)}>
      <div>{children}</div>
      <div
        className={cn(
          "bg-red-500 rounded-full border-2 border-white shadow-lg shadow-black/25 flex items-center justify-center text-[10px]",
          badgeStyles.container,
        )}
      >
        {!isDot && count && count > 0 && (
          <span className={cn("text-white text-[10px] font-medium leading-none", badgeStyles.content)}>
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    </div>
  );
}
