# EATIQ LINK — 프로젝트 가이드

한식 F&B 브랜드의 해외 진출을 돕는 B2B SaaS. 백엔드는 별도 Spring 서버(`eatiqlink-dev.onrender.com`).

> 작업 방식·프로젝트 맥락(구현 범위, 백엔드 개발 주체, 미해결 이슈)은 auto-memory에 있다. 이 문서는 **코드 규칙**만 다룬다.

## 스택

- **Next.js 16.0.7** App Router (Turbopack) / **React 19.2.3** / TypeScript
- **Tailwind CSS v4** + shadcn/ui(Radix) + `class-variance-authority`
- **TanStack Query v5** (서버 상태) / **zustand** (클라이언트 상태) / `axios`
- **react-hook-form + zod** (`@hookform/resolvers`)
- `motion`, `sonner`(Toast), `lucide-react`, `recharts`, `dayjs`
- Storybook 10, Vitest, ESLint + Prettier(`@trivago/prettier-plugin-sort-imports`)
- 패키지 매니저: **bun** (`bun.lock`)

## 명령어

```bash
bun run dev          # next dev --turbopack
bun run type-check   # tsc --noEmit — 작업 단위마다 실행
bun run lint
bun run gen:api      # Swagger /v3/api-docs → src/services/openapi.ts 재생성
bun run storybook
```

## 라우팅 구조

```
src/app/
  auth/{sign-in,sign-up}/          # 비인증. 사이드바 없음
  (root)/
    layout.tsx                     # 인증 가드 전용 (클라이언트 — 토큰이 localStorage라 middleware 불가)
    page.tsx                       # "/" → last workspace로 redirect
    [workspaceId]/
      layout.tsx                   # GlobalSideNav의 집
      (routes)/<route>/
        page.tsx                   # 서버 컴포넌트
        _container/index.tsx       # "use client" — 실제 로직
        _components/               # 화면 전용 컴포넌트
        _hooks/                    # 화면 전용 훅
```

라우트: `dashboard` · `brand-settings` · `progress`(+`[progressId]`) · `market-analysis` · `buyer` · `brand` · `brand-documents` · `account` · `workspaces-settings`

### page.tsx / \_container 분리 (필수 패턴)

`page.tsx`는 **서버 컴포넌트**로 두고 `params`·`searchParams`를 언랩해 컨테이너에 props로 넘긴다. `"use client"`는 `_container/index.tsx`에서 시작한다.

```tsx
// page.tsx — 서버
export default function BrandSettingsPage({ params, searchParams }: Props) {
  const { workspaceId } = use(params);
  const { tab } = use(searchParams);
  return <BrandSettingsContainer workspaceId={workspaceId} activeTab={(tab ?? "basic") as SettingsTabKey} />;
}
```

`useSearchParams()`를 클라이언트에서 읽지 말고 **서버에서 받아 내려보낸다.**

### 네이밍 규칙 (중요)

앱 공용어는 **`workspace`**, API 리소스는 **`brand`**(`/api/brands`). 현재 1:1.
`workspaceId → brandId` 번역은 **service/query 레이어에서만** 하고, 앱 안쪽으로 `brand` 용어를 누수시키지 않는다. 프레젠테이션 컴포넌트에는 API DTO 대신 뷰모델(`{ id, name }`)을 넘긴다.

## 데이터 레이어

```
src/services/
  axios.client.ts / axios.server.ts / token-storage.ts
  openapi.ts                       # 자동 생성 — 직접 수정 금지
  types/common.ts                  # ApiResponse<T>
  api/<domain>/
    <domain>.api.ts                # ENDPOINTS 객체 + 함수
    <domain>.query.ts              # useQuery / useMutation 훅
    <domain>.type.ts               # 요청·응답 타입
```

- 도메인 폴더는 **큰 카테고리 단위**로 묶는다. `brand-settings`를 따로 만들지 않고 `api/brand/`에서 함께 관리.
- 경로는 `BASE_PATH` + `buildPath()` + `ENDPOINTS` 객체로 관리한다.
  ```ts
  const BASE_PATH = "/api/brands";
  const buildPath = (brandId: string) => `${BASE_PATH}/${brandId}`;
  const ENDPOINTS = { list: BASE_PATH, settings: (id: string) => `${buildPath(id)}/settings` };
  ```
- **요청·응답 타입은 반드시 `components["schemas"][...]`로 가져온다.** 손으로 쓰면 타입이 아니라 추측이 된다(실제로 `WorkspaceDetailResponse`를 `{ message, workspace }`로 잘못 적어 런타임 에러를 냈다 — 응답은 평탄했다). 스펙에 없으면 백엔드에 요청하지, 추측으로 채우지 않는다.
  ```ts
  // O
  export type WorkspaceDetailResponse = components["schemas"]["WorkspaceDetailResponseDto"];
  // X — 스펙에 있는데도 직접 정의
  export type WorkspaceDetailResponse = { message: string; workspace: { ... } };
  ```
- 손으로 쓰는 타입은 **뷰모델뿐**이다(`Workspace`, `WorkspaceMember`, `*View`). 이건 DTO가 아니라 화면의 것이라 서버와 따로 변한다. 값 집합(등급·상태 등)은 `Dto["grade"]`처럼 스펙에서 파생시킨다.
- 목 데이터는 **실제 응답 구조를 그대로** 흉내 낸다. null·빈 배열·0건도 담는다. 잘못된 타입에 맞춘 목은 검증 능력을 잃는다.
- 백엔드 응답은 평탄하다. `{ success, data }` 래핑이 없고 대부분 `message` + 실제 필드가 최상위에 온다. **저장 실패 시 `message`를 반드시 확인**(서버가 스펙에 없는 코드값 검증을 한다).
- 캐시 무효화는 `@hooks/commons`의 `useInvalidateQueries` 사용.
- 브랜드 설정 13개 섹션은 **`PUT`**(전체 치환)이다. 한 필드가 검증 실패하면 요청 전체가 실패한다.
- **예외: 브랜드 설정 폼은 저장 DTO의 필드 이름(snake_case)을 그대로 쓴다.** 뷰모델로 이름을 바꾸지 않는다. PUT이라 매핑에서 한 필드를 빠뜨리면 서버 값이 지워지고, 완성도 API의 `field_key`가 이 이름을 가리켜 저니 패널이 `[name="..."]`으로 입력칸에 포커스한다. 폼↔DTO 변환은 빈 문자열↔`undefined`·숫자 변환만 한다.
- 서버 오류 문구는 axios 인터셉터가 `error.message`로 올린다(검증 실패면 배열을 줄바꿈으로 합침). 화면은 `error.message`를 그대로 보여주면 된다.

## 컴포넌트 계층

| 위치                     | 용도                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `src/components/shadcn/` | shadcn 원본 — 직접 수정 최소화                                                     |
| `src/components/ui/`     | 프로젝트 공통 UI(`Modal`, `Select`, `Sheet`, `Toast`…). `index.ts`로 배럴 export   |
| `src/components/layout/` | `base`(BaseRootLayout·BaseContainerLayout) · `nav` · `header` · `aside` · `footer` |
| `src/components/custom/` | 특수 목적 컴포넌트                                                                 |

- Modal은 `<ModalHeader> / <ModalBody> / <ModalFooter>` 조합을 사용한다(사용자가 만든 규약).
- 색은 디자인 시스템 토큰(`src/styles/css/globals.css`)을 쓴다. 하드코딩 hex 금지. primary는 `--primary: #f83d5e`(Primary/500, 피그마 실측).
- 공통 훅은 `src/hooks/commons/`(배럴 export), 화면 전용 훅은 해당 라우트의 `_hooks/`.

## 경로 alias

`@components` `@configs` `@constants` `@hooks` `@lib` `@services` `@styles` `@types` `@utils` `@stores` `@/*`

## 커밋

Conventional Commits + **한국어 설명**. scope는 라우트/도메인명.

```
feat(market-analysis): AI 상권분석 시작 모달 추가
fix(brand-settings): Select 검증 메시지가 보이지 않던 문제 수정
chore(api): OpenAPI 스펙 갱신
```

## 검증

작업 단위마다 `bun run type-check`. 인증이 필요한 화면은 사용자가 로그인한 뒤 브라우저로 동작을 확인한다(401 `AUTH_UNAUTHORIZED`가 뜨면 먼저 미로그인 여부를 확인).
