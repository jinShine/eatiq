export type InputSizeType = "sm" | "md" | "lg" | "xl";

export const InputSize: Record<InputSizeType, string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-12",
  xl: "h-14",
};

export * from "./Container";
export * from "./ScrollArea";
export * from "./typography";
export * from "./button";
export * from "./dropdown";
export * from "./modal";
export * from "./Card";
export * from "./loader";
export * from "./input";
export * from "./select";
export * from "./Toast";
export * from "./Sheet";
export { default as Badge } from "./Badge";
export { default as Checkbox } from "./Checkbox";
export { default as Popover } from "./Popover";
export { default as Paginator } from "./Paginator";
export { default as PaginatorV2 } from "./PaginatorV2";
export { default as NotiBadge } from "./NotiBadge";
export { default as Skeleton } from "./Skeleton";
export { default as Separator } from "./Separator";
export { default as Switch } from "./Switch";
export { default as Tooltip } from "./Tooltip";
