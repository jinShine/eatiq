#!/usr/bin/env bash
# OpenAPI 스펙을 내려받아 src/services/openapi.ts를 재생성한다.
#
# 스펙 문서가 Basic 인증으로 막혀 있어 openapi-typescript에 URL을 바로 넘길 수 없다.
# (openapi-typescript에는 헤더 옵션이 없다)
# 그래서 curl로 받아 임시 파일에 저장한 뒤 그 파일로 생성한다.
#
# 자격증명은 .env.local에서 읽는다. .env.local은 gitignore 대상이라 저장소에 남지 않는다.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env.local ]; then
  # shellcheck disable=SC1091
  set -a && source .env.local && set +a
fi

: "${API_DOCS_URL:?.env.local에 API_DOCS_URL을 설정해주세요 (예: http://호스트/api-docs-json)}"
: "${API_DOCS_USER:?.env.local에 API_DOCS_USER를 설정해주세요}"
: "${API_DOCS_PASSWORD:?.env.local에 API_DOCS_PASSWORD를 설정해주세요}"

spec="$(mktemp -t eatiq-openapi)"
trap 'rm -f "$spec"' EXIT

echo "→ 스펙 내려받는 중: $API_DOCS_URL"
curl -fsSL --max-time 60 -u "$API_DOCS_USER:$API_DOCS_PASSWORD" "$API_DOCS_URL" -o "$spec"

echo "→ 타입 생성 중: src/services/openapi.ts"
bunx openapi-typescript "$spec" -o src/services/openapi.ts

# openapi-typescript의 출력은 프로젝트 포맷과 달라, 정리하지 않으면 재생성할 때마다
# 들여쓰기 차이만으로 수천 줄 diff가 생긴다.
echo "→ 포맷 정리 중"
bunx prettier --write src/services/openapi.ts >/dev/null

echo "✓ 완료"
