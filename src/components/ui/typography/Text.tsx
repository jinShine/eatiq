"use client";

import * as React from "react";

import { cn } from "@utils/shadcn";

type TextVariant =
  /** 128px  */
  | "9xl"
  /** 96px  */
  | "8xl"
  /** 72px  */
  | "7xl"
  /** 60px  */
  | "6xl"
  /** 48px  */
  | "5xl"
  /** 36px  */
  | "4xl"
  /** 30px  */
  | "3xl"
  /** 24px  */
  | "2xl"
  /** 20px  */
  | "xl"
  /** 18px  */
  | "lg"
  /** 16px  */
  | "md"
  /** 14px  */
  | "sm"
  /** 12px  */
  | "xs"
  /** 10px  */
  | "xxs";

/**
 * 텍스트 색상 옵션
 * @description 텍스트의 색상 테마
 */
export const TextColor = {
  /** 기본 텍스트 색상 */
  primary: "primary",
  /** 보조 텍스트 색상 */
  secondary: "secondary",
  /** 3차 텍스트 색상 */
  tertiary: "tertiary",
  /** 부모 요소 색상 상속 */
  inherit: "inherit",
  /** 현재 색상 유지 */
  current: "current",
} as const;

export type TextColor = (typeof TextColor)[keyof typeof TextColor];

/**
 * Text 컴포넌트 Props
 * @description 타이포그래피 컴포넌트의 속성
 */
export interface TextProps {
  /** 텍스트 크기 변형 (기본값: "md") */
  variant?: TextVariant;
  /** 텍스트 색상 (기본값: "primary") */
  color?: TextColor;
  /** 텍스트 내용 */
  children: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**Tailwind 표준 */
const textVariants = {
  "9xl": "text-9xl leading-none font-light", // 128px
  "8xl": "text-8xl leading-none font-light", // 96px
  "7xl": "text-7xl leading-none font-light", // 72px
  "6xl": "text-6xl leading-none font-light", // 60px
  "5xl": "text-5xl leading-none font-light", // 48px
  "4xl": "text-4xl leading-tight font-normal", // 36px
  "3xl": "text-3xl leading-tight font-normal", // 30px
  "2xl": "text-2xl leading-snug font-normal", // 24px
  "xl": "text-xl leading-snug font-normal", // 20px
  "lg": "text-lg leading-normal font-normal", // 18px
  "md": "text-base leading-normal font-normal", // 16px
  "sm": "text-sm leading-normal font-normal", // 14px
  "xs": "text-xs leading-normal font-normal", // 12px
  "xxs": "text-[10px] leading-tight font-normal", // 10px
};

const textColors = {
  primary: "text-[var(--text-primary)]",
  secondary: "text-[var(--text-secondary)]",
  tertiary: "text-[var(--text-tertiary)]",
  inherit: "text-inherit",
  current: "text-current",
};

const getDefaultElement = (variant: TextVariant): keyof React.JSX.IntrinsicElements => {
  switch (variant) {
    case "6xl":
      return "h1";
    case "5xl":
      return "h2";
    case "4xl":
      return "h3";
    case "3xl":
      return "h4";
    case "2xl":
      return "h5";
    default:
      return "p";
  }
};

/**
 * Text 컴포넌트
 * @description 타이포그래피 시스템을 위한 텍스트 컴포넌트
 * @param variant - 텍스트 크기 변형 (기본값: "md")
 * @param color - 텍스트 색상 (기본값: "primary")
 * @param children - 텍스트 내용
 * @param className - 추가 CSS 클래스
 * @example
 * ```tsx
 * <Text variant="2xl" color="primary">제목 텍스트</Text>
 * <Text variant="md" color="secondary">본문 텍스트</Text>
 * ```
 */
export const Text = ({ variant = "md", color = "primary", children, className }: TextProps) => {
  const Component = getDefaultElement(variant);

  return <Component className={cn(textVariants[variant], textColors[color], className)}>{children}</Component>;
};

Text.displayName = "Text";
