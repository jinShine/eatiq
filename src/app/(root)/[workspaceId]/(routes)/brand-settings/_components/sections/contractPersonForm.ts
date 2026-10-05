import z from "zod";

import { type BrandContractData, type BrandSignatureData } from "@services/api/brand/brand.type";

/**
 * 계약 담당자(PUT /contract)·서명권자(PUT /signature) 공통 폼.
 * 두 API의 필드·검증이 같다(서버 400 응답으로 확인): 4개 모두 필수,
 * 이름 한국어 50자·영어 100자, 직책 50자, 이메일 100자 + 형식.
 */
export const contractPersonSchema = z.object({
  name_ko: z.string().trim().min(1, "이름(한국어)을 입력해주세요").max(50, "50자 이내로 입력해주세요"),
  name_en: z.string().trim().min(1, "이름(영어)을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  position: z.string().trim().min(1, "직책을 입력해주세요").max(50, "50자 이내로 입력해주세요"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요")
    .max(100, "100자 이내로 입력해주세요")
    .email("올바른 이메일 형식이 아니에요"),
});

export type ContractPersonFormValues = z.infer<typeof contractPersonSchema>;

export const EMPTY_CONTRACT_PERSON: ContractPersonFormValues = { name_ko: "", name_en: "", position: "", email: "" };

type ContractPersonData = BrandContractData | BrandSignatureData;

export const toContractPersonFormValues = (saved: ContractPersonData): ContractPersonFormValues => ({
  name_ko: saved.name_ko ?? "",
  name_en: saved.name_en ?? "",
  position: saved.position ?? "",
  email: saved.email ?? "",
});

export const toContractPersonRequest = (values: ContractPersonFormValues) => ({
  name_ko: values.name_ko.trim(),
  name_en: values.name_en.trim(),
  position: values.position.trim(),
  email: values.email.trim(),
});
