// Toss 클라이언트 키는 프론트 공개용. 미설정 시 테스트 키로 동작한다.
export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ??
  'test_ck_EP59LybZ8BJKRm5Z4LKY86GYo7pR';

export const TOSS_SDK_URL = 'https://js.tosspayments.com/v2/standard';

export const PAYMENT_SUCCESS_PATH = '/payment/success';
export const PAYMENT_FAIL_PATH = '/payment/fail';
