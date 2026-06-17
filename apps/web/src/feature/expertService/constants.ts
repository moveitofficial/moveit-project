// 서비스 등록 폼 제한값 (백엔드 CreateServiceRequestDto와 일치).
export const SERVICE_TITLE_MAX = 200;
export const SERVICE_SCOPE_MAX = 30;
// 이런 분께 추천 / 준비사항 / 환불규정 — 서버 제한(500자, HTML 포함)에 맞춤.
export const SERVICE_RICH_MAX = 500;
export const SERVICE_STEP_TITLE_MAX = 10;
export const SERVICE_STEP_DESC_MAX = 16;
export const SERVICE_FAQ_QUESTION_MAX = 50;
export const SERVICE_FAQ_ANSWER_MAX = 500;

export const SERVICE_MIN_STEPS = 1;
export const SERVICE_MAX_STEPS = 4;
export const SERVICE_MIN_FAQS = 1;
export const SERVICE_MIN_DETAIL_IMAGES = 1;
export const SERVICE_MAX_DETAIL_IMAGES = 10;
export const SERVICE_MIN_TECH_STACKS = 1;
export const SERVICE_MAX_TECH_STACKS = 3;
