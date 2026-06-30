import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "./Button";

const meta = {
  title: "Components/Button", // 사이드바 경로
  component: Button,
  parameters: { layout: "centered" }, // 캔버스 중앙 정렬
  tags: ["autodocs"], // Docs 탭 자동 생성
  argTypes: {
    // Controls 패널에서 각 prop을 어떤 UI로 조작할지
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "tertiary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl", "icon"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    // 모든 스토리의 기본 props
    children: "버튼",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// ── 각 named export = 하나의 스토리 ──
export const Primary: Story = {}; // meta.args 그대로 사용

export const Outline: Story = { args: { variant: "outline" } };

export const Destructive: Story = { args: { variant: "destructive" } };

export const Loading: Story = { args: { isLoading: true, children: "로딩 중" } };

export const Large: Story = { args: { size: "lg" } };

// render로 직접 JSX를 그리는 카탈로그용 스토리
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "destructive", "outline", "secondary", "tertiary", "ghost", "link"] as const).map(variant => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
