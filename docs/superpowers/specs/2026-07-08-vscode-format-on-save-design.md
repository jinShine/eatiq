# VS Code 저장 시 Prettier 적용 설계

## 목적

VS Code에서 TypeScript 및 TSX 파일을 `Cmd+S`로 저장할 때 프로젝트에 설치된 Prettier와
`@trivago/prettier-plugin-sort-imports`가 자동으로 실행되게 한다.

## 변경 범위

- `.vscode/settings.json`을 추가한다.
- workspace 기본 formatter를 `esbenp.prettier-vscode`로 지정한다.
- 저장 시 formatter를 실행한다.
- 프로젝트의 `.prettierrc.cjs`가 있는 경우에만 Prettier를 실행하도록 한다.
- ESLint 자동 수정은 이번 변경에 포함하지 않는다.

## 동작 흐름

1. 사용자가 VS Code에서 지원 파일을 저장한다.
2. VS Code가 Prettier 확장을 기본 formatter로 호출한다.
3. Prettier가 프로젝트의 `.prettierrc.cjs`를 읽는다.
4. 코드 포맷과 import 정렬 결과가 저장된다.

## 검증

- workspace 설정 JSON이 올바른지 확인한다.
- 현재 포맷되지 않은 `src/stores/useSidebarStore.ts`의 포맷 필요 상태를 확인한다.
- 설정 추가 후 프로젝트 Prettier를 실행해 해당 파일이 설정대로 처리 가능한지 확인한다.
- VS Code 확장이 설치되어 있는지 확인한다.
