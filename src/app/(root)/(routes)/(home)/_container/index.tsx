"use client";

import { useState } from "react";

import { BellIcon } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DropdownMenu,
  DropdownMenuItem,
  Input,
  Modal,
  ModalActions,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  NotiBadge,
  NumberInput,
  Paginator,
  PaginatorV2,
  PasswordInput,
  Popover,
  Select,
  SelectItem,
  Separator,
  Sheet,
  Skeleton,
  SpinLoader,
  Switch,
  TagInput,
  Textarea,
  Toast,
  Tooltip,
} from "@components/ui";
import { SelectGroup, SelectLabel } from "@components/ui/select/Select";

// 미팅용 디자인 시스템 쇼케이스 — ui 컴포넌트 전체를 카테고리별로 보여준다
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-text-primary text-lg font-bold tracking-tight">{title}</h2>
        {desc && <p className="text-text-tertiary text-sm">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ className, name, hex }: { className: string; name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`border-border h-14 rounded-xl border ${className}`} />
      <div>
        <p className="text-text-primary text-xs font-semibold">{name}</p>
        <p className="text-text-tertiary font-mono text-[11px]">{hex}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-text-tertiary text-xs font-semibold">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const BUTTON_VARIANTS = ["default", "destructive", "outline", "secondary", "tertiary", "ghost", "link"] as const;

export default function AppContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <BaseContainerLayout
      content={
        <BaseContentLayout>
          <div className="space-y-10 px-5 py-8">
            {/* Hero */}
            <header className="space-y-2">
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">EATIQ LINK · 디자인 시스템</p>
              <h1 className="text-text-primary text-[26px] font-bold tracking-tight">컴포넌트 작업 현황</h1>
              <p className="text-text-secondary text-sm leading-relaxed">
                Action Blue 단일 액센트, IBM Plex 타이포, 헤어라인 카드 기반의 디자인 시스템과 공용 컴포넌트입니다.
              </p>
            </header>

            {/* ───── Foundation ───── */}
            <Section title="컬러" desc="강조색은 Action Blue 하나로 통일했습니다.">
              <div className="grid grid-cols-3 gap-3">
                <Swatch className="bg-primary" name="Primary" hex="#0066CC" />
                <Swatch className="bg-primary-emphasis" name="Emphasis" hex="#004A99" />
                <Swatch className="bg-primary-light" name="Light" hex="#E8F1FC" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <Swatch className="bg-success" name="Success" hex="#34C759" />
                <Swatch className="bg-warning" name="Warning" hex="#FF9500" />
                <Swatch className="bg-destructive" name="Error" hex="#FF3B30" />
                <Swatch className="bg-info" name="Info" hex="#21AEDB" />
              </div>
            </Section>

            <Section title="텍스트 위계" desc="농도가 다른 잉크색 4단계로 위계를 표현합니다.">
              <div className="space-y-2">
                <p className="text-text-primary">Primary · 본문·제목</p>
                <p className="text-text-secondary">Secondary · 부제목</p>
                <p className="text-text-tertiary">Tertiary · 보조·라벨</p>
                <p className="text-text-disabled">Disabled · 비활성</p>
              </div>
            </Section>

            <Section title="타이포그래피" desc="본문은 IBM Plex Sans KR, 숫자는 IBM Plex Mono.">
              <div className="border-border space-y-3 rounded-xl border p-4">
                <p className="text-text-primary text-xl font-bold tracking-tight">제목 · IBM Plex Sans KR</p>
                <p className="text-text-secondary text-sm">본문 텍스트는 편안한 행간으로 읽기 좋게 표시됩니다.</p>
                <p className="text-primary font-mono text-lg font-medium">₩ 1,234,567</p>
              </div>
            </Section>

            {/* ───── Button ───── */}
            <Section title="Button" desc="hover 시 진한 파랑, 누르면 살짝 작아지는 모션을 적용했습니다.">
              <div className="border-border space-y-4 rounded-xl border p-4">
                <Field label="VARIANTS">
                  {BUTTON_VARIANTS.map(variant => (
                    <Button key={variant} variant={variant} size="sm">
                      {variant}
                    </Button>
                  ))}
                </Field>
                <Field label="SIZES">
                  <Button size="xs">xs</Button>
                  <Button size="sm">sm</Button>
                  <Button size="default">default</Button>
                  <Button size="lg">lg</Button>
                </Field>
                <Field label="STATES">
                  <Button isLoading>로딩 중</Button>
                  <Button disabled>비활성</Button>
                </Field>
              </div>
            </Section>

            {/* ───── Badge ───── */}
            <Section title="Badge · NotiBadge" desc="상태 뱃지와 알림 카운트 뱃지.">
              <div className="border-border space-y-4 rounded-xl border p-4">
                <Field label="BADGE">
                  <Badge className="bg-primary-background text-primary">Default</Badge>
                  <Badge className="bg-success-background text-success">완료</Badge>
                  <Badge className="bg-warning-background text-warning">진행중</Badge>
                  <Badge className="bg-destructive-background text-destructive">오류</Badge>
                </Field>
                <Field label="NOTI BADGE">
                  <NotiBadge count={3}>
                    <BellIcon className="text-text-secondary" />
                  </NotiBadge>
                  <NotiBadge count={128}>
                    <BellIcon className="text-text-secondary" />
                  </NotiBadge>
                  <NotiBadge isDot>
                    <BellIcon className="text-text-secondary" />
                  </NotiBadge>
                </Field>
              </div>
            </Section>

            {/* ───── Inputs ───── */}
            <Section title="Input" desc="라벨·헬퍼·에러·크기(sm~xl) 지원.">
              <div className="border-border space-y-3 rounded-xl border p-4">
                <Input size="md" label="기본 입력" placeholder="내용을 입력해주세요" helperText="헬퍼 텍스트" />
                <Input size="md" label="에러 상태" error errorText="필수 항목입니다" defaultValue="잘못된 값" />
                <Input size="md" label="비활성" defaultValue="비활성 입력" disabled />
                <NumberInput label="숫자 입력" />
                <PasswordInput label="비밀번호" />
                <Textarea placeholder="여러 줄 입력 (Textarea)" />
                <TagInput label="태그 입력" onChangeTags={() => {}} />
              </div>
            </Section>

            {/* ───── Select ───── */}
            <Section title="Select · MultiSelect" desc="단일/다중 선택.">
              <div className="border-border space-y-3 rounded-xl border p-4">
                <Select label="직책" placeholder="직책을 선택해주세요" size="md">
                  <SelectGroup>
                    <SelectLabel>직책</SelectLabel>
                    <SelectItem value="OWNER">점주</SelectItem>
                    <SelectItem value="STAFF">직원</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectGroup>
                </Select>
                <MultiSelect
                  variant="default"
                  size="md"
                  options={[
                    { label: "점주", value: "OWNER" },
                    { label: "직원", value: "STAFF" },
                    { label: "관리자", value: "ADMIN" },
                  ]}
                  onValueChange={() => {}}
                />
              </div>
            </Section>

            {/* ───── Toggle ───── */}
            <Section title="Checkbox · Switch" desc="선택·토글 컨트롤.">
              <div className="border-border space-y-3 rounded-xl border p-4">
                <Checkbox id="showcase-checkbox" label="이용약관에 동의합니다" />
                <div className="flex items-center gap-2">
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                  <span className="text-text-secondary text-sm">알림 받기 ({switchOn ? "ON" : "OFF"})</span>
                </div>
              </div>
            </Section>

            {/* ───── Overlay ───── */}
            <Section title="Overlay" desc="Modal · Sheet · Popover · Dropdown · Tooltip.">
              <div className="border-border flex flex-wrap gap-2 rounded-xl border p-4">
                <Modal
                  isOpen={isModalOpen}
                  onOpenChange={setIsModalOpen}
                  trigger={<Button variant="outline">Modal</Button>}
                >
                  <ModalHeader>브랜드 소개</ModalHeader>
                  <ModalBody>모달 본문 영역입니다.</ModalBody>
                  <ModalFooter>
                    <ModalActions onCancel={() => setIsModalOpen(false)} />
                  </ModalFooter>
                </Modal>

                <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
                  Sheet
                </Button>
                <Sheet side="bottom" isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <div className="p-4">시트 콘텐츠 영역입니다.</div>
                </Sheet>

                <Popover
                  isOpen={isPopoverOpen}
                  onOpenChange={setIsPopoverOpen}
                  trigger={<Button variant="outline">Popover</Button>}
                >
                  <Card>
                    <CardHeader>Popover</CardHeader>
                    <CardBody>팝오버 콘텐츠</CardBody>
                  </Card>
                </Popover>

                <DropdownMenu trigger={<Button variant="outline">Dropdown</Button>}>
                  <DropdownMenuItem>메뉴 1</DropdownMenuItem>
                  <DropdownMenuItem>메뉴 2</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
                </DropdownMenu>

                <Tooltip trigger={<Button variant="outline">Tooltip</Button>}>도움말 텍스트입니다</Tooltip>
              </div>
            </Section>

            {/* ───── Feedback ───── */}
            <Section title="Feedback" desc="Toast · Skeleton · SpinLoader.">
              <div className="border-border space-y-4 rounded-xl border p-4">
                <Field label="TOAST">
                  <Button size="sm" onClick={() => Toast.success("저장되었습니다")}>
                    Success
                  </Button>
                  <Button size="sm" onClick={() => Toast.info("안내 메시지입니다")}>
                    Info
                  </Button>
                  <Button size="sm" onClick={() => Toast.warning("주의가 필요합니다")}>
                    Warning
                  </Button>
                  <Button size="sm" onClick={() => Toast.error("오류가 발생했습니다")}>
                    Error
                  </Button>
                </Field>
                <Field label="SKELETON">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Field>
                <Field label="SPIN LOADER">
                  <SpinLoader />
                </Field>
              </div>
            </Section>

            {/* ───── Data ───── */}
            <Section title="Card · Separator · Pagination" desc="콘텐츠 컨테이너와 페이지네이션.">
              <Card>
                <CardHeader>카드 헤더</CardHeader>
                <CardBody>카드 본문 영역입니다. 흰 배경 + 헤어라인 보더로 리포트 느낌을 줍니다.</CardBody>
                <CardFooter>
                  <Button size="sm">확인</Button>
                </CardFooter>
              </Card>
              <Separator />
              <Paginator total={100} onPageChange={() => {}} />
              <PaginatorV2 onPageChange={() => {}} />
            </Section>
          </div>
        </BaseContentLayout>
      }
    />
  );
}
