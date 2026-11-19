import z from "zod";

import { type BrandMenuItem, type UpdateBrandMenuRequest } from "@services/api/brand/brand.type";

import { INTEGER } from "./formFields";
import { toNumberText } from "./numberText";

/**
 * 대표 메뉴 폼. 필드 이름은 저장 DTO(MenuItemDto)와 같다 → BasicInfoSection 주석 참고.
 *
 * 서버 규칙(400 응답으로 확인): 이름 한/영 100자, 가격 0 이상 정수, 설명 1000자, 사진은 빈 배열 허용.
 * 스펙은 설명을 300자로 적었지만 서버는 1000자까지 받는다.
 * 모든 칸이 선택 입력이다(2026-11-19 서버 필수 해제) — 아는 칸만 채운 메뉴도 저장된다.
 */

/** 피그마 769:3865 "최대 3개까지". 서버는 개수를 막지 않는다 */
export const MAX_MENUS = 3;

/** 메뉴당 사진 수 — 서버에 제한이 없어 대표 이미지와 같이 10장으로 둔다 */
export const MAX_MENU_PHOTOS = 10;

/** 가격 상한 — 서버에 상한이 없어 운영 현황 객단가와 같은 기준으로 막는다 */
const MAX_PRICE = { value: 100_000_000, label: "1억 원" };

const maxLength = (max: number) => `${max}자 이내로 입력해주세요`;

const menuShape = z.object({
  name_ko: z.string().trim().max(100, maxLength(100)),
  name_en: z.string().trim().max(100, maxLength(100)),
  price: z.string(),
  explain: z.string().trim().max(1000, maxLength(1000)),
  image_list: z.array(z.string()),
});

export type MenuFormValue = z.infer<typeof menuShape>;

export const EMPTY_MENU: MenuFormValue = { name_ko: "", name_en: "", price: "", explain: "", image_list: [] };

/**
 * 아무것도 입력하지 않은 메뉴. 저장할 때 빼고, 검증도 건너뛴다.
 * 메뉴가 없어도 입력칸 한 벌은 보여야 해서(저니 패널이 name_ko로 포커스) 빈 메뉴를 하나 둔다.
 */
export const isBlankMenu = (menu: MenuFormValue) =>
  !menu.name_ko.trim() && !menu.name_en.trim() && !menu.price && !menu.explain.trim() && menu.image_list.length === 0;

// 가격은 적었을 때만 형식·상한을 본다
const menuSchema = menuShape.superRefine((menu, ctx) => {
  if (!menu.price) {
    return;
  }
  if (!INTEGER.test(menu.price)) {
    ctx.addIssue({ code: "custom", path: ["price"], message: "0 이상의 정수를 입력해주세요" });
  } else if (Number(menu.price) > MAX_PRICE.value) {
    ctx.addIssue({ code: "custom", path: ["price"], message: `${MAX_PRICE.label} 이하로 입력해주세요` });
  }
});

export const menuFormSchema = z.object({ menu_list: z.array(menuSchema).max(MAX_MENUS) });

export type MenuFormValues = z.infer<typeof menuFormSchema>;

/** 저장값 → 폼. 메뉴가 없으면 빈 메뉴 하나 */
export const toFormValues = (saved: BrandMenuItem[] | null | undefined): MenuFormValues => ({
  menu_list: saved?.length
    ? saved.map(menu => ({
        name_ko: menu.name_ko ?? "",
        name_en: menu.name_en ?? "",
        price: toNumberText(menu.price),
        explain: menu.explain ?? "",
        image_list: menu.image_list ?? [],
      }))
    : [EMPTY_MENU],
});

/**
 * 폼 → 요청. 메뉴 목록은 통째로 바뀌어서 빈 메뉴를 뺀 나머지가 곧 저장될 목록이다.
 * 메뉴 안의 빈 칸은 보내지 않는다 — 새 목록이라 지울 이전 값이 없다
 */
export const toRequest = (values: MenuFormValues): UpdateBrandMenuRequest => ({
  menu_list: values.menu_list
    .filter(menu => !isBlankMenu(menu))
    .map(menu => ({
      name_ko: menu.name_ko.trim() || undefined,
      name_en: menu.name_en.trim() || undefined,
      price: menu.price ? Number(menu.price) : undefined,
      explain: menu.explain.trim() || undefined,
      image_list: menu.image_list,
    })),
});
