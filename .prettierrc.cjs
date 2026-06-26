module.exports = {
  arrowParens: "avoid", // 화살표 함수 괄호를 사용할 것인지 <always|avoid>
  bracketSpacing: true, // 객체 리터럴에서 괄호에 공백 삽입 여부  <bool>
  singleQuote: false, // single 쿼테이션 사용 여부
  trailingComma: "all", // 여러 줄을 사용할 때, 후행 콤마 사용 방식 <all|es5|none>
  tabWidth: 2, // 탭 너비
  printWidth: 120, //  줄 바꿈 할 폭 길이
  semi: true, // 세미콜론 사용 여부
  endOfLine: "lf", // EoF 방식, OS별로 처리 방식이 다름  <lf|crlf|cr|auto>, lf: \n, crlf: \r\n, cr: \r, auto: 기존 라인을 유지
  quoteProps: "consistent", // 객체 속성에 쿼테이션 적용 방식 <as-needed|consistent|preserve>
  useTabs: false, // 탭 사용 여부

  // <-- import 자동 정렬
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^server-only$",
    "^react(.*)$",
    "^next(.*)$",
    "<THIRD_PARTY_MODULES>",

    "^@/features/(.*)$",

    "^@components/(.*)$",

    "^@services/(.*)$",
    "^@hooks/(.*)$",
    "^@stores/(.*)$",
    "^@lib/(.*)$",

    "^@constants/(.*)$",
    "^@configs/(.*)$",
    "^@types/(.*)$",

    "^@utils/(.*)$",
    "^@styles/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  //-->
};
