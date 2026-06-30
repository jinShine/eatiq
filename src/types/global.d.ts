// 글로벌 CSS 등 사이드이펙트 import(`import "x.css"`)를 위한 모듈 선언.
// Next.js는 `*.module.css`만 선언하므로 일반 `*.css`는 직접 선언해야
// TS 서버가 `ts(2882)` 없이 사이드이펙트 import를 인식한다.
declare module "*.css";
