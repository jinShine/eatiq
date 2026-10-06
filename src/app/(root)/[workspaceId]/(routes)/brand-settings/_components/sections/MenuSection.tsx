"use client";

import { useId, useState } from "react";
import { Controller, type FieldErrors, useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandMenu } from "@services/api/brand/brand.query";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import MenuPhotoField from "../menu/MenuPhotoField";
import MenuRemoveModal from "../menu/MenuRemoveModal";
import MenuTabs from "../menu/MenuTabs";
import {
  EMPTY_MENU,
  MAX_MENUS,
  MAX_MENU_PHOTOS,
  type MenuFormValues,
  isBlankMenu,
  menuFormSchema,
  toFormValues,
  toRequest,
} from "./menuForm";

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type MenuSectionProps = {
  workspaceId: string;
};

/**
 * 대표 메뉴 (피그마 769:3863) — 메뉴별 탭, 저장 버튼으로 목록 전체를 한 번에 보낸다(PUT 전체 치환).
 *
 * 입력칸은 선택된 탭의 메뉴만 그린다. 다른 탭 값은 폼에 남아 있다(RHF는 화면에서 빠진 필드 값을 지우지 않는다).
 * 그래서 다른 탭에 검증 오류가 있으면 저장할 때 그 탭으로 옮겨 보여준다.
 */
export default function MenuSection({ workspaceId }: MenuSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const panelId = useId();
  const [active, setActive] = useState(0);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const { data: saved } = useBrandSection(workspaceId, "brand_menu");
  const { mutate: updateBrandMenu, isPending, error, reset: clearSaveError } = useUpdateBrandMenu(workspaceId);

  const {
    control,
    register,
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: toFormValues(null),
    values: saved !== undefined ? toFormValues(saved) : undefined,
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: "menu_list" });
  const menus = useWatch({ control, name: "menu_list" }) ?? [];

  useClearOnFormChange(watch, clearSaveError);

  // 서버 값이 바뀌어 메뉴 수가 줄면 선택 위치를 안쪽으로 당긴다
  const current = Math.min(active, fields.length - 1);
  const labels = fields.map((_, index) => menus[index]?.name_ko.trim() || `메뉴 ${index + 1}`);
  const invalid = fields.map((_, index) => Boolean(errors.menu_list?.[index]));
  const menuErrors = errors.menu_list?.[current];
  const prefix = `menu_list.${current}` as const;

  const handleAdd = () => {
    append(EMPTY_MENU, { focusName: `menu_list.${fields.length}.name_ko` });
    setActive(fields.length);
  };

  const handleRemove = () => {
    setIsRemoveOpen(false);
    // 마지막 메뉴를 지우면 빈 메뉴 하나를 남긴다 — 입력칸이 있어야 다시 채울 수 있다
    if (fields.length === 1) {
      replace([EMPTY_MENU]);
    } else {
      remove(current);
      setActive(Math.max(0, current - 1));
    }
  };

  // 업로드 중에 탭을 옮겨도 원래 메뉴에 붙도록 메뉴 위치를 고정해 둔다
  const addPhotos = (index: number) => (urls: string[]) =>
    setValue(`menu_list.${index}.image_list`, [...getValues(`menu_list.${index}.image_list`), ...urls], {
      shouldDirty: true,
    });
  const removePhoto = (index: number) => (url: string) =>
    setValue(
      `menu_list.${index}.image_list`,
      getValues(`menu_list.${index}.image_list`).filter(photo => photo !== url),
      { shouldDirty: true },
    );

  const onSubmit = (values: MenuFormValues) => {
    updateBrandMenu(toRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 목록으로 맞춘다. 빈 메뉴는 빠져서 돌아온다
        const next = toFormValues(response ? response.brand_menu : toRequest(values).menu_list);
        reset(next, { keepFieldsRef: true });
        setActive(index => Math.min(index, next.menu_list.length - 1));
        Toast.success("대표 메뉴를 저장했어요.");
      },
    });
  };

  // 오류가 다른 탭에 있으면 그 탭을 연다. 포커스는 SettingsSection이 첫 오류 칸으로 맞춘다
  const onInvalid = (formErrors: FieldErrors<MenuFormValues>) => {
    if (formErrors.menu_list?.[current]) {
      return;
    }
    const index = fields.findIndex((_, i) => Boolean(formErrors.menu_list?.[i]));
    if (index >= 0) {
      setActive(index);
    }
  };

  const currentMenu = menus[current];
  const canRemove = fields.length > 1 || (currentMenu !== undefined && !isBlankMenu(currentMenu));

  return (
    <div className="space-y-3">
      <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">대표 메뉴</h2>

      <SettingsSection
        title="대표 메뉴 정보"
        description="최대 3개까지의 대표 메뉴를 입력해주세요. 브랜드 소개에도, 상권 분석에도 사용하는 중요 정보입니다."
        isDirty={isDirty}
        isPending={isPending}
        errorMessage={error?.message}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        {/* 탭 줄은 카드 폭 전체 — 바디 여백(p-6)을 상쇄한다 */}
        <div className="-mx-6 -mt-6 mb-6">
          <MenuTabs
            labels={labels}
            invalid={invalid}
            active={current}
            panelId={panelId}
            onSelect={setActive}
            onAdd={fields.length < MAX_MENUS ? handleAdd : undefined}
            onRemove={canRemove ? () => setIsRemoveOpen(true) : undefined}
          />
        </div>

        {/* key — 탭을 바꾸면 입력칸을 새로 그려 다른 메뉴의 값·오류 표시가 섞이지 않게 한다 */}
        <div key={fields[current]?.id} id={panelId} role="tabpanel" aria-label={labels[current]} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              size="md"
              labelClassName="text-xs"
              label="메뉴 이름 (한국어)"
              required
              placeholder="예: 우대 갈비"
              error={Boolean(menuErrors?.name_ko)}
              errorText={menuErrors?.name_ko?.message}
              {...register(`${prefix}.name_ko`)}
            />
            <Input
              size="md"
              labelClassName="text-xs"
              label="메뉴 이름 (영어)"
              required
              placeholder="영문 메뉴 이름을 입력해주세요."
              error={Boolean(menuErrors?.name_en)}
              errorText={menuErrors?.name_en?.message}
              {...register(`${prefix}.name_en`)}
            />
            <Controller
              name={`${prefix}.price`}
              control={control}
              render={({ field }) => (
                <CommaNumberInput
                  size="md"
                  labelClassName="text-xs"
                  label="메뉴 가격"
                  required
                  placeholder="예: 35,000"
                  className="pr-16"
                  endAdornment={<Unit>원 (KRW)</Unit>}
                  error={Boolean(menuErrors?.price)}
                  errorText={menuErrors?.price?.message}
                  {...field}
                />
              )}
            />
          </div>

          <Input
            size="md"
            labelClassName="text-xs"
            label="메뉴 설명"
            required
            placeholder="메뉴 설명을 입력해주세요"
            error={Boolean(menuErrors?.explain)}
            errorText={menuErrors?.explain?.message}
            {...register(`${prefix}.explain`)}
          />

          <MenuPhotoField
            urls={currentMenu?.image_list ?? []}
            max={MAX_MENU_PHOTOS}
            onAdd={addPhotos(current)}
            onRemove={removePhoto(current)}
          />
        </div>
      </SettingsSection>

      <MenuRemoveModal
        label={isRemoveOpen ? (labels[current] ?? null) : null}
        onOpenChange={open => !open && setIsRemoveOpen(false)}
        onConfirm={handleRemove}
      />
    </div>
  );
}
