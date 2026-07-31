import { type components } from "@services/openapi";

export type BrandSummary = components["schemas"]["BrandSummary"];
export type BrandDetail = components["schemas"]["BrandDetail"];
export type PageResponseBrandSummary = components["schemas"]["PageResponseBrandSummary"];
export type CurrentBrandResponse = components["schemas"]["CurrentBrandResponse"];

/************************************
 * 브랜드 정보 설정
 ************************************/
export type BrandSettings = components["schemas"]["BrandSettingsResponse"];
export type BrandBasic = components["schemas"]["BrandBasicDto"];
export type UpdateBasicRequest = components["schemas"]["UpdateBasicRequest"];
export type BasicSaveResponse = components["schemas"]["BasicSaveResponse"];
export type BrandJourney = components["schemas"]["JourneyDto"];
export type BrandMissingItem = components["schemas"]["MissingItemDto"];
export type BrandNextAction = components["schemas"]["NextActionDto"];
export type BrandIntro = components["schemas"]["BrandIntroDto"];
export type UpdateIntroRequest = components["schemas"]["UpdateIntroRequest"];
export type IntroSaveResponse = components["schemas"]["IntroSaveResponse"];
export type BrandOperation = components["schemas"]["BrandOperationDto"];
export type UpdateOperationRequest = components["schemas"]["UpdateOperationRequest"];
export type OperationSaveResponse = components["schemas"]["OperationSaveResponse"];
export type BrandContact = components["schemas"]["BrandContactDto"];
export type UpdateContactRequest = components["schemas"]["UpdateContactRequest"];
export type ContactSaveResponse = components["schemas"]["ContactSaveResponse"];

/************************************
 * 계약 및 정책
 ************************************/
export type BrandContract = components["schemas"]["BrandContractDto"];
export type UpdateContractRequest = components["schemas"]["UpdateContractRequest"];
export type ContractSaveResponse = components["schemas"]["ContractSaveResponse"];
export type BrandPolicy = components["schemas"]["BrandPolicyDto"];
export type UpdatePolicyRequest = components["schemas"]["UpdatePolicyRequest"];
export type PolicySaveResponse = components["schemas"]["PolicySaveResponse"];
export type BrandFee = components["schemas"]["BrandFeeDto"];
export type UpdateFeeRequest = components["schemas"]["UpdateFeeRequest"];
export type FeeSaveResponse = components["schemas"]["FeeSaveResponse"];

/************************************
 * 상권분석 기준
 ************************************/
export type BrandAreaCriteria = components["schemas"]["BrandAreaCriteriaDto"];
export type UpdateAreaCriteriaRequest = components["schemas"]["UpdateAreaCriteriaRequest"];
export type AreaCriteriaSaveResponse = components["schemas"]["AreaCriteriaSaveResponse"];
