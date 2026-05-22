import { HttpStatus } from '@nestjs/common';

export const COMMON_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '서버 오류가 발생했습니다.',
    code: 'INTERNAL_SERVER_ERROR',
  },
  UNAUTHORIZED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '인증이 필요합니다.',
    code: 'UNAUTHORIZED',
  },
  FORBIDDEN: {
    status: HttpStatus.FORBIDDEN,
    message: '접근 권한이 없습니다.',
    code: 'FORBIDDEN',
  },
  BLOCKED: {
    status: HttpStatus.FORBIDDEN,
    message: '차단된 계정입니다.',
    code: 'BLOCKED',
  },
  VALIDATION_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    message: '입력값이 올바르지 않습니다.',
    code: 'VALIDATION_ERROR',
  },
} as const;

export const OAUTH_ERRORS = {
  OAUTH_DUPLICATE_EMAIL: {
    status: HttpStatus.CONFLICT,
    message: '이 이메일로 가입된 계정이 있습니다. (OAuth)',
    code: 'OAUTH_DUPLICATE_EMAIL',
  },
  OAUTH_SIGNUP_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '가입 토큰이 유효하지 않습니다.',
    code: 'OAUTH_SIGNUP_TOKEN_INVALID',
  },
  OAUTH_SIGNUP_TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '역할 선택 시간 만료. 구글 로그인을 다시 시도해 주세요.',
    code: 'OAUTH_SIGNUP_TOKEN_EXPIRED',
  },
} as const;

export const AUTH_ERRORS = {
  DUPLICATE_EMAIL: {
    status: HttpStatus.CONFLICT,
    message: '이미 가입된 이메일입니다.',
  },
  INVALID_CREDENTIALS: {
    status: HttpStatus.UNAUTHORIZED,
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  TOKEN_EXPIRED: {
    status: HttpStatus.UNAUTHORIZED,
    message: '토큰이 만료되었습니다.',
  },
  ACCESS_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 액세스 토큰입니다.',
  },
  REFRESH_TOKEN_INVALID: {
    status: HttpStatus.UNAUTHORIZED,
    message: '유효하지 않은 리프레시 토큰입니다.',
  },
} as const;

export const USER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '유저를 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 존재하는 유저입니다.',
  },
  DELETED: {
    status: HttpStatus.FORBIDDEN,
    message: '탈퇴한 계정입니다.',
    code: 'DELETED',
  },
  INVALID_PASSWORD: {
    status: HttpStatus.BAD_REQUEST,
    message: '현재 비밀번호가 올바르지 않습니다.',
  },
  PASSWORD_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '새 비밀번호가 일치하지 않습니다.',
  },
} as const;

export const SERVICE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '서비스를 찾을 수 없습니다.',
  },
  NOT_AVAILABLE: {
    status: HttpStatus.BAD_REQUEST,
    message: '이용할 수 없는 서비스입니다.',
  },
  ALREADY_DELETED: {
    status: HttpStatus.CONFLICT,
    message: '이미 삭제된 서비스입니다.',
  },
  FORBIDDEN_NOT_OWNER: {
    status: HttpStatus.FORBIDDEN,
    message: '본인이 등록한 서비스만 수정, 상태 변경 또는 종료할 수 있습니다.',
  },
  IMAGE_PARTIAL_UPDATE: {
    status: HttpStatus.BAD_REQUEST,
    message: '메인 이미지와 상세 이미지는 함께 수정해야 합니다.',
  },
} as const;

export const ORDER_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '주문을 찾을 수 없습니다.',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 주문 상태입니다.',
  },
  ALREADY_CANCELED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 취소된 주문입니다.',
  },
  ALREADY_REFUNDED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불된 주문입니다.',
  },
} as const;

export const PAYMENT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '결제 정보를 찾을 수 없습니다.',
  },
  FAILED: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제에 실패했습니다.',
  },
  AMOUNT_MISMATCH: {
    status: HttpStatus.BAD_REQUEST,
    message: '결제 금액이 일치하지 않습니다.',
  },
  ALREADY_CONFIRMED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 결제입니다.',
  },
} as const;

export const REFUND_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '환불 정보를 찾을 수 없습니다.',
  },
  ALREADY_REQUESTED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 환불 요청된 주문입니다.',
  },
  INVALID_STATUS: {
    status: HttpStatus.BAD_REQUEST,
    message: '유효하지 않은 환불 상태입니다.',
  },
} as const;

export const CLIENT_PROFILE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '의뢰인 프로필을 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 클라이언트 프로필이 존재합니다.',
  },
  MIXED_SERVICE_GROUP: {
    status: HttpStatus.BAD_REQUEST,
    message: '관심 분야는 하나의 서비스 그룹에서만 선택할 수 있습니다.',
  },
} as const;

export const EXPERT_PROFILE_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '전문가 프로필을 찾을 수 없습니다.',
  },
  ALREADY_EXISTS: {
    status: HttpStatus.CONFLICT,
    message: '이미 전문가 프로필이 존재합니다.',
  },
  MIXED_SERVICE_GROUP: {
    status: HttpStatus.BAD_REQUEST,
    message: '전문 분야는 하나의 서비스 그룹에서만 선택할 수 있습니다.',
  },
} as const;

export const PORTFOLIO_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '포트폴리오를 찾을 수 없습니다.',
    code: 'PORTFOLIO_NOT_FOUND',
  },
  MAIN_IMAGE_REQUIRED: {
    status: HttpStatus.BAD_REQUEST,
    message: '메인 이미지는 정확히 1개여야 합니다.',
    code: 'PORTFOLIO_MAIN_IMAGE_REQUIRED',
  },
  DETAIL_IMAGE_INVALID: {
    status: HttpStatus.BAD_REQUEST,
    message: '상세 이미지는 최소 1개, 최대 10개까지 등록할 수 있습니다.',
    code: 'PORTFOLIO_DETAIL_IMAGE_INVALID',
  },
  MISSING_STACK_TYPE: {
    status: HttpStatus.BAD_REQUEST,
    message:
      '디자인, 프론트엔드, 백엔드 각 기술 유형별로 최소 1개씩 입력해 주세요.',
    code: 'PORTFOLIO_MISSING_STACK_TYPE',
  },
} as const;

export const EXPERT_ERRORS = {
  NOT_FOUND: {
    status: HttpStatus.NOT_FOUND,
    message: '전문가를 찾을 수 없습니다.',
  },
  NOT_APPROVED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인되지 않은 전문가입니다.',
  },
  ALREADY_APPROVED: {
    status: HttpStatus.BAD_REQUEST,
    message: '이미 승인된 전문가입니다.',
  },
  REJECTED: {
    status: HttpStatus.FORBIDDEN,
    message: '승인이 거절된 전문가입니다.',
  },
} as const;
