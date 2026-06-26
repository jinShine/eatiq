module.exports = {
  root: true,
  env: {
    browser: true, // window, document 등 브라우저 전역 변수 사용 허용
    node: true, // require, module, process 등 Node.js 전역 변수 사용 허용
    es2021: true, // Promise, Map, Set 등 ES2021 전역 변수 사용 허용
  },
  extends: [
    "eslint:recommended", // ESLint 기본 추천 규칙
    "plugin:@typescript-eslint/recommended", // TypeScript 추천 규칙
    "plugin:react/recommended", // React 추천 규칙
    "plugin:react-hooks/recommended", // React Hooks 추천 규칙
    "plugin:import/recommended", // import 추천 규칙
    "plugin:import/typescript", // TypeScript import 규칙
    "next/core-web-vitals", // Next.js 성능 규칙
    "plugin:prettier/recommended", // Prettier 연동 (항상 마지막!)
  ],
  parser: "@typescript-eslint/parser", // TypeScript 코드를 이해할 수 있는 파서 지정 (TypeScript 문법(interface, type, 제네릭 등)을 파싱하려면 필요)
  parserOptions: {
    ecmaVersion: "latest", // 최신 JavaScript 문법 허용
    sourceType: "module", // import/export 문법 허용
    ecmaFeatures: {
      jsx: true, // JSX 문법 허용
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "import", "jsx-a11y"],
  settings: {
    "react": {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // ═══════════════════════════════════════════
    // 📦 Import 규칙
    // ═══════════════════════════════════════════
    // import/order는 Prettier의 @trivago/prettier-plugin-sort-imports가 처리
    "import/order": "off",
    "import/no-duplicates": "error",
    "import/no-unresolved": "off", // TypeScript가 처리
    "import/no-named-as-default-member": "off", // dayjs 등 라이브러리 오탐 방지
    "import/no-named-as-default": "off", // next-auth 등 라이브러리 오탐 방지

    // ═══════════════════════════════════════════
    // ⚛️ React 규칙
    // ═══════════════════════════════════════════
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    // 함수 선언식과 화살표 함수 모두 허용 (팀 스타일에 맞게 조정)
    "react/function-component-definition": [
      "error",
      {
        namedComponents: ["arrow-function", "function-declaration"],
        unnamedComponents: "arrow-function",
      },
    ],
    "react/self-closing-comp": "error",
    "react/display-name": "off",

    // ═══════════════════════════════════════════
    // 🪝 React Hooks 규칙
    // ═══════════════════════════════════════════
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",

    // ═══════════════════════════════════════════
    // 🔷 TypeScript 규칙
    // ═══════════════════════════════════════════
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports", "fixStyle": "inline-type-imports" }],

    // ═══════════════════════════════════════════
    // 🌐 Next.js 규칙
    // ═══════════════════════════════════════════
    "@next/next/no-img-element": "off", // 필요시 "error"로 변경

    // ═══════════════════════════════════════════
    // 📝 일반 JavaScript 규칙
    // ═══════════════════════════════════════════
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": "off", // @typescript-eslint 버전 사용
    "eqeqeq": ["error", "always", { "null": "ignore" }], // == null 은 null/undefined 동시 체크 관용구로 허용
    "no-constant-condition": ["error", { "checkLoops": false }], // while(true) 등 의도적 무한 루프 허용
    "no-implicit-coercion": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "object-shorthand": "error",
    "prefer-destructuring": [
      "warn", // 권장 사항으로 변경
      {
        array: false,
        object: true,
      },
    ],
    "no-nested-ternary": "off",
    "prefer-template": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "curly": ["error", "all"],
    "no-else-return": "off",
    "spaced-comment": "off",

    // ═══════════════════════════════════════════
    // 🎨 코드 스타일 (Prettier가 처리하지 않는 것들)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    // 🏢 ForSpaceLab 전용 규칙
    // ═══════════════════════════════════════════
    // TODO, FIXME 등 주석 경고
    "no-warning-comments": [
      "warn",
      {
        terms: ["TODO", "FIXME", "XXX", "BUG"],
        location: "anywhere",
      },
    ],
    // 네이밍 컨벤션
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
        filter: {
          regex: "^_",
          match: false,
        },
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "interface",
        format: ["PascalCase"],
      },
      {
        selector: "typeAlias",
        format: ["PascalCase", "UPPER_CASE"],
      },
      {
        selector: "enum",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE", "PascalCase"],
      },
    ],

    // ═══════════════════════════════════════════
    // 🌟 Airbnb 스타일 추가 규칙 (유명 기업 표준)
    // ═══════════════════════════════════════════
    // 파라미터 재할당 금지 (불변성 유지)
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: [
          "state", // Redux toolkit
          "acc", // reduce accumulator
          "e", // event
          "ctx", // context
          "req", // express request
          "res", // express response
          "draft", // immer
          "config", // axios interceptor
        ],
      },
    ],
    // 변수 섀도잉 금지
    "@typescript-eslint/no-shadow": "off",
    "no-shadow": "off", // @typescript-eslint 버전 사용
    // 선언 전 사용 금지
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    "no-use-before-define": "off", // @typescript-eslint 버전 사용
    // 일관된 return
    "consistent-return": "off",
    // 불필요한 조건문 금지
    "no-lonely-if": "error",
    // 불필요한 삼항 연산자 금지
    "no-unneeded-ternary": "error",
    // default case 필수
    "default-case": "error",
    // switch문 default를 마지막에
    "default-case-last": "error",
    // 빈 catch 블록 금지
    "no-empty": ["error", { allowEmptyCatch: false }],
    // return await — type-aware 규칙이라 parserOptions.project 필요. 성능상 비활성화
    // "@typescript-eslint/return-await": ["error", "in-try-catch"],
    // async 함수는 await 필수
    "require-await": "off",
    // 배열 메서드 콜백에서 return 필수
    "array-callback-return": ["error", { allowImplicit: true }],
    // 불필요한 생성자 금지
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    // Promise executor에서 async 금지
    "no-async-promise-executor": "error",
    // await in loop 경고 (병렬 처리 권장)
    "no-await-in-loop": "warn",
  },
  ignorePatterns: [".next", "node_modules", "dist", "build", "*.config.js", "*.config.cjs"],
};
