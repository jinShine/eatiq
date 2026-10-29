"use client";

import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

import FormSelect from "../../company-settings/_components/FormSelect";
import {
  EMPTY_STORE_SEARCH,
  type StoreSearchFormValues,
  storeSearchSchema,
  toExecuteRequest,
} from "./storeSearchSchema";
import { FLOOR_OPTIONS, STORE_SEARCH_CITY_OPTIONS, STORE_SEARCH_COUNTRY_OPTIONS } from "./storeSearchView";

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type StartStoreSearchModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (body: ReturnType<typeof toExecuteRequest>) => void;
};

/**
 * 탐색 시작 모달 (피그마 961:11665).
 * 시안의 「상세 조건」 탭은 서버가 쓰지 않아 두지 않는다 — 입력해도 결과가 바뀌지 않으면 혼란스럽다.
 */
export default function StartStoreSearchModal({
  isOpen,
  onOpenChange,
  isPending,
  onSubmit,
}: StartStoreSearchModalProps) {
  "use no memo";

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StoreSearchFormValues>({
    resolver: zodResolver(storeSearchSchema),
    defaultValues: EMPTY_STORE_SEARCH,
  });

  // reactCompiler가 켜져 있어 watch()는 리렌더를 트리거하지 못한다. 훅인 useWatch를 써야 한다
  const country = useWatch({ control, name: "country" });
  const cityOptions = STORE_SEARCH_CITY_OPTIONS[country] ?? [];

  // 국가를 바꾸면 이전 도시를 비운다(「홍콩 · 도쿄」 같은 조합을 막는다)
  const changeCountry = () => setValue("city", "");

  const handleOpenChange = (open: boolean) => {
    // 실행 중에 닫으면 결과 화면으로 넘어가는 순간 모달이 다시 보이지 않아 결과를 놓친다
    if (isPending) {
      return;
    }
    if (!open) {
      reset(EMPTY_STORE_SEARCH);
    }
    onOpenChange(open);
  };

  const submit = handleSubmit(values => onSubmit(toExecuteRequest(values)));

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} className="w-full sm:max-w-[560px]">
      <ModalHeader>탐색 시작</ModalHeader>

      <ModalBody className="max-h-[60vh] gap-6 overflow-y-auto py-1">
        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            control={control}
            name="country"
            label="탐색 국가"
            labelClassName="text-[13px] font-semibold"
            options={STORE_SEARCH_COUNTRY_OPTIONS}
            onValueChange={changeCountry}
          />
          <FormSelect
            control={control}
            name="city"
            label="탐색 도시"
            labelClassName="text-[13px] font-semibold"
            placeholder={country ? "선택해주세요" : "국가를 먼저 선택해주세요"}
            options={cityOptions}
            disabled={!country}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            size="md"
            label="평형 (최소)"
            labelClassName="text-[13px] font-semibold"
            placeholder="15"
            inputMode="numeric"
            endAdornment={<Unit>평</Unit>}
            error={Boolean(errors.areaMin)}
            errorText={errors.areaMin?.message}
            {...register("areaMin")}
          />
          <Input
            size="md"
            label="평형 (최대)"
            labelClassName="text-[13px] font-semibold"
            placeholder="30"
            inputMode="numeric"
            endAdornment={<Unit>평</Unit>}
            error={Boolean(errors.areaMax)}
            errorText={errors.areaMax?.message}
            {...register("areaMax")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            size="md"
            label="임대료 (최소, 월/KRW)"
            labelClassName="text-[13px] font-semibold"
            placeholder="300"
            inputMode="numeric"
            endAdornment={<Unit>만원</Unit>}
            error={Boolean(errors.rentMinManwon)}
            errorText={errors.rentMinManwon?.message}
            {...register("rentMinManwon")}
          />
          <Input
            size="md"
            label="임대료 (최대, 월/KRW)"
            labelClassName="text-[13px] font-semibold"
            placeholder="800"
            inputMode="numeric"
            endAdornment={<Unit>만원</Unit>}
            error={Boolean(errors.rentMaxManwon)}
            errorText={errors.rentMaxManwon?.message}
            {...register("rentMaxManwon")}
          />
        </div>

        <FormSelect
          control={control}
          name="floor"
          label="허용 층수"
          labelClassName="text-[13px] font-semibold"
          options={FLOOR_OPTIONS}
        />

        <p className="text-text-tertiary text-xs leading-relaxed">
          임대료는 원화로 입력하면 현지 통화로 바꿔 찾아요. 조건에 맞는 매물을 최대 10건까지 보여드려요.
        </p>
      </ModalBody>

      <ModalFooter className="border-border -mx-6 -mb-6 border-t px-6 py-4">
        <Button type="button" size="sm" isLoading={isPending} disabled={isPending} onClick={submit}>
          분석 시작
        </Button>
      </ModalFooter>
    </Modal>
  );
}
