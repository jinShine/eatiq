"use client";

import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandStore } from "@services/api/brand/brand.query";
import { type BrandStoreData, type UpdateBrandStoreRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import PhotoListField from "../media/PhotoListField";

/**
 * 대표 매장 (피그마 186:2177). 폼 필드 이름은 저장 DTO(UpdateBrandStoreDto)와 같다 → BasicInfoSection 주석 참고.
 *
 * 서버 규칙(400 응답으로 확인): 매장 이름(한국어) 필수 100자, 영어 이름 100자, 주소 255자, 사진은 URL.
 * PUT 전체 치환이라 사진 목록을 빼고 보내면 서버가 사진을 비운다 — 항상 보낸다.
 */
const maxLength = (max: number) => `${max}자 이내로 입력해주세요`;

/** 매장당 사진 수 — 서버에 제한이 없어 대표 이미지·메뉴 사진과 같이 10장으로 둔다 */
const MAX_STORE_PHOTOS = 10;

const storeSchema = z.object({
  store_name_ko: z.string().trim().min(1, "대표 매장 이름(한국어)을 입력해주세요").max(100, maxLength(100)),
  store_name_en: z.string().trim().max(100, maxLength(100)),
  store_address: z.string().trim().max(255, maxLength(255)),
  image_list: z.array(z.string()),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const EMPTY_VALUES: StoreFormValues = { store_name_ko: "", store_name_en: "", store_address: "", image_list: [] };

/** 저장값 → 폼. 저장한 적 없으면(null) 빈 입력칸 */
const toFormValues = (saved: BrandStoreData | null): StoreFormValues =>
  saved
    ? {
        store_name_ko: saved.store_name_ko ?? "",
        store_name_en: saved.store_name_en ?? "",
        store_address: saved.store_address ?? "",
        image_list: saved.image_list ?? [],
      }
    : EMPTY_VALUES;

/** 폼 → 요청. 빈 선택 항목은 보내지 않는다(서버에서 비워진다) */
const toRequest = (values: StoreFormValues): UpdateBrandStoreRequest => ({
  store_name_ko: values.store_name_ko.trim(),
  store_name_en: values.store_name_en.trim() || undefined,
  store_address: values.store_address.trim() || undefined,
  image_list: values.image_list,
});

type StoreSectionProps = {
  workspaceId: string;
};

export default function StoreSection({ workspaceId }: StoreSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_store");
  const { mutate: updateBrandStore, isPending, error, reset: clearSaveError } = useUpdateBrandStore(workspaceId);

  const {
    control,
    register,
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: EMPTY_VALUES,
    values: saved !== undefined ? toFormValues(saved) : undefined,
  });
  const photos = useWatch({ control, name: "image_list" }) ?? [];

  useClearOnFormChange(watch, clearSaveError);

  // 업로드가 끝난 시점의 목록에 붙인다(올리는 사이 지운 사진이 되살아나지 않게)
  const addPhotos = (urls: string[]) =>
    setValue("image_list", [...getValues("image_list"), ...urls], { shouldDirty: true });
  const removePhoto = (url: string) =>
    setValue(
      "image_list",
      getValues("image_list").filter(photo => photo !== url),
      { shouldDirty: true },
    );

  const onSubmit = (values: StoreFormValues) => {
    updateBrandStore(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_store) : values, { keepFieldsRef: true });
        Toast.success("대표 매장 정보를 저장했어요.");
      },
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">대표 매장</h2>

      {/* 시안의 부제는 대표 메뉴 문구를 그대로 옮겨 와 있어(디자인 확인 요청) 매장에 맞게 쓴다 */}
      <SettingsSection
        title="대표 매장 정보"
        description="브랜드를 대표하는 매장의 이름·주소·사진을 입력해주세요."
        isDirty={isDirty}
        isPending={isPending}
        errorMessage={error?.message}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            id="store_name_ko"
            size="md"
            labelClassName="text-xs"
            label="대표 매장 이름 (한국어)"
            required
            placeholder="예: 몽탄 애월점"
            error={Boolean(errors.store_name_ko)}
            errorText={errors.store_name_ko?.message}
            {...register("store_name_ko")}
          />
          <Input
            id="store_name_en"
            size="md"
            labelClassName="text-xs"
            label="대표 매장 이름 (영어)"
            placeholder="대표 매장 영어 이름을 입력해주세요"
            error={Boolean(errors.store_name_en)}
            errorText={errors.store_name_en?.message}
            {...register("store_name_en")}
          />
        </div>

        <Input
          id="store_address"
          size="md"
          labelClassName="text-xs"
          label="대표 매장 주소"
          placeholder="예: 제주특별자치도 제주시 애월읍 애월리 2546-5"
          error={Boolean(errors.store_address)}
          errorText={errors.store_address?.message}
          {...register("store_address")}
        />

        {/* 시안의 칸 이름은 "메뉴 사진"이지만 매장 사진을 받는다.
            업로드 칸 name = 완성도 API field_key(image_list) — 저니 패널이 이 칸으로 포커스한다 */}
        <PhotoListField
          label="매장 사진"
          name="image_list"
          urls={photos}
          max={MAX_STORE_PHOTOS}
          onAdd={addPhotos}
          onRemove={removePhoto}
        />
      </SettingsSection>
    </div>
  );
}
