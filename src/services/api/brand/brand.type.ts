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
