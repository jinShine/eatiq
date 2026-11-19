import z from "zod";

import { type BrandContractData, type BrandSignatureData } from "@services/api/brand/brand.type";

import { textOrNull } from "./clearable";

/**
 * 계약 담당자(PUT /contract)·서명권자(PUT /signature) 공통 폼.
 * 두 API의 필드·검증이 같다(서버 400 응답으로 확인): 이름 한국어 50자·영어 100자, 직책 50자, 이메일 100자 + 형식.
 * 4개 모두 선택 입력이다(2026-11-19). 빈 칸은 null로 보내 지운다(clearable.ts).
 */
export const contractPersonSchema = z.object({
  name_ko: z.string().trim().max(50, "50자 이내로 입력해주세요"),
  name_en: z.string().trim().max(100, "100자 이내로 입력해주세요"),
  position: z.string().trim().max(50, "50자 이내로 입력해주세요"),
  email: z
    .string()
    .trim()
    .max(100, "100자 이내로 입력해주세요")
    .refine(value => !value || z.string().email().safeParse(value).success, "올바른 이메일 형식이 아니에요"),
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
  name_ko: textOrNull(values.name_ko),
  name_en: textOrNull(values.name_en),
  position: textOrNull(values.position),
  email: textOrNull(values.email),
});
